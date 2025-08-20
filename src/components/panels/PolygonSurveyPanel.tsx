// src/components/panels/PolygonSurveyPanel.tsx
"use client";
import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { useTool } from "@/context/ToolContext";
import * as L from "leaflet";
import { Feature } from "geojson";

// ✅ Helper: Ambil token dari localStorage
const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

// ✅ Helper: Tambah header otentikasi
const getAuthHeaders = () => {
  const token = getAuthToken();
  console.log("🔐 Token ditemukan:", !!token ? "Ya" : "Tidak");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ✅ Helper: Decode JWT untuk debug
const decodeToken = (token: string | null) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("👤 Token payload:", payload);
    return payload;
  } catch (e) {
    console.error("❌ Gagal decode token:", e);
    return null;
  }
};

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
  const { refreshData, features } = useData();
  const { surveyMode } = useTool();

  // Mode input: lineCount, pointCount, atau fixedSpacing
  const [mode, setMode] = useState<"lineCount" | "pointCount" | "fixedSpacing">("lineCount");
  const [lineCount, setLineCount] = useState(10);
  const [pointCount, setPointCount] = useState(20);
  const [spacing, setSpacing] = useState(100);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [surveyId, setSurveyId] = useState<string | null>(null);

  // Debug
  const [debugInfo, setDebugInfo] = useState<{
    totalFeatures: number;
    validSamplingCount: number;
    matchingCount: number;
  } | null>(null);

  // Cek apakah polygon sudah selesai
  const hasCompletedPolygon = drawnPolygon.length >= 3;

  // Reset saat draftId berubah
  useEffect(() => {
    if (!draftId) {
      setIsDataReady(false);
      setDebugInfo(null);
      setSurveyId(null);
      setLineCount(10);
      setPointCount(20);
      setSpacing(100);
    }
  }, [draftId]);

  const calculateArea = (points: L.LatLng[]) => {
    let area = 0;
    const len = points.length;
    for (let i = 0; i < len; i++) {
      const j = (i + 1) % len;
      area += points[i].lng * points[j].lat;
      area -= points[j].lng * points[i].lat;
    }
    return Math.abs(area / 2);
  };

  // --- PROSES SURVEY DARI POLYGON ---
  const handleProcessSurvey = async () => {
    if (!draftId) {
      alert("Simpan draft polygon terlebih dahulu.");
      return;
    }

    const id = `SURVEY_${Math.floor(Date.now() / 1000)}`;
    setSurveyId(id);
    setIsProcessing(true);
    setIsDataReady(false);

    try {
      // ✅ Pastikan tipe data benar: Int! dan Float!
      const variables = {
        surveyId: id,
        polygonDraftId: parseInt(draftId as any), // Int!
        lineCount: mode === "lineCount" ? parseInt(lineCount as any) : null, // Int
        pointCount: mode === "pointCount" ? parseInt(pointCount as any) : null, // Int
        fixedSpacing: mode === "fixedSpacing" ? parseFloat(spacing as any) : null, // Float
      };

      console.log("🚀 handleProcessSurvey dipanggil");
      console.log("draftId:", draftId, typeof draftId);
      console.log("mode:", mode);
      console.log("lineCount:", lineCount, typeof lineCount);
      console.log("pointCount:", pointCount, typeof pointCount);
      console.log("spacing:", spacing, typeof spacing);
      console.log(":variables:", variables);

      const requestBody = {
        query: `
          mutation GenerateTransekFromPolygonByDraft(
            $surveyId: String!
            $polygonDraftId: Int!
            $lineCount: Int
            $pointCount: Int
            $fixedSpacing: Float
          ) {
            generateTransekFromPolygonByDraft(
              surveyId: $surveyId
              polygonDraftId: $polygonDraftId
              lineCount: $lineCount
              pointCount: $pointCount
              fixedSpacing: $fixedSpacing
            ) {
              success
              message
            }
          }
        `,
        variables,
      };

      console.log("📤 Mengirim ke GraphQL:", JSON.stringify(requestBody, null, 2));

      const res = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });

      console.log("📡 HTTP Status:", res.status, res.statusText);

      const responseText = await res.text();
      console.log("🔍 Raw Response dari Server:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("❌ Response bukan JSON valid:", responseText);
        throw new Error("Server mengembalikan data tidak valid");
      }

      console.log("✅ Response JSON:", data);

      if (data.errors) {
        console.error("❌ GraphQL Errors:", data.errors);
        throw new Error(`GraphQL Error: ${data.errors[0].message}`);
      }

      const result = data.data?.generateTransekFromPolygonByDraft;

      if (!result) {
        console.error("❌ Tidak ada data hasil dari mutation");
        throw new Error("Tidak ada hasil dari server");
      }

      console.log("🎯 Hasil Mutation:", result);

      if (result.success) {
        alert("✅ Proses transek dari polygon selesai. Menampilkan hasil...");
        await refreshData();
        setIsDataReady(true);

        const validSampling = features?.features?.filter((f: any) => f.properties?.layerType === "valid_sampling_point").length;
        const matching = features?.features?.filter((f: any) => f.properties?.layerType === "valid_sampling_point" && f.properties?.survey_id === id).length;

        setDebugInfo({
          totalFeatures: features?.features?.length || 0,
          validSamplingCount: validSampling || 0,
          matchingCount: matching || 0,
        });
      } else {
        const errorMsg = result.message || "Proses gagal";
        console.error("❌ Mutation gagal:", errorMsg);
        alert(`❌ Gagal: ${errorMsg}`);
      }
    } catch (err: any) {
      console.error("❌ Gagal proses transek dari polygon:", err);
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
        headers: getAuthHeaders(),
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
        downloadFile(JSON.stringify(geojson, null, 2), `${surveyId}.geojson`, "application/json");
      }

      if (format === "csv") {
        const headers = ["ID", "Survey ID", "Latitude", "Longitude", "Kedalaman (m)", "Jarak dari Awal (m)"];
        const rows = points.map((p: any) => {
          const [lng, lat] = p.geometry?.coordinates || ["-", "-"];
          return [p.id, p.meta?.survey_id || "-", lat?.toFixed(6), lng?.toFixed(6), (p.meta?.kedalaman ?? p.description?.replace("Depth: ", "")).toString(), (p.meta?.distance_m || "-").toString()].join(",");
        });
        downloadFile([headers.join(","), ...rows].join("\n"), `${surveyId}.csv`, "text/csv");
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

  // --- RESET ALUR ---
  const resetDraft = () => {
    setDraftId(null);
    setIsDataReady(false);
    setDebugInfo(null);
    setSurveyId(null);
    setLineCount(10);
    setPointCount(20);
    setSpacing(100);
  };

  // 🔥 Debug: Cek token saat mount
  useEffect(() => {
    const token = getAuthToken();
    decodeToken(token);
  }, []);

  return (
    <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-xl shadow-xl p-5 w-80 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">📐 Transek Polygon</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">
          ←
        </button>
      </div>

      {!hasCompletedPolygon && !isDrawing && (
        <button onClick={() => setActiveTool("drawpolygon")} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 rounded text-sm mb-3">
          ✏️ Mulai Gambar Polygon
        </button>
      )}

      {isDrawing && drawnPolygon.length > 0 && (
        <div className="mb-3">
          <div className="text-xs text-blue-600 mb-2">📏 Area: {calculateArea(drawnPolygon).toFixed(2)} m²</div>
          <div className="text-xs text-gray-500 mb-2">👆 Klik untuk tambah titik</div>
          <div className="text-xs text-gray-500 mb-2">🖱️ Klik kanan untuk selesai</div>
          <button onClick={() => setActiveTool(null)} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded text-sm">
            ✅ Selesai Menggambar
          </button>
        </div>
      )}

      {hasCompletedPolygon && !isDrawing && (
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
              <p className="text-sm text-gray-600 mb-3 italic">Langkah 2: Proses Transek</p>

              {/* Mode Toggle */}
              <div className="mb-3 flex gap-2">
                <label className="flex items-center">
                  <input type="radio" value="lineCount" checked={mode === "lineCount"} onChange={() => setMode("lineCount")} className="mr-1" />
                  Jumlah Garis
                </label>
                <label className="flex items-center">
                  <input type="radio" value="pointCount" checked={mode === "pointCount"} onChange={() => setMode("pointCount")} className="mr-1" />
                  Jumlah Titik
                </label>
                <label className="flex items-center">
                  <input type="radio" value="fixedSpacing" checked={mode === "fixedSpacing"} onChange={() => setMode("fixedSpacing")} className="mr-1" />
                  Jarak (m)
                </label>
              </div>

              {/* Input sesuai mode */}
              {mode === "lineCount" && (
                <div className="mb-3">
                  <label className="block text-xs font-bold mb-1 text-gray-800">Jumlah Garis</label>
                  <input type="number" value={lineCount} onChange={(e) => setLineCount(Math.max(1, parseInt(e.target.value) || 1))} className="w-full p-1 border border-gray-600 rounded text-sm" min="1" />
                </div>
              )}

              {mode === "pointCount" && (
                <div className="mb-3">
                  <label className="block text-xs font-bold mb-1 text-gray-800">Jumlah Titik Sampling</label>
                  <input type="number" value={pointCount} onChange={(e) => setPointCount(Math.max(2, parseInt(e.target.value) || 2))} className="w-full p-1 border border-gray-600 rounded text-sm" min="2" />
                </div>
              )}

              {mode === "fixedSpacing" && (
                <div className="mb-3">
                  <label className="block text-xs font-bold mb-1 text-gray-800">Jarak Antar Garis (m)</label>
                  <input type="number" value={spacing} onChange={(e) => setSpacing(Math.max(1, parseFloat(e.target.value) || 1))} className="w-full p-1 border border-gray-600 rounded text-sm" min="1" />
                </div>
              )}

              <button onClick={handleProcessSurvey} disabled={isProcessing} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2 rounded mt-3 font-semibold">
                {isProcessing ? "Memproses..." : "🚀 Proses Transek"}
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

          {/* Hapus Semua */}
          <button
            onClick={() => {
              onDeletePolygon();
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
