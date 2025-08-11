// src/components/panels/SimulasiPanel.tsx
export default function SimulasiPanel({ onClosePanel, setActiveTool, setSurveyMode }: SimulasiPanelProps) {
  return (
    <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-xl shadow-xl p-5 w-80 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">⚙️ Pilih Alur</h3>
        <button onClick={onClosePanel} className="text-gray-500 hover:text-red-500">
          ✕
        </button>
      </div>

      {/* STEP 1: Pilih Mode */}
      <div className="space-y-3">
        <button
          onClick={() => {
            setSurveyMode("line");
            setActiveTool("drawline-transek"); // Langsung mulai gambar
          }}
          className="w-full p-4 text-left border border-blue-200 rounded-lg hover:bg-blue-50 transition"
        >
          <div className="font-semibold text-blue-700">🌊 Transek dari Garis Sungai</div>
          <div className="text-xs text-gray-600">Gambar garis → transek tegak lurus</div>
        </button>

        <button
          onClick={() => {
            setSurveyMode("polygon");
            setActiveTool("drawpolygon-transek"); // Langsung mulai gambar
          }}
          className="w-full p-4 text-left border border-green-200 rounded-lg hover:bg-green-50 transition"
        >
          <div className="font-semibold text-green-700">🟩 Transek dari Area Polygon</div>
          <div className="text-xs text-gray-600">Gambar area → transek zigzag/grid</div>
        </button>
      </div>
    </div>
  );
}
