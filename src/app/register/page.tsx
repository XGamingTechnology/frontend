"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Tipe untuk user
interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl: string;
}

// Tipe untuk register response
interface RegisterResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Tambah tipe: React.FormEvent<HTMLFormElement>
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validasi input
    if (!name.trim()) {
      setError("Nama lengkap wajib diisi");
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Email wajib diisi");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      setLoading(false);
      return;
    }

    try {
      // 🔥 Ganti dari /graphql ke /api/auth/register
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result: RegisterResponse = await response.json();

      if (result.success) {
        // ✅ Simpan ke localStorage
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        alert("Pendaftaran berhasil! Selamat datang, " + result.user.fullName);

        // ✅ Redirect berdasarkan role
        if (result.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/map");
        }
        router.refresh();
      } else {
        setError(result.message || "Gagal mendaftar. Coba lagi.");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("Tidak dapat terhubung ke server. Pastikan backend berjalan di http://localhost:5000");
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
            src="/ship V4.svg"
            alt="Marine GIS Illustration"
            width={350}
            height={350}
            className="w-full h-auto max-w-xs"
            style={{
              filter: "drop-shadow(0 0 0 black) drop-shadow(0 0 3px black)",
            }}
          />
        </div>

        {/* Kanan: Form Registrasi */}
        <div className="p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-6 text-center">Daftar ke Vision Traffic Suite</h2>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-gray-900"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-gray-900"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-gray-900"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Konfirmasi Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-gray-900"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                placeholder="Ketik ulang password"
                required
              />
            </div>

            {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</div>}

            <button type="submit" disabled={loading} className={`w-full font-bold py-2 rounded-md transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-500 text-white"}`}>
              {loading ? "Mendaftarkan..." : "Daftar"}
            </button>

            {/* Link ke Login */}
            <p className="text-sm text-center text-gray-600 mt-4">
              Sudah punya akun?{" "}
              <a href="/login" className="text-sky-600 font-medium hover:underline">
                Masuk di sini
              </a>
            </p>
          </form>

          <p className="text-xs text-center text-gray-400 mt-6">&copy; {new Date().getFullYear()} WebGIS Sungai Musi — Marine GIS Platform</p>
        </div>
      </div>
    </main>
  );
}
