import {
  extendUserStateAtom,
  openExtendPage,
  stackExtendCyclesInput,
} from "@/app/utils/atoms";
import { Button, Input } from "@nextui-org/react";
import { useAtom } from "jotai";
import { useTheme } from "next-themes";
import {
  getLockedUstxFromData,
  getPeriodFromData,
  // getStxFromUstxBN,
} from "@/app/utils/stacksUtils";
// import { displayAmount } from "@/app/utils/displayUtils";
import type { PoxUserData } from "@/app/utils/queryFunctions";
import { isValidStackExtendCount } from "@/app/utils/validatorUtils";
import CustomErrorMessage from "../ErrorMessage/CustomErrorMessage";
import { useContext, useState } from "react";
import { callStackExtend } from "@/app/utils/contractCallUtils";
import { Pox4SignatureTopic } from "@stacks/stacking";
import { AuthContext } from "@/app/contexts/AuthContext";
import { useDetailedView } from "@/app/contexts/DetailedViewContext";
import { getCurRewCycleFromData } from "@/app/utils/api";

export const ActionStackExtend: React.FC<{ data: PoxUserData }> = ({
  data,
}) => {
  const { resolvedTheme: theme } = useTheme();
  const { detailedView } = useDetailedView();
  const { network } = useContext(AuthContext);

  const [, setExtendUserState] = useAtom(extendUserStateAtom);
  const [, setOpenExtendPage] = useAtom(openExtendPage);
  const [stackExtendCycles, setStackExtendCycles] = useAtom(
    stackExtendCyclesInput
  );

  const [touchedAmount, setTouchedAmount] = useState<boolean>(false);

  const currentlyStacking = getLockedUstxFromData(data);
  const curRewCycle = getCurRewCycleFromData(data);
  const lockPeriod = getPeriodFromData(data);

  if (!curRewCycle) {
    throw new Error("No current reward cycle found in data");
  }

  if (currentlyStacking === undefined)
    throw new Error("No locked amount found in data");

  const firstRewardCycle = data.stackerInfo?.value["first-reward-cycle"].value
    ? parseInt(data.stackerInfo?.value["first-reward-cycle"].value)
    : 0;
  const stackingThisCycle = firstRewardCycle <= curRewCycle;

  const showErrorMessage = () => {
    return (
      touchedAmount && !isValidStackExtendCount(stackExtendCycles, data).valid
    );
  };

  const clearState = () => {
    setStackExtendCycles(0);
    setTouchedAmount(false);
    setOpenExtendPage(false);
    setExtendUserState("ExtendMempool");
  };

  const handleStackExtendClick = () => {
    if (!isValidStackExtendCount(stackExtendCycles, data).valid) {
      console.log("Invalid stack extend count");
      return;
    }
    callStackExtend(
      Pox4SignatureTopic.StackExtend,
      stackExtendCycles,
      data,
      network,
      () => clearState()
    );
  };

  return (
    <div className="text-left p-8">
      {detailedView && (
        <div className="flex justify-center">
          <p className="text-md mb-4 text-center text-[#909090] w-[75%]">
            ℹ️ You are currently stacking. You are eligible to extend your
            stacking period. Please complete the field below to proceed.
          </p>
        </div>
      )}
      <h1 className="font-extrabold mb-8 text-center">Extend Stack</h1>
      <h1 className="text-lg font-bold mb-4 text-center">
        {stackingThisCycle && lockPeriod > 1
          ? `You are stacking for this cycle and the next
         ${lockPeriod - 1}`
          : !stackingThisCycle && lockPeriod > 1
          ? `You are stacking for the next ${lockPeriod} cycles. This one won't gereate rewards.`
          : `Your stack will end after this cycle. Extend now to keep it active.`}
      </h1>
      <p className="text-lg font-bold mb-4 text-center">Extend count</p>
      {detailedView && (
        <div className="flex justify-center">
          <p className="text-md mb-4 text-center text-[#909090] w-[75%]">
            Enter the number of reward cycles you want to extend your stack
            with. This will keep your stack active for additional cycles without
            needing to start a new stack. You can see on the right side how many
            extra cycles you’ll cover. You can extend your stack for maximum 12
            cycles total.
          </p>
        </div>
      )}
      <div className="flex flex-col items-center w-full">
        <Input
          type="number"
          max={12}
          variant="bordered"
          className="mb-4 w-[75%]"
          onWheel={(e) => e.currentTarget.blur()}
          onChange={(e) => {
            setStackExtendCycles(parseInt(e.target.value));
            setTouchedAmount(true);
          }}
        />
        {showErrorMessage() && (
          <CustomErrorMessage
            message={isValidStackExtendCount(stackExtendCycles, data).message}
          />
        )}
      </div>
      <div className="flex flex-col w-full text-center">
        <div className="w-full">
          <Button
            disabled={!isValidStackExtendCount(stackExtendCycles, data).valid}
            className={
              theme === "light"
                ? "text-white bg-black mb-4 w-[8rem]"
                : "text-black bg-white mb-4 w-[8rem]"
            }
            style={{
              opacity: !isValidStackExtendCount(stackExtendCycles, data).valid
                ? "0.5"
                : "1",
            }}
            onClick={() => handleStackExtendClick()}
          >
            Extend
          </Button>
        </div>
        <div className="w-full">
          <Button
            className={
              theme === "light"
                ? "text-white bg-black mb-4 w-[8rem]"
                : "text-black bg-white mb-4 w-[8rem]"
            }
            onClick={() => setOpenExtendPage(false)}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};
