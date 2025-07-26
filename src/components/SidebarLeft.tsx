// src/components/SidebarLeft.tsx
"use client";

import { useTool } from "@/context/ToolContext";
import { useData } from "@/context/DataContext"; // 1. Impor useData
import { MapIcon, BeakerIcon, RectangleStackIcon, WrenchScrewdriverIcon, CursorArrowRaysIcon } from "@heroicons/react/24/outline";
import type { Tool } from "@/context/ToolContext";
import { LayerDefinition } from "@/types/layers"; // 2. Impor type

export default function SidebarLeft() {
  const { activeTool, setActiveTool } = useTool();
  // 3. Gunakan state dan fungsi dari DataContext untuk layer
  const { layerDefinitions, layerVisibility, setLayerVisibility, loadingLayers, errorLayers } = useData();

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

  // 4. Fungsi untuk mengubah visibilitas layer
  const handleLayerVisibilityChange = (layerId: string) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
    // TODO: Kirim perubahan ke backend jika diperlukan
    // Misal: updateLayerVisibilityOnBackend(layerId, !prev[layerId]);
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
          {/* 5. Tampilkan state loading/error */}
          {loadingLayers ? (
            <p className="text-gray-500 text-center py-2">Memuat layer...</p>
          ) : errorLayers ? (
            <p className="text-red-500 text-center py-2">Error: {errorLayers}</p>
          ) : layerDefinitions && layerDefinitions.length > 0 ? (
            <div className="space-y-2">
              {/* 6. Iterasi layer dari DataContext */}
              {layerDefinitions.map((layer: LayerDefinition) => (
                <label key={layer.id} className="flex items-center justify-between hover:bg-gray-100 p-2 rounded-md transition cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-cyan-600 w-4 h-4"
                      checked={layerVisibility[layer.id] ?? false} // 7. Gunakan state dari DataContext
                      onChange={() => handleLayerVisibilityChange(layer.id)} // 8. Gunakan fungsi handler
                    />
                    <span>{layer.name}</span> {/* 9. Gunakan nama dari definisi */}
                  </div>
                  {/* 10. Gunakan deskripsi dari definisi untuk tooltip */}
                  <span className="text-gray-400 text-xs group-hover:text-gray-700" title={layer.description}>
                    ℹ️
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-2">Tidak ada layer tersedia.</p>
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
                key={value}
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
