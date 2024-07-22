import { AuthContext } from "@/app/contexts/AuthContext";
import { displayAmount } from "@/app/utils/displayUtils";
import {
  getStxFromUstxBN,
  getStxThresholdFromData,
} from "@/app/utils/stacksUtils";
import { Button } from "@nextui-org/react";
import BigNumber from "bignumber.js";
import { useContext } from "react";
import type { AllData } from "@/app/utils/queryFunctions";
import { PoxDetailsStructure } from "./PoxDetailsStructure";

export const NoAuthPoxDetails: React.FC<{ data: AllData }> = ({ data }) => {
  const { login } = useContext(AuthContext);
  const minThreshold = getStxThresholdFromData(data);
  const currentCycle = data.poxInfo.current_cycle.id;
  const nextCycleIn = data.poxInfo.next_cycle.blocks_until_reward_phase;
  const totalStackedThisCycle = getStxFromUstxBN(
    BigNumber(data.poxInfo.current_cycle.stacked_ustx)
  );
  return (
    <div className="flex-col text-center">
      <PoxDetailsStructure title="General Stacking Details">
        <div>
          <span className="font-bold">Minimum Threshold: </span>
          {`${displayAmount(minThreshold.toString())} STX`}
        </div>
        <div>
          <span className="font-bold">Current Cycle: </span>
          {currentCycle}
        </div>
        <div>
          <span className="font-bold">Next Cycle In: </span>
          {`${nextCycleIn} blocks`}
        </div>
        <div>
          <span className="font-bold">Total Stacked This Cycle: </span>
          {`${displayAmount(totalStackedThisCycle.toFixed(2))} STX`}
        </div>
      </PoxDetailsStructure>
      <Button className="mt-8" color="primary" onClick={() => login()}>
        Connect Wallet to Stack
      </Button>
    </div>
  );
};
