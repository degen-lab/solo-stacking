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

// NavbarItem interface. Useful if we want to add more items to the navbar in the future
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
  const { theme } = useTheme();
  const { isAuthenticated, login, logout } = useContext(AuthContext);

  return (
    <Navbar className="p-0 m-0" onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
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
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className={
            theme === "dark"
              ? "text-white md:hidden p-0"
              : "text-black md:hidden p-0"
          }
        />
      </NavbarContent>
      <NavbarContent className="hidden md:flex" justify="end">
        <UserAvatar></UserAvatar>
        <HamburgerDropdown />
      </NavbarContent>

      <NavbarMenu className="text-center">
        <NavbarMenuItem className="mb-4">
          <UserAvatarSTXAddress />
        </NavbarMenuItem>
        <NavbarMenuItem className="mb-4">
          <ThemeSwitch />
          <Divider />
        </NavbarMenuItem>
        <NavbarMenuItem className="mb-4">
          {isAuthenticated() ? (
            <Button color="primary" variant="ghost" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Button color="primary" variant="ghost" onClick={() => login()}>
              Connect Wallet
            </Button>
          )}
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};
