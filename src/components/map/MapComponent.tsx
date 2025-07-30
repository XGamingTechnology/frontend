// src/components/map/MapComponent.tsx
"use client";
import * as L from "leaflet";
import { MapContainer, TileLayer, useMapEvents, ZoomControl, useMap, Marker, Popup, GeoJSON, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MutableRefObject, useEffect, useState } from "react";
import { Map as LeafletMap, Icon, LatLngExpression } from "leaflet";
import { useTool } from "@/context/ToolContext";
import { useData } from "@/context/DataContext"; // 1. Impor useData
import ToponimiFormModal from "@/components/forms/ToponimiFormModal";
import SimulasiPanel from "@/components/panels/SimulasiPanel";
import type { Feature, LineString, Point } from "geojson";
import { generateTransek } from "@/lib/geotools/generateTransek";

// --- Tipe untuk Spatial Feature dari GraphQL ---
interface SpatialFeature {
  id: string;
  layerType: string;
  name: string;
  description: string;
  geometry: GeoJSON.Geometry;
  source: string;
  metadata: Record<string, any>;
  createdAt: string;
  createdBy: string | null;
}

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query GetSpatialFeatures($layerType: String, $source: String) {
                spatialFeatures(layerType: $layerType, source: $source) {
                  id
                  layerType
                  name
                  description
                  geometry
                  source
                  metadata
                }
              }
            `,
            variables: { layerType, source },
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors.map((e: any) => e.message).join(", "));
        }

        if (result.data?.spatialFeatures) {
          const mapped = result.data.spatialFeatures.map((f: SpatialFeature) => ({
            type: "Feature",
            properties: {
              id: f.id,
              name: f.name,
              description: f.description,
              layerType: f.layerType,
              source: f.source,
              ...f.metadata,
            },
            geometry: f.geometry,
          }));
          setFeatures(mapped);
        }
      } catch (err: any) {
        console.error("Gagal ambil data spasial:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [layerType, source]);

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

  // --- Ambil data spasial dari backend ---
  const { features: centerlineFeatures } = useSpatialFeatures("centerline");
  const { features: sungaiFeatures } = useSpatialFeatures("sungai");
  const { features: toponimiFeatures } = useSpatialFeatures("toponimi");

  // --- Gunakan DataContext untuk visibilitas layer ---
  const { layerVisibility } = useData();

  // --- State untuk hasil generate transek ---
  const [allTransects, setAllTransects] = useState<Feature<LineString>[]>([]);
  const [samplingPoints, setSamplingPoints] = useState<Feature<Point>[]>([]);

  // --- State untuk menggambar garis ---
  const [drawnLine, setDrawnLine] = useState<L.LatLng[]>([]);

  const { activeTool, setActiveTool, formLatLng, setFormLatLng, showToponimiForm, setShowToponimiForm, routePoints, setRoutePoints } = useTool();

  const isDrawing = activeTool === "drawline";
  const hasLine = drawnLine.length > 0;

  const addPointToDrawnLine = (latlng: L.LatLng) => {
    setDrawnLine((prev) => [...prev, latlng]);
  };

  const clearDrawnLine = () => {
    setDrawnLine([]);
    setAllTransects([]);
    setSamplingPoints([]);
  };

  const handleGenerateTransek = (spasi: number, panjang: number) => {
    if (!drawnLine || drawnLine.length < 2) {
      alert("Garis sungai belum digambar.");
      return;
    }

    const lineCoords = drawnLine.map((latlng) => [latlng.lng, latlng.lat]);
    const riverLine: Feature<LineString> = {
      type: "Feature",
      geometry: { type: "LineString", coordinates: lineCoords },
      properties: {},
    };

    try {
      const result = generateTransek(riverLine, spasi, panjang, true);
      if (result) {
        setAllTransects(result.allTransects);
        setSamplingPoints(result.samplingPoints);
      } else {
        alert("Gagal menghasilkan transek.");
      }
    } catch (error) {
      console.error("Error saat memanggil generateTransek:", error);
      alert("Terjadi kesalahan saat menghasilkan transek.");
    }
  };

  const handleStartDrawing = () => {
    setDrawnLine([]);
    setAllTransects([]);
    setSamplingPoints([]);
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
          alert("Garis selesai digambar.");
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
            ) {
              createSpatialFeature(
                layerType: $layerType
                name: $name
                description: $description
                geometry: $geometry
                source: $source
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
            source: "user_input",
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

        {/* --- TAMPILAN DATA DINAMIS --- */}
        {layerVisibility.centerline && centerlineFeatures.map((feature) => <GeoJSON key={feature.properties?.id} data={feature} style={{ color: "blue", weight: 3 }} />)}

        {layerVisibility.sungai && sungaiFeatures.map((feature) => <GeoJSON key={feature.properties?.id} data={feature} style={{ color: "#0284c7", weight: 2 }} />)}

        {layerVisibility.toponimi &&
          toponimiFeatures.map((feature) => (
            <GeoJSON
              key={feature.properties?.id}
              data={feature}
              pointToLayer={(point, latlng) =>
                L.circleMarker(latlng, {
                  radius: 6,
                  color: feature.properties?.markerColor || "#9333ea",
                  fillColor: feature.properties?.fillColor || "#9333ea",
                  fillOpacity: 0.7,
                })
              }
              onEachFeature={(feature, layer) => {
                const popupContent = `<strong>${feature.properties?.name}</strong><br/>${feature.properties?.description}`;
                layer.bindPopup(popupContent);
              }}
            />
          ))}

        {/* --- GARIS YANG DIGAMBAR --- */}
        {drawnLine.length > 0 && <Polyline positions={drawnLine} color="red" weight={4} />}

        {/* --- HASIL GENERATE TRANSEK --- */}
        {allTransects.map((transek) => (
          <GeoJSON
            key={transek.properties?.id || transek.properties?.index}
            data={transek}
            style={{
              color: transek.properties?.color || "blue",
              weight: 2,
            }}
            eventHandlers={{
              click: () => {
                alert(
                  `ID: ${transek.properties?.id}
Jarak: ${transek.properties?.distanceFromStart}m
Bearing: ${transek.properties?.bearing}
Panjang Teoritis: ${transek.properties?.theoreticalLength}m`
                );
              },
            }}
          />
        ))}

        {samplingPoints.map((pt, i) => (
          <Marker
            key={`sampling-${i}`}
            position={[pt.geometry.coordinates[1], pt.geometry.coordinates[0]] as LatLngExpression}
            icon={L.divIcon({
              className: "sampling-icon",
              html: `<div style="background:${pt.properties?.color || "#16a34a"};width:8px;height:8px;border-radius:50%;"></div>`,
            })}
          >
            <Popup>
              Sampling Point {pt.properties?.transectId || pt.properties?.index} (Dist: {pt.properties?.distanceFromStart}m)
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* --- MODAL FORM TOPONIMI --- */}
      {showToponimiForm && formLatLng && activeTool !== "simulasi" && (
        <ToponimiFormModal latlng={[formLatLng.lat, formLatLng.lng]} onClose={() => setShowToponimiForm(false)} onSubmit={handleAddToponimi} onCancelMarker={handleCancelMarker} />
      )}

      {/* --- PANEL SIMULASI --- */}
      {(activeTool === "simulasi" || isDrawing) && (
        <SimulasiPanel onGenerate={handleGenerateTransek} onStartDrawing={handleStartDrawing} isDrawing={isDrawing} hasLine={hasLine} onDeleteLine={clearDrawnLine} onClosePanel={() => setActiveTool(null)} />
      )}
    </>
  );
}
