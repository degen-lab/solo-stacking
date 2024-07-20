import { MEMPOOL_URL_ADDRESS } from "@/app/consts/api";
import { AuthContext } from "@/app/contexts/AuthContext";
import { getShortAddress } from "@/app/utils";
import {
  openExtendPage,
  openIncreasePage,
  stackExtendCyclesInput,
  stackIncreaseAmountInput,
  stackStxAmountInput,
  stackStxNumCyclesInput,
  stackStxPoxAddrInput,
  userStateAtom,
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
import { checkIsStackingInProgress } from "@/app/utils/userStateUtils";
import { Button, Divider, Link } from "@nextui-org/react";
import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useTheme } from "next-themes";
import { ReactNode, useContext, useEffect } from "react";
import type { AllData } from "@/app/utils/queryFunctions";

export const DisplayedPoxDetails: React.FC<{
  data: AllData;
}> = ({ data }) => {
  const { user, network, isAuthenticated } = useContext(AuthContext);

  const [userState, setUserState] = useAtom(userStateAtom);
  const [increasePageOpen] = useAtom(openIncreasePage);
  const [extendPageOpen] = useAtom(openExtendPage);
  const mempoolTransactions = data.mempoolTransactions;
  const stackerInfo = data.stackerInfo;

  const getUserState = () => {
    const checkStackingTransaction = checkIsStackingInProgress(
      mempoolTransactions,
      network
    );
    setUserState("StackStx");
    if (!isAuthenticated()) setUserState("NoAuth");
    else {
      if (checkStackingTransaction.result === true) {
        // Stacking transaction is in mempool
        setUserState("StackingMempool");
      } else if (stackerInfo !== null) {
        // Stacking transaction is confirmed
        setUserState("StackingConfirmed");
      }
    }
  };

  useEffect(() => {
    getUserState();
  }, [user, data]);

  if (userState === "NoAuth") return <NoAuthPoxDetails data={data} />;

  if (userState === "StackStx") return <AuthStackStxPoxDetails data={data} />;

  if (
    (userState === "StackingMempool" || userState === "StackingConfirmed") &&
    !increasePageOpen &&
    !extendPageOpen
  )
    return <AlreadyStacking data={data} userState={userState} />;
  if (
    (userState === "StackingMempool" || userState === "StackingConfirmed") &&
    increasePageOpen
  )
    return <StackIncreaseDetails data={data} />;
  if (
    (userState === "StackingMempool" || userState === "StackingConfirmed") &&
    extendPageOpen
  )
    return <StackExtendDetails data={data} />;
  if (
    (userState === "StackingMempool" || userState === "StackingConfirmed") &&
    increasePageOpen &&
    extendPageOpen
  ) {
    throw new Error("Invalid state: both increase and extend pages open");
    return null;
  }
};

const NoAuthPoxDetails: React.FC<{ data: AllData }> = ({ data }) => {
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
        {`Minimum Threshold: ${minThreshold} STX`}
        {`Current Cycle: ${currentCycle}`}
        {`Next Cycle In: ${nextCycleIn} blocks`}
        {`Total Stacked This Cycle: ${displayAmount(
          totalStackedThisCycle.toFixed(2)
        )} STX`}
        {/* TODO: How to get number of stackers? */}
        {/* https://api.hiro.so/extended/v2/pox/cycles/89/signers -> this is for signers. Keep it or remove it? */}
        {`Number of Stackers: `}
      </PoxDetailsStructure>
      <Button className="mt-8" color="primary" onClick={() => login()}>
        Connect Wallet to Stack
      </Button>
    </div>
  );
};

const AuthStackStxPoxDetails: React.FC<{ data: AllData }> = ({ data }) => {
  const { stxAddress: userAddress, network } = useContext(AuthContext);
  const [stackStxAmount] = useAtom(stackStxAmountInput);
  const [stackStxNumCycles] = useAtom(stackStxNumCyclesInput);
  const [stackStxPoxAddr] = useAtom(stackStxPoxAddrInput);
  const stxThreshold = getStxThresholdFromData(data);
  const stackStxAMountBN = BigNumber(stackStxAmount);
  const slotsExpected = stackStxAMountBN
    .dividedBy(stxThreshold)
    .integerValue(BigNumber.ROUND_DOWN);

  console.log(
    "stackStxAmount, stxThreshold, slotsExpected:",
    stackStxAmount,
    stxThreshold,
    slotsExpected
  );
  const displayedStxAmount = stackStxAMountBN.isNaN()
    ? "0"
    : stackStxAmount.toString();
  const displaySlotsExpected =
    stackStxAMountBN.isNaN() || slotsExpected.lt(1)
      ? "0"
      : slotsExpected.toString();

  const currentCycle = data.poxInfo.current_cycle.id;
  return (
    <PoxDetailsStructure title="Details">
      {`You will lock: ${displayedStxAmount} STX`}
      {`Reward Slots Expected: ${displaySlotsExpected}`}
      {`Cycles: ${stackStxNumCycles}`}
      {`Stacks Address: ${getShortAddress(
        userAddress ? userAddress : undefined
      )}`}
      {`Bitcoin Address:`}{" "}
      <Link href={MEMPOOL_URL_ADDRESS(network, stackStxPoxAddr)} target="new">
        {getShortAddress(stackStxPoxAddr)}
      </Link>
      {`Current Cycle: ${currentCycle}`}
    </PoxDetailsStructure>
  );
};

const StackIncreaseDetails: React.FC<{ data: AllData }> = ({ data }) => {
  const { stxAddress: userAddress } = useContext(AuthContext);
  const [stackIncreaseAmount] = useAtom(stackIncreaseAmountInput);
  const currentlyStackingUstx = getLockedUstxFromData(data);
  if (currentlyStackingUstx === undefined)
    throw new Error("No locked amount found in data");
  const currentlyStackingStx = getStxFromUstxBN(currentlyStackingUstx);
  const btcAddress = getBtcAddressFromData(data);
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
  return (
    <PoxDetailsStructure title="Details">
      {`You are stacking: ${displayAmount(
        currentlyStackingStx.toString()
      )} STX`}
      {`You will increase by: ${displayedIncreaseStxAmount} STX`}
      {`Additional reward slots expected: ${displayAdditionalSlotsExpected}`}
      {`Cycles: `}
      {`Stacks Address: ${getShortAddress(
        userAddress ? userAddress : undefined
      )}`}
      {`Bitcoin Address: ${getShortAddress(btcAddress)}`}
      {`Current Cycle: ${currentCycle}`}
    </PoxDetailsStructure>
  );
};

const StackExtendDetails: React.FC<{ data: AllData }> = ({ data }) => {
  const { stxAddress: userAddress } = useContext(AuthContext);
  const [stackExtendCycles] = useAtom(stackExtendCyclesInput);
  const currentlyStackingUstx = getLockedUstxFromData(data);
  if (currentlyStackingUstx === undefined)
    throw new Error("No locked amount found in data");
  const currentlyStackingStx = getStxFromUstxBN(currentlyStackingUstx);
  // const stxThreshold = getStxThresholdFromData(data);
  // const displayedIncreaseStxAmount = !stackExtendCycles
  //   ? "0"
  //   : stackExtendCycles.toString();

  // const slotsExpected = stackExtendCycles
  //   .dividedBy(stxThreshold)
  //   .integerValue(BigNumber.ROUND_DOWN);
  // const displayAdditionalSlotsExpected =
  //   stackExtendCycles.isNaN() || slotsExpected.lt(1)
  //     ? "0"
  //     : slotsExpected.toString();

  const currentCycle = data.poxInfo.current_cycle.id;
  return (
    <PoxDetailsStructure title="Details">
      {`You are stacking: ${displayAmount(
        currentlyStackingStx.toString()
      )} STX`}
      {`You will extend with: ${stackExtendCycles} cycles`}
      {`Reward slots expected: /cycle`}
      {`Cycles remaining: `}
      {`Stacks Address: ${getShortAddress(
        userAddress ? userAddress : undefined
      )}`}
      {`Bitcoin Address: `}
      {`Current Cycle: ${currentCycle}`}
    </PoxDetailsStructure>
  );
};

const AlreadyStacking: React.FC<{
  data: AllData;
  userState: "StackingMempool" | "StackingConfirmed";
}> = ({ data, userState }) => {
  const { theme } = useTheme();
  const { network } = useContext(AuthContext);
  const [, setOpenIncreasePage] = useAtom(openIncreasePage);
  const [, setOpenExtendPage] = useAtom(openExtendPage);
  if (!data.balancesInfo) return null;
  if (!data.balancesInfo.stx) return null;
  // TODO: convert from uSTX to STX
  const currentlyStackingStx = getStxFromUstxBN(
    BigNumber(data.balancesInfo.stx.locked)
  );
  const stxThreshold = getStxThresholdFromData(data).toString();
  const stackedCycles = getPeriodFromData(data);
  const startCycle = getFirstLockedCycleFromData(data);
  const endCycle = getEndCycleFromData(data);
  const btcAddress = getBtcAddressFromData(data);
  const slotsExpected = currentlyStackingStx
    .dividedBy(stxThreshold)
    .integerValue(BigNumber.ROUND_DOWN);

  // TODO: Get from mempool for TBDs?
  const stackedAmountDisplayed =
    userState === "StackingConfirmed" ? currentlyStackingStx : "TBD";
  const stackedCyclesDisplayed =
    userState === "StackingConfirmed" ? stackedCycles : "TBD";
  const remainingCycles = userState === "StackingConfirmed" ? 0 : "TBD";
  const startCycleDisplayed =
    userState === "StackingConfirmed" ? startCycle : "TBD";
  const endCycleDisplayed =
    userState === "StackingConfirmed" ? endCycle : "TBD";
  const btcAddressDisplayed =
    userState === "StackingConfirmed" ? btcAddress : "TBD";
  const displaySlotsExpected =
    currentlyStackingStx.isNaN() || slotsExpected.lt(1)
      ? "TBD"
      : slotsExpected.toString();
  return (
    <PoxDetailsStructure title="Details">
      {`You are stacking: ${displayAmount(
        stackedAmountDisplayed.toString()
      )} STX`}
      {`Duration: ${stackedCyclesDisplayed}`}
      {`Remaining Cycles: ${remainingCycles}`}
      {`Start Cycle: ${startCycleDisplayed}`}
      {`End Cycle: ${endCycleDisplayed}`}
      {`Bitcoin Address: `}
      <Link
        href={MEMPOOL_URL_ADDRESS(network, btcAddress ? btcAddress : "")}
        target="new"
      >
        {getShortAddress(btcAddressDisplayed)}
      </Link>
      {`Reward Slots Expected This Cycle: ${displaySlotsExpected}`}
      {`Threshold for Slot: ${stxThreshold} STX`}
      <div className="flex flex-col">
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
      </div>
    </PoxDetailsStructure>
  );
};

const PoxDetailsStructure: React.FC<{
  children: ReactNode[];
  title: string;
}> = ({ children, title }) => {
  return (
    <div className="flex-col text-center justify-items-center justify-center border-2 border-[#F5F5F5] rounded-lg p-8 lg:min-h-[30rem] h-auto lg:min-h-[25rem] w-[65vw] lg:w-[25vw] mb-10 mx-auto">
      <h1 className="font-bold mb-2 text-xl">{title}</h1>
      <Divider className="mb-6" />
      {children.map((child, index) => (
        <div key={`poxDetail${index}`} className="mb-4">
          {child}
        </div>
      ))}
    </div>
  );
};
