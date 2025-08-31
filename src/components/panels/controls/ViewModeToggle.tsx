// src/components/panels/controls/ViewModeToggle.tsx

interface Props {
  viewMode: "longitudinal" | "cross";
  setViewMode: (mode: "longitudinal" | "cross") => void;
}

export default function ViewModeToggle({ viewMode, setViewMode }: Props) {
  return (
    <div className="flex border border-slate-300 rounded text-sm mb-2">
      <button onClick={() => setViewMode("longitudinal")} className={`px-3 py-1 ${viewMode === "longitudinal" ? "bg-green-500 text-white" : "bg-white text-slate-700"}`}>
        Longitudinal
      </button>
      <button onClick={() => setViewMode("cross")} className={`px-3 py-1 ${viewMode === "cross" ? "bg-purple-500 text-white" : "bg-white text-slate-700"}`}>
        Cross Section
      </button>
    </div>
  );
}
