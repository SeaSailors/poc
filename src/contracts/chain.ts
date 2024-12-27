import { defineChain } from 'viem';

export const saharaLocal = defineChain({
  id: 31303,
  name: 'Sahara Local',
  nativeCurrency: {
    decimals: 18,
    name: 'Sah',
    symbol: 'SAH'
  },
  rpcUrls: {
    default: {
      http: ['http://localhost:16161']
    },
    public: {
      http: ['http://localhost:16161']
    }
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'http://localhost:8080/' }
  },
  contracts: {
    taskManager: {
      address: '0x5fc8d32690cc91d4c39d9d3abcbd16989f875707'
    },
    nodeRegistry: {
      address: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0'
    }
  }
});

export const saharaDevnet = defineChain({
  id: 31303,
  name: 'Sahara Devnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Sah',
    symbol: 'SAH'
  },
  rpcUrls: {
    default: {
      http: ['https://dev-api.saharaa.info']
    },
    public: {
      http: ['https://dev-api.saharaa.info']
    }
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://dev-explorer.saharaa.info' }
  },
  contracts: {
    taskManager: {
      address: '0xfF97F780168EE77AFcC783B9F7A650A7E06a8aAB'
    },
    nodeRegistry: {
      address: '0x8E746C47CC77C0FB5bbDAb30ef5A7D6E20C61C72'
    }
  }
});

export const defaultChain = saharaDevnet;
