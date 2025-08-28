// src/components/panels/Survey3DPanel.tsx
"use client";

import { useData } from "@/context/DataContext";
import { useTool } from "@/context/ToolContext";
import Surface3DPlot from "@/components/Surface3DPlot";

export default function Survey3DPanel() {
  const { current3DData, fetchSurvey3DData } = useData(); // ✅ Ambil fetchSurvey3DData
  const { show3DPanel, setShow3DPanel } = useTool();

  if (!show3DPanel) return null;

  // ✅ Jika data belum ada
  if (!current3DData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-screen flex flex-col overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h3 className="text-xl font-bold text-gray-800">3D Profil Sungai</h3>
            <button onClick={() => setShow3DPanel(false)} className="text-gray-500 hover:text-red-600 text-2xl font-bold">
              ✕
            </button>
          </div>
          <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="text-gray-600">Memuat data 3D...</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Jika data ada tapi kosong
  if (current3DData.points.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-screen flex flex-col overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h3 className="text-xl font-bold text-gray-800">3D Profil Sungai</h3>
            <button onClick={() => setShow3DPanel(false)} className="text-gray-500 hover:text-red-600 text-2xl font-bold">
              ✕
            </button>
          </div>
          <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h4 className="text-lg font-semibold text-gray-800">Data Tidak Tersedia</h4>
            <p className="text-gray-600">
              Tidak ada titik sampling untuk survey <code className="font-mono">{current3DData.surveyId}</code>.
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  // 🔁 Coba lagi
                  const surveyId = current3DData.surveyId;
                  setShow3DPanel(false);
                  // Tutup dulu, lalu buka lagi
                  setTimeout(() => {
                    fetchSurvey3DData(surveyId);
                    setShow3DPanel(true);
                  }, 100);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
              >
                Coba Lagi
              </button>
              <button onClick={() => setShow3DPanel(false)} className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded font-medium transition">
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Render 3D
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">
            3D Profil Sungai: <span className="font-mono">{current3DData.surveyId.slice(-6)}</span>
          </h3>
          <button onClick={() => setShow3DPanel(false)} className="text-gray-500 hover:text-red-600 text-2xl font-bold" aria-label="Tutup panel 3D">
            ✕
          </button>
        </div>

        {/* Konten 3D */}
        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
          <Surface3DPlot points={current3DData.points} surveyId={current3DData.surveyId} />
        </div>
      </div>
    </div>
  );
}
