// src/context/DataContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from "react";
import type { FeatureCollection, Feature, LineString } from "geojson";

// === Tipe Data ===
export interface EchosounderPoint {
  jarak: number;
  kedalaman: number;
}

// 🔼 Tipe 3D
export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Survey3DData {
  surveyId: string;
  points: Point3D[];
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

// === Tipe Context ===
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
  setEchosounderData: Dispatch<SetStateAction<EchosounderPoint[]>>;

  layerGroups: any[] | null;
  loadingLayerGroups: boolean;
  errorLayerGroups: string | null;
  refreshLayerGroups: () => void;

  addFeature: (feature: Feature) => Promise<void>;
  deleteFeature: (id: number) => Promise<void>;
  updateFeature: (id: number, updates: Partial<Feature["properties"] & { geometry: any }>) => Promise<void>;
  exportFeatures: (options?: { layerType?: string; source?: string; format?: "geojson" | "csv"; filename?: string; filter?: (feature: Feature) => boolean }) => void;

  dataVersion: number;
  surveyListVersion: number;
  refreshSurveyList: () => void;

  // 🔼 3D Data
  current3DData: Survey3DData | null;
  setCurrent3DData: Dispatch<SetStateAction<Survey3DData | null>>;
  fetchSurvey3DData: (surveyId: string) => Promise<void>;
}

// === Buat Context ===
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

// === Provider ===
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [features, setFeatures] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [layerDefinitions, setLayerDefinitions] = useState<LayerDefinition[] | null>(null);
  const [layerVisibility, setLayerVisibilityState] = useState<LayerVisibilityState>({});
  const [loadingLayers, setLoadingLayers] = useState(true);
  const [errorLayers, setErrorLayers] = useState<string | null>(null);

  const [echosounderData, setEchosounderData] = useState<EchosounderPoint[]>([]);
  const [layerGroups, setLayerGroups] = useState<any[] | null>(null);
  const [loadingLayerGroups, setLoadingLayerGroups] = useState(true);
  const [errorLayerGroups, setErrorLayerGroups] = useState<string | null>(null);
  const [riverLine, setRiverLine] = useState<Feature<LineString> | null>(null);

  // ✅ Penanda perubahan data
  const [dataVersion, setDataVersion] = useState(0);
  const [surveyListVersion, setSurveyListVersion] = useState(0);

  // 🔼 State 3D
  const [current3DData, setCurrent3DData] = useState<Survey3DData | null>(null);

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

  // --- Sinkronisasi echosounderData ke localStorage ---
  useEffect(() => {
    if (Array.isArray(echosounderData)) {
      try {
        localStorage.setItem("echosounderData", JSON.stringify(echosounderData));
      } catch (err) {
        console.warn("Gagal simpan echosounderData ke localStorage:", err);
      }
    }
  }, [echosounderData]);

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

      const requiredLayerTypes = ["toponimi_user", "valid_transect_line", "valid_sampling_point", "toponimi", "area_sungai", "batimetri"];

      layersFromDB = layersFromDB.filter((l) => requiredLayerTypes.includes(l.layerType));

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

      const merged = fullLayerDefinitions.map((def) => {
        const fromDB = layersFromDB.find((l) => l.id === def.id);
        return fromDB ? { ...def, ...fromDB } : def;
      });

      setLayerDefinitions([...merged]);

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
        await refreshData();
      } else {
        throw new Error(result.errors?.[0]?.message || "Gagal menyimpan feature");
      }
    } catch (err: any) {
      console.error("❌ Gagal simpan feature:", err);
      throw new Error("Tidak dapat terhubung ke server.");
    }
  };

  // --- HAPUS FEATURE ---
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

  // --- UPDATE FEATURE ---
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
  const refreshData = () => {
    loadData();
    setDataVersion((v) => v + 1);
  };

  const refreshSurveyList = () => {
    setSurveyListVersion((v) => v + 1);
  };

  const refreshLayers = () => loadLayers();
  const refreshLayerGroups = () => {
    setLoadingLayerGroups(true);
    setTimeout(() => {
      setLayerGroups([]);
      setLoadingLayerGroups(false);
    }, 500);
  };

  // --- EXPORT FUNCTION ---
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
        const coords = f.geometry?.type === "Point" ? f.geometry.coordinates : [null, null];
        const lat = typeof coords[1] === "number" ? coords[1].toFixed(6) : "-";
        const lng = typeof coords[0] === "number" ? coords[0].toFixed(6) : "-";
        return [f.id || "-", props.name || "-", props.description || "-", props.layerType || "-", lat, lng, props.category || props.meta?.category || "-", props.source || "-"];
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

  // 🔥 AMBIL DATA 3D — SUDAH DIPERBAIKI
  const fetchSurvey3DData = async (surveyId: string) => {
    console.log("🔧 fetchSurvey3DData dipanggil untuk:", surveyId);

    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          query: `
            query SamplingPointsBySurveyId($surveyId: String!) {
              samplingPointsBySurveyId(surveyId: $surveyId) {
                id
                geometry
                meta
              }
            }
          `,
          variables: { surveyId },
        }),
      });

      const result = await response.json();
      if (result.errors) throw new Error(result.errors.map((e: any) => e.message).join(", "));

      const points = result.data.samplingPointsBySurveyId;

      if (!points || points.length === 0) {
        setCurrent3DData(null);
        console.log("❌ Tidak ada titik untuk survey:", surveyId);
        return;
      }

      console.log("📊 [fetchSurvey3DData] Raw points:", points);

      const processedPoints: Point3D[] = points
        .map((p: any) => {
          const meta = p.meta || {};
          const x = parseFloat(meta.distance_m);
          const y = parseFloat(meta.offset_m);
          const z = -Math.abs(parseFloat(meta.kedalaman ?? meta.depth_value ?? 0)); // negatif = bawah

          if (isNaN(x) || isNaN(y) || isNaN(z)) {
            console.warn("⚠️ Titik tidak valid (NaN):", p);
            return null;
          }

          return { x, y, z };
        })
        .filter((p): p is Point3D => p !== null); // Pastikan tipe aman

      if (processedPoints.length === 0) {
        console.error("❌ Semua titik tidak valid setelah proses");
        setCurrent3DData(null);
        return;
      }

      // Urutkan agar grid rapi
      processedPoints.sort((a, b) => a.x - b.x || a.y - b.y);

      setCurrent3DData({
        surveyId,
        points: processedPoints,
      });

      console.log("✅ current3DData diset:", { surveyId, pointCount: processedPoints.length });
    } catch (err: any) {
      console.error("❌ Gagal ambil data 3D:", err);
      setCurrent3DData(null);
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
        setEchosounderData,
        layerGroups,
        loadingLayerGroups,
        errorLayerGroups,
        refreshLayerGroups,
        addFeature,
        deleteFeature,
        updateFeature,
        exportFeatures,
        dataVersion,
        surveyListVersion,
        refreshSurveyList,
        current3DData,
        setCurrent3DData,
        fetchSurvey3DData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// === Hook: useData() ===
export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
}
