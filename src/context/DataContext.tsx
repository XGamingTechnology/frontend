// src/context/DataContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction, useMemo } from "react"; // ✅ Tambahkan useMemo
import type { FeatureCollection, Feature, LineString, Geometry } from "geojson";

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

// ✅ Tambahkan User interface
export interface User {
  id: number;
  role: string;
  email: string;
  // tambahkan field lain jika perlu
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

  // ✅ User — Tambahkan ini
  user: User | null;
}

// === Buat Context ===
const DataContext = createContext<DataContextType | undefined>(undefined);

// --- Helper: Ambil token dari localStorage ---
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("authToken");
  } catch (err) {
    console.warn("Gagal baca authToken dari localStorage:", err);
    return null;
  }
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

  // ✅ State user — PERBAIKAN UTAMA: Inisialisasi dari localStorage
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (err) {
      console.warn("Gagal parse user dari localStorage:", err);
    }
    return null;
  });

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
    if (typeof window !== "undefined" && Array.isArray(echosounderData)) {
      try {
        localStorage.setItem("echosounderData", JSON.stringify(echosounderData));
      } catch (err) {
        console.warn("Gagal simpan echosounderData ke localStorage:", err);
      }
    }
  }, [echosounderData]);

  // ✅ Sinkronisasi user ke localStorage — PERBAIKAN UTAMA
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        try {
          localStorage.setItem("user", JSON.stringify(user));
        } catch (err) {
          console.warn("Gagal simpan user ke localStorage:", err);
        }
      } else {
        localStorage.removeItem("user");
      }
    }
  }, [user]);

  // ✅ Load user dari token (fallback jika localStorage kosong) — PERBAIKAN UTAMA
  useEffect(() => {
    const loadUserFromToken = () => {
      if (user) return; // Jangan timpa jika sudah ada dari localStorage

      const token = getAuthToken();
      if (token) {
        try {
          // Decode JWT token
          const payload = JSON.parse(atob(token.split(".")[1]));
          const newUser = {
            id: payload.userId, // ✅ Pastikan sesuai dengan payload JWT Anda
            role: payload.role,
            email: payload.email,
          };
          setUser(newUser);
        } catch (err) {
          console.warn("Gagal decode token:", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUserFromToken();
  }, []);

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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (result.errors) {
        const errorMsg = result.errors.map((e: any) => e.message).join(", ");
        throw new Error(errorMsg);
      }

      const newFeatures: FeatureCollection = {
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

      // ✅ PERBAIKAN UTAMA: Hanya update jika data benar-benar berubah
      if (JSON.stringify(newFeatures) !== JSON.stringify(features)) {
        setFeatures(newFeatures);
        updateRiverLineFromFeatures(newFeatures.features);
      }
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      if (result.errors) throw new Error(result.errors.map((e: any) => e.message).join(", "));

      const layersFromDB: LayerDefinition[] = result.data.layerDefinitions || [];

      // ✅ Daftar layer yang BOLEH muncul di UI — termasuk hasil generate batimetri
      const allowedLayerTypes = [
        "toponimi",
        "batimetri",
        "area_sungai",
        "valid_transect_line",
        "valid_sampling_point",
        "toponimi_user",
        "echosounder_point",
        "kontur_batimetri", // ✅ Tambahkan
        "permukaan_batimetri", // ✅ Tambahkan
      ];

      // ✅ Filter hanya layer yang diizinkan
      const filteredLayers = layersFromDB.filter((layer) => allowedLayerTypes.includes(layer.layerType));

      // ✅ Urutkan sesuai keinginan kamu — tambahkan layer batimetri hasil generate
      const orderedLayers = [
        { layerType: "toponimi", name: "Toponimi" },
        { layerType: "area_sungai", name: "Area Sungai" },
        { layerType: "valid_transect_line", name: "Valid Transek" },
        { layerType: "valid_sampling_point", name: "Valid Sampling Point" },
        { layerType: "kontur_batimetri", name: "Kontur Batimetri", meta: { color: "#0284c7", weight: 2 } }, // ✅ Tambahkan + styling
        { layerType: "permukaan_batimetri", name: "Permukaan Batimetri", meta: { fillColor: "#0284c7", fillOpacity: 0.3, color: "#0284c7", weight: 1 } }, // ✅ Tambahkan + styling
        { layerType: "batimetri", name: "Batimetri" },
        { layerType: "toponimi_user", name: "Toponimi (Input User)" },
        { layerType: "echosounder_point", name: "Echosounder Point" },
      ].map((config) => {
        // Ambil dari DB, jika ada
        const fromDB = filteredLayers.find((l) => l.layerType === config.layerType);
        return {
          id: fromDB?.id || config.layerType,
          name: fromDB?.name || config.name,
          description: fromDB?.description || "",
          layerType: config.layerType,
          source: fromDB?.source || "",
          meta: fromDB?.meta || config.meta || {}, // ✅ Gunakan config.meta jika tidak ada di DB
        };
      });

      setLayerDefinitions(orderedLayers);

      // ✅ Set visibility: semua default true
      const defaultVisibility: LayerVisibilityState = {};
      orderedLayers.forEach((layer) => {
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

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
    console.log("🔄 [DataContext] refreshData dipanggil — memicu loadData()");
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

  // 🔥 AMBIL DATA 3D — UNIVERSAL: Untuk LAPANGAN & SIMULASI
  const fetchSurvey3DData = async (surveyId: string) => {
    console.log("🔧 fetchSurvey3DData dipanggil untuk:", surveyId);

    try {
      // ✅ 1. Cek dulu apakah data dari "lapangan" atau "simulasi"
      const checkQuery = `
      query CheckSurveySource($surveyId: String!) {
        spatialFeatures(
          layerType: "valid_sampling_point"
          source: $surveyId
        ) {
          meta
        }
      }
    `;

      const checkResponse = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          query: checkQuery,
          variables: { surveyId },
        }),
      });

      const checkResult = await checkResponse.json();
      const pointsCheck = checkResult.data?.spatialFeatures || [];

      // ✅ Tentukan apakah data lapangan (import) atau simulasi
      const isFieldData = pointsCheck.some((p: any) => p.meta?.source === "import" || p.meta?.sequence !== undefined);

      let points: any[] = [];

      if (isFieldData) {
        // 🟢 Data Lapangan: pakai fieldSurveyPointsBySurveyId
        console.log("🔍 [3D] Data lapangan terdeteksi");
        const fieldQuery = `
        query GetFieldPoints($surveyId: String!) {
          fieldSurveyPointsBySurveyId(surveyId: $surveyId) {
            meta
          }
        }
      `;

        const res = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            query: fieldQuery,
            variables: { surveyId },
          }),
        });

        const result = await res.json();
        if (result.errors) throw new Error(result.errors[0]?.message || "Gagal ambil data lapangan");
        points = result.data?.fieldSurveyPointsBySurveyId || [];
      } else {
        // 🔵 Data Simulasi: pakai samplingPointsBySurveyId (lebih akurat)
        console.log("🔍 [3D] Data simulasi terdeteksi");
        const simQuery = `
        query GetSamplingPoints($surveyId: String!) {
          samplingPointsBySurveyId(surveyId: $surveyId) {
            meta
          }
        }
      `;

        const res = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            query: simQuery,
            variables: { surveyId },
          }),
        });

        const result = await res.json();
        if (result.errors) throw new Error(result.errors[0]?.message || "Gagal ambil data simulasi");
        points = result.data?.samplingPointsBySurveyId || [];
      }

      if (points.length === 0) {
        console.log("❌ Tidak ada titik ditemukan untuk surveyId:", surveyId);
        setCurrent3DData(null);
        return;
      }

      console.log("📊 [fetchSurvey3DData] Titik diterima:", points);

      // ✅ Proses semua titik ke format 3D
      const processedPoints: Point3D[] = points
        .map((p: any) => {
          const meta = p.meta || {};

          // Prioritas jarak: distance_from_start > distance_m > jarak
          const xRaw = meta.distance_from_start ?? meta.distance_m ?? meta.jarak ?? meta.distance ?? 0;
          const x = parseFloat(xRaw);

          // Prioritas offset: offset_m > offset
          const yRaw = meta.offset_m ?? meta.offset ?? 0;
          const y = parseFloat(yRaw);

          // Prioritas kedalaman: depth_value > kedalaman > depth
          const zRaw = meta.depth_value ?? meta.kedalaman ?? meta.depth ?? 0;
          const z = -Math.abs(parseFloat(zRaw)); // negatif = lebih dalam

          if (isNaN(x) || isNaN(y) || isNaN(z)) {
            console.warn("⚠️ Titik tidak valid (NaN):", { x, y, z, meta });
            return null;
          }

          return { x, y, z };
        })
        .filter((p): p is Point3D => p !== null);

      console.log("✅ Titik valid setelah proses:", processedPoints);

      if (processedPoints.length === 0) {
        console.error("❌ Semua titik tidak valid setelah proses");
        setCurrent3DData(null);
        return;
      }

      // ✅ Urutkan agar interpolasi halus
      processedPoints.sort((a, b) => a.x - b.x || a.y - b.y);

      const result: Survey3DData = {
        surveyId,
        points: processedPoints,
      };

      setCurrent3DData(result);
      console.log("✅ current3DData berhasil diset:", result);
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
        user, // ✅ Tambahkan ini
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
