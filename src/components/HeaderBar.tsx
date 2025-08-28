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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
      } catch (error) {
        console.error("Gagal parsing user dari localStorage:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        router.push("/login");
      }
    } else {
      // Jika tidak ada user, redirect ke login
      router.push("/login");
    }
  }, [router]);

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

  if (!user) {
    return null; // Atau loading spinner
  }

  const displayName = user.fullName || user.username || "Pengguna";

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      {/* Kiri: Logo + Nama Web */}
      <div className="flex items-center space-x-3">
        <img src="/Logo.svg" alt="Logo Jangkar" className="h-8 w-8" />
        <span className="text-lg font-semibold text-blue-800">Vision Traffic Suite</span>
      </div>

      {/* Kanan: Status + Nama + Admin Button (jika admin) + Logout */}
      <div className="flex items-center space-x-3 text-sm">
        <img src="/Active.svg" alt="User Active" className="h-4 w-4 animate-pulse" title="Pengguna aktif" />
        <span className="text-slate-800 font-medium">{displayName}</span>

        {/* 🔧 Tombol Admin - Hanya muncul untuk admin */}
        {user.role === "admin" && (
          <>
            <span className="text-gray-300">|</span>
            <button onClick={() => router.push("/admin")} className="text-blue-600 hover:underline font-medium" title="Masuk ke panel admin">
              🛠️ Admin Panel
            </button>
          </>
        )}

        <span className="text-gray-300">|</span>
        <button onClick={handleLogout} className="text-red-500 hover:underline" title="Keluar dari sistem">
          Logout
        </button>
      </div>
    </header>
  );
}
