"use client";
import {
  connect,
  disconnect,
  getLocalStorage,
  isConnected,
} from "@stacks/connect";
import { createContext, ReactNode, useContext, useState } from "react";
import {
  detectNetworkFromAddress,
  getUserAddress,
  getUserBtcAddress,
} from "../utils";
import { isClientSide } from "../utils/ssr";

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
  isLoggingOut: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextInterface>(
  {} as AuthContextInterface
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthContextProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const walletProvider =
    isClientSide() && isConnected()
      ? (getLocalStorage() as any)?.selectedProvider || "unknown"
      : undefined;

  const user =
    isClientSide() && isConnected()
      ? {
          stxAddress: getUserAddress(),
          btcAddress: getUserBtcAddress(),
        }
      : null;

  const network = detectNetworkFromAddress(user?.stxAddress || null);

  // FIXME: Currently all Stacks networks work with the mainnet Bitcoin network.
  // However, Leather wallet won't let you pick the correct Bitcoin network.
  const btcNetwork = network === "mainnet" ? "mainnet" : "testnet";

  const login = async () => {
    try {
      await connect({
        walletConnectProjectId:
          process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
        approvedProviderIds: [
          "LeatherProvider",
          "XverseProviders.BitcoinProvider",
          "FordefiProvider.UtxoProvider",
        ],
      });
      if (isClientSide()) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await disconnect();
    } catch (error) {
      console.error("Error disconnecting:", error);
    } finally {
      setIsLoggingOut(false);
    }
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
        isAuthenticated: () => typeof window !== "undefined" && isConnected(),
        isLoggingOut,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
