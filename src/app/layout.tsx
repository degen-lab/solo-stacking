import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import AuthContextProvider from "./contexts/AuthContext";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ReactQueryProvider } from "./contexts/ReactQueryContext";
import { DetailedViewProvider } from "./contexts/DetailedViewContext";

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
            <ReactQueryProvider>
              <AuthContextProvider>
                <main className="flex-grow">{children}</main>
              </AuthContextProvider>
            </ReactQueryProvider>
          </DetailedViewProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
