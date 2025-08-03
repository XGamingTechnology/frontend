// src/context/DataContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { FeatureCollection, Feature, Point, LineString } from "geojson";

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
  meta: Record<string, any>;
}

type LayerVisibilityState = Record<string, boolean>;

interface DataContextType {
  features: FeatureCollection | null;
  loading: boolean;
  error: string | null;
  refreshData: () => void;
  addFeature: (feature: Feature) => Promise<void>;

  layerDefinitions: LayerDefinition[] | null;
  layerVisibility: LayerVisibilityState;
  setLayerVisibility: React.Dispatch<React.SetStateAction<LayerVisibilityState>>;
  loadingLayers: boolean;
  errorLayers: string | null;
  refreshLayers: () => void;

  echosounderData: EchosounderPoint[];
  setEchosounderData: React.Dispatch<React.SetStateAction<EchosounderPoint[]>>;

  // 🆕 Tambahkan riverLine
  riverLine: Feature<LineString> | null;
  setRiverLine: React.Dispatch<React.SetStateAction<Feature<LineString> | null>>;

  // Placeholder untuk layerGroups jika digunakan
  layerGroups: any[] | null;
  loadingLayerGroups: boolean;
  errorLayerGroups: string | null;
  refreshLayerGroups: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [features, setFeatures] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [riverLine, setRiverLine] = useState<Feature<LineString> | null>(null);

  // --- Ambil semua spatial features ---
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `{ 
            spatialFeatures { 
              id 
              layerType 
              name 
              description 
              geometry 
              source 
              meta
              createdAt 
            } 
          }`,
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
            createdAt: f.createdAt,
            ...f.meta,
          },
          geometry: f.geometry,
        })),
      };
      setFeatures(geojson);

      // 🆕 Update riverLine dari data terbaru
      updateRiverLineFromFeatures(geojson.features);
    } catch (err: any) {
      console.error("Gagal ambil spatialFeatures:", err);
      setError(err.message || "Gagal memuat data dari server.");
    } finally {
      setLoading(false);
    }
  };

  // --- Fungsi terpisah untuk update riverLine ---
  const updateRiverLineFromFeatures = (features: Feature[]) => {
    const riverFeatures = features.filter((f) => f.properties?.layerType === "river_line");

    if (riverFeatures.length === 0) {
      setRiverLine(null);
      return;
    }

    // Urutkan berdasarkan createdAt terbaru
    const latest = riverFeatures.sort((a, b) => {
      const aTime = new Date(a.properties?.createdAt || "").getTime();
      const bTime = new Date(b.properties?.createdAt || "").getTime();
      return bTime - aTime;
    })[0];

    setRiverLine(latest);
  };

  // --- Simpan feature baru ---
  const addFeature = async (newFeature: Feature) => {
    try {
      // 🔥 Debug: Cek apa yang dikirim
      console.log("📤 Mengirim ke server:", {
        layerType: newFeature.properties?.layerType,
        name: newFeature.properties?.name,
        geometry: newFeature.geometry,
        source: newFeature.properties?.source,
      });

      // ✅ Validasi geometry
      if (!newFeature.geometry || !newFeature.geometry.type || !newFeature.geometry.coordinates) {
        console.warn("❌ Geometry tidak valid:", newFeature);
        throw new Error("Geometry tidak valid");
      }

      // ✅ Pastikan geometry adalah GeoJSON object
      const geometryInput = {
        type: newFeature.geometry.type,
        coordinates: newFeature.geometry.coordinates,
      };

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
                meta: $meta
              ) {
                id
                layerType
                name
                description
                geometry
                createdAt
              }
            }
          `,
          variables: {
            layerType: newFeature.properties?.layerType || "custom",
            name: newFeature.properties?.name || "Unnamed",
            description: newFeature.properties?.description || "",
            geometry: geometryInput, // ✅ Kirim sebagai GeoJSON object
            source: newFeature.properties?.source || "manual",
            meta: newFeature.properties?.meta || null,
          },
        }),
      });

      const result = await response.json();
      console.log("📡 GraphQL Response:", result);

      if (result.errors) {
        console.error("❌ GraphQL Errors:", result.errors);
        throw new Error(result.errors.map((e: any) => e.message).join(", "));
      }

      if (result.data?.createSpatialFeature?.id) {
        console.log("✅ Berhasil simpan:", result.data.createSpatialFeature);

        // ✅ Buat feature baru dengan id dan createdAt
        const featureWithId: Feature = {
          ...newFeature,
          properties: {
            ...newFeature.properties,
            id: result.data.createSpatialFeature.id,
            createdAt: result.data.createSpatialFeature.createdAt,
          },
        };

        // ✅ Tambahkan ke features tanpa reload
        setFeatures((prev) =>
          prev
            ? {
                type: "FeatureCollection",
                features: [...prev.features, featureWithId],
              }
            : { type: "FeatureCollection", features: [featureWithId] }
        );

        // ✅ Update riverLine jika perlu
        if (newFeature.properties?.layerType === "river_line") {
          setRiverLine(featureWithId as Feature<LineString>);
        } else {
          updateRiverLineFromFeatures(features?.features ? [...features.features, featureWithId] : [featureWithId]);
        }
      } else {
        const backendMsg = result.data?.createSpatialFeature?.message;
        throw new Error(backendMsg || "Gagal simpan: id tidak dikembalikan");
      }
    } catch (err: any) {
      console.error("Gagal simpan feature:", err);
      alert("Gagal menyimpan ke server: " + err.message);
    }
  };

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

      let savedVisibility: LayerVisibilityState | undefined;
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

  const [echosounderData, setEchosounderData] = useState<EchosounderPoint[]>([]);

  const [layerGroups, setLayerGroups] = useState<any[] | null>(null);
  const [loadingLayerGroups, setLoadingLayerGroups] = useState(true);
  const [errorLayerGroups, setErrorLayerGroups] = useState<string | null>(null);

  const refreshLayerGroups = async () => {};

  // --- Load data pertama kali ---
  useEffect(() => {
    loadData();
    loadLayers();
  }, []);

  // --- Simpan layerVisibility ke localStorage ---
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
        features,
        loading,
        error,
        refreshData: loadData,
        addFeature,
        layerDefinitions,
        layerVisibility,
        setLayerVisibility,
        loadingLayers,
        errorLayers,
        refreshLayers: loadLayers,
        echosounderData,
        setEchosounderData,
        riverLine,
        setRiverLine,
        layerGroups,
        loadingLayerGroups,
        errorLayerGroups,
        refreshLayerGroups,
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
