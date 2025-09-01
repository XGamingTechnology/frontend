// src/components/panels/controls/DistanceSelector.tsx

// ✅ Tambahkan ini di paling atas
import { useState } from "react";

interface Props {
  allDistances: number[];
  selectedDistances: number[];
  setSelectedDistances: (distances: number[]) => void;
}

const ITEMS_PER_PAGE = 5;

export default function DistanceSelector({ allDistances, selectedDistances, setSelectedDistances }: Props) {
  const [currentPage, setCurrentPage] = useState(1); // ✅ Sekarang bisa pakai useState

  const totalPages = Math.ceil(allDistances.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentDistances = allDistances.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const isAllSelectedInPage = currentDistances.every((dist) => selectedDistances.includes(dist));
  const isAllSelectedInAll = selectedDistances.length === allDistances.length;

  const toggleSelectAllInPage = () => {
    if (isAllSelectedInPage) {
      setSelectedDistances(selectedDistances.filter((dist) => !currentDistances.includes(dist)));
    } else {
      const newSelected = Array.from(new Set([...selectedDistances, ...currentDistances]));
      setSelectedDistances(newSelected);
    }
  };

  const toggleSelectAllInAll = () => {
    if (isAllSelectedInAll) {
      setSelectedDistances([]);
    } else {
      setSelectedDistances([...allDistances]);
    }
  };

  const toggleDistance = (dist: number) => {
    if (selectedDistances.includes(dist)) {
      setSelectedDistances(selectedDistances.filter((d) => d !== dist));
    } else {
      setSelectedDistances([...selectedDistances, dist]);
    }
  };

  return (
    <div className="text-sm mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="font-medium text-gray-700">📍 Pilih Jarak (m):</label>
        <div className="flex gap-1">
          <button onClick={toggleSelectAllInPage} className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            {isAllSelectedInPage ? "Batal Halaman" : "Pilih Halaman"}
          </button>
          <button onClick={toggleSelectAllInAll} className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            {isAllSelectedInAll ? "Batal Semua" : "Pilih Semua"}
          </button>
        </div>
      </div>

      <div className="border rounded bg-white">
        {allDistances.length === 0 ? (
          <p className="text-gray-500 text-center py-2 text-xs">Tidak ada data jarak</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-100 max-h-40 overflow-y-auto">
              {currentDistances.map((dist) => (
                <li key={dist} className="flex items-center px-2 py-1 hover:bg-gray-50">
                  <input type="checkbox" id={`dist-${dist}`} checked={selectedDistances.includes(dist)} onChange={() => toggleDistance(dist)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <label htmlFor={`dist-${dist}`} className="ml-2 text-xs text-gray-700 w-full cursor-pointer">
                    {dist} m
                  </label>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <div className="flex justify-between items-center px-2 py-1 text-xs text-gray-600 border-t bg-gray-50">
                <span>
                  {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, allDistances.length)} dari {allDistances.length}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-2 py-0.5 rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"}`}>
                    Sebelumnya
                  </button>
                  <span className="px-2">
                    {" "}
                    {currentPage} / {totalPages}{" "}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-2 py-0.5 rounded ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"}`}
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
