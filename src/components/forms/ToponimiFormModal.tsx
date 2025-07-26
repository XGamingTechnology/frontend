// src/components/forms/ToponimiFormModal.tsx
"use client";

import { useEffect, useState } from "react";

interface Props {
  latlng: [number, number] | null;
  onClose: () => void;
  onSubmit: (data: { nama: string; deskripsi: string }) => void;
  onCancelMarker: () => void; // tambahan untuk hapus marker
}

export default function ToponimiFormModal({ latlng, onClose, onSubmit, onCancelMarker }: Props) {
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  useEffect(() => {
    if (latlng) {
      setNama("");
      setDeskripsi("");
    }
  }, [latlng]);

  if (!latlng) return null;

  const handleSubmit = () => {
    if (nama.trim()) {
      onSubmit({ nama, deskripsi });
      onClose();
    }
  };

  const handleCancelAndClose = () => {
    onCancelMarker(); // hapus marker
    onClose();
  };

  return (
    // Gunakan z-index yang cukup tinggi, misalnya z-50
    // bg-black bg-opacity-30 membuat latar belakang hitam dengan opacity 30%
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center p-4 backdrop-blur-[2px]">
      <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl overflow-hidden w-full max-w-md transform transition-all border border-gray-200">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Tambah Toponimi
          </h2>
          <p className="text-blue-100 text-xs mt-1">
            Koordinat: {latlng[0].toFixed(5)}, {latlng[1].toFixed(5)}
          </p>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="nama-lokasi" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lokasi
            </label>
            <input
              id="nama-lokasi"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama lokasi"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-800 placeholder-gray-400 bg-white bg-opacity-80"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
          </div>

          <div>
            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              id="deskripsi"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Deskripsikan lokasi ini..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-800 placeholder-gray-400 resize-none bg-white bg-opacity-80"
            />
          </div>
        </div>

        {/* Footer dengan Tombol */}
        <div className="bg-gray-50 bg-opacity-70 px-6 py-4 flex justify-between items-center border-t border-gray-200">
          {/* Tombol Hapus Marker di kiri */}
          <button
            onClick={handleCancelAndClose}
            className="flex items-center gap-1 text-sm px-4 py-2 rounded-lg bg-red-500 bg-opacity-90 text-white hover:bg-opacity-100 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200 shadow hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Hapus Marker
          </button>

          {/* Tombol Batal dan Simpan di kanan */}
          <div className="flex gap-2">
            <button onClick={onClose} className="text-sm px-4 py-2 rounded-lg bg-gray-200 bg-opacity-80 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200">
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={!nama.trim()}
              className={`text-sm px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200 shadow hover:shadow-md flex items-center gap-1 ${
                nama.trim() ? "bg-indigo-600 bg-opacity-90 hover:bg-opacity-100 hover:bg-indigo-700" : "bg-gray-400 bg-opacity-50 cursor-not-allowed"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
