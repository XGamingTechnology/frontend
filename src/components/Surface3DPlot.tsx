// src/components/Surface3DPlot.tsx
import dynamic from "next/dynamic";

// Dynamic import untuk non-SSR
const Surface3DPlotClient = dynamic(() => import("./Surface3DPlotClient"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-80 bg-gray-50 rounded">
      <p className="text-gray-500">Memuat 3D...</p>
    </div>
  ),
});

export default Surface3DPlotClient;
