// src/components/panels/LineSurveyPanel.tsx
"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useData } from "@/context/DataContext";
import { useTool } from "@/context/ToolContext";
import * as L from "leaflet";
import { Feature } from "geojson";
import * as UTM from "utm"; // ✅ Tambahkan library UTM

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

  const [spasi, setSpasi] = useState<number>(100);
  const [panjang, setPanjang] = useState<number>(300);
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
  const [position, setPosition] = useState({ x: 32, y: 16 });

  // Muat posisi dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("lineSurveyPanelPosition");
    if (saved) {
      try {
        const pos = JSON.parse(saved);
        if (typeof pos.x === "number" && typeof pos.y === "number") {
          setPosition(pos);
        }
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
    if (e.button !== 0) return;
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setIsDragging(true);
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

        const text = await res.text();
        console.log("🔍 Raw GraphQL Response:", text);

        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error("Server mengembalikan data tidak valid (bukan JSON)");
        }

        if (data.errors) {
          console.error("GraphQL Errors:", data.errors);
          throw new Error(data.errors[0].message || "GraphQL error");
        }

        const options = data.data?.layerOptions;

        if (Array.isArray(options)) {
          setAreaOptions(options);
          if (!selectedAreaId && options.length > 0) {
            setSelectedAreaId(options[0].id);
          }
        } else {
          console.error("layerOptions bukan array:", options);
          setAreaOptions([]);
          alert("Data area tidak valid: format salah dari server.");
        }
      } catch (err: any) {
        console.error("❌ Gagal muat area:", err);
        alert("Gagal memuat daftar area. Cek koneksi atau login ulang.");
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

      const res = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });

      const responseText = await res.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error("Server mengembalikan data tidak valid");
      }

      if (data.errors) throw new Error(data.errors[0].message);

      const result = data.data?.generateSurvey;
      if (!result) throw new Error("Tidak ada hasil dari server");

      if (result.success) {
        alert("✅ Proses survey selesai.");
        await refreshData();
        setIsDataReady(true);

        const validSampling = features?.features?.filter((f: any) => f.properties?.layerType === "valid_sampling_point").length;
        const matching = features?.features?.filter((f: any) => f.properties?.layerType === "valid_sampling_point" && f.properties?.metadata?.survey_id === id).length;

        setDebugInfo({
          totalFeatures: features?.features?.length || 0,
          validSamplingCount: validSampling || 0,
          matchingCount: matching || 0,
        });
      } else {
        alert(`❌ Gagal: ${result.message || "Proses gagal"}`);
      }
    } catch (err: any) {
      alert(`❌ Gagal: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- HAPUS HASIL SURVEY ---
  const handleDeleteSurveyResult = async () => {
    if (!surveyId) return alert("Belum ada hasil survey.");
    if (!confirm("Yakin ingin hapus semua hasil dari survey ini?")) return;

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
        await refreshData();
      } else {
        throw new Error("Gagal hapus hasil survey");
      }
    } catch (err: any) {
      alert(`❌ Gagal: ${err.message}`);
    }
  };

  // --- FORMAT KOORDINAT ---
  const [coordFormat, setCoordFormat] = useState<"latlng" | "utm">("latlng");

  // Konversi ke UTM
  const toUTM = (lng: number, lat: number) => {
    try {
      const result = UTM.fromLatLon(lat, lng);
      return {
        easting: result.easting,
        northing: result.northing,
        zoneNum: result.zoneNum,
        zoneLetter: result.zoneLetter,
      };
    } catch (e) {
      console.error("Gagal konversi ke UTM:", e);
      return null;
    }
  };

  // --- EXPORT CSV ---
  const handleExportCSV = async () => {
    if (!surveyId || !isDataReady) return alert("Data belum siap untuk diekspor.");

    try {
      const res = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          query: `
            query GetSamplingPoints($surveyId: String!) {
              samplingPointsBySurveyId(surveyId: $surveyId) {
                id
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

      if (!Array.isArray(points) || points.length === 0) {
        return alert("⚠️ Tidak ada titik untuk diekspor.");
      }

      const isUTM = coordFormat === "utm";

      const headers = isUTM ? ["ID", "Survey ID", "Easting", "Northing", "Zone", "Kedalaman (m)", "Jarak dari Awal (m)"] : ["ID", "Survey ID", "Latitude", "Longitude", "Kedalaman (m)", "Jarak dari Awal (m)"];

      const rows = points.map((p: any) => {
        const [lng, lat] = p.geometry?.coordinates || ["-", "-"];
        const depth = p.meta?.depth_value ?? p.meta?.kedalaman ?? "-";
        const distance = p.meta?.distance_m ?? "-";

        if (isUTM) {
          const utm = toUTM(lng, lat);
          if (!utm) return [p.id, p.meta?.survey_id || "-", "-", "-", "-", depth, distance].join(",");
          return [p.id, p.meta?.survey_id || "-", utm.easting.toFixed(2), utm.northing.toFixed(2), `${utm.zoneNum}${utm.zoneLetter}`, depth, distance].join(",");
        } else {
          return [p.id, p.meta?.survey_id || "-", lat?.toFixed(6), lng?.toFixed(6), depth, distance].join(",");
        }
      });

      const csvContent = [headers.join(","), ...rows].join("\n");
      const filename = isUTM ? `${surveyId}_utm.csv` : `${surveyId}_latlng.csv`;
      downloadFile(csvContent, filename, "text/csv");
    } catch (err) {
      alert("Gagal ambil data untuk export CSV.");
    }
  };

  // --- EXPORT KML ---
  const handleExportKML = async () => {
    if (!surveyId || !isDataReady) return alert("Data belum siap untuk diekspor.");

    try {
      const res = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          query: `
            query GetSamplingPoints($surveyId: String!) {
              samplingPointsBySurveyId(surveyId: $surveyId) {
                id
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

      if (!Array.isArray(points) || points.length === 0) {
        return alert("⚠️ Tidak ada titik untuk diekspor.");
      }

      let kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Sampling Points - ${surveyId} (${coordFormat.toUpperCase()})</name>
    <description>Titik sampling dari survei sungai dengan ID: ${surveyId}</description>
`;

      points.forEach((p: any) => {
        const [lng, lat] = p.geometry?.coordinates || [0, 0];
        const depth = p.meta?.depth_value ?? p.meta?.kedalaman ?? 0;
        const name = p.name || `Point ${p.id}`;
        const description = p.description || `Kedalaman: ${depth} m`;

        if (coordFormat === "utm") {
          const utm = toUTM(lng, lat);
          if (utm) {
            kml += `
    <Placemark>
      <name>${name}</name>
      <description>${description} | Easting: ${utm.easting.toFixed(2)}, Northing: ${utm.northing.toFixed(2)}, Zone: ${utm.zoneNum}${utm.zoneLetter}</description>
      <ExtendedData>
        <Data name="Easting"><value>${utm.easting.toFixed(2)}</value></Data>
        <Data name="Northing"><value>${utm.northing.toFixed(2)}</value></Data>
        <Data name="Zone"><value>${utm.zoneNum}${utm.zoneLetter}</value></Data>
        <Data name="Depth"><value>${depth}</value></Data>
      </ExtendedData>
    </Placemark>
`;
          }
        } else {
          kml += `
    <Placemark>
      <name>${name}</name>
      <description>${description}</description>
      <Point>
        <coordinates>${lng},${lat},0</coordinates>
      </Point>
      <ExtendedData>
        <Data name="Latitude"><value>${lat.toFixed(6)}</value></Data>
        <Data name="Longitude"><value>${lng.toFixed(6)}</value></Data>
        <Data name="Depth"><value>${depth}</value></Data>
      </ExtendedData>
    </Placemark>
`;
        }
      });

      kml += `
  </Document>
</kml>`;

      const filename = coordFormat === "utm" ? `${surveyId}_utm.kml` : `${surveyId}_latlng.kml`;
      downloadFile(kml, filename, "application/vnd.google-earth.kml+xml");
    } catch (err) {
      alert("Gagal ambil data untuk export ke KML.");
    }
  };

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
    if (Array.isArray(areaOptions) && areaOptions.length > 0) {
      setSelectedAreaId(areaOptions[0].id);
    }
  };

  // 🔥 Debug: Info Token dan User
  useEffect(() => {
    const token = getAuthToken();
    decodeToken(token);
  }, []);

  // ✅ Ambil titik sampling untuk 3D
  const samplingPoints = useMemo(() => {
    if (!surveyId || !features?.features) return [];

    return features.features
      .filter((f) => {
        const isValidType = f.properties?.layerType === "valid_sampling_point" || f.properties?.layerType === "batimetri";
        const hasSurveyId = f.properties?.metadata?.survey_id === surveyId;
        return isValidType && hasSurveyId;
      })
      .map((f) => {
        const [x, y] = f.geometry?.coordinates || [0, 0];
        const depth = f.properties?.metadata?.depth_value || f.properties?.metadata?.kedalaman || 0;

        return {
          x,
          y,
          z: Math.abs(depth),
        };
      });
  }, [features, surveyId]);

  // ✅ Debug: Cek data sampling
  useEffect(() => {
    console.log("📊 samplingPoints untuk 3D:", samplingPoints);
  }, [samplingPoints]);

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
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setSpasi(isNaN(val) || val < 1 ? 1 : val);
                    }}
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
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setPanjang(isNaN(val) || val < 1 ? 1 : val);
                    }}
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
                  {Array.isArray(areaOptions) ? (
                    areaOptions.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>⚠️ Gagal muat data</option>
                  )}
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

              {/* Pilihan Format Koordinat */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">📍 Format Koordinat</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button onClick={() => setCoordFormat("latlng")} className={`text-xs py-1.5 px-2 rounded ${coordFormat === "latlng" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}>
                    Lat/Lng
                  </button>
                  <button onClick={() => setCoordFormat("utm")} className={`text-xs py-1.5 px-2 rounded ${coordFormat === "utm" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`}>
                    UTM
                  </button>
                </div>

                <p className="text-xs text-gray-500 mb-2">📤 Export Data Sampling</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={handleExportCSV} disabled={!isDataReady} className={`text-xs py-1.5 px-2 rounded ${isDataReady ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
                    📄 CSV
                  </button>
                  <button onClick={handleExportKML} disabled={!isDataReady} className={`text-xs py-1.5 px-2 rounded ${isDataReady ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
                    🌍 KML
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
