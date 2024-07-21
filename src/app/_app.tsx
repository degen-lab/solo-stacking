import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import React from "react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
    </React.StrictMode>
  );
}
