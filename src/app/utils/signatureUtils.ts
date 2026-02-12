import { Pox4SignatureTopic } from "@stacks/stacking";
import axios from "axios";
import BigNumber from "bignumber.js";
import { Network } from "../contexts/AuthContext";

export const methodToPox4Topic: Record<string, Pox4SignatureTopic> = {
  "stack-stx": Pox4SignatureTopic.StackStx,
  "stack-extend": Pox4SignatureTopic.StackExtend,
  "stack-increase": Pox4SignatureTopic.StackIncrease,
};

export const randomAuthId = () => {
  return Date.now();
};

export const getStackingSignature = (
  topic: Pox4SignatureTopic,
  poxAddress: string,
  rewardCycle: number,
  period: number,
  maxAmount: BigNumber,
  network: Network
) => {
  const signature = axios
    .post("https://services.degenlab.io/get-signature", {
      maxAmount,
      period,
      poxAddress,
      rewardCycle,
      topic,
      network,
    })
    .then((response) => response.data);

  return signature;
};
