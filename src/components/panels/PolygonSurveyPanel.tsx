// src/components/panels/PolygonSurveyPanel.tsx
"use client";
import { useState } from "react";

interface PolygonSurveyPanelProps {
  onClose: () => void;
  setActiveTool: (tool: "drawpolygon" | "simulasi" | null) => void;
}

export default function PolygonSurveyPanel({ onClose, setActiveTool }: PolygonSurveyPanelProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineCount, setLineCount] = useState(10);
  const [spacing, setSpacing] = useState(100);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [draftId, setDraftId] = useState<number | null>(null);
  const [areaOptions, setAreaOptions] = useState<Array<{ id: number; name: string }>>([]);

  // Ambil area_sungai
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query GetLayerOptions($layerType: String!) {
                layerOptions(layerType: $layerType) {
                  id
                  name
                }
              }
            `,
            variables: { layerType: "area_sungai" },
          }),
        });
        const data = await res.json();
        if (data.data?.layerOptions) {
          setAreaOptions(data.data.layerOptions);
          if (!selectedAreaId) {
            setSelectedAreaId(data.data.layerOptions[0].id);
          }
        }
      } catch (err) {
        alert("Gagal muat area");
      }
    };
    fetchAreas();
  }, [selectedAreaId]);

  const handleSaveDraft = async () => {
    // Mock polygon: ganti dengan input dari Leaflet.Draw
    const mockPolygon = [
      [104.78, -2.98],
      [104.79, -2.98],
      [104.79, -2.99],
      [104.78, -2.99],
      [104.78, -2.98],
    ];

    const geoJson = {
      type: "Polygon",
      coordinates: [mockPolygon],
    };

    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `mutation($geom: JSON!) { savePolygonDraft(geom: $geom) { success draftId message } }`,
          variables: { geom: geoJson },
        }),
      });
      const data = await res.json();
      if (data.data?.savePolygonDraft.success) {
        setDraftId(data.data.savePolygonDraft.draftId);
        alert("✅ Draft polygon disimpan");
      } else {
        throw new Error("Gagal simpan");
      }
    } catch (err: any) {
      alert("❌ Gagal: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProcess = async () => {
    if (!draftId) return alert("Simpan draft dulu");
    if (!selectedAreaId) return alert("Pilih area");

    const surveyId = `POLYGON_SURVEY_${Date.now()}`;
    setIsProcessing(true);

    try {
      const res = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation($surveyId: String!, $draftId: Int!, $lineCount: Int!, $spacing: Float!) {
              generateTransekFromPolygon(surveyId: $surveyId, polygonDraftId: $draftId, lineCount: $lineCount, spacing: $spacing) {
                success message
              }
            }
          `,
          variables: { surveyId, draftId, lineCount, spacing },
        }),
      });
      const data = await res.json();
      if (data.data?.generateTransekFromPolygon.success) {
        alert("✅ Proses selesai");
        refreshData();
      } else {
        throw new Error("Proses gagal");
      }
    } catch (err: any) {
      alert("❌ Gagal: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <button onClick={onClose} className="text-sm text-gray-500">
          ← Kembali
        </button>
        <h4 className="font-bold text-gray-800">🟩 Dari Polygon</h4>
      </div>

      {!isDrawing ? (
        <button
          onClick={() => {
            setIsDrawing(true);
            setActiveTool("drawpolygon");
          }}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded mb-4"
        >
          🖌️ Gambar Area
        </button>
      ) : (
        <div className="mb-4">
          <div className="text-xs text-green-600 mb-2">Klik untuk tambah titik, klik kanan untuk selesai</div>
          <button
            onClick={() => {
              setIsDrawing(false);
              setActiveTool(null);
            }}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
          >
            ✅ Selesai
          </button>
        </div>
      )}

      {isDrawing && (
        <button onClick={handleSaveDraft} disabled={isSaving} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded mb-4">
          {isSaving ? "Menyimpan..." : "💾 Simpan Draft"}
        </button>
      )}

      {draftId && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs font-bold mb-1">Jumlah Garis</label>
              <input type="number" value={lineCount} onChange={(e) => setLineCount(Math.max(1, parseInt(e.target.value) || 1))} className="w-full p-1 border border-gray-300 rounded text-sm" min="1" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Jarak (m)</label>
              <input type="number" value={spacing} onChange={(e) => setSpacing(Math.max(1, parseInt(e.target.value) || 1))} className="w-full p-1 border border-gray-300 rounded text-sm" min="1" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Area Pemotong</label>
            <select value={selectedAreaId ?? ""} onChange={(e) => setSelectedAreaId(e.target.value ? Number(e.target.value) : null)} className="w-full p-2 border border-gray-300 rounded text-sm">
              <option value="">-- Pilih --</option>
              {areaOptions.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleProcess} disabled={isProcessing} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2 rounded mt-3">
            {isProcessing ? "Memproses..." : "🚀 Proses"}
          </button>
        </div>
      )}
    </>
  );
}
