import { Pox4SignatureTopic, StackingClient } from "@stacks/stacking";
import axios from "axios";
import BigNumber from "bignumber.js";

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
  _network: any
) => {
  // TODO: link based on network
  const signature = axios
    .post("http://localhost:8080/get-signature", {
      maxAmount,
      period,
      poxAddress,
      rewardCycle,
      topic,
    })
    .then((response) => response.data);

  return signature;
};
