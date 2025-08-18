"use client";

import { useEffect, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { Box, IconButton, Tooltip, CircularProgress } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { useData } from "@/context/DataContext";
import { Feature } from "geojson";

// --- Utility: Flatten feature ---
function flattenFeature(feature: Feature, layerName: string) {
  const { properties = {}, geometry } = feature;
  return {
    layer: layerName,
    geomType: geometry?.type || "Unknown",
    ...properties,
  };
}

// --- GraphQL Fetch Function ---
async function fetchFreshAttributes(visibleLayerTypes: string[]): Promise<Feature[]> {
  try {
    const response = await fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query GetFeaturesByLayerTypes($layerTypes: [String!]!) {
            featuresByLayerTypes(layerTypes: $layerTypes) {
              type
              geometry
              properties
            }
          }
        `,
        variables: { layerTypes: visibleLayerTypes },
      }),
    });

    const result = await response.json();
    return result.data?.featuresByLayerTypes || [];
  } catch (error) {
    console.error("❌ Gagal fetch dari server:", error);
    return [];
  }
}

export default function AttributeTable() {
  const { layerDefinitions, layerVisibility, features: allFeatures, refreshData } = useData();

  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<MRT_ColumnDef<any>[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // --- Format header kolom ---
  const formatHeader = (key: string) =>
    key
      .replace(/([A-Z])/g, " $1") // camelCase ke spasi
      .replace(/^_+/, "") // hapus underscore di awal
      .replace("geomType", "Tipe Geometri")
      .replace("layer", "Layer")
      .trim();

  // --- Ambil data dari context (frontend) ---
  const getLocalData = () => {
    // Cek null safety
    if (!allFeatures?.features || !layerDefinitions || !layerVisibility) {
      setData([]);
      setColumns([]);
      return [];
    }

    // Filter layer yang visible
    const visibleLayers = layerDefinitions.filter((layer) => layer && (layerVisibility[layer.id] ?? false));

    const result: any[] = [];
    const fieldSet = new Set<string>(["layer", "geomType"]); // minimal kolom

    visibleLayers.forEach((layer) => {
      if (!layer?.layerType) return;

      // Filter feature berdasarkan layerType
      const features = allFeatures.features.filter((f: Feature) => f.properties?.layerType === layer.layerType);

      features.forEach((feature) => {
        const flattened = flattenFeature(feature, layer.name || layer.layerType);
        result.push(flattened);
        Object.keys(flattened).forEach((key) => fieldSet.add(key));
      });
    });

    // Generate kolom dinamis
    const dynamicColumns: MRT_ColumnDef<any>[] = Array.from(fieldSet)
      .sort((a, b) => {
        if (a === "layer") return -1;
        if (b === "layer") return 1;
        return a.localeCompare(b);
      })
      .map((key) => ({
        accessorKey: key,
        header: formatHeader(key),
        size: key === "layer" ? 140 : key === "geomType" ? 120 : 160,
      }));

    setColumns(dynamicColumns);
    return result;
  };

  // --- ✅ Auto-sync saat layerVisibility atau data berubah ---
  useEffect(() => {
    const localData = getLocalData();
    setData(localData);
  }, [layerVisibility, allFeatures]);

  // --- Handler: Refresh dari server (opsional) ---
  const handleForceRefresh = async () => {
    setIsSyncing(true);

    // Ambil layerType dari layer yang visible
    const visibleLayerTypes = layerDefinitions
      ?.filter((layer) => layer && (layerVisibility[layer.id] ?? false))
      .map((layer) => layer.layerType)
      .filter(Boolean) as string[];

    if (!visibleLayerTypes?.length) {
      setIsSyncing(false);
      return;
    }

    try {
      const freshFeatures = await fetchFreshAttributes(visibleLayerTypes);
      if (freshFeatures.length === 0) return;

      const freshData = freshFeatures.map((f) => flattenFeature(f, layerDefinitions.find((l) => l?.layerType === f.properties?.layerType)?.name || f.properties?.layerType || "Unknown"));
      setData(freshData);
    } catch (err) {
      console.warn("Gagal fetch dari server, tetap gunakan data lokal", err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <MaterialReactTable
        columns={columns}
        data={data}
        enableColumnResizing
        enableColumnOrdering
        enablePinning
        enableRowNumbers
        enablePagination
        enableGlobalFilter
        enableColumnFilters
        initialState={{
          density: "compact",
          pagination: { pageSize: 10, pageIndex: 0 },
        }}
        muiTableContainerProps={{
          sx: { maxHeight: "400px" },
        }}
        renderTopToolbarCustomActions={() => (
          <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <h3 className="text-lg font-semibold">📋 Attribute Table</h3>

            {/* Tombol Refresh: hanya untuk force update dari server */}
            <Tooltip title="Sinkron ulang dari server">
              <span>
                <IconButton onClick={handleForceRefresh} disabled={isSyncing} size="small" color="primary">
                  {isSyncing ? <CircularProgress size={20} /> : <Refresh />}
                </IconButton>
              </span>
            </Tooltip>

            {isSyncing && <Box sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Memuat data terbaru...</Box>}
          </Box>
        )}
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
          },
        }}
        state={{
          showProgressBars: isSyncing, // progress bar di header saat loading
        }}
      />

      {/* Pesan jika tidak ada data */}
      {data.length === 0 && <Box sx={{ p: 2, color: "text.secondary", textAlign: "center", fontSize: "0.9rem" }}>📭 Tidak ada layer yang ditampilkan. Aktifkan layer dari peta untuk melihat atribut.</Box>}
    </div>
  );
}
