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
  riverLine: Feature<LineString> | null;
  echosounderData: EchosounderPoint[];
  layerGroups: any[] | null;
  loadingLayerGroups: boolean;
  errorLayerGroups: string | null;
  refreshLayerGroups: () => void;
  addFeature: (feature: Feature) => Promise<void>;
  exportFeatures: (options?: { layerType?: string; source?: string; format?: "geojson" | "csv"; filename?: string; filter?: (feature: Feature) => boolean }) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// --- Helper: Ambil token dari localStorage ---
const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

// --- Helper: Tambah header otentikasi ---
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

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

  // --- Load visibility dari localStorage ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("layerVisibility");
        if (saved) {
          setLayerVisibilityState(JSON.parse(saved));
        }
      } catch (err) {
        console.warn("Gagal baca layerVisibility:", err);
      }
    }
  }, []);

  // --- Simpan visibility ke localStorage ---
  useEffect(() => {
    if (typeof window !== "undefined" && Object.keys(layerVisibility).length > 0) {
      try {
        localStorage.setItem("layerVisibility", JSON.stringify(layerVisibility));
      } catch (err) {
        console.warn("Gagal simpan layerVisibility:", err);
      }
    }
  }, [layerVisibility]);

  // --- Load semua data ---
  useEffect(() => {
    loadData();
    loadLayers();
    loadLayerGroups();
  }, []);

  // --- 1. Load Spatial Features ---
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: getAuthHeaders(), // ✅ Kirim Authorization header
        body: JSON.stringify({
          query: `
            {
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
            }
          `,
        }),
      });

      const result = await response.json();

      // ✅ Cek error dari GraphQL
      if (result.errors) {
        const errorMsg = result.errors.map((e: any) => e.message).join(", ");
        throw new Error(errorMsg);
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
      updateRiverLineFromFeatures(geojson.features);
    } catch (err: any) {
      console.error("❌ Gagal ambil spatialFeatures:", err);
      setError(err.message || "Gagal memuat data dari server.");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Load Layer Definitions ---
  const loadLayers = async () => {
    setLoadingLayers(true);
    setErrorLayers(null);
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: getAuthHeaders(), // ✅
        body: JSON.stringify({
          query: `{ layerDefinitions { id name description layerType source meta } }`,
        }),
      });

      const result = await response.json();
      if (result.errors) throw new Error(result.errors.map((e: any) => e.message).join(", "));

      const layers = result.data.layerDefinitions;

      // Tambah layer proses otomatis
      const extendedLayers: LayerDefinition[] = [
        ...layers,
        {
          id: "valid_transect_line",
          name: "Valid Transect Line",
          description: "Transect yang valid setelah clipping",
          layerType: "valid_transect_line",
          source: "process_survey",
          meta: { color: "#ff0000", weight: 3 },
        },
        {
          id: "valid_sampling_point",
          name: "Sampling Point",
          description: "Titik sampling dengan kedalaman",
          layerType: "valid_sampling_point",
          source: "process_survey",
          meta: { fillColor: "#00ff00", radius: 6, fillOpacity: 0.7 },
        },
      ];

      setLayerDefinitions(extendedLayers);

      // Inisialisasi visibility
      setLayerVisibilityState((prev) => {
        const updated = { ...prev };
        extendedLayers.forEach((layer) => {
          if (updated[layer.id] === undefined) {
            updated[layer.id] = true;
          }
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

  // --- 3. Load Layer Groups (dummy) ---
  const loadLayerGroups = () => {
    setLoadingLayerGroups(true);
    setTimeout(() => {
      setLayerGroups([]);
      setLoadingLayerGroups(false);
    }, 500);
  };

  // --- Update riverLine dari features ---
  const updateRiverLineFromFeatures = (features: Feature[]) => {
    const riverFeatures = features.filter((f) => f.properties?.layerType === "river_line");
    if (riverFeatures.length > 0) {
      const sorted = riverFeatures.sort((a, b) => new Date(b.properties?.createdAt).getTime() - new Date(a.properties?.createdAt).getTime());
      setRiverLine(sorted[0] as Feature<LineString>);
    } else {
      setRiverLine(null);
    }
  };

  // --- Set visibility ---
  const handleSetLayerVisibility = (id: string, isVisible: boolean) => {
    setLayerVisibilityState((prev) => ({ ...prev, [id]: isVisible }));
  };

  // --- Tambah feature baru ---
  const addFeature = async (feature: Feature) => {
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: getAuthHeaders(), // ✅
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
        await refreshData();
      } else {
        throw new Error(result.errors?.[0]?.message || "Gagal menyimpan feature");
      }
    } catch (err: any) {
      console.error("❌ Gagal simpan feature:", err);
      throw new Error("Tidak dapat terhubung ke server.");
    }
  };

  // --- Refresh functions ---
  const refreshData = () => loadData();
  const refreshLayers = () => loadLayers();
  const refreshLayerGroups = () => {
    setLoadingLayerGroups(true);
    setTimeout(() => {
      setLayerGroups([]);
      setLoadingLayerGroups(false);
    }, 500);
  };

  // --- ✅ EXPORT FUNCTION (TETAP ADA UNTUK KOMPATIBILITAS) ---
  const exportFeatures = (options?: { layerType?: string; source?: string; format?: "geojson" | "csv"; filename?: string; filter?: (feature: Feature) => boolean }) => {
    const { layerType, source, format = "geojson", filename = "export", filter } = options || {};

    if (!features?.features) {
      alert("Belum ada data untuk diekspor.");
      return;
    }

    let filtered = [...features.features];

    if (layerType) {
      filtered = filtered.filter((f) => f.properties?.layerType === layerType);
    }
    if (source) {
      filtered = filtered.filter((f) => f.properties?.source === source);
    }
    if (filter) {
      filtered = filtered.filter(filter);
    }

    if (filtered.length === 0) {
      alert("Tidak ada data yang sesuai kriteria.");
      return;
    }

    if (format === "geojson") {
      const geojson = { type: "FeatureCollection", features: filtered };
      const jsonStr = JSON.stringify(geojson, null, 2);
      downloadFile(jsonStr, `${filename}.geojson`, "application/json");
    }

    if (format === "csv") {
      const headers = ["ID", "Transect ID", "Survey ID", "Latitude", "Longitude", "Kedalaman (m)", "Jarak", "Draft ID"];
      const rows = filtered.map((f) => {
        const props = f.properties || {};
        const [lng, lat] = f.geometry?.type === "Point" ? f.geometry.coordinates : ["-", "-"];
        return [
          f.id || "-",
          props.transect_id || "-",
          props.survey_id?.slice(-8) || "-",
          lat?.toFixed(6) || "-",
          lng?.toFixed(6) || "-",
          (props.kedalaman ?? props.depth_value ?? "-").toString(),
          (props.distance_m || "-").toString(),
          props.river_line_draft_id || "-",
        ];
      });
      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      downloadFile(csv, `${filename}.csv`, "text/csv");
    }
  };

  // --- Helper: Download file ---
  const downloadFile = (data: string, filename: string, mime: string) => {
    try {
      const blob = new Blob([data], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal download file:", err);
      alert("Gagal mengekspor file.");
    }
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
        riverLine,
        echosounderData,
        layerGroups,
        loadingLayerGroups,
        errorLayerGroups,
        refreshLayerGroups,
        addFeature,
        exportFeatures,
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
