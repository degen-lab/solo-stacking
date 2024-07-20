import { Pox4SignatureTopic } from "@stacks/stacking";
import { getStackingSignature } from "./signatureUtils";
import {
  getBtcAddressFromData,
  getLockPeriodFromData,
  getLockedUstxFromData,
  getStxFromUstxBN,
  getUstxFromStxBN,
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
  rewardCycle: number,
  period: number,
  maxAmountSTX: BigNumber,
  network: any,
  data: AllData
) => {
  const functionName = "stack-stx";
  const signature = await getStackingSignature(
    topic,
    poxAddress,
    rewardCycle,
    period,
    maxAmountSTX,
    network
  );

  const startBurnHeight = data.poxInfo.current_burnchain_block_height;
  const maxAmountUstx = maxAmountSTX.multipliedBy(1000000);
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

  contractCall(functionName, functionArgs, network, data);
};

// const handleStackIncrease = () => {
//   if (balancesInfo && stackerInfo && poxInfo) {
//     console.log('Stack Increase clicked', { stackIncreaseAmount }, "STX.");

//     const functionName = 'stack-increase';
//     const increaseAmount = Math.floor(stackIncreaseAmount * 1000000);

//     const topic = methodToPox4Topic[functionName];
//     const poxAddress = parsePoxAddress(stackerInfo.value["pox-addr"].value.version.value, stackerInfo.value["pox-addr"].value.hashbytes.value);
//     const currentCycle = poxInfo.current_cycle.id;
//     const lockPeriod = parseInt(stackerInfo.value["lock-period"].value) + activeExtendCount;
//     const maxAmount = parseInt(balancesInfo.stx.locked) + increaseAmount;
//     const authId = randomAuthId();

//     const signatureAndKey = getStackingSignature(
//       topic,
//       poxAddress,
//       currentCycle,
//       lockPeriod,
//       maxAmount,
//       authId,
//     );

//     const functionArgs = parseStackIncreaseArgs(increaseAmount, signatureAndKey.signature, signatureAndKey.publicKey, maxAmount, authId);

//     contractCall(functionName, functionArgs);
//   }
// };

export const callStackIncrease = async (
  topic: Pox4SignatureTopic,
  data: AllData,
  activeExtendCount: number,
  increaseAmountSTX: BigNumber,
  network: Network
  // balancesInfo: any,
  // stackerInfo: any,
  // poxInfo: any,
  // period: number,
  // maxAmountSTX: BigNumber,
  // network: any,
  // data: AllData
) => {
  const functionName = "stack-increase";
  const poxAddress = getBtcAddressFromData(data);
  const currentCycle = getCurRewCycleFromData(data);
  const currentLockPeriod = getLockPeriodFromData(data);
  const lockedUstx = getLockedUstxFromData(data);
  const increaseAmountUstx = getUstxFromStxBN(increaseAmountSTX);

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

  const totalLockPeriod = currentLockPeriod + activeExtendCount;

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

  contractCall(functionName, functionArgs, network, data);
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
  data: AllData
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
      return response;
    },
    onCancel: () => {
      return null;
    },
  });
};
