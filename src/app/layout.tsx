// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";

// ✅ 2. Font & Context
import { Inter } from "next/font/google";
import { ToolProvider } from "@/context/ToolContext";
import { DataProvider } from "@/context/DataContext";

// ✅ 3. Komponen
import AuthCheck from "@/components/AuthCheck";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Vision Traffic Suite",
  description: "WebGIS platform for real-time spatial traffic monitoring.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        {/* ✅ Cek autentikasi */}
        <AuthCheck />

        {/* ✅ Provider untuk state global */}
        <DataProvider>
          <ToolProvider>{children}</ToolProvider>
        </DataProvider>
      </body>
    </html>
  );
}
