// src/components/panels/charts/CrossSectionChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Props {
  selectedSurveyIds: string[];
  allData: Record<string, { distance: number; offset: number; depth: number }[]>;
  selectedDistance: number | null;
}

export default function CrossSectionChart({ selectedSurveyIds, allData, selectedDistance }: Props) {
  if (!selectedDistance) {
    return <p className="text-sm text-gray-400 italic">Pilih jarak untuk cross-section.</p>;
  }

  // Ambil titik terdekat dengan selectedDistance
  const dataMap = new Map<number, Record<string, number>>();

  selectedSurveyIds.forEach((id) => {
    const points = allData[id] || [];
    points.forEach((p) => {
      if (Math.abs(p.distance - selectedDistance) <= 5) {
        const offset = Math.round(p.offset);
        if (!dataMap.has(offset)) dataMap.set(offset, {});
        dataMap.get(offset)![id] = p.depth;
      }
    });
  });

  const chartData = Array.from(dataMap.entries())
    .map(([offset, depths]) => ({ offset, ...depths }))
    .sort((a, b) => a.offset - b.offset);

  if (chartData.length === 0) {
    return <p className="text-sm text-gray-400 italic">Tidak ada data di jarak ini.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" />

        {/* X: Offset (kiri-kanan) */}
        <XAxis
          dataKey="offset"
          label={{
            value: "Offset Melintang (m)",
            position: "insideBottom",
            dy: 14,
          }}
        />

        {/* Y: Kedalaman (0 di atas, makin dalam ke bawah) */}
        <YAxis
          domain={[0, "dataMax"]} // Kedalaman dari 0 ke max
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
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            // ✅ Tambahkan ini agar garis tidak naik ke atas
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
