import * as secp from "@noble/secp256k1";
import { getRegisteredComputeNode } from "../contracts/nodeRegistry";
import { getComplatedTaskResult, requestModel } from "../contracts/taskManager";
import { Hex } from "viem";
import { getSharedSecret } from "@noble/secp256k1";
import { expand, extract } from "@noble/hashes/hkdf";
import { sha256 } from "@noble/hashes/sha256";
import { siv } from "@noble/ciphers/aes";

const MODEL_NAME: string = "SmolLm-135M-Instruct";

export const encryptPrompt = async (
  prompt: string,
): Promise<{
  reqSk: Hex;
  reqPubkey: Hex;
  computeNodePubkey: Hex;
  cipherText: Hex;
}> => {
  try {
    const reqSk = secp.utils.randomPrivateKey();
    const computeNode = await getRegisteredComputeNode();
    const reqPubkey = Buffer.from(secp.getPublicKey(reqSk, true)).toString(
      "hex",
    );

    const sharedSecretKey = getSharedSecret(
      Buffer.from(reqSk).toString("hex"),
      computeNode.nodePubkey.substring(2),
      true,
    );
    const prk = extract(sha256, sharedSecretKey.slice(1));
    const msgKey = expand(sha256, prk);
    const msgNonce = expand(sha256, prk, new TextEncoder().encode("msg nonce"));

    const cipher = siv(
      new Uint8Array(msgKey),
      new Uint8Array(msgNonce.subarray(0, 12)),
    );
    const cipherText = cipher.encrypt(new TextEncoder().encode(prompt));

    return {
      reqSk: `0x${Buffer.from(reqSk).toString("hex")}`,
      reqPubkey: `0x${reqPubkey}`,
      computeNodePubkey: computeNode.nodePubkey,
      cipherText: `0x${Buffer.from(cipherText).toString("hex")}`,
    };
  } catch (error: any) {
    console.error("Failed to encrypt prompt:", error);
    throw new Error(error.message || "Failed to encrypt prompt");
  }
};

export const sendPrompt = async (
  reqPubkey: Hex,
  computeNodePubkey: Hex,
  cipherText: Hex,
): Promise<{
  txHash: Hex;
  taskId: bigint;
}> => {
  if (!window.ethereum) {
    throw new Error("Please connect wallet first");
  }

  try {
    const task = await requestModel(
      MODEL_NAME,
      cipherText,
      computeNodePubkey,
      reqPubkey,
    );

    return {
      txHash: task.txHash,
      taskId: task.taskId,
    };
  } catch (error: any) {
    console.error("Failed to send prompt:", error);
    throw new Error(error.message || "Failed to send prompt");
  }
};

export const getPromptReply = async (
  taskId: bigint,
  reqSk: Hex,
): Promise<{ txHash: Hex; output: string; cipherText: Hex }> => {
  if (!window.ethereum) {
    throw new Error("Please connect wallet first");
  }

  try {
    return await getComplatedTaskResult(taskId, reqSk);
  } catch (error: any) {
    console.error("Failed to send prompt:", error);
    throw new Error(error.message || "Failed to send prompt");
  }
};
