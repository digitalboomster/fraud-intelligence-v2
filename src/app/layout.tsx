import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import { AppStateProvider } from "@/lib/app-state";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

export const metadata: Metadata = {
  title: "Savvy Fraud Intelligence",
  description: "Dark intelligence operations workspace for fraud monitoring and investigation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={publicSans.variable}>
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
