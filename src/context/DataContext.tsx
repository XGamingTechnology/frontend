// src/context/DataContext.tsx
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import type { FeatureCollection, Feature, LineString } from "geojson";

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
  layerDefinitions: LayerDefinition[] | null;
  layerVisibility: LayerVisibilityState;
  setLayerVisibility: (id: string, isVisible: boolean) => void;
  loadingLayers: boolean;
  errorLayers: string | null;
  refreshLayers: () => void;
  riverLine: Feature<LineString> | null; // ✅ Hanya baca
  echosounderData: EchosounderPoint[];
  layerGroups: any[] | null;
  loadingLayerGroups: boolean;
  errorLayerGroups: string | null;
  refreshLayerGroups: () => void;
  addFeature: (feature: Feature) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [features, setFeatures] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [layerDefinitions, setLayerDefinitions] = useState<LayerDefinition[] | null>(null);
  const [layerVisibility, setLayerVisibilityState] = useState<LayerVisibilityState>({});
  const [loadingLayers, setLoadingLayers] = useState(true);
  const [errorLayers, setErrorLayers] = useState<string | null>(null);
  const [echosounderData] = useState<EchosounderPoint[]>([]);
  const [layerGroups, setLayerGroups] = useState<any[] | null>(null);
  const [loadingLayerGroups, setLoadingLayerGroups] = useState(true);
  const [errorLayerGroups, setErrorLayerGroups] = useState<string | null>(null);
  const [riverLine, setRiverLine] = useState<Feature<LineString> | null>(null);

  // --- Ambil visibility dari localStorage ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("layerVisibility");
        if (saved) {
          setLayerVisibilityState(JSON.parse(saved));
        }
      } catch (error) {
        console.warn("Gagal baca layerVisibility:", error);
      }
    }
  }, []);

  // --- Simpan ke localStorage saat berubah ---
  useEffect(() => {
    if (typeof window !== "undefined" && Object.keys(layerVisibility).length > 0) {
      try {
        localStorage.setItem("layerVisibility", JSON.stringify(layerVisibility));
      } catch (error) {
        console.warn("Gagal simpan layerVisibility:", error);
      }
    }
  }, [layerVisibility]);

  // --- Load data pertama kali ---
  useEffect(() => {
    loadData();
    loadLayers();
  }, []);

  // --- Ambil semua spatial features ---
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `{spatialFeatures {id layerType name description geometry source meta createdAt}}`,
        }),
      });
      const result = await response.json();
      if (result.errors) throw new Error(result.errors.map((e: any) => e.message).join(", "));

      const geojson: FeatureCollection = {
        type: "FeatureCollection",
        features: result.data.spatialFeatures.map((f: any) => ({
          type: "Feature",
          id: f.id,
          properties: { ...f.meta, id: f.id, name: f.name, description: f.description, layerType: f.layerType, source: f.source, createdAt: f.createdAt },
          geometry: f.geometry,
        })),
      };
      setFeatures(geojson);
      updateRiverLineFromFeatures(geojson.features);
    } catch (err: any) {
      console.error("❌ Gagal ambil spatialFeatures:", err);
      setError(err.message || "Gagal memuat data dari server.");
    } finally {
      setLoading(false);
    }
  };

  // --- Ambil definisi layer ---
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
      if (result.errors) throw new Error(result.errors.map((e: any) => e.message).join(", "));

      const layers = result.data.layerDefinitions;

      const extendedLayers = [
        ...layers,
        { id: "valid_transect_line", name: "Valid Transect Line", description: "Transect yang valid setelah clipping", layerType: "valid_transect_line", source: "process_survey", meta: { color: "#ff0000", weight: 3 } },
        { id: "valid_sampling_point", name: "Sampling Point", description: "Titik sampling dengan kedalaman", layerType: "valid_sampling_point", source: "process_survey", meta: { fillColor: "#00ff00", radius: 6 } },
      ];

      setLayerDefinitions(extendedLayers);

      setLayerVisibilityState((prev) => {
        const updated = { ...prev };
        extendedLayers.forEach((layer) => {
          if (updated[layer.id] === undefined) updated[layer.id] = true;
        });
        return updated;
      });
    } catch (err: any) {
      console.error("❌ Gagal ambil layerDefinitions:", err);
      setErrorLayers(err.message);
    } finally {
      setLoadingLayers(false);
    }
  };

  // --- Update riverLine dari features ---
  const updateRiverLineFromFeatures = (features: Feature[]) => {
    const riverFeatures = features.filter((f) => f.properties?.layerType === "river_line");
    if (riverFeatures.length > 0) {
      const sorted = [...riverFeatures].sort((a, b) => new Date(b.properties?.createdAt).getTime() - new Date(a.properties?.createdAt).getTime());
      setRiverLine(sorted[0]); // Ambil yang terbaru
    } else {
      setRiverLine(null);
    }
  };

  // --- Ubah visibility layer ---
  const handleSetLayerVisibility = (id: string, isVisible: boolean) => {
    setLayerVisibilityState((prev) => ({ ...prev, [id]: isVisible }));
  };

  // --- Tambah feature baru ---
  const addFeature = async (feature: Feature) => {
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation CreateSpatialFeature($layerType: String!, $name: String, $description: String, $geometry: GeometryInput!, $source: String, $meta: MetadataInput) {
              createSpatialFeature(layerType: $layerType, name: $name, description: $description, geometry: $geometry, source: $source, meta: $meta) {
                id
                layerType
                name
                description
                geometry
              }
            }
          `,
          variables: {
            layerType: feature.properties?.layerType,
            name: feature.properties?.name,
            description: feature.properties?.description,
            geometry: feature.geometry,
            source: feature.properties?.source || "manual",
            meta: feature.properties,
          },
        }),
      });
      const result = await response.json();
      if (result.data?.createSpatialFeature) {
        refreshData(); // ✅ Refresh agar muncul di peta
      } else {
        throw new Error(result.errors?.[0]?.message || "Gagal menyimpan feature");
      }
    } catch (err: any) {
      console.error("❌ Gagal simpan feature:", err);
      throw new Error("Tidak dapat terhubung ke server.");
    }
  };

  // --- Refresh fungsi ---
  const refreshData = () => loadData();
  const refreshLayers = () => loadLayers();
  const refreshLayerGroups = () => {
    setLoadingLayerGroups(true);
    setTimeout(() => {
      setLayerGroups([]);
      setLoadingLayerGroups(false);
    }, 500);
  };

  return (
    <DataContext.Provider
      value={{
        features,
        loading,
        error,
        refreshData,
        layerDefinitions,
        layerVisibility,
        setLayerVisibility: handleSetLayerVisibility,
        loadingLayers,
        errorLayers,
        refreshLayers,
        riverLine, // ✅ Hanya baca
        echosounderData,
        layerGroups,
        loadingLayerGroups,
        errorLayerGroups,
        refreshLayerGroups,
        addFeature,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
}
