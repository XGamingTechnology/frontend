// src/components/panels/charts/LongitudinalChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Props {
  selectedSurveyIds: string[];
  allData: Record<string, { distance: number; depth: number }[]>;
}

export default function LongitudinalChart({ selectedSurveyIds, allData }: Props) {
  // Gabungkan semua titik, kelompokkan per jarak
  const dataMap = new Map<number, Record<string, number>>();

  selectedSurveyIds.forEach((id) => {
    const points = allData[id] || [];
    points.forEach((p) => {
      const dist = Math.round(p.distance);
      if (!dataMap.has(dist)) dataMap.set(dist, {});
      // Gunakan kedalaman positif
      dataMap.get(dist)![id] = p.depth;
    });
  });

  const chartData = Array.from(dataMap.entries())
    .map(([distance, depths]) => ({ distance, ...depths }))
    .sort((a, b) => a.distance - b.distance);

  if (chartData.length === 0) {
    return <p className="text-sm text-gray-400 italic">Tidak ada data untuk ditampilkan.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" />

        {/* X: Jarak dari awal transek */}
        <XAxis
          dataKey="distance"
          label={{
            value: "Jarak dari Awal Transek (m)",
            position: "insideBottom",
            dy: 14,
          }}
        />

        {/* Y: Kedalaman (0 di atas, makin dalam ke bawah) */}
        <YAxis
          domain={[0, "dataMax"]} // Mulai dari 0 ke max depth
          label={{
            value: "Kedalaman (m)",
            angle: -90,
            position: "insideLeft",
            dx: -5,
          }}
          tickFormatter={(value) => `${value} m`}
        />

        <Tooltip formatter={(value: number) => [`${value.toFixed(2)} m`, "Kedalaman"]} />
        <Legend />

        {selectedSurveyIds.map((id) => (
          <Line
            key={id}
            type="monotone"
            dataKey={id}
            name={`Survey ${id.slice(-6)}`}
            stroke={`hsl(${Math.random() * 360}, 70%, 50%)`}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
            // ✅ Garis mengarah ke bawah = kedalaman
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
