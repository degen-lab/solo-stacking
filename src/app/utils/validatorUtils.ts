import BigNumber from "bignumber.js";
import { fromBase58Check, fromBech32 } from "bitcoinjs-lib/src/address";
import type { PoxUserData } from "./queryFunctions";

type IsValidFieldAndMessage = {
  valid: boolean;
  message: string;
};

export const isValidStackStxAmount = (
  stackStxAmount: BigNumber,
  data: PoxUserData
): IsValidFieldAndMessage => {
  if (stackStxAmount.lte(0))
    return { valid: false, message: "Please insert a valid amount." };
  if (stackStxAmount.lt(data.amountLowerLimit))
    return {
      valid: false,
      message: "The STX amount is lower than the minimum threshold.",
    };
  if (stackStxAmount.gt(data.amountUpperLimit))
    return {
      valid: false,
      message: "Your STX balance does not cover the inserted amount.",
    };
  return { valid: true, message: "Valid" };
};

export const isValidStackIncreaseAmount = (
  stackIncreaseAmount: BigNumber,
  data: PoxUserData
): IsValidFieldAndMessage => {
  console.log("stackIncreaseAmount", stackIncreaseAmount.toString());
  console.log("data.amountUpperLimit", data.amountUpperLimit.toString());
  if (stackIncreaseAmount.lte(0))
    return { valid: false, message: "Please insert a valid amount." };
  if (stackIncreaseAmount.gt(data.amountUpperLimit))
    return {
      valid: false,
      message: "Your STX balance does not cover the inserted amount.",
    };
  return { valid: true, message: "Valid" };
};

export const isValidStackExtendCount = (
  stackExtendCount: number,
  data: PoxUserData
): IsValidFieldAndMessage => {
  if (stackExtendCount < 1 || stackExtendCount > 12)
    return {
      valid: false,
      message: "A valid number of cycles is between 1 and 12.",
    };
  if (stackExtendCount > data.cyclesLimit)
    return {
      valid: false,
      message: `You can not extend the stacking period for more than ${data.cyclesLimit} cycles`,
    };

  return { valid: true, message: "Valid" };
};

export const isValidNumCyclesAndMessage = (
  numCycles: number,
  allData: PoxUserData
): IsValidFieldAndMessage => {
  if (numCycles < 1 || numCycles > 12)
    return {
      valid: false,
      message: "A valid number of cycles is between 1 and 12.",
    };
  if (numCycles > allData.cyclesLimit)
    return {
      valid: false,
      message: "Your current cycles limit is lower that the cycles number.",
    };

  return { valid: true, message: "Valid" };
};

/**
 * Validates if the given address is a valid Bitcoin address for the specified network.
 * @param {string} address - The Bitcoin address to validate.
 * @param {string} network - The network to validate against ('mainnet' or 'testnet').
 * @returns {boolean} - Returns true if the address is valid for the specified network, false otherwise.
 */
export const isValidBitcoinAddress = (
  address: string,
  network: "mainnet" | "testnet"
) => {
  const mainnetPrefixes = {
    base58: ["1", "3"],
    bech32: ["bc1"],
  };

  const testnetPrefixes = {
    base58: ["m", "n", "2"],
    bech32: ["tb1"],
  };

  const prefixes = network === "mainnet" ? mainnetPrefixes : testnetPrefixes;

  // Check for Bech32 address
  if (prefixes.bech32.some((prefix) => address.startsWith(prefix))) {
    try {
      fromBech32(address);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Check for Base58 address
  if (prefixes.base58.some((prefix) => address.startsWith(prefix))) {
    try {
      fromBase58Check(address);
      return true;
    } catch (e) {
      return false;
    }
  }

  return false;
};
