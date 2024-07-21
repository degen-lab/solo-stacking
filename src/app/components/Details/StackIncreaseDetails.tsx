import { MEMPOOL_URL_ADDRESS } from "@/app/consts/api";
import { AuthContext } from "@/app/contexts/AuthContext";
import { getShortAddress, getShortestAddress } from "@/app/utils";
import { stackIncreaseAmountInput } from "@/app/utils/atoms";
import { displayAmount } from "@/app/utils/displayUtils";
import {
  getBtcAddressFromData,
  getLockedUstxFromData,
  getPeriodFromData,
  getStxFromUstxBN,
  getStxThresholdFromData,
} from "@/app/utils/stacksUtils";
import { Link } from "@nextui-org/react";
import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useContext } from "react";
import type { AllData } from "@/app/utils/queryFunctions";
import { PoxDetailsStructure } from "./PoxDetailsStructure";

export const StackIncreaseDetails: React.FC<{ data: AllData }> = ({ data }) => {
  const { stxAddress: userAddress } = useContext(AuthContext);
  const { network } = useContext(AuthContext);

  const [stackIncreaseAmount] = useAtom(stackIncreaseAmountInput);

  const lockPeriod = getPeriodFromData(data);
  const currentlyStackingUstx = getLockedUstxFromData(data);

  if (currentlyStackingUstx === undefined)
    throw new Error("No locked amount found in data");

  const currentlyStackingStx = getStxFromUstxBN(currentlyStackingUstx);
  const btcAddress = getBtcAddressFromData(data, network);
  const stxThreshold = getStxThresholdFromData(data);
  const displayedIncreaseStxAmount = stackIncreaseAmount.isNaN()
    ? "0"
    : stackIncreaseAmount.toString();
  const slotsExpected = stackIncreaseAmount
    .dividedBy(stxThreshold)
    .integerValue(BigNumber.ROUND_DOWN);
  const displayAdditionalSlotsExpected =
    stackIncreaseAmount.isNaN() || slotsExpected.lt(1)
      ? "0"
      : slotsExpected.toString();

  const currentCycle = data.poxInfo.current_cycle.id;

  const mempoolIncreaseUstx = data.mempoolIncrease;
  const mempoolIncreaseStx = getStxFromUstxBN(mempoolIncreaseUstx);
  return (
    <PoxDetailsStructure title="Overview">
      <div className="font-bold mb-2 text-lg">You are stacking</div>
      <div>
        <span className="font-bold">Confirmed: </span>
        {`${displayAmount(currentlyStackingStx.toString())} STX`}
      </div>
      {mempoolIncreaseStx.gt(0) && (
        <div>
          <span className="font-bold">Increase in mempool: </span>
          {`${displayAmount(mempoolIncreaseStx.toString())} STX`}
        </div>
      )}
      <div>
        <span className="font-bold">You will increase by: </span>
        {`${displayAmount(displayedIncreaseStxAmount.toString())} STX`}
      </div>
      <div>
        <span className="font-bold">Additional reward slots expected: </span>
        {displayAdditionalSlotsExpected}
      </div>
      <div>
        <span className="font-bold">Cycles: </span>
        {lockPeriod + data.mempoolExtend}
      </div>
      <div>
        <span className="font-bold">Stacks Address: </span>
        {getShortestAddress(userAddress ? userAddress : undefined)}
      </div>
      <div>
        <span className="font-bold text-lg">Bitcoin Address: </span>
        <br />
        <Link
          href={MEMPOOL_URL_ADDRESS(network, btcAddress || "")}
          target="_blank"
        >
          {getShortAddress(btcAddress || "")}
        </Link>
      </div>
      <div>
        <span className="font-bold">Current Cycle: </span>
        {currentCycle}
      </div>
    </PoxDetailsStructure>
  );
};
