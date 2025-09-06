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

// ✅ Snap ke kelipatan 5m untuk STA
const getAllCommonDistances = (allData: Record<string, { distance: number; depth: number }[]>): number[] => {
  const distances = new Set<number>();
  Object.values(allData).forEach((points) => {
    points.forEach((p) => {
      distances.add(Math.round(p.distance / 5) * 5);
    });
  });
  return Array.from(distances).sort((a, b) => a - b);
};

// ✅ Format X-axis: STA-00, STA-01, ...
const formatXAxis = (distance: number) => {
  const station = Math.floor(distance / 5);
  return `STA-${station.toString().padStart(2, "0")}`;
};

export default function LongitudinalChart({ selectedSurveyIds, allData }: Props) {
  if (selectedSurveyIds.length === 0) {
    return <p className="text-sm text-gray-400 italic">Pilih survey untuk melihat grafik.</p>;
  }

  const uniqueIds = Array.from(new Set(selectedSurveyIds));

  const commonDistances = getAllCommonDistances(allData);
  if (commonDistances.length === 0) {
    return <p className="text-sm text-gray-400 italic">Tidak ada data jarak untuk ditampilkan.</p>;
  }

  // ✅ Siapkan data untuk chart
  const chartData = commonDistances.map((distance) => {
    const dataPoint: { distance: number } & Record<string, number | null> = {
      distance,
    };

    uniqueIds.forEach((id) => {
      const points = allData[id] || [];
      const depth = interpolateDepth(points, distance);
      dataPoint[id] = depth !== null ? Math.abs(depth) : null;
    });

    return dataPoint;
  });

  // ✅ Cek data valid
  if (
    chartData.every((d) =>
      Object.values(d)
        .slice(1)
        .every((v) => v === null)
    )
  ) {
    return <p className="text-sm text-gray-400 italic">Tidak ada data titik valid untuk ditampilkan.</p>;
  }

  // ✅ Hitung domain Y
  const allDepths = chartData.flatMap((d) => Object.values(d).slice(1)).filter((v): v is number => v !== null);
  const maxDepth = allDepths.length > 0 ? Math.max(...allDepths) : 0;
  const yDomain = [0, Math.ceil(maxDepth + 0.5)];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 40 }} fontFamily="monospace">
        {/* Grid halus */}
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />

        {/* X: STA (Stasiun) */}
        <XAxis
          dataKey="distance"
          tickFormatter={formatXAxis}
          interval={0}
          tick={{
            fontSize: 12,
            fill: "#1e293b",
            fontFamily: "monospace",
            fontWeight: 500,
          }}
          axisLine={{ stroke: "#64748b", strokeWidth: 1 }}
          tickLine={{ stroke: "#64748b", strokeWidth: 1 }}
          label={{
            value: "STA",
            position: "insideBottom",
            dy: 24,
            fontSize: 14,
            fontWeight: 600,
            fill: "#1e293b",
            fontFamily: "monospace",
          }}
        />

        {/* Y: EXISTING ELEVATIONS */}
        <YAxis
          domain={yDomain}
          ticks={Array.from({ length: yDomain[1] + 1 }, (_, i) => i)}
          tickFormatter={(value) => `${value.toFixed(1)} m`}
          tick={{
            fontSize: 12,
            fill: "#1e293b",
            fontFamily: "monospace",
            fontWeight: 500,
          }}
          axisLine={{ stroke: "#64748b", strokeWidth: 1 }}
          tickLine={{ stroke: "#64748b", strokeWidth: 1 }}
          label={{
            value: "EXISTING ELEVATIONS",
            angle: -90,
            position: "insideLeft",
            dx: -24,
            fontSize: 14,
            fontWeight: 600,
            fill: "#1e293b",
            fontFamily: "monospace",
          }}
        />

        {/* Tooltip: Tampilkan STA dan kedalaman */}
        <Tooltip
          formatter={(value: any, name: string) => {
            if (value == null || isNaN(value)) return ["Tidak tersedia", name];
            const num = Number(value);
            return isNaN(num) ? ["Tidak valid", name] : [`${num.toFixed(2)} m`, name];
          }}
          labelFormatter={(label) => `Stasiun: ${formatXAxis(label)}`}
          contentStyle={{
            borderRadius: 6,
            border: "1px solid #cbd5e1",
            backgroundColor: "#fff",
            fontFamily: "monospace",
            fontSize: 12,
          }}
        />

        {/* Legenda di atas */}
        <Legend
          verticalAlign="top"
          height={36}
          wrapperStyle={{
            fontSize: 12,
            fontFamily: "monospace",
            fontWeight: 500,
            paddingLeft: 10,
          }}
          formatter={(value) => `Survey ${value.slice(-6)}`}
        />

        {/* Garis untuk setiap survey */}
        {uniqueIds.map((id) => (
          <Line key={id} type="monotone" dataKey={id} name={id} stroke={getColor(id)} strokeWidth={2.5} dot={{ r: 3, fill: getColor(id) }} activeDot={{ r: 6, strokeWidth: 2 }} isAnimationActive={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
