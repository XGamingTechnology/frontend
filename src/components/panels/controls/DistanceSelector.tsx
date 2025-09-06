// src/components/panels/controls/DistanceSelector.tsx
import { useState } from "react";

interface Props {
  allDistances: number[];
  selectedDistances: number[];
  setSelectedDistances: (distances: number[]) => void;
}

const ITEMS_PER_PAGE = 5;

// ✅ Format jarak ke STA: STA-00, STA-01, ...
const formatSTA = (distance: number) => {
  const station = Math.floor(distance / 5); // 5m per STA
  return `STA-${station.toString().padStart(2, "0")}`;
};

export default function DistanceSelector({ allDistances, selectedDistances, setSelectedDistances }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Filter hanya jarak kelipatan 5m (untuk STA)
  const validDistances = allDistances.filter((dist) => dist % 5 === 0);
  const totalPages = Math.ceil(validDistances.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentDistances = validDistances.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const isAllSelectedInPage = currentDistances.every((dist) => selectedDistances.includes(dist));
  const isAllSelectedInAll = selectedDistances.length === validDistances.length;

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
      setSelectedDistances([...validDistances]);
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
    <div className="text-sm mb-4 font-sans">
      <div className="flex justify-between items-center mb-2">
        <label className="font-semibold text-gray-800 text-sm font-mono"></label>
        <div className="flex gap-1">
          <button onClick={toggleSelectAllInPage} className="text-xs px-2 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 border border-gray-300">
            {isAllSelectedInPage ? "Batal Halaman" : "Pilih Halaman"}
          </button>
          <button onClick={toggleSelectAllInAll} className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 border border-blue-600">
            {isAllSelectedInAll ? "Batal Semua" : "Pilih Semua"}
          </button>
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg bg-white shadow-sm">
        {validDistances.length === 0 ? (
          <p className="text-gray-500 text-center py-3 text-sm italic font-mono">Tidak ada STA yang tersedia</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
              {currentDistances.map((dist) => (
                <li key={dist} className="flex items-center px-3 py-2 hover:bg-gray-50">
                  <input type="checkbox" id={`sta-${dist}`} checked={selectedDistances.includes(dist)} onChange={() => toggleDistance(dist)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <label htmlFor={`sta-${dist}`} className="ml-3 text-sm font-mono text-gray-800 cursor-pointer">
                    {formatSTA(dist)}
                  </label>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <div className="flex justify-between items-center px-3 py-2 text-xs text-gray-600 border-t bg-gray-50">
                <span className="font-mono">
                  {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, validDistances.length)} dari {validDistances.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200 text-gray-700"}`}
                  >
                    Sebelumnya
                  </button>
                  <span className="px-2 font-mono text-gray-800">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-2 py-1 rounded ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200 text-gray-700"}`}
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
