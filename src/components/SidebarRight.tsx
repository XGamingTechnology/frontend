// src/components/SidebarRight.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, ChartOptions } from "chart.js";
import { useData } from "@/context/DataContext";
import { useTool } from "@/context/ToolContext"; // ✅ Tambah ini

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

// === Tipe Data ===
interface Transect {
  id: string;
  name: string;
  length: number;
  avgDepth: number;
}

interface SurveyGroup {
  surveyId: string;
  date: string;
  transects: Transect[];
  source: string;
}

interface SamplingPoint {
  surveyId: string;
  distance: number;
  depth: number;
}

export default function SidebarRight() {
  const [activeTab, setActiveTab] = useState<"field" | "simulated">("field");
  const [surveyGroups, setSurveyGroups] = useState<SurveyGroup[]>([]);
  const [selectedSurveyIds, setSelectedSurveyIds] = useState<string[]>([]);
  const [allData, setAllData] = useState<Record<string, SamplingPoint[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadingPoints, setLoadingPoints] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { dataVersion, surveyListVersion, fetchSurvey3DData } = useData(); // ✅ Ambil fetchSurvey3DData
  const { setShow3DPanel } = useTool(); // ✅ Untuk buka panel

  const itemsPerPage = 5;

  // --- Helper: Ambil token ---
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // === 1. Tab "Data Lapangan": Ambil dari localStorage ===
  useEffect(() => {
    if (activeTab === "field") {
      try {
        const saved = localStorage.getItem("fieldSurveys");
        const surveys: SurveyGroup[] = saved ? JSON.parse(saved) : [];
        setSurveyGroups(surveys);
      } catch (err) {
        console.error("❌ Gagal baca fieldSurveys dari localStorage:", err);
        setSurveyGroups([]);
      } finally {
        setLoading(false);
      }
    }
  }, [activeTab, surveyListVersion]);

  // === 2. Tab "Simulasi": Ambil dari GraphQL ===
  useEffect(() => {
    if (activeTab === "simulated") {
      const fetchSurveyGroups = async () => {
        setLoading(true);
        try {
          const res = await fetch("http://localhost:5000/graphql", {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              query: `
                query GetSimulatedSurveys {
                  spatialFeatures(layerType: "valid_sampling_point") {
                    meta
                    source
                  }
                }
              `,
            }),
          });

          const data = await res.json();
          if (data.errors) throw new Error(data.errors[0].message);

          const features = data.data?.spatialFeatures || [];
          const grouped: Record<string, SurveyGroup> = {};

          features.forEach((item: any) => {
            const meta = item.meta || {};
            const surveyId = meta.survey_id || meta.surveyId || meta.SURVEY_ID || item.surveyId;
            if (!surveyId || item.source === "import") return;

            if (!grouped[surveyId]) {
              grouped[surveyId] = {
                surveyId,
                date: meta.survey_date || "N/A",
                transects: [],
                source: item.source || "drawing",
              };
            }
          });

          setSurveyGroups(Object.values(grouped));
        } catch (err) {
          console.error("❌ Gagal muat simulasi:", err);
          alert("Gagal muat data simulasi.");
          setSurveyGroups([]);
        } finally {
          setLoading(false);
        }
      };

      fetchSurveyGroups();
    }
  }, [activeTab, dataVersion]);

  // --- Reset saat ganti tab ---
  useEffect(() => {
    setSelectedSurveyIds([]);
    setCurrentPage(1);
  }, [activeTab]);

  // --- Ambil titik untuk chart ---
  useEffect(() => {
    const fetchAllPoints = async () => {
      if (selectedSurveyIds.length === 0) {
        setAllData({});
        return;
      }

      setLoadingPoints(true);
      const newData: Record<string, SamplingPoint[]> = {};

      try {
        for (const surveyId of selectedSurveyIds) {
          const survey = surveyGroups.find((s) => s.surveyId === surveyId);
          if (!survey) continue;

          const isFieldData = survey.source === "import";
          const query = isFieldData
            ? `query GetFieldPoints($surveyId: String!) { fieldSurveyPointsBySurveyId(surveyId: $surveyId) { meta } }`
            : `query GetSimulatedPoints($surveyId: String!) { samplingPointsBySurveyId(surveyId: $surveyId) { meta } }`;

          const res = await fetch("http://localhost:5000/graphql", {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ query, variables: { surveyId } }),
          });

          const result = await res.json();
          if (result.errors) continue;

          const points = result.data?.[Object.keys(result.data)[0]] || [];
          const processedPoints = points
            .map((p: any) => {
              const meta = p.meta || {};
              const depth = parseFloat(meta.kedalaman ?? meta.depth ?? meta.depth_value ?? 0);
              const distance = parseFloat(meta.jarak ?? meta.distance_m ?? meta.distance ?? 0);
              return isNaN(depth) || isNaN(distance) ? null : { surveyId, distance: Math.round(distance * 100) / 100, depth: Math.abs(depth) };
            })
            .filter(Boolean) as SamplingPoint[];

          processedPoints.sort((a, b) => a.distance - b.distance);
          newData[surveyId] = processedPoints;
        }

        setAllData(newData);
      } catch (err) {
        console.error("❌ Gagal muat titik:", err);
      } finally {
        setLoadingPoints(false);
      }
    };

    fetchAllPoints();
  }, [selectedSurveyIds, surveyGroups]);

  // --- Sumbu X ---
  const allDistances = useMemo(() => {
    const distances = new Set<number>();
    Object.values(allData).forEach((points) => points.forEach((p) => distances.add(p.distance)));
    return Array.from(distances).sort((a, b) => a - b);
  }, [allData]);

  // --- Data Chart ---
  const chartData = useMemo(() => {
    const datasets = selectedSurveyIds.map((surveyId, idx) => {
      const points = allData[surveyId] || [];
      const colorHue = (idx * 130) % 360;
      const borderColor = `hsl(${colorHue}, 70%, 50%)`;
      const backgroundColor = `hsl(${colorHue}, 70%, 50%, 0.2)`;

      const data = allDistances.map((dist) => {
        const point = points.find((p) => Math.abs(p.distance - dist) < 0.5);
        return point ? point.depth : null;
      });

      return {
        label: `Survey ${surveyId.slice(-6)}`,
        data,
        borderColor,
        backgroundColor,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      };
    });

    return {
      labels: allDistances.map((d) => d.toFixed(0)),
      datasets,
    };
  }, [allDistances, allData, selectedSurveyIds]);

  // --- Opsi Chart ---
  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { usePointStyle: true, boxWidth: 6, padding: 12, font: { size: 11 } } },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0,0,0,0.8)",
        titleColor: "#fff",
        bodyColor: "#ccc",
        callbacks: {
          label: (ctx) => `${ctx.dataset?.label}: ${ctx.parsed.y} m`,
        },
      },
    },
    scales: {
      y: { reverse: true, title: { display: true, text: "Kedalaman (m)" }, ticks: { stepSize: 1 } },
      x: { title: { display: true, text: "Jarak dari Awal Transek (m)" } },
    },
  };

  // === Filter dan Pagination ===
  const filteredSurveyGroups = useMemo(() => {
    return surveyGroups.filter((s) => (activeTab === "field" ? s.source === "import" : s.source !== "import"));
  }, [surveyGroups, activeTab]);

  const totalPages = Math.ceil(filteredSurveyGroups.length / itemsPerPage);
  const currentSurveys = filteredSurveyGroups.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // === 🔥 BUKA 3D PANEL ===
  const handleOpen3D = async (surveyId: string) => {
    await fetchSurvey3DData(surveyId); // → isi current3DData
    setShow3DPanel(true); // → tampilkan modal
  };

  // === Render UI ===
  return (
    <div className="p-4 w-full space-y-6 bg-gradient-to-br from-slate-50 to-white rounded-xl shadow-lg h-full overflow-y-auto border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl text-slate-800 flex items-center gap-2">
          <span className="text-blue-600">📊</span>
          Perbandingan Penampang Transek
        </h2>
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
          <button onClick={() => setActiveTab("field")} className={`px-3 py-1 text-sm font-medium rounded-md transition ${activeTab === "field" ? "bg-blue-500 text-white shadow" : "text-slate-600 hover:bg-slate-200"}`}>
            📥 Data Lapangan
          </button>
          <button onClick={() => setActiveTab("simulated")} className={`px-3 py-1 text-sm font-medium rounded-md transition ${activeTab === "simulated" ? "bg-blue-500 text-white shadow" : "text-slate-600 hover:bg-slate-200"}`}>
            🖌️ Simulasi
          </button>
        </div>
      </div>

      {/* Select Survey */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-700">Pilih Survey ({activeTab === "field" ? "Lapangan" : "Simulasi"})</label>

        {loading ? (
          <p className="text-sm text-slate-500 italic">Memuat daftar...</p>
        ) : filteredSurveyGroups.length === 0 ? (
          <p className="text-sm text-slate-400 italic">{activeTab === "field" ? "Belum ada data upload." : "Tidak ada data simulasi."}</p>
        ) : (
          <>
            <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedSurveyIds.length > 0 && selectedSurveyIds.every((id) => filteredSurveyGroups.some((s) => s.surveyId === id))}
                        onChange={(e) => setSelectedSurveyIds(e.target.checked ? filteredSurveyGroups.map((s) => s.surveyId) : [])}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Survey ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tanggal</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Titik</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentSurveys.map((survey) => (
                    <tr key={survey.surveyId} className={`transition-all hover:bg-blue-50 cursor-pointer ${selectedSurveyIds.includes(survey.surveyId) ? "bg-blue-50 border-l-4 border-blue-400" : ""}`}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedSurveyIds.includes(survey.surveyId)}
                          onChange={() => setSelectedSurveyIds((prev) => (prev.includes(survey.surveyId) ? prev.filter((id) => id !== survey.surveyId) : [...prev, survey.surveyId]))}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-slate-800">SURVEY...{survey.surveyId.slice(-6)}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{survey.date}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{allData[survey.surveyId]?.length || 0}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleOpen3D(survey.surveyId)} className="text-xs px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded hover:from-purple-600 hover:to-blue-600 transition">
                          3D 🚀
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-sm text-slate-600">
              <p>
                Menampilkan <span className="font-medium">{currentSurveys.length}</span> dari <span className="font-medium">{filteredSurveyGroups.length}</span>
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded border ${currentPage === 1 ? "bg-slate-100 text-slate-400" : "bg-white text-slate-700 hover:bg-slate-50"}`}
                >
                  Previous
                </button>
                <span>
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded border ${currentPage === totalPages ? "bg-slate-100 text-slate-400" : "bg-white text-slate-700 hover:bg-slate-50"}`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
        <p className="text-xs text-slate-500">Pilih survey untuk membandingkan profil dasar.</p>
      </div>

      {/* Chart */}
      <div className="flex-1 h-80 bg-white p-4 rounded-lg shadow-inner">
        <h3 className="font-semibold mb-3 text-slate-700">Grafik Profil Dasar</h3>
        {loadingPoints ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-slate-500">📊 Memuat data...</p>
          </div>
        ) : selectedSurveyIds.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-400">
            <p className="italic">Pilih survey dari tab "{activeTab === "field" ? "Data Lapangan" : "Simulasi"}".</p>
          </div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>

      {/* Statistik */}
      {selectedSurveyIds.length > 0 && (
        <div className="text-sm text-slate-600 space-y-1 border-t pt-3 border-slate-200">
          <p>
            <strong>✅ Survey Dipilih:</strong> {selectedSurveyIds.length}
          </p>
          <p>
            <strong>📊 Total Titik:</strong> {Object.values(allData).flat().length}
          </p>
          {allDistances.length > 0 && (
            <p>
              <strong>📏 Jarak Maks:</strong> {Math.max(...allDistances)} m
            </p>
          )}
        </div>
      )}
    </div>
  );
}
