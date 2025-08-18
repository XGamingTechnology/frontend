// src/components/panels/PolygonSurveyPanel.tsx
"use client";
import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";

type Tool = "simulasi" | "drawline" | "drawpolygon" | null;

interface PolygonSurveyPanelProps {
  onClose: () => void;
  drawnPolygon: L.LatLng[];
  isDrawing: boolean;
  hasPolygon: boolean;
  onDeletePolygon: () => void;
  onSaveDraft: () => void;
  draftId: number | null;
  setDraftId: (id: number | null) => void;
  setActiveTool: (tool: Tool) => void;
}

export default function PolygonSurveyPanel({ onClose, drawnPolygon, isDrawing, hasPolygon, onDeletePolygon, onSaveDraft, draftId, setDraftId, setActiveTool }: PolygonSurveyPanelProps) {
  const { refreshData } = useData();
  const [lineCount, setLineCount] = useState(10);
  const [spacing, setSpacing] = useState(100);
  const [selectedAreaName, setSelectedAreaName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [areaOptions, setAreaOptions] = useState<Array<{ id: number; name: string }>>([]);

  // ✅ Cek apakah polygon sudah selesai (minimal 3 titik)
  const hasCompletedPolygon = drawnPolygon.length >= 3;

  // Ambil daftar area_sungai
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query GetLayerOptions($layerType: String!) {
                layerOptions(layerType: $layerType) {
                  id
                  name
                }
              }
            `,
            variables: { layerType: "area_sungai" },
          }),
        });
        const data = await res.json();
        if (data.data?.layerOptions) {
          setAreaOptions(data.data.layerOptions);
          if (!selectedAreaName && data.data.layerOptions.length > 0) {
            setSelectedAreaName(data.data.layerOptions[0].name);
          }
        }
      } catch (err) {
        alert("Gagal muat area");
      }
    };
    fetchAreas();
  }, [selectedAreaName]);

  const calculateArea = (points: L.LatLng[]): number => {
    if (points.length < 3) return 0;
    const latlngs = [...points, points[0]]; // Tutup loop
    let area = 0;
    for (let i = 0; i < latlngs.length - 1; i++) {
      area += latlngs[i].lat * latlngs[i + 1].lng;
      area -= latlngs[i].lng * latlngs[i + 1].lat;
    }
    return Math.abs(area / 2) * 1e-6; // km²
  };

  // --- Proses: Generate Transek dari Polygon ---
  const handleProcess = async () => {
    if (!draftId) return alert("Simpan draft dulu");

    const surveyId = `POLYGON_SURVEY_${Date.now()}`;
    setIsProcessing(true);

    try {
      const res = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation GenerateTransekFromPolygonByDraft(
              $surveyId: String!
              $polygonDraftId: Int!
              $lineCount: Int!
              $spacing: Float!
            ) {
              generateTransekFromPolygonByDraft(
                surveyId: $surveyId
                polygonDraftId: $polygonDraftId
                lineCount: $lineCount
                spacing: $spacing
              ) {
                success
                message
              }
            }
          `,
          variables: { surveyId, polygonDraftId: draftId, lineCount, spacing },
        }),
      });
      const data = await res.json();
      if (data.data?.generateTransekFromPolygonByDraft.success) {
        alert("✅ Proses selesai");
        await refreshData(); // ✅ Tunggu selesai
      } else {
        throw new Error(data.data?.generateTransekFromPolygonByDraft.message || "Proses gagal");
      }
    } catch (err: any) {
      alert("❌ Gagal: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-xl shadow-xl p-5 w-80 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">🟩 Transek dari Polygon</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">
          ←
        </button>
      </div>

      {/* Tombol: Mulai Menggambar */}
      {!hasCompletedPolygon && !isDrawing && (
        <button onClick={() => setActiveTool("drawpolygon")} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 rounded text-sm mb-3">
          ✏️ Mulai Menggambar
        </button>
      )}

      {/* Saat sedang menggambar */}
      {isDrawing && drawnPolygon.length > 0 && (
        <div className="mb-3">
          <div className="text-xs text-green-600 mb-2">📏 Luas: {calculateArea(drawnPolygon).toFixed(4)} km²</div>
          <div className="text-xs text-gray-500 mb-2">👆 Klik untuk tambah titik</div>
          <div className="text-xs text-gray-500 mb-2">🖱️ Klik kanan untuk selesai</div>
          <button onClick={() => setActiveTool(null)} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded text-sm">
            ✅ Selesai Menggambar
          </button>
        </div>
      )}

      {/* Setelah polygon selesai */}
      {hasCompletedPolygon && !isDrawing && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-3 italic">Langkah 1: Simpan Draft</p>
          <button onClick={onSaveDraft} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded text-sm mb-4">
            {draftId ? "✅ Sudah Disimpan" : "💾 Simpan Draft"}
          </button>

          {draftId && (
            <>
              <p className="text-sm text-gray-600 mb-3 italic">Langkah 2: Proses Survey</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Jumlah Garis</label>
                  <input type="number" value={lineCount} onChange={(e) => setLineCount(Math.max(1, parseInt(e.target.value) || 1))} className="w-full p-1 border border-gray-300 rounded text-sm" min="1" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Jarak (m)</label>
                  <input type="number" value={spacing} onChange={(e) => setSpacing(Math.max(1, parseInt(e.target.value) || 1))} className="w-full p-1 border border-gray-300 rounded text-sm" min="1" />
                </div>
              </div>

              {/* ✅ HAPUS: Select Area Pemotong */}
              {/* Tidak perlu lagi karena pakai polygonDraftId */}

              <button onClick={handleProcess} disabled={isProcessing} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2 rounded mt-3">
                {isProcessing ? "Memproses..." : "🚀 Proses"}
              </button>
            </>
          )}

          <button onClick={onDeletePolygon} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded text-sm mt-4">
            🗑️ Hapus Semua
          </button>
        </div>
      )}
    </div>
  );
}
