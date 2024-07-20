import { StacksMainnet, StacksTestnet } from "@stacks/network";
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
  )}.hiro.so/v2/contracts/call-read/ST000000000000000000002AMW42H/pox-4/get-stacker-info`;

export const POX_4_CONTRACT_ADDRESS = (network: string) =>
  network === "mainnet"
    ? "SP000000000000000000002Q6VF78"
    : "ST000000000000000000002AMW42H";
export const POX_4_CONTRACT_NAME = "pox-4";

export const STACKS_NETWORK = (network: string) => {
  return network === "mainnet"
    ? new StacksMainnet()
    : network === "testnet"
    ? new StacksTestnet()
    : new StacksTestnet({ url: "https://api.nakamoto.testnet.hiro.so" });
};

export const MEMPOOL_URL_ADDRESS = (
  network: "nakamoto-testnet" | "testnet" | "mainnet",
  address: string
) =>
  network === "mainnet"
    ? `https://mempool.space/address/${address}`
    : `https://mempool.space/testnet/address/${address}`;
