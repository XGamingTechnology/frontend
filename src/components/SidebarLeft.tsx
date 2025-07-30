// src/components/SidebarLeft.tsx
"use client";

import { useTool } from "@/context/ToolContext";
import { useData } from "@/context/DataContext";
import { MapIcon, BeakerIcon, CursorArrowRaysIcon, WrenchScrewdriverIcon, RectangleStackIcon } from "@heroicons/react/24/outline";
import type { Tool } from "@/context/ToolContext";

export default function SidebarLeft() {
  const { activeTool, setActiveTool } = useTool();
  const { layerDefinitions, layerVisibility, setLayerVisibility, loadingLayers, errorLayers } = useData();

  // 🔧 Tools (bisa dari backend nanti)
  const toolOptions: {
    value: Tool;
    label: string;
    icon: React.ElementType;
    tooltip: string;
  }[] = [
    {
      value: "toponimi",
      label: "Tambah Toponimi",
      icon: MapIcon,
      tooltip: "Menambahkan nama tempat di sungai",
    },
    {
      value: "simulasi",
      label: "Simulasi Akuisisi Data",
      icon: CursorArrowRaysIcon,
      tooltip: "Membuat transek otomatis dari garis tengah sungai",
    },
    {
      value: "echosounder",
      label: "Visualisasi Echosounder",
      icon: BeakerIcon,
      tooltip: "Menampilkan data echosounder",
    },
  ];

  // ✅ Toggle visibilitas layer
  const handleLayerVisibilityChange = (layerId: string) => {
    const newVisibility = { ...layerVisibility, [layerId]: !layerVisibility[layerId] };
    setLayerVisibility(newVisibility);

    try {
      localStorage.setItem("layerVisibility", JSON.stringify(newVisibility));
    } catch (err) {
      console.warn("Gagal simpan layerVisibility ke localStorage", err);
    }
  };

  // ✅ Reset semua layer visibility
  const handleResetLayers = () => {
    if (!Array.isArray(layerDefinitions)) return;

    const reset = layerDefinitions.reduce((acc, layer) => ({ ...acc, [layer.id]: false }), {} as Record<string, boolean>);
    setLayerVisibility(reset);
    try {
      localStorage.setItem("layerVisibility", JSON.stringify(reset));
    } catch (err) {
      console.warn("Gagal reset localStorage", err);
    }
  };

  return (
    <div className="h-full w-72 border-r bg-white text-sm text-gray-800 shadow-md flex flex-col">
      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        {/* Layer List */}
        <div>
          <h2 className="flex items-center gap-2 mb-3 font-semibold border-b pb-1 text-base">
            <RectangleStackIcon className="w-4 h-4" />
            Layer List
          </h2>

          {/* Loading */}
          {loadingLayers && (
            <div className="flex items-center justify-center py-2">
              <span className="text-gray-500 text-sm">Memuat layer...</span>
            </div>
          )}

          {/* Error */}
          {errorLayers && !loadingLayers && (
            <div className="text-center py-2">
              <p className="text-red-500 text-sm">❌ {errorLayers}</p>
              <button onClick={() => window.location.reload()} className="text-xs text-blue-500 hover:underline mt-1">
                Coba lagi
              </button>
            </div>
          )}

          {/* Data Tersedia */}
          {!loadingLayers && !errorLayers && Array.isArray(layerDefinitions) && layerDefinitions.length > 0 && (
            <div className="space-y-2">
              {layerDefinitions.map((layer) => (
                <label key={layer.id} className="flex items-center justify-between hover:bg-gray-100 p-2 rounded-md transition cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="accent-cyan-600 w-4 h-4" checked={layerVisibility[layer.id] ?? false} onChange={() => handleLayerVisibilityChange(layer.id)} />
                    <span className="font-medium">{layer.name}</span>
                  </div>
                  <span className="text-gray-400 text-xs group-hover:text-gray-700" title={layer.description || "Tidak ada deskripsi"}>
                    ℹ️
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* Tidak Ada Data */}
          {!loadingLayers && !errorLayers && (!Array.isArray(layerDefinitions) || layerDefinitions.length === 0) && (
            <div className="text-center py-2">
              <p className="text-gray-500 text-sm">Tidak ada layer tersedia.</p>
              <button onClick={handleResetLayers} className="text-xs text-blue-500 hover:underline mt-1">
                Reset visibilitas
              </button>
            </div>
          )}
        </div>

        {/* Tool Selector */}
        <div>
          <h2 className="flex items-center gap-2 mb-3 font-semibold border-b pb-1 text-base">
            <WrenchScrewdriverIcon className="w-4 h-4" />
            Tools
          </h2>
          <div className="space-y-2">
            {toolOptions.map(({ value, label, icon: Icon, tooltip }) => (
              <button
                key={`tool-${value}`}
                title={tooltip}
                onClick={() => setActiveTool(value)}
                className={`flex items-center w-full gap-2 p-2 rounded-md transition text-left hover:bg-indigo-50 ${activeTool === value ? "bg-indigo-100 font-semibold text-indigo-700" : "text-gray-700"}`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
