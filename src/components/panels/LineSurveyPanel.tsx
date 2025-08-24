// src/components/panels/LineSurveyPanel.tsx
"use client";
import { useState, useEffect, useRef } from "react";
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

  // --- DRAGGABLE ---
  const panelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 32, y: 16 }); // default posisi

  // Muat posisi dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("lineSurveyPanelPosition");
    if (saved) {
      try {
        const pos = JSON.parse(saved);
        setPosition(pos);
      } catch (e) {
        console.warn("Gagal baca posisi LineSurveyPanel");
      }
    }
  }, []);

  // Simpan posisi ke localStorage
  const savePosition = (x: number, y: number) => {
    setPosition({ x, y });
    localStorage.setItem("lineSurveyPanelPosition", JSON.stringify({ x, y }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // ✅ Hanya tombol kiri mouse (0 = left, 1 = middle, 2 = right)
    if (e.button !== 0) return;

    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setIsDragging(true);

    // ✅ Prevent text selection saat drag
    e.preventDefault();

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;
      savePosition(newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

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
        console.log("🔍 Memuat daftar area_sungai...");
        const res = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: getAuthHeaders(),
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

        console.log("📡 Status response:", res.status, res.statusText);

        const text = await res.text();
        console.log("🔍 Raw response:", text);

        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("❌ Response bukan JSON valid:", text);
          throw new Error("Server mengembalikan data tidak valid");
        }

        if (data.errors) {
          console.error("❌ GraphQL Errors:", data.errors);
          throw new Error(`GraphQL Error: ${data.errors[0].message}`);
        }

        if (data.data?.layerOptions) {
          console.log("✅ Area berhasil dimuat:", data.data.layerOptions);
          setAreaOptions(data.data.layerOptions);
          if (!selectedAreaId && data.data.layerOptions.length > 0) {
            setSelectedAreaId(data.data.layerOptions[0].id);
          }
        } else {
          throw new Error("Tidak ada data area");
        }
      } catch (err) {
        console.error("❌ Gagal muat area:", err);
        alert("Gagal memuat daftar area. Cek konsol untuk detail.");
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
      const variables = {
        surveyId: id,
        draftId: parseInt(draftId as any),
        areaId: parseInt(selectedAreaId as any),
        spasi: parseFloat(spasi as any),
        panjang: parseFloat(panjang as any),
      };

      console.log("🚀 handleProcessSurvey dipanggil");
      console.log("draftId:", draftId, typeof draftId);
      console.log("areaId:", selectedAreaId, typeof selectedAreaId);
      console.log("spasi:", spasi, typeof spasi);
      console.log("panjang:", panjang, typeof panjang);
      console.log(":variables:", variables);

      const requestBody = {
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

      const result = data.data?.generateSurvey;

      if (!result) {
        console.error("❌ Tidak ada data hasil dari mutation");
        throw new Error("Tidak ada hasil dari server");
      }

      console.log("🎯 Hasil Mutation:", result);

      if (result.success) {
        alert("✅ Proses survey selesai. Menampilkan hasil...");
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
      console.error("❌ Gagal proses survey:", err);
      alert(`❌ Gagal: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- HAPUS HASIL SURVEY ---
  const handleDeleteSurveyResult = async () => {
    if (!surveyId) return alert("Belum ada hasil survey.");
    if (!confirm(`Yakin ingin hapus semua hasil dari survey ini?\nIni akan menghapus transek dan titik sampling.`)) return;

    try {
      const res = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          query: `
            mutation DeleteSurveyResults($surveyId: String!) {
              deleteSurveyResults(surveyId: $surveyId) {
                success
                message
              }
            }
          `,
          variables: { surveyId },
        }),
      });

      const data = await res.json();
      if (data.data?.deleteSurveyResults.success) {
        alert(data.data.deleteSurveyResults.message);
        setIsDataReady(false);
        setDebugInfo(null);
        await refreshData(); // Refresh peta
      } else {
        throw new Error(data.data?.deleteSurveyResults.message || "Gagal hapus hasil survey");
      }
    } catch (err: any) {
      alert(`❌ Gagal: ${err.message}`);
    }
  };

  // --- EXPORT SAMPLING POINTS ---
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
    setSpasi(100);
    setPanjang(300);
    if (areaOptions.length > 0) {
      setSelectedAreaId(areaOptions[0].id);
    }
  };

  // 🔥 Debug: Info Token dan User
  useEffect(() => {
    const token = getAuthToken();
    decodeToken(token);
  }, []);

  return (
    <div
      ref={panelRef}
      className="absolute z-[1000] bg-white rounded-xl shadow-xl p-5 w-80 border border-gray-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(0, 0)",
        willChange: isDragging ? "transform" : "auto",
        cursor: isDragging ? "grabbing" : "default",
      }}
    >
      {/* Header sebagai handle drag */}
      <div className="flex items-center justify-between mb-4 cursor-grab active:cursor-grabbing select-none" onMouseDown={handleMouseDown}>
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
                  <input
                    type="number"
                    value={spasi}
                    onChange={(e) => setSpasi(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-1 bg-white border border-gray-600 rounded text-sm text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-gray-800">Panjang (m)</label>
                  <input
                    type="number"
                    value={panjang}
                    onChange={(e) => setPanjang(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-1 bg-white border border-gray-600 rounded text-sm text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    placeholder="300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-gray-800">Area Pemotong</label>
                <select
                  value={selectedAreaId ?? ""}
                  onChange={(e) => setSelectedAreaId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full p-2 bg-white border border-gray-600 rounded text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
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

              {/* Tombol Hapus Hasil Survey */}
              {isDataReady && (
                <button onClick={handleDeleteSurveyResult} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded mt-2 text-sm">
                  🗑️ Hapus Hasil Survey
                </button>
              )}

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
              onDeleteLine();
              resetDraft();
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded text-sm mt-4"
          >
            🗑️ Hapus Semua
          </button>
        </div>
      )}

      {/* Indicator saat dragging */}
      {isDragging && <div className="absolute inset-0 border-2 border-blue-400 rounded-lg pointer-events-none"></div>}
    </div>
  );
}
