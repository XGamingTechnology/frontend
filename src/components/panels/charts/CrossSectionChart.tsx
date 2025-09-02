// src/components/panels/charts/CrossSectionChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Props {
  selectedSurveyIds: string[];
  allData: Record<string, { distance: number; offset: number; depth: number }[]>;
  selectedDistance: number | null;
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

// ✅ Interpolasi linear
const interpolateDepth = (points: { distance: number; depth: number }[], targetDistance: number): number | null => {
  if (points.length === 0) return null;

  const sorted = [...points].sort((a, b) => a.distance - b.distance);
  const low = sorted.findLast((p) => p.distance <= targetDistance);
  const high = sorted.find((p) => p.distance >= targetDistance);

  if (!low && !high) return null;
  if (!low) return high!.depth;
  if (!high) return low.depth;
  if (low.distance === high.distance) return low.depth;

  const ratio = (targetDistance - low.distance) / (high!.distance - low.distance);
  return low.depth + ratio * (high!.depth - low.depth);
};

export default function CrossSectionChart({ selectedSurveyIds, allData, selectedDistance }: Props) {
  if (!selectedDistance) {
    return <p className="text-sm text-gray-400 italic">Pilih jarak untuk cross-section.</p>;
  }

  // ✅ Hilangkan duplikat ID
  const uniqueIds = Array.from(new Set(selectedSurveyIds));

  // ✅ Ambil semua offset unik dari semua survey
  const allOffsets = Array.from(
    new Set(
      uniqueIds.flatMap((id) => {
        const points = allData[id] || [];
        return points.map((p) => Math.round(p.offset));
      })
    )
  ).sort((a, b) => a - b);

  if (allOffsets.length === 0) {
    return <p className="text-sm text-gray-400 italic">Tidak ada data offset untuk ditampilkan.</p>;
  }

  // ✅ Siapkan data untuk chart
  const chartData = allOffsets.map((offset) => {
    const dataPoint: { offset: number } & Record<string, number | null> = { offset };

    uniqueIds.forEach((id) => {
      const points = allData[id] || [];
      // Filter titik yang dekat dengan offset ini
      const nearbyPoints = points.filter((p) => Math.abs(p.offset - offset) <= 1);

      if (nearbyPoints.length === 0) {
        dataPoint[id] = null;
      } else {
        // Interpolasi kedalaman di selectedDistance
        const depth = interpolateDepth(
          nearbyPoints.map((p) => ({ distance: p.distance, depth: p.depth })),
          selectedDistance
        );
        dataPoint[id] = depth;
      }
    });

    return dataPoint;
  });

  if (
    chartData.every((d) =>
      Object.values(d)
        .slice(1)
        .every((v) => v === null)
    )
  ) {
    return <p className="text-sm text-gray-400 italic">Tidak ada data di jarak ini setelah interpolasi.</p>;
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

        {/* ✅ Tooltip: Perbaiki tipe */}
        <Tooltip
          formatter={(value: any, name: string) => {
            if (value == null || isNaN(value)) {
              return ["Tidak tersedia", name];
            }
            const num = Number(value);
            return isNaN(num) ? ["Tidak valid", name] : [`${num.toFixed(2)} m`, name];
          }}
          labelFormatter={(label) => `Offset: ${label} m`}
        />

        <Legend />

        {/* ✅ Render garis untuk setiap survey */}
        {uniqueIds.map((id) => (
          <Line key={id} type="monotone" dataKey={id} name={`Survey ${id.slice(-6)}`} stroke={getColor(id)} dot={{ r: 3 }} activeDot={{ r: 5 }} isAnimationActive={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
