// // src/components/panels/TransekPolygonPanel.tsx
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

// interface TransekPolygonPanelProps {
//   onClose: () => void;
//   riverPolygon: Feature<Polygon>;
// }

// export interface TransekPolygonPanelRef {
//   handleManualLineDrawn: (line: Feature<LineString>) => void;
// }

// const TransekPolygonPanel = forwardRef<TransekPolygonPanelRef, TransekPolygonPanelProps>(({ onClose, riverPolygon }, ref) => {
//   const { refreshData } = useData();
//   const { setActiveTool } = useTool();

//   const [riverLine, setRiverLine] = useState<Feature<LineString> | null>(null);
//   const [transects, setTransects] = useState<Feature[]>([]);
//   const [isProcessing, setIsProcessing] = useState(false);

//   // --- Mode & Input ---
//   const [mode, setMode] = useState<"interval" | "jumlah">("interval");
//   const [interval, setInterval] = useState<number>(0.1);
//   const [jumlah, setJumlah] = useState<number>(10);
//   const [panjangTransek, setPanjangTransek] = useState<number>(2);

//   // --- DRAGGABLE ---
//   const panelRef = useRef<HTMLDivElement>(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [position, setPosition] = useState({ x: 32, y: 16 });

//   useEffect(() => {
//     const saved = localStorage.getItem("transekPolygonPanelPosition");
//     if (saved) {
//       try {
//         const pos = JSON.parse(saved);
//         setPosition(pos);
//       } catch (e) {
//         console.warn("Gagal baca posisi TransekPolygonPanel");
//       }
//     }
//   }, []);

//   const savePosition = (x: number, y: number) => {
//     setPosition({ x, y });
//     localStorage.setItem("transekPolygonPanelPosition", JSON.stringify({ x, y }));
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

//   // ✅ Expose method ke parent (MapComponent)
//   useImperativeHandle(ref, () => ({
//     handleManualLineDrawn: (line: Feature<LineString>) => {
//       console.log("✅ [TransekPolygonPanel] Garis tengah manual diterima:", line);
//       setRiverLine(line);
//       setActiveTool(null); // Matikan tool setelah selesai
//     },
//   }));

//   // ✅ Generate Transek via POSTGIS (panggil API)
//   const generateTransectsViaPostGIS = async () => {
//     if (!riverLine) {
//       alert("❌ Silakan gambar garis tengah terlebih dahulu!");
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       console.log("🚀 [TransekPolygonPanel] Memanggil API generateTransectsFromPolygonAndLine...");
//       const response = await fetch("http://localhost:5000/graphql", {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify({
//           query: `
//             mutation GenerateTransectsFromPolygonAndLine(
//               $polygon: JSON!
//               $line: JSON!
//               $mode: String!
//               $interval: Float
//               $jumlah: Int
//               $panjangTransek: Float!
//             ) {
//               generateTransectsFromPolygonAndLine(
//                 polygon: $polygon
//                 line: $line
//                 mode: $mode
//                 interval: $interval
//                 jumlah: $jumlah
//                 panjangTransek: $panjangTransek
//               ) {
//                 success
//                 message
//                 transects
//               }
//             }
//           `,
//           variables: {
//             polygon: riverPolygon.geometry,
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

//       // ✅ Parse transects dari string JSON
//       const transectsGeoJSON = JSON.parse(result.transects);
//       setTransects(transectsGeoJSON.features);
//       console.log("✅ [TransekPolygonPanel] Transek berhasil digenerate via PostGIS:", transectsGeoJSON.features.length, "garis");
//       alert(`✅ Berhasil generate ${transectsGeoJSON.features.length} transek!`);
//     } catch (err: any) {
//       console.error("❌ [TransekPolygonPanel] Gagal generate transek:", err);
//       alert(`❌ Gagal generate transek: ${err.message}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // ✅ Simpan Transek ke Server
//   const handleSaveTransects = async () => {
//     if (transects.length === 0) {
//       alert("⚠️ Belum ada transek yang digenerate!");
//       return;
//     }

//     const surveyId = `SURVEY_${Date.now()}`;

//     try {
//       console.log("💾 [TransekPolygonPanel] Menyimpan transek ke server...");
//       const response = await fetch("http://localhost:5000/graphql", {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify({
//           query: `
//             mutation SaveTransects($surveyId: String!, $transects: [JSON!]!) {
//               saveTransects(surveyId: $surveyId, transects: $transects) {
//                 success
//                 message
//               }
//             }
//           `,
//           variables: {
//             surveyId,
//             transects: transects.map((t) => t.geometry),
//           },
//         }),
//       });

//       const data = await response.json();
//       if (data.data?.saveTransects.success) {
//         console.log("✅ [TransekPolygonPanel] Transek berhasil disimpan!");
//         alert("✅ Transek berhasil disimpan ke database!");
//         refreshData();
//         onClose();
//       } else {
//         throw new Error(data.data?.saveTransects.message || "Gagal simpan transek");
//       }
//     } catch (err: any) {
//       console.error("❌ [TransekPolygonPanel] Gagal simpan transek:", err);
//       alert(`❌ Gagal simpan transek: ${err.message}`);
//     }
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
//         <h3 className="text-xl font-bold text-gray-800">📏 Transek Manual (Polygon + Line) — Mode: {mode === "interval" ? "Interval" : "Jumlah"}</h3>
//         <button onClick={onClose} className="text-gray-500 hover:text-red-500">
//           ←
//         </button>
//       </div>

//       {!riverLine && (
//         <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
//           <p className="text-sm text-yellow-800 font-medium">👉 Langkah 1: Gambar Garis Tengah</p>
//           <p className="text-xs text-yellow-700 mt-1">
//             • Klik di peta untuk mulai menggambar
//             <br />• Klik kanan untuk menyelesaikan garis
//           </p>
//         </div>
//       )}

//       {riverLine && (
//         <>
//           <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded">
//             <p className="text-sm text-green-800 font-medium">✅ Langkah 1: Garis tengah berhasil digambar!</p>
//           </div>

//           <div className="mb-4">
//             <strong className="text-sm font-semibold">Langkah 2: Atur Parameter Transek</strong>
//             <div className="mt-3 space-y-3">
//               <div>
//                 <label className="block text-xs font-bold mb-1">Mode Generasi:</label>
//                 <div className="flex space-x-4">
//                   <label className="flex items-center space-x-2">
//                     <input type="radio" name="mode" checked={mode === "interval"} onChange={() => setMode("interval")} className="form-radio" />
//                     <span className="text-sm">Interval</span>
//                   </label>
//                   <label className="flex items-center space-x-2">
//                     <input type="radio" name="mode" checked={mode === "jumlah"} onChange={() => setMode("jumlah")} className="form-radio" />
//                     <span className="text-sm">Jumlah</span>
//                   </label>
//                 </div>
//               </div>

//               {mode === "interval" && (
//                 <div>
//                   <label className="block text-xs font-bold mb-1">Interval (km)</label>
//                   <input type="number" value={interval} onChange={(e) => setInterval(parseFloat(e.target.value) || 0.1)} className="w-full p-2 border border-gray-300 rounded text-sm" step="0.1" min="0.01" />
//                 </div>
//               )}

//               {mode === "jumlah" && (
//                 <div>
//                   <label className="block text-xs font-bold mb-1">Jumlah Transek</label>
//                   <input type="number" value={jumlah} onChange={(e) => setJumlah(parseInt(e.target.value) || 10)} className="w-full p-2 border border-gray-300 rounded text-sm" step="1" min="2" />
//                 </div>
//               )}

//               <div>
//                 <label className="block text-xs font-bold mb-1">Panjang Transek (km)</label>
//                 <input type="number" value={panjangTransek} onChange={(e) => setPanjangTransek(parseFloat(e.target.value) || 2)} className="w-full p-2 border border-gray-300 rounded text-sm" step="0.5" min="0.5" />
//               </div>
//             </div>
//           </div>

//           <button onClick={generateTransectsViaPostGIS} disabled={isProcessing} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded text-sm font-semibold mb-3 transition-colors">
//             {isProcessing ? (
//               <span className="flex items-center justify-center">
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Memproses...
//               </span>
//             ) : (
//               "🚀 Generate Transek (PostGIS)"
//             )}
//           </button>

//           {transects.length > 0 && (
//             <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
//               <p className="text-sm text-blue-800 font-medium">✅ Langkah 3: {transects.length} transek berhasil digenerate!</p>
//               <p className="text-xs text-blue-700 mt-1">Klik tombol di bawah untuk menyimpan ke database.</p>
//             </div>
//           )}

//           <button onClick={handleSaveTransects} disabled={transects.length === 0} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded text-sm font-semibold mb-3 transition-colors">
//             💾 Simpan Transek ke Database
//           </button>
//         </>
//       )}

//       <div className="space-y-2">
//         <button
//           onClick={() => {
//             setRiverLine(null);
//             setTransects([]);
//             setActiveTool("drawline");
//             console.log("🔄 [TransekPolygonPanel] Mengulang gambar garis tengah...");
//           }}
//           className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded text-sm font-semibold transition-colors"
//         >
//           🔄 Gambar Ulang Garis Tengah
//         </button>

//         <button
//           onClick={() => {
//             console.log("✖️ [TransekPolygonPanel] Menutup panel...");
//             onClose();
//           }}
//           className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm font-semibold transition-colors"
//         >
//           ✖️ Batal & Tutup
//         </button>
//       </div>

//       {isDragging && <div className="absolute inset-0 border-2 border-blue-400 rounded-lg pointer-events-none"></div>}
//     </div>
//   );
// });

// TransekPolygonPanel.displayName = "TransekPolygonPanel";
// export default TransekPolygonPanel;
