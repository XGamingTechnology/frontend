// components/forms/SimulasiFormModal.tsx

import { useState } from "react";

export default function SimulasiFormModal({ latlng, onClose, onSubmit }: { latlng: [number, number]; onClose: () => void; onSubmit: (params: { kecepatan: number; debit: number }) => void }) {
  const [kecepatan, setKecepatan] = useState(1);
  const [debit, setDebit] = useState(1);

  const handleSubmit = () => {
    onSubmit({ kecepatan, debit });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-lg w-80 shadow-lg space-y-4">
        <h2 className="text-xl font-semibold">Simulasi Aliran</h2>
        <p className="text-sm text-gray-500">
          Titik: {latlng[0].toFixed(5)}, {latlng[1].toFixed(5)}
        </p>
        <div>
          <label className="block text-sm">Kecepatan Aliran (m/s)</label>
          <input type="number" value={kecepatan} onChange={(e) => setKecepatan(Number(e.target.value))} className="border p-1 w-full rounded" />
        </div>
        <div>
          <label className="block text-sm">Debit (m³/s)</label>
          <input type="number" value={debit} onChange={(e) => setDebit(Number(e.target.value))} className="border p-1 w-full rounded" />
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-3 py-1 text-sm bg-gray-300 rounded">
            Batal
          </button>
          <button onClick={handleSubmit} className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
            Simulasikan
          </button>
        </div>
      </div>
    </div>
  );
}
