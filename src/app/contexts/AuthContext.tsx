"use client";
import {
  connect,
  disconnect,
  getLocalStorage,
  isConnected,
} from "@stacks/connect";
import { createContext, ReactNode } from "react";
import { useNetwork } from "./NetworkContext";
import { getUserAddress, getUserBtcAddress } from "../utils";

export type Network = "mainnet" | "nakamoto-testnet" | "testnet";

interface UserInterface {
  stxAddress: string | null;
  btcAddress: string | null;
}

interface AuthContextInterface {
  user?: UserInterface | null;
  network: Network;
  btcNetwork: "mainnet" | "testnet";
  stxAddress: string | null;
  btcAddress: string | null;
  walletProvider: string | undefined;
  isAuthenticated: () => boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextInterface>(
  {} as AuthContextInterface
);

const AuthContextProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { network } = useNetwork();
  const walletProvider = isConnected()
    ? (getLocalStorage() as any)?.selectedProvider || "unknown"
    : undefined;

  const isAuthenticated = () => {
    return isConnected();
  };

  const user = isAuthenticated()
    ? {
        stxAddress: getUserAddress(),
        btcAddress: getUserBtcAddress(),
      }
    : null;

  // FIXME: Currently all Stacks networks work with the mainnet Bitcoin network.
  // However, Leather wallet won't let you pick the correct Bitcoin network.
  const btcNetwork = network === "mainnet" ? "mainnet" : "testnet";

  const login = async () => {
    await connect({
      walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
      approvedProviderIds: [
        "LeatherProvider",
        "FordefiProvider.UtxoProvider",
        "WalletConnectProvider",
      ],
      network,
    });
  };

  const logout = async () => {
    await disconnect();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        stxAddress: user?.stxAddress || null,
        btcAddress: user?.btcAddress || null,
        network,
        btcNetwork,
        walletProvider,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContextProvider;
