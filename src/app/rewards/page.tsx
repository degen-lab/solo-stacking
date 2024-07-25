"use client";

import { useContext, useEffect } from "react";
import { Rewards } from "../components/Rewards/Rewards";
import { AuthContext } from "../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchRewardsData } from "../utils/queryFunctions";
import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { rewardsBtcAddressAtom } from "../utils/atoms";
import { isValidBitcoinAddress } from "../utils/validatorUtils";
import { useNetwork } from "../contexts/NetworkContext";

export default function Home() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { network } = useNetwork();
  const [rewardsBtcAddress] = useAtom<string>(rewardsBtcAddressAtom);

  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const {
    data: rewardsData,
    error,
    isLoading,
  } = useQuery({
    queryKey: [
      "rewards-data",
      user?.stxAddress ? user.stxAddress : null,
      network,
    ],
    queryFn: () => {
      if (
        isAuthenticated() &&
        rewardsBtcAddress !== "" &&
        isValidBitcoinAddress(
          rewardsBtcAddress,
          network === "nakamoto-testnet" ? "testnet" : network
        )
      ) {
        return fetchRewardsData(rewardsBtcAddress, network, 250);
      } else {
        return { theoreticalRewards: [], practicalRewards: [] };
      }
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen justify-center">
        <Spinner label="Loading" color="primary" labelColor="foreground" />
      </div>
    );
  }
  if (error) return <div>Error: {error.message}</div>;
  if (rewardsData === undefined) return null;
  return <Rewards rewardsData={rewardsData} />;
}
