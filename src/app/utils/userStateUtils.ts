import BigNumber from "bignumber.js";
import { POX_4_CONTRACT_ADDRESS, POX_4_CONTRACT_NAME } from "../consts/api";
import { Network } from "../contexts/AuthContext";

export const checkIsStackingInProgress = (
  mempoolTransactions: any,
  network: Network
) => {
  if (!mempoolTransactions || mempoolTransactions.results === undefined)
    return { result: false, txid: null };

  for (const transaction of mempoolTransactions.results) {
    if (
      transaction.contract_call.contract_id ===
        `${POX_4_CONTRACT_ADDRESS(network)}.${POX_4_CONTRACT_NAME}` &&
      transaction.contract_call.function_name === "stack-stx"
    )
      return {
        result: true,
        txid: transaction.tx_id,
      };
  }

  return {
    result: false,
    txid: null,
  };
};

export const checkIsExtendInProgress = (
  mempoolTransactions: any,
  network: Network
) => {
  if (!mempoolTransactions || mempoolTransactions.results === undefined)
    return { result: false, extendCount: null, txid: null };
  for (const transaction of mempoolTransactions.results) {
    if (
      transaction.contract_call.contract_id ===
        `${POX_4_CONTRACT_ADDRESS(network)}.${POX_4_CONTRACT_NAME}` &&
      transaction.contract_call.function_name === "stack-extend"
    )
      return {
        result: true,
        extendCount: parseInt(
          transaction.contract_call.function_args[0].repr.slice(1)
        ),
        txid: transaction.tx_id,
      };
  }

  return {
    result: false,
    extendCount: null,
    txid: null,
  };
};

export const checkIsIncreaseInProgress = (
  mempoolTransactions: any,
  network: Network
) => {
  if (!mempoolTransactions || mempoolTransactions.results === undefined)
    return { result: false, increaseAmount: null, txid: null };
  for (const transaction of mempoolTransactions.results) {
    if (
      transaction.contract_call.contract_id ===
        `${POX_4_CONTRACT_ADDRESS(network)}.${POX_4_CONTRACT_NAME}` &&
      transaction.contract_call.function_name === "stack-increase"
    )
      return {
        result: true,
        increaseAmount: BigNumber(
          transaction.contract_call.function_args[0].repr.slice(1)
        ),
        txid: transaction.tx_id,
      };
  }

  return {
    result: false,
    increaseAmount: null,
    txid: null,
  };
};
