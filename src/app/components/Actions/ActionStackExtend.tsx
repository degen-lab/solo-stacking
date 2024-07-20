import { openExtendPage, stackExtendCyclesInput } from "@/app/utils/atoms";
import { Button, Input } from "@nextui-org/react";
import { useAtom } from "jotai";
import { useTheme } from "next-themes";
import {
  getLockedUstxFromData,
  getStxFromUstxBN,
} from "@/app/utils/stacksUtils";
import { displayAmount } from "@/app/utils/displayUtils";
import type { AllData } from "@/app/utils/queryFunctions";

export const ActionStackExtend: React.FC<{ data: AllData }> = ({ data }) => {
  const { theme } = useTheme();
  const [, setOpenExtendPage] = useAtom(openExtendPage);
  const [, setStackExtendCycles] = useAtom(stackExtendCyclesInput);
  const currentlyStacking = getLockedUstxFromData(data);
  if (currentlyStacking === undefined)
    throw new Error("No locked amount found in data");
  const currentlyStackingStx = getStxFromUstxBN(currentlyStacking);

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
      <Input
        type="number"
        max={12}
        variant="bordered"
        className="mb-4"
        onChange={(e) => setStackExtendCycles(parseInt(e.target.value))}
      />
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
