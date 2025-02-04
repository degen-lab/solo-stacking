import BigNumber from "bignumber.js";
import { Network } from "../contexts/AuthContext";
import {
  BurnchainReward,
  BurnchainRewardSlotHolder,
  fetchAllPracticalRewards,
  fetchAllTheoreticalRewardsAndTotal,
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
  epochs: Epoch[];
  min_amount_ustx: number;
  prepare_cycle_length: number;
  reward_cycle_id: number;
  reward_cycle_length: number;
  rejection_votes_left_required: any;
  next_reward_cycle_in: number;
  contract_versions: ContractVersion[];
};

interface ContractVersion {
  contract_id: string;
  activation_burnchain_block_height: number;
  first_reward_cycle_id: number;
}

interface BlockLimit {
  write_length: number;
  write_count: number;
  read_length: number;
  read_count: number;
  runtime: number;
}

interface Epoch {
  epoch_id: string;
  start_height: number;
  end_height: number;
  block_limit: BlockLimit;
  network_epoch: number;
}

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

export type PoxUserData = {
  poxInfo: PoxInfoType;
  balancesInfo: BalancesInfoType | null;
  mempoolTransactions: object | null;
  stackerInfo: StackerInfoType;
  amountUpperLimit: BigNumber;
  amountLowerLimit: BigNumber;
  cyclesLimit: number;
  mempoolExtend: number;
  mempoolIncrease: BigNumber;
  activationBurnchainBlockHeight: number;
};

export const fetchPoxUserData = async (
  address: string | null,
  network: Network
): Promise<PoxUserData> => {
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

  const activationBurnchainBlockHeight =
    poxInfo.contract_versions[3].activation_burnchain_block_height;

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
    activationBurnchainBlockHeight,
  };
};

export type RewardsDataType = {
  theoreticalRewards: BurnchainRewardSlotHolder[];
  practicalRewards: BurnchainReward[];
};

export const fetchRewardsData = async (
  address: string,
  network: Network,
  limit: number
): Promise<RewardsDataType> => {
  const {
    theoreticalRewardSlotsList: theoreticalRewards,
    totalRewardSlots: totalTheoreticalRewards,
  } = await fetchAllTheoreticalRewardsAndTotal(address, network, limit);
  const practicalRewards = await fetchAllPracticalRewards(
    address,
    network,
    limit,
    totalTheoreticalRewards
  );

  return { theoreticalRewards, practicalRewards };
};
