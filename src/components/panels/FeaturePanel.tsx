// src/components/panels/FeaturePanel.tsx
"use client";

import Papa from "papaparse";
import { ChangeEvent } from "react";
// 1. Ganti import useTool dengan useData
import { useData } from "@/context/DataContext"; // Pastikan path ini benar
import { useTool } from "@/context/ToolContext"; // Tetap impor useTool untuk setShowSidebarRight

// 2. Definisikan interface untuk tipe data echosounder (jika belum ada di types/)
interface EchosounderPoint {
  jarak: number;
  kedalaman: number;
}

interface FeaturePanelProps {
  activePanel: "rute" | "interpolasi" | "sbn" | "echosounder";
  close: () => void;
}

export default function FeaturePanel({ activePanel, close }: FeaturePanelProps) {
  // 3. Dapatkan state dan fungsi untuk mengelola echosounderData dari DataContext
  const { echosounderData, setEchosounderData } = useData();

  // 4. Dapatkan fungsi dari ToolContext (hanya yang diperlukan)
  const { setShowSidebarRight } = useTool();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const jarak = parseFloat(formData.get("jarak") as string);
    const kedalaman = parseFloat(formData.get("kedalaman") as string);

    if (!isNaN(jarak) && !isNaN(kedalaman)) {
      // 5. Update state echosounderData melalui DataContext
      setEchosounderData((prev) => {
        // 6. Pastikan prev selalu array (langkah keamanan)
        const safePrev = Array.isArray(prev) ? prev : [];
        return [...safePrev, { jarak, kedalaman }];
      });
    }

    e.currentTarget.reset();
  };

  const handleCSVUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data as { jarak?: string; kedalaman?: string }[];

        const cleaned = parsed
          .map((row) => ({
            jarak: parseFloat(row.jarak ?? ""),
            kedalaman: parseFloat(row.kedalaman ?? ""),
          }))
          .filter((d) => !isNaN(d.jarak) && !isNaN(d.kedalaman));

        // 7. Set data yang telah diproses ke DataContext
        setEchosounderData(cleaned);
      },
      error: (err) => {
        alert("Gagal memuat file CSV: " + err.message);
      },
    });
  };

  // 8. Pastikan data yang digunakan untuk rendering selalu array
  //    Karena echosounderData berasal dari context, kita pastikan tipenya aman
  const dataToDisplay = Array.isArray(echosounderData) ? echosounderData : [];

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[400px] bg-white rounded-xl shadow-lg p-4 z-50 overflow-auto max-h-[80vh]">
      {/* Header Panel */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-slate-800">
          {
            {
              rute: "Input Data Rute Survey",
              interpolasi: "Interpolasi Data Batimetri",
              sbn: "Sarana Bantu Navigasi",
              echosounder: "Visualisasi Echosounder",
            }[activePanel]
          }
        </h3>
        <button onClick={close} className="text-red-500 hover:underline text-sm">
          Tutup
        </button>
      </div>

      {/* Konten khusus untuk Echosounder */}
      {activePanel === "echosounder" && (
        <div>
          <p className="text-sm text-gray-700 mb-3">
            Masukkan data pengukuran kedalaman (<i>echosounder</i>) secara manual atau unggah melalui file CSV.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3 mb-4">
            <div className="flex flex-col">
              <label htmlFor="jarak" className="text-sm text-slate-700 font-medium mb-1">
                Jarak (meter)
              </label>
              <input id="jarak" name="jarak" type="number" step="any" required className="border border-gray-300 rounded px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="flex flex-col">
              <label htmlFor="kedalaman" className="text-sm text-slate-700 font-medium mb-1">
                Kedalaman (meter)
              </label>
              <input id="kedalaman" name="kedalaman" type="number" step="any" required className="border border-gray-300 rounded px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 text-sm w-full">
              Tambahkan Titik Pengukuran
            </button>
          </form>

          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1 italic">
              Atau unggah file CSV dengan format: <code>jarak,kedalaman</code>
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="text-sm text-gray-700 block w-full border border-gray-300 rounded p-2 bg-white file:mr-2 file:py-1 file:px-3 file:border file:border-gray-300 file:bg-gray-100 file:text-sm file:text-gray-700"
            />
          </div>

          {/* 9. Gunakan `dataToDisplay` yang sudah dicek tipenya untuk rendering */}
          <div className="mb-4 max-h-48 overflow-y-auto border border-gray-300 rounded p-2 bg-gray-50 text-sm">
            {dataToDisplay.length === 0 ? (
              <p className="text-gray-400 italic">Belum ada data dimasukkan.</p>
            ) : (
              dataToDisplay.map((d, i) => (
                <div key={i} className="text-gray-800">
                  {i + 1}. Jarak: <strong>{d.jarak.toFixed(2)} m</strong>, Kedalaman: <strong>{d.kedalaman.toFixed(2)} m</strong>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => {
              setShowSidebarRight(true);
              close(); // hanya menutup panel ini
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 text-sm w-full"
          >
            📈 Proses dan Tampilkan Penampang
          </button>
        </div>
      )}
    </div>
  );
}
