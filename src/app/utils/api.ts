import axios from "axios";
import {
  API_BALANCES_URL,
  API_MEMPOOL_TRANSACTIONS_URL,
  API_POX_INFO_URL,
  API_PRACTICAL_REWARDS_POX_URL,
  API_STACKER_INFO_URL,
  API_THEORETICAL_REWARDS_POX_URL,
} from "../consts/api";
import { cvToHex, cvToJSON, hexToCV, principalCV } from "@stacks/transactions";
import { Network } from "../contexts/AuthContext";
import type { PoxUserData } from "./queryFunctions";
import { POX_4_FIRST_BURN_HEIGHT } from "./stacksUtils";

/**
 * Reward slot holder on the burnchain
 */
export interface BurnchainRewardSlotHolder {
  canonical: boolean;
  burn_block_hash: string;
  burn_block_height: number;
  address: string;
  slot_index: number;
}

export interface BurnchainRewardSlotHolderListResponse {
  limit: number;
  offset: number;
  total: number;
  results: BurnchainRewardSlotHolder[];
}

/**
 * GET request that returns blocks
 */
export interface BurnchainRewardListResponse {
  limit: number;
  offset: number;
  results: BurnchainReward[];
}

/**
 * Reward payment made on the burnchain
 */
export interface BurnchainReward {
  canonical: boolean;
  burn_block_hash: string;
  burn_block_height: number;
  burn_amount: string;
  reward_recipient: string;
  reward_amount: string;
  reward_index: number;
}

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

export const fetchAllTheoreticalRewardsAndTotal = async (
  address: string,
  network: Network,
  limit: number
): Promise<{
  theoreticalRewardSlotsList: BurnchainRewardSlotHolder[];
  totalRewardSlots: number;
}> => {
  let offset = 0;

  const rewardsData = (
    await axios.get<BurnchainRewardSlotHolderListResponse>(
      API_THEORETICAL_REWARDS_POX_URL(address, network, offset, limit)
    )
  ).data;

  const totalRewardSolts = rewardsData.total;
  const theoreticalRewardSlotsList = [];

  while (totalRewardSolts > offset) {
    const response = await fetchTheoreticalRewards(
      address,
      network,
      limit,
      offset
    );

    if (response) {
      const roundResults: BurnchainRewardSlotHolder[] = [];
      response.results.forEach((result) => {
        if (!(result.burn_block_height > POX_4_FIRST_BURN_HEIGHT[network])) {
          return;
        }
        roundResults.push(result);
      });
      theoreticalRewardSlotsList.push(...roundResults);
    }
    offset += limit;
  }

  return { theoreticalRewardSlotsList, totalRewardSlots: totalRewardSolts };
};

export const fetchTheoreticalRewards = async (
  address: string,
  network: Network,
  limit: number,
  offset: number
): Promise<BurnchainRewardSlotHolderListResponse | null> => {
  try {
    const response = await axios.get(
      API_THEORETICAL_REWARDS_POX_URL(address, network, offset, limit)
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        return fetchTheoreticalRewards(address, network, limit, offset);
      } else {
        console.error(`Error fetching Theoretical Rewards: ${error}`);
      }
    } else {
      console.error(`Error fetching Theoretical Rewards: ${error}`);
    }
    return null;
  }
};

export const fetchAllPracticalRewards = async (
  address: string,
  network: Network,
  limit: number,
  maxRewardSlots: number
): Promise<BurnchainReward[]> => {
  let offset = 0;

  const rewardsData = (
    await axios.get<BurnchainRewardListResponse>(
      API_PRACTICAL_REWARDS_POX_URL(address, network, offset, limit)
    )
  ).data;

  console.log("rewards slots: ", rewardsData);
  const practicalRewardSlotsList = [];

  while (maxRewardSlots > offset) {
    const response = await fetchPracticalRewards(
      address,
      network,
      limit,
      offset
    );

    if (response) {
      const roundResults: BurnchainReward[] = [];
      response.results.forEach((result) => {
        if (!(result.burn_block_height > POX_4_FIRST_BURN_HEIGHT[network])) {
          return;
        }
        roundResults.push(result);
      });
      practicalRewardSlotsList.push(...roundResults);
    }
    offset += limit;
  }

  return practicalRewardSlotsList;
};

export const fetchPracticalRewards = async (
  address: string,
  network: Network,
  limit: number,
  offset: number
): Promise<BurnchainRewardListResponse | null> => {
  try {
    const response = await axios.get(
      API_PRACTICAL_REWARDS_POX_URL(address, network, offset, limit)
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        return fetchPracticalRewards(address, network, limit, offset);
      } else {
        console.error(`Error fetching Practical Rewards: ${error}`);
      }
    } else {
      console.error(`Error fetching Practical Rewards: ${error}`);
    }
    return null;
  }
};

export const fetchActivationBurnchainBlockHeight = async (
  network: Network
): Promise<any> => {
  try {
    const response = await axios.get(API_POX_INFO_URL(network));

    return response.data.contract_versions[3].activation_burnchain_block_height;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        return fetchActivationBurnchainBlockHeight(network);
      } else {
        console.error(
          `Error fetching Activation Burnchain Block Height: ${error}`
        );
      }
    } else {
      console.error(
        `Error fetching Activation Burnchain Block Height: ${error}`
      );
    }
    return null;
  }
};

export const fetchCurrentBurnchainBlockHeight = async (
  network: Network
): Promise<any> => {
  try {
    const response = await axios.get(API_POX_INFO_URL(network));

    return response.data.current_burnchain_block_height;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        return fetchActivationBurnchainBlockHeight(network);
      } else {
        console.error(
          `Error fetching Current Burnchain Block Height: ${error}`
        );
      }
    } else {
      console.error(`Error fetching Current Burnchain Block Height: ${error}`);
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

export const getCurRewCycleFromData = (data: PoxUserData) => {
  if (!data) return null;
  return data.poxInfo.current_cycle.id;
};
