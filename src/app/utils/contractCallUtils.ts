import { Pox4SignatureTopic } from "@stacks/stacking";
import { getStackingSignature } from "./signatureUtils";
import {
  getBtcAddressFromData,
  getCurBurnHeightFromData,
  getLockPeriodFromData,
  getLockedUstxFromData,
  getStxFromUstxBN,
  getUstxFromStxBN,
  parseStackExtendArgs,
  parseStackIncreaseArgs,
  parseStackStxArgs,
  poxScAddressFromPoxInfo,
  poxScNameFromPoxInfo,
  stacksNetworkFromStringNetwork,
} from "./stacksUtils";
import { openContractCall } from "@stacks/connect";
import { Network } from "../contexts/AuthContext";
import {
  AnchorMode,
  ClarityValue,
  PostConditionMode,
} from "@stacks/transactions";
import BigNumber from "bignumber.js";
import { getCurRewCycleFromData } from "./api";
import type { AllData } from "./queryFunctions";

export const callStackStx = async (
  topic: Pox4SignatureTopic,
  poxAddress: string,
  period: number,
  maxAmountSTX: BigNumber,
  network: any,
  data: AllData,
  onFinish: () => void
) => {
  const functionName = "stack-stx";
  const currentCycle = getCurRewCycleFromData(data);

  if (currentCycle === null) throw new Error("No current cycle found in data");

  const signature = await getStackingSignature(
    topic,
    poxAddress,
    currentCycle,
    period,
    maxAmountSTX,
    network
  );

  const startBurnHeight = getCurBurnHeightFromData(data);
  const maxAmountUstx = getUstxFromStxBN(maxAmountSTX);

  const functionArgs = parseStackStxArgs(
    maxAmountUstx,
    poxAddress,
    startBurnHeight,
    period,
    signature.signerSignature,
    signature.signerKey,
    maxAmountUstx,
    signature.authId
  );

  contractCall(functionName, functionArgs, network, data, onFinish);
};

export const callStackIncrease = async (
  topic: Pox4SignatureTopic,
  data: AllData,
  increaseAmountSTX: BigNumber,
  network: Network,
  onFinish: () => void
) => {
  const functionName = "stack-increase";
  const poxAddress = getBtcAddressFromData(data, network);
  const currentCycle = getCurRewCycleFromData(data);
  const currentLockPeriod = getLockPeriodFromData(data);
  const lockedUstx = getLockedUstxFromData(data);
  const increaseAmountUstx = getUstxFromStxBN(increaseAmountSTX);
  const mempoolExtend = data.mempoolExtend;

  if (lockedUstx === undefined)
    throw new Error("No locked amount found in data");
  if (increaseAmountUstx === undefined)
    throw new Error("Invalid increase amount");
  if (currentLockPeriod === undefined)
    throw new Error("No lock period found in data");
  if (poxAddress === undefined) throw new Error("No BTC address found in data");
  if (currentCycle === null) throw new Error("No current cycle found in data");
  const maxAmountUstx = lockedUstx.plus(increaseAmountUstx);
  const maxAmountSTX = getStxFromUstxBN(maxAmountUstx);

  const totalLockPeriod = currentLockPeriod + mempoolExtend;

  const signature = await getStackingSignature(
    topic,
    poxAddress,
    currentCycle,
    totalLockPeriod,
    maxAmountSTX,
    network
  );

  const functionArgs = parseStackIncreaseArgs(
    increaseAmountUstx,
    signature.signerSignature,
    signature.signerKey,
    maxAmountUstx,
    signature.authId
  );

  contractCall(functionName, functionArgs, network, data, onFinish);
};

export const callStackExtend = async (
  topic: Pox4SignatureTopic,
  stackExtendNumCycles: number,
  data: AllData,
  network: Network,
  onFinish: () => void
) => {
  const functionName = "stack-extend";
  const extendCount = stackExtendNumCycles;
  const poxAddress = getBtcAddressFromData(data, network);
  const currentCycle = getCurRewCycleFromData(data);
  const lockedUstx = getLockedUstxFromData(data);

  console.log("lockedUstx", lockedUstx);

  if (lockedUstx === undefined) {
    throw new Error("Invalid user state - No locked amount found in data");
  }

  if (poxAddress === undefined) {
    throw new Error("Invalid user state - No PoX address found in data");
  }

  if (currentCycle === null) {
    throw new Error("Invalid user state - No current cycle found in data");
  }

  const activeIncreaseAmount = data.mempoolIncrease;
  const maxAmountUstx = lockedUstx.plus(activeIncreaseAmount);
  const maxAmountSTX = getStxFromUstxBN(maxAmountUstx);

  const signature = await getStackingSignature(
    topic,
    poxAddress,
    currentCycle,
    extendCount,
    maxAmountSTX,
    network
  );

  const functionArgs = parseStackExtendArgs(
    extendCount,
    poxAddress,
    signature.signerSignature,
    signature.signerKey,
    maxAmountUstx,
    signature.authId
  );

  contractCall(functionName, functionArgs, network, data, onFinish);
};

/**
 * Helper function to call a contract function.
 * @param functionName
 * @param functionArgs
 * @param network
 * @param data
 */
export const contractCall = (
  functionName: string,
  functionArgs: ClarityValue[],
  network: Network,
  data: AllData,
  onFinish: () => void
) => {
  const poxAddress = poxScAddressFromPoxInfo(data);
  const poxName = poxScNameFromPoxInfo(data);
  openContractCall({
    network: stacksNetworkFromStringNetwork(network),
    anchorMode: AnchorMode.Any,

    contractAddress: poxAddress,
    contractName: poxName,
    functionName,
    functionArgs,

    postConditionMode: PostConditionMode.Deny,
    postConditions: [],

    onFinish: (response) => {
      onFinish();
      return response;
    },
    onCancel: () => {
      return null;
    },
  });
};
