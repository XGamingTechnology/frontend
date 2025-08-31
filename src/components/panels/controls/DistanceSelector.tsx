// src/components/panels/controls/DistanceSelector.tsx

interface Props {
  allDistances: number[];
  selectedDistance: number | null;
  setSelectedDistance: (dist: number | null) => void;
}

export default function DistanceSelector({ allDistances, selectedDistance, setSelectedDistance }: Props) {
  return (
    <div className="text-sm mb-4">
      <label className="block mb-1">Pilih Jarak (m):</label>
      <select value={selectedDistance ?? ""} onChange={(e) => setSelectedDistance(e.target.value ? parseFloat(e.target.value) : null)} className="border rounded px-2 py-1 w-full">
        <option value="">-- Pilih jarak --</option>
        {allDistances.map((dist) => (
          <option key={dist} value={dist}>
            {dist} m
          </option>
        ))}
      </select>
    </div>
  );
}
