// src/context/DataContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { fetchFeatures } from "@/lib/api/dataService";
import type { FeatureCollection, Feature, Point } from "geojson";
import { LayerDefinition, LayerVisibilityState } from "@/types/layers"; // 1. Impor types

// 2. Definisikan interface untuk tipe data echosounder
interface EchosounderPoint {
  jarak: number;
  kedalaman: number;
}

interface DataContextType {
  // --- STATE DATA GEOJSON DARI BACKEND ---
  features: FeatureCollection | null;
  loading: boolean;
  error: string | null;
  refreshData: () => void;
  addFeature: (feature: any) => Promise<void>;

  // --- STATE UNTUK MANAJEMEN LAYER ---
  layerDefinitions: LayerDefinition[] | null; // Daftar definisi layer dari backend
  layerVisibility: LayerVisibilityState; // State visibilitas layer
  setLayerVisibility: React.Dispatch<React.SetStateAction<LayerVisibilityState>>; // Fungsi untuk mengubah visibilitas
  loadingLayers: boolean; // State loading untuk layer
  errorLayers: string | null; // State error untuk layer
  refreshLayers: () => void; // Fungsi untuk merefresh daftar layer dari backend

  // --- STATE UNTUK DATA ECHOSOUNDER ---
  echosounderData: EchosounderPoint[];
  setEchosounderData: React.Dispatch<React.SetStateAction<EchosounderPoint[]>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- STATE DATA GEOJSON DARI BACKEND ---
  const [features, setFeatures] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFeatures(); // Panggil API backend
      setFeatures(data);
    } catch (err: any) {
      console.error("Failed to fetch features:", err);
      setError(err.message || "Gagal memuat data dari server.");
    } finally {
      setLoading(false);
    }
  };

  const addFeature = async (newFeature: any) => {
    // TODO: Implementasi panggilan API untuk menyimpan ke DB
    console.log("Simpan fitur baru ke backend:", newFeature); // Placeholder
  };

  // --- STATE UNTUK MANAJEMEN LAYER ---
  const [layerDefinitions, setLayerDefinitions] = useState<LayerDefinition[] | null>(null);
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibilityState>({});
  const [loadingLayers, setLoadingLayers] = useState(true);
  const [errorLayers, setErrorLayers] = useState<string | null>(null);

  // Fungsi untuk memuat layer dari backend (via dataService)
  const loadLayers = async () => {
    setLoadingLayers(true);
    setErrorLayers(null);
    try {
      // TODO: Ganti dengan pemanggilan API sebenarnya
      // Misal: const layers = await fetchLayerDefinitions();
      // Untuk sementara, gunakan data dummy
      const dummyLayers: LayerDefinition[] = [
        { id: "toponimi", name: "Toponimi", description: "Menampilkan nama tempat di sepanjang sungai" },
        { id: "sampling", name: "Sampling Points", description: "Menunjukkan titik-titik pengambilan sampel" },
        { id: "sungai", name: "Profil Sungai", description: "Menampilkan profil atau jalur sungai" },
        { id: "batimetri", name: "Bathymetri", description: "Visualisasi kedalaman sungai", color: "#9333ea" },
      ];
      setLayerDefinitions(dummyLayers);

      // Inisialisasi visibilitas, misalnya semua true
      const initialVisibility: LayerVisibilityState = {};
      dummyLayers.forEach((layer) => {
        initialVisibility[layer.id] = true; // Atau ambil dari preferensi pengguna/backend
      });
      setLayerVisibility(initialVisibility);
    } catch (err: any) {
      console.error("Failed to load layers:", err);
      setErrorLayers(err.message || "Gagal memuat daftar layer.");
    } finally {
      setLoadingLayers(false);
    }
  };

  // --- STATE UNTUK DATA ECHOSOUNDER ---
  const [echosounderData, setEchosounderData] = useState<EchosounderPoint[]>([]);

  useEffect(() => {
    loadData();
    loadLayers(); // Muat layer juga saat komponen mount
  }, []);

  return (
    <DataContext.Provider
      value={{
        // --- STATE DATA GEOJSON DARI BACKEND ---
        features,
        loading,
        error,
        refreshData: loadData,
        addFeature,

        // --- STATE UNTUK MANAJEMEN LAYER ---
        layerDefinitions,
        layerVisibility,
        setLayerVisibility,
        loadingLayers,
        errorLayers,
        refreshLayers: loadLayers,

        // --- STATE UNTUK DATA ECHOSOUNDER ---
        echosounderData,
        setEchosounderData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
