"use client";
import { AuthContext } from "@/app/contexts/AuthContext";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
} from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ThemeSwitch } from "./ThemeSwitch";
import { DetailedViewSwitch } from "./DetailedViewSwitch";

export const HamburgerDropdown = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { resolvedTheme: theme } = useTheme();
  const [render, setRender] = useState(false);

  useEffect(() => {
    setRender(true);
  }, []);
  if (isAuthenticated())
    return (
      <Dropdown
        closeOnSelect={false}
        className="rounded-lg border-2 border-[#f5f5f5]"
      >
        <DropdownTrigger>
          <Image
            src="/hamburger.png"
            className={render && theme === "dark" ? "invert" : "invert-0"}
            style={{ cursor: "pointer" }}
            alt="hamburger"
            width={30}
            height={30}
          />
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem key="theme">
            <ThemeSwitch />
          </DropdownItem>
          <DropdownItem key="detailed" showDivider>
            <DetailedViewSwitch />
          </DropdownItem>
          <DropdownItem showDivider>
            <div className="flex items-center justify-center">
              <Link
                href="/rewards"
                className={`text-center items-center text-[${
                  theme === "dark" ? "white" : "black"
                }]`}
              >
                Rewards
              </Link>
            </div>
          </DropdownItem>
          <DropdownItem
            key="logout"
            className="text-center"
            onClick={() => logout()}
          >
            Logout
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );

  return (
    <Dropdown
      closeOnSelect={false}
      className="rounded-lg border-2 border-[#f5f5f5]"
    >
      <DropdownTrigger>
        <Image
          src="/hamburger.png"
          className={render && theme === "dark" ? "invert" : "invert-0"}
          style={{ cursor: "pointer" }}
          alt="hamburger"
          width={30}
          height={30}
        />
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key="theme">
          <ThemeSwitch />
        </DropdownItem>
        <DropdownItem key="detailed">
          <DetailedViewSwitch />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
