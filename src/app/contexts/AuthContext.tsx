"use client";
import { AppConfig, showConnect, UserSession } from "@stacks/connect";
import { createContext, ReactNode } from "react";

export type Network = "mainnet" | "nakamoto-testnet" | "testnet";

interface UserInterface {
  stxAddress: {
    mainnet: string;
    testnet: string;
  };
  btcAddress: {
    p2tr: {
      mainnet: string;
      testnet: string;
      regtest: string;
      simnet: string;
    };
    p2wpkh: {
      mainnet: string;
      testnet: string;
      regtest: string;
      simnet: string;
    };
  };
}

interface AuthContextInterface {
  user?: UserInterface | null;
  network: Network;
  btcNetwork: "mainnet" | "testnet";
  userSession: UserSession;
  stxAddress: string | null;
  btcAddress: string | null;
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
  const appConfig = new AppConfig(["store_write", "publish_data"]);
  const network = (process.env.NEXT_PUBLIC_NETWORK || "mainnet") as Network;
  const userSession = new UserSession({ appConfig });

  const isAuthenticated = () => userSession.isUserSignedIn();

  const user = isAuthenticated()
    ? {
        stxAddress: userSession.loadUserData().profile.stxAddress,
        btcAddress: userSession.loadUserData().profile.btcAddress,
      }
    : null;

  const stxAddress = user
    ? user.stxAddress[network === "nakamoto-testnet" ? "testnet" : network]
    : null;

  const btcAddress = user
    ? user.btcAddress.p2wpkh[
        network === "nakamoto-testnet" ? "testnet" : network
      ]
    : null;

  // FIXME: Currently all Stacks networks work with the mainnet Bitcoin network.
  // However, Leather wallet won't let you pick the correct Bitcoin network.
  const btcNetwork = network === "mainnet" ? "mainnet" : "testnet";

  const login = () => {
    showConnect({
      appDetails: {
        name: "Degenlab Stacks Signer",
        icon: window.location.origin + "/stacks-logo",
      },
      redirectTo: "/",
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  };

  const logout = () => {
    userSession.signUserOut("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userSession,
        network,
        btcNetwork,
        stxAddress,
        btcAddress,
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
