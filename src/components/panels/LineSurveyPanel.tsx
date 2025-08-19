// src/components/panels/LineSurveyPanel.tsx
"use client";
import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { useTool } from "@/context/ToolContext";

type Tool = "simulasi" | "drawline" | "drawpolygon" | null;

interface LineSurveyPanelProps {
  onClose: () => void; // untuk kembali ke menu utama
  drawnLine: L.LatLng[];
  isDrawing: boolean;
  hasLine: boolean;
  onDeleteLine: () => void;
  onSaveDraft: () => void;
  draftId: number | null;
  setDraftId: (id: number | null) => void;
  setActiveTool: (tool: Tool) => void;
}

export default function LineSurveyPanel({ onClose, drawnLine, isDrawing, hasLine, onDeleteLine, onSaveDraft, draftId, setDraftId, setActiveTool }: LineSurveyPanelProps) {
  const { refreshData } = useData();
  const { surveyMode } = useTool(); // Gunakan untuk memastikan kita masih dalam mode

  const [spasi, setSpasi] = useState(100);
  const [panjang, setPanjang] = useState(300);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [areaOptions, setAreaOptions] = useState<Array<{ id: number; name: string }>>([]);

  // ✅ Cek apakah garis sudah selesai (minimal 2 titik)
  const hasCompletedLine = drawnLine.length >= 2;

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
          if (!selectedAreaId && data.data.layerOptions.length > 0) {
            setSelectedAreaId(data.data.layerOptions[0].id);
          }
        }
      } catch (err) {
        alert("Gagal muat area");
      }
    };
    fetchAreas();
  }, [selectedAreaId]);

  const calculateLength = (points: L.LatLng[]) => points.reduce((d, p, i, arr) => (i ? d + arr[i - 1].distanceTo(p) : d), 0);

  const handleProcessSurvey = async () => {
    if (!draftId) return alert("Simpan draft dulu");
    if (!selectedAreaId) return alert("Pilih area");

    const surveyId = `SURVEY_${Date.now()}`;
    setIsProcessing(true);

    try {
      const res = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation GenerateSurvey(
              $surveyId: String!
              $draftId: Int!
              $areaId: Int!
              $spasi: Float!
              $panjang: Float!
            ) {
              generateSurvey(
                surveyId: $surveyId
                riverLineDraftId: $draftId
                areaId: $areaId
                spasi: $spasi
                panjang: $panjang
              ) {
                success
                message
              }
            }
          `,
          variables: { surveyId, draftId, areaId: selectedAreaId, spasi, panjang },
        }),
      });
      const data = await res.json();
      if (data.data?.generateSurvey.success) {
        alert("✅ Proses selesai");
        refreshData();
      } else {
        throw new Error(data.data?.generateSurvey.message || "Proses gagal");
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
        <h3 className="text-xl font-bold text-gray-800">🌊 Transek Sungai</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">
          ←
        </button>
      </div>

      {/* Tombol: Mulai Menggambar */}
      {!hasCompletedLine && !isDrawing && (
        <button onClick={() => setActiveTool("drawline")} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 rounded text-sm mb-3">
          ✏️ Mulai Menggambar
        </button>
      )}

      {/* Saat sedang menggambar */}
      {isDrawing && drawnLine.length > 0 && (
        <div className="mb-3">
          <div className="text-xs text-blue-600 mb-2">📏 Panjang: {calculateLength(drawnLine).toFixed(2)} m</div>
          <div className="text-xs text-gray-500 mb-2">👆 Klik untuk tambah titik</div>
          <div className="text-xs text-gray-500 mb-2">🖱️ Klik kanan untuk selesai</div>
          <button onClick={() => setActiveTool(null)} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded text-sm">
            ✅ Selesai Menggambar
          </button>
        </div>
      )}

      {/* Setelah garis selesai (2+ titik) */}
      {hasCompletedLine && !isDrawing && (
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
                  <label className="block text-xs font-bold mb-1 text-gray-800">Spasi (m)</label>
                  <input type="number" value={spasi} onChange={(e) => setSpasi(Math.max(1, parseInt(e.target.value) || 1))} className="w-full p-1 border border-gray-600 rounded text-sm" min="1" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-gray-800">Panjang (m)</label>
                  <input type="number" value={panjang} onChange={(e) => setPanjang(Math.max(1, parseInt(e.target.value) || 1))} className="w-full p-1 border border-gray-600 rounded text-sm" min="1" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-gray-800">Area Pemotong</label>
                <select value={selectedAreaId ?? ""} onChange={(e) => setSelectedAreaId(e.target.value ? Number(e.target.value) : null)} className="w-full p-2 border border-gray-600 rounded text-sm">
                  <option value="">-- Pilih --</option>
                  {areaOptions.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>

              <button onClick={handleProcessSurvey} disabled={isProcessing} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2 rounded mt-3">
                {isProcessing ? "Memproses..." : "🚀 Proses"}
              </button>
            </>
          )}

          <button onClick={onDeleteLine} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded text-sm mt-4">
            🗑️ Hapus Semua
          </button>
        </div>
      )}
    </div>
  );
}
