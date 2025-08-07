// src/components/panels/SimulasiPanel.tsx
"use client";
import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext"; // ✅ Tambah ini

// --- TIPE DATA ---
interface LayerOption {
  id: number;
  name: string;
  layerType: string;
}

interface DraftResponse {
  success: boolean;
  message: string;
  draftId: number | null;
}

interface SimulasiPanelProps {
  onStartDrawing: () => void;
  isDrawing: boolean;
  hasLine: boolean;
  onDeleteLine: () => void;
  onClosePanel: () => void;
  drawnLine: L.LatLng[];
  setActiveTool: (tool: string | null) => void;
}

// --- Hook: Ambil data spatial dari DB ---
function useSpatialFeatures(layerType?: string) {
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query GetSpatialFeatures($layerType: String) {
                spatialFeatures(layerType: $layerType) {
                  id
                  layerType
                  name
                  geometry
                  meta
                }
              }
            `,
            variables: { layerType },
          }),
        });
        const data = await response.json();
        if (data.data?.spatialFeatures) {
          setFeatures(data.data.spatialFeatures.map((f: any) => f.geometry));
        }
      } catch (err) {
        console.error("Gagal ambil spatialFeatures:", err);
      } finally {
        setLoading(false);
      }
    };
    if (layerType) fetchData();
  }, [layerType]);
  return { features, loading };
}

// --- Fungsi: Hitung panjang garis ---
const calculateLength = (points: L.LatLng[]) => {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += points[i].distanceTo(points[i - 1]);
  }
  return total;
};

export default function SimulasiPanel({ onStartDrawing, isDrawing, hasLine, onDeleteLine, onClosePanel, drawnLine, setActiveTool }: SimulasiPanelProps) {
  const { refreshData } = useData(); // ✅ Ambil dari context

  const [spasi, setSpasi] = useState(10);
  const [panjang, setPanjang] = useState(50); // ✅ Sudah diperbaiki: useState(50)
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftId, setDraftId] = useState<number | null>(null);
  const [areaOptions, setAreaOptions] = useState<LayerOption[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(false);

  // Ambil river_line dari database (untuk preview)
  const { features: riverLineFeatures } = useSpatialFeatures("river_line");
  const latestRiverLine = riverLineFeatures[riverLineFeatures.length - 1];

  // Ambil area_sungai
  useEffect(() => {
    const fetchAreaOptions = async () => {
      setLoadingAreas(true);
      try {
        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query GetLayerOptions($layerType: String!) {
                layerOptions(layerType: $layerType) {
                  id
                  name
                  layerType
                }
              }
            `,
            variables: { layerType: "area_sungai" },
          }),
        });
        const data = await response.json();
        if (data.data?.layerOptions && data.data.layerOptions.length > 0) {
          setAreaOptions(data.data.layerOptions);
          if (!selectedAreaId) {
            setSelectedAreaId(data.data.layerOptions[0].id);
          }
        }
      } catch (err: any) {
        alert("Gagal muat area: " + err.message);
      } finally {
        setLoadingAreas(false);
      }
    };
    if (hasLine) fetchAreaOptions();
  }, [hasLine, selectedAreaId]);

  // --- Handler: Simpan Draft Garis Sungai ---
  const handleSaveDraft = async () => {
    if (drawnLine.length < 2) {
      alert("Garis harus punya minimal 2 titik.");
      return;
    }

    // Konversi L.LatLng[] ke GeoJSON LineString
    const geoJsonLine = {
      type: "LineString",
      coordinates: drawnLine.map((point) => [point.lng, point.lat]),
    };

    setIsSavingDraft(true);
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation SaveRiverLineDraft($geom: JSON!) {
              saveRiverLineDraft(geom: $geom) {
                success
                message
                draftId
              }
            }
          `,
          variables: { geom: geoJsonLine },
        }),
      });

      const data: { data: { saveRiverLineDraft: DraftResponse } } = await response.json();

      if (data.data?.saveRiverLineDraft.success) {
        setDraftId(data.data.saveRiverLineDraft.draftId);
        alert(`✅ ${data.data.saveRiverLineDraft.message}`);
      } else {
        throw new Error(data.data?.saveRiverLineDraft.message || "Gagal simpan draft");
      }
    } catch (err: any) {
      console.error("❌ Gagal simpan draft:", err);
      alert(`❌ Gagal: ${err.message}`);
    } finally {
      setIsSavingDraft(false);
    }
  };

  // --- Handler: Proses Survey ---
  const handleProcessSurvey = async () => {
    if (!draftId) {
      alert("❌ Harap simpan draft terlebih dahulu.");
      return;
    }
    if (!selectedAreaId) {
      alert("Pilih area sungai untuk clipping.");
      return;
    }

    const surveyId = `SURVEY_${Date.now()}`;
    setIsProcessing(true);
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation GenerateSurvey($surveyId: String!, $draftId: Int!, $areaId: Int!, $spasi: Float!, $panjang: Float!) {
              generateSurvey(surveyId: $surveyId, riverLineDraftId: $draftId, areaId: $areaId, spasi: $spasi, panjang: $panjang) {
                success
                message
              }
            }
          `,
          variables: {
            surveyId,
            draftId,
            areaId: selectedAreaId,
            spasi,
            panjang,
          },
        }),
      });

      const data = await response.json();
      console.log("📥 Response:", data);

      if (data.data?.generateSurvey?.success) {
        alert(`✅ ${data.data.generateSurvey.message}`);
        refreshData(); // ✅ Tambah ini: refresh data dari database
      } else {
        throw new Error(data.errors?.[0]?.message || "Proses gagal");
      }
    } catch (err: any) {
      console.error("❌ Gagal proses survey:", err);
      alert(`❌ Gagal: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-xl shadow-xl p-5 w-80 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">⚙️ Alur Kerja</h3>
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
          "🖌️ Gambar Garis Sungai"
        )}
      </button>

      {isDrawing && drawnLine.length > 1 && (
        <>
          <div className="text-xs text-blue-600 mb-2">📏 Panjang: {calculateLength(drawnLine).toFixed(2)} meter</div>
          <button onClick={() => setActiveTool(null)} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded text-sm mb-3">
            ✅ Selesai Menggambar
          </button>
        </>
      )}

      {hasLine && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-3 italic">Langkah 1: Simpan Draft</p>
          <button onClick={handleSaveDraft} disabled={isSavingDraft || !!draftId} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-3 rounded text-sm mb-4">
            {isSavingDraft ? "Menyimpan..." : draftId ? "✅ Sudah Disimpan" : "💾 Simpan Draft"}
          </button>

          {draftId && (
            <>
              <p className="text-sm text-gray-600 mb-3 italic">Langkah 2: Proses Survey</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">Spasi (m)</label>
                  <input type="number" value={spasi} onChange={(e) => setSpasi(Math.max(1, Number(e.target.value)))} className="w-full p-1.5 border border-gray-300 rounded text-sm" min="1" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">Panjang (m)</label>
                  <input type="number" value={panjang} onChange={(e) => setPanjang(Math.max(1, Number(e.target.value)))} className="w-full p-1.5 border border-gray-300 rounded text-sm" min="1" />
                </div>
              </div>

              <div className="border-t pt-4 mt-2">
                <h4 className="font-bold text-sm text-gray-800 mb-2">🔧 Proses Survey</h4>
                <label className="block text-xs text-gray-600 mb-1">Pilih Area Pemotong</label>
                <select value={selectedAreaId ?? ""} onChange={(e) => setSelectedAreaId(e.target.value ? Number(e.target.value) : null)} className="w-full p-2 border border-gray-300 rounded text-sm mb-3" disabled={loadingAreas}>
                  <option value="">-- Pilih Area --</option>
                  {areaOptions.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
                {loadingAreas && <p className="text-xs text-gray-500 mb-3">Memuat daftar area...</p>}
                <button onClick={handleProcessSurvey} disabled={isProcessing || !selectedAreaId} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-2 px-3 rounded text-sm">
                  {isProcessing ? "Memproses..." : "🚀 Proses & Simpan Hasil"}
                </button>
              </div>
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
