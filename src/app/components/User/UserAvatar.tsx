"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";
import { Button } from "@nextui-org/button";
import { explorerAddressUrl, getShorterAddress } from "../../utils";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import { useTheme } from "next-themes";
import { LeavePage } from "../Images/LeavePage";

export const UserAvatar = () => {
  const { login, isAuthenticated } = useContext(AuthContext);
  const [render, setRender] = useState(false);
  const isMediumDevice = useMediaQuery({ query: "(min-width: 768px)" });
  const [buttonSize, setButtonSize] = useState<"md" | "lg">("md");

  useEffect(() => {
    if (isMediumDevice) {
      setButtonSize("md");
    } else {
      setButtonSize("lg");
    }
  }, [isMediumDevice]);

  useEffect(() => {
    setRender(true);
  }, []);

  return (
    <div>
      {render && isAuthenticated() ? (
        <UserAvatarSTXAddress />
      ) : (
        <div>
          <Button
            color="primary"
            variant="shadow"
            onClick={() => login()}
            size={buttonSize}
          >
            Connect Wallet
          </Button>
        </div>
      )}
    </div>
  );
};

export const UserAvatarSTXAddress = () => {
  const { isAuthenticated, user, network } = useContext(AuthContext);
  const { theme } = useTheme();
  return (
    <div>
      {isAuthenticated() && user ? (
        <div
          className={
            theme === "light"
              ? "flex flex-row justify-center rounded-xl border-2 p-2 bg-[#F5F5F5] border-[#F5F5F5] text-black"
              : "flex flex-row justify-center rounded-xl border-2 p-2 bg-[#3F3F3F] border-[#3F3F3F] text-white"
          }
          style={{ cursor: "pointer" }}
        >
          <Link
            href={explorerAddressUrl(
              user?.stxAddress[
                network === "nakamoto-testnet" ? "testnet" : network
              ],
              network
            )}
            className="flex items-center justify-center mr-1"
            target="new"
          >
            <p>
              {getShorterAddress(
                user?.stxAddress[
                  network === "nakamoto-testnet" ? "testnet" : network
                ]
              )}
            </p>
          </Link>
          <LeavePage width={25} inverted={false}></LeavePage>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};
