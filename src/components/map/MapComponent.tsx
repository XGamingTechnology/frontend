// src/components/map/MapComponent.tsx
"use client";
import * as L from "leaflet";
import { MapContainer, TileLayer, useMapEvents, ZoomControl, useMap, Marker, Popup, GeoJSON, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MutableRefObject, useEffect, useState } from "react";
import { Map as LeafletMap, Icon } from "leaflet";
import { useTool } from "@/context/ToolContext";
import { useData } from "@/context/DataContext";
import ToponimiFormModal from "@/components/forms/ToponimiFormModal";
import SimulasiPanel from "@/components/panels/SimulasiPanel";
import LineSurveyPanel from "@/components/panels/LineSurveyPanel"; // ✅ Import langsung
import type { Feature } from "geojson";

const buoyIcon = new Icon({
  iconUrl: "/Pin.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
const userIcon = buoyIcon;
const startIcon = buoyIcon;
const endIcon = buoyIcon;

function MapRefSetter({ mapRef }: { mapRef: MutableRefObject<LeafletMap | null> }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
}

function UserLocationMarker({ location }: { location: [number, number] }) {
  return (
    <Marker position={location} icon={userIcon}>
      <Popup>📍 Kamu di sini</Popup>
    </Marker>
  );
}

function useSpatialFeatures(layerType?: string, source?: string) {
  const { features: allFeatures } = useData();
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    if (!allFeatures) return;
    let filtered = allFeatures.features || [];
    if (layerType) filtered = filtered.filter((f) => f.properties?.layerType === layerType);
    if (source) filtered = filtered.filter((f) => f.properties?.source === source);
    setFeatures(filtered);
  }, [allFeatures, layerType, source]);

  return { features };
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
  // ✅ Perbaiki URL tile: hapus spasi
  const tileLayers: Record<string, string> = {
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    terrain: "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
  };
  const tileUrl = tileLayers[basemapType] || tileLayers["osm"];

  const { layerDefinitions, layerVisibility, refreshData } = useData();
  const { activeTool, setActiveTool, formLatLng, setFormLatLng, showToponimiForm, setShowToponimiForm, routePoints, setRoutePoints, surveyMode, setSurveyMode } = useTool();

  const { features: centerlineFeatures } = useSpatialFeatures("centerline");
  const { features: sungaiFeatures } = useSpatialFeatures("sungai");
  const { features: toponimiFeatures } = useSpatialFeatures("toponimi");
  const { features: batimetriFeatures } = useSpatialFeatures("batimetri");
  const { features: areaSungaiFeatures } = useSpatialFeatures("area_sungai");
  const { features: riverLineFeatures } = useSpatialFeatures("river_line");
  const { features: samplingPointFeatures } = useSpatialFeatures("valid_sampling_point");
  const { features: transectLineFeatures } = useSpatialFeatures("valid_transect_line");

  // ✅ State untuk garis yang sedang digambar
  const [drawnLine, setDrawnLine] = useState<L.LatLng[]>([]);
  const [draftId, setDraftId] = useState<number | null>(null); // Untuk simpan ID dari backend

  const isDrawing = activeTool === "drawline" || activeTool === "drawline-transek";
  const hasLine = drawnLine.length > 0;

  // ✅ Hanya tambahkan titik, tanpa auto-stop
  const addPointToDrawnLine = (latlng: L.LatLng) => {
    setDrawnLine((prev) => [...prev, latlng]);
  };

  const clearDrawnLine = () => setDrawnLine([]);

  // ✅ Simpan draft ke backend
  const handleSaveDraft = async () => {
    if (drawnLine.length < 2) {
      alert("Garis harus memiliki minimal 2 titik.");
      return;
    }
    const lineCoords = drawnLine.map((latlng) => [latlng.lng, latlng.lat]) as [number, number][];
    const geojsonLine = { type: "LineString", coordinates: lineCoords };
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
        const newDraftId = data.data.saveRiverLineDraft.draftId;
        setDraftId(newDraftId);
        alert(`✅ ${data.data.saveRiverLineDraft.message}`);
        refreshData();
      } else {
        throw new Error(data.data?.saveRiverLineDraft.message || "Gagal simpan draft");
      }
    } catch (err: any) {
      console.error("❌ Gagal simpan draft:", err);
      alert(`❌ Gagal: ${err.message}`);
    }
  };

  // ✅ Event handler untuk peta
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
              L.marker(e.latlng, { icon: newPoints.length === 1 ? startIcon : endIcon })
                .addTo(mapRef.current)
                .bindPopup(newPoints.length === 1 ? "Titik Awal" : "Titik Akhir")
                .openPopup();
            }
          }
        } else if (isDrawing) {
          addPointToDrawnLine(e.latlng);
        }
      },
      contextmenu(e) {
        e.originalEvent.preventDefault(); // Cegah menu browser
        if (isDrawing) {
          if (drawnLine.length < 2) {
            alert("❌ Minimal 2 titik untuk membuat garis.");
            return;
          }
          setActiveTool(null); // Matikan tool
          // Tidak perlu alert panjang — cukup lanjut ke simpan
        }
      },
    });
    return null;
  };

  // ✅ Tambah toponimi manual
  const handleAddToponimi = async ({ nama, deskripsi }: { nama: string; deskripsi: string }) => {
    if (!formLatLng) return;
    try {
      const pointGeoJSON = { type: "Point", coordinates: [formLatLng.lng, formLatLng.lat] };
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
        refreshData();
      } else {
        alert(result.errors?.[0]?.message || "Gagal menyimpan");
      }
    } catch {
      alert("Tidak dapat terhubung ke server.");
    }
  };

  const handleCancelMarker = () => {
    setFormLatLng(null);
    setShowToponimiForm(false);
  };

  return (
    <>
      <MapContainer center={[-2.98, 104.76]} zoom={13} zoomControl={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer attribution="&copy; contributors" url={tileUrl} />
        <ZoomControl position="bottomright" />
        <MapEvents />
        <MapRefSetter mapRef={mapRef} />
        {userLocation && <UserLocationMarker location={userLocation} />}

        {/* Render semua layer */}
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
          }

          if (!isVisible || features.length === 0) return null;

          if (pointLayerType) {
            return (
              <GeoJSON
                key={layer.id}
                data={{ type: "FeatureCollection", features }}
                pointToLayer={(point, latlng) =>
                  L.circleMarker(latlng, {
                    radius: layer.meta?.radius || 6,
                    color: point.properties?.color || layer.meta?.color || "#16a34a",
                    fillColor: point.properties?.color || layer.meta?.fillColor || "#16a34a",
                    fillOpacity: layer.meta?.fillOpacity || 0.7,
                  })
                }
                onEachFeature={(feature, layer) => {
                  layer.bindPopup(`<strong>${feature.properties?.name || feature.properties?.transectId}</strong>`);
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
                layer.bindPopup(`<strong>${feature.properties?.name || feature.properties?.transectId}</strong>`);
              }}
            />
          );
        })}

        {/* Tampilkan garis yang sedang digambar */}
        {drawnLine.length > 0 && <Polyline positions={drawnLine} color="red" weight={4} opacity={0.8} />}
      </MapContainer>

      {/* Modal tambah toponimi */}
      {showToponimiForm && formLatLng && activeTool !== "simulasi" && (
        <ToponimiFormModal latlng={[formLatLng.lat, formLatLng.lng]} onClose={() => setShowToponimiForm(false)} onSubmit={handleAddToponimi} onCancelMarker={handleCancelMarker} />
      )}

      {/* ✅ 1. SimulasiPanel: Hanya muncul saat activeTool === "simulasi" */}
      {activeTool === "simulasi" && <SimulasiPanel onClosePanel={() => setActiveTool(null)} setActiveTool={setActiveTool} setSurveyMode={setSurveyMode} />}

      {/* ✅ 2. LineSurveyPanel: Muncul langsung jika surveyMode === "line" */}
      {surveyMode === "line" && (
        <LineSurveyPanel
          onClose={() => {
            setSurveyMode(null);
            setActiveTool(null);
            setDrawnLine([]);
            setDraftId(null);
          }}
          drawnLine={drawnLine}
          isDrawing={isDrawing}
          hasLine={hasLine}
          onDeleteLine={clearDrawnLine}
          onSaveDraft={handleSaveDraft}
          draftId={draftId}
          setDraftId={setDraftId}
          setActiveTool={setActiveTool}
        />
      )}
    </>
  );
}
