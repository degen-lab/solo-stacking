import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getRewards } from "./wantedData";
import {
  ColumnFiltersState,
  OnChangeFn,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { getColumnsMap } from "../Table/ColumnDefinitions";
import { CustomColumnDef, RowData } from "@/app/types/tableTypes";
import { TableComponent } from "../Table/TableComponent";
import { RewardsDataType } from "@/app/utils/queryFunctions";
import { useTheme } from "next-themes";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/contexts/AuthContext";
import { useAtom } from "jotai";
import { rewardsBtcAddressAtom } from "@/app/utils/atoms";
import CustomErrorMessage from "../ErrorMessage/CustomErrorMessage";
import { isValidBitcoinAddress } from "@/app/utils/validatorUtils";
import { useNetwork } from "@/app/contexts/NetworkContext";

export const Rewards: React.FC<{ rewardsData: RewardsDataType }> = ({
  rewardsData,
}) => {
  const { theme } = useTheme();
  const { isAuthenticated, btcAddress } = useContext(AuthContext);
  const { network } = useNetwork();
  const [rewardsBtcAddress, setRewardsBtcAddress] = useAtom<string>(
    rewardsBtcAddressAtom
  );
  const [touchedRewBtcAddr, setTouchedRewBtcAddr] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    setRewardsBtcAddress(btcAddress || "");
  }, [btcAddress]);

  if (!theme || (theme !== "dark" && theme !== "light"))
    throw new Error("Invalid Theme State");
  console.log("data:::", rewardsData);
  const [displayedRewards, setDisplayedRewards] = useState<RowData[]>([]);
  useEffect(() => {
    if (
      rewardsData.practicalRewards.length > 0 &&
      rewardsData.theoreticalRewards.length > 0
    )
      setDisplayedRewards(
        getRewards(rewardsData.practicalRewards, rewardsData.theoreticalRewards)
      );
  }, [rewardsData]);

  const [activeTab, setActiveTab] = useState<string>("Standard");
  const [columnVisibilityMap, setColumnVisibilityMap] = useState<
    Record<string, VisibilityState>
  >({});
  const [filterStates, setFilterStates] = useState<
    Record<string, ColumnFiltersState>
  >({});
  const [sortStates, setSortStates] = useState<Record<string, SortingState>>(
    {}
  );
  const [showColumnToggle, setShowColumnToggle] = useState(false);

  const currentColumns = useMemo(
    () => getColumnsMap(network, theme)[activeTab],
    [activeTab]
  );

  const [zoomLevel, setZoomLevel] = useState(100);
  const defaultZoom = 100;

  useEffect(() => {
    document.body.style.transform = `scale(${zoomLevel / 100})`;
    document.body.style.transformOrigin = "top left";
    document.body.style.width = `${10000 / zoomLevel}%`;
  }, [zoomLevel]);

  const zoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 5, 200));
  };

  const zoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 5, 35));
  };

  const resetZoom = () => {
    setZoomLevel(defaultZoom);
  };

  // Initialize states for all tabs
  useEffect(() => {
    interface InitialState {
      visibility: VisibilityState;
      filters: ColumnFiltersState;
      sorting: SortingState;
    }

    const initialStates: Record<string, InitialState> = {};
    Object.keys(getColumnsMap(network, theme)).forEach((tab) => {
      initialStates[tab] = {
        visibility: {},
        filters: [],
        sorting: [],
      };
      getColumnsMap(network, theme)[tab].forEach((column) => {
        initialStates[tab].visibility[column.accessorKey as string] = true;
      });
    });
    setColumnVisibilityMap(
      Object.fromEntries(
        Object.entries(initialStates).map(([key, value]) => [
          key,
          value.visibility,
        ])
      )
    );
    setFilterStates(
      Object.fromEntries(
        Object.entries(initialStates).map(([key, value]) => [
          key,
          value.filters,
        ])
      )
    );
    setSortStates(
      Object.fromEntries(
        Object.entries(initialStates).map(([key, value]) => [
          key,
          value.sorting,
        ])
      )
    );
  }, []);

  const showErrorMessage = () => {
    return (
      touchedRewBtcAddr &&
      !isValidBitcoinAddress(
        rewardsBtcAddress,
        network === "nakamoto-testnet" ? "testnet" : network
      )
    );
  };

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = useCallback(
    (updater) => {
      setColumnVisibilityMap((prev) => ({
        ...prev,
        [activeTab]:
          typeof updater === "function" ? updater(prev[activeTab]) : updater,
      }));
    },
    [activeTab]
  );

  const handleFilterChange: OnChangeFn<ColumnFiltersState> = useCallback(
    (updater) => {
      setFilterStates((prev) => ({
        ...prev,
        [activeTab]:
          typeof updater === "function" ? updater(prev[activeTab]) : updater,
      }));
    },
    [activeTab]
  );

  const handleSortingChange: OnChangeFn<SortingState> = useCallback(
    (updater) => {
      setSortStates((prev) => ({
        ...prev,
        [activeTab]:
          typeof updater === "function" ? updater(prev[activeTab]) : updater,
      }));
    },
    [activeTab]
  );

  if (displayedRewards)
    return (
      <div className="flex flex-col h-screen p-4">
        <div className="flex flex-col text-center items-center">
          <h2 className="mb-4 mt-4">PoX Address</h2>
          <Input
            className="mb-6 w-[15rem]"
            placeholder={btcAddress || "Enter BTC Address"}
            onChange={(e) => {
              if (e.target.value === "") {
                setTouchedRewBtcAddr(false);
                setRewardsBtcAddress(btcAddress || "");
              } else {
                setTouchedRewBtcAddr(true);
                setRewardsBtcAddress(e.target.value);
              }
            }}
          ></Input>
          {showErrorMessage() && (
            <CustomErrorMessage message="Please enter a valid BTC address." />
          )}
        </div>
        <div className="flex justify-center mb-4 ">
          <Button
            onClick={() => setShowColumnToggle(!showColumnToggle)}
            color="primary"
            variant="ghost"
            className="hover:text-white"
          >
            {showColumnToggle ? "Hide" : "Show"} Column Visibility Settings
          </Button>
          {showColumnToggle && (
            <div className="flex overflow-x-auto space-x-4">
              {currentColumns.map((column: CustomColumnDef<RowData>) => (
                <label
                  key={column.accessorKey as string}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={
                      columnVisibilityMap[activeTab]?.[
                        column.accessorKey as string
                      ]
                    }
                    onChange={() =>
                      handleColumnVisibilityChange((prev) => ({
                        ...prev,
                        [column.accessorKey as string]:
                          !prev[column.accessorKey as string],
                      }))
                    }
                  />
                  <span>{column.header?.toString()}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-center space-x-2">
          <Button
            onClick={zoomIn}
            color="primary"
            variant="ghost"
            className="hover:text-white"
          >
            Zoom In
          </Button>
          <Button
            onClick={zoomOut}
            color="primary"
            variant="ghost"
            className="hover:text-white"
          >
            Zoom Out
          </Button>
          <Button
            onClick={resetZoom}
            color="primary"
            variant="ghost"
            className="hover:text-white"
          >
            Reset Zoom
          </Button>
        </div>
        <ul className="flex border-b mb-4 overflow-x-auto whitespace-nowrap">
          {Object.keys(getColumnsMap(network, theme)).map((tab) => (
            <li
              key={tab}
              onClick={() => handleTabChange(tab)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleTabChange(tab);
                }
              }}
              role="tab"
              tabIndex={0}
              className={`cursor-pointer mr-4 px-4 py-2 text-center ${
                activeTab === tab ? "border-b-2 border-black" : ""
              }`}
            >
              {tab
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </li>
          ))}
        </ul>
        <div className="flex-1 overflow-y-auto pb-12">
          <TableComponent
            columns={currentColumns}
            data={displayedRewards}
            columnVisibility={columnVisibilityMap[activeTab] || {}}
            setColumnVisibility={handleColumnVisibilityChange}
            filters={filterStates[activeTab] || []}
            onFiltersChange={handleFilterChange}
            sorting={sortStates[activeTab] || []}
            onSortingChange={handleSortingChange}
          />
        </div>
      </div>
    );

  return null;
};
