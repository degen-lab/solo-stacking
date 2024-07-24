import { MEMPOOL_URL_ADDRESS } from "@/app/consts/api";
import { AuthContext } from "@/app/contexts/AuthContext";
import { getShortAddress, getShorterAddress } from "@/app/utils";
import {
  stackStxAmountInput,
  stackStxNumCyclesInput,
  stackStxPoxAddrInput,
} from "@/app/utils/atoms";
import { displayAmount } from "@/app/utils/displayUtils";
import { getStxThresholdFromData } from "@/app/utils/stacksUtils";
import { Link } from "@nextui-org/react";
import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useContext } from "react";
import type { PoxUserData } from "@/app/utils/queryFunctions";
import { PoxDetailsStructure } from "./PoxDetailsStructure";

export const AuthStackStxPoxDetails: React.FC<{ data: PoxUserData }> = ({
  data,
}) => {
  const { stxAddress: userAddress, network } = useContext(AuthContext);
  const [stackStxAmount] = useAtom(stackStxAmountInput);
  const [stackStxNumCycles] = useAtom(stackStxNumCyclesInput);
  const [stackStxPoxAddr] = useAtom(stackStxPoxAddrInput);
  const stxThreshold = getStxThresholdFromData(data);
  const slotsExpected = stackStxAmount
    .dividedBy(stxThreshold)
    .integerValue(BigNumber.ROUND_DOWN);

  const displayedStxAmount = stackStxAmount.isNaN()
    ? "0"
    : stackStxAmount.toString();
  const displaySlotsExpected =
    stackStxAmount.isNaN() || slotsExpected.lt(1)
      ? "0"
      : slotsExpected.toString();

  const currentCycle = data.poxInfo.current_cycle.id;
  return (
    <PoxDetailsStructure title="Overview">
      <div className="font-bold text-lg">You will lock:</div>
      <div>
        <span className="font-bold text-lg">Amount Locked: </span>
        {`${displayAmount(displayedStxAmount.toString())} STX`}
      </div>
      <div>
        <span className="font-bold text-lg">Reward Slots Expected: </span>
        {displaySlotsExpected}
      </div>
      <div>
        <span className="font-bold text-lg">Cycles: </span>
        {stackStxNumCycles}
      </div>
      <div>
        <span className="font-bold text-lg">Stacks Address: </span>
        <br />
        {getShorterAddress(userAddress ? userAddress : "")}
      </div>
      <div>
        <span className="font-bold text-lg">Bitcoin Address: </span>
        <br />
        <Link
          href={MEMPOOL_URL_ADDRESS(network, stackStxPoxAddr)}
          target="_blank"
        >
          {getShortAddress(stackStxPoxAddr)}
        </Link>
      </div>
      <div>
        <span className="font-bold text-lg">Current Cycle: </span>
        {currentCycle}
      </div>
    </PoxDetailsStructure>
  );
};
