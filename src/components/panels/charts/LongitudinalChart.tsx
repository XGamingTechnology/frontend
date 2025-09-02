// src/components/panels/charts/LongitudinalChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Props {
  selectedSurveyIds: string[];
  allData: Record<string, { distance: number; depth: number }[]>;
}

// ✅ Fungsi untuk warna konsisten berdasarkan ID
const getColor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

// ✅ Interpolasi linear — dengan guard untuk 'high' dan 'low'
const interpolateDepth = (points: { distance: number; depth: number }[], targetDistance: number): number | null => {
  if (points.length === 0) return null;

  const sorted = [...points].sort((a, b) => a.distance - b.distance);
  const low = sorted.findLast((p) => p.distance <= targetDistance);
  const high = sorted.find((p) => p.distance >= targetDistance);

  if (!low && !high) return null;
  if (!low) return high!.depth; // high! karena sudah dicek
  if (!high) return low.depth;

  if (low.distance === high.distance) return low.depth;

  const ratio = (targetDistance - low.distance) / (high!.distance - low.distance);
  return low.depth + ratio * (high!.depth - low.depth);
};

// ✅ Ambil semua jarak umum, snap ke kelipatan 10m
const getAllCommonDistances = (allData: Record<string, { distance: number; depth: number }[]>): number[] => {
  const distances = new Set<number>();
  Object.values(allData).forEach((points) => {
    points.forEach((p) => {
      distances.add(Math.round(p.distance / 10) * 10); // Snap ke 10m
    });
  });
  return Array.from(distances).sort((a, b) => a - b);
};

export default function LongitudinalChart({ selectedSurveyIds, allData }: Props) {
  if (selectedSurveyIds.length === 0) {
    return <p className="text-sm text-gray-400 italic">Pilih survey untuk melihat grafik.</p>;
  }

  // ✅ Hilangkan duplikat ID
  const uniqueIds = Array.from(new Set(selectedSurveyIds));

  // ✅ Ambil semua jarak umum dari semua survey
  const commonDistances = getAllCommonDistances(allData);
  if (commonDistances.length === 0) {
    return <p className="text-sm text-gray-400 italic">Tidak ada data jarak untuk ditampilkan.</p>;
  }

  // ✅ Siapkan data untuk chart
  const chartData = commonDistances.map((distance) => {
    const dataPoint: { distance: number } & Record<string, number | null> = { distance };

    uniqueIds.forEach((id) => {
      const points = allData[id] || [];
      const depth = interpolateDepth(points, distance);
      dataPoint[id] = depth;
    });

    return dataPoint;
  });

  // ✅ Cek apakah semua data null
  if (
    chartData.every((d) =>
      Object.values(d)
        .slice(1)
        .every((v) => v === null)
    )
  ) {
    return <p className="text-sm text-gray-400 italic">Tidak ada data titik valid untuk ditampilkan.</p>;
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
          tickFormatter={(value) => `${value} m`}
        />

        {/* Y: Kedalaman */}
        <YAxis
          domain={[0, "dataMax"]}
          label={{
            value: "Kedalaman (m)",
            angle: -90,
            position: "insideLeft",
            dx: -5,
          }}
          tickFormatter={(value) => `${value.toFixed(2)} m`}
        />

        {/* ✅ Tooltip: Perbaiki tipe dengan any */}
        <Tooltip
          formatter={(value: any, name: string) => {
            if (value == null || isNaN(value)) {
              return ["Tidak tersedia", name];
            }
            const num = Number(value);
            return isNaN(num) ? ["Tidak valid", name] : [`${num.toFixed(2)} m`, name];
          }}
          labelFormatter={(label) => `Jarak: ${label} m`}
        />

        {/* Legenda */}
        <Legend />

        {/* ✅ Render garis untuk setiap survey */}
        {uniqueIds.map((id) => (
          <Line key={id} type="monotone" dataKey={id} name={`Survey ${id.slice(-6)}`} stroke={getColor(id)} dot={{ r: 2 }} activeDot={{ r: 4 }} isAnimationActive={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
