// src/components/panels/PolygonParallelPanel.tsx
"use client";

import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import * as L from "leaflet";
import { Feature, LineString, Polygon as GeoJSONPolygon } from "geojson";
import { useData } from "@/context/DataContext";
import { useTool } from "@/context/ToolContext";
import * as UTM from "utm";

// ✅ Helper: Ambil token dari localStorage
const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  console.log("🔐 Token ditemukan:", !!token ? "Ya" : "Tidak");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ✅ PERBAIKAN 1: Ubah signature onSaveDraft → HARUS RETURN draftId
interface PolygonParallelPanelProps {
  onClose: () => void;
  drawnPolygon: L.LatLng[];
  isDrawing: boolean;
  hasPolygon: boolean;
  onDeletePolygon: () => void;
  onSaveDraft: () => Promise<number | null>; // ✅ HARUS RETURN draftId
  draftId: number | null;
  setDraftId: (id: number | null) => void;
  setActiveTool: (tool: "simulasi" | "drawline" | "drawpolygon" | null) => void;
}

export interface PolygonParallelPanelRef {
  handleManualLineDrawn: (line: Feature<LineString>) => void;
}

const PolygonParallelPanel = forwardRef<PolygonParallelPanelRef, PolygonParallelPanelProps>(({ onClose, drawnPolygon, isDrawing, hasPolygon, onDeletePolygon, onSaveDraft, draftId, setDraftId, setActiveTool }, ref) => {
  const { refreshData, features, user } = useData();
  const { surveyMode } = useTool();

  // --- State ---
  const [manualLine, setManualLine] = useState<Feature<LineString> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [surveyId, setSurveyId] = useState<string | null>(null);

  // --- Mode Input ---
  const [mode, setMode] = useState<"lineCount" | "pointCount" | "fixedSpacing">("lineCount");
  const [lineCount, setLineCount] = useState<number>(10);
  const [pointCount, setPointCount] = useState<number>(20);
  const [spacing, setSpacing] = useState<number>(100); // meter

  // --- DRAGGABLE ---
  const panelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 32, y: 16 });

  useEffect(() => {
    const saved = localStorage.getItem("polygonParallelPanelPosition");
    if (saved) {
      try {
        const pos = JSON.parse(saved);
        if (typeof pos.x === "number" && typeof pos.y === "number") {
          setPosition(pos);
        }
      } catch (e) {
        console.warn("Gagal baca posisi PolygonParallelPanel");
      }
    }
  }, []);

  const savePosition = (x: number, y: number) => {
    setPosition({ x, y });
    localStorage.setItem("polygonParallelPanelPosition", JSON.stringify({ x, y }));
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

  // ✅ Expose method ke parent (MapComponent)
  useImperativeHandle(ref, () => ({
    handleManualLineDrawn: (line: Feature<LineString>) => {
      console.log("✅✅✅ [PolygonParallelPanel] handleManualLineDrawn DIPANGGIL!", line);
      setManualLine(line);
      setActiveTool(null);
    },
  }));

  // ✅ Generate Transek via POSTGIS — TANPA ketergantungan user dari context
  const handleProcessSurvey = async () => {
    if (!draftId) {
      alert("❌ Simpan draft polygon dulu!");
      return;
    }

    if (!manualLine) {
      alert("❌ Gambar garis tengah manual dulu!");
      return;
    }

    setIsProcessing(true);

    try {
      const id = `SURVEY_${Date.now()}`;
      setSurveyId(id);

      const variables: any = {
        surveyId: id,
        polygonDraftId: parseInt(draftId as any),
        mode: "parallel", // ✅ Mode parallel
      };

      // Sesuaikan dengan mode input
      if (mode === "lineCount") {
        variables.lineCount = lineCount;
      } else if (mode === "pointCount") {
        variables.pointCount = pointCount;
      } else if (mode === "fixedSpacing") {
        variables.fixedSpacing = spacing;
      }

      // Kirim centerline_geom
      if (manualLine && manualLine.geometry) {
        variables.centerlineGeom = manualLine.geometry;
      }

      const requestBody = {
        query: `
          mutation GenerateTransekFromPolygonByDraft(
            $surveyId: String!
            $polygonDraftId: Int!
            $lineCount: Int
            $pointCount: Int
            $fixedSpacing: Float
            $centerlineGeom: JSON
            $mode: String
          ) {
            generateTransekFromPolygonByDraft(
              surveyId: $surveyId
              polygonDraftId: $polygonDraftId
              lineCount: $lineCount
              pointCount: $pointCount
              fixedSpacing: $fixedSpacing
              centerlineGeom: $centerlineGeom
              mode: $mode
            ) {
              success
              message
            }
          }
        `,
        variables,
      };

      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error("Server mengembalikan data tidak valid");
      }

      if (data.errors) {
        console.error("GraphQL Errors:", data.errors);
        throw new Error(data.errors[0].message);
      }

      const result = data.data?.generateTransekFromPolygonByDraft;
      if (!result?.success) {
        throw new Error(result?.message || "Gagal generate transek");
      }

      alert(`✅ ${result.message}`);

      // Refresh data agar transek & titik sampling muncul di peta
      await refreshData();
      setIsDataReady(true);
    } catch (err: any) {
      console.error("❌ Gagal generate transek:", err);
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
        setSurveyId(null);
        setManualLine(null);
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

  // --- EXPORT KE CSV ---
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
        const depth = p.meta?.kedalaman ?? "-";
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

  // --- EXPORT KE KML ---
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
    <description>Titik sampling dari survei polygon dengan ID: ${surveyId}</description>
`;

      points.forEach((p: any) => {
        const [lng, lat] = p.geometry?.coordinates || [0, 0];
        const depth = p.meta?.kedalaman ?? 0;
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
  const resetAll = () => {
    setDraftId(null);
    setIsDataReady(false);
    setSurveyId(null);
    setManualLine(null);
    onDeletePolygon();
  };

  // Cek apakah polygon sudah selesai
  const hasCompletedPolygon = drawnPolygon.length >= 3;

  // Hitung area
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

  // ✅ DEBUG STATE
  useEffect(() => {
    console.log("📊 [PolygonParallelPanel] State manualLine:", manualLine);
  }, [manualLine]);

  useEffect(() => {
    console.log("📊 [PolygonParallelPanel] State draftId:", draftId);
  }, [draftId]);

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
      <div className="flex items-center justify-between mb-4 cursor-grab active:cursor-grabbing select-none" onMouseDown={handleMouseDown}>
        <h3 className="text-xl font-bold text-gray-800">📏 Transek Paralel (Polygon + Line)</h3>
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
            ✅ Selesai Menggambar Polygon
          </button>
        </div>
      )}

      {hasCompletedPolygon && !isDrawing && !manualLine && (
        <>
          <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded">
            <p className="text-sm text-blue-800 font-medium">✅ Polygon berhasil digambar!</p>
            <p className="text-xs text-blue-700 mt-1">Langkah selanjutnya: gambar garis tengah manual.</p>
          </div>

          <button
            onClick={() => {
              setActiveTool("drawline");
              console.log("✏️ [PolygonParallelPanel] Mulai gambar garis tengah manual...");
            }}
            className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded text-sm font-semibold"
          >
            🖊️ Gambar Garis Tengah Manual
          </button>
        </>
      )}

      {manualLine && draftId && (
        <>
          <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded">
            <p className="text-sm text-green-800 font-medium">✅ Garis tengah manual berhasil digambar!</p>
            <p className="text-xs text-green-700 mt-1">Atur parameter transek di bawah, lalu klik proses.</p>
          </div>

          {/* ✅ FORM PARAMETER — TAMPILKAN DI SINI */}
          <div className="mb-4 p-3 bg-white border border-gray-200 rounded">
            <p className="text-sm font-bold mb-3">⚙️ Parameter Transek</p>

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
                <label className="block text-xs font-bold mb-1">Jumlah Garis</label>
                <input type="number" value={lineCount} onChange={(e) => setLineCount(parseInt(e.target.value) || 1)} min="1" className="w-full p-1 border rounded text-sm" />
              </div>
            )}

            {mode === "pointCount" && (
              <div className="mb-3">
                <label className="block text-xs font-bold mb-1">Jumlah Titik per Garis</label>
                <input type="number" value={pointCount} onChange={(e) => setPointCount(parseInt(e.target.value) || 2)} min="2" className="w-full p-1 border rounded text-sm" />
              </div>
            )}

            {mode === "fixedSpacing" && (
              <div className="mb-3">
                <label className="block text-xs font-bold mb-1">Jarak Antar Garis (m)</label>
                <input type="number" value={spacing} onChange={(e) => setSpacing(parseFloat(e.target.value) || 1)} min="1" className="w-full p-1 border rounded text-sm" />
              </div>
            )}
          </div>

          <button onClick={handleProcessSurvey} disabled={isProcessing} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded text-sm font-semibold">
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </span>
            ) : (
              "🚀 Proses Transek"
            )}
          </button>

          {isDataReady && (
            <>
              <button onClick={handleDeleteSurveyResult} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded mt-4 text-sm">
                🗑️ Hapus Hasil Survey
              </button>

              <div className="mt-4 pt-4 border-t border-gray-200">
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
            </>
          )}
        </>
      )}

      {(hasCompletedPolygon || manualLine) && (
        <>
          <button
            onClick={() => {
              if (manualLine) {
                setManualLine(null);
                setActiveTool("drawline");
                console.log("🔄 [PolygonParallelPanel] Mengulang gambar garis tengah...");
              } else {
                setActiveTool("drawline");
                console.log("✏️ [PolygonParallelPanel] Mulai gambar garis tengah manual...");
              }
            }}
            className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded text-sm font-semibold"
          >
            {manualLine ? "🔄 Gambar Ulang Garis Tengah" : "🖊️ Gambar Garis Tengah Manual"}
          </button>

          <button onClick={resetAll} className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded text-sm font-semibold">
            🔄 Reset Semua
          </button>

          <button onClick={onClose} className="w-full mt-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded text-sm font-semibold">
            ✖️ Batal & Tutup
          </button>
        </>
      )}

      {isDragging && <div className="absolute inset-0 border-2 border-blue-400 rounded-lg pointer-events-none"></div>}
    </div>
  );
});

PolygonParallelPanel.displayName = "PolygonParallelPanel";
export default PolygonParallelPanel;
