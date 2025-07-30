// src/context/DataContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { FeatureCollection, Feature, Point } from "geojson";

// --- Tipe Data ---
interface EchosounderPoint {
  jarak: number;
  kedalaman: number;
}

interface LayerDefinition {
  id: string;
  name: string;
  description: string;
  layerType: string;
  source: string;
  meta: Record<string, any>; // ✅ DIPERBAIKI: Tambahkan titik dua (:) di sini
}

type LayerVisibilityState = Record<string, boolean>;

interface DataContextType {
  // --- Data GeoJSON dari backend ---
  features: FeatureCollection | null;
  loading: boolean;
  error: string | null;
  refreshData: () => void;
  addFeature: (feature: Feature) => Promise<void>;

  // --- Manajemen Layer ---
  layerDefinitions: LayerDefinition[] | null;
  layerVisibility: LayerVisibilityState;
  setLayerVisibility: React.Dispatch<React.SetStateAction<LayerVisibilityState>>;
  loadingLayers: boolean;
  errorLayers: string | null;
  refreshLayers: () => void;

  // --- Data Echosounder ---
  echosounderData: EchosounderPoint[];
  setEchosounderData: React.Dispatch<React.SetStateAction<EchosounderPoint[]>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- STATE DATA GEOJSON (spatialFeatures) ---
  const [features, setFeatures] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `{ spatialFeatures { id layerType name description geometry source metadata } }`,
        }),
      });

      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors.map((e: any) => e.message).join(", "));
      }

      const geojson: FeatureCollection = {
        type: "FeatureCollection",
        features: result.data.spatialFeatures.map((f: any) => ({
          type: "Feature",
          id: f.id,
          properties: {
            id: f.id,
            name: f.name,
            description: f.description,
            layerType: f.layerType,
            source: f.source,
            ...f.metadata,
          },
          geometry: f.geometry,
        })),
      };
      setFeatures(geojson);
    } catch (err: any) {
      console.error("Gagal ambil spatialFeatures:", err);
      setError(err.message || "Gagal memuat data dari server.");
    } finally {
      setLoading(false);
    }
  };

  const addFeature = async (newFeature: Feature) => {
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation CreateSpatialFeature(
              $layerType: String!
              $name: String
              $description: String
              $geometry: GeometryInput!
              $source: String
              $meta: MetadataInput
            ) {
              createSpatialFeature(
                layerType: $layerType
                name: $name
                description: $description
                geometry: $geometry
                source: $source
                metadata: $meta
              ) {
                id
                layerType
                name
                description
                geometry
              }
            }
          `,
          variables: {
            layerType: newFeature.properties?.layerType || "custom",
            name: newFeature.properties?.name || "Unnamed",
            description: newFeature.properties?.description || "",
            geometry: newFeature.geometry,
            source: newFeature.properties?.source || "user_input",
            meta: newFeature.properties?.meta || null,
          },
        }),
      });

      const result = await response.json();
      if (result.data?.createSpatialFeature) {
        loadData(); // Refresh data
      } else {
        throw new Error(result.data?.createSpatialFeature?.message || "Gagal simpan");
      }
    } catch (err: any) {
      console.error("Gagal simpan feature:", err);
      alert("Gagal menyimpan ke server: " + err.message);
    }
  };

  // --- MANAJEMEN LAYER ---
  const [layerDefinitions, setLayerDefinitions] = useState<LayerDefinition[] | null>(null);
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibilityState>({});
  const [loadingLayers, setLoadingLayers] = useState(true);
  const [errorLayers, setErrorLayers] = useState<string | null>(null);

  const loadLayers = async () => {
    setLoadingLayers(true);
    setErrorLayers(null);
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `{ layerDefinitions { id name description layerType source meta } }`,
        }),
      });

      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors.map((e: any) => e.message).join(", "));
      }

      const layers = result.data.layerDefinitions;
      setLayerDefinitions(layers);

      // Baca dari localStorage jika ada
      let savedVisibility;
      try {
        const saved = localStorage.getItem("layerVisibility");
        if (saved) savedVisibility = JSON.parse(saved);
      } catch (e) {
        console.warn("Gagal baca layerVisibility dari localStorage");
      }

      const initialVisibility = layers.reduce((acc: LayerVisibilityState, layer: LayerDefinition) => {
        acc[layer.id] = savedVisibility?.[layer.id] ?? false;
        return acc;
      }, {});

      setLayerVisibility(initialVisibility);
    } catch (err: any) {
      console.error("Gagal ambil layerDefinitions:", err);
      setErrorLayers(err.message || "Gagal memuat daftar layer.");
    } finally {
      setLoadingLayers(false);
    }
  };

  // --- DATA ECHOSOUNDER ---
  const [echosounderData, setEchosounderData] = useState<EchosounderPoint[]>([]);

  // --- Auto-load saat mount ---
  useEffect(() => {
    loadData();
    loadLayers();
  }, []);

  // --- Simpan layerVisibility ke localStorage saat berubah ---
  useEffect(() => {
    if (Object.keys(layerVisibility).length > 0) {
      try {
        localStorage.setItem("layerVisibility", JSON.stringify(layerVisibility));
      } catch (err) {
        console.warn("Gagal simpan layerVisibility ke localStorage", err);
      }
    }
  }, [layerVisibility]);

  return (
    <DataContext.Provider
      value={{
        // --- Data GeoJSON ---
        features,
        loading,
        error,
        refreshData: loadData,
        addFeature,

        // --- Layer Management ---
        layerDefinitions,
        layerVisibility,
        setLayerVisibility,
        loadingLayers,
        errorLayers,
        refreshLayers: loadLayers,

        // --- Echosounder ---
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
