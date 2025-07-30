"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Konfirmasi password tidak cocok.");
      return;
    }

    // Simulasi sukses daftar
    alert("Pendaftaran berhasil!");
    router.push("/login");
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
              <label className="block mb-1 text-sm font-medium text-black dark:text-black">Nama Lengkap</label>
              <input type="text" className="w-full px-4 py-2 border border-black-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-black dark:text-black" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-black dark:text-black">Email</label>
              <input type="email" className="w-full px-4 py-2 border border-black-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-black dark:text-black" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-black dark:text-black">Password</label>
              <input type="password" className="w-full px-4 py-2 border border-black-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-black dark:text-black" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-black dark:text-black">Konfirmasi Password</label>
              <input type="password" className="w-full px-4 py-2 border border-black-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-black dark:text-black" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            <button type="submit" className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 rounded-md transition">
              Daftar
            </button>

            {/* 🔗 Link ke Login */}
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
