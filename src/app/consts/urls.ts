export enum NetworkUsed {
  Mainnet = "mainnet",
  Testnet = "testnet",
  NakamotoTestnet = "nakamoto-testnet",
}

const networkFromEnv = process.env.NEXT_PUBLIC_NETWORK;

console.log("Current Network is: ", networkFromEnv);

if (
  !["mainnet", "testnet", "nakamoto-testnet"].includes(networkFromEnv as string)
) {
  throw new Error(`Invalid network: ${networkFromEnv}`);
}

export const NETWORK: NetworkUsed = networkFromEnv as NetworkUsed;

const API_CONFIG = {
  [NetworkUsed.Mainnet]: {
    GET_TRANSACTION_EXPLORER_URL(txid: string): string {
      return `https://explorer.hiro.so/txid/${txid}?chain=mainnet`;
    },
    GET_BITCOIN_ADDRESS_EXPLORER_URL(address: string): string {
      return `https://mempool.space/address/${address}`;
    },
    GET_STACKS_BLOCK_HASH_EXPLORER_URL(hash: string): string {
      return `https://explorer.hiro.so/block/${hash}?chain=mainnet`;
    },
    GET_STACKS_ADDRESS_EXPLORER_URL(address: string): string {
      return `https://explorer.hiro.so/address/${address}?chain=mainnet`;
    },
  },
  [NetworkUsed.Testnet]: {
    GET_TRANSACTION_EXPLORER_URL(txid: string): string {
      return `https://explorer.hiro.so/txid/${txid}?chain=testnet`;
    },
    GET_BITCOIN_ADDRESS_EXPLORER_URL(address: string): string {
      return `https://mempool.space/testnet/address/${address}`;
    },
    GET_STACKS_BLOCK_HASH_EXPLORER_URL(hash: string): string {
      return `https://explorer.hiro.so/block/${hash}?chain=testnet`;
    },
    GET_STACKS_ADDRESS_EXPLORER_URL(address: string): string {
      return `https://explorer.hiro.so/address/${address}?chain=testnet`;
    },
  },
  [NetworkUsed.NakamotoTestnet]: {
    GET_TRANSACTION_EXPLORER_URL(txid: string): string {
      return `https://explorer.hiro.so/txid/${txid}?chain=testnet&api=https://api.nakamoto.testnet.hiro.so`;
    },
    GET_BITCOIN_ADDRESS_EXPLORER_URL(address: string): string {
      return `https://mempool.space/testnet/address/${address}`; // TODO: replace this
    },

    GET_STACKS_BLOCK_HASH_EXPLORER_URL(hash: string): string {
      return `https://explorer.hiro.so/block/${hash}?chain=testnet&api=https://api.nakamoto.testnet.hiro.so`;
    },
    GET_STACKS_ADDRESS_EXPLORER_URL(address: string): string {
      return `https://explorer.hiro.so/address/${address}?chain=testnet&api=https://api.nakamoto.testnet.hiro.so`;
    },
  },
};

const currentConfig = API_CONFIG[NETWORK];

export const GET_TRANSACTION_EXPLORER_URL =
  currentConfig.GET_TRANSACTION_EXPLORER_URL;
export const GET_BITCOIN_ADDRESS_EXPLORER_URL =
  currentConfig.GET_BITCOIN_ADDRESS_EXPLORER_URL;
export const GET_STACKS_ADDRESS_EXPLORER_URL =
  currentConfig.GET_STACKS_ADDRESS_EXPLORER_URL;
export const GET_STACKS_BLOCK_HASH_EXPLORER_URL =
  currentConfig.GET_STACKS_BLOCK_HASH_EXPLORER_URL;
