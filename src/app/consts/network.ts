import { Network } from "../contexts/AuthContext";

// TODO: update this if importing networks from somewhere else (e.g. Leather)
export const networkInfo: Record<Network, { title: string; url: string }> = {
  mainnet: {
    title: "Mainnet",
    url: "api.hiro.so",
  },
  testnet: {
    title: "Testnet",
    url: "api.testnet.hiro.so",
  },
  "nakamoto-testnet": {
    title: "Nakamoto Testnet",
    url: "api.nakamoto.testnet.hiro.so",
  },
};
