"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Dummy user untuk testing login
  const dummyUsers = [
    {
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    },
    {
      email: "user@example.com",
      password: "user123",
      role: "user",
    },
  ];

  // Proses login saat form disubmit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const foundUser = dummyUsers.find((user) => user.email === email && user.password === password);

    if (foundUser) {
      if (foundUser.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/map");
      }
    } else {
      alert("Email atau password salah.");
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
              <input type="email" className="w-full px-4 py-2 border border-black-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-black-700">Password</label>
              <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button type="submit" className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 rounded-md transition">
              Login
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
