import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "404 - Not Found",
  description: "Page not found.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="w-screen h-screen overflow-hidden bg-[#e6e4dc] text-[#1d1d1d] selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
