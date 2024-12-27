import 'viem/window';
import { createPublicClient, getContract, Hex, http } from 'viem';

import { defaultChain } from './chain';
import NodeRegistryJSON from '../../abis/NodeRegistry.json';

const NODE_REGISTRY_ADDRESS = defaultChain.contracts.nodeRegistry.address;
const NODE_REGISTRY_ABI = NodeRegistryJSON.abi;

export const getRegisteredComputeNode = async (): Promise<{
  nodePubkey: Hex;
}> => {
  if (!window.ethereum) {
    throw new Error('Please connect wallet first');
  }

  try {
    const publicClient = createPublicClient({
      chain: defaultChain,
      transport: http()
    });

    const nodeRegistry = getContract({
      address: NODE_REGISTRY_ADDRESS,
      abi: NODE_REGISTRY_ABI,
      client: {
        public: publicClient
      }
    });

    const nodePubkey = (await nodeRegistry.read.computeNodesAt([0])) as Hex;
    console.log(`compute node pubkey ${nodePubkey}`);

    return { nodePubkey };
  } catch (error: any) {
    console.error(`Failed to get registered compute node: ${error}`);
    throw new Error(
      error.message || `Failed to get registered compute node from contract`
    );
  }
};
