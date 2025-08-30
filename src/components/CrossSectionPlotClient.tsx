// src/components/CrossSectionPlotClient.tsx
"use client";

import Plot from "react-plotly.js";
import { useEffect, useState } from "react";

export default function CrossSectionPlotClient({ points, surveyId, distance }) {
  const [data, setData] = useState([]);
  const [layout, setLayout] = useState({});

  useEffect(() => {
    if (!points || points.length === 0) return;

    // Filter titik di jarak tertentu
    const crossPoints = points.filter((p) => Math.abs(p.distance - distance) < 1);

    if (crossPoints.length === 0) return;

    // Sort by offset
    crossPoints.sort((a, b) => a.offset - b.offset);

    const y = crossPoints.map((p) => p.offset);
    const z = crossPoints.map((p) => p.depth);

    setData([
      {
        x: y,
        y: z,
        type: "scatter",
        mode: "lines+markers",
        line: { color: "blue", width: 3 },
        marker: { size: 4, color: "red" },
        name: `Cross Section x=${distance}m`,
      },
    ]);

    setLayout({
      title: `Cross Section - ${surveyId} (x=${distance}m)`,
      xaxis: { title: "Lebar (m)" },
      yaxis: { title: "Kedalaman (m)", autorange: "reversed" },
      margin: { l: 50, r: 30, b: 50, t: 50 },
    });
  }, [points, surveyId, distance]);

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Plot data={data} layout={layout} config={{ responsive: true }} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
