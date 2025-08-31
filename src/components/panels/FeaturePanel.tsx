// src/components/panels/FeaturePanel.tsx
"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useData } from "@/context/DataContext";
import { useTool } from "@/context/ToolContext";

interface EchosounderPoint {
  jarak: number;
  kedalaman: number;
}

type DataType = "2d" | "3d" | "unknown";

interface FeaturePanelProps {
  activePanel: "rute" | "interpolasi" | "sbn" | "echosounder";
  close: () => void;
}

// ✅ Fungsi bantu: Ambil headers otentikasi (tanpa Content-Type)
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export default function FeaturePanel({ activePanel, close }: FeaturePanelProps) {
  const { echosounderData, setEchosounderData, refreshData, refreshSurveyList } = useData();
  const { setShowSidebarRight, setShow3DPanel } = useTool();

  const [manualJarak, setManualJarak] = useState("");
  const [manualKedalaman, setManualKedalaman] = useState("");
  const [uploadStatus, setUploadStatus] = useState<{
    loading: boolean;
    type: DataType;
    count: number;
  } | null>(null);

  // --- Input manual ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const jarak = parseFloat(manualJarak);
    const kedalaman = parseFloat(manualKedalaman);

    if (isNaN(jarak) || isNaN(kedalaman)) {
      alert("❌ Jarak dan kedalaman harus angka.");
      return;
    }

    setEchosounderData((prev) => [...(Array.isArray(prev) ? prev : []), { jarak, kedalaman }]);
    setManualJarak("");
    setManualKedalaman("");
  };

  // --- Upload CSV ---
  const handleCSVUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus({ loading: true, type: "unknown", count: 0 });

    const formData = new FormData();
    formData.append("file", file);

    // ✅ Kirim is3D? (Opsional: deteksi dari nama file atau input)
    const is3D = file.name.toLowerCase().includes("3d") || file.name.toLowerCase().includes("xyz");
    formData.append("is3D", is3D ? "true" : "false");

    fetch("http://localhost:5000/api/upload/echosounder", {
      method: "POST",
      body: formData,
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((result) => {
        console.log("✅ Upload sukses:", result);

        if (result.success) {
          // ✅ 1. Simpan ke localStorage sebagai riwayat upload
          const savedSurveys = JSON.parse(localStorage.getItem("fieldSurveys") || "[]");
          const newSurvey = {
            surveyId: result.surveyId,
            date: new Date().toLocaleDateString("id-ID"),
            count: result.count,
            type: result.type || "2d",
            source: "import",
            uploadedAt: new Date().toISOString(),
          };

          // Hindari duplikat
          const filtered = savedSurveys.filter((s: any) => s.surveyId !== result.surveyId);
          localStorage.setItem("fieldSurveys", JSON.stringify([...filtered, newSurvey]));

          // ✅ 2. Trigger refresh di SidebarRight
          refreshSurveyList(); // ← Ini akan picu re-render
          refreshData(); // ← Sinkron data peta

          // ✅ 3. Update status upload
          setUploadStatus({
            loading: false,
            type: result.type || "2d",
            count: result.count,
          });

          alert(`✅ ${result.count} titik (${result.type === "3d" ? "3D" : "2D"}) berhasil diimpor sebagai ${result.surveyId}`);
        } else {
          alert(`❌ Upload gagal: ${result.error}`);
        }
      })
      .catch((err) => {
        console.error("❌ Gagal upload:", err);
        alert(`❌ Gagal upload: ${err.message}`);
      })
      .finally(() => {
        setUploadStatus(null);
        e.target.value = ""; // Reset input file
      });
  };

  // --- Sinkronisasi ke localStorage ---
  useEffect(() => {
    if (Array.isArray(echosounderData)) {
      try {
        localStorage.setItem("echosounderData", JSON.stringify(echosounderData));
      } catch (err) {
        console.warn("Gagal simpan ke localStorage:", err);
      }
    }
  }, [echosounderData]);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[480px] bg-white rounded-xl shadow-2xl p-5 z-50 overflow-auto max-h-[90vh] border border-gray-200">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          {activePanel === "echosounder" && "📊"} {panelTitle[activePanel]}
        </h3>
        <button onClick={close} className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full p-1 transition-all" aria-label="Tutup">
          ✕
        </button>
      </div>

      {activePanel === "echosounder" && (
        <div className="space-y-5">
          <p className="text-sm text-gray-600">Masukkan data kedalaman manual atau unggah file CSV (2D atau 3D).</p>

          <form onSubmit={handleSubmit} className="space-y-3 bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-medium text-slate-700">➕ Input Manual (2D)</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600">Jarak (m)</label>
                <input type="number" step="any" value={manualJarak} onChange={(e) => setManualJarak(e.target.value)} required className="w-full border rounded px-3 py-2 text-sm" placeholder="50.5" />
              </div>
              <div>
                <label className="text-xs text-slate-600">Kedalaman (m)</label>
                <input type="number" step="any" value={manualKedalaman} onChange={(e) => setManualKedalaman(e.target.value)} required className="w-full border rounded px-3 py-2 text-sm" placeholder="2.3" />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500 text-sm font-medium">
              Tambah Titik
            </button>
          </form>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-slate-700 mb-1">📁 Unggah CSV (2D atau 3D)</h4>
            <input type="file" accept=".csv" onChange={handleCSVUpload} className="text-sm block w-full" />
            {uploadStatus?.loading && <p className="text-xs text-blue-600 mt-2">🔄 Memproses file...</p>}
            {uploadStatus && !uploadStatus.loading && (
              <p className="mt-2 text-xs text-green-600">
                ✅ {uploadStatus.count} titik dimuat sebagai <b>{uploadStatus.type === "3d" ? "3D (XYZ)" : "2D (jarak-kedalaman)"}</b>
              </p>
            )}
            <a href="/template_echosounder_2d.csv" download className="text-xs text-blue-600 hover:underline block mt-2">
              📥 Download Template CSV 2D
            </a>
            <a href="/template_echosounder_3d.csv" download className="text-xs text-purple-600 hover:underline block mt-2">
              📥 Download Template CSV 3D (jarak,offset,kedalaman)
            </a>
          </div>

          <div className="flex gap-2 pt-3 border-t">
            <button
              onClick={() => {
                setShowSidebarRight(true);
                close();
              }}
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-500 text-sm font-medium"
            >
              📈 Tampilkan 2D
            </button>
            <button
              onClick={() => {
                setShow3DPanel(true);
                close();
              }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded hover:from-purple-500 hover:to-indigo-500 text-sm font-medium"
            >
              3D 🚀 Buka Visualisasi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Helper Judul Panel ---
const panelTitle = {
  rute: "Input Data Rute Survey",
  interpolasi: "Interpolasi Data Batimetri",
  sbn: "Sarana Bantu Navigasi",
  echosounder: "Visualisasi Echosounder",
};
