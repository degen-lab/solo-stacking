import { Network } from "../contexts/AuthContext";

export const getShortestAddress = (
  address: string | undefined
): string | null => {
  if (!address) {
    return null;
  }

  const start = address.substring(0, 4),
    end = address.slice(-4);

  return `${start}...${end}`;
};

export const getShorterAddress = (address: string | undefined): string => {
  return address ? `${address.substring(0, 6)}...${address.slice(-6)}` : "";
};

export const getShortAddress = (address: string): string => {
  return `${address.substring(0, 8)}...${address.slice(-8)}`;
};

export const explorerTxUrl = (txid: string, network: Network): string => {
  if (network === "nakamoto-testnet")
    return `https://explorer.hiro.so/txid/${txid}?chain=testnet&api=https://api.nakamoto.testnet.hiro.so`;
  else return `https://explorer.hiro.so/txid/${txid}?chain=${network}`;
};

export const explorerAddressUrl = (
  address: string,
  network: Network
): string => {
  if (network === "nakamoto-testnet")
    return `https://explorer.hiro.so/address/${address}?chain=testnet&api=https://api.nakamoto.testnet.hiro.so`;
  else return `https://explorer.hiro.so/address/${address}?chain=${network}`;
};
