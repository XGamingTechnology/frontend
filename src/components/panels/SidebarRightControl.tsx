// src/components/panels/SidebarRightControl.tsx
"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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

// ✅ Screenshot: dom-to-image lebih stabil
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";

// ✅ Fungsi analisis
import { calculateCrossSectionDifference } from "@/utils/analysis";

// ✅ Recharts untuk visualisasi
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

// ✅ Tipe untuk perbedaan cross-section
type Difference = {
  offset: number;
  diff: number;
  depthA: number;
  depthB: number;
  distance: number;
};

export default function SidebarRightControl() {
  const [activeTab, setActiveTab] = useState<"field" | "simulated">("field");
  const [viewMode, setViewMode] = useState<"longitudinal" | "cross">("longitudinal");
  const [selectedSurveyIds, setSelectedSurveyIds] = useState<string[]>([]);
  const [selectedDistances, setSelectedDistances] = useState<number[]>([]);
  const [width, setWidth] = useState(360);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [compareMode, setCompareMode] = useState<"single" | "compare">("single");

  const { surveyListVersion } = useData();
  const { setShow3DPanel } = useTool();

  // ✅ Ambil data dari kedua tab
  const { surveyGroups: fieldGroups } = useSurveyData("field");
  const { surveyGroups: simulatedGroups } = useSurveyData("simulated");

  // ✅ Gabungkan semua surveyGroups untuk lookup
  const allSurveyGroups = useMemo(() => [...fieldGroups, ...simulatedGroups], [fieldGroups, simulatedGroups]);

  // ✅ Data gabungan untuk kedua tab
  const { allData, loading: loadingPoints } = useSamplingPoints(selectedSurveyIds, allSurveyGroups);

  // Reset saat ganti tab jika bukan mode compare
  useEffect(() => {
    if (compareMode === "single") {
      setSelectedSurveyIds([]);
      setSelectedDistances([]);
    }
  }, [activeTab, compareMode]);

  // Hitung jarak untuk cross-section
  const allDistances = useMemo(() => {
    return Array.from(
      new Set(
        Object.values(allData)
          .flat()
          .map((p) => Math.round(p.distance))
      )
    ).sort((a, b) => a - b);
  }, [allData]);

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

  // ✅ Ref untuk resize handle
  const resizeRef = useRef<HTMLDivElement>(null);

  // ✅ Fungsi resize lebar
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = width;

      const handleMouseMove = (move: MouseEvent) => {
        setWidth(Math.max(280, startWidth - (move.clientX - startX)));
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [width]
  );

  // ✅ Fungsi Screenshot
  const handleScreenshot = () => {
    const chartContainer = document.querySelector(".chart-container");
    if (!chartContainer) {
      alert("❌ Chart tidak ditemukan!");
      return;
    }

    const originalBg = (chartContainer as HTMLElement).style.background;
    const originalShadow = (chartContainer as HTMLElement).style.boxShadow;

    (chartContainer as HTMLElement).style.background = "#fff";
    (chartContainer as HTMLElement).style.boxShadow = "none";

    domtoimage
      .toBlob(chartContainer as HTMLElement, { bgcolor: "#fff", quality: 1 })
      .then((blob: Blob) => {
        const surveyNames = selectedSurveyIds.map((id) => id.slice(-6)).join("_");
        const fileName = `profil_${viewMode}_${surveyNames}_${Date.now()}.png`;
        saveAs(blob, fileName);
      })
      .catch((err: any) => console.error("❌ Gagal screenshot:", err))
      .finally(() => {
        (chartContainer as HTMLElement).style.background = originalBg;
        (chartContainer as HTMLElement).style.boxShadow = originalShadow;
      });
  };

  // ✅ Hitung data untuk visualisasi + tabel (untuk semua mode)
  const { changeData, summaryData, avgOverallChange, totalPoints, differences } = useMemo(() => {
    if (selectedSurveyIds.length !== 2 || selectedDistances.length === 0) {
      return {
        changeData: [],
        summaryData: [],
        avgOverallChange: 0,
        totalPoints: 0,
        differences: [] as Difference[],
      };
    }

    const changes: Array<{ distance: number; diff: number }> = selectedDistances.map((distance) => {
      const diff = calculateCrossSectionDifference(selectedSurveyIds[0], selectedSurveyIds[1], allData, distance);
      const avgDiff = diff.length === 0 ? 0 : diff.reduce((sum, d) => sum + d.diff, 0) / diff.length;
      return { distance, diff: avgDiff };
    });

    const totalDiff = changes.reduce((sum, c) => sum + c.diff, 0);
    const avg = changes.length === 0 ? 0 : totalDiff / changes.length;

    let erosionCount = 0;
    let sedimentationCount = 0;

    selectedDistances.forEach((distance) => {
      const diff = calculateCrossSectionDifference(selectedSurveyIds[0], selectedSurveyIds[1], allData, distance);
      diff.forEach((d) => {
        if (d.diff < 0) erosionCount++;
        else if (d.diff > 0) sedimentationCount++;
      });
    });

    const total = erosionCount + sedimentationCount;

    const differences: Difference[] = selectedDistances.flatMap((distance) => {
      return calculateCrossSectionDifference(selectedSurveyIds[0], selectedSurveyIds[1], allData, distance).map((d) => ({
        ...d,
        distance,
      }));
    });

    return {
      changeData: changes,
      summaryData: [
        { name: "Erosi", value: erosionCount, color: "#ef4444" },
        { name: "Sedimentasi", value: sedimentationCount, color: "#10b981" },
      ],
      avgOverallChange: avg,
      totalPoints: total,
      differences: differences,
    };
  }, [selectedSurveyIds, selectedDistances, allData]);

  // ✅ PERBANDINGAN LAPANGAN VS SIMULASI (DIPERBAIKI)
  const fieldVsSimulated = useMemo(() => {
    if (compareMode !== "compare" || selectedSurveyIds.length !== 2) return null;

    const surveySourceMap = Object.fromEntries(allSurveyGroups.map((s) => [s.surveyId, s.source]));

    const [id1, id2] = selectedSurveyIds;
    const source1 = surveySourceMap[id1];
    const source2 = surveySourceMap[id2];

    const isField1 = source1 === "import";
    const isField2 = source2 === "import";

    if (!isField1 && !isField2) return null; // bukan lapangan
    if (isField1 && isField2) return null; // keduanya lapangan

    const fieldId = isField1 ? id1 : id2;
    const simId = isField1 ? id2 : id1;

    if (surveySourceMap[simId] === "import") return null;

    const commonDistance = selectedDistances.length > 0 ? selectedDistances[0] : allDistances[0];
    const diff = calculateCrossSectionDifference(fieldId, simId, allData, commonDistance);
    const avgDiff = diff.length === 0 ? 0 : diff.reduce((a, b) => a + b.diff, 0) / diff.length;

    return {
      fieldId,
      simId,
      distance: commonDistance,
      diff,
      avgDiff,
    };
  }, [compareMode, selectedSurveyIds, allSurveyGroups, allDistances, selectedDistances, allData]);

  // ✅ Tentukan survey IDs untuk ditampilkan di chart
  const displaySurveyIds = useMemo(() => {
    return compareMode === "compare" && fieldVsSimulated ? [fieldVsSimulated.fieldId, fieldVsSimulated.simId] : selectedSurveyIds;
  }, [compareMode, fieldVsSimulated, selectedSurveyIds]);

  return (
    <div style={containerStyle} className="font-sans">
      {/* Resize Handle */}
      {!isCollapsed && !isFullScreen && (
        <div ref={resizeRef} onMouseDown={handleMouseDown} className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-blue-400 bg-transparent z-10" style={{ left: "-1px" }} title="Tarik untuk ubah lebar" />
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
                {/* Mode Compare */}
                <div className="flex border border-slate-300 rounded text-sm overflow-hidden">
                  <button onClick={() => setCompareMode("single")} className={`px-3 py-1 ${compareMode === "single" ? "bg-blue-500 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`}>
                    Satu Tab
                  </button>
                  <button onClick={() => setCompareMode("compare")} className={`px-3 py-1 ${compareMode === "compare" ? "bg-blue-500 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`}>
                    Bandingkan
                  </button>
                </div>

                {/* Tab Switch (hanya aktif di mode single) */}
                {compareMode === "single" && (
                  <div className="flex border border-slate-300 rounded text-sm overflow-hidden">
                    <button onClick={() => setActiveTab("field")} className={`px-3 py-1 ${activeTab === "field" ? "bg-blue-500 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`}>
                      Lapangan
                    </button>
                    <button onClick={() => setActiveTab("simulated")} className={`px-3 py-1 ${activeTab === "simulated" ? "bg-blue-500 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`}>
                      Simulasi
                    </button>
                  </div>
                )}

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
            {compareMode === "single" ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition-all hover:shadow-md">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">📋 Pilih Survey ({activeTab === "field" ? "Lapangan" : "Simulasi"})</h3>
                <SurveySelector
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  surveyGroups={activeTab === "field" ? fieldGroups : simulatedGroups}
                  selectedSurveyIds={selectedSurveyIds}
                  setSelectedSurveyIds={setSelectedSurveyIds}
                  loading={false}
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Survey Lapangan */}
                <div key="field-selector-wrapper" className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">📋 Survey Lapangan</h3>
                  <SurveySelector
                    key={`field-selector-${selectedSurveyIds.length}`}
                    activeTab="field"
                    setActiveTab={() => {}}
                    surveyGroups={fieldGroups}
                    selectedSurveyIds={selectedSurveyIds.filter((id) => {
                      const s = allSurveyGroups.find((g) => g.surveyId === id);
                      return s?.source === "import";
                    })}
                    setSelectedSurveyIds={(newIds) => {
                      const simIds = selectedSurveyIds.filter((id) => {
                        const s = allSurveyGroups.find((g) => g.surveyId === id);
                        return s?.source !== "import";
                      });
                      setSelectedSurveyIds([...newIds, ...simIds]);
                    }}
                    loading={false}
                  />
                </div>

                {/* Survey Simulasi */}
                <div key="simulated-selector-wrapper" className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">🧪 Survey Simulasi</h3>
                  <SurveySelector
                    key={`simulated-selector-${selectedSurveyIds.length}`}
                    activeTab="simulated"
                    setActiveTab={() => {}}
                    surveyGroups={simulatedGroups}
                    selectedSurveyIds={selectedSurveyIds.filter((id) => {
                      const s = allSurveyGroups.find((g) => g.surveyId === id);
                      return s?.source !== "import";
                    })}
                    setSelectedSurveyIds={(newIds) => {
                      const fieldIds = selectedSurveyIds.filter((id) => {
                        const s = allSurveyGroups.find((g) => g.surveyId === id);
                        return s?.source === "import";
                      });
                      setSelectedSurveyIds([...fieldIds, ...newIds]);
                    }}
                    loading={false}
                  />
                </div>
              </div>
            )}

            {/* Distance Selector */}
            {viewMode === "cross" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition-all hover:shadow-md">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">📍 Pilih Jarak untuk Cross-Section</h3>
                <DistanceSelector allDistances={allDistances} selectedDistances={selectedDistances} setSelectedDistances={setSelectedDistances} />
              </div>
            )}

            {/* Chart Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">{viewMode === "longitudinal" ? "📈 Longitudinal Section" : "🔄 Cross Section"}</h3>

              {viewMode === "cross" && selectedDistances.length > 0 ? (
                <div className="space-y-6">
                  {selectedDistances.map((distance) => (
                    <div key={distance} className="chart-container">
                      <h4 className="text-xs text-gray-600 mb-2">Jarak: {distance} m</h4>
                      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100">
                        <CrossSectionChart selectedSurveyIds={displaySurveyIds} allData={allData} selectedDistance={distance} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : viewMode === "longitudinal" ? (
                <div className="h-72 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100 chart-container">
                  {loadingPoints ? (
                    <p className="text-sm text-gray-500 animate-pulse">📊 Memuat data titik...</p>
                  ) : displaySurveyIds.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">Pilih survey untuk melihat grafik.</p>
                  ) : (
                    <>
                      <LongitudinalChart selectedSurveyIds={displaySurveyIds} allData={allData} />
                      {compareMode === "compare" && fieldVsSimulated && (
                        <div className="flex gap-4 text-xs mt-2">
                          <div className="flex items-center gap-1">
                            <span className="w-3 h-3 bg-blue-500 rounded"></span>
                            <span>{fieldVsSimulated.fieldId.slice(-6)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-3 h-3 bg-purple-500 rounded"></span>
                            <span>{fieldVsSimulated.simId.slice(-6)}</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Pilih jarak untuk cross-section.</p>
              )}
            </div>

            {/* ✅ ANALISIS PERUBAHAN (untuk semua mode, jika 2 survey & cross) */}
            {selectedSurveyIds.length === 2 && viewMode === "cross" && selectedDistances.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-sm">
                <h4 className="font-medium text-gray-800 mb-4">📊 Perubahan Profil (Cross-Section)</h4>

                <div className="h-48 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={changeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="distance" tickFormatter={(value) => `${value} m`} />
                      <YAxis
                        domain={[Math.min(...changeData.map((c) => c.diff).filter(Boolean)) - 0.5, Math.max(...changeData.map((c) => c.diff).filter(Boolean)) + 0.5]}
                        ticks={[-3, -2, -1, 0, 1, 2, 3]}
                        label={{ value: "Δ Kedalaman (m)", angle: -90, position: "insideLeft", offset: 10 }}
                      />
                      <Tooltip formatter={(value) => [`${value > 0 ? "+" : ""}${value.toFixed(2)} m`, "Perubahan"]} />
                      <Line type="monotone" dataKey="diff" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="h-32 w-32 mx-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={summaryData} cx="50%" cy="50%" innerRadius={30} outerRadius={45} paddingAngle={2} dataKey="value" nameKey="name" label>
                          {summaryData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} titik`, "Jumlah"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="text-sm space-y-1">
                    <p className="text-gray-800">
                      <strong>📉 Erosi:</strong> {summaryData[0].value} titik ({((summaryData[0].value / totalPoints) * 100).toFixed(1)}%)
                    </p>
                    <p className="text-gray-800">
                      <strong>📈 Sedimentasi:</strong> {summaryData[1].value} titik ({((summaryData[1].value / totalPoints) * 100).toFixed(1)}%)
                    </p>
                    <p className="font-medium text-gray-800">
                      Rata-rata perubahan:{" "}
                      <span className={avgOverallChange > 0 ? "text-green-600" : "text-red-600"}>
                        {avgOverallChange > 0 ? "➕" : "➖"} {Math.abs(avgOverallChange).toFixed(2)} m
                      </span>
                    </p>
                  </div>
                </div>

                {differences.length > 0 && (
                  <div className="mt-6 overflow-x-auto">
                    <h5 className="text-sm font-semibold text-gray-800 mb-2">📋 Tabel Perubahan Per Titik (Offset)</h5>
                    <table className="min-w-full text-sm border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-3 py-2 border-b text-left text-gray-800">Jarak (m)</th>
                          <th className="px-3 py-2 border-b text-left text-gray-800">Offset (m)</th>
                          {/* ✅ Ganti "Survey A" dengan ID asli */}
                          <th className="px-3 py-2 border-b text-left text-gray-800">Survey {selectedSurveyIds[0]?.slice(-8).toUpperCase() ?? "Survey 1"}</th>
                          {/* ✅ Ganti "Survey B" dengan ID asli */}
                          <th className="px-3 py-2 border-b text-left text-gray-800">Survey {selectedSurveyIds[1]?.slice(-8).toUpperCase() ?? "Survey 2"}</th>
                          <th className="px-3 py-2 border-b text-left text-gray-800">Selisih (m)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {differences.map((d) => (
                          <tr key={`${d.distance}-${d.offset}`} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-800">{d.distance}</td>
                            <td className="px-3 py-2 text-gray-800">{d.offset}</td>
                            <td className="px-3 py-2 text-gray-800">{d.depthA.toFixed(2)}</td>
                            <td className="px-3 py-2 text-gray-800">{d.depthB.toFixed(2)}</td>
                            <td className={`px-3 py-2 font-medium ${d.diff > 0 ? "text-green-600" : "text-red-600"}`}>
                              {d.diff > 0 ? "+" : ""}
                              {d.diff.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ✅ PERBANDINGAN LAPANGAN VS SIMULASI (hanya di mode compare) */}
            {compareMode === "compare" && fieldVsSimulated && (
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg border border-green-200 text-sm shadow-sm">
                <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">🔍</span>
                  Perbandingan: Lapangan vs Simulasi
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">📍 Data Lapangan</p>
                    <p className="font-mono text-blue-900 text-sm truncate">
                      <strong>ID:</strong> {fieldVsSimulated.fieldId.slice(-8).toUpperCase()}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-3 rounded border border-purple-200">
                    <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">🧪 Data Simulasi</p>
                    <p className="font-mono text-purple-900 text-sm truncate">
                      <strong>ID:</strong> {fieldVsSimulated.simId.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
                  <p className="text-sm">
                    <strong>📉 Rata-rata perbedaan:</strong>{" "}
                    <span className={Math.abs(fieldVsSimulated.avgDiff) > 0.5 ? "text-red-600 font-bold" : Math.abs(fieldVsSimulated.avgDiff) > 0.2 ? "text-yellow-600 font-bold" : "text-green-600 font-bold"}>
                      {fieldVsSimulated.avgDiff > 0 ? "⬆️" : "⬇️"} {Math.abs(fieldVsSimulated.avgDiff).toFixed(2)} m
                    </span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{fieldVsSimulated.avgDiff > 0 ? "Simulasi lebih dangkal" : fieldVsSimulated.avgDiff < 0 ? "Simulasi lebih dalam" : "Sangat akurat!"}</p>
                </div>

                <div className="overflow-x-auto">
                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">📊 Perbedaan Kedalaman per Offset</h5>
                  <table className="min-w-full text-xs border border-gray-300 divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Offset (m)</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-blue-700 uppercase">Lapangan</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-purple-700 uppercase">Simulasi</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Selisih (m)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fieldVsSimulated.diff.map((d) => (
                        <tr key={d.offset} className="hover:bg-gray-50 transition-colors duration-100">
                          <td className="px-3 py-2 text-center font-mono text-gray-800">{d.offset}</td>
                          <td className="px-3 py-2 text-center font-mono text-blue-700">{d.depthA.toFixed(2)}</td>
                          <td className="px-3 py-2 text-center font-mono text-purple-700">{d.depthB.toFixed(2)}</td>
                          <td
                            className={`px-3 py-2 font-medium text-center ${
                              d.diff > 0.5 ? "text-red-600 bg-red-50" : d.diff < -0.5 ? "text-blue-600 bg-blue-50" : d.diff > 0 ? "text-orange-600 bg-orange-50" : d.diff < 0 ? "text-green-600 bg-green-50" : "text-gray-600 bg-gray-100"
                            }`}
                            title={d.diff > 0 ? "Simulasi lebih dangkal" : d.diff < 0 ? "Simulasi lebih dalam" : "Sama"}
                          >
                            {d.diff > 0 ? "+" : ""}
                            {d.diff.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-gray-500 mt-3 italic">
                  💡 Selisih positif (+): simulasi lebih dangkal dari lapangan
                  <br />
                  💡 Selisih negatif (-): simulasi lebih dalam dari lapangan
                </p>
              </div>
            )}

            {/* Statistik */}
            {displaySurveyIds.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-sm text-gray-700 space-y-2">
                <p className="text-gray-800">
                  <strong>✅ Survey Dipilih:</strong> {displaySurveyIds.length}
                </p>
                <p className="text-gray-800">
                  <strong>📊 Total Titik:</strong> {Object.values(allData).flat().length}
                </p>
                {allDistances.length > 0 && (
                  <p className="text-gray-800">
                    <strong>📏 Jarak Maks:</strong> {Math.max(...allDistances)} m
                  </p>
                )}
              </div>
            )}

            {/* 🔍 Debug Tambahan */}
            <div className="bg-gray-100 p-3 rounded text-xs space-y-1 mt-4">
              <p className="text-gray-800">📊 Mode: {compareMode}</p>
              <p className="text-gray-800">📍 Jarak: {selectedDistances.length}</p>
              <p className="text-gray-800">👀 View: {viewMode}</p>
              <p className="text-gray-800">✅ Analisis: {selectedSurveyIds.length === 2 && viewMode === "cross" && selectedDistances.length > 0 ? "YA" : "TIDAK"}</p>
            </div>
          </div>
        </div>
      )}

      {/* 🔍 Debug Panel */}
      <div className="fixed bottom-4 right-4 bg-black text-white p-3 rounded text-xs z-50 opacity-80">
        <p>
          <strong>Debug:</strong>
        </p>
        <p>Mode: {compareMode}</p>
        <p>Surveys: {selectedSurveyIds.length}</p>
        <p>Compare: {fieldVsSimulated ? "✅" : "❌"}</p>
      </div>
    </div>
  );
}
