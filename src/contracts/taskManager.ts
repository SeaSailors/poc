import "viem/window";
import {
  createPublicClient,
  createWalletClient,
  custom,
  getContract,
  Hex,
} from "viem";
import { getSharedSecret } from "@noble/secp256k1";

import { defaultChain } from "./chain";
import TaskManagerJSON from "../../abis/TaskManager.json";
import { siv } from "@noble/ciphers/aes";
import { sha256 } from "@noble/hashes/sha256";
import { expand, extract } from "@noble/hashes/hkdf";

const TASK_MANAGER_ADDRESS = defaultChain.contracts.taskManager.address;
const TASK_MANAGER_ABI = TaskManagerJSON.abi;

export const requestModel = async (
  modelName: string,
  encryptedPrompt: Hex,
  nodePubkey: Hex,
  reqPubkey: Hex,
): Promise<{
  txHash: Hex;
  taskId: bigint;
}> => {
  if (!window.ethereum) {
    throw new Error("Please connect wallet first");
  }

  console.log(`encrypted prompt ${encryptedPrompt} userPubkey ${reqPubkey}`);

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const publicClient = createPublicClient({
      chain: defaultChain,
      transport: custom(window.ethereum),
    });

    const walletClient = createWalletClient({
      account: accounts[0],
      chain: defaultChain,
      transport: custom(window.ethereum),
    });

    const taskManager = getContract({
      address: TASK_MANAGER_ADDRESS,
      abi: TASK_MANAGER_ABI,
      client: {
        public: publicClient,
        wallet: walletClient,
      },
    });

    const task = {
      modelName,
      userPubkey: reqPubkey,
      encryptedInput: encryptedPrompt,
    };

    const txHash = await taskManager.write.requestModel([task, nodePubkey]);
    await publicClient.waitForTransactionReceipt({ hash: txHash });
    console.log(`request model ${task.modelName} through tx ${txHash}`);

    const taskId = await taskManager.read.workingComputeNodes([nodePubkey]);

    return { txHash, taskId: <bigint>taskId };
  } catch (error: any) {
    console.error(`Failed to request model ${modelName}: ${error}`);
    throw new Error(
      error.message || `Failed to get request model ${modelName} from contract`,
    );
  }
};

export const getComplatedTaskResult = async (
  taskId: bigint,
  reqSeckey: Hex,
): Promise<{
  txHash: Hex;
  output: string;
  cipherText: Hex;
}> => {
  if (!window.ethereum) {
    throw new Error("Please connect wallet first");
  }

  try {
    const publicClient = createPublicClient({
      chain: defaultChain,
      transport: custom(window.ethereum),
    });

    const taskManager = getContract({
      address: TASK_MANAGER_ADDRESS,
      abi: TASK_MANAGER_ABI,
      client: {
        public: publicClient,
      },
    });

    let encryptedOutput;
    for (let i = 0; i < 10; i++) {
      const [cTaskId, _outputHash, _outputSignature, output, _dataNodePubKey] =
        (await taskManager.read.completedTasks([taskId])) as [
          bigint,
          Hex,
          Hex,
          Hex,
          Hex,
        ];
      if (cTaskId != 0n) {
        encryptedOutput = output;
        console.log(`encrypted output ${encryptedOutput}`);
        break;
      }
      console.log(`task ${cTaskId} isn't completed, wait 6s`);

      const sleep = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      await sleep(6000);
    }
    if (encryptedOutput == null) {
      throw new Error(`task ${taskId} isn't completed`);
    }

    const computeNodePk = (await taskManager.read.taskComputeNodePubkey([
      taskId,
    ])) as Hex;
    console.log(`compute node pk ${computeNodePk}`);

    const sharedSecretKey = getSharedSecret(
      reqSeckey.substring(2),
      computeNodePk.substring(2),
      true,
    );
    const prk = extract(sha256, sharedSecretKey.slice(1));
    const msgKey = expand(sha256, prk);
    const msgNonce = expand(sha256, prk, new TextEncoder().encode("msg nonce"));

    const cipher = siv(
      new Uint8Array(msgKey),
      new Uint8Array(msgNonce.subarray(0, 12)),
    );

    const bytes = cipher.decrypt(
      new Uint8Array(Buffer.from(encryptedOutput.substring(2), "hex")),
    );

    const blockNumber = await publicClient.getBlockNumber();
    const logs = await publicClient.getContractEvents({
      address: taskManager.address,
      abi: taskManager.abi,
      eventName: "TaskCompleted",
      args: {
        taskId,
      },
      fromBlock: blockNumber - 10n,
      toBlock: blockNumber,
      strict: true,
    });
    if (logs.length < 1) {
      throw new Error("complete task event not found");
    }

    return {
      txHash: logs[0].transactionHash,
      output: new TextDecoder("utf-8").decode(bytes),
      cipherText: encryptedOutput,
    };
  } catch (error: any) {
    console.error(`Failed to get completed task ${taskId}: ${error}`);
    throw new Error(
      error.message || `Failed to get completed task ${taskId} from contract`,
    );
  }
};
