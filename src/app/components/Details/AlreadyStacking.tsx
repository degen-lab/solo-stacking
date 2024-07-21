import { MEMPOOL_URL_ADDRESS } from "@/app/consts/api";
import { AuthContext } from "@/app/contexts/AuthContext";
import { explorerTxUrl, getShorterAddress } from "@/app/utils";
import {
  extendUserStateAtom,
  increaseUserStateAtom,
  openExtendPage,
  openIncreasePage,
} from "@/app/utils/atoms";
import { displayAmount } from "@/app/utils/displayUtils";
import {
  getBtcAddressFromData,
  getEndCycleFromData,
  getFirstLockedCycleFromData,
  getLockedUstxFromData,
  getPeriodFromData,
  getStxFromUstxBN,
  getStxThresholdFromData,
} from "@/app/utils/stacksUtils";
import {
  checkIsExtendInProgress,
  checkIsIncreaseInProgress,
} from "@/app/utils/userStateUtils";
import { Button, Link } from "@nextui-org/react";
import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useTheme } from "next-themes";
import { useContext } from "react";
import type { AllData } from "@/app/utils/queryFunctions";
import { getCurRewCycleFromData } from "@/app/utils/api";
import { PoxDetailsStructure } from "./PoxDetailsStructure";

export const AlreadyStacking: React.FC<{
  data: AllData;
}> = ({ data }) => {
  const { theme } = useTheme();
  const { network } = useContext(AuthContext);
  const [increaseUserState] = useAtom(increaseUserStateAtom);
  const [extendUserState] = useAtom(extendUserStateAtom);
  const [, setOpenIncreasePage] = useAtom(openIncreasePage);
  const [, setOpenExtendPage] = useAtom(openExtendPage);
  console.log(increaseUserState);
  if (!data.balancesInfo) return null;
  if (!data.balancesInfo.stx) return null;
  const currentlyStackingUstx = getLockedUstxFromData(data) || BigNumber(0);
  const currentlyStackingStx = getStxFromUstxBN(currentlyStackingUstx);
  const stxThreshold = getStxThresholdFromData(data).toString();
  const stackedCycles = getPeriodFromData(data);
  const startCycle = getFirstLockedCycleFromData(data);
  const endCycle = getEndCycleFromData(data) || 0;
  const currentCycle = getCurRewCycleFromData(data) || 0;
  const btcAddress = getBtcAddressFromData(data, network);
  const slotsExpected = currentlyStackingStx
    .dividedBy(stxThreshold)
    .integerValue(BigNumber.ROUND_DOWN);

  const remainingCycles = endCycle - currentCycle;

  const mempoolIncreaseTxid = checkIsIncreaseInProgress(
    data.mempoolTransactions,
    network
  ).txid;
  const mempoolExtendTxid = checkIsExtendInProgress(
    data.mempoolTransactions,
    network
  ).txid;

  const mempoolExtendCycles = data.mempoolExtend;
  const mempoolIncreaseUstx = data.mempoolIncrease;
  const mempoolIncreaseStx = getStxFromUstxBN(mempoolIncreaseUstx);
  return (
    <PoxDetailsStructure title="Details">
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
      <div className="font-bold mb-2 text-lg">Duration</div>
      <div>
        <span className="font-bold">Confirmed: </span>
        {stackedCycles} cycles
      </div>
      {mempoolExtendCycles > 0 && (
        <div>
          <span className="font-bold">Extend in mempool: </span>
          {mempoolExtendCycles} cycles
        </div>
      )}
      <div>
        <span className="font-bold">Remaining locked cycles: </span>
        {remainingCycles}
      </div>
      <div>
        <span className="font-bold">Start Cycle: </span>
        {startCycle}
      </div>
      <div>
        <span className="font-bold">End Cycle: </span>
        {endCycle}
      </div>
      <div>
        <span className="font-bold">Bitcoin Address: </span>
        <br />
        <Link
          href={MEMPOOL_URL_ADDRESS(network, btcAddress ? btcAddress : "")}
          target="new"
        >
          {getShorterAddress(btcAddress)}
        </Link>
      </div>
      <div>
        <span className="font-bold">Reward Slots Expected This Cycle: </span>
        {slotsExpected.toString()}
      </div>
      <div>
        <span className="font-bold">Threshold for Slot: </span>
        {`${displayAmount(stxThreshold.toString())} STX`}
      </div>
      <div className="flex flex-col">
        {increaseUserState === "IncreaseMempool" ? (
          <Button
            className={
              theme === "light"
                ? "text-action-dark bg-action-light mb-4"
                : "text-action-light bg-action-dark mb-4"
            }
          >
            <Link
              isDisabled={!mempoolIncreaseTxid}
              href={explorerTxUrl(mempoolIncreaseTxid, network)}
              target="new"
            >
              Increase in progress...
            </Link>
          </Button>
        ) : (
          <Button
            className={
              theme === "light"
                ? "text-action-dark bg-action-light mb-4"
                : "text-action-light bg-action-dark mb-4"
            }
            onClick={() => setOpenIncreasePage(true)}
          >
            Increase stacked amount
          </Button>
        )}
        {extendUserState === "ExtendMempool" ? (
          <Button
            className={
              theme === "light"
                ? "text-action-dark bg-action-light mb-4"
                : "text-action-light bg-action-dark mb-4"
            }
          >
            <Link
              isDisabled={!mempoolExtendTxid}
              href={explorerTxUrl(mempoolExtendTxid, network)}
              target="new"
            >
              Extend in progress...
            </Link>
          </Button>
        ) : (
          <Button
            className={
              theme === "light"
                ? "text-action-dark bg-action-light mb-4"
                : "text-action-light bg-action-dark mb-4"
            }
            onClick={() => setOpenExtendPage(true)}
          >
            Extend stacking period
          </Button>
        )}
      </div>
    </PoxDetailsStructure>
  );
};
