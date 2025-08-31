// src/components/panels/controls/SurveySelector.tsx
import { useState, useEffect } from "react";

export interface SurveyGroup {
  surveyId: string;
  date: string;
  source: string;
}

interface Props {
  activeTab: "field" | "simulated";
  setActiveTab: (tab: "field" | "simulated") => void;
  surveyGroups: SurveyGroup[];
  selectedSurveyIds: string[];
  setSelectedSurveyIds: (ids: string[]) => void;
  loading: boolean;
}

export default function SurveySelector({ activeTab, setActiveTab, surveyGroups, selectedSurveyIds, setSelectedSurveyIds, loading }: Props) {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // 🔍 Debug: cek input
  useEffect(() => {
    console.log("🔍 [SurveySelector] Input diterima:", {
      activeTab,
      surveyGroupsCount: surveyGroups.length,
      loading,
    });
  }, [activeTab, surveyGroups, loading]);

  // Filter hanya untuk tab aktif
  const filtered = surveyGroups.filter((s) => (activeTab === "field" ? s.source === "import" : s.source !== "import"));

  console.log("🔍 [SurveySelector] Filtered for tab:", activeTab, "→", filtered.length, "items");

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentSurveys = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset halaman saat data atau tab berubah
  useEffect(() => {
    setCurrentPage(1);
    console.log("🔄 [SurveySelector] Halaman reset karena surveyGroups atau activeTab berubah");
  }, [surveyGroups, activeTab]);

  // Handle select all di halaman saat ini
  const handleSelectAll = () => {
    const currentPageIds = currentSurveys.map((s) => s.surveyId);
    const allSelected = currentPageIds.every((id) => selectedSurveyIds.includes(id));

    if (allSelected) {
      // Deselect semua di halaman ini
      setSelectedSurveyIds(selectedSurveyIds.filter((id) => !currentPageIds.includes(id)));
    } else {
      // Select semua di halaman ini, hindari duplikasi
      const newIds = Array.from(new Set([...selectedSurveyIds, ...currentPageIds]));
      setSelectedSurveyIds(newIds);
    }
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-sm text-gray-500 italic">Memuat daftar survey...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-500 italic">{activeTab === "field" ? "Belum ada data lapangan." : "Tidak ada data simulasi. Pastikan data dengan layerType 'valid_sampling_point' sudah dibuat."}</p>
      ) : (
        <>
          {/* Tab Switch (Opsional: jika ingin duplikat di dalam) */}
          {/* Tapi biasanya di header, jadi bisa dihapus jika sudah ada di parent */}

          {/* Tabel */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={currentSurveys.length > 0 && currentSurveys.every((s) => selectedSurveyIds.includes(s.surveyId))}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID Survey</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tanggal</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sumber</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentSurveys.map((survey) => (
                  <tr key={survey.surveyId} className={`transition-all hover:bg-blue-50 cursor-pointer text-sm ${selectedSurveyIds.includes(survey.surveyId) ? "bg-blue-50 border-l-4 border-blue-400" : ""}`}>
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedSurveyIds.includes(survey.surveyId)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSurveyIds([...selectedSurveyIds, survey.surveyId]);
                          } else {
                            setSelectedSurveyIds(selectedSurveyIds.filter((id) => id !== survey.surveyId));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-800 truncate max-w-xs">{survey.surveyId.slice(-8).toUpperCase()}</td>
                    <td className="px-3 py-2 text-gray-700">{survey.date}</td>
                    <td className="px-3 py-2 text-xs font-medium text-gray-600">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${survey.source === "import" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>{survey.source}</span>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => {
                          console.log("🚀 [SurveySelector] Buka 3D untuk:", survey.surveyId);
                          // Di sini bisa panggil setShow3DPanel atau buka modal
                        }}
                        className="text-xs px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded hover:from-purple-600 hover:to-blue-600 transition shadow-sm"
                      >
                        3D 🚀
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
              <p className="text-gray-600">
                Menampilkan <span className="font-medium text-gray-800">{currentSurveys.length}</span> dari <span className="font-medium text-gray-800">{filtered.length}</span>
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded border text-xs font-medium transition ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  Sebelumnya
                </button>
                <span className="text-gray-700 font-medium">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded border text-xs font-medium transition ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <p className="text-xs text-gray-500 mt-2">Centang survey untuk tampilkan profilnya.</p>

      {/* 🔍 Debug: Info Tambahan (Hapus di produksi) */}
      <div className="text-xs text-gray-400 mt-2">
        <p>
          <strong>Debug:</strong> Tab: {activeTab} | Surveys: {surveyGroups.length} | Filtered: {filtered.length}
        </p>
      </div>
    </div>
  );
}
