"use client";

import { useContext, useEffect } from "react";
import { Rewards } from "../components/Rewards/Rewards";
import { AuthContext } from "../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchRewardsData } from "../utils/queryFunctions";
import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, network, isAuthenticated } = useContext(AuthContext);

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
      // TODO: Update with correct address according to network
      // 1. xverse and leather
      // 2. custom address
      if (isAuthenticated()) {
        return fetchRewardsData(
          // user?.btcAddress.p2wpkh.testnet || ""
          // "bc1qmv2pxw5ahvwsu94kq5f520jgkmljs3af8ly6tr",
          "1HZPdkmFNt53uYd9jihqL4B6YRy5MjVJNc",
          network,
          250
        );
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
