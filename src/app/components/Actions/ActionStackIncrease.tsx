import {
  increaseUserStateAtom,
  openIncreasePage,
  stackIncreaseAmountInput,
} from "@/app/utils/atoms";
import BigNumber from "bignumber.js";
import { Button, Input } from "@nextui-org/react";
import { useAtom } from "jotai";
import { useTheme } from "next-themes";
import {
  getLockedUstxFromData,
  getStxFromUstxBN,
} from "@/app/utils/stacksUtils";
import { displayAmount } from "@/app/utils/displayUtils";
import type { AllData } from "@/app/utils/queryFunctions";
import { useContext, useState } from "react";
import { isValidStackIncreaseAmount } from "@/app/utils/validatorUtils";
import { callStackIncrease } from "@/app/utils/contractCallUtils";
import { Pox4SignatureTopic } from "@stacks/stacking";
import { AuthContext } from "@/app/contexts/AuthContext";
import CustomErrorMessage from "../ErrorMessage/CustomErrorMessage";

export const ActionStackIncrease: React.FC<{ data: AllData }> = ({ data }) => {
  const { theme } = useTheme();
  const { network } = useContext(AuthContext);

  const [, setIncreaseUserState] = useAtom(increaseUserStateAtom);
  const [, setOpenIncreasePage] = useAtom(openIncreasePage);
  const [stackIncreaseAmount, setStackIncreaseAmount] = useAtom(
    stackIncreaseAmountInput
  );

  const [touchedAmount, setTouchedAmount] = useState<boolean>(false);

  const currentlyStacking = getLockedUstxFromData(data);

  if (currentlyStacking === undefined)
    throw new Error("No locked amount found in data");

  const currentlyStackingStx = getStxFromUstxBN(currentlyStacking);

  const showErrorMessage = () => {
    return (
      touchedAmount &&
      !isValidStackIncreaseAmount(stackIncreaseAmount, data).valid
    );
  };

  const clearState = () => {
    setStackIncreaseAmount(BigNumber(0));
    setTouchedAmount(false);
    setOpenIncreasePage(false);
    setIncreaseUserState("IncreaseMempool");
  };

  const handleStackIncreaseClick = () => {
    if (isValidStackIncreaseAmount(stackIncreaseAmount, data).valid) {
      callStackIncrease(
        Pox4SignatureTopic.StackIncrease,
        data,
        stackIncreaseAmount,
        network,
        () => clearState()
      );
    }
  };

  return (
    <div className="text-left p-8">
      <h1 className="font-extrabold mb-8 text-center">Increase Stack</h1>
      <p className="text-lg font-bold mb-4 text-center">
        {`You are currently stacking ${displayAmount(
          currentlyStackingStx.toString()
        )} STX`}
      </p>
      <p className="text-lg font-bold mb-4 text-center">
        Insert how much to add to the current stacking amount
      </p>
      <div className="flex flex-col items-center w-full">
        <Input
          type="number"
          className="mb-4 w-[75%]"
          variant="bordered"
          onWheel={(e) => e.currentTarget.blur()}
          onChange={(e) => {
            setStackIncreaseAmount(BigNumber(e.target.value));
            setTouchedAmount(true);
          }}
        />
        {showErrorMessage() && (
          <CustomErrorMessage
            message={
              isValidStackIncreaseAmount(stackIncreaseAmount, data).message
            }
          />
        )}
      </div>
      <div className="flex flex-col p-8">
        <div className="flex flex-col w-full text-center">
          <div className="w-full">
            <Button
              disabled={
                !isValidStackIncreaseAmount(stackIncreaseAmount, data).valid
              }
              className={
                theme === "light"
                  ? "text-action-dark bg-action-light mb-4 w-[8rem]"
                  : "text-action-light bg-action-dark mb-4 w-[8rem]"
              }
              onClick={() => handleStackIncreaseClick()}
            >
              Increase
            </Button>
          </div>
          <div className="w-full">
            <Button
              className={
                theme === "light"
                  ? "text-action-dark bg-action-light mb-4 w-[8rem]"
                  : "text-action-light bg-action-dark mb-4 w-[8rem]"
              }
              onClick={() => setOpenIncreasePage(false)}
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
