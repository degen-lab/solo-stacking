"use client";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Network } from "./AuthContext";

interface NetworkContextInterface {
  network: Network;
  networksList: Network[];
  updateNetwork: (newNetwork: Network) => void;
}
const NetworkContext = createContext<NetworkContextInterface>(
  {} as NetworkContextInterface
);

export const NetworkProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [network, setNetwork] = useState<Network>("mainnet");

  const networksList: Network[] = ["mainnet", "testnet", "nakamoto-testnet"];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedNetwork = (localStorage.getItem("network") ||
        "mainnet") as Network;
      setNetwork(savedNetwork);
    }
  }, []);

  const updateNetwork = (newNetwork: Network) => {
    setNetwork(newNetwork);
    if (typeof window !== "undefined") {
      localStorage.setItem("network", newNetwork);
    }
  };

  return (
    <NetworkContext.Provider value={{ network, networksList, updateNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
