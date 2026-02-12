"use client";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useAuth } from "@/app/contexts/AuthContext";
import { networkInfo } from "@/app/consts/network";
import { useState, useEffect } from "react";

export const NetworkDropdown = () => {
  return (
    <Dropdown
      closeOnSelect={true}
      className="rounded-lg border border-[#f5f5f5]"
    >
      <DropdownTrigger>
        <div>
          <SelectedNetwork />
        </div>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem>
          <NetworkInfoMessage />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export const SelectedNetwork: React.FC = () => {
  const { network } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="w-36 rounded-xl text-center bg-transparent p-2 border-1 border-black dark:border-white"
      style={{ cursor: "pointer" }}
    >
      <div className="text-sm">
        {mounted ? networkInfo[network].title : "Loading..."}
      </div>
    </div>
  );
};

export const NetworkInfoMessage: React.FC = () => {
  return (
    <div className="text-center p-3">
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
        Change network from wallet settings and connect again.
      </div>
    </div>
  );
};
