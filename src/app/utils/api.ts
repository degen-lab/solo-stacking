import axios from "axios";
import {
  API_BALANCES_URL,
  API_MEMPOOL_TRANSACTIONS_URL,
  API_POX_INFO_URL,
  API_STACKER_INFO_URL,
} from "../consts/api";
import { cvToHex, cvToJSON, hexToCV, principalCV } from "@stacks/transactions";
import { Network } from "../contexts/AuthContext";
import type { AllData } from "./queryFunctions";

export const fetchPoxInfo = async (network: Network): Promise<any> => {
  try {
    const response = await axios.get(API_POX_INFO_URL(network));

    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        return fetchPoxInfo(network);
      } else {
        console.error(`Error fetching PoX info: ${error}`);
      }
    } else {
      console.error(`Error fetching PoX info: ${error}`);
    }
    return null;
  }
};

export const fetchBalances = async (
  address: string,
  network: Network
): Promise<any> => {
  try {
    const response = await axios.get(API_BALANCES_URL(address, network));

    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        return fetchBalances(address, network);
      } else {
        console.error(`Error fetching balances info: ${error}`);
      }
    } else {
      console.error(`Error fetching balances info: ${error}`);
    }
    return null;
  }
};

export const fetchMempoolTransactions = async (
  address: string,
  network: Network
): Promise<any> => {
  try {
    const response = await axios.get(
      API_MEMPOOL_TRANSACTIONS_URL(address, network)
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        return fetchMempoolTransactions(address, network);
      } else {
        console.error(`Error fetching mempool transactions: ${error}`);
      }
    } else {
      console.error(`Error fetching mempool transactions: ${error}`);
    }
    return null;
  }
};

export const fetchStackerInfo = async (
  address: string,
  network: Network
): Promise<any> => {
  try {
    const data = JSON.stringify({
      sender: address,
      arguments: [cvToHex(principalCV(address))],
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: API_STACKER_INFO_URL(network),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);

    return cvToJSON(hexToCV(response.data.result)).value;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        return fetchStackerInfo(address, network);
      } else {
        console.error(`Error fetching stacker info: ${error}`);
      }
    } else {
      console.error(`Error fetching stacker info: ${error}`);
    }
    return null;
  }
};

/**
 * Parse network to use in API calls
 * @param {"nakamoto-testnet" | "testnet" | "mainnet"} network
 * @returns
 */
export const parseNetwork = (
  network: "nakamoto-testnet" | "testnet" | "mainnet"
) => (network === "nakamoto-testnet" ? "nakamoto.testnet" : network);

export const getCurRewCycleFromData = (data: AllData) => {
  if (!data) return null;
  return data.poxInfo.current_cycle.id;
};
