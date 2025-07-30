"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Tipe data user sesuai backend
interface User {
  id: string;
  username: string;
  role: "user" | "admin";
  fullName?: string;
  email: string;
  avatarUrl?: string;
}

export default function HeaderBar() {
  const router = useRouter();
  const [userName, setUserName] = useState("Pengguna");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User;
        // Gunakan fullName jika ada, fallback ke username, lalu ke "Pengguna"
        const displayName = parsed.fullName || parsed.username || "Pengguna";
        setUserName(displayName);
      } catch (error) {
        console.error("Gagal parsing user dari localStorage:", error);
        setUserName("Pengguna");
      }
    } else {
      // Jika tidak ada user, redirect ke login (opsional)
      // router.push("/login"); // aktifkan jika ingin wajib login
    }
  }, []);

  const handleLogout = () => {
    if (confirm("Yakin ingin logout?")) {
      // Hapus data autentikasi
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      // Log aktivitas logout
      console.log("User logout");

      // Redirect
      router.push("/login");
    }
  };

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      {/* Kiri: Logo + Nama Web */}
      <div className="flex items-center space-x-3">
        <img src="/Logo.svg" alt="Logo Jangkar" className="h-8 w-8" />
        <span className="text-lg font-semibold text-blue-800">Vision Traffic Suite</span>
      </div>

      {/* Kanan: Status Aktif + Nama + Logout */}
      <div className="flex items-center space-x-3 text-sm">
        <img src="/Active.svg" alt="User Active" className="h-4 w-4 animate-pulse" title="Pengguna aktif" />
        <span className="text-slate-800 font-medium">{userName}</span>
        <span className="text-gray-300">|</span>
        <button onClick={handleLogout} className="text-red-500 hover:underline" title="Keluar dari sistem">
          Logout
        </button>
      </div>
    </header>
  );
}
