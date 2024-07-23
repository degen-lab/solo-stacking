import {
  fetchActivationBurnchainBlockHeight,
  fetchCurrentBurnchainBlockHeight,
} from "@/app/utils/api";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Network } from "@/app/contexts/AuthContext";
import { theoreticalRewarded } from "./mockTheoretical";
import { practicalRewarded } from "./mockPractical";
import { getRewards } from "./wantedData";
import {
  ColumnFiltersState,
  OnChangeFn,
  RowData,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { columnsMap } from "../Table/ColumnDefinitions";
import { CustomColumnDef } from "@/app/types/tableTypes";
import { TableComponent } from "../Table/TableComponent";

export const Rewards = () => {
  const network = (process.env.NEXT_PUBLIC_NETWORK ||
    "mainnet") as unknown as Network;
  const [activationBurnchainBlockHeight, setActivationBurnchainBlockHeight] =
    useState(null);
  const [currentBurnchainBlockHeight, setCurrentBurnchainBlockHeight] =
    useState(null);

  useEffect(() => {
    const getActivationBurnchainBlockHeight = async () => {
      const height = await fetchActivationBurnchainBlockHeight(network);
      setActivationBurnchainBlockHeight(height);
    };

    getActivationBurnchainBlockHeight();
  }, [network]);

  // get currentBlockHeight
  useEffect(() => {
    const getCurrentBurnchainBlockHeight = async () => {
      const height = await fetchCurrentBurnchainBlockHeight(network);
      setCurrentBurnchainBlockHeight(height);
    };

    getCurrentBurnchainBlockHeight();
  }, [network]);

  // const { data, error, isLoading } = useQuery({
  //   queryKey: ["user-data", user?.stxAddress ? user.stxAddress : null, network],
  //   queryFn: () => fetchActivationBurnchainBlockHeight(network),
  //   refetchInterval: 10000,
  // });
  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error loading data</div>;

  // what was actually rewarded
  // ❯ curl -X GET "https://api.mainnet.hiro.so/extended/v1/burnchain/reward_slot_holders/1HZPdkmFNt53uYd9jihqL4B6YRy5MjVJNc"
  // API_PRACTICAL_REWARDS_POX_URL() connected address
  // how to go? while current > activation
  // fetch limit starting from current
  // current - limit
  // add values to list[]

  // what should have been rewarded
  // ❯ curl -X GET "https://api.mainnet.hiro.so/extended/v1/burnchain/rewards/1HZPdkmFNt53uYd9jihqL4B6YRy5MjVJNc"

  console.log("rewards: ", getRewards(practicalRewarded, theoreticalRewarded));
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

  // const { data, isLoading, error } = useFetchTableDataWithQuery(
  //   SERVER_URL,
  //   10000
  // );
  const data = getRewards(practicalRewarded, theoreticalRewarded);

  const currentColumns = useMemo(() => columnsMap[activeTab], [activeTab]);
  const currentData = useMemo(() => data ?? [], [data, activeTab]);

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
    Object.keys(columnsMap).forEach((tab) => {
      initialStates[tab] = {
        visibility: {},
        filters: [],
        sorting: [],
      };
      columnsMap[tab].forEach((column) => {
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

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowColumnToggle(!showColumnToggle)}
          className="bg-orange-500 hover:bg-orange-600 dark:bg-transparent dark:border dark:border-orange-500 dark:text-orange-500 dark:hover:bg-orange-500 dark:hover:text-white text-white px-4 py-2 rounded-md transition-colors duration-200 ease-in-out"
        >
          {showColumnToggle ? "Hide" : "Show"} Column Visibility Settings
        </button>
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
      <div className="flex space-x-2">
        <button
          onClick={zoomIn}
          className="bg-orange-500 hover:bg-orange-600 dark:bg-transparent dark:border dark:border-orange-500 dark:text-orange-500 dark:hover:bg-orange-500 dark:hover:text-white text-white px-4 py-2 rounded-md transition-colors duration-200 ease-in-out"
        >
          Zoom In
        </button>
        <button
          onClick={zoomOut}
          className="bg-orange-500 hover:bg-orange-600 dark:bg-transparent dark:border dark:border-orange-500 dark:text-orange-500 dark:hover:bg-orange-500 dark:hover:text-white text-white px-4 py-2 rounded-md transition-colors duration-200 ease-in-out"
        >
          Zoom Out
        </button>
        <button
          onClick={resetZoom}
          className="bg-orange-500 hover:bg-orange-600 dark:bg-transparent dark:border dark:border-orange-500 dark:text-orange-500 dark:hover:bg-orange-500 dark:hover:text-white text-white px-4 py-2 rounded-md transition-colors duration-200 ease-in-out"
        >
          Reset Zoom
        </button>
      </div>
      <ul className="flex border-b mb-4 overflow-x-auto whitespace-nowrap">
        {Object.keys(columnsMap).map((tab) => (
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
          data={data}
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

  return (
    <div>
      <h1>Rewards</h1>
      <p>
        This rewards include all the sats earned through Stacking starting with
        POX-4 from all the stacking methods
      </p>
      <div>
        Activation Burnchain Block Height: {activationBurnchainBlockHeight}
      </div>
      <div>Current Burnchain Block Height: {currentBurnchainBlockHeight}</div>
      {/* Render additional data here */}
    </div>
  );
};
