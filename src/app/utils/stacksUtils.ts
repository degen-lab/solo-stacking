import { poxAddressToBtcAddress, poxAddressToTuple } from "@stacks/stacking";
import { bufferCV, optionalCVOf, uintCV } from "@stacks/transactions";
import { Network } from "../contexts/AuthContext";
import { StacksMainnet, StacksTestnet } from "@stacks/network";
import BigNumber from "bignumber.js";
import type { AllData } from "./queryFunctions";

export const hexStringToUint8Array = (hexString: string) => {
  if (hexString.length % 2 !== 0) {
    throw new Error("Hex string must have an even number of characters");
  }

  const arrayBuffer = new Uint8Array(hexString.length / 2);

  for (let i = 0; i < hexString.length; i += 2) {
    arrayBuffer[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
  }

  return arrayBuffer;
};

export const parsePoxAddress = (
  version: string,
  hashbytes: string,
  network: "nakamoto-testnet" | "testnet" | "mainnet"
) =>
  poxAddressToBtcAddress(
    parseInt(version, 16),
    hexStringToUint8Array(hashbytes.slice(2)),
    network === "nakamoto-testnet" ? "testnet" : network
  );

export const parseStackStxArgs = (
  amountUstx: BigNumber,
  poxAddr: string,
  startBurnHeight: number,
  lockPeriod: number,
  signerSig: string,
  signerKey: string,
  maxAmount: BigNumber,
  authId: number
) => {
  return [
    uintCV(amountUstx.toString()),
    poxAddressToTuple(poxAddr),
    uintCV(startBurnHeight),
    uintCV(lockPeriod),
    optionalCVOf(bufferCV(hexStringToUint8Array(signerSig))),
    bufferCV(hexStringToUint8Array(signerKey)),
    uintCV(maxAmount.toString()),
    uintCV(authId),
  ];
};

export const parseStackExtendArgs = (
  extendCount: number,
  poxAddr: string,
  signerSig: string,
  signerKey: string,
  maxAmount: BigNumber,
  authId: number
) => {
  return [
    uintCV(extendCount),
    poxAddressToTuple(poxAddr),
    optionalCVOf(bufferCV(hexStringToUint8Array(signerSig))),
    bufferCV(hexStringToUint8Array(signerKey)),
    uintCV(maxAmount.toString()),
    uintCV(authId),
  ];
};

export const parseStackIncreaseArgs = (
  increaseBy: BigNumber,
  signerSig: string,
  signerKey: string,
  maxAmount: BigNumber,
  authId: number
) => {
  return [
    uintCV(increaseBy.toString()),
    optionalCVOf(bufferCV(hexStringToUint8Array(signerSig))),
    bufferCV(hexStringToUint8Array(signerKey)),
    uintCV(maxAmount.toString()),
    uintCV(authId),
  ];
};

export const stacksNetworkFromStringNetwork = (network: Network) =>
  network === "nakamoto-testnet"
    ? new StacksTestnet({ url: "https://api.nakamoto.testnet.hiro.so" })
    : network === "testnet"
    ? new StacksTestnet()
    : new StacksMainnet();

export const poxContractFromData = (data: AllData) => data.poxInfo.contract_id;

export const poxScAddressFromPoxInfo = (data: AllData) =>
  data.poxInfo.contract_id.split(".")[0];

export const poxScNameFromPoxInfo = (data: AllData) =>
  data.poxInfo.contract_id.split(".")[1];

export const getUstxThresholdFromData = (data: AllData) =>
  BigNumber(data.poxInfo.next_cycle.min_threshold_ustx);

export const getStxThresholdFromData = (data: AllData) =>
  BigNumber(data.poxInfo.next_cycle.min_threshold_ustx).shiftedBy(-6);

export const getStxFromUstxBN = (ustx: BigNumber) => ustx.shiftedBy(-6);

export const getUstxFromStxBN = (stx: BigNumber) => stx.shiftedBy(6);

export const getPeriodFromData = (data: AllData) =>
  data.stackerInfo && data.stackerInfo.value
    ? parseInt(data.stackerInfo.value["lock-period"].value)
    : 0;

export const getFirstLockedCycleFromData = (data: AllData) =>
  data.stackerInfo && data.stackerInfo.value
    ? parseInt(data.stackerInfo.value["first-reward-cycle"].value)
    : undefined;

export const getEndCycleFromData = (data: AllData) => {
  const firstCycle = getFirstLockedCycleFromData(data);
  const lockPeriod = getPeriodFromData(data);
  return firstCycle ? firstCycle + lockPeriod : undefined;
};

export const getRemainingCyclesFromData = (data: AllData) => {
  const currentCycle = data.poxInfo.current_cycle.id;
  const endCycle = getEndCycleFromData(data);
  return endCycle ? endCycle - currentCycle : undefined;
};

export const getBtcAddressFromData = (data: AllData, network: Network) => {
  if (!data.stackerInfo || !data.stackerInfo.value) return undefined;

  const poxAddress = data.stackerInfo.value["pox-addr"].value;
  const version = poxAddress.version.value;
  const hashbytes = poxAddress.hashbytes.value;

  return parsePoxAddress(version, hashbytes, network);
};

export const getLockPeriodFromData = (data: AllData) => {
  if (!data.stackerInfo || !data.stackerInfo.value) return undefined;
  return parseInt(data.stackerInfo.value["lock-period"].value);
};

export const getLockedUstxFromData = (data: AllData) => {
  if (!data.balancesInfo || !data.balancesInfo.stx) return undefined;
  return BigNumber(data.balancesInfo.stx.locked);
};

export const getCurBurnHeightFromData = (data: AllData) =>
  data.poxInfo.current_burnchain_block_height;
