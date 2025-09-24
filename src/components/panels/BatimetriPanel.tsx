// src/components/panels/BatimetriPanel.tsx
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useData } from "@/context/DataContext";
import { Feature } from "geojson";
import * as L from "leaflet";

// ✅ Helper: Ambil token dari localStorage
const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

interface BatimetriPanelProps {
  onClose: () => void;
  map: L.Map | null;
}

// ✅ TypeScript: Respons dari generateBatimetriFromSamplingPoints
interface GenerateBatimetriResult {
  success: boolean;
  message: string;
  survey_id?: string;
  point_count?: number;
  depth_range?: [number, number];
}

export default function BatimetriPanel({ onClose, map }: BatimetriPanelProps) {
  const { features: allFeatures, refreshData, user } = useData();

  // State
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [visibleLayers, setVisibleLayers] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  // --- DRAGGABLE ---
  const panelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 32, y: 16 });

  // --- Load saved position ---
  useEffect(() => {
    const saved = localStorage.getItem("batimetriPanelPosition");
    if (saved) {
      try {
        const pos = JSON.parse(saved);
        if (typeof pos.x === "number" && typeof pos.y === "number") {
          setPosition(pos);
        }
      } catch (e) {
        console.warn("⚠️ [BatimetriPanel] Gagal baca posisi:", e);
      }
    }
  }, []);

  const savePosition = (x: number, y: number) => {
    setPosition({ x, y });
    localStorage.setItem("batimetriPanelPosition", JSON.stringify({ x, y }));
  };

  // ✅ Perbaikan: Hanya aktifkan drag saat klik di HEADER
  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if (!panelRef.current) return;

    // Cek apakah klik di tombol tutup — jangan drag!
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }

    const rect = panelRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setIsDragging(true);

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
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

  // ✅ DEBUG: Log allFeatures saat berubah
  useEffect(() => {
    console.log("📊 [DEBUG] allFeatures diperbarui:", {
      total: allFeatures?.features?.length,
      sample: allFeatures?.features?.slice(0, 3),
    });
  }, [allFeatures]);

  // ✅ Ganti useEffect dengan useMemo — LEBIH RINGAN!
  const surveyOptions = useMemo(() => {
    if (!user || !allFeatures || !Array.isArray(allFeatures.features)) {
      console.warn("⚠️ [DEBUG] allFeatures atau user belum siap");
      return [];
    }

    const surveys = new Set<string>();
    const options: { id: string; name: string; sourceType: string }[] = [];

    allFeatures.features.forEach((f: any) => {
      const props = f.properties || {};

      // Hanya ambil titik sampling
      if (props.layerType !== "valid_sampling_point") {
        return;
      }

      // ✅ survey_id ada LANGSUNG di properties
      const surveyId = props.survey_id;
      let sourceType = props.source_type || "unknown";

      // ✅ Deteksi otomatis berdasarkan pola survey_id
      if (sourceType === "unknown" && surveyId) {
        if (surveyId.startsWith("SIM_")) {
          sourceType = "simulation";
        } else if (surveyId.includes("UPLOAD") || surveyId.startsWith("ECH_")) {
          sourceType = "echosounder_upload";
        }
      }

      if (!surveyId) {
        console.warn("⚠️ [DEBUG] Feature tanpa survey_id:", f.id, props);
        return;
      }

      if (!surveys.has(surveyId)) {
        surveys.add(surveyId);
        options.push({
          id: surveyId,
          name: surveyId,
          sourceType,
        });
      }
    });

    console.log("✅ [DEBUG] Survey options ditemukan:", options);
    return options;
  }, [allFeatures, user]);

  // ✅ Filter berdasarkan search
  const filteredSurveyOptions = useMemo(() => {
    return surveyOptions.filter((opt) => opt.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [surveyOptions, searchTerm]);

  // ✅ PERBAIKAN UTAMA: Filter layer batimetri berdasarkan selectedSurveyId
  const batimetriLayers = useMemo(() => {
    if (!selectedSurveyId) {
      console.log("ℹ️ [DEBUG] selectedSurveyId kosong, return []");
      return [];
    }

    if (!allFeatures) {
      console.warn("⚠️ [DEBUG] allFeatures belum tersedia");
      return [];
    }

    if (!Array.isArray(allFeatures.features)) {
      console.warn("⚠️ [DEBUG] allFeatures.features bukan array:", allFeatures);
      return [];
    }

    // ✅ Filter layer hasil generate yang sesuai survey_id
    const layers = allFeatures.features.filter((f: any) => {
      const props = f.properties || {};

      const isBatimetriLayer = props.layerType === "kontur_batimetri" || props.layerType === "permukaan_batimetri";

      // ✅ PERBAIKAN UTAMA: Cek survey_id di properties
      const matchesSurvey = props.survey_id === selectedSurveyId;

      return isBatimetriLayer && matchesSurvey;
    });

    console.log(`✅ [DEBUG] Layer hasil generate ditemukan untuk survey ${selectedSurveyId}:`, layers.length, layers);
    return layers;
  }, [allFeatures, selectedSurveyId]);

  // ✅ Generate Kontur & Batimetri — DIPERBAIKI UNTUK TANGANI GRAPHQL ERROR
  const handleGenerateBatimetri = async () => {
    if (!selectedSurveyId) {
      alert("Pilih survey ID terlebih dahulu!");
      return;
    }

    // ✅ PERBAIKAN UTAMA: Validasi user.id
    if (!user?.id) {
      console.error("❌ [DEBUG] user.id tidak tersedia. Token mungkin kadaluarsa atau user belum login.");
      alert("User ID tidak tersedia. Silakan login ulang.");
      return;
    }

    setIsGenerating(true);

    try {
      console.log("🚀 [DEBUG] Memulai generate untuk survey:", selectedSurveyId, "user:", user.id);

      const res = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          query: `
          mutation GenerateBatimetri($surveyId: String!) {
            generateBatimetriFromSamplingPoints(surveyId: $surveyId) {
              success
              message
            }
          }
        `,
          variables: { surveyId: selectedSurveyId },
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log("📡 [DEBUG] Response dari generate:", data);

      // ✅ PERBAIKAN UTAMA: CEK GRAPHQL ERRORS
      if (data.errors && data.errors.length > 0) {
        const errorMsg = data.errors[0].message || "GraphQL Error tidak diketahui";
        console.error("❌ [GraphQL Error]:", errorMsg);
        alert("❌ Gagal generate: " + errorMsg);
        throw new Error(errorMsg);
      }

      // ✅ Validasi struktur data
      const result = data.data?.generateBatimetriFromSamplingPoints as GenerateBatimetriResult | undefined;

      if (!result) {
        throw new Error("Respons tidak valid: generateBatimetriFromSamplingPoints tidak ditemukan");
      }

      if (result.success) {
        alert("✅ Kontur & batimetri berhasil digenerate!");
        console.log("🔄 [DEBUG] Memanggil refreshData()...");
        await refreshData();
      } else {
        const message = result.message || "Gagal generate tanpa pesan";
        alert("❌ Gagal: " + message);
        console.error("❌ [DEBUG] Gagal generate:", message);
      }
    } catch (err: any) {
      console.error("🔥 [DEBUG] Error saat generate:", err);
      // Tampilkan pesan error yang lebih jelas ke user
      const userMessage = err.message || "Terjadi kesalahan saat generate batimetri";
      alert("❌ Gagal generate batimetri: " + userMessage);
    } finally {
      setIsGenerating(false);
      console.log("⏹️ [DEBUG] Proses generate selesai");
    }
  };

  // ✅ Toggle visibility layer di peta
  const toggleLayerVisibility = (layerId: string | number) => {
    const idStr = String(layerId);
    console.log("👁️ [DEBUG] Toggle visibility untuk layer:", idStr);

    setVisibleLayers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(idStr)) {
        newSet.delete(idStr);
        console.log("🙈 [DEBUG] Sembunyikan layer:", idStr);
        // @ts-ignore
        if (map?._layers[idStr]) {
          map.removeLayer(map._layers[idStr]);
        }
      } else {
        newSet.add(idStr);
        console.log("🐵 [DEBUG] Tampilkan layer:", idStr);
      }
      return newSet;
    });
  };

  return (
    <div
      ref={panelRef}
      className="absolute z-[10000] bg-white rounded-xl shadow-xl p-5 w-80 border border-gray-200 batimetri-panel"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "default",
      }}
    >
      {/* ✅ HEADER — hanya di sini drag diaktifkan */}
      <div className="flex items-center justify-between mb-4 cursor-grab active:cursor-grabbing select-none" onMouseDown={handleHeaderMouseDown} style={{ WebkitUserSelect: "none", userSelect: "none" }}>
        <h3 className="text-xl font-bold text-gray-800">🌊 Kontur & Batimetri</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-lg font-bold">
          ✖️
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Survey ID:</label>

        <input type="text" placeholder="Cari survey ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 mb-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500" />

        <div className="relative z-50">
          <select
            value={selectedSurveyId}
            onChange={(e) => {
              const newId = e.target.value;
              console.log("🎯 [DEBUG] Survey dipilih:", newId);
              setSelectedSurveyId(newId);
            }}
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            style={{ position: "relative", zIndex: 10000, pointerEvents: "auto" }}
          >
            <option value="">-- Pilih Survey --</option>

            {surveyOptions.length === 0 ? (
              <option value="" disabled>
                Loading surveys...
              </option>
            ) : (
              <>
                <optgroup label="📊 Simulasi">
                  {filteredSurveyOptions
                    .filter((opt) => opt.sourceType === "simulation")
                    .map((opt) => (
                      <option key={opt.id} value={opt.id} className="text-gray-800">
                        {opt.name} [SIM]
                      </option>
                    ))}
                </optgroup>

                <optgroup label="📡 Upload Echosounder">
                  {filteredSurveyOptions
                    .filter((opt) => opt.sourceType === "echosounder_upload")
                    .map((opt) => (
                      <option key={opt.id} value={opt.id} className="text-gray-800">
                        {opt.name} [UPLOAD]
                      </option>
                    ))}
                </optgroup>

                <optgroup label="❓ Unknown">
                  {filteredSurveyOptions
                    .filter((opt) => opt.sourceType === "unknown")
                    .map((opt) => (
                      <option key={opt.id} value={opt.id} className="text-gray-800">
                        {opt.name} [?]
                      </option>
                    ))}
                </optgroup>
              </>
            )}
          </select>
        </div>

        <div className="mt-1 text-xs text-gray-500">
          Total: {surveyOptions.length} | Ditampilkan: {filteredSurveyOptions.length}
        </div>
      </div>

      {selectedSurveyId && (
        <>
          <button
            onClick={handleGenerateBatimetri}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg text-sm shadow transition-all duration-200 mb-4"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              "🚀 Generate Kontur & Batimetri"
            )}
          </button>

          {/* ✅ Daftar Layer Hasil Generate */}
          {batimetriLayers.length > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <h4 className="text-sm font-bold text-blue-800 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Layer Hasil Generate ({batimetriLayers.length})
              </h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {batimetriLayers.map((layer) => {
                  const props = layer.properties || {};
                  const layerType = props.layerType;
                  const isKontur = layerType === "kontur_batimetri";

                  const depth = isKontur ? props.depth_value || props.kedalaman || "-" : "Permukaan";
                  const layerName = isKontur ? `Kontur ${depth} m` : "Permukaan Batimetri";
                  const bgColor = isKontur ? "bg-blue-100" : "bg-indigo-100";
                  const textColor = isKontur ? "text-blue-800" : "text-indigo-800";
                  const borderColor = isKontur ? "border-blue-300" : "border-indigo-300";

                  return (
                    <div key={layer.id || Math.random()} className={`flex items-center justify-between p-3 rounded-lg border ${borderColor} ${bgColor} transition-all duration-200 hover:shadow-md`}>
                      <div className="flex-1">
                        <div className={`text-xs font-bold ${textColor}`}>{layerName}</div>
                        <div className="text-[10px] text-gray-600 mt-1">{isKontur ? `Kedalaman: ${depth} m` : "Interpolasi TIN"}</div>
                        <div className="text-[9px] text-gray-500 mt-1">ID: {String(layer.id).substring(0, 8)}...</div>
                      </div>
                      <button
                        onClick={() => toggleLayerVisibility(layer.id || "")}
                        className={`ml-3 text-xs py-1.5 px-3 rounded font-medium transition-colors ${visibleLayers.has(String(layer.id)) ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-700 hover:bg-gray-400"}`}
                      >
                        {visibleLayers.has(String(layer.id)) ? "👁️ Hide" : "👁️ Show"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {batimetriLayers.length === 0 && selectedSurveyId && !isGenerating && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">📌 Belum ada layer hasil generate. Klik tombol "Generate Kontur & Batimetri" di atas.</p>
              <p className="text-xs text-yellow-700 mt-1">Survey ID: {selectedSurveyId}</p>
            </div>
          )}

          {isGenerating && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">⏳ Sedang memproses... Silakan tunggu.</p>
            </div>
          )}
        </>
      )}

      <button onClick={onClose} className="w-full mt-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors duration-200">
        ✖️ Tutup Panel
      </button>

      {isDragging && <div className="absolute inset-0 border-2 border-blue-400 rounded-xl pointer-events-none animate-pulse"></div>}
    </div>
  );
}
