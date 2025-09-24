// // src/components/panels/PolygonTransekPanel.tsx
// "use client";

// import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
// import * as L from "leaflet";
// import { Feature, LineString, Polygon } from "geojson";
// import { useData } from "@/context/DataContext";
// import { useTool } from "@/context/ToolContext";

// // ✅ Helper: Ambil token dari localStorage
// const getAuthToken = () => {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem("authToken");
// };

// const getAuthHeaders = () => {
//   const token = getAuthToken();
//   return {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// };

// interface PolygonTransekPanelProps {
//   onClose: () => void;
//   drawnPolygon: L.LatLng[];
//   isDrawing: boolean;
//   hasPolygon: boolean;
//   onDeletePolygon: () => void;
//   onSaveDraft: () => void;
//   draftId: number | null;
//   setDraftId: (id: number | null) => void;
//   setActiveTool: (tool: "simulasi" | "drawline" | "drawpolygon" | null) => void;
// }

// export interface PolygonTransekPanelRef {
//   handleManualLineDrawn: (line: Feature<LineString>) => void;
// }

// const PolygonTransekPanel = forwardRef<PolygonTransekPanelRef, PolygonTransekPanelProps>(({ onClose, drawnPolygon, isDrawing, hasPolygon, onDeletePolygon, onSaveDraft, draftId, setDraftId, setActiveTool }, ref) => {
//   const { refreshData } = useData();
//   const { surveyMode } = useTool();

//   // --- State umum ---
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isDataReady, setIsDataReady] = useState(false);
//   const [surveyId, setSurveyId] = useState<string | null>(null);

//   // --- Mode transek ---
//   const [transekMode, setTransekMode] = useState<"auto" | "manual">("auto"); // ✅ Pilihan mode
//   const [riverLine, setRiverLine] = useState<Feature<LineString> | null>(null);
//   const [transects, setTransects] = useState<Feature[]>([]);

//   // --- Parameter untuk manual mode ---
//   const [mode, setMode] = useState<"interval" | "jumlah">("interval");
//   const [interval, setInterval] = useState<number>(0.1);
//   const [jumlah, setJumlah] = useState<number>(10);
//   const [panjangTransek, setPanjangTransek] = useState<number>(2);

//   // --- Parameter untuk auto mode ---
//   const [lineCount, setLineCount] = useState<number>(5);

//   // --- DRAGGABLE ---
//   const panelRef = useRef<HTMLDivElement>(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [position, setPosition] = useState({ x: 32, y: 16 });

//   useEffect(() => {
//     const saved = localStorage.getItem("polygonTransekPanelPosition");
//     if (saved) {
//       try {
//         const pos = JSON.parse(saved);
//         setPosition(pos);
//       } catch (e) {
//         console.warn("Gagal baca posisi PolygonTransekPanel");
//       }
//     }
//   }, []);

//   const savePosition = (x: number, y: number) => {
//     setPosition({ x, y });
//     localStorage.setItem("polygonTransekPanelPosition", JSON.stringify({ x, y }));
//   };

//   const handleMouseDown = (e: React.MouseEvent) => {
//     if (e.button !== 0) return;
//     if (!panelRef.current) return;
//     const rect = panelRef.current.getBoundingClientRect();
//     const offsetX = e.clientX - rect.left;
//     const offsetY = e.clientY - rect.top;

//     setIsDragging(true);
//     e.preventDefault();

//     const handleMouseMove = (e: MouseEvent) => {
//       const newX = e.clientX - offsetX;
//       const newY = e.clientY - offsetY;
//       savePosition(newX, newY);
//     };

//     const handleMouseUp = () => {
//       setIsDragging(false);
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     };

//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);
//   };

//   // ✅ Expose method untuk manual line
//   useImperativeHandle(ref, () => ({
//     handleManualLineDrawn: (line: Feature<LineString>) => {
//       console.log("✅ [PolygonTransekPanel] Garis tengah manual diterima:", line);
//       setRiverLine(line);
//       setActiveTool(null);
//     },
//   }));

//   // ✅ Generate Transek Auto (centerline otomatis)
//   const handleGenerateAutoTransek = async () => {
//     if (!draftId) {
//       alert("Simpan draft polygon terlebih dahulu.");
//       return;
//     }

//     const id = `SURVEY_${Date.now()}`;
//     setSurveyId(id);
//     setIsProcessing(true);
//     setIsDataReady(false);

//     try {
//       const requestBody = {
//         query: `
//             mutation GenerateTransekFromPolygonByDraft(
//               $surveyId: String!
//               $polygonDraftId: Int!
//               $lineCount: Int
//               $mode: String
//             ) {
//               generateTransekFromPolygonByDraft(
//                 surveyId: $surveyId
//                 polygonDraftId: $polygonDraftId
//                 lineCount: $lineCount
//                 mode: $mode
//               ) {
//                 success
//                 message
//               }
//             }
//           `,
//         variables: {
//           surveyId: id,
//           polygonDraftId: draftId,
//           lineCount: lineCount,
//           mode: "parallel",
//         },
//       };

//       const res = await fetch("http://localhost:5000/graphql", {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(requestBody),
//       });

//       const data = await res.json();

//       if (data.errors) {
//         throw new Error(data.errors[0].message);
//       }

//       const result = data.data?.generateTransekFromPolygonByDraft;
//       if (!result) throw new Error("Tidak ada hasil dari server");

//       if (result.success) {
//         alert("✅ Proses transek lurus selesai.");
//         await refreshData();
//         setIsDataReady(true);
//       } else {
//         alert(`❌ Gagal: ${result.message || "Proses gagal"}`);
//       }
//     } catch (err: any) {
//       alert(`❌ Gagal: ${err.message}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // ✅ Generate Transek Manual (via PostGIS)
//   const generateTransectsViaPostGIS = async () => {
//     if (!riverLine) {
//       alert("Gambar garis tengah dulu!");
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       const response = await fetch("http://localhost:5000/graphql", {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify({
//           query: `
//               mutation GenerateTransectsFromPolygonAndLine(
//                 $polygon: JSON!
//                 $line: JSON!
//                 $mode: String!
//                 $interval: Float
//                 $jumlah: Int
//                 $panjangTransek: Float!
//               ) {
//                 generateTransectsFromPolygonAndLine(
//                   polygon: $polygon
//                   line: $line
//                   mode: $mode
//                   interval: $interval
//                   jumlah: $jumlah
//                   panjangTransek: $panjangTransek
//                 ) {
//                   success
//                   message
//                   transects
//                 }
//               }
//             `,
//           variables: {
//             polygon: {
//               type: "Polygon",
//               coordinates: [drawnPolygon.map((p) => [p.lng, p.lat])],
//             },
//             line: riverLine.geometry,
//             mode,
//             interval: mode === "interval" ? interval : undefined,
//             jumlah: mode === "jumlah" ? jumlah : undefined,
//             panjangTransek,
//           },
//         }),
//       });

//       const data = await response.json();

//       if (data.errors) {
//         throw new Error(data.errors[0].message);
//       }

//       const result = data.data?.generateTransectsFromPolygonAndLine;
//       if (!result?.success) {
//         throw new Error(result?.message || "Gagal generate transek");
//       }

//       const transectsGeoJSON = JSON.parse(result.transects);
//       setTransects(transectsGeoJSON.features);
//       console.log("✅ Transek berhasil digenerate via PostGIS:", transectsGeoJSON.features.length);
//       alert(`✅ Berhasil generate ${transectsGeoJSON.features.length} transek!`);
//     } catch (err: any) {
//       console.error("❌ Gagal generate transek:", err);
//       alert(`❌ Gagal generate transek: ${err.message}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // ✅ Simpan Transek Manual ke Server
//   const handleSaveTransects = async () => {
//     if (transects.length === 0) {
//       alert("Belum ada transek yang digenerate!");
//       return;
//     }

//     const id = `SURVEY_${Date.now()}`;
//     setSurveyId(id);

//     try {
//       const response = await fetch("http://localhost:5000/graphql", {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify({
//           query: `
//               mutation SaveTransects($surveyId: String!, $transects: [JSON!]!) {
//                 saveTransects(surveyId: $surveyId, transects: $transects) {
//                   success
//                   message
//                 }
//               }
//             `,
//           variables: {
//             surveyId: id,
//             transects: transects.map((t) => t.geometry),
//           },
//         }),
//       });

//       const data = await response.json();
//       if (data.data?.saveTransects.success) {
//         alert("✅ Transek berhasil disimpan!");
//         await refreshData();
//         setIsDataReady(true);
//         setSurveyId(id);
//       } else {
//         throw new Error(data.data?.saveTransects.message || "Gagal simpan transek");
//       }
//     } catch (err: any) {
//       alert(`❌ Gagal: ${err.message}`);
//     }
//   };

//   // --- HAPUS HASIL SURVEY ---
//   const handleDeleteSurveyResult = async () => {
//     if (!surveyId) return alert("Belum ada hasil survey.");
//     if (!confirm("Yakin ingin hapus semua hasil dari survey ini?")) return;

//     try {
//       const res = await fetch("http://localhost:5000/graphql", {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify({
//           query: `
//               mutation DeleteSurveyResults($surveyId: String!) {
//                 deleteSurveyResults(surveyId: $surveyId) {
//                   success
//                   message
//                 }
//               }
//             `,
//           variables: { surveyId },
//         }),
//       });

//       const data = await res.json();
//       if (data.data?.deleteSurveyResults.success) {
//         alert(data.data.deleteSurveyResults.message);
//         setIsDataReady(false);
//         setSurveyId(null);
//         setRiverLine(null);
//         setTransects([]);
//         await refreshData();
//       } else {
//         throw new Error("Gagal hapus hasil survey");
//       }
//     } catch (err: any) {
//       alert(`❌ Gagal: ${err.message}`);
//     }
//   };

//   // --- FORMAT KOORDINAT ---
//   const [coordFormat, setCoordFormat] = useState<"latlng" | "utm">("latlng");

//   // Konversi ke UTM
//   const toUTM = (lng: number, lat: number) => {
//     try {
//       const result = UTM.fromLatLon(lat, lng);
//       return {
//         easting: result.easting,
//         northing: result.northing,
//         zoneNum: result.zoneNum,
//         zoneLetter: result.zoneLetter,
//       };
//     } catch (e) {
//       console.error("Gagal konversi ke UTM:", e);
//       return null;
//     }
//   };

//   // --- EXPORT KE CSV ---
//   const handleExportCSV = async () => {
//     if (!surveyId || !isDataReady) return alert("Data belum siap untuk diekspor.");

//     try {
//       const res = await fetch("http://localhost:5000/graphql", {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify({
//           query: `
//               query GetSamplingPoints($surveyId: String!) {
//                 samplingPointsBySurveyId(surveyId: $surveyId) {
//                   id
//                   name
//                   description
//                   geometry
//                   meta
//                 }
//               }
//             `,
//           variables: { surveyId },
//         }),
//       });

//       const data = await res.json();
//       const points = data.data?.samplingPointsBySurveyId;

//       if (!Array.isArray(points) || points.length === 0) {
//         return alert("⚠️ Tidak ada titik untuk diekspor.");
//       }

//       const isUTM = coordFormat === "utm";
//       const headers = isUTM ? ["ID", "Survey ID", "Easting", "Northing", "Zone", "Kedalaman (m)", "Jarak dari Awal (m)"] : ["ID", "Survey ID", "Latitude", "Longitude", "Kedalaman (m)", "Jarak dari Awal (m)"];

//       const rows = points.map((p: any) => {
//         const [lng, lat] = p.geometry?.coordinates || ["-", "-"];
//         const depth = p.meta?.kedalaman ?? "-";
//         const distance = p.meta?.distance_m ?? "-";

//         if (isUTM) {
//           const utm = toUTM(lng, lat);
//           if (!utm) return [p.id, p.meta?.survey_id || "-", "-", "-", "-", depth, distance].join(",");
//           return [p.id, p.meta?.survey_id || "-", utm.easting.toFixed(2), utm.northing.toFixed(2), `${utm.zoneNum}${utm.zoneLetter}`, depth, distance].join(",");
//         } else {
//           return [p.id, p.meta?.survey_id || "-", lat?.toFixed(6), lng?.toFixed(6), depth, distance].join(",");
//         }
//       });

//       const csvContent = [headers.join(","), ...rows].join("\n");
//       const filename = isUTM ? `${surveyId}_utm.csv` : `${surveyId}_latlng.csv`;
//       downloadFile(csvContent, filename, "text/csv");
//     } catch (err) {
//       alert("Gagal ambil data untuk export CSV.");
//     }
//   };

//   // --- EXPORT KE KML ---
//   const handleExportKML = async () => {
//     if (!surveyId || !isDataReady) return alert("Data belum siap untuk diekspor.");

//     try {
//       const res = await fetch("http://localhost:5000/graphql", {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify({
//           query: `
//               query GetSamplingPoints($surveyId: String!) {
//                 samplingPointsBySurveyId(surveyId: $surveyId) {
//                   id
//                   name
//                   description
//                   geometry
//                   meta
//                 }
//               }
//             `,
//           variables: { surveyId },
//         }),
//       });

//       const data = await res.json();
//       const points = data.data?.samplingPointsBySurveyId;

//       if (!Array.isArray(points) || points.length === 0) {
//         return alert("⚠️ Tidak ada titik untuk diekspor.");
//       }

//       let kml = `<?xml version="1.0" encoding="UTF-8"?>
// <kml xmlns="http://www.opengis.net/kml/2.2">
//   <Document>
//     <name>Sampling Points - ${surveyId} (${coordFormat.toUpperCase()})</name>
//     <description>Titik sampling dari survei polygon dengan ID: ${surveyId}</description>
// `;

//       points.forEach((p: any) => {
//         const [lng, lat] = p.geometry?.coordinates || [0, 0];
//         const depth = p.meta?.kedalaman ?? 0;
//         const name = p.name || `Point ${p.id}`;
//         const description = p.description || `Kedalaman: ${depth} m`;

//         if (coordFormat === "utm") {
//           const utm = toUTM(lng, lat);
//           if (utm) {
//             kml += `
//     <Placemark>
//       <name>${name}</name>
//       <description>${description} | Easting: ${utm.easting.toFixed(2)}, Northing: ${utm.northing.toFixed(2)}, Zone: ${utm.zoneNum}${utm.zoneLetter}</description>
//       <ExtendedData>
//         <Data name="Easting"><value>${utm.easting.toFixed(2)}</value></Data>
//         <Data name="Northing"><value>${utm.northing.toFixed(2)}</value></Data>
//         <Data name="Zone"><value>${utm.zoneNum}${utm.zoneLetter}</value></Data>
//         <Data name="Depth"><value>${depth}</value></Data>
//       </ExtendedData>
//     </Placemark>
// `;
//           }
//         } else {
//           kml += `
//     <Placemark>
//       <name>${name}</name>
//       <description>${description}</description>
//       <Point>
//         <coordinates>${lng},${lat},0</coordinates>
//       </Point>
//       <ExtendedData>
//         <Data name="Latitude"><value>${lat.toFixed(6)}</value></Data>
//         <Data name="Longitude"><value>${lng.toFixed(6)}</value></Data>
//         <Data name="Depth"><value>${depth}</value></Data>
//       </ExtendedData>
//     </Placemark>
// `;
//         }
//       });

//       kml += `
//   </Document>
// </kml>`;

//       const filename = coordFormat === "utm" ? `${surveyId}_utm.kml` : `${surveyId}_latlng.kml`;
//       downloadFile(kml, filename, "application/vnd.google-earth.kml+xml");
//     } catch (err) {
//       alert("Gagal ambil data untuk export ke KML.");
//     }
//   };

//   const downloadFile = (content: string, filename: string, mime: string) => {
//     const blob = new Blob([content], { type: mime });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   // --- RESET ALUR ---
//   const resetDraft = () => {
//     setDraftId(null);
//     setIsDataReady(false);
//     setSurveyId(null);
//     setRiverLine(null);
//     setTransects([]);
//   };

//   // Cek apakah polygon sudah selesai
//   const hasCompletedPolygon = drawnPolygon.length >= 3;

//   // Hitung area
//   const calculateArea = (points: L.LatLng[]) => {
//     let area = 0;
//     const len = points.length;
//     for (let i = 0; i < len; i++) {
//       const j = (i + 1) % len;
//       area += points[i].lng * points[j].lat;
//       area -= points[j].lng * points[i].lat;
//     }
//     return Math.abs(area / 2);
//   };

//   return (
//     <div
//       ref={panelRef}
//       className="absolute z-[1000] bg-white rounded-xl shadow-xl p-5 w-80 border border-gray-200"
//       style={{
//         left: `${position.x}px`,
//         top: `${position.y}px`,
//         transform: "translate(0, 0)",
//         willChange: isDragging ? "transform" : "auto",
//         cursor: isDragging ? "grabbing" : "default",
//       }}
//     >
//       <div className="flex items-center justify-between mb-4 cursor-grab active:cursor-grabbing select-none" onMouseDown={handleMouseDown}>
//         <h3 className="text-xl font-bold text-gray-800">📏 Transek Polygon</h3>
//         <button onClick={onClose} className="text-gray-500 hover:text-red-500">
//           ←
//         </button>
//       </div>

//       {!hasCompletedPolygon && !isDrawing && (
//         <button onClick={() => setActiveTool("drawpolygon")} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 rounded text-sm mb-3">
//           ✏️ Mulai Gambar Polygon
//         </button>
//       )}

//       {isDrawing && drawnPolygon.length > 0 && (
//         <div className="mb-3">
//           <div className="text-xs text-blue-600 mb-2">📏 Area: {calculateArea(drawnPolygon).toFixed(2)} m²</div>
//           <div className="text-xs text-gray-500 mb-2">👆 Klik untuk tambah titik</div>
//           <div className="text-xs text-gray-500 mb-2">🖱️ Klik kanan untuk selesai</div>
//           <button onClick={() => setActiveTool(null)} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded text-sm">
//             ✅ Selesai Menggambar
//           </button>
//         </div>
//       )}

//       {hasCompletedPolygon && !isDrawing && (
//         <div className="mt-5 pt-4 border-t border-gray-100">
//           <p className="text-sm text-gray-600 mb-3 italic">Langkah 1: Simpan Draft</p>
//           <button
//             onClick={onSaveDraft}
//             disabled={!!draftId}
//             className={`w-full py-2 px-3 rounded text-sm mb-4 font-semibold transition-colors ${draftId ? "bg-green-100 text-green-800 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
//           >
//             {draftId ? "✅ Sudah Disimpan" : "💾 Simpan Draft"}
//           </button>

//           {draftId && (
//             <>
//               <p className="text-sm text-gray-600 mb-3 italic">Langkah 2: Pilih Mode Transek</p>
//               <div className="mb-4">
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => setTransekMode("auto")}
//                     className={`flex-1 py-2 px-3 rounded text-sm font-semibold transition-colors ${transekMode === "auto" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
//                   >
//                     🤖 Auto Centerline
//                   </button>
//                   <button
//                     onClick={() => setTransekMode("manual")}
//                     className={`flex-1 py-2 px-3 rounded text-sm font-semibold transition-colors ${transekMode === "manual" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
//                   >
//                     ✍️ Manual Line
//                   </button>
//                 </div>
//               </div>

//               {transekMode === "auto" && (
//                 <>
//                   <div className="mb-3">
//                     <label className="block text-xs font-bold mb-1">Jumlah Garis Transek</label>
//                     <input type="number" value={lineCount} onChange={(e) => setLineCount(parseInt(e.target.value) || 5)} className="w-full p-2 border border-gray-300 rounded text-sm" min="2" step="1" />
//                   </div>

//                   <button onClick={handleGenerateAutoTransek} disabled={isProcessing} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2 rounded mt-3 font-semibold">
//                     {isProcessing ? "Memproses..." : "🚀 Generate Transek Otomatis"}
//                   </button>
//                 </>
//               )}

//               {transekMode === "manual" && (
//                 <>
//                   {!riverLine && (
//                     <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
//                       <p className="text-sm text-yellow-800 font-medium">👉 Langkah 2a: Gambar Garis Tengah Manual</p>
//                       <p className="text-xs text-yellow-700 mt-1">
//                         • Klik di peta untuk mulai menggambar
//                         <br />• Klik kanan untuk menyelesaikan garis
//                       </p>
//                     </div>
//                   )}

//                   {riverLine && (
//                     <>
//                       <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded">
//                         <p className="text-sm text-green-800 font-medium">✅ Garis tengah berhasil digambar!</p>
//                       </div>

//                       <div className="mb-4">
//                         <strong className="text-sm font-semibold">Langkah 2b: Atur Parameter Transek</strong>
//                         <div className="mt-3 space-y-3">
//                           <div>
//                             <label className="block text-xs font-bold mb-1">Mode Generasi:</label>
//                             <div className="flex space-x-4">
//                               <label className="flex items-center space-x-2">
//                                 <input type="radio" name="mode" checked={mode === "interval"} onChange={() => setMode("interval")} className="form-radio" />
//                                 <span className="text-sm">Interval</span>
//                               </label>
//                               <label className="flex items-center space-x-2">
//                                 <input type="radio" name="mode" checked={mode === "jumlah"} onChange={() => setMode("jumlah")} className="form-radio" />
//                                 <span className="text-sm">Jumlah</span>
//                               </label>
//                             </div>
//                           </div>

//                           {mode === "interval" && (
//                             <div>
//                               <label className="block text-xs font-bold mb-1">Interval (km)</label>
//                               <input type="number" value={interval} onChange={(e) => setInterval(parseFloat(e.target.value) || 0.1)} className="w-full p-2 border border-gray-300 rounded text-sm" step="0.1" min="0.01" />
//                             </div>
//                           )}

//                           {mode === "jumlah" && (
//                             <div>
//                               <label className="block text-xs font-bold mb-1">Jumlah Transek</label>
//                               <input type="number" value={jumlah} onChange={(e) => setJumlah(parseInt(e.target.value) || 10)} className="w-full p-2 border border-gray-300 rounded text-sm" step="1" min="2" />
//                             </div>
//                           )}

//                           <div>
//                             <label className="block text-xs font-bold mb-1">Panjang Transek (km)</label>
//                             <input type="number" value={panjangTransek} onChange={(e) => setPanjangTransek(parseFloat(e.target.value) || 2)} className="w-full p-2 border border-gray-300 rounded text-sm" step="0.5" min="0.5" />
//                           </div>
//                         </div>
//                       </div>

//                       <button onClick={generateTransectsViaPostGIS} disabled={isProcessing} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded mt-3 font-semibold">
//                         {isProcessing ? "Memproses..." : "🚀 Generate Transek Manual"}
//                       </button>

//                       {transects.length > 0 && (
//                         <>
//                           <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
//                             <p className="text-sm text-blue-800">✅ {transects.length} transek berhasil digenerate!</p>
//                           </div>

//                           <button onClick={handleSaveTransects} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm font-semibold mb-3">
//                             💾 Simpan Transek
//                           </button>
//                         </>
//                       )}
//                     </>
//                   )}
//                 </>
//               )}

//               {isDataReady && (
//                 <>
//                   <button onClick={handleDeleteSurveyResult} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded mt-2 text-sm">
//                     🗑️ Hapus Hasil Survey
//                   </button>

//                   <div className="mt-3 pt-3 border-t border-gray-100">
//                     <p className="text-xs text-gray-500 mb-2">📍 Format Koordinat</p>
//                     <div className="grid grid-cols-2 gap-2 mb-3">
//                       <button onClick={() => setCoordFormat("latlng")} className={`text-xs py-1.5 px-2 rounded ${coordFormat === "latlng" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}>
//                         Lat/Lng
//                       </button>
//                       <button onClick={() => setCoordFormat("utm")} className={`text-xs py-1.5 px-2 rounded ${coordFormat === "utm" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`}>
//                         UTM
//                       </button>
//                     </div>

//                     <p className="text-xs text-gray-500 mb-2">📤 Export Data Sampling</p>
//                     <div className="grid grid-cols-2 gap-2">
//                       <button onClick={handleExportCSV} disabled={!isDataReady} className={`text-xs py-1.5 px-2 rounded ${isDataReady ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
//                         📄 CSV
//                       </button>
//                       <button onClick={handleExportKML} disabled={!isDataReady} className={`text-xs py-1.5 px-2 rounded ${isDataReady ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
//                         🌍 KML
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               )}

//               <button onClick={resetDraft} className="w-full mt-3 text-sm py-1.5 px-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded">
//                 🔄 Gambar Ulang
//               </button>
//             </>
//           )}

//           <button
//             onClick={() => {
//               onDeletePolygon();
//               resetDraft();
//             }}
//             className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded text-sm mt-4"
//           >
//             🗑️ Hapus Semua
//           </button>
//         </div>
//       )}

//       {isDragging && <div className="absolute inset-0 border-2 border-blue-400 rounded-lg pointer-events-none"></div>}
//     </div>
//   );
// });

// PolygonTransekPanel.displayName = "PolygonTransekPanel";
// export default PolygonTransekPanel;
