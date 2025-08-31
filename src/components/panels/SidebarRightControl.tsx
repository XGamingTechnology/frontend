// src/components/panels/SidebarRightControl.tsx
"use client";

import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { useTool } from "@/context/ToolContext";

// Komponen Anak (UI)
import ViewModeToggle from "./controls/ViewModeToggle";
import SurveySelector from "./controls/SurveySelector";
import DistanceSelector from "./controls/DistanceSelector";
import LongitudinalChart from "./charts/LongitudinalChart";
import CrossSectionChart from "./charts/CrossSectionChart";

// Hook (Logika)
import { useSurveyData } from "@/hooks/useSurveyData";
import { useSamplingPoints } from "@/hooks/useSamplingPoints";

// ✅ GANTI: dom-to-image lebih kompatibel daripada html2canvas
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";

export default function SidebarRightControl() {
  const [activeTab, setActiveTab] = useState<"field" | "simulated">("field");
  const [viewMode, setViewMode] = useState<"longitudinal" | "cross">("longitudinal");
  const [selectedSurveyIds, setSelectedSurveyIds] = useState<string[]>([]);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [width, setWidth] = useState(360);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const { surveyListVersion } = useData();
  const { setShow3DPanel } = useTool();

  // ✅ Data dari hook
  const { surveyGroups, loading: loadingGroups } = useSurveyData(activeTab);
  const { allData, loading: loadingPoints } = useSamplingPoints(selectedSurveyIds, surveyGroups);

  // Reset saat ganti tab
  useEffect(() => {
    console.log("🔄 [SidebarRightControl] activeTab berubah:", activeTab);
    setSelectedSurveyIds([]);
    setSelectedDistance(null);
  }, [activeTab]);

  // Hitung jarak untuk cross-section
  const allDistances = Array.from(
    new Set(
      Object.values(allData)
        .flat()
        .map((p) => Math.round(p.distance))
    )
  ).sort((a, b) => a - b);

  // Style dinamis
  const containerStyle = {
    width: isFullScreen ? "100vw" : isCollapsed ? 0 : width,
    height: isFullScreen ? "100vh" : "calc(100vh - 80px)",
    position: "absolute" as const,
    right: 0,
    top: isFullScreen ? 0 : 80,
    zIndex: 1000,
    borderLeft: isCollapsed ? "none" : "1px solid #e2e8f0",
    overflow: "hidden",
    transition: "width 0.3s ease, height 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  };

  // ✅ Fungsi Screenshot dengan dom-to-image
  const handleScreenshot = () => {
    const chartContainer = document.querySelector(".chart-container");
    if (!chartContainer) {
      alert("❌ Chart tidak ditemukan!");
      return;
    }

    // Simpan style asli
    const originalBackground = (chartContainer as HTMLElement).style.background;
    const originalBoxShadow = (chartContainer as HTMLElement).style.boxShadow;

    // Bersihkan background untuk hasil lebih baik
    (chartContainer as HTMLElement).style.background = "#fff";
    (chartContainer as HTMLElement).style.boxShadow = "none";

    // Ekspor ke PNG
    domtoimage
      .toBlob(chartContainer as HTMLElement, {
        bgcolor: "#fff",
        quality: 1,
        width: (chartContainer as HTMLElement).offsetWidth,
        height: (chartContainer as HTMLElement).offsetHeight,
      })
      .then((blob) => {
        const surveyNames = selectedSurveyIds.map((id) => id.slice(-6)).join("_");
        const fileName = `profil_${viewMode}_${surveyNames}_${Date.now()}.png`;
        saveAs(blob, fileName);
      })
      .catch((err) => {
        console.error("❌ Gagal screenshot:", err);
        alert("Gagal membuat screenshot. Cek konsol untuk detail.");
      })
      .finally(() => {
        // Kembalikan style asli
        (chartContainer as HTMLElement).style.background = originalBackground;
        (chartContainer as HTMLElement).style.boxShadow = originalBoxShadow;
      });
  };

  return (
    <div style={containerStyle} className="font-sans">
      {/* Resize Handle */}
      {!isCollapsed && !isFullScreen && (
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startWidth = width;
            const onMouseMove = (move: MouseEvent) => {
              setWidth(Math.max(280, startWidth - (move.clientX - startX)));
            };
            const onMouseUp = () => {
              document.removeEventListener("mousemove", onMouseMove);
              document.removeEventListener("mouseup", onMouseUp);
            };
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
          }}
          className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-blue-400 bg-transparent z-10"
          style={{ left: "-1px" }}
          title="Tarik untuk ubah lebar"
        />
      )}

      {/* Konten Utama */}
      {!isCollapsed && (
        <div className="flex flex-col h-full bg-gray-50">
          {/* Header */}
          <div className="bg-white px-5 py-4 border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <span className="text-blue-600 text-lg">📊</span>
                <span className="tracking-wide">Analisis Profil</span>
              </h2>
              <div className="flex items-center gap-2">
                {/* Tab Switch */}
                <div className="flex border border-slate-300 rounded text-sm overflow-hidden">
                  <button onClick={() => setActiveTab("field")} className={`px-3 py-1 ${activeTab === "field" ? "bg-blue-500 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`}>
                    Lapangan
                  </button>
                  <button onClick={() => setActiveTab("simulated")} className={`px-3 py-1 ${activeTab === "simulated" ? "bg-blue-500 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`}>
                    Simulasi
                  </button>
                </div>

                {/* Mode Toggle */}
                <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

                {/* 📸 Screenshot Button */}
                <button onClick={handleScreenshot} className="text-xs px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition shadow-sm" title="Ambil Screenshot Chart">
                  📸
                </button>

                {/* Full Screen */}
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${isFullScreen ? "bg-blue-500 text-white shadow-md" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                >
                  {isFullScreen ? "Normal" : "Penuh"}
                </button>

                {/* Collapse */}
                <button onClick={() => setIsCollapsed(true)} className="text-xs px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Survey Selector */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition-all hover:shadow-md">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">📋 Pilih Survey ({activeTab === "field" ? "Lapangan" : "Simulasi"})</h3>
              <SurveySelector activeTab={activeTab} setActiveTab={setActiveTab} surveyGroups={surveyGroups} selectedSurveyIds={selectedSurveyIds} setSelectedSurveyIds={setSelectedSurveyIds} loading={loadingGroups} />
            </div>

            {/* Distance Selector */}
            {viewMode === "cross" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition-all hover:shadow-md">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">📍 Pilih Jarak untuk Cross-Section</h3>
                <DistanceSelector allDistances={allDistances} selectedDistance={selectedDistance} setSelectedDistance={setSelectedDistance} />
              </div>
            )}

            {/* Chart Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">{viewMode === "longitudinal" ? "📈 Longitudinal Section" : "🔄 Cross Section"}</h3>
              <div className="h-72 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100 chart-container">
                {/* ✅ class "chart-container" digunakan untuk screenshot */}
                {loadingPoints ? (
                  <p className="text-sm text-gray-500 animate-pulse">📊 Memuat data titik...</p>
                ) : selectedSurveyIds.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">Pilih survey untuk melihat grafik.</p>
                ) : viewMode === "longitudinal" ? (
                  <LongitudinalChart selectedSurveyIds={selectedSurveyIds} allData={allData} />
                ) : !selectedDistance ? (
                  <p className="text-sm text-gray-400 italic">Pilih jarak untuk cross-section.</p>
                ) : (
                  <CrossSectionChart selectedSurveyIds={selectedSurveyIds} allData={allData} selectedDistance={selectedDistance} />
                )}
              </div>
            </div>

            {/* Statistik */}
            {selectedSurveyIds.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-sm text-gray-600 space-y-2">
                <p>
                  <strong className="text-gray-800">✅ Survey Dipilih:</strong> {selectedSurveyIds.length}
                </p>
                <p>
                  <strong className="text-gray-800">📊 Total Titik:</strong> {Object.values(allData).flat().length}
                </p>
                {allDistances.length > 0 && (
                  <p>
                    <strong className="text-gray-800">📏 Jarak Maks:</strong> {Math.max(...allDistances)} m
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🔍 Debug Panel */}
      <div className="fixed bottom-4 right-4 bg-black text-white p-3 rounded text-xs z-50 opacity-80">
        <p>
          <strong>Debug:</strong>
        </p>
        <p>Tab: {activeTab}</p>
        <p>View: {viewMode}</p>
        <p>Surveys: {surveyGroups.length}</p>
        <p>Loading: {loadingGroups ? "Yes" : "No"}</p>
        <button onClick={() => setActiveTab("field")} className="text-blue-300 underline mr-2">
          Set Field
        </button>
        <button onClick={() => setActiveTab("simulated")} className="text-green-300 underline">
          Set Simulated
        </button>
      </div>
    </div>
  );
}
