"use client";
import { AuthContext } from "@/app/contexts/AuthContext";
import { fetchPoxUserData } from "@/app/utils/queryFunctions";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { DisplayedPoxDetails } from "../Details/Details";
import { ActionContainer } from "../Actions/Actions";
import { checkIsStackingInProgress } from "@/app/utils/userStateUtils";
import {
  extendUserStateAtom,
  increaseUserStateAtom,
  openExtendPage,
  openIncreasePage,
  userStateAtom,
} from "@/app/utils/atoms";
import { useAtom } from "jotai";
import type { PoxUserData } from "@/app/utils/queryFunctions";
import BigNumber from "bignumber.js";
import { Spinner } from "@nextui-org/react";

export const Landing: React.FC = () => {
  const { user, network, stxAddress: userAddress } = useContext(AuthContext);

  const { data, error, isLoading } = useQuery({
    queryKey: ["user-data", user?.stxAddress ? user.stxAddress : null, network],
    queryFn: () => fetchPoxUserData(userAddress, network),
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  return (
    <div className="flex flex-row justify-center items-center lg:h-screen w-full">
      {isLoading && (
        <div className="flex h-screen justify-center">
          <Spinner label="Loading" color="primary" labelColor="foreground" />
        </div>
      )}
      {error && <p>Error retrieving user data</p>}
      {data && <Scenario data={data} />}
    </div>
  );
};

export const Scenario: React.FC<{ data: PoxUserData }> = ({ data }) => {
  const { isAuthenticated, user, network } = useContext(AuthContext);

  const [userState, setUserState] = useAtom(userStateAtom);
  const [, setIncreaseUserState] = useAtom(increaseUserStateAtom);
  const [, setExtendUserState] = useAtom(extendUserStateAtom);

  const [, setCurrentExtendCount] = useState<number>(0);
  const [, setCurrentIncreaseAmount] = useState<BigNumber>(BigNumber(0));

  const [increasePageOpen] = useAtom(openIncreasePage);
  const [extendPageOpen] = useAtom(openExtendPage);
  const mempoolTransactions = data.mempoolTransactions;
  const stackerInfo = data.stackerInfo;

  const getUserIncreaseState = () => {
    setCurrentIncreaseAmount(BigNumber(0));
    setIncreaseUserState("None");

    if (data.mempoolIncrease.gt(0)) {
      setCurrentIncreaseAmount(data.mempoolIncrease);
      setIncreaseUserState("IncreaseMempool");
    }
  };

  const getUserExtendState = () => {
    setCurrentExtendCount(0);
    setExtendUserState("None");

    if (data.mempoolExtend > 0) {
      setCurrentExtendCount(data.mempoolExtend);
      setExtendUserState("ExtendMempool");
    }
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
        setUserState("StackingMempool");
      } else if (stackerInfo !== null) {
        setUserState("StackingConfirmed");
      }
    }
  };

  useEffect(() => {
    getUserState();
    getUserIncreaseState();
    getUserExtendState();
  }, [user, data, data.mempoolExtend, data.mempoolIncrease]);

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
