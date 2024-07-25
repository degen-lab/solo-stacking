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
    GET_BITCOIN_ADDRESS_EXPLORER_URL(address: string): string {
      return `https://mempool.space/address/${address}`;
    },
    GET_BITCOIN_BLOCK_HASH_EXPLORER_URL(hash: string): string {
      return `https://mempool.space/block/${hash}`;
    },
  },
  [NetworkUsed.Testnet]: {
    GET_BITCOIN_ADDRESS_EXPLORER_URL(address: string): string {
      return `https://mempool.space/testnet/address/${address}`;
    },
    GET_BITCOIN_BLOCK_HASH_EXPLORER_URL(hash: string): string {
      return `https://mempool.space/testnet/block/${hash}`;
    },
  },
  [NetworkUsed.NakamotoTestnet]: {
    // FIXME: currently the nakamoto is pointing to a regtest environment on bitcoin - no explorer links available
    GET_BITCOIN_ADDRESS_EXPLORER_URL(address: string): string {
      return `https://mempool.space/testnet/address/${address}`;
    },

    GET_BITCOIN_BLOCK_HASH_EXPLORER_URL(hash: string): string {
      return `https://mempool.space/testnet/block/${hash}`;
    },
  },
};

const currentConfig = API_CONFIG[NETWORK];

export const GET_BITCOIN_ADDRESS_EXPLORER_URL =
  currentConfig.GET_BITCOIN_ADDRESS_EXPLORER_URL;
export const GET_STACKS_BLOCK_HASH_EXPLORER_URL =
  currentConfig.GET_BITCOIN_BLOCK_HASH_EXPLORER_URL;
