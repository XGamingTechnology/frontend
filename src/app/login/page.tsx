"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Tipe untuk user
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  fullName: string;
  avatarUrl: string;
}

// Tipe untuk login response
interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result: LoginResponse = await response.json();

      if (result.success) {
        // ✅ Simpan token dan user
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        // ✅ Semua user (admin & user) langsung ke peta
        router.push("/map");
        router.refresh();
      } else {
        setError(result.message || "Login gagal");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Gagal terhubung ke server. Pastikan backend berjalan di http://localhost:5000");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-950 to-blue-950 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl grid md:grid-cols-2 overflow-hidden w-full max-w-4xl">
        {/* Kiri: Ilustrasi */}
        <div className="hidden md:flex items-center justify-center bg-sky-800 p-8">
          <Image
            src="/ship V3.svg"
            alt="Marine GIS Illustration"
            width={400}
            height={400}
            className="w-full h-auto max-w-xs"
            style={{
              filter: "drop-shadow(0 0 0 black) drop-shadow(0 0 3px black)",
            }}
          />
        </div>

        {/* Kanan: Form Login */}
        <div className="p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-6 text-center">Masuk ke Vision Traffic Suite</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-gray-900" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
              <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-gray-900" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</div>}

            <button type="submit" disabled={loading} className={`w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 rounded-md transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}>
              {loading ? "Memproses..." : "Login"}
            </button>

            {/* 🔗 Link ke Halaman Register */}
            <p className="text-sm text-center text-gray-600 mt-4">
              Belum punya akses?{" "}
              <a href="/register" className="text-sky-600 font-medium hover:underline">
                Daftar di sini
              </a>
            </p>
          </form>

          <p className="text-xs text-center text-gray-400 mt-6">&copy; {new Date().getFullYear()} WebGIS Sungai Musi — Marine GIS Platform</p>
        </div>
      </div>
    </main>
  );
}
