import BigNumber from "bignumber.js";
import { Network } from "../contexts/AuthContext";
import {
  fetchBalances,
  fetchMempoolTransactions,
  fetchPoxInfo,
  fetchStackerInfo,
} from "./api";
import {
  checkIsExtendInProgress,
  checkIsIncreaseInProgress,
} from "./userStateUtils";

type PoxInfoType = {
  contract_id: string;
  pox_activation_threshold_ustx: number;
  first_burnchain_block_height: number;
  current_burnchain_block_height: number;
  prepare_phase_block_length: number;
  reward_phase_block_length: number;
  reward_slots: number;
  rejection_fraction: any;
  total_liquid_supply_ustx: number;
  current_cycle: {
    id: number;
    min_threshold_ustx: number;
    stacked_ustx: number;
    is_pox_active: boolean;
  };
  next_cycle: {
    id: number;
    min_threshold_ustx: number;
    min_increment_ustx: number;
    stacked_ustx: number;
    prepare_phase_start_block_height: number;
    blocks_until_prepare_phase: number;
    reward_phase_start_block_height: number;
    blocks_until_reward_phase: number;
    ustx_until_pox_rejection: any;
  };
  epochs: any[];
  min_amount_ustx: number;
  prepare_cycle_length: number;
  reward_cycle_id: number;
  reward_cycle_length: number;
  rejection_votes_left_required: any;
  next_reward_cycle_in: number;
  contract_versions: any[];
};

export type StackerInfoType = StackerInfoExisting | null;

export type StackerInfoExisting = {
  value: {
    "first-reward-cycle": { value: string };
    "lock-period": { value: string };
    "pox-addr": {
      value: { hashbytes: { value: string }; version: { value: string } };
    };
  };
};

type BalancesInfoType = {
  stx: {
    balance: string;
    locked: string;
  };
};

export type AllData = {
  poxInfo: PoxInfoType;
  balancesInfo: BalancesInfoType | null;
  mempoolTransactions: object | null;
  stackerInfo: StackerInfoType;
  amountUpperLimit: BigNumber;
  amountLowerLimit: BigNumber;
  cyclesLimit: number;
  mempoolExtend: number;
  mempoolIncrease: BigNumber;
};

export const fetchData = async (
  address: string | null,
  network: Network
): Promise<AllData> => {
  const poxInfo = await fetchPoxInfo(network);
  const balancesInfo = address ? await fetchBalances(address, network) : null;
  const mempoolTransactions = address
    ? await fetchMempoolTransactions(address, network)
    : null;
  const stackerInfo = address ? await fetchStackerInfo(address, network) : null;

  const amountUpperLimit = BigNumber(
    balancesInfo
      ? Math.max(
          (parseInt(balancesInfo.stx.balance) -
            parseInt(balancesInfo.stx.locked) -
            10000000) /
            1000000,
          0
        )
      : 0
  );

  const amountLowerLimit = BigNumber(
    poxInfo ? parseInt(poxInfo.next_cycle.min_threshold_ustx) / 1000000 : 0
  );

  const cyclesLimit = poxInfo
    ? stackerInfo
      ? 12 -
        (parseInt(stackerInfo.value["first-reward-cycle"].value) +
          parseInt(stackerInfo.value["lock-period"].value) -
          Math.max(
            poxInfo.current_cycle.id,
            parseInt(stackerInfo.value["first-reward-cycle"].value)
          ))
      : 12
    : 0;

  const mempoolExtend =
    checkIsExtendInProgress(mempoolTransactions, network).extendCount || 0;
  const mempoolIncrease =
    checkIsIncreaseInProgress(mempoolTransactions, network).increaseAmount ||
    BigNumber(0);

  return {
    poxInfo,
    balancesInfo,
    mempoolTransactions,
    stackerInfo,
    amountUpperLimit,
    amountLowerLimit,
    cyclesLimit,
    mempoolExtend,
    mempoolIncrease,
  };
};
