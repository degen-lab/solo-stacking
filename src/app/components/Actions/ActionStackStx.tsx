import { AuthContext } from "@/app/contexts/AuthContext";
import { getCurRewCycleFromData } from "@/app/utils/api";
import {
  stackStxAmountInput,
  stackStxNumCyclesInput,
  stackStxPoxAddrInput,
  userStateAtom,
} from "@/app/utils/atoms";
import BigNumber from "bignumber.js";
import { callStackStx } from "@/app/utils/contractCallUtils";
import { Button, Input } from "@nextui-org/react";
import { Pox4SignatureTopic } from "@stacks/stacking";
import { useAtom } from "jotai";
import { useTheme } from "next-themes";
import { useContext, useEffect, useState } from "react";
import {
  isValidBitcoinAddress,
  isValidNumCyclesAndMessage,
  isValidStackStxAmount,
} from "@/app/utils/validatorUtils";
import CustomErrorMessage from "../ErrorMessage/CustomErrorMessage";
import type { AllData } from "@/app/utils/queryFunctions";

export const ActionStackStx: React.FC<{
  data: AllData;
}> = ({ data }) => {
  const { theme } = useTheme();
  const { btcAddress, network, btcNetwork } = useContext(AuthContext);
  const [, setUserState] = useAtom(userStateAtom);

  const [stackStxAmountSTX, setStackStxAmountSTX] =
    useAtom(stackStxAmountInput);

  const [stackStxNumCycles, setStackStxNumCycles] = useAtom(
    stackStxNumCyclesInput
  );

  const [stackStxPoxAddr, setStackStxPoxAddr] = useAtom(stackStxPoxAddrInput);

  const [touchedAmount, setTouchedAmount] = useState<boolean>(false);
  const [touchedCycles, setTouchedCycles] = useState<boolean>(false);
  const [touchedPoxAddr, setTouchedPoxAddr] = useState<boolean>(false);

  useEffect(() => {
    if (btcAddress) setStackStxPoxAddr(btcAddress);
  }, [btcAddress, network, setStackStxPoxAddr]);

  const showStackStxAmountError = () => {
    return (
      touchedAmount && !isValidStackStxAmount(stackStxAmountSTX, data).valid
    );
  };

  const showNumCyclesError = () => {
    return (
      touchedCycles &&
      !isValidNumCyclesAndMessage(stackStxNumCycles, data).valid
    );
  };

  const showPoxAddrError = () => {
    return (
      touchedPoxAddr && !isValidBitcoinAddress(stackStxPoxAddr, btcNetwork)
    );
  };

  const isButtonDisabled = () =>
    !isValidStackStxAmount(stackStxAmountSTX, data).valid ||
    !isValidNumCyclesAndMessage(stackStxNumCycles, data).valid ||
    !isValidBitcoinAddress(stackStxPoxAddr, btcNetwork);

  const curRewCycle = getCurRewCycleFromData(data);
  if (curRewCycle === null) throw new Error("No current reward cycle found");

  const clearState = () => {
    setStackStxAmountSTX(BigNumber(0));
    setStackStxNumCycles(0);
    setStackStxPoxAddr("");
    setTouchedAmount(false);
    setTouchedCycles(false);
    setTouchedPoxAddr(false);
    setUserState("StackingMempool");
  };

  const handleStackButtonClick = () => {
    if (!isButtonDisabled()) {
      callStackStx(
        Pox4SignatureTopic.StackStx,
        stackStxPoxAddr,
        stackStxNumCycles,
        stackStxAmountSTX,
        network,
        data,
        () => clearState()
      );
    }
  };

  return (
    <div className="text-left p-8">
      <h1 className="font-extrabold mb-8 text-center">Stack</h1>
      <p className="text-lg font-bold mb-4 text-center">Stacked amount (STX)</p>
      <div className="flex flex-col items-center w-full">
        <Input
          type="number"
          variant="bordered"
          className="mb-4 w-[75%]"
          onWheel={(e) => e.currentTarget.blur()}
          onChange={(e) => {
            if (e.target.value === "") {
              setStackStxAmountSTX(BigNumber(0));
              setTouchedAmount(true);
              return;
            }
            setStackStxAmountSTX(BigNumber(e.target.value));
            setTouchedAmount(true);
          }}
        />
        {showStackStxAmountError() && (
          <CustomErrorMessage
            message={isValidStackStxAmount(stackStxAmountSTX, data).message}
          />
        )}
      </div>
      <p className="text-lg font-bold mb-4 text-center">
        Number of cycles to stack for
      </p>
      <div className="flex flex-col items-center w-full">
        <Input
          type="number"
          max={12}
          className="mb-4 w-[75%]"
          variant="bordered"
          onWheel={(e) => e.currentTarget.blur()}
          onChange={(e) => {
            if (e.target.value === "") {
              setStackStxNumCycles(0);
              setTouchedCycles(true);
              return;
            }
            setStackStxNumCycles(parseInt(e.target.value));
            setTouchedCycles(true);
          }}
        />
        {showNumCyclesError() && (
          <CustomErrorMessage
            message={
              isValidNumCyclesAndMessage(stackStxNumCycles, data).message
            }
          />
        )}
      </div>
      <p className="text-lg font-bold ml-2 mb-4 text-center">
        Bitcoin/PoX address to get the rewards
      </p>
      <div className="flex flex-col items-center w-full">
        <Input
          className="mb-4 w-[75%]"
          variant="bordered"
          defaultValue={btcAddress ? btcAddress : ""}
          onWheel={(e) => e.currentTarget.blur()}
          onChange={(e) => {
            setStackStxPoxAddr(e.target.value);
            setTouchedPoxAddr(true);
          }}
        />
        {showPoxAddrError() && (
          <CustomErrorMessage message={"Please use a valid Bitcoin address."} />
        )}
      </div>
      <div className="text-center">
        <Button
          disabled={isButtonDisabled()}
          className={
            theme === "light"
              ? "text-action-dark bg-action-light"
              : "text-action-light bg-action-dark"
          }
          onClick={handleStackButtonClick}
        >
          Stack
        </Button>
      </div>
    </div>
  );
};
