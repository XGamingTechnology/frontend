// src/components/map/MapComponent.tsx
"use client";
import * as L from "leaflet";
import { MapContainer, TileLayer, ZoomControl, useMap, Marker, Popup, GeoJSON, Polyline, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MutableRefObject, useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Map as LeafletMap } from "leaflet";
import { useTool } from "@/context/ToolContext";
import { useData } from "@/context/DataContext";
import ToponimiPanel from "@/components/panels/ToponimiPanel";
import SimulasiPanel from "@/components/panels/SimulasiPanel";
import LineSurveyPanel from "@/components/panels/LineSurveyPanel";
import PolygonSurveyPanel from "@/components/panels/PolygonSurveyPanel";
import PolygonParallelPanel from "@/components/panels/PolygonParallelPanel";
import BatimetriPanel from "@/components/panels/BatimetriPanel";
import MeasureTool from "./MeasureTool";
import MapLabel from "./MapLabel";
import type { Feature, FeatureCollection, Polygon as GeoJSONPolygon, LineString as GeoJSONLineString } from "geojson";
import { getAuthHeaders, fetchWithAuth } from "@/lib/apiClient";

// --- Cegah Leaflet mencari marker-icon.png dan marker-shadow.png ---
const DefaultIcon = L.icon({
  iconUrl: "/icons/Bendera_1.png",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
  shadowUrl: null,
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Simpan referensi map ke ref ---
function MapRefSetter({ mapRef }: { mapRef: MutableRefObject<LeafletMap | null> }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
}

// --- Marker Lokasi User ---
function UserLocationMarker({ location }: { location: [number, number] }) {
  return (
    <Marker position={location}>
      <Popup>📍 Kamu di sini</Popup>
    </Marker>
  );
}

// --- Hook: Ambil data spatial — DIPERBAIKI — ✅
function useSpatialFeatures(layerType?: string | string[], source?: string) {
  const { features: allFeatures } = useData();
  const features = useMemo(() => {
    if (!allFeatures || !Array.isArray(allFeatures.features)) {
      console.warn("⚠️ [useSpatialFeatures] allFeatures is undefined or not an array");
      return [];
    }
    let filtered: Feature[] = allFeatures.features;
    if (layerType) {
      if (Array.isArray(layerType)) {
        filtered = filtered.filter((f) => layerType.includes(f.properties?.layerType));
      } else {
        filtered = filtered.filter((f) => f.properties?.layerType === layerType);
      }
    }
    if (source) {
      filtered = filtered.filter((f) => f.properties?.source === source);
    }
    return filtered;
  }, [allFeatures, layerType, source]);
  return { features };
}

// --- Tombol Cetak Peta ---
function PrintControl() {
  const map = useMap();
  const handlePrintMap = () => {
    import("leaflet-image").then(({ default: leafletImage }) => {
      leafletImage(map, (err: any, canvas: HTMLCanvasElement) => {
        if (err) {
          alert("Gagal ambil gambar peta.");
          return;
        }
        import("jspdf").then(({ jsPDF }) => {
          const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
          });
          const imgData = canvas.toDataURL("image/png");
          const imgWidth = 280;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
          pdf.setFontSize(16);
          pdf.text("Peta Toponimi", 14, 20);
          pdf.setFontSize(10);
          pdf.text(`Dibuat: ${new Date().toLocaleString()}`, 14, 28);
          pdf.save(`peta-toponimi-${Date.now()}.pdf`);
        });
      });
    });
  };
  return (
    <div
      className="leaflet-control leaflet-bar"
      style={{
        position: "absolute",
        bottom: "40px",
        left: "10px",
        zIndex: 1000,
        background: "#1e40af",
        color: "white",
        borderRadius: "4px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        padding: "6px 12px",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        cursor: "pointer",
      }}
      onClick={handlePrintMap}
    >
      <span style={{ fontSize: "16px" }}>🖨️</span>
      <span style={{ fontSize: "12px", fontWeight: "bold" }}>Cetak</span>
    </div>
  );
}

// ✅ Helper: Dapatkan warna berdasarkan kedalaman
const getTinColor = (depthMin: number, depthMax: number): string => {
  const ratio = Math.abs(depthMin) / (Math.abs(depthMin) + Math.abs(depthMax));
  const lightness = 70 - ratio * 40;
  return `hsl(200, 80%, ${lightness}%)`;
};

// ✅ Helper: Dapatkan URL ikon
const getIconUrl = (meta: any): string => {
  if (meta.is_custom && meta.icon) {
    return `http://localhost:5000/icons/custom/${meta.icon}`;
  }
  if (meta.icon) {
    return `/icons/${meta.icon}`;
  }
  return "/icons/Bendera_1.png";
};

// ✅ Format koordinat ke DMS (MMk GPS)
const formatToDMS = (decimal: number, isLat: boolean): string => {
  const abs = Math.abs(decimal);
  const deg = Math.floor(abs);
  const min = (abs - deg) * 60;
  const dir = isLat ? (decimal >= 0 ? "N" : "S") : decimal >= 0 ? "E" : "W";
  return `${deg}° ${min.toFixed(3)}′ ${dir}`;
};

export default function MapComponent({
  setLatLng,
  basemapType,
  mapRef,
  userLocation,
}: {
  setLatLng: (coords: [number, number]) => void;
  basemapType: string;
  mapRef: MutableRefObject<LeafletMap | null>;
  userLocation?: [number, number] | null;
}) {
  const tileLayers: Record<string, string> = {
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    terrain: "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
  };
  const tileUrl = tileLayers[basemapType] || tileLayers["osm"];
  const { layerDefinitions, layerVisibility, refreshData, deleteFeature, updateFeature } = useData();
  const { activeTool, setActiveTool, formLatLng, setFormLatLng, showToponimiForm, setShowToponimiForm, routePoints, setRoutePoints, surveyMode, setSurveyMode, isBatimetriPanelOpen, setIsBatimetriPanelOpen } = useTool();

  // --- Ambil data ---
  const { features: toponimiFeatures } = useSpatialFeatures("toponimi");
  const { features: userToponimiFeatures } = useSpatialFeatures("toponimi_user");
  // ✅ HANYA ambil permukaan_batimetri (kontur diabaikan sementara)
  const { features: batimetriFeatures } = useSpatialFeatures("permukaan_batimetri");
  const { features: batimetri } = useSpatialFeatures("batimetri");
  const { features: areaSungaiFeatures } = useSpatialFeatures("area_sungai");
  const { features: samplingPointFeatures } = useSpatialFeatures("valid_sampling_point");
  const { features: transectLineFeatures } = useSpatialFeatures("valid_transect_line");
  const { features: echosounderPointFeatures } = useSpatialFeatures("echosounder_point");

  // --- State menggambar ---
  const [drawnLine, setDrawnLine] = useState<L.LatLng[]>([]);
  const [drawnPolygon, setDrawnPolygon] = useState<L.LatLng[]>([]);
  const [draftId, setDraftId] = useState<number | null>(null);
  const [polygonDraftId, setPolygonDraftId] = useState<number | null>(null);
  const [showPolygonParallelPanel, setShowPolygonParallelPanel] = useState(false);
  const polygonParallelPanelRef = useRef<{ handleManualLineDrawn: (line: Feature<GeoJSONLineString>) => void } | null>(null);
  const hasLine = drawnLine.length > 0;
  const hasPolygon = drawnPolygon.length > 0;

  const addPointToDrawnLine = (latlng: L.LatLng) => {
    console.log("✅ [DRAW] Titik ditambahkan ke drawnLine:", latlng.lat.toFixed(6), latlng.lng.toFixed(6));
    setDrawnLine((prev) => [...prev, latlng]);
  };

  const addPointToDrawnPolygon = (latlng: L.LatLng) => {
    console.log("✅ [DRAW] Titik ditambahkan ke drawnPolygon:", latlng.lat.toFixed(6), latlng.lng.toFixed(6));
    setDrawnPolygon((prev) => [...prev, latlng]);
  };

  const clearDrawnLine = () => setDrawnLine([]);
  const clearDrawnPolygon = () => setDrawnPolygon([]);

  // --- Simpan Draft Garis ---
  const handleSaveLineDraft = async () => {
    if (drawnLine.length < 2) {
      alert("Garis harus memiliki minimal 2 titik.");
      return;
    }
    const lineCoords = drawnLine.map((latlng) => [latlng.lng, latlng.lat]) as [number, number][];
    const geojsonLine = { type: "LineString", coordinates: lineCoords } as const;
    try {
      const response = await fetchWithAuth("http://localhost:5000/graphql", {
        method: "POST",
        body: JSON.stringify({
          query: `
            mutation SaveRiverLineDraft($geom: JSON!) {
              saveRiverLineDraft(geom: $geom) {
                success
                message
                draftId
              }
            }
          `,
          variables: { geom: geojsonLine },
        }),
      });
      const data = await response.json();
      if (data.data?.saveRiverLineDraft.success) {
        setDraftId(data.data.saveRiverLineDraft.draftId);
        alert(`✅ ${data.data.saveRiverLineDraft.message}`);
        refreshData();
      } else {
        throw new Error(data.data?.saveRiverLineDraft.message || "Gagal simpan draft");
      }
    } catch (err: any) {
      alert(`❌ Gagal: ${err.message}`);
    }
  };

  // --- Simpan Draft Polygon ---
  const handleSavePolygonDraft = async () => {
    if (drawnPolygon.length < 3) {
      alert("Polygon harus memiliki minimal 3 titik.");
      return null;
    }
    const coordinates = [drawnPolygon.map((p) => [p.lng, p.lat])];
    coordinates[0].push(coordinates[0][0]); // tutup polygon
    const geojsonPolygon = { type: "Polygon", coordinates } as const;
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          query: `
            mutation SavePolygonDraft($geom: JSON!) {
              savePolygonDraft(geom: $geom) {
                success
                message
                draftId
              }
            }
          `,
          variables: { geom: geojsonPolygon },
        }),
      });
      const data = await response.json();
      if (data.data?.savePolygonDraft.success) {
        const draftId = data.data.savePolygonDraft.draftId;
        setPolygonDraftId(draftId);
        alert(`✅ ${data.data.savePolygonDraft.message}`);
        refreshData();
        return draftId;
      } else {
        throw new Error(data.data?.savePolygonDraft.message || "Gagal simpan draft");
      }
    } catch (err: any) {
      alert(`❌ Gagal: ${err.message}`);
      return null;
    }
  };

  // ✅ Tambahkan useEffect untuk dengarkan event
  useEffect(() => {
    const handleOpenPolygonParallelPanel = (e: CustomEvent) => {
      console.log("✅ [MapComponent] Membuka PolygonParallelPanel dari event:", e.detail);
      setShowPolygonParallelPanel(true);
    };
    window.addEventListener("open-polygon-parallel-panel", handleOpenPolygonParallelPanel as EventListener);
    return () => {
      window.removeEventListener("open-polygon-parallel-panel", handleOpenPolygonParallelPanel as EventListener);
    };
  }, []);

  // ✅ Dengarkan event 'transek-finished' — lalu buka panel batimetri
  useEffect(() => {
    const handleTransekFinished = () => {
      console.log("✅ [MapComponent] Menerima event 'transek-finished' — membuka panel batimetri");
      setIsBatimetriPanelOpen(true);
    };
    window.addEventListener("transek-finished", handleTransekFinished as EventListener);
    return () => {
      window.removeEventListener("transek-finished", handleTransekFinished as EventListener);
    };
  }, [setIsBatimetriPanelOpen]);

  // ✅ Dengarkan event 'open-batimetri-panel' — dari SimulasiPanel
  useEffect(() => {
    const handleOpenBatimetriPanel = () => {
      console.log("✅ [MapComponent] Menerima event 'open-batimetri-panel' — membuka panel batimetri");
      setIsBatimetriPanelOpen(true);
    };
    window.addEventListener("open-batimetri-panel", handleOpenBatimetriPanel as EventListener);
    return () => {
      window.removeEventListener("open-batimetri-panel", handleOpenBatimetriPanel as EventListener);
    };
  }, [setIsBatimetriPanelOpen]);

  // ✅ Reset panel saat surveyMode berubah
  useEffect(() => {
    if (surveyMode !== "polygon") {
      setShowPolygonParallelPanel(false);
      localStorage.removeItem("transekPolygonMode");
      localStorage.removeItem("pendingTransekPolygon");
    }
  }, [surveyMode]);

  // --- Map Events ---
  const MapEvents = () => {
    const map = useMap();
    const { activeTool: currentActiveTool } = useTool();

    const handleClick = useCallback(
      (e: L.LeafletMouseEvent) => {
        console.log("🖱️ [MapEvents] Click terdeteksi | activeTool:", currentActiveTool);
        if (currentActiveTool === "toponimi") {
          setFormLatLng(e.latlng);
          setShowToponimiForm(true);
        } else if (currentActiveTool === "rute" && routePoints.length < 2) {
          const newPoints = [...routePoints, e.latlng];
          setRoutePoints(newPoints);
          if (mapRef.current) {
            L.marker(e.latlng)
              .addTo(mapRef.current)
              .bindPopup(newPoints.length === 1 ? "Titik Awal" : "Titik Akhir")
              .openPopup();
          }
        } else if (currentActiveTool === "drawline") {
          console.log("➕ [MapEvents] Menambahkan titik ke drawnLine");
          addPointToDrawnLine(e.latlng);
        } else if (currentActiveTool === "drawpolygon") {
          console.log("➕ [MapEvents] Menambahkan titik ke drawnPolygon");
          addPointToDrawnPolygon(e.latlng);
        }
      },
      [currentActiveTool, setFormLatLng, setShowToponimiForm, routePoints, setRoutePoints, mapRef, addPointToDrawnLine, addPointToDrawnPolygon]
    );

    const handleContextMenu = useCallback(
      async (e: L.LeafletMouseEvent) => {
        e.originalEvent.preventDefault();
        const transekMode = localStorage.getItem("transekPolygonMode");
        console.log("🖱️ [MapEvents] ContextMenu terdeteksi | activeTool:", currentActiveTool);
        console.log("📌 transekMode:", transekMode);
        if (currentActiveTool === "drawpolygon" && drawnPolygon.length >= 3) {
          console.log("✅ [MapEvents] Polygon selesai digambar");
          const savedDraftId = await handleSavePolygonDraft();
          if (!savedDraftId) {
            alert("❌ Gagal menyimpan draft polygon. Coba lagi.");
            return;
          }
          clearDrawnPolygon();
          setActiveTool(null);
          if (transekMode === "parallel_centerline") {
            console.log("🔄 [MapEvents] Mode: parallel_centerline → buka PolygonParallelPanel");
            setShowPolygonParallelPanel(true);
            localStorage.setItem("pendingTransekPolygon", "true");
            setActiveTool("drawline");
            alert("✅ Polygon selesai. Sekarang gambar garis tengah secara manual.");
          } else {
            console.log("✅ [MapEvents] Draft polygon disimpan dengan ID:", savedDraftId);
          }
        } else if (currentActiveTool === "drawline" && drawnLine.length >= 2) {
          console.log("✅ [MapEvents] Garis selesai digambar");
          const lineCoords = drawnLine.map((latlng) => [latlng.lng, latlng.lat]) as [number, number][];
          const geojsonLine = {
            type: "Feature",
            geometry: { type: "LineString", coordinates: lineCoords },
            properties: {},
          } as Feature<GeoJSONLineString>;
          clearDrawnLine();
          setActiveTool(null);
          const isPendingTransek = localStorage.getItem("pendingTransekPolygon") === "true";
          if (isPendingTransek) {
            console.log("✅ [MapEvents] Mode paralel aktif — proses transek");
            localStorage.removeItem("pendingTransekPolygon");
            setShowPolygonParallelPanel(true);
            console.log("✅ [MapEvents] Panel PolygonParallelPanel diaktifkan");
            setTimeout(() => {
              if (polygonParallelPanelRef.current) {
                console.log("📤 [MapEvents] Mengirim garis ke PolygonParallelPanel...");
                polygonParallelPanelRef.current.handleManualLineDrawn(geojsonLine);
                console.log("✅ [MapEvents] Garis berhasil dikirim ke panel");
              } else {
                console.warn("⚠️ [MapEvents] PolygonParallelPanel ref belum siap — coba lagi dalam 500ms");
                setTimeout(() => {
                  if (polygonParallelPanelRef.current) {
                    console.log("📤 [MapEvents] Percobaan kedua: kirim garis...");
                    polygonParallelPanelRef.current.handleManualLineDrawn(geojsonLine);
                    console.log("✅ [MapEvents] Garis berhasil dikirim pada percobaan kedua");
                  } else {
                    console.error("❌ [MapEvents] Panel tidak siap setelah 2x percobaan — kemungkinan tidak termount");
                  }
                }, 500);
              }
            }, 100);
          } else {
            console.log("💾 [MapEvents] Simpan draft garis (mode default)");
            handleSaveLineDraft();
          }
        }
      },
      [currentActiveTool, drawnPolygon, drawnLine, clearDrawnPolygon, clearDrawnLine, setActiveTool, refreshData, handleSavePolygonDraft, handleSaveLineDraft]
    );

    const handleMouseMove = useCallback(
      (e: L.LeafletMouseEvent) => {
        setLatLng([e.latlng.lat, e.latlng.lng]);
      },
      [setLatLng]
    );

    useEffect(() => {
      map.on("click", handleClick);
      map.on("contextmenu", handleContextMenu);
      map.on("mousemove", handleMouseMove);
      return () => {
        map.off("click", handleClick);
        map.off("contextmenu", handleContextMenu);
        map.off("mousemove", handleMouseMove);
      };
    }, [map, handleClick, handleContextMenu, handleMouseMove]);

    return null;
  };

  // --- CRUD ---
  const editFeature = (feature: Feature) => {
    const newName = prompt("Nama baru:", feature.properties?.name || "");
    if (newName === null) return;
    const newDesc = prompt("Deskripsi baru:", feature.properties?.description || "");
    const updates: any = { name: newName };
    if (newDesc !== null) updates.description = newDesc;
    updateFeature(feature.id as number, updates);
  };

  const deleteFeatureWithConfirm = (id: number) => {
    if (confirm("Yakin ingin hapus feature ini?")) {
      deleteFeature(id);
    }
  };

  // --- Inisialisasi fungsi global ---
  useEffect(() => {
    (window as any).editFeature = editFeature;
    (window as any).deleteFeature = deleteFeatureWithConfirm;
    (window as any).show3D = (surveyId: string) => {
      document.dispatchEvent(new CustomEvent("open-3d-panel", { detail: { surveyId } }));
    };
    return () => {
      delete (window as any).editFeature;
      delete (window as any).deleteFeature;
      delete (window as any).show3D;
    };
  }, [editFeature, deleteFeatureWithConfirm]);

  return (
    <>
      <MapContainer center={[-2.98, 104.76]} zoom={13} zoomControl={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer attribution="&copy; contributors" url={tileUrl} />
        <ZoomControl position="bottomright" />
        <MapEvents />
        <MapRefSetter mapRef={mapRef} />
        {userLocation && <UserLocationMarker location={userLocation} />}
        {/* ✅ Alat Ukur Manual */}
        <MeasureTool />

        {/* --- RENDER LAYER --- */}
        {layerDefinitions
          ?.filter((layer) =>
            [
              "toponimi_user",
              "valid_transect_line",
              "valid_sampling_point",
              "toponimi",
              "batimetri",
              "area_sungai",
              "echosounder_point",
              "permukaan_batimetri", // ✅ Hanya TIN
              // ❌ "kontur_batimetri" dihapus sementara
            ].includes(layer.layerType)
          )
          .map((layer) => {
            const isVisible = layerVisibility[layer.id] ?? false;
            let features: Feature[] = [];
            let pointLayerType = "";
            switch (layer.layerType) {
              case "toponimi_user":
                features = userToponimiFeatures;
                break;
              case "valid_transect_line":
                features = transectLineFeatures;
                break;
              case "valid_sampling_point":
                features = samplingPointFeatures;
                pointLayerType = "valid_sampling_point";
                break;
              case "toponimi":
                features = toponimiFeatures;
                break;
              case "area_sungai":
                features = areaSungaiFeatures;
                break;
              case "echosounder_point":
                features = echosounderPointFeatures;
                break;
              case "permukaan_batimetri":
                features = batimetriFeatures;
                break;
              case "batimetri":
                features = batimetri;
                break;
              default:
                return null;
            }

            if (!isVisible || !Array.isArray(features) || features.length === 0) return null;

            // --- Valid Sampling Point ---
            if (pointLayerType === "valid_sampling_point") {
              return (
                <GeoJSON
                  key={`valid-sampling-${features.length}`}
                  data={{ type: "FeatureCollection", features } as FeatureCollection}
                  pointToLayer={(point, latlng) =>
                    L.circleMarker(latlng, {
                      radius: layer.metadata?.radius || 6,
                      color: point.properties?.color || layer.metadata?.color || "#16a34a",
                      fillColor: point.properties?.color || layer.metadata?.fillColor || "#16a34a",
                      fillOpacity: layer.metadata?.fillOpacity || 0.7,
                    })
                  }
                  onEachFeature={(feature, layer) => {
                    const props = feature.properties || {};
                    const metadata = props.metadata || props;
                    const depth = metadata.kedalaman ?? metadata.depth_value ?? "-";
                    const distance = metadata.distance_m ?? metadata.distance_from_start ?? "-";
                    const transectId = metadata.transect_id || props.transect_id || "Unknown";
                    const surveyId = metadata.survey_id || props.survey_id || "-";
                    const featureId = feature.id || props.id || Math.random();
                    const popupContent = `
                    <div style="font-family: 'Segoe UI', sans-serif; line-height: 1.4; padding: 12px 16px; border-radius: 8px; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 220px;">
                      <div style="background:#1e40af;color:white;padding:8px;border-radius:4px 4px 0 0;font-weight:bold;text-align:center;">Sampling Point</div>
                      <table style="width:100%;margin-top:8px;border-collapse:collapse;">
                        <tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 0;color:#64748b;font-weight:500;">Transect</td><td style="padding:6px 0;text-align:right;font-weight:bold;">${transectId}</td></tr>
                        <tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 0;color:#64748b;font-weight:500;">Survey ID</td><td style="padding:6px 0;text-align:right;font-weight:bold;">${surveyId}</td></tr>
                        <tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 0;color:#64748b;font-weight:500;">Jarak</td><td style="padding:6px 0;text-align:right;font-weight:bold;">${distance} m</td></tr>
                        <tr><td style="padding:6px 0;color:#64748b;font-weight:500;">Kedalaman</td><td style="padding:6px 0;text-align:right;font-weight:bold;color:${depth !== "-" && depth < 0 ? "#1e40af" : "#10b981"};">${depth} m</td></tr>
                      </table>
                      <div style="margin-top: 8px; display: flex; gap: 4px;">
                        <button onclick="window.editFeature('${featureId}')" style="font-size:0.8em;padding:4px 8px;background:#10b981;color:white;border:none;border-radius:4px;cursor:pointer;">✏️ Edit</button>
                        <button onclick="window.deleteFeature('${featureId}')" style="font-size:0.8em;padding:4px 8px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;">🗑️ Hapus</button>
                      </div>
                    </div>
                  `;
                    layer.bindPopup(popupContent);
                  }}
                />
              );
            }

            // --- ECHOSOUNDER POINT ---
            if (layer.layerType === "echosounder_point") {
              return (
                <GeoJSON
                  key={`echosounder-${features.length}`}
                  data={{ type: "FeatureCollection", features } as FeatureCollection}
                  pointToLayer={(point, latlng) =>
                    L.circleMarker(latlng, {
                      radius: layer.metadata?.radius || 5,
                      color: point.properties?.color || layer.metadata?.color || "#ff6b6b",
                      fillColor: point.properties?.color || layer.metadata?.fillColor || "#ff6b6b",
                      fillOpacity: layer.metadata?.fillOpacity || 0.8,
                    })
                  }
                  onEachFeature={(feature, layer) => {
                    const props = feature.properties || {};
                    const depth = props.depth_m ?? props.kedalaman ?? "-";
                    const surveyId = props.survey_id || "Unknown";
                    const popupContent = `
          <div style="font-family: sans-serif; padding: 8px;">
            <h4 style="margin:0; color:#1e40af;">Echosounder Point</h4>
            <p><b>Kedalaman:</b> ${depth} m</p>
            <p><b>Survey ID:</b> ${surveyId}</p>
          </div>
        `;
                    layer.bindPopup(popupContent);
                  }}
                />
              );
            }

            // --- Toponimi User ---
            if (layer.layerType === "toponimi_user") {
              return (
                <GeoJSON
                  key={`toponimi-user-${features.length}`}
                  data={{ type: "FeatureCollection", features } as FeatureCollection}
                  pointToLayer={(point, latlng) => {
                    const meta = point.properties?.metadata || point.properties || {};
                    const iconUrl = getIconUrl(meta);
                    return L.marker(latlng, {
                      icon: L.icon({
                        iconUrl,
                        iconSize: [28, 28],
                        iconAnchor: [14, 28],
                        popupAnchor: [0, -28],
                        shadowUrl: null,
                      }),
                    });
                  }}
                  onEachFeature={(feature, layer) => {
                    const props = feature.properties || {};
                    const meta = props.metadata || props;
                    const [lng, lat] = feature.geometry?.coordinates || [];
                    const latDMS = formatToDMS(lat, true);
                    const lngDMS = formatToDMS(lng, false);
                    const popupContent = `
          <div style="font-family: 'Segoe UI', sans-serif; line-height: 1.4; padding: 12px 16px; border-radius: 8px; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 280px;">
            <div style="background:#1e40af;color:white;padding:8px;border-radius:4px 4px 0 0;font-weight:bold;text-align:center;">${props.name || "Toponimi"}</div>
            <div style="padding:12px 0; font-size:14px;">
              ${props.description ? `<div style="margin-bottom:8px;"><strong style="color:#64748b;">Deskripsi:</strong> ${props.description}</div>` : ""}
              <div style="margin-bottom:6px;"><strong style="color:#64748b;">Kategori:</strong> ${meta.category || "-"}</div>
              <div style="margin-bottom:6px;"><strong style="color:#64748b;">Tipe Ikon:</strong> ${meta.is_custom ? '<span style="color:#10b981;">Ikon Kustom</span>' : '<span style="color:#3b82f6;">Bawaan</span>'}</div>
              <div style="margin-bottom:6px;"><strong style="color:#64748b;">File Ikon:</strong> <code style="font-size:0.9em;background:#f1f5f9;padding:2px 4px;border-radius:3px;">${meta.icon || "-"}</code></div>
              <div style="margin-bottom:6px;"><strong style="color:#64748b;">Koordinat (DMS):</strong></div>
              <div style="margin-left:16px; font-size:0.9em; color:#64748b;">
                <div>(Lat): ${latDMS}</div>
                <div>(Lng): ${lngDMS}</div>
              </div>
              <div style="margin-top:8px; font-size:0.9em; color:#94a3b8;">ID: #${feature.id} | Source: ${meta.source || "manual"}</div>
            </div>
            <div style="margin-top: 10px; display: flex; gap: 6px;">
              <button onclick="window.editFeature(${feature.id})" style="font-size:0.85em;padding:4px 10px;background:#10b981;color:white;border:none;border-radius:4px;cursor:pointer;flex:1;">✏️ Edit</button>
              <button onclick="window.deleteFeature(${feature.id})" style="font-size:0.85em;padding:4px 10px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;flex:1;">🗑️ Hapus</button>
            </div>
          </div>
        `;
                    layer.bindPopup(popupContent);
                  }}
                />
              );
            }

            // --- Toponimi Existing ---
            if (layer.layerType === "toponimi") {
              return (
                <GeoJSON
                  key={`toponimi-existing-${features.length}`}
                  data={{ type: "FeatureCollection", features } as FeatureCollection}
                  pointToLayer={(point, latlng) =>
                    L.marker(latlng, {
                      icon: L.icon({
                        iconUrl: "/icons/Bendera_1.png",
                        iconSize: [24, 24],
                        iconAnchor: [12, 12],
                        shadowUrl: null,
                      }),
                    })
                  }
                  onEachFeature={(feature, layer) => {
                    const props = feature.properties || {};
                    const popupContent = `
                    <div style="font-family: 'Segoe UI', sans-serif; line-height: 1.4; padding: 12px 16px; border-radius: 8px; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 200px;">
                      <div style="background:#1e40af;color:white;padding:8px;border-radius:4px 4px 0 0;font-weight:bold;text-align:center;">${props.name || "Toponimi"}</div>
                      <div style="padding:12px 0;">
                        ${props.description ? `<div style="margin-bottom:6px;"><strong style="color:#64748b;">Deskripsi:</strong> ${props.description}</div>` : ""}
                        <div style="margin-bottom:6px;"><strong style="color:#64748b;">Kategori:</strong> ${props.category || "-"}</div>
                      </div>
                    </div>
                  `;
                    layer.bindPopup(popupContent);
                  }}
                />
              );
            }

            // ✅ BENAR — gunakan fungsi dinamis
            // ✅ BENAR — warna dinamis berdasarkan kedalaman
            if (layer.layerType === "permukaan_batimetri") {
              return (
                <GeoJSON
                  key={`batimetri-permukaan-${features.length}`}
                  data={{ type: "FeatureCollection", features } as FeatureCollection}
                  style={(feature) => {
                    const props = feature?.properties || {};
                    const depthMin = props.depth_min !== undefined ? parseFloat(props.depth_min) : -1;
                    const depthMax = props.depth_max !== undefined ? parseFloat(props.depth_max) : -0.1;
                    const ratio = Math.abs(depthMin) / (Math.abs(depthMin) + Math.abs(depthMax));
                    const lightness = 70 - ratio * 40;
                    return {
                      fillColor: `hsl(200, 80%, ${lightness}%)`,
                      color: "#0284c7",
                      fillOpacity: 0.4,
                      weight: 1,
                      dashArray: "5,5",
                    };
                  }}
                  onEachFeature={(feature, layer) => {
                    const props = feature.properties || {};
                    const depthMin = props.depth_min?.toFixed(2) || "N/A";
                    const depthMax = props.depth_max?.toFixed(2) || "N/A";
                    const surveyId = props.survey_id || "N/A";
                    const pointCount = props.point_count || "N/A";
                    layer.bindPopup(`
          <div style="font-family: 'Segoe UI', sans-serif; padding: 12px; max-width: 220px;">
            <h4 style="margin:0 0 10px 0; color:#1e40af;">Permukaan Batimetri</h4>
            <p><strong>Survey ID:</strong> ${surveyId}</p>
            <p><strong>Kedalaman:</strong> ${depthMin} → ${depthMax} m</p>
            <p><strong>Jumlah Titik:</strong> ${pointCount}</p>
            <p style="font-size:0.9em; color:#64748b; margin-top:8px;">
              Klik di luar untuk tutup. Warna merepresentasikan variasi kedalaman.
            </p>
          </div>
        `);
                  }}
                />
              );
            }
            // --- Line & Polygon ---
            return (
              <GeoJSON
                key={layer.id}
                data={{ type: "FeatureCollection", features } as FeatureCollection}
                style={{
                  fillColor: layer.metadata?.fillColor || "#0284c7",
                  color: layer.metadata?.color || "#0284c7",
                  fillOpacity: layer.metadata?.fillOpacity || 0.4,
                  weight: layer.metadata?.weight || 2,
                  dashArray: layer.metadata?.dashArray || undefined,
                }}
                onEachFeature={(feature, layer) => {
                  const props = feature.properties || {};
                  const popupContent = `
                  <div style="font-family: 'Segoe UI', sans-serif; line-height: 1.4; padding: 12px 16px; border-radius: 8px; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 200px;">
                    <div style="background:#1e40af;color:white;padding:8px;border-radius:4px 4px 0 0;font-weight:bold;text-align:center;">${props.name || props.transect_id || "Feature"}</div>
                    <div style="padding:12px 0;">
                      ${props.description ? `<div style="margin-bottom:6px;"><strong style="color:#64748b;">Deskripsi:</strong> ${props.description}</div>` : ""}
                      ${props.layerType ? `<div style="margin-bottom:6px;"><strong style="color:#64748b;">Tipe:</strong> ${props.layerType}</div>` : ""}
                    </div>
                    <div style="margin-top: 8px; display: flex; gap: 4px;">
                      <button onclick="window.editFeature(${feature.id})" style="font-size:0.8em;padding:4px 8px;background:#10b981;color:white;border:none;border-radius:4px;cursor:pointer;">✏️ Edit</button>
                      <button onclick="window.deleteFeature(${feature.id})" style="font-size:0.8em;padding:4px 8px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;">🗑️ Hapus</button>
                    </div>
                  </div>
                `;
                  layer.bindPopup(popupContent);
                }}
              />
            );
          })}

        {/* --- LABEL DINAMIS --- */}
        {/* ❌ HAPUS SEMUA LABEL KEDALAMAN SEMENTARA */}
        {areaSungaiFeatures.map((feature) => {
          if (!feature.geometry) return null;
          let lat = 0,
            lng = 0;
          const geom = feature.geometry;
          if (geom.type === "Polygon") {
            const coords = geom.coordinates[0];
            const flatCoords = coords.flat(1);
            const avg = flatCoords.reduce((acc, c) => [acc[0] + c[1], acc[1] + c[0]], [0, 0]);
            lat = avg[0] / flatCoords.length;
            lng = avg[1] / flatCoords.length;
          } else if (geom.type === "Point") {
            [lng, lat] = geom.coordinates;
          }
          const name = feature.properties?.name || feature.properties?.metadata?.nama_sungai || "Sungai";
          return <MapLabel key={`label-sungai-${feature.id}`} position={[lat, lng]} text={name} fontSize={13} color="white" backgroundColor="rgba(30, 58, 138, 0.8)" padding="4px 8px" borderRadius={6} zIndex={1002} />;
        })}

        {/* --- GAMBAR --- */}
        {drawnLine.length > 0 && <Polyline positions={drawnLine} color="red" weight={4} opacity={0.8} />}
        {drawnPolygon.length > 0 && <Polygon positions={drawnPolygon} color="green" weight={3} opacity={0.8} fillOpacity={0.3} />}
      </MapContainer>

      {/* --- PANEL --- */}
      {showToponimiForm && <ToponimiPanel onClose={() => setShowToponimiForm(false)} />}
      {activeTool === "simulasi" && (
        <SimulasiPanel
          onClosePanel={() => setActiveTool(null)}
          setActiveTool={setActiveTool}
          setSurveyMode={setSurveyMode}
          drawnLine={drawnLine}
          drawnPolygon={drawnPolygon}
          isDrawingLine={activeTool === "drawline"}
          isDrawingPolygon={activeTool === "drawpolygon"}
          clearDrawnLine={clearDrawnLine}
          clearDrawnPolygon={clearDrawnPolygon}
        />
      )}
      {surveyMode === "line" && (
        <LineSurveyPanel
          onClose={() => {
            setSurveyMode(null);
            setActiveTool(null);
            setDrawnLine([]);
            setDraftId(null);
          }}
          drawnLine={drawnLine}
          isDrawing={activeTool === "drawline"}
          hasLine={hasLine}
          onDeleteLine={clearDrawnLine}
          onSaveDraft={handleSaveLineDraft}
          draftId={draftId}
          setDraftId={setDraftId}
          setActiveTool={setActiveTool}
        />
      )}
      {surveyMode === "polygon" && (
        <>
          {localStorage.getItem("transekPolygonMode") === "parallel_centerline" && showPolygonParallelPanel && (
            <PolygonParallelPanel
              ref={polygonParallelPanelRef}
              onClose={() => {
                setShowPolygonParallelPanel(false);
                setDrawnPolygon([]);
                setPolygonDraftId(null);
                localStorage.removeItem("transekPolygonMode");
                localStorage.removeItem("pendingTransekPolygon");
              }}
              drawnPolygon={drawnPolygon}
              isDrawing={activeTool === "drawpolygon"}
              hasPolygon={hasPolygon}
              onDeletePolygon={clearDrawnPolygon}
              onSaveDraft={handleSavePolygonDraft}
              draftId={polygonDraftId}
              setDraftId={setPolygonDraftId}
              setActiveTool={setActiveTool}
            />
          )}
          {!localStorage.getItem("transekPolygonMode") && (
            <PolygonSurveyPanel
              onClose={() => {
                setSurveyMode(null);
                setActiveTool(null);
                setDrawnPolygon([]);
                setPolygonDraftId(null);
              }}
              drawnPolygon={drawnPolygon}
              isDrawing={activeTool === "drawpolygon"}
              hasPolygon={hasPolygon}
              onDeletePolygon={clearDrawnPolygon}
              onSaveDraft={handleSavePolygonDraft}
              draftId={polygonDraftId}
              setDraftId={setPolygonDraftId}
              setActiveTool={setActiveTool}
            />
          )}
        </>
      )}
      {isBatimetriPanelOpen && mapRef.current && <BatimetriPanel onClose={() => setIsBatimetriPanelOpen(false)} map={mapRef.current} />}
    </>
  );
}
