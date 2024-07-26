import { CustomColumnDef, RowData } from "@/app/types/tableTypes";
import { formatNumber, shortenAddress } from "@/app/utils/formatters";
import {
  GET_BITCOIN_BLOCK_HASH_EXPLORER_URL,
  MEMPOOL_URL_ADDRESS,
} from "@/app/consts/api";
import { Network } from "@/app/contexts/AuthContext";

const createBitcoinAddressColumn = (
  network: Network,
  theme: "dark" | "light" | "system"
): CustomColumnDef<RowData> => ({
  header: "Address",
  accessorKey: "address",
  filterType: "text",
  cell: ({ getValue }) => {
    const poxAddress = getValue<string>();
    const shortPoxAddress = shortenAddress(poxAddress);
    const isDark = theme === "dark";

    return (
      <a
        href={MEMPOOL_URL_ADDRESS(network, poxAddress)}
        target="_blank"
        rel="noopener noreferrer"
        className={
          isDark
            ? "text-orange-400 hover:underline"
            : "text-orange-600 hover:underline"
        }
      >
        {shortPoxAddress}
      </a>
    );
  },
});

const createAmountSatsColumn = (): CustomColumnDef<RowData> => ({
  header: "Amount",
  accessorKey: "reward_amount",
  filterType: "number",
  cell: ({ getValue }) => formatNumber(getValue<number>()),
});

const createBurnBlockHeightColumn = (): CustomColumnDef<RowData> => ({
  header: "Burn Block Height",
  accessorKey: "burn_block_height",
  filterType: "number",
});

//// Detailed columns

const createCanonicalColumn = (): CustomColumnDef<RowData> => ({
  header: "Canonical",
  accessorKey: "canonical",
  filterType: "text",
});

const createBurnBlockHashColumn = (
  network: Network,
  theme: "dark" | "light" | "system"
): CustomColumnDef<RowData> => ({
  header: "Burn Block Hash",
  accessorKey: "burn_block_hash",
  filterType: "text",
  cell: ({ getValue }) => {
    const blockHash = getValue<string>();
    const shortBlockHash = shortenAddress(blockHash, 5);
    const isDark = theme === "dark";
    return (
      <a
        href={GET_BITCOIN_BLOCK_HASH_EXPLORER_URL(network, blockHash)}
        target="_blank"
        rel="noopener noreferrer"
        className={
          isDark
            ? "text-purple-400 hover:underline"
            : "text-purple-600 hover:underline"
        }
      >
        {shortBlockHash}
      </a>
    );
  },
});

const createBurnAmountColumn = (): CustomColumnDef<RowData> => ({
  header: "Burn Amount",
  accessorKey: "burn_amount",
  filterType: "text",
});

const createRewardIndexColumn = (): CustomColumnDef<RowData> => ({
  header: "Reward Index",
  accessorKey: "reward_index",
  filterType: "number",
});

const createSlotIndexColumn = (): CustomColumnDef<RowData> => ({
  header: "Slot Index",
  accessorKey: "slot_index",
  filterType: "number",
});

export const getColumnsMap = (
  network: Network,
  theme: "dark" | "light" | "system"
): Record<string, CustomColumnDef<RowData>[]> => ({
  Standard: [
    createBitcoinAddressColumn(network, theme),
    createBurnBlockHeightColumn(),
    createAmountSatsColumn(),
  ],
  Detailed: [
    createBitcoinAddressColumn(network, theme),
    createAmountSatsColumn(),
    createBurnBlockHeightColumn(),
    createCanonicalColumn(),
    createBurnBlockHashColumn(network, theme),
    createBurnAmountColumn(),
    createRewardIndexColumn(),
    createSlotIndexColumn(),
  ],
});
