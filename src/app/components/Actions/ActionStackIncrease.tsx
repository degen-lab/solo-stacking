import { openIncreasePage, stackIncreaseAmountInput } from "@/app/utils/atoms";
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

export const ActionStackIncrease: React.FC<{ data: AllData }> = ({ data }) => {
  const { theme } = useTheme();
  const [, setOpenIncreasePage] = useAtom(openIncreasePage);
  const [, setStackIncreaseAmount] = useAtom(stackIncreaseAmountInput);
  const currentlyStacking = getLockedUstxFromData(data);
  if (currentlyStacking === undefined)
    throw new Error("No locked amount found in data");
  const currentlyStackingStx = getStxFromUstxBN(currentlyStacking);

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
      <Input
        type="number"
        className="mb-4"
        variant="bordered"
        onChange={(e) => setStackIncreaseAmount(BigNumber(e.target.value))}
      />{" "}
      <div className="flex flex-col p-8">
        <div className="flex flex-col w-full text-center">
          <div className="w-full">
            <Button
              //TODO: disable based on validation
              // disabled={}
              className={
                theme === "light"
                  ? "text-action-dark bg-action-light mb-4 w-[8rem]"
                  : "text-action-light bg-action-dark mb-4 w-[8rem]"
              }
              // TODO: stack-increase
              // onClick={()=> callStackIncrease(Pox4SignatureTopic.StackIncrease,data,)}
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
