import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import AuthContextProvider from "./contexts/AuthContext";
import { NavbarSoloStacking } from "./components/Navbar/Navbar";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";

const inter = Roboto({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Stacks Solo Stacking",
  description: "The solo stacking solution by Degen Lab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthContextProvider>
            <div className="flex flex-col min-h-screen">
              <NavbarSoloStacking />
              <main className="flex-grow">{children}</main>
            </div>
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
