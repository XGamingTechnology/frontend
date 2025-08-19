// src/components/panels/LineSurveyPanel.tsx
"use client";
import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { useTool } from "@/context/ToolContext";
import * as L from "leaflet";
import { Feature } from "geojson";

type Tool = "simulasi" | "drawline" | "drawpolygon" | null;

interface LineSurveyPanelProps {
  onClose: () => void;
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
  const { refreshData, features } = useData();
  const { surveyMode } = useTool();

  const [spasi, setSpasi] = useState(100);
  const [panjang, setPanjang] = useState(300);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [areaOptions, setAreaOptions] = useState<Array<{ id: number; name: string }>>([]);
  const [isDataReady, setIsDataReady] = useState(false);
  const [surveyId, setSurveyId] = useState<string | null>(null);

  // Debug: info jumlah titik
  const [debugInfo, setDebugInfo] = useState<{
    totalFeatures: number;
    validSamplingCount: number;
    matchingCount: number;
  } | null>(null);

  // Cek apakah garis sudah selesai
  const hasCompletedLine = drawnLine.length >= 2;

  // Reset saat draftId berubah
  useEffect(() => {
    if (!draftId) {
      setIsDataReady(false);
      setDebugInfo(null);
      setSurveyId(null);
    }
  }, [draftId]);

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
        console.error("Gagal muat area:", err);
        alert("Gagal memuat daftar area. Coba lagi nanti.");
      }
    };
    fetchAreas();
  }, [selectedAreaId]);

  const calculateLength = (points: L.LatLng[]) => points.reduce((d, p, i, arr) => (i ? d + arr[i - 1].distanceTo(p) : d), 0);

  // --- PROSES SURVEY ---
  const handleProcessSurvey = async () => {
    if (!draftId) return alert("Simpan draft garis terlebih dahulu.");
    if (!selectedAreaId) return alert("Pilih area pemotong.");

    const id = `SURVEY_${Math.floor(Date.now() / 1000)}`;
    setSurveyId(id);
    setIsProcessing(true);
    setIsDataReady(false);

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
          variables: { surveyId: id, draftId, areaId: selectedAreaId, spasi, panjang },
        }),
      });

      const data = await res.json();
      if (data.data?.generateSurvey.success) {
        alert("✅ Proses survey selesai. Menampilkan hasil...");
        await refreshData(); // ⬅️ Refresh data → otomatis munculkan transek & titik
        setIsDataReady(true);

        // Update debug info
        const validSampling = features?.features?.filter((f: any) => f.properties?.layerType === "valid_sampling_point").length;
        const matching = features?.features?.filter((f: any) => f.properties?.layerType === "valid_sampling_point" && f.properties?.survey_id === id).length;

        setDebugInfo({
          totalFeatures: features?.features?.length || 0,
          validSamplingCount: validSampling || 0,
          matchingCount: matching || 0,
        });
      } else {
        throw new Error(data.data?.generateSurvey.message || "Proses gagal");
      }
    } catch (err: any) {
      console.error("❌ Gagal proses survey:", err);
      alert(`❌ Gagal: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- EXPORT SAMPLING POINTS: Langsung dari DB ---
  const handleExport = async (format: "csv" | "geojson") => {
    if (!surveyId) {
      alert("Belum ada proses survey.");
      return;
    }

    if (!isDataReady) {
      alert("Data belum siap untuk diekspor.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query GetSamplingPoints($surveyId: String!) {
              samplingPointsBySurveyId(surveyId: $surveyId) {
                id
                layerType
                name
                description
                geometry
                meta
              }
            }
          `,
          variables: { surveyId },
        }),
      });

      const data = await res.json();
      const points = data.data?.samplingPointsBySurveyId;

      if (!points || points.length === 0) {
        alert("⚠️ Tidak ada titik untuk diekspor.");
        return;
      }

      if (format === "geojson") {
        const geojson = {
          type: "FeatureCollection",
          features: points.map((p: any) => ({
            type: "Feature",
            id: p.id,
            properties: { ...p, ...p.meta },
            geometry: p.geometry,
          })),
        };
        const jsonStr = JSON.stringify(geojson, null, 2);
        downloadFile(jsonStr, `${surveyId}.geojson`, "application/json");
      }

      if (format === "csv") {
        const headers = ["ID", "Survey ID", "Latitude", "Longitude", "Kedalaman (m)", "Jarak dari Awal (m)"];
        const rows = points.map((p: any) => {
          const [lng, lat] = p.geometry?.coordinates || ["-", "-"];
          return [p.id, p.meta?.survey_id || "-", lat?.toFixed(6), lng?.toFixed(6), (p.meta?.kedalaman ?? p.description?.replace("Depth: ", "")).toString(), (p.meta?.distance_m || "-").toString()].join(",");
        });
        const csv = [headers.join(","), ...rows].join("\n");
        downloadFile(csv, `${surveyId}.csv`, "text/csv");
      }
    } catch (err) {
      alert("Gagal ambil data untuk export.");
    }
  };

  // --- Fungsi Download File Lokal ---
  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- RESET ALUR: Mulai dari awal ---
  const resetDraft = () => {
    setDraftId(null);
    setIsDataReady(false);
    setDebugInfo(null);
    setSurveyId(null);
    setSpasi(100);
    setPanjang(300);
    if (areaOptions.length > 0) {
      setSelectedAreaId(areaOptions[0].id);
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

      {!hasCompletedLine && !isDrawing && (
        <button onClick={() => setActiveTool("drawline")} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 rounded text-sm mb-3">
          ✏️ Mulai Menggambar
        </button>
      )}

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

      {hasCompletedLine && !isDrawing && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-3 italic">Langkah 1: Simpan Draft</p>
          <button
            onClick={onSaveDraft}
            disabled={!!draftId}
            className={`w-full py-2 px-3 rounded text-sm mb-4 font-semibold transition-colors ${draftId ? "bg-green-100 text-green-800 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
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

              <button onClick={handleProcessSurvey} disabled={isProcessing} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2 rounded mt-3 font-semibold">
                {isProcessing ? "Memproses..." : "🚀 Proses Survey"}
              </button>

              {/* Debug Info */}
              {draftId && (
                <div className="mt-2 text-xs border-t pt-2">
                  <p className="text-gray-600">Debug:</p>
                  <p>Status: {isDataReady ? "✅ Siap" : "⏳ Menunggu data..."}</p>
                  {debugInfo && (
                    <div>
                      <p>Total Features: {debugInfo.totalFeatures}</p>
                      <p>Sampling Points: {debugInfo.validSamplingCount}</p>
                      <p>Ditemukan: {debugInfo.matchingCount}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tombol Export */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">📤 Export Data Sampling</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExport("csv")}
                    disabled={!isDataReady}
                    className={`flex-1 text-xs py-1.5 px-2 rounded transition-opacity ${isDataReady ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-300 text-gray-500"}`}
                  >
                    📄 CSV
                  </button>
                  <button
                    onClick={() => handleExport("geojson")}
                    disabled={!isDataReady}
                    className={`flex-1 text-xs py-1.5 px-2 rounded transition-opacity ${isDataReady ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500"}`}
                  >
                    🌐 GeoJSON
                  </button>
                </div>
              </div>

              {/* Tombol Gambar Ulang */}
              <button onClick={resetDraft} className="w-full mt-3 text-sm py-1.5 px-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded">
                🔄 Gambar Ulang
              </button>
            </>
          )}

          {/* Hapus Semua (reset state) */}
          <button
            onClick={() => {
              onDeleteLine();
              resetDraft();
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded text-sm mt-4"
          >
            🗑️ Hapus Semua
          </button>
        </div>
      )}
    </div>
  );
}
