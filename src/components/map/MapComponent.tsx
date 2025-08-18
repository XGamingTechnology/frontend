// src/components/map/MapComponent.tsx
"use client";
import * as L from "leaflet";
import { MapContainer, TileLayer, useMapEvents, ZoomControl, useMap, Marker, Popup, GeoJSON, Polyline, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MutableRefObject, useEffect, useState } from "react";
import { Map as LeafletMap, Icon } from "leaflet";
import { useTool } from "@/context/ToolContext";
import { useData } from "@/context/DataContext";
import ToponimiFormModal from "@/components/forms/ToponimiFormModal";
import SimulasiPanel from "@/components/panels/SimulasiPanel";
import LineSurveyPanel from "@/components/panels/LineSurveyPanel";
import PolygonSurveyPanel from "@/components/panels/PolygonSurveyPanel";
import type { Feature } from "geojson";

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

// --- Hook: Ambil data spatial dari DataContext ---
function useSpatialFeatures(layerType?: string, source?: string) {
  const { features: allFeatures } = useData();
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    if (!allFeatures) return;

    let filtered = allFeatures.features || [];

    if (layerType) {
      filtered = filtered.filter((f) => f.properties?.layerType === layerType);
    }
    if (source) {
      filtered = filtered.filter((f) => f.properties?.source === source);
    }

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
  // ✅ Perbaiki URL tile: hapus spasi berlebih
  const tileLayers: Record<string, string> = {
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    terrain: "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
  };
  const tileUrl = tileLayers[basemapType] || tileLayers["osm"];

  const { layerDefinitions, layerVisibility, refreshData } = useData();
  const { activeTool, setActiveTool, formLatLng, setFormLatLng, showToponimiForm, setShowToponimiForm, routePoints, setRoutePoints, surveyMode, setSurveyMode } = useTool();

  // --- Ambil data dari useSpatialFeatures ---
  const { features: centerlineFeatures } = useSpatialFeatures("centerline");
  const { features: sungaiFeatures } = useSpatialFeatures("sungai");
  const { features: toponimiFeatures } = useSpatialFeatures("toponimi");
  const { features: batimetriFeatures } = useSpatialFeatures("batimetri");
  const { features: areaSungaiFeatures } = useSpatialFeatures("area_sungai");
  const { features: riverLineFeatures } = useSpatialFeatures("river_line");
  const { features: samplingPointFeatures } = useSpatialFeatures("valid_sampling_point");
  const { features: transectLineFeatures } = useSpatialFeatures("valid_transect_line");

  // --- State untuk menggambar ---
  const [drawnLine, setDrawnLine] = useState<L.LatLng[]>([]);
  const [drawnPolygon, setDrawnPolygon] = useState<L.LatLng[]>([]);
  const [draftId, setDraftId] = useState<number | null>(null);
  const [polygonDraftId, setPolygonDraftId] = useState<number | null>(null);

  const isDrawingLine = activeTool === "drawline";
  const isDrawingPolygon = activeTool === "drawpolygon";
  const hasLine = drawnLine.length > 0;
  const hasPolygon = drawnPolygon.length > 0;

  // --- Tambah titik ---
  const addPointToDrawnLine = (latlng: L.LatLng) => {
    setDrawnLine((prev) => [...prev, latlng]);
  };

  const addPointToDrawnPolygon = (latlng: L.LatLng) => {
    setDrawnPolygon((prev) => [...prev, latlng]);
  };

  // --- Hapus semua ---
  const clearDrawnLine = () => setDrawnLine([]);
  const clearDrawnPolygon = () => setDrawnPolygon([]);

  // --- SIMPAN DRAFT GARIS ---
  const handleSaveLineDraft = async () => {
    if (drawnLine.length < 2) {
      alert("Garis harus memiliki minimal 2 titik.");
      return;
    }

    const lineCoords = drawnLine.map((latlng) => [latlng.lng, latlng.lat]) as [number, number][];
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

  // --- SIMPAN DRAFT POLYGON ---
  const handleSavePolygonDraft = async () => {
    if (drawnPolygon.length < 3) {
      alert("Polygon harus memiliki minimal 3 titik.");
      return;
    }

    const coordinates = [drawnPolygon.map((p) => [p.lng, p.lat])];
    coordinates[0].push(coordinates[0][0]);
    const geojsonPolygon = {
      type: "Polygon",
      coordinates,
    };

    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        const newDraftId = data.data.savePolygonDraft.draftId;
        setPolygonDraftId(newDraftId);
        alert(`✅ ${data.data.savePolygonDraft.message}`);
        refreshData();
      } else {
        throw new Error(data.data?.savePolygonDraft.message || "Gagal simpan draft");
      }
    } catch (err: any) {
      console.error("❌ Gagal simpan draft polygon:", err);
      alert(`❌ Gagal: ${err.message}`);
    }
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
        } else if (isDrawingLine) {
          addPointToDrawnLine(e.latlng);
        } else if (isDrawingPolygon) {
          addPointToDrawnPolygon(e.latlng);
        }
      },
      contextmenu(e) {
        e.originalEvent.preventDefault();
        if (isDrawingLine && drawnLine.length >= 2) {
          alert("Garis selesai digambar. Klik 'Simpan Draft' untuk melanjutkan.");
          setActiveTool(null);
        } else if (isDrawingPolygon && drawnPolygon.length >= 3) {
          alert("Polygon selesai digambar. Klik 'Simpan Draft' untuk melanjutkan.");
          setActiveTool(null);
        }
      },
    });
    return null;
  };

  // --- Tambah Toponimi ---
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
      <MapContainer center={[-2.98, 104.76]} zoom={13} zoomControl={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer attribution="&copy; contributors" url={tileUrl} />
        <ZoomControl position="bottomright" />
        <MapEvents />
        <MapRefSetter mapRef={mapRef} />
        {userLocation && <UserLocationMarker location={userLocation} />}

        {/* --- RENDER SEMUA LAYER --- */}
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
                pointToLayer={(point, latlng) =>
                  L.circleMarker(latlng, {
                    radius: layer.meta?.radius || 6,
                    color: point.properties?.color || layer.meta?.color || "#16a34a",
                    fillColor: point.properties?.color || layer.meta?.fillColor || "#16a34a",
                    fillOpacity: layer.meta?.fillOpacity || 0.7,
                  })
                }
                onEachFeature={(feature, layer) => {
                  const props = feature.properties || {};
                  const depth = props.kedalaman !== undefined ? props.kedalaman : props.depth_value !== undefined ? props.depth_value : "-";
                  const distance = props.distance_m || props.distance_from_start || "-";
                  const transectId = props.transect_id || "Unknown";
                  const surveyId = props.survey_id ? props.survey_id.slice(-8) : "-";

                  const popupContent = `
                    <div style="
                      font-family: 'Segoe UI', sans-serif;
                      line-height: 1.4;
                      padding: 12px 16px;
                      border-radius: 8px;
                      background: white;
                      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                      max-width: 220px;
                    ">
                      <div style="background:#1e40af;color:white;padding:8px;border-radius:4px 4px 0 0;font-weight:bold;text-align:center;">
                        Sampling Point
                      </div>
                      <table style="width:100%;margin-top:8px;border-collapse:collapse;">
                        <tr style="border-bottom:1px solid #e2e8f0;">
                          <td style="padding:6px 0;color:#64748b;font-weight:500;">Transect</td>
                          <td style="padding:6px 0;text-align:right;font-weight:bold;">${transectId}</td>
                        </tr>
                        <tr style="border-bottom:1px solid #e2e8f0;">
                          <td style="padding:6px 0;color:#64748b;font-weight:500;">Survey ID</td>
                          <td style="padding:6px 0;text-align:right;font-weight:bold;">${surveyId}</td>
                        </tr>
                        <tr style="border-bottom:1px solid #e2e8f0;">
                          <td style="padding:6px 0;color:#64748b;font-weight:500;">Jarak</td>
                          <td style="padding:6px 0;text-align:right;font-weight:bold;">${distance} m</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0;color:#64748b;font-weight:500;">Kedalaman</td>
                          <td style="padding:6px 0;text-align:right;font-weight:bold;color:${depth < 0 ? "#1e40af" : "#10b981"};">${depth} m</td>
                        </tr>
                      </table>
                    </div>
                  `;
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
                const props = feature.properties || {};
                const popupContent = `
                  <div style="
                    font-family: 'Segoe UI', sans-serif;
                    line-height: 1.4;
                    padding: 12px 16px;
                    border-radius: 8px;
                    background: white;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    max-width: 200px;
                  ">
                    <div style="background:#1e40af;color:white;padding:8px;border-radius:4px 4px 0 0;font-weight:bold;text-align:center;">
                      ${props.name || props.transect_id || "Feature"}
                    </div>
                    <div style="padding:12px 0;">
                      ${props.description ? `<div style="margin-bottom:6px;"><strong style="color:#64748b;">Deskripsi:</strong> ${props.description}</div>` : ""}
                      ${props.layerType ? `<div style="margin-bottom:6px;"><strong style="color:#64748b;">Tipe:</strong> ${props.layerType}</div>` : ""}
                    </div>
                  </div>
                `;
                layer.bindPopup(popupContent);
              }}
            />
          );
        })}

        {/* --- GARIS YANG DIGAMBAR --- */}
        {drawnLine.length > 0 && <Polyline positions={drawnLine} color="red" weight={4} opacity={0.8} />}

        {/* --- POLYGON YANG DIGAMBAR --- */}
        {drawnPolygon.length > 0 && <Polygon positions={drawnPolygon} color="green" weight={3} opacity={0.8} fillOpacity={0.3} />}
      </MapContainer>

      {/* --- MODAL FORM TOPONIMI --- */}
      {showToponimiForm && formLatLng && activeTool !== "simulasi" && (
        <ToponimiFormModal latlng={[formLatLng.lat, formLatLng.lng]} onClose={() => setShowToponimiForm(false)} onSubmit={handleAddToponimi} onCancelMarker={handleCancelMarker} />
      )}

      {/* --- PANEL SIMULASI (Pemilih Alur) --- */}
      {activeTool === "simulasi" && (
        <SimulasiPanel
          onClosePanel={() => setActiveTool(null)}
          setActiveTool={setActiveTool}
          setSurveyMode={setSurveyMode}
          drawnLine={drawnLine}
          drawnPolygon={drawnPolygon}
          isDrawingLine={isDrawingLine}
          isDrawingPolygon={isDrawingPolygon}
          clearDrawnLine={clearDrawnLine}
          clearDrawnPolygon={clearDrawnPolygon}
        />
      )}

      {/* --- PANEL PROSES GARIS --- */}
      {surveyMode === "line" && (
        <LineSurveyPanel
          onClose={() => {
            setSurveyMode(null);
            setActiveTool(null);
            setDrawnLine([]);
            setDraftId(null);
          }}
          drawnLine={drawnLine}
          isDrawing={isDrawingLine}
          hasLine={hasLine}
          onDeleteLine={clearDrawnLine}
          onSaveDraft={handleSaveLineDraft}
          draftId={draftId}
          setDraftId={setDraftId}
          setActiveTool={setActiveTool}
        />
      )}

      {/* --- PANEL PROSES POLYGON --- */}
      {surveyMode === "polygon" && (
        <PolygonSurveyPanel
          onClose={() => {
            setSurveyMode(null);
            setActiveTool(null);
            setDrawnPolygon([]);
            setPolygonDraftId(null);
          }}
          drawnPolygon={drawnPolygon}
          isDrawing={isDrawingPolygon}
          hasPolygon={hasPolygon}
          onDeletePolygon={clearDrawnPolygon}
          onSaveDraft={handleSavePolygonDraft}
          draftId={polygonDraftId}
          setDraftId={setPolygonDraftId}
          setActiveTool={setActiveTool}
        />
      )}
    </>
  );
}
