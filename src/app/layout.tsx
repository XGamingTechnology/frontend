// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { ToolProvider } from "@/context/ToolContext"; // ✅ import ToolProvider
import { DataProvider } from "@/context/DataContext"; // ✅ import DataProvider
// ... impor lainnya jika ada

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Vision Traffic Suite",
  description: "WebGIS platform for real-time spatial traffic monitoring.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        {/* Bungkus seluruh aplikasi dengan DataProvider */}
        {/* Dan juga ToolProvider */}
        <DataProvider>
          <ToolProvider>{children}</ToolProvider>
        </DataProvider>
      </body>
    </html>
  );
}
