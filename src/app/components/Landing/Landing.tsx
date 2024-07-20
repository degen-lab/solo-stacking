"use client";

import { AuthContext } from "@/app/contexts/AuthContext";
import { fetchData } from "@/app/utils/queryFunctions";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { DisplayedPoxDetails } from "../Details/Details";
import { ActionContainer } from "../Actions/Actions";
import {
  checkIsExtendInProgress,
  checkIsIncreaseInProgress,
  checkIsStackingInProgress,
} from "@/app/utils/userStateUtils";
import {
  extendUserStateAtom,
  increaseUserStateAtom,
  openExtendPage,
  openIncreasePage,
  userStateAtom,
} from "@/app/utils/atoms";
import { useAtom } from "jotai";
import type { AllData } from "@/app/utils/queryFunctions";

export const Landing: React.FC = () => {
  const { user, network, stxAddress: userAddress } = useContext(AuthContext);

  const { data, error, isLoading } = useQuery({
    queryKey: ["user-data", user?.stxAddress ? user.stxAddress : null, network],
    queryFn: () => fetchData(userAddress, network),
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  return (
    <div className="flex flex-row justify-center items-center lg:h-screen w-full">
      {isLoading && <p>Loading...</p>}
      {error && <p>Error retrieving user data</p>}
      {data && <Scenario data={data} />}
    </div>
  );
};

export const Scenario: React.FC<{ data: AllData }> = ({ data }) => {
  const { isAuthenticated, user, network } = useContext(AuthContext);

  // TODO: maybe check other mempool transactions to see if increase/extend are completed
  const [userState, setUserState] = useAtom(userStateAtom);
  const [, setIncreaseUserState] = useAtom(increaseUserStateAtom);
  const [, setExtendUserState] = useAtom(extendUserStateAtom);

  const [, setCurrentExtendCount] = useState<number>(0);
  const [, setCurrentIncreaseAmount] = useState<number>(0);

  const [increasePageOpen] = useAtom(openIncreasePage);
  const [extendPageOpen] = useAtom(openExtendPage);
  const mempoolTransactions = data.mempoolTransactions;
  const stackerInfo = data.stackerInfo;

  const getUserIncreaseState = () => {
    const checkIncreaseTransaction = checkIsIncreaseInProgress(
      mempoolTransactions,
      network
    );

    setCurrentIncreaseAmount(0);
    setIncreaseUserState("None");

    if (checkIncreaseTransaction.result === true) {
      // setIsIncreaseEnabledMessage(
      //   `A stack-increase transaction is already in mempool. Amount to increase: ${(
      //     (checkIncreaseTransaction.increaseAmount || 0) / 1000000
      //   ).toLocaleString(undefined, {
      //     maximumFractionDigits: 2,
      //   })} STX. Txid: ${checkIncreaseTransaction.txid}`
      // );
      setCurrentIncreaseAmount(checkIncreaseTransaction.increaseAmount || 0);
      setIncreaseUserState("IncreaseMempool");
    }
    // else if (stackIncreaseAmount === 0) {
    //   setIncreaseUserState("None");
    // }
  };
  const getUserExtendState = () => {
    // extend
    const checkExtendTransaction = checkIsExtendInProgress(
      mempoolTransactions,
      network
    );

    setCurrentExtendCount(0);
    setIncreaseUserState("None");

    if (checkExtendTransaction.result === true) {
      // setIsExtendEnabledMessage(
      //   `A stack-extend transaction is already in mempool. Number of cycles to extend: ${checkExtendTransaction.extendCount}. Txid: ${checkExtendTransaction.txid}`
      // );
      setCurrentExtendCount(checkExtendTransaction.extendCount || 0);
      setExtendUserState("ExtendMempool");
    }
    // else if (stackExtendAmount === 0) {
    //   setExtendUserState("None");
    // }
  };
  const getUserState = () => {
    const checkStackingTransaction = checkIsStackingInProgress(
      mempoolTransactions,
      network
    );

    setUserState("StackStx");
    if (!isAuthenticated()) setUserState("NoAuth");
    else {
      if (checkStackingTransaction.result === true) {
        // Stacking transaction is in mempool
        setUserState("StackingMempool");
      } else if (stackerInfo !== null) {
        // Stacking transaction is confirmed
        setUserState("StackingConfirmed");
      }
    }
  };

  useEffect(() => {
    getUserState();
    getUserIncreaseState();
    getUserExtendState();
  }, [user]);

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center lg:h-screen w-full">
      {isAuthenticated() &&
        (increasePageOpen || extendPageOpen || userState === "StackStx") && (
          <div className="text-center min-w-[50%]">
            <ActionContainer data={data} />
          </div>
        )}
      <div className="flex w-full lg:h-screen justify-center items-center">
        <DisplayedPoxDetails data={data} />
      </div>
    </div>
  );
};
