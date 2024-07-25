import { AuthContext } from "@/app/contexts/AuthContext";
import { explorerTxUrl, getShorterAddress } from "@/app/utils";
import { displayAmount } from "@/app/utils/displayUtils";
import { getStxThresholdFromData } from "@/app/utils/stacksUtils";
import { checkIsStackingInProgress } from "@/app/utils/userStateUtils";
import { Link } from "@nextui-org/react";
import { useContext } from "react";
import type { PoxUserData } from "@/app/utils/queryFunctions";
import { PoxDetailsStructure } from "./PoxDetailsStructure";

export const StackingMempool: React.FC<{
  data: PoxUserData;
}> = ({ data }) => {
  const { network } = useContext(AuthContext);

  if (!data.balancesInfo) return null;
  if (!data.balancesInfo.stx) return null;

  const stxThreshold = getStxThresholdFromData(data).toString();

  const mempoolStackStxTxid = checkIsStackingInProgress(
    data.mempoolTransactions,
    network
  ).txid;

  return (
    <PoxDetailsStructure title="Details">
      <div className="font-bold mb-2 text-lg">
        You have a stacking transaction in progress
      </div>
      <div>
        <Link
          isDisabled={!mempoolStackStxTxid}
          href={explorerTxUrl(mempoolStackStxTxid, network)}
        >
          {getShorterAddress(mempoolStackStxTxid)}
        </Link>
      </div>

      <div>
        <span className="font-bold">Threshold for Slot: </span>
        {`${displayAmount(stxThreshold.toString())} STX`}
      </div>
    </PoxDetailsStructure>
  );
};
