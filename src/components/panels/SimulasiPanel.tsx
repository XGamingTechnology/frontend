// src/components/panels/SimulasiPanel.tsx
"use client";

import { useState, useEffect } from "react";

interface SimulasiPanelProps {
  onGenerate: (spasi: number, panjang: number) => void;
  onStartDrawing: () => void;
  isDrawing: boolean;
  hasLine: boolean;
  // --- Props baru ---
  onDeleteLine: () => void; // Fungsi untuk menghapus garis
  onClosePanel: () => void; // Fungsi untuk menutup panel
}

export default function SimulasiPanel({
  onGenerate,
  onStartDrawing,
  isDrawing,
  hasLine,
  onDeleteLine, // Terima prop baru
  onClosePanel, // Terima prop baru
}: SimulasiPanelProps) {
  const [spasi, setSpasi] = useState(10);
  const [panjang, setPanjang] = useState(50);

  // Reset nilai saat mulai menggambar
  useEffect(() => {
    if (isDrawing) {
      setSpasi(10);
      setPanjang(50);
    }
  }, [isDrawing]);

  const handleGenerate = () => {
    if (!hasLine) {
      alert("Garis sungai belum digambar.");
      return;
    }
    onGenerate(spasi, panjang);
  };

  return (
    <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-xl shadow-xl p-5 w-80 border border-gray-200">
      {/* Header dengan Tombol Tutup */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">Simulasi Transek</h3>
        <button
          onClick={onClosePanel} // Gunakan fungsi dari props
          className="text-gray-500 hover:text-red-500 transition-colors duration-200"
          aria-label="Tutup Panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tombol Gambar Garis */}
      <button
        onClick={onStartDrawing}
        disabled={isDrawing}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center
          ${isDrawing ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"}`}
      >
        {isDrawing ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path>
            </svg>
            Sedang Menggambar...
          </>
        ) : (
          "Gambar Garis Sungai"
        )}
      </button>

      {/* Form input setelah garis tersedia */}
      {hasLine && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-4 italic">Atur parameter transek:</p>

          {/* Input Spasi */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Spasi (meter)</label>
            <div className="relative">
              <input
                type="number"
                value={spasi}
                onChange={(e) => setSpasi(Math.max(1, Number(e.target.value)))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm text-gray-700 placeholder:text-gray-400"
                min="1"
                placeholder="Jarak antar transek"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 text-sm">m</span>
              </div>
            </div>
          </div>

          {/* Input Panjang */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Panjang Transek (meter)</label>
            <div className="relative">
              <input
                type="number"
                value={panjang}
                onChange={(e) => setPanjang(Math.max(1, Number(e.target.value)))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm text-gray-700 placeholder:text-gray-400"
                min="1"
                placeholder="Panjang setiap transek"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 text-sm">m</span>
              </div>
            </div>
          </div>

          {/* Tombol Generate dan Hapus Garis */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleGenerate}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Generate Transek
            </button>

            {/* Tombol Hapus Garis */}
            <button
              onClick={onDeleteLine} // Gunakan fungsi dari props
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L3.14 13.142a3 3 0 000 4.243l1.269 1.269c1.071 1.07 2.634 1.07 3.707 0l1.269-1.269a3 3 0 000-4.243L9.894.553A1 1 0 009 2zm-.436 9.8l2.16 2.16a.5.5 0 00.708-.707l-2.16-2.16a.5.5 0 00-.707 0z"
                  clipRule="evenodd"
                />
              </svg>
              Hapus Garis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
