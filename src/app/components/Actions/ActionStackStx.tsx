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
import type { PoxUserData } from "@/app/utils/queryFunctions";
import { useDetailedView } from "@/app/contexts/DetailedViewContext";

export const ActionStackStx: React.FC<{
  data: PoxUserData;
}> = ({ data }) => {
  const { resolvedTheme: theme } = useTheme();
  const { btcAddress, network, btcNetwork } = useContext(AuthContext);
  const { detailedView } = useDetailedView();
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
  const isButtonDisabled = () => {
    return false;
  };
  // const isButtonDisabled = () =>
  //   !isValidStackStxAmount(stackStxAmountSTX, data).valid ||
  //   !isValidNumCyclesAndMessage(stackStxNumCycles, data).valid ||
  //   !isValidBitcoinAddress(stackStxPoxAddr, btcNetwork);

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
    <div className="p-8">
      {detailedView && (
        <div className="flex justify-center">
          <p className="text-md mb-4 text-center text-[#909090] w-[75%]">
            ℹ️ You are not stacking currently. Below are the fields required in
            order to stack.
          </p>
        </div>
      )}
      <h1 className="font-extrabold mb-8 text-center">Stack</h1>
      <p className="text-lg font-bold mb-4 text-center">Stacked amount (STX)</p>
      {detailedView && (
        <div className="flex justify-center">
          <p className="text-md mb-4 text-center text-[#909090] w-[75%]">
            You will earn one reward slot for every time you stack the minimum
            amount. Since this minimum can increase in steps of 10,000 STX each
            cycle, it’s a good idea to stack a bit extra to keep the same number
            of slots.
          </p>
        </div>
      )}
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
      {detailedView && (
        <div className="flex justify-center">
          <p className="text-md mb-4 text-center text-[#909090] w-[75%]">
            When you stack, you start earning rewards in the next reward cycle.
            You can add more funds or extend your stacking period before it ends
            to keep earning rewards without waiting for another cycle. If your
            stack expires, you can stack again, but your funds will be locked
            and won’t earn rewards until the cycle after the current one.
          </p>
        </div>
      )}
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
      {detailedView && (
        <div className="flex justify-center">
          <p className="text-md mb-4 text-center text-[#909090] w-[75%]">
            This is the Bitcoin address where you’ll receive rewards from the
            PoX mechanism. Rewards will be sent to this address as the cycle
            progresses.
          </p>
        </div>
      )}
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
            theme === "light" ? "text-white bg-black" : "text-black bg-white"
          }
          style={{ opacity: isButtonDisabled() ? "0.5" : "1" }}
          onClick={handleStackButtonClick}
        >
          Stack
        </Button>
      </div>
    </div>
  );
};
