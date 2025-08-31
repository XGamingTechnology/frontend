// // src/components/Surface3DPlotClient.tsx
// "use client";

// import Plot from "react-plotly.js";
// import { useEffect, useState } from "react";

// interface Point3D {
//   x: number;
//   y: number;
//   z: number;
// }

// interface Surface3DPlotClientProps {
//   points: Point3D[];
//   surveyId: string;
// }

// // 🔧 Fungsi: Interpolasi IDW (Inverse Distance Weighting)
// function interpolateGrid(points: Point3D[], x: number[], y: number[]): number[][] {
//   const z: number[][] = Array(y.length)
//     .fill(null)
//     .map(() => Array(x.length).fill(NaN));

//   // Radius pencarian (dalam meter)
//   const xRange = Math.max(...x) - Math.min(...x);
//   const yRange = Math.max(...y) - Math.min(...y);
//   const searchRadius = Math.max(xRange / 5, yRange / 5, 10); // minimal 10m

//   for (let i = 0; i < y.length; i++) {
//     for (let j = 0; j < x.length; j++) {
//       const targetX = x[j];
//       const targetY = y[i];
//       let sumWeight = 0;
//       let sumWeightedZ = 0;
//       let hasNeighbors = false;

//       for (const p of points) {
//         const dx = p.x - targetX;
//         const dy = p.y - targetY;
//         const dist = Math.sqrt(dx * dx + dy * dy);

//         // Hanya gunakan titik dalam radius
//         if (dist > 0 && dist <= searchRadius) {
//           const weight = 1 / (dist * dist); // IDW: bobot berbanding terbalik dengan kuadrat jarak
//           sumWeight += weight;
//           sumWeightedZ += weight * p.z;
//           hasNeighbors = true;
//         }
//       }

//       if (hasNeighbors && sumWeight > 0) {
//         z[i][j] = sumWeightedZ / sumWeight;
//       } else {
//         // Jika tidak ada tetangga, ambil nilai terdekat
//         const nearest = points.reduce((a, b) => {
//           const da = Math.sqrt((a.x - targetX) ** 2 + (a.y - targetY) ** 2);
//           const db = Math.sqrt((b.x - targetX) ** 2 + (b.y - targetY) ** 2);
//           return da < db ? a : b;
//         });
//         z[i][j] = nearest.z;
//       }
//     }
//   }

//   return z;
// }

// export default function Surface3DPlotClient({ points, surveyId }: Surface3DPlotClientProps) {
//   const [data, setData] = useState<any[]>([]);
//   const [layout, setLayout] = useState<any>({});
//   const [config] = useState<any>({
//     responsive: true,
//     displayModeBar: true,
//     toImageButtonOptions: {
//       format: "png",
//       filename: `profil-3d-${surveyId}`,
//       height: 720,
//       width: 1280,
//     },
//   });

//   useEffect(() => {
//     if (!points || points.length === 0) {
//       console.warn("⚠️ Tidak ada titik untuk plot");
//       return;
//     }

//     console.log("🔧 [Surface3DPlotClient] Render", { pointCount: points.length, surveyId });
//     console.log("🔍 Contoh titik pertama:", points[0]);

//     // Ekstrak x, y unik
//     const xSet = new Set<number>();
//     const ySet = new Set<number>();

//     points.forEach((p) => {
//       xSet.add(p.x);
//       ySet.add(p.y);
//     });

//     const x = Array.from(xSet).sort((a, b) => a - b);
//     const y = Array.from(ySet).sort((a, b) => a - b);

//     console.log("📊 x (jarak):", x);
//     console.log("📊 y (lebar):", y);
//     console.log(
//       "🔍 z (kedalaman):",
//       points.map((p) => p.z)
//     );

//     // 🔴 Jika hanya 1 titik di y → render sebagai line 3D
//     if (y.length === 1) {
//       console.warn("⚠️ Hanya 1 lebar (y), render sebagai scatter 3D");

//       const scatterData = {
//         x: points.map((p) => p.x),
//         y: points.map((p) => p.y),
//         z: points.map((p) => -p.z), // Plotly: positif ke atas
//         type: "scatter3d",
//         mode: "lines+markers",
//         line: { color: "blue", width: 4 },
//         marker: { size: 4, color: "red" },
//         name: "Profil Sungai",
//       };

//       setData([scatterData]);

//       setLayout({
//         title: `Profil 3D - ${surveyId} (Hanya 1 Transek)`,
//         scene: {
//           xaxis: { title: "Jarak (m)" },
//           yaxis: { title: "Lebar (m)" },
//           zaxis: { title: "Kedalaman (m)", autorange: "reversed" },
//           camera: { eye: { x: 1.5, y: 1.5, z: 0.5 } },
//         },
//         margin: { l: 0, r: 0, b: 30, t: 50 },
//       });

//       return;
//     }

//     // ✅ Interpolasi grid z[y][x]
//     const zInterpolated = interpolateGrid(points, x, y);

//     // Konversi ke positif untuk Plotly (karena kita ingin kedalaman ke bawah)
//     const zPlotly = zInterpolated.map((row) => row.map((val) => -val));

//     setData([
//       {
//         z: zPlotly,
//         x,
//         y,
//         type: "surface",
//         colorscale: "Blues", // Cocok untuk air
//         // colorscale: "Viridis", // Alternatif
//         showscale: true,
//         contours: {
//           z: {
//             show: true,
//             usecolormap: true,
//             project: { z: true },
//           },
//         },
//         colorbar: {
//           title: "Kedalaman (m)",
//           titleside: "right",
//         },
//         // 🔥 Smoothing tambahan dari Plotly
//         surfacecolor: zPlotly, // Opsional: warna berdasarkan z
//         lighting: {
//           ambient: 0.8,
//           diffuse: 0.8,
//           specular: 0.2,
//           roughness: 0.4,
//         },
//         lightposition: {
//           x: 100,
//           y: 100,
//           z: 100,
//         },
//         // Smoothing (0.0 - 1.0)
//         cmin: Math.min(...zPlotly.flat()),
//         cmax: Math.max(...zPlotly.flat()),
//       },
//     ]);

//     setLayout({
//       title: {
//         text: `Permukaan 3D - ${surveyId}`,
//         font: { size: 16 },
//       },
//       scene: {
//         xaxis: {
//           title: "Jarak (m)",
//           autorange: true,
//           tickfont: { size: 10 },
//         },
//         yaxis: {
//           title: "Lebar (m)",
//           autorange: true,
//           tickfont: { size: 10 },
//         },
//         zaxis: {
//           title: "Kedalaman (m)",
//           autorange: "reversed",
//           tickfont: { size: 10 },
//         },
//         camera: {
//           eye: { x: 1.5, y: 1.5, z: 0.5 },
//         },
//       },
//       margin: { l: 0, r: 0, b: 30, t: 50 },
//       // 🔥 Smoothing global
//       hovermode: "closest",
//     });
//   }, [points, surveyId]);

//   if (points.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-full bg-gray-100 rounded">
//         <p className="text-gray-500 italic">Tidak ada data untuk ditampilkan</p>
//       </div>
//     );
//   }

//   return (
//     <div style={{ width: "100%", height: "100%" }}>
//       <Plot data={data} layout={layout} config={config} style={{ width: "100%", height: "100%" }} useResizeHandler key={surveyId} />
//     </div>
//   );
// }
