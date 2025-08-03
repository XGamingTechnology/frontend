// src/components/panels/SimulasiPanel.tsx
"use client";

import { useState } from "react";

interface SimulasiPanelProps {
  onGenerate: (spasi: number, panjang: number) => void;
  onStartDrawing: () => void;
  isDrawing: boolean;
  hasLine: boolean;
  onDeleteLine: () => void;
  onClosePanel: () => void;
  onSaveLine: () => void; // ✅ Tambahkan prop baru
}

export default function SimulasiPanel({
  onGenerate,
  onStartDrawing,
  isDrawing,
  hasLine,
  onDeleteLine,
  onClosePanel,
  onSaveLine, // ✅ Terima fungsi
}: SimulasiPanelProps) {
  const [spasi, setSpasi] = useState(10);
  const [panjang, setPanjang] = useState(50);

  const handleGenerate = () => {
    if (!hasLine) {
      alert("Garis sungai belum digambar.");
      return;
    }
    onGenerate(spasi, panjang);
  };

  return (
    <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-xl shadow-xl p-5 w-80 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">Simulasi Transek</h3>
        <button onClick={onClosePanel} className="text-gray-500 hover:text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <button
        onClick={onStartDrawing}
        disabled={isDrawing}
        className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center
          ${isDrawing ? "bg-gray-300 text-gray-500" : "bg-amber-500 hover:bg-amber-600 text-white"}`}
      >
        {isDrawing ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path>
            </svg>
            Sedang Menggambar...
          </>
        ) : (
          "Gambar Garis Sungai"
        )}
      </button>

      {hasLine && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-4 italic">Atur parameter transek:</p>

          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-800 mb-2">Spasi (meter)</label>
            <input
              type="number"
              value={spasi}
              onChange={(e) => setSpasi(Math.max(1, Number(e.target.value)))}
              className="w-full p-3 border border-gray-300 rounded-lg 
               text-gray-900 placeholder-gray-500 
               focus:text-gray-900 
               bg-white"
              min="1"
              placeholder="50"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold text-gray-800 mb-2">Panjang Transek (meter)</label>
            <input
              type="number"
              value={panjang}
              onChange={(e) => setPanjang(Math.max(1, Number(e.target.value)))}
              className="w-full p-3 border border-gray-300 rounded-lg 
               text-gray-900 placeholder-gray-500 
               focus:text-gray-900 
               bg-white"
              min="1"
              placeholder="200"
            />
          </div>

          <div className="flex flex-col gap-2">
            {/* 🔵 TOMBOL BARU: Simpan ke Database */}
            <button onClick={onSaveLine} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg">
              💾 Simpan Garis Sungai
            </button>

            <button onClick={handleGenerate} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg">
              🚀 Generate Transek
            </button>

            <button onClick={onDeleteLine} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg">
              🗑️ Hapus Garis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
