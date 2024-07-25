import { AuthContext } from "@/app/contexts/AuthContext";
import {
  openExtendPage,
  openIncreasePage,
  userStateAtom,
} from "@/app/utils/atoms";
import { checkIsStackingInProgress } from "@/app/utils/userStateUtils";
import { useAtom } from "jotai";
import { useContext, useEffect } from "react";
import { NoAuthPoxDetails } from "./NoAuthPoxDetails";
import { AuthStackStxPoxDetails } from "./AuthStackStxDetails";
import { AlreadyStacking } from "./AlreadyStacking";
import { StackIncreaseDetails } from "./StackIncreaseDetails";
import { StackExtendDetails } from "./StackExtendDetails";
import type { PoxUserData } from "@/app/utils/queryFunctions";
import { StackingMempool } from "./StackingMempool";

export const DisplayedPoxDetails: React.FC<{
  data: PoxUserData;
}> = ({ data }) => {
  const { user, network, isAuthenticated } = useContext(AuthContext);

  const [userState, setUserState] = useAtom(userStateAtom);
  const [increasePageOpen] = useAtom(openIncreasePage);
  const [extendPageOpen] = useAtom(openExtendPage);

  const mempoolTransactions = data.mempoolTransactions;
  const stackerInfo = data.stackerInfo;

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
  }, [user, data]);

  if (userState === "NoAuth") return <NoAuthPoxDetails data={data} />;

  if (userState === "StackStx") return <AuthStackStxPoxDetails data={data} />;

  if (userState === "StackingMempool") return <StackingMempool data={data} />;

  if (userState === "StackingConfirmed" && !increasePageOpen && !extendPageOpen)
    return <AlreadyStacking data={data} />;

  if (userState === "StackingConfirmed" && increasePageOpen)
    return <StackIncreaseDetails data={data} />;

  if (userState === "StackingConfirmed" && extendPageOpen)
    return <StackExtendDetails data={data} />;

  if (userState === "StackingConfirmed" && increasePageOpen && extendPageOpen) {
    throw new Error("Invalid state: both increase and extend pages open");
  }
};
