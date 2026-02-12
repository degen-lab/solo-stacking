"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/navbar";
import { Divider, Link } from "@nextui-org/react";
import Image from "next/image";
import { useContext, useState } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";
import { Button } from "@nextui-org/button";
import { UserAvatar, UserAvatarSTXAddress } from "../User/UserAvatar";
import { HamburgerDropdown } from "./Dropdown";
import { ThemeSwitch } from "./ThemeSwitch";
import { useTheme } from "next-themes";
import { DetailedViewSwitch } from "./DetailedViewSwitch";
import { NetworkDropdown } from "./NetworkDropdown";

export interface NavbarItem {
  name: string;
  location: string;
  color?:
    | "foreground"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
}

export const NavbarSoloStacking = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { resolvedTheme: theme } = useTheme();
  const { isAuthenticated, login, logout, isLoggingOut } =
    useContext(AuthContext);

  return (
    <Navbar className="p-0 m-0" onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent justify="start">
        <Link color="foreground" href="/">
          <Image
            src="/stacks-logo.png"
            alt="Stacks Solo Stacking"
            priority
            width={30}
            height={30}
          />
        </Link>
      </NavbarContent>
      <NavbarContent className="p-0" justify="center">
        <NavbarBrand>
          <Link color="foreground" href="/">
            <p className="text-xl font-extrabold text-inherit">
              Stacks Solo Stacking
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden lg:flex" justify="end">
        <NetworkDropdown></NetworkDropdown>
        <UserAvatar></UserAvatar>
        <HamburgerDropdown />
      </NavbarContent>

      <NavbarContent
        justify="end"
        className="lg:hidden p-0"
        suppressHydrationWarning
      >
        <div className={theme === "dark" ? "fill-white" : "fill-black"}>
          <NavbarMenuToggle
            icon={isMenuOpen ? "x" : "≡"}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </div>
      </NavbarContent>

      <NavbarMenu className="text-center">
        <NavbarMenuItem className="mb-4">
          <UserAvatarSTXAddress />
        </NavbarMenuItem>
        <NavbarMenuItem className="mb-4">
          <ThemeSwitch />
        </NavbarMenuItem>
        <NavbarMenuItem className="mb-4">
          <DetailedViewSwitch />
        </NavbarMenuItem>
        {isAuthenticated() && (
          <>
            <Divider className="mb-4" />
            <NavbarMenuItem className="mb-4">
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
            </NavbarMenuItem>
          </>
        )}
        <Divider className="mb-4" />
        <NavbarMenuItem className="mb-4">
          {isAuthenticated() ? (
            <Button
              color="primary"
              variant="ghost"
              onClick={logout}
              isLoading={isLoggingOut}
            >
              {isLoggingOut ? "Disconnecting..." : "Logout"}
            </Button>
          ) : (
            <Button color="primary" variant="ghost" onClick={() => login()}>
              Connect Wallet
            </Button>
          )}
        </NavbarMenuItem>
        <NavbarMenuItem className="flex text-center justify-center">
          <NetworkDropdown></NetworkDropdown>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};
