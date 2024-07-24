"use client";

import { useContext } from "react";
import { Rewards } from "../components/Rewards/Rewards";
import { AuthContext } from "../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchRewardsData } from "../utils/queryFunctions";
import { Spinner } from "@nextui-org/react";

export default function Home() {
  const { user, network } = useContext(AuthContext);

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
    queryFn: () =>
      // TODO: Update with correct address according to network
      fetchRewardsData(
        // user?.btcAddress.p2wpkh.testnet || ""
        "bc1qmv2pxw5ahvwsu94kq5f520jgkmljs3af8ly6tr",
        network,
        250
      ),
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
  return <Rewards data={rewardsData} />;
}
