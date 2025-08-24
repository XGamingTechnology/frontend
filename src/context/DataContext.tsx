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
  deleteFeature: (id: number) => Promise<void>;
  updateFeature: (id: number, updates: Partial<Feature["properties"] & { geometry: any }>) => Promise<void>;
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
        headers: getAuthHeaders(),
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

      // ✅ PASTIKAN REFERENSI BARU
      setFeatures({ ...geojson });
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
        headers: getAuthHeaders(),
        body: JSON.stringify({
          query: `{ layerDefinitions { id name description layerType source meta } }`,
        }),
      });

      const result = await response.json();
      if (result.errors) throw new Error(result.errors.map((e: any) => e.message).join(", "));

      let layersFromDB: LayerDefinition[] = result.data.layerDefinitions || [];

      // ✅ Filter hanya layer yang dibutuhkan
      const requiredLayerTypes = ["toponimi_user", "valid_transect_line", "valid_sampling_point", "toponimi", "area_sungai", "batimetri"];

      layersFromDB = layersFromDB.filter((l) => requiredLayerTypes.includes(l.layerType));

      // ✅ Tambahkan definisi lengkap
      const fullLayerDefinitions: LayerDefinition[] = [
        {
          id: "toponimi_user",
          name: "Toponimi (Input User)",
          description: "Titik toponimi yang ditambahkan oleh user",
          layerType: "toponimi_user",
          source: "manual",
          meta: { fillColor: "#ef4444", color: "#ef4444", radius: 8, fillOpacity: 0.7 },
        },
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
          name: "Valid Sampling Point",
          description: "Titik sampling dengan kedalaman",
          layerType: "valid_sampling_point",
          source: "process_survey",
          meta: { fillColor: "#10b981", color: "#10b981", radius: 6, fillOpacity: 0.7 },
        },
        {
          id: "toponimi",
          name: "Toponimi (Existing)",
          description: "Rambu atau pelampung dari data existing",
          layerType: "toponimi",
          source: "shp_import",
          meta: {},
        },
        {
          id: "area_sungai",
          name: "Area Sungai",
          description: "Polygon area sungai",
          layerType: "area_sungai",
          source: "manual",
          meta: { fillColor: "#3b82f6", color: "#1d4ed8", fillOpacity: 0.3, weight: 2 },
        },
        {
          id: "batimetri",
          name: "Batimetri",
          description: "Garis kedalaman",
          layerType: "batimetri",
          source: "manual",
          meta: { color: "#059669", weight: 2, dashArray: "5,5" },
        },
      ];

      // ✅ Gabung dengan DB
      const merged = fullLayerDefinitions.map((def) => {
        const fromDB = layersFromDB.find((l) => l.id === def.id);
        return fromDB ? { ...def, ...fromDB } : def;
      });

      setLayerDefinitions([...merged]); // ✅ referensi baru

      // ✅ Set visibility default
      const defaultVisibility: LayerVisibilityState = {};
      merged.forEach((layer) => {
        defaultVisibility[layer.id] = true;
      });

      setLayerVisibilityState((prev) => ({
        ...defaultVisibility,
        ...prev,
      }));
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
        headers: getAuthHeaders(),
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
            meta: feature.properties?.meta || null,
          },
        }),
      });

      const result = await response.json();
      if (result.data?.createSpatialFeature) {
        await refreshData(); // ✅ refreshData sudah benar
      } else {
        throw new Error(result.errors?.[0]?.message || "Gagal menyimpan feature");
      }
    } catch (err: any) {
      console.error("❌ Gagal simpan feature:", err);
      throw new Error("Tidak dapat terhubung ke server.");
    }
  };

  // --- ✅ HAPUS FEATURE ---
  const deleteFeature = async (id: number) => {
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          query: `
            mutation DeleteSpatialFeature($id: ID!) {
              deleteSpatialFeature(id: $id) {
                success
                message
              }
            }
          `,
          variables: { id },
        }),
      });

      const result = await response.json();
      if (result.data?.deleteSpatialFeature.success) {
        await refreshData();
        alert(result.data.deleteSpatialFeature.message);
      } else {
        throw new Error(result.data?.deleteSpatialFeature.message || "Gagal hapus");
      }
    } catch (err: any) {
      console.error("❌ Gagal hapus feature:", err);
      alert(`❌ Gagal: ${err.message}`);
    }
  };

  // --- ✅ UPDATE FEATURE ---
  const updateFeature = async (id: number, updates: Partial<Feature["properties"] & { geometry: any }>) => {
    try {
      const { geometry, ...meta } = updates;
      const { name, description, source, ...restMeta } = meta;

      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          query: `
            mutation UpdateSpatialFeature($id: ID!, $name: String, $description: String, $geometry: GeometryInput, $source: String, $meta: MetadataInput) {
              updateSpatialFeature(id: $id, name: $name, description: $description, geometry: $geometry, source: $source, meta: $meta) {
                id
                name
                description
                meta
              }
            }
          `,
          variables: {
            id,
            name: name,
            description: description,
            source: source,
            geometry: geometry,
            meta: Object.keys(restMeta).length > 0 ? restMeta : undefined,
          },
        }),
      });

      const result = await response.json();
      if (result.data?.updateSpatialFeature) {
        await refreshData();
        alert("✅ Berhasil diperbarui");
      } else {
        throw new Error(result.errors?.[0]?.message || "Gagal update");
      }
    } catch (err: any) {
      console.error("❌ Gagal update feature:", err);
      alert(`❌ Gagal update: ${err.message}`);
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

  // --- ✅ EXPORT FUNCTION ---
  const exportFeatures = (options?: { layerType?: string; source?: string; format?: "geojson" | "csv"; filename?: string; filter?: (feature: Feature) => boolean }) => {
    const { layerType, source, format = "geojson", filename = "export", filter } = options || {};

    if (!features?.features) {
      alert("Belum ada data untuk diekspor.");
      return;
    }

    let filtered = [...features.features];

    if (layerType) filtered = filtered.filter((f) => f.properties?.layerType === layerType);
    if (source) filtered = filtered.filter((f) => f.properties?.source === source);
    if (filter) filtered = filtered.filter(filter);

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
      const headers = ["ID", "Nama", "Deskripsi", "Layer", "Latitude", "Longitude", "Kategori", "Sumber"];
      const rows = filtered.map((f) => {
        const props = f.properties || {};
        const [lng, lat] = f.geometry?.type === "Point" ? f.geometry.coordinates : ["-", "-"];
        return [f.id || "-", props.name || "-", props.description || "-", props.layerType || "-", lat?.toFixed(6) || "-", lng?.toFixed(6) || "-", props.category || props.meta?.category || "-", props.source || "-"];
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
        deleteFeature,
        updateFeature,
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
