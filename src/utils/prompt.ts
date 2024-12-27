import * as secp from '@noble/secp256k1';
import { getRegisteredComputeNode } from '../contracts/nodeRegistry';
import { getComplatedTaskResult, requestModel } from '../contracts/taskManager';
import { Hex } from 'viem';
import { getSharedSecret } from '@noble/secp256k1';
import { expand, extract } from '@noble/hashes/hkdf';
import { sha256 } from '@noble/hashes/sha256';
import { siv } from '@noble/ciphers/aes';

const MODEL_NAME: string = 'SmolLm-135M-Instruct';

export const sendPrompt = async (
  prompt: string
): Promise<{
  txHash: Hex;
  taskId: bigint;
  reqSk: Hex;
}> => {
  if (!window.ethereum) {
    throw new Error('Please connect wallet first');
  }

  try {
    const reqSk = secp.utils.randomPrivateKey();
    const computeNode = await getRegisteredComputeNode();
    const reqPubkey = Buffer.from(secp.getPublicKey(reqSk, true)).toString(
      'hex'
    );

    const sharedSecretKey = getSharedSecret(
      Buffer.from(reqSk).toString('hex'),
      computeNode.nodePubkey.substring(2),
      true
    );
    const prk = extract(sha256, sharedSecretKey.slice(1));
    const msgKey = expand(sha256, prk);
    const msgNonce = expand(sha256, prk, new TextEncoder().encode('msg nonce'));

    const cipher = siv(
      new Uint8Array(msgKey),
      new Uint8Array(msgNonce.subarray(0, 12))
    );
    const cipherText = cipher.encrypt(new TextEncoder().encode(prompt));

    const task = await requestModel(
      MODEL_NAME,
      `0x${Buffer.from(cipherText).toString('hex')}`,
      computeNode.nodePubkey,
      `0x${reqPubkey}`
    );

    return {
      txHash: task.txHash,
      taskId: task.taskId,
      reqSk: `0x${Buffer.from(reqSk).toString('hex')}`
    };
  } catch (error: any) {
    console.error('Failed to send prompt:', error);
    throw new Error(error.message || 'Failed to send prompt');
  }
};

export const getPromptReply = async (
  taskId: bigint,
  reqSk: Hex
): Promise<{ txHash: Hex; output: string }> => {
  if (!window.ethereum) {
    throw new Error('Please connect wallet first');
  }

  try {
    return await getComplatedTaskResult(taskId, reqSk);
  } catch (error: any) {
    console.error('Failed to send prompt:', error);
    throw new Error(error.message || 'Failed to send prompt');
  }
};
