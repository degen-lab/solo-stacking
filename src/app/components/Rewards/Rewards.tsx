import {
  fetchActivationBurnchainBlockHeight,
  fetchCurrentBurnchainBlockHeight,
} from "@/app/utils/api";
import React, { useEffect, useState } from "react";
import { Network } from "@/app/contexts/AuthContext";

export const Rewards = () => {
  const network = (process.env.NEXT_PUBLIC_NETWORK ||
    "mainnet") as unknown as Network;
  const [activationBurnchainBlockHeight, setActivationBurnchainBlockHeight] =
    useState(null);
  const [currentBurnchainBlockHeight, setCurrentBurnchainBlockHeight] =
    useState(null);

  useEffect(() => {
    const getActivationBurnchainBlockHeight = async () => {
      const height = await fetchActivationBurnchainBlockHeight(network);
      setActivationBurnchainBlockHeight(height);
    };

    getActivationBurnchainBlockHeight();
  }, [network]);

  // get currentBlockHeight
  useEffect(() => {
    const getCurrentBurnchainBlockHeight = async () => {
      const height = await fetchCurrentBurnchainBlockHeight(network);
      setCurrentBurnchainBlockHeight(height);
    };

    getCurrentBurnchainBlockHeight();
  }, [network]);

  // const { data, error, isLoading } = useQuery({
  //   queryKey: ["user-data", user?.stxAddress ? user.stxAddress : null, network],
  //   queryFn: () => fetchActivationBurnchainBlockHeight(network),
  //   refetchInterval: 10000,
  // });
  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error loading data</div>;

  // what was actually rewarded
  // ❯ curl -X GET "https://api.mainnet.hiro.so/extended/v1/burnchain/reward_slot_holders/1HZPdkmFNt53uYd9jihqL4B6YRy5MjVJNc"
  // API_PRACTICAL_REWARDS_POX_URL() connected address
  // how to go? while current > activation
    // fetch limit starting from current
    // current - limit
    // add values to list[]
    

  // what should have been rewarded
  // ❯ curl -X GET "https://api.mainnet.hiro.so/extended/v1/burnchain/rewards/1HZPdkmFNt53uYd9jihqL4B6YRy5MjVJNc"

  return (
    <div>
      <h1>Rewards</h1>
      <p>
        This rewards include all the sats earned through Stacking starting with
        POX-4 from all the stacking methods
      </p>
      <div>
        Activation Burnchain Block Height: {activationBurnchainBlockHeight}
      </div>
      <div>Current Burnchain Block Height: {currentBurnchainBlockHeight}</div>
      {/* Render additional data here */}
    </div>
  );
};
