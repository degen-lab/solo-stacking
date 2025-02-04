import { BigNumber } from "bignumber.js";
import { atom } from "jotai";

/// State atoms

/**
 * Atom that keeps the base user state.
 */
export const userStateAtom = atom<
  "NoAuth" | "StackStx" | "StackingMempool" | "StackingConfirmed"
>("NoAuth");

/**
 * Atom that keeps the increase user state.
 */
export const increaseUserStateAtom = atom<
  "None" | "StackIncrease" | "IncreaseMempool" | "IncreaseCompleted"
>("None");

/**
 * Atom that keeps the extend user state.
 */
export const extendUserStateAtom = atom<
  "None" | "StackExtend" | "ExtendMempool" | "ExtendCompleted"
>("None");

/// Input atoms

// stack-stx

export const stackStxAmountInput = atom<BigNumber>(BigNumber(0));
export const stackStxPoxAddrInput = atom("");
export const stackStxNumCyclesInput = atom(0);

// stack-increase

export const stackIncreaseAmountInput = atom<BigNumber>(BigNumber(0));

// stack-extend

export const stackExtendCyclesInput = atom<number>(0);

/// Render atoms

export const openIncreasePage = atom<boolean>(false);
export const openExtendPage = atom<boolean>(false);

/// Reward atoms

export const rewardsBtcAddressAtom = atom<string>("");
