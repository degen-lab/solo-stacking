import { MEMPOOL_URL_ADDRESS } from "@/app/consts/api";
import { AuthContext } from "@/app/contexts/AuthContext";
import { getShortestAddress } from "@/app/utils";
import { stackExtendCyclesInput } from "@/app/utils/atoms";
import { displayAmount } from "@/app/utils/displayUtils";
import {
  getBtcAddressFromData,
  getLockedUstxFromData,
  getStxFromUstxBN,
  getStxThresholdFromData,
} from "@/app/utils/stacksUtils";
import { Link } from "@nextui-org/react";
import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useContext } from "react";
import type { PoxUserData } from "@/app/utils/queryFunctions";
import { PoxDetailsStructure } from "./PoxDetailsStructure";
import { getCurRewCycleFromData } from "@/app/utils/api";

export const StackExtendDetails: React.FC<{ data: PoxUserData }> = ({
  data,
}) => {
  const { stxAddress: userAddress, network } = useContext(AuthContext);

  const [stackExtendCycles] = useAtom(stackExtendCyclesInput);

  const currentlyStackingUstx = getLockedUstxFromData(data);

  if (currentlyStackingUstx === undefined)
    throw new Error("No locked amount found in data");

  const currentlyStackingStx = getStxFromUstxBN(currentlyStackingUstx);
  const stxThreshold = getStxThresholdFromData(data);
  const mempoolIncreaseUstx = data.mempoolIncrease;
  const mempoolIncreaseStx = getStxFromUstxBN(mempoolIncreaseUstx);
  const poxAddress = getBtcAddressFromData(data, network);
  const slotsExpected = currentlyStackingStx
    .dividedBy(stxThreshold)
    .integerValue(BigNumber.ROUND_DOWN);

  const currentCycle = getCurRewCycleFromData(data);
  if (poxAddress === undefined) throw new Error("No BTC address found in data");

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
        <span className="font-bold">You will extend with: </span>
        {`${stackExtendCycles} cycles`}
      </div>
      <div>
        <span className="font-bold">Reward slots expected: </span>
        {`${slotsExpected} / cycle`}
      </div>
      <div>
        <span className="font-bold">Remaining cycles to extend: </span>
        {data.cyclesLimit}
      </div>
      <div>
        <span className="font-bold">Stacks Address: </span>
        {getShortestAddress(userAddress ? userAddress : undefined)}
      </div>
      <div>
        <span className="font-bold text-lg">Bitcoin Address: </span>
        <br />
        <Link href={MEMPOOL_URL_ADDRESS(network, poxAddress)} target="_blank">
          {getShortestAddress(poxAddress)}
        </Link>
      </div>
      <div>
        <span className="font-bold">Current Cycle: </span>
        {currentCycle}
      </div>
    </PoxDetailsStructure>
  );
};
