import { parseNetwork } from "../utils/api";

export const API_BALANCES_URL = (
  address: string,
  network: "nakamoto-testnet" | "testnet" | "mainnet"
) =>
  `https://api.${parseNetwork(
    network
  )}.hiro.so/extended/v1/address/${address}/balances`;

export const API_POX_INFO_URL = (
  network: "nakamoto-testnet" | "testnet" | "mainnet"
) => `https://api.${parseNetwork(network)}.hiro.so/v2/pox`;

export const API_PRACTICAL_REWARDS_POX_URL = (
  address: string,
  network: "nakamoto-testnet" | "testnet" | "mainnet",
  offset: number,
  limit: number
) =>
  `https://api.${parseNetwork(
    network
  )}.hiro.so/extended/v1/burnchain/rewards/${address}?offset=${offset}&limit=${limit}`;

export const API_THEORETICAL_REWARDS_POX_URL = (
  address: string,
  network: "nakamoto-testnet" | "testnet" | "mainnet",
  offset: number,
  limit: number
) =>
  `https://api.${parseNetwork(
    network
  )}.hiro.so/extended/v1/burnchain/reward_slot_holders/${address}?offset=${offset}&limit=${limit}`;

export const API_MEMPOOL_TRANSACTIONS_URL = (
  address: string,
  network: "nakamoto-testnet" | "testnet" | "mainnet"
) =>
  `https://api.${parseNetwork(
    network
  )}.hiro.so/extended/v1/address/${address}/mempool?unanchored=true`;
export const API_STACKER_INFO_URL = (
  network: "nakamoto-testnet" | "testnet" | "mainnet"
) =>
  `https://api.${parseNetwork(
    network
  )}.hiro.so/v2/contracts/call-read/${POX_4_CONTRACT_ADDRESS(
    network
  )}/pox-4/get-stacker-info`;

export const POX_4_CONTRACT_ADDRESS = (network: string) =>
  network === "mainnet"
    ? "SP000000000000000000002Q6VF78"
    : "ST000000000000000000002AMW42H";
export const POX_4_CONTRACT_NAME = "pox-4";

export const MEMPOOL_URL_ADDRESS = (
  network: "nakamoto-testnet" | "testnet" | "mainnet",
  address: string
) =>
  network === "mainnet"
    ? `https://mempool.space/address/${address}`
    : `https://mempool.space/testnet/address/${address}`;

export const GET_BITCOIN_BLOCK_HASH_EXPLORER_URL = (
  network: "nakamoto-testnet" | "testnet" | "mainnet",
  hash: string
) =>
  network === "mainnet"
    ? `https://mempool.space/block/${hash}`
    : `https://mempool.space/testnet/block/${hash}`;
