"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HeaderBar() {
  const router = useRouter();
  const [userName, setUserName] = useState("Pengguna");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.name) setUserName(parsed.name);
      } catch {
        setUserName("Pengguna");
      }
    }
  }, []);

  const handleLogout = () => {
    if (confirm("Yakin ingin logout?")) {
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      {/* Kiri: Logo + Nama Web */}
      <div className="flex items-center space-x-3">
        <img src="/Logo.svg" alt="Logo Jangkar" className="h-8 w-8" />
        <span className="text-lg font-semibold text-blue-800">
          Vision Traffic Suite
        </span>
      </div>

      {/* Kanan: Status Aktif + Nama + Logout */}
      <div className="flex items-center space-x-3 text-sm">
        <img
          src="/Active.svg"
          alt="User Active"
          className="h-4 w-4 animate-pulse"
          title="Pengguna aktif"
        />
        <span className="text-slate-800 font-medium">{userName}</span>
        <span className="text-gray-300">|</span>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:underline"
          title="Keluar dari sistem"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
