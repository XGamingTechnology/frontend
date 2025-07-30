// src/components/panels/FeaturePanel.tsx
"use client";

import Papa from "papaparse";
import { ChangeEvent, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { useTool } from "@/context/ToolContext";

interface EchosounderPoint {
  jarak: number;
  kedalaman: number;
}

interface FeaturePanelProps {
  activePanel: "rute" | "interpolasi" | "sbn" | "echosounder";
  close: () => void;
}

export default function FeaturePanel({ activePanel, close }: FeaturePanelProps) {
  const { echosounderData, setEchosounderData, addFeature } = useData();
  const { setShowSidebarRight } = useTool();

  // --- Muat data echosounder dari backend saat komponen mount ---
  useEffect(() => {
    // Opsional: ambil dari backend jika ada data sebelumnya
    // Misal: fetch dari spatialFeatures dengan layerType = "echosounder"
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const jarak = parseFloat(formData.get("jarak") as string);
    const kedalaman = parseFloat(formData.get("kedalaman") as string);

    if (isNaN(jarak) || isNaN(kedalaman)) {
      alert("Jarak dan kedalaman harus berupa angka.");
      return;
    }

    // Buat GeoJSON Point
    const pointFeature = {
      type: "Point",
      coordinates: [104.76 + jarak * 0.0001, -2.98 + jarak * 0.0001], // Simulasi koordinat berdasarkan jarak
    };

    // Simpan ke backend
    try {
      await addFeature({
        type: "Feature",
        properties: {
          layerType: "echosounder",
          jarak,
          kedalaman,
          name: `Titik ${echosounderData.length + 1}`,
        },
        geometry: pointFeature,
      });

      // Update state lokal
      setEchosounderData((prev) => [...(Array.isArray(prev) ? prev : []), { jarak, kedalaman }]);
    } catch (err) {
      console.error("Gagal simpan titik echosounder:", err);
      alert("Gagal menyimpan ke server.");
    }

    e.currentTarget.reset();
  };

  const handleCSVUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const parsed = results.data as { jarak?: string; kedalaman?: string }[];

        const cleaned = parsed
          .map((row, index) => ({
            jarak: parseFloat(row.jarak ?? ""),
            kedalaman: parseFloat(row.kedalaman ?? ""),
          }))
          .filter((d) => !isNaN(d.jarak) && !isNaN(d.kedalaman));

        if (cleaned.length === 0) {
          alert("Tidak ada data valid dalam file CSV.");
          return;
        }

        // Simpan semua titik ke backend
        const savePromises = cleaned.map(async (d, index) => {
          const pointFeature = {
            type: "Point",
            coordinates: [104.76 + d.jarak * 0.0001, -2.98 + d.jarak * 0.0001],
          };

          try {
            await addFeature({
              type: "Feature",
              properties: {
                layerType: "echosounder",
                jarak: d.jarak,
                kedalaman: d.kedalaman,
                name: `CSV-${index + 1}`,
              },
              geometry: pointFeature,
            });
          } catch (err) {
            console.error(`Gagal simpan titik ${index + 1}:`, err);
          }
        });

        await Promise.all(savePromises);

        // Update state lokal
        setEchosounderData(cleaned);
        alert(`Berhasil mengunggah ${cleaned.length} titik dari CSV.`);
      },
      error: (err) => {
        alert("Gagal memuat file CSV: " + err.message);
      },
    });
  };

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
              close();
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
