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
  getStxFromUstxBN,
} from "@/app/utils/stacksUtils";
import { displayAmount } from "@/app/utils/displayUtils";
import type { AllData } from "@/app/utils/queryFunctions";
import { isValidStackExtendCount } from "@/app/utils/validatorUtils";
import CustomErrorMessage from "../ErrorMessage/CustomErrorMessage";
import { useContext, useState } from "react";
import { callStackExtend } from "@/app/utils/contractCallUtils";
import { Pox4SignatureTopic } from "@stacks/stacking";
import { AuthContext } from "@/app/contexts/AuthContext";

export const ActionStackExtend: React.FC<{ data: AllData }> = ({ data }) => {
  const { theme } = useTheme();
  const { network } = useContext(AuthContext);

  const [, setExtendUserState] = useAtom(extendUserStateAtom);
  const [, setOpenExtendPage] = useAtom(openExtendPage);
  const [stackExtendCycles, setStackExtendCycles] = useAtom(
    stackExtendCyclesInput
  );

  const [touchedAmount, setTouchedAmount] = useState<boolean>(false);

  const currentlyStacking = getLockedUstxFromData(data);

  if (currentlyStacking === undefined)
    throw new Error("No locked amount found in data");

  const currentlyStackingStx = getStxFromUstxBN(currentlyStacking);

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
      <h1 className="font-extrabold mb-8 text-center">Extend Stack</h1>
      <h1 className="text-lg font-bold mb-4 text-center">
        {`You are currently stacking ${displayAmount(
          currentlyStackingStx.toString()
        )} STX`}
      </h1>
      <p className="text-lg font-bold mb-4 text-center">
        Number of cycles to extend stack for
      </p>
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
                ? "text-action-dark bg-action-light mb-4 w-[8rem]"
                : "text-action-light bg-action-dark mb-4 w-[8rem]"
            }
            onClick={() => handleStackExtendClick()}
          >
            Extend
          </Button>
        </div>
        <div className="w-full">
          <Button
            className={
              theme === "light"
                ? "text-action-dark bg-action-light mb-4 w-[8rem]"
                : "text-action-light bg-action-dark mb-4 w-[8rem]"
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
