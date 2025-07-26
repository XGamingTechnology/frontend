"use client"; // Next.js directive untuk menjalankan komponen di sisi client

import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white px-6 py-20">
      {/* 🌤️ Background Langit */}
      <div className="absolute inset-0 -z-20">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <defs>
            <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e0f7fa" /> {/* Biru langit muda */}
              <stop offset="100%" stopColor="#90caf9" /> {/* Biru langit */}
            </linearGradient>
          </defs>
          <rect width="1440" height="320" fill="url(#skyGradient)" />
        </svg>
      </div>

      {/* 🌊 Background Laut dengan Gelombang */}
      <div className="absolute inset-0 -z-10">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <defs>
            <linearGradient id="oceanGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#42a5f5" /> {/* Biru laut */}
              <stop offset="100%" stopColor="#001f4d" /> {/* Biru laut tua */}
            </linearGradient>
          </defs>
          {/* Gelombang sebagai batas laut dan langit */}
          <path fill="url(#oceanGradient)" d="M0,160 C360,240 1080,80 1440,160 L1440,320 L0,320 Z" />
        </svg>
      </div>

      {/* 🏛 Logo Instansi */}
      <Image src="/logo.svg" alt="Logo Jangkar" width={50} height={50} className="absolute top-6 left-6 z-20" />

      {/* Konten Utama */}
      <div className="relative z-10 flex flex-col-reverse md:flex-row items-center gap-12 max-w-6xl mx-auto mb-24">
        {/* Kiri: Teks */}
        <div className="flex-1 text-center md:text-left">
          <h5 className="text-blue-900 uppercase tracking-widest font-medium mb-2 drop-shadow-[0_0_0.5px_black]">Vission Traffic Suite</h5>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 drop-shadow-[0_0_2px_black]">
            Selamat Datang di <span className="text-cyan-400 drop-shadow-[0_0_2px_black]">WebGIS Sungai Musi</span>
          </h1>

          <p
            className="text-lg md:text-xl text-blue-900 font-bold mb-6"
            style={{
              WebkitTextStroke: "0.1px #fff",
              textShadow: "0 0 1px #fff, 0 0 1px #fff",
            }}
          >
            Platform visualisasi data spasial untuk kebutuhan pemantauan, survey sungai, dan pengelolaan informasi kelautan – digunakan oleh Taruna dan Tim Teknis.
          </p>

          <p className="text-md text-white italic font-bold mb-8 drop-shadow-[0_0_5px_black]">Akses terbatas – hanya untuk pengguna internal.</p>

          <Link href="/login" className="inline-block bg-cyan-300 text-blue-950 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-cyan-200 transition duration-300">
            🌊 Login untuk Melanjutkan
          </Link>
        </div>

        {/* Kanan: Gambar */}
        <div className="flex-1 flex justify-end pr-4">
          <Image src="/ship V2.svg" alt="Marine Survey Illustration" width={350} height={350} className="w-full max-w-sm md:max-w-md drop-shadow-xl" priority />
        </div>
      </div>

      {/* 🔽 Bagian Fitur Utama */}
      <section className="relative z-10 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white drop-shadow text-center mb-8">Fitur Utama</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Kartu Fitur 1 */}
          <div className="bg-white text-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
            <img src="/map.jpg" alt="Map Explorer" className="w-full h-40 object-cover" />
            <div className="p-5">
              <Image src="/Map Location.svg" alt="Ikon Map" width={40} height={40} className="mb-3" />
              <h3 className="font-semibold text-lg mb-2">Map Explorer</h3>
              <p className="text-sm mb-4">Telusuri data spasial secara interaktif dan cepat menggunakan layer peta yang telah disiapkan.</p>
              <a href="#" className="text-cyan-700 font-medium hover:underline">
                Learn More →
              </a>
            </div>
          </div>

          {/* Kartu Fitur 2 */}
          <div className="bg-white text-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
            <img src="/statistik.jpg" alt="Statistik Survey" className="w-full h-40 object-cover" />
            <div className="p-5">
              <Image src="/Activity.svg" alt="Ikon Aktivitas" width={40} height={40} className="mb-3" />
              <h3 className="font-semibold text-lg mb-2">Statistik Survey</h3>
              <p className="text-sm mb-4">Visualisasi grafik data dari hasil pengumpulan titik, kategori survey, dan rute pelayaran.</p>
              <a href="#" className="text-cyan-700 font-medium hover:underline">
                Learn More →
              </a>
            </div>
          </div>

          {/* Kartu Fitur 3 */}
          <div className="bg-white text-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
            <img src="/rute.jpg" alt="Rute Navigasi" className="w-full h-40 object-cover" />
            <div className="p-5">
              <Image src="/Route.svg" alt="Ikon Rute" width={40} height={40} className="mb-3" />
              <h3 className="font-semibold text-lg mb-2">Rute Navigasi</h3>
              <p className="text-sm mb-4">Lihat dan pantau jalur survei yang telah dilakukan, serta histori navigasi titik-titik penting.</p>
              <a href="#" className="text-cyan-700 font-medium hover:underline">
                Learn More →
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
