// src/lib/api/dataService.ts

// 1. Konfigurasi URL API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api"; // Gunakan env var

// --- FUNGSI UNTUK MENGAMBIL DATA ---

// GET /features (ambil semua data)
export const fetchFeatures = async (): Promise<any> => {
  // Sesuaikan tipe return jika perlu
  const response = await fetch(`${API_BASE_URL}/features`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch features: ${response.status} ${response.statusText} - ${errorText}`);
  }
  return response.json();
};

// GET /features?layer=toponimi (ambil data per layer - opsional)
export const fetchLayerData = async (layerName: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/features?layer=${encodeURIComponent(layerName)}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch features for layer ${layerName}: ${response.status} ${response.statusText} - ${errorText}`);
  }
  return response.json();
};

// --- FUNGSI UNTUK MENYIMPAN DATA ---

// POST /features (simpan data baru)
export const saveFeature = async (feature: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/features`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(feature),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to save feature: ${response.status} ${response.statusText} - ${errorText}`);
  }
  return response.json();
};

// ... fungsi lainnya (update, delete) bisa ditambahkan kemudian
