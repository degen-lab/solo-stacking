import { RowData as RewardInfo } from "@/app/types/tableTypes";
interface PracticalRewardedInfo {
  canonical: boolean;
  burn_block_hash: string;
  burn_block_height: number;
  burn_amount: string;
  reward_recipient: string;
  reward_amount: string;
  reward_index: number;
}

interface TheoreticalRewardedInfo {
  canonical: boolean;
  burn_block_hash: string;
  burn_block_height: number;
  address: string;
  slot_index: number;
}

export const getRewards = (
  practicalRewarded: PracticalRewardedInfo[],
  theoreticalRewarded: TheoreticalRewardedInfo[]
) => {
  let pIndex = 0;
  let tIndex = 0;
  const rewards: RewardInfo[] = [];
  while (
    pIndex < practicalRewarded.length &&
    tIndex < theoreticalRewarded.length
  ) {
    if (
      practicalRewarded[pIndex].burn_block_height ===
      theoreticalRewarded[tIndex].burn_block_height
    ) {
      const aux: RewardInfo = {
        ...practicalRewarded[pIndex],
        ...theoreticalRewarded[tIndex],
        burn_amount: parseInt(practicalRewarded[pIndex].burn_amount),
        reward_amount: parseInt(practicalRewarded[pIndex].reward_amount),
        canonical: practicalRewarded[pIndex].canonical.toString(),
      };
      delete aux.reward_recipient;
      rewards.push(aux);
      pIndex++;
      tIndex++;
    } else if (
      practicalRewarded[pIndex].burn_block_height >
      theoreticalRewarded[tIndex].burn_block_height
    ) {
      const aux: RewardInfo = {
        ...practicalRewarded[pIndex],
        address: practicalRewarded[pIndex].reward_recipient,
        burn_amount: parseInt(practicalRewarded[pIndex].burn_amount),
        reward_amount: parseInt(practicalRewarded[pIndex].reward_amount),
        canonical: practicalRewarded[pIndex].canonical.toString(),
      };
      delete aux.reward_recipient;
      rewards.push(aux);
      pIndex++;
    } else {
      const aux: RewardInfo = {
        ...theoreticalRewarded[tIndex],
        reward_amount: 0,
        canonical: practicalRewarded[tIndex].canonical.toString(),
      };
      rewards.push(aux);
      tIndex++;
    }
  }

  while (pIndex < practicalRewarded.length) {
    const aux: RewardInfo = {
      ...practicalRewarded[pIndex],
      address: practicalRewarded[pIndex].reward_recipient,
      burn_amount: parseInt(practicalRewarded[pIndex].burn_amount),
      reward_amount: parseInt(practicalRewarded[pIndex].reward_amount),
      canonical: practicalRewarded[pIndex].canonical.toString(),
    };
    delete aux.reward_recipient;
    rewards.push(aux);
    pIndex++;
  }

  while (tIndex < theoreticalRewarded.length) {
    const aux: RewardInfo = {
      ...theoreticalRewarded[tIndex],
      reward_amount: 0,
      canonical: practicalRewarded[tIndex].canonical.toString(),
    };
    delete aux.reward_recipient;
    rewards.push(aux);
    tIndex++;
  }

  return rewards;
};
