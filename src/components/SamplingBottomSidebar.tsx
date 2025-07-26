"use client";

import { useEffect, useState } from "react";
import { useTool } from "@/context/ToolContext";

interface Props {
  visible: boolean;
  onClose?: () => void;
}

export default function SamplingBottomSidebar({ visible, onClose }: Props) {
  const { samplingPoints = [], samplingSummary, samplingUpdatedAt } = useTool();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (visible && samplingUpdatedAt) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [samplingUpdatedAt, visible]);

  if (!visible || !samplingSummary) return null;

  const { panjang, kedalamanAvg, lebarAvg, jumlahTitik } = samplingSummary;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-500 p-4 z-[999] shadow-lg text-gray-900">
      <div className="max-w-5xl mx-auto text-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-base text-gray-900">🧪 Informasi Sampling</h3>
          {onClose && (
            <button className="text-sm text-red-600 hover:underline" onClick={onClose}>
              ❌ Tutup
            </button>
          )}
        </div>

        {showSuccess && <div className="mb-3 text-green-800 bg-green-100 border border-green-300 px-4 py-2 rounded-md animate-fade-in">✅ Sampling berhasil dibuat!</div>}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-gray-800">
          <div>
            📏 Panjang Sungai: <strong className="text-black">{Number.isFinite(panjang) ? panjang.toFixed(2) : "-"}</strong> m
          </div>
          <div>
            🌊 Kedalaman Rata-rata: <strong className="text-black">{Number.isFinite(kedalamanAvg) ? kedalamanAvg.toFixed(1) : "-"}</strong> m
          </div>
          <div>
            📐 Lebar Rata-rata: <strong className="text-black">{Number.isFinite(lebarAvg) ? lebarAvg.toFixed(1) : "-"}</strong> m
          </div>
          <div>
            🎯 Jumlah Titik: <strong className="text-black">{jumlahTitik ?? "-"}</strong>
          </div>
        </div>

        {Array.isArray(samplingPoints) && samplingPoints.length > 0 && (
          <details className="mt-3">
            <summary className="cursor-pointer text-blue-700 hover:underline">🔘 Lihat 5 koordinat pertama</summary>
            <ol className="list-decimal list-inside mt-2 max-h-32 overflow-y-auto text-xs bg-gray-100 p-2 rounded text-gray-800">
              {samplingPoints.slice(0, 5).map((pt, i) => {
                const [lng, lat] = pt?.geometry?.coordinates ?? [null, null];
                return <li key={i}>{lat != null && lng != null ? `${lat.toFixed(5)}, ${lng.toFixed(5)}` : "Koordinat tidak tersedia"}</li>;
              })}
            </ol>
          </details>
        )}
      </div>
    </div>
  );
}
