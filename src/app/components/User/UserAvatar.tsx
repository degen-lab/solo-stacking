"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";
import { Button } from "@nextui-org/button";
import { getShortAddress } from "../../utils";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";

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
  return (
    <div>
      {isAuthenticated() && user ? (
        <div
          className="rounded-xl border-2 p-2 bg-[#F5F5F5] border-[#F5F5F5]"
          style={{ cursor: "pointer" }}
        >
          <Link
            // TODO: modularize this link
            href={`https://explorer.hiro.so/address/${
              user?.stxAddress[network === "nakamoto" ? "testnet" : network]
            }?chain=mainnet`}
            target="new"
          >
            <p className="text-black">
              {getShortAddress(
                user?.stxAddress[network === "nakamoto" ? "testnet" : network]
              )}
            </p>
          </Link>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};
