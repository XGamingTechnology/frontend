// src/components/Surface3DPlotClient.tsx
"use client";

import Plot from "react-plotly.js";
import { useEffect, useState } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Surface3DPlotClientProps {
  points: Point3D[];
  surveyId: string;
}

export default function Surface3DPlotClient({ points, surveyId }: Surface3DPlotClientProps) {
  const [data, setData] = useState<any[]>([]);
  const [layout, setLayout] = useState<any>({});

  useEffect(() => {
    if (!points || points.length === 0) return;

    console.log("🔧 [Surface3DPlotClient] Render", { pointCount: points.length, surveyId });

    // Ekstrak x, y unik
    const xSet = new Set<number>();
    const ySet = new Set<number>();

    points.forEach((p) => {
      xSet.add(p.x);
      ySet.add(p.y);
    });

    const x = Array.from(xSet).sort((a, b) => a - b);
    const y = Array.from(ySet).sort((a, b) => a - b);

    console.log("📊 x:", x);
    console.log("📊 y:", y);

    // 🔴 Jika hanya 1 titik di y → render sebagai line/scatter 3D
    if (y.length === 1) {
      console.warn("⚠️ Hanya 1 lebar (y), render sebagai scatter 3D");

      const scatterData = {
        x: points.map((p) => p.x),
        y: points.map((p) => p.y),
        z: points.map((p) => -p.z), // Plotly: positif ke atas
        type: "scatter3d",
        mode: "lines+markers",
        line: { color: "blue", width: 4 },
        marker: { size: 3, color: "red" },
        name: "Profil Tengah Sungai",
      };

      setData([scatterData]);

      setLayout({
        title: `Profil 3D - ${surveyId} (Hanya 1 Transek)`,
        scene: {
          xaxis: { title: "Jarak (m)" },
          yaxis: { title: "Lebar (m)" },
          zaxis: { title: "Kedalaman (m)", autorange: "reversed" },
          camera: { eye: { x: 1.5, y: 1.5, z: 0.5 } },
        },
        margin: { l: 0, r: 0, b: 30, t: 50 },
      });

      return;
    }

    // ✅ Jika >1 titik di y → buat surface
    const z: number[][] = Array(y.length)
      .fill(null)
      .map(() => Array(x.length).fill(0));
    const xMap = new Map(x.map((val, i) => [val, i]));
    const yMap = new Map(y.map((val, i) => [val, i]));

    points.forEach((p) => {
      const i = yMap.get(p.y);
      const j = xMap.get(p.x);
      if (i !== undefined && j !== undefined) {
        z[i][j] = -p.z; // Plotly: positif ke atas
      }
    });

    setData([
      {
        z,
        x,
        y,
        type: "surface",
        colorscale: "Viridis",
        showscale: true,
        contours: { z: { show: true, usecolormap: true, project: { z: true } } },
      },
    ]);

    setLayout({
      title: `Permukaan 3D - ${surveyId}`,
      scene: {
        xaxis: { title: "Jarak (m)" },
        yaxis: { title: "Lebar (m)" },
        zaxis: { title: "Kedalaman (m)", autorange: "reversed" },
        camera: { eye: { x: 1.5, y: 1.5, z: 0.5 } },
      },
      margin: { l: 0, r: 0, b: 30, t: 50 },
    });
  }, [points, surveyId]);

  if (points.length === 0) {
    return <div>Tidak ada data</div>;
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Plot data={data} layout={layout} config={{ responsive: true }} style={{ width: "100%", height: "100%" }} useResizeHandler key={surveyId} />
    </div>
  );
}
