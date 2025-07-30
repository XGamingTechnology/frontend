"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface RegisterResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    role: string;
    fullName: string;
    avatarUrl: string;
  };
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Konfirmasi password tidak cocok.");
      return;
    }

    if (password.length < 6) {
      alert("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation Register($name: String!, $email: String!, $password: String!) {
              register(name: $name, email: $email, password: $password) {
                success
                message
                token
                user {
                  id
                  username
                  fullName
                  email
                  role
                  avatarUrl
                }
              }
            }
          `,
          variables: {
            name,
            email,
            password,
          },
        }),
      });

      const result = (await response.json()) as { data?: { register: RegisterResponse } };

      if (result.data?.register.success) {
        const { token, user } = result.data.register;

        // Simpan ke localStorage
        if (token) {
          localStorage.setItem("authToken", token);
        }
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: user?.id,
            username: user?.username,
            role: user?.role,
            fullName: user?.fullName,
            email: user?.email,
            avatarUrl: user?.avatarUrl,
          })
        );

        alert("Pendaftaran berhasil! Selamat datang, " + user?.fullName);

        // Redirect ke halaman login (atau langsung ke dashboard jika auto-login)
        router.push("/map"); // atau "/admin" jika ingin langsung masuk
      } else {
        const message = result.data?.register.message || "Gagal mendaftar. Coba lagi.";
        alert(message);
      }
    } catch (err) {
      console.error("Error during registration:", err);
      alert("Tidak dapat terhubung ke server. Pastikan backend berjalan di http://localhost:5000");
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
              <label className="block mb-1 text-sm font-medium text-black">Nama Lengkap</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-black"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-black">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-black">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-black">Konfirmasi Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-black"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ketik ulang password"
                required
              />
            </div>

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
