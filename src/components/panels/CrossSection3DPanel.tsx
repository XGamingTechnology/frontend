// // src/components/CrossSection3DPanel.tsx
// import { useEffect, useRef } from "react";
// import Plotly from "plotly.js-dist";

// interface Point3D {
//   x: number;
//   y: number;
//   z: number;
// }

// interface CrossSection3DPanelProps {
//   points: Point3D[];
//   onClose: () => void;
// }

// export default function CrossSection3DPanel({ points, onClose }: CrossSection3DPanelProps) {
//   const plotRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!points.length || !plotRef.current) return;

//     console.log("📊 Data Sampling:", points);

//     const xVals = points.map((p) => p.x);
//     const yVals = points.map((p) => p.y);
//     const zVals = points.map((p) => p.z); // ✅ Nilai positif

//     const xMin = Math.min(...xVals),
//       xMax = Math.max(...xVals);
//     const yMin = Math.min(...yVals),
//       yMax = Math.max(...yVals);

//     const gridSize = 50;
//     const xi = Array.from({ length: gridSize }, (_, j) => xMin + ((xMax - xMin) * j) / (gridSize - 1));
//     const yi = Array.from({ length: gridSize }, (_, i) => yMin + ((yMax - yMin) * i) / (gridSize - 1));

//     const zi = yi.map((y) =>
//       xi.map((x) => {
//         let num = 0,
//           den = 0;
//         for (const p of points) {
//           const dist = Math.sqrt((x - p.x) ** 2 + (y - p.y) ** 2);
//           const w = dist === 0 ? 1e6 : 1 / dist ** 2;
//           num += w * p.z; // ✅ Gunakan nilai positif
//           den += w;
//         }
//         return den ? num / den : 0;
//       })
//     );

//     const data = [
//       {
//         type: "surface",
//         x: xi,
//         y: yi,
//         z: zi,
//         colorscale: "Blues",
//         showscale: true,
//       },
//     ];

//     const layout = {
//       title: "Penampang 3D Dasar Sungai",
//       scene: {
//         xaxis: { title: "Longitude" },
//         yaxis: { title: "Latitude" },
//         zaxis: { title: "Kedalaman (m)", autorange: "reversed" }, // ✅ Ini penting!
//       },
//       margin: { l: 0, r: 0, b: 0, t: 50 },
//       autosize: true,
//     };

//     Plotly.newPlot(plotRef.current, data, layout);

//     return () => {
//       if (plotRef.current) Plotly.purge(plotRef.current);
//     };
//   }, [points]);

//   return (
//     <div className="fixed inset-0 z-[2000] bg-black bg-opacity-70 flex items-center justify-center p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-full overflow-hidden flex flex-col">
//         <div className="flex items-center justify-between p-4 border-b">
//           <h3 className="text-lg font-bold text-gray-800">📊 Penampang 3D Sungai</h3>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
//             ×
//           </button>
//         </div>
//         <div ref={plotRef} style={{ width: "100%", height: "600px" }} />
//         <div className="p-4 bg-gray-50 text-xs text-gray-500">Visualisasi 3D menggunakan interpolasi IDW dari data titik sampling.</div>
//       </div>
//     </div>
//   );
// }
