import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import AuthContextProvider from "./contexts/AuthContext";
import { NavbarSoloStacking } from "./components/Navbar/Navbar";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ReactQueryProvider } from "./contexts/ReactQueryContext";
import { DetailedViewProvider } from "./contexts/DetailedViewContext";
import { NetworkProvider } from "./contexts/NetworkContext";
const inter = Roboto({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Stacks Solo Stacking",
  description: "Solo stacking solution powered by Degen Lab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
        >
          <DetailedViewProvider>
            <NetworkProvider>
              <ReactQueryProvider>
                <AuthContextProvider>
                  <div className="flex flex-col lg:min-h-screen">
                    <NavbarSoloStacking />
                    <main className="flex-grow">{children}</main>
                  </div>
                </AuthContextProvider>
              </ReactQueryProvider>
            </NetworkProvider>
          </DetailedViewProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
