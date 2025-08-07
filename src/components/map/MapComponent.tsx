// src/components/map/MapComponent.tsx
"use client";
import * as L from "leaflet";
import { MapContainer, TileLayer, useMapEvents, ZoomControl, useMap, Marker, Popup, GeoJSON, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MutableRefObject, useEffect, useState } from "react";
import { Map as LeafletMap, Icon, LatLngExpression } from "leaflet";
import { useTool } from "@/context/ToolContext";
import { useData } from "@/context/DataContext";
import ToponimiFormModal from "@/components/forms/ToponimiFormModal";
import SimulasiPanel from "@/components/panels/SimulasiPanel";
import type { Feature, LineString, Point } from "geojson";

// --- ICONS ---
const buoyIcon = new Icon({
  iconUrl: "/Pin.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
const userIcon = buoyIcon;
const startIcon = buoyIcon;
const endIcon = buoyIcon;

// --- Komponen: Simpan referensi map ke ref ---
function MapRefSetter({ mapRef }: { mapRef: MutableRefObject<LeafletMap | null> }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
}

// --- Komponen: Marker Lokasi User ---
function UserLocationMarker({ location }: { location: [number, number] }) {
  return (
    <Marker position={location} icon={userIcon}>
      <Popup>📍 Kamu di sini</Popup>
    </Marker>
  );
}

// --- Hook: Ambil data spatial dari GraphQL ---
function useSpatialFeatures(layerType?: string, source?: string) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { features: allFeatures, loading: loadingAll, error: errorAll } = useData();

  useEffect(() => {
    if (loadingAll) return;
    if (errorAll) {
      setError(errorAll);
      setLoading(false);
      return;
    }

    let filtered = allFeatures?.features || [];
    if (layerType) {
      filtered = filtered.filter((f) => f.properties?.layerType === layerType);
    }
    if (source) {
      filtered = filtered.filter((f) => f.properties?.source === source);
    }

    setFeatures(filtered);
    setLoading(false);
  }, [allFeatures, loadingAll, errorAll, layerType, source]);

  return { features, loading, error };
}

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

  const { layerDefinitions, layerVisibility, setLayerVisibility, addFeature, refreshData } = useData();
  const { activeTool, setActiveTool, formLatLng, setFormLatLng, showToponimiForm, setShowToponimiForm, routePoints, setRoutePoints } = useTool();

  // --- Ambil SEMUA data dari database ---
  const { features: centerlineFeatures } = useSpatialFeatures("centerline");
  const { features: sungaiFeatures } = useSpatialFeatures("sungai");
  const { features: toponimiFeatures } = useSpatialFeatures("toponimi");
  const { features: batimetriFeatures } = useSpatialFeatures("batimetri");
  const { features: areaSungaiFeatures } = useSpatialFeatures("area_sungai");
  const { features: riverLineFeatures } = useSpatialFeatures("river_line");
  const { features: samplingPointFeatures } = useSpatialFeatures("valid_sampling_point");
  const { features: transectLineFeatures } = useSpatialFeatures("valid_transect_line");

  // --- State untuk menggambar garis ---
  const [drawnLine, setDrawnLine] = useState<L.LatLng[]>([]);
  const isDrawing = activeTool === "drawline";
  const hasLine = drawnLine.length > 0;

  const addPointToDrawnLine = (latlng: L.LatLng) => {
    setDrawnLine((prev) => [...prev, latlng]);
  };

  const clearDrawnLine = () => {
    setDrawnLine([]);
  };

  // --- SIMPAN GARIS SUNGAI (DRAFT) ---
  const handleSaveLine = async () => {
    if (drawnLine.length < 2) {
      alert("Garis harus memiliki minimal 2 titik.");
      return;
    }

    const lineCoords = drawnLine.map((latlng) => [latlng.lng, latlng.lat] as [number, number]);
    const geojsonLine = {
      type: "LineString",
      coordinates: lineCoords,
    };

    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        alert(`✅ ${data.data.saveRiverLineDraft.message}`);
      } else {
        throw new Error(data.errors?.[0]?.message || "Gagal simpan draft");
      }
    } catch (err: any) {
      console.error("❌ Gagal simpan draft:", err);
      alert(`❌ Gagal: ${err.message}`);
    }
  };

  const handleStartDrawing = () => {
    setDrawnLine([]);
    setActiveTool("drawline");
  };

  // --- Map Events ---
  const MapEvents = () => {
    const map = useMap();
    useMapEvents({
      mousemove(e) {
        setLatLng([e.latlng.lat, e.latlng.lng]);
      },
      click(e) {
        if (activeTool === "toponimi") {
          setFormLatLng(e.latlng);
          setShowToponimiForm(true);
        } else if (activeTool === "rute") {
          if (routePoints.length < 2) {
            const newPoints = [...routePoints, e.latlng];
            setRoutePoints(newPoints);
            if (mapRef.current) {
              L.marker(e.latlng, {
                icon: newPoints.length === 1 ? startIcon : endIcon,
              })
                .addTo(mapRef.current)
                .bindPopup(newPoints.length === 1 ? "Titik Awal" : "Titik Akhir")
                .openPopup();
            }
          }
        } else if (activeTool === "drawline") {
          addPointToDrawnLine(e.latlng);
        }
      },
      contextmenu() {
        if (activeTool === "drawline" && drawnLine.length > 1) {
          alert("Garis selesai digambar. Klik 'Simpan Draft' untuk menyimpan.");
        }
      },
    });
    return null;
  };

  const handleAddToponimi = async ({ nama, deskripsi }: { nama: string; deskripsi: string }) => {
    if (!formLatLng) return;
    try {
      const pointGeoJSON = {
        type: "Point",
        coordinates: [formLatLng.lng, formLatLng.lat],
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
              }
            }
          `,
          variables: {
            layerType: "toponimi",
            name: nama,
            description: deskripsi,
            geometry: pointGeoJSON,
            source: "manual",
            meta: null,
          },
        }),
      });
      const result = await response.json();
      if (result.data?.createSpatialFeature) {
        alert("Toponimi berhasil ditambahkan!");
        setShowToponimiForm(false);
        setFormLatLng(null);
      } else {
        const message = result.data?.createSpatialFeature?.message || "Gagal menyimpan";
        alert(message);
      }
    } catch (err) {
      console.error("Gagal simpan toponimi:", err);
      alert("Tidak dapat terhubung ke server.");
    }
  };

  const handleCancelMarker = () => {
    setFormLatLng(null);
    setShowToponimiForm(false);
  };

  return (
    <>
      <MapContainer center={[-2.98, 104.76]} zoom={13} zoomControl={false} style={{ height: "100%", width: "100%" }} className="z-0">
        <TileLayer attribution="&copy; contributors" url={tileUrl} />
        <ZoomControl position="bottomright" />
        <MapEvents />
        <MapRefSetter mapRef={mapRef} />
        {userLocation && <UserLocationMarker location={userLocation} />}

        {/* --- RENDER SEMUA LAYER DINAMIS --- */}
        {layerDefinitions?.map((layer) => {
          const isVisible = layerVisibility[layer.id] ?? false;
          let features: Feature[] = [];
          let pointLayerType = "";

          switch (layer.layerType) {
            case "centerline":
              features = centerlineFeatures;
              break;
            case "sungai":
              features = sungaiFeatures;
              break;
            case "toponimi":
              features = toponimiFeatures;
              break;
            case "batimetri":
              features = batimetriFeatures;
              break;
            case "area_sungai":
              features = areaSungaiFeatures;
              break;
            case "river_line":
              features = riverLineFeatures;
              break;
            case "valid_sampling_point":
              features = samplingPointFeatures;
              pointLayerType = "valid_sampling_point";
              break;
            case "valid_transect_line":
              features = transectLineFeatures;
              break;
            default:
              features = [];
          }

          if (!isVisible || features.length === 0) return null;

          if (pointLayerType) {
            return (
              <GeoJSON
                key={layer.id}
                data={{ type: "FeatureCollection", features }}
                pointToLayer={(point, latlng) => {
                  return L.circleMarker(latlng, {
                    radius: layer.meta?.radius || 6,
                    color: point.properties?.color || layer.meta?.color || "#16a34a",
                    fillColor: point.properties?.color || layer.meta?.fillColor || "#16a34a",
                    fillOpacity: layer.meta?.fillOpacity || 0.7,
                  });
                }}
                onEachFeature={(feature, layer) => {
                  const popupContent = `<strong>${feature.properties?.name || feature.properties?.transectId}</strong><br/>${feature.properties?.description || ""}`;
                  layer.bindPopup(popupContent);
                }}
              />
            );
          }

          return (
            <GeoJSON
              key={layer.id}
              data={{ type: "FeatureCollection", features }}
              style={{
                fillColor: layer.meta?.fillColor || "#0284c7",
                color: layer.meta?.color || "#0284c7",
                fillOpacity: layer.meta?.fillOpacity || 0.4,
                weight: layer.meta?.weight || 2,
              }}
              onEachFeature={(feature, layer) => {
                const popupContent = `<strong>${feature.properties?.name || feature.properties?.transectId}</strong><br/>${feature.properties?.description || ""}`;
                layer.bindPopup(popupContent);
              }}
            />
          );
        })}

        {/* --- GARIS YANG DIGAMBAR --- */}
        {drawnLine.length > 0 && <Polyline positions={drawnLine} color="red" weight={4} opacity={0.8} />}
      </MapContainer>

      {/* --- MODAL FORM TOPONIMI --- */}
      {showToponimiForm && formLatLng && activeTool !== "simulasi" && (
        <ToponimiFormModal latlng={[formLatLng.lat, formLatLng.lng]} onClose={() => setShowToponimiForm(false)} onSubmit={handleAddToponimi} onCancelMarker={handleCancelMarker} />
      )}

      {/* --- PANEL SIMULASI --- */}
      {(activeTool === "simulasi" || isDrawing) && (
        <SimulasiPanel
          onStartDrawing={handleStartDrawing}
          isDrawing={isDrawing}
          hasLine={hasLine}
          onDeleteLine={clearDrawnLine}
          onClosePanel={() => setActiveTool(null)}
          onSaveLine={handleSaveLine}
          drawnLine={drawnLine}
          setActiveTool={setActiveTool}
        />
      )}
    </>
  );
}
