"use client";
import { Network } from "@/app/contexts/AuthContext";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useNetwork } from "@/app/contexts/NetworkContext";
import { networkInfo } from "@/app/consts/network";

export const NetworkDropdown = () => {
  const { networksList } = useNetwork();

  return (
    <Dropdown
      closeOnSelect={true}
      className="rounded-lg border-2 border-[#f5f5f5]"
    >
      <DropdownTrigger>
        <div>
          <SelectedNetwork />
        </div>
      </DropdownTrigger>
      <DropdownMenu>
        {networksList.map((network) => (
          <DropdownItem key={network}>
            <NetworkOption network={network} />
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export const SelectedNetwork: React.FC = () => {
  const { network } = useNetwork();
  const { resolvedTheme: theme } = useTheme();

  return (
    <div
      // className={`w-36 rounded-xl text-center bg-transparent p-2 border-1 border-${
      //   theme === "dark" ? "white" : "black"
      // }`}
      // style={{ cursor: "pointer" }}
      className="w-36 rounded-xl text-center bg-transparent p-2 border-1 border-black dark:border-white"
      style={{ cursor: "pointer" }}
    >
      <div className="text-sm">{networkInfo[network].title}</div>
    </div>
  );
};

export const NetworkOption: React.FC<{ network: Network }> = ({ network }) => {
  const { updateNetwork } = useNetwork();

  return (
    <div
      className="text-center rounded-xl text-center bg-[#FA5512] p-1"
      style={{ cursor: "pointer" }}
      onClick={() => updateNetwork(network)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          updateNetwork(network);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="text-md text-white">{networkInfo[network].title}</div>
      <div className="text-xs text-white">{networkInfo[network].url}</div>
    </div>
  );
};
