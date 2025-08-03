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
import * as turf from "@turf/turf";
import { generateTransek } from "@/lib/geotools/generateTransek";

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
                  meta
                }
              }
            `,
            variables: { layerType, source },
          }),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        if (result.errors) {
          throw new Error(result.errors.map((e: any) => e.message).join(", "));
        }
        if (result.data?.spatialFeatures) {
          const mapped = result.data.spatialFeatures.map((f: any) => {
            return turf.feature(f.geometry, {
              id: f.id,
              name: f.name,
              description: f.description,
              layerType: f.layerType,
              source: f.source,
              ...f.meta,
            });
          });
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

  // --- Gunakan DataContext untuk layer dinamis ---
  const { layerDefinitions, layerVisibility, setLayerVisibility, addFeature, riverLine, setRiverLine } = useData();

  // --- Gunakan ToolContext untuk state UI ---
  const { activeTool, setActiveTool, formLatLng, setFormLatLng, showToponimiForm, setShowToponimiForm, routePoints, setRoutePoints } = useTool();

  // --- Ambil SEMUA data dari database ---
  const { features: centerlineFeatures } = useSpatialFeatures("centerline");
  const { features: sungaiFeatures } = useSpatialFeatures("sungai");
  const { features: toponimiFeatures } = useSpatialFeatures("toponimi");
  const { features: batimetriFeatures } = useSpatialFeatures("batimetri");
  const { features: areaSungaiFeatures } = useSpatialFeatures("area_sungai");
  const { features: riverLineFeatures } = useSpatialFeatures("river_line");
  const { features: samplingPointFeatures } = useSpatialFeatures("sampling_point");
  const { features: transectLineFeatures } = useSpatialFeatures("transect_line");

  // --- State untuk hasil generate transek ---
  const [allTransects, setAllTransects] = useState<Feature<LineString>[]>([]);
  const [samplingPoints, setSamplingPoints] = useState<Feature<Point>[]>([]);

  // --- State untuk menggambar garis ---
  const [drawnLine, setDrawnLine] = useState<L.LatLng[]>([]);
  const isDrawing = activeTool === "drawline";
  const hasLine = drawnLine.length > 0;

  const addPointToDrawnLine = (latlng: L.LatLng) => {
    setDrawnLine((prev) => [...prev, latlng]);
  };

  const clearDrawnLine = () => {
    setDrawnLine([]);
    setAllTransects([]);
    setSamplingPoints([]);
    setRiverLine(null);
  };

  // --- Simpan hasil draw ke database ---
  const handleSaveLine = async () => {
    if (drawnLine.length < 2) {
      alert("Garis belum lengkap.");
      return;
    }
    const lineCoords = drawnLine.map((latlng) => [latlng.lng, latlng.lat] as [number, number]);
    const geojsonLine: Feature<LineString> = turf.lineString(lineCoords, {
      layerType: "river_line",
      name: `Rute Sungai - ${new Date().toLocaleDateString()}`,
      description: "Garis dasar untuk transek otomatis",
      createdAt: new Date().toISOString(),
      source: "manual",
    });
    try {
      await addFeature(geojsonLine);
      setRiverLine(geojsonLine);
      alert("✅ Garis sungai berhasil disimpan ke database.");
    } catch (err: any) {
      console.error("Gagal simpan river_line:", err);
      alert("Gagal menyimpan ke server: " + err.message);
    }
  };

  // --- SIMPAN SAMPLING POINTS KE DATABASE (PERBAIKAN PENUH) ---
  const saveSamplingPoints = async (points: Feature<Point>[]) => {
    let savedCount = 0;
    const failedPoints: any[] = [];

    const promises = points.map(async (point, index) => {
      try {
        const coords = point.geometry.coordinates;
        if (!coords || coords.length !== 2) {
          throw new Error("Koordinat tidak valid");
        }

        // 🔢 PAKSA ke number primitif
        const lng = parseFloat(coords[0].toString());
        const lat = parseFloat(coords[1].toString());

        if (isNaN(lng) || isNaN(lat)) {
          throw new Error(`Koordinat bukan angka: [${coords[0]}, ${coords[1]}]`);
        }

        // 🔥 DEBUG: Cek tipe sebelum kirim
        console.log(`📤 [saveSamplingPoints] Point ${index}:`, { lng, lat, typeofLng: typeof lng, typeofLat: typeof lat });

        // ✅ Buat feature secara langsung, tanpa turf.feature jika tidak perlu
        const feature = {
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: [lng, lat] as [number, number],
          },
          properties: {
            layerType: "sampling_point",
            name: `Sampling Point - ${point.properties?.transectId}`,
            description: `Titik tengah transek ${point.properties?.transectId}`,
            transectId: point.properties?.transectId,
            distanceFromStart: parseFloat((point.properties?.distanceFromStart || 0).toFixed(2)),
            source: "manual",
          },
        };

        await addFeature(feature);
        savedCount++;
      } catch (err: any) {
        console.error(`❌ Gagal simpan point ${index}:`, err);
        failedPoints.push({ index, error: err.message });
      }
    });

    await Promise.all(promises);

    if (failedPoints.length === 0) {
      alert(`✅ ${savedCount} sampling point berhasil disimpan!`);
    } else {
      alert(`⚠️ ${savedCount} berhasil, ${failedPoints.length} gagal. Cek console.`);
    }
  };

  // --- SIMPAN TRANSEK LINES KE DATABASE ---
  const saveTransectLines = async (transects: Feature<LineString>[]) => {
    let savedCount = 0;
    const promises = transects.map(async (transect) => {
      try {
        const coords = transect.geometry.coordinates;
        if (!coords || !Array.isArray(coords)) {
          console.warn("Koordinat transek tidak valid:", transect);
          return;
        }

        // Validasi semua titik
        for (const line of coords) {
          if (line.length !== 2 || isNaN(parseFloat(line[0])) || isNaN(parseFloat(line[1]))) {
            throw new Error("Koordinat transek mengandung nilai tidak valid");
          }
        }

        const feature = {
          type: "Feature" as const,
          geometry: {
            type: "LineString" as const,
            coordinates: coords.map((coord) => [parseFloat(coord[0].toString()), parseFloat(coord[1].toString())]) as [number, number][],
          },
          properties: {
            layerType: "transect_line",
            name: transect.properties?.id || `Transek-${transect.properties?.index}`,
            description: `Transek tegak lurus sungai, jarak: ${transect.properties?.distanceFromStart}m`,
            distanceFromStart: parseFloat((transect.properties?.distanceFromStart || 0).toFixed(2)),
            bearing: transect.properties?.bearing,
            source: "manual",
          },
        };

        await addFeature(feature);
        savedCount++;
      } catch (err) {
        console.error("Gagal simpan transect line:", err);
      }
    });

    await Promise.all(promises);
    alert(`✅ ${savedCount} dari ${transects.length} garis transek berhasil disimpan!`);
  };

  const handleGenerateTransek = (spasi: number, panjang: number) => {
    if (!drawnLine || drawnLine.length < 2) {
      alert("Garis sungai belum digambar.");
      return;
    }
    const lineCoords = drawnLine.map((latlng) => [latlng.lng, latlng.lat] as [number, number]);
    const riverLine: Feature<LineString> = turf.lineString(lineCoords);
    try {
      const result = generateTransek(riverLine, spasi, panjang, true);
      if (result) {
        setAllTransects(result.allTransects);
        setSamplingPoints(result.samplingPoints);
        saveTransectLines(result.allTransects);
        saveSamplingPoints(result.samplingPoints);
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
              features = [...(riverLine ? [riverLine] : []), ...riverLineFeatures];
              break;
            case "sampling_point":
              features = samplingPointFeatures;
              break;
            case "transect_line":
              features = transectLineFeatures;
              break;
            default:
              features = [];
          }
          if (!isVisible || features.length === 0) return null;
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
              pointToLayer={(point, latlng) => {
                if (["toponimi", "sampling_point"].includes(point.properties?.layerType || "")) {
                  return L.circleMarker(latlng, {
                    radius: layer.meta?.radius || 6,
                    color: layer.meta?.color || "#9333ea",
                    fillColor: layer.meta?.fillColor || "#9333ea",
                    fillOpacity: layer.meta?.fillOpacity || 0.7,
                  });
                }
                return L.marker(latlng, { icon: buoyIcon });
              }}
              onEachFeature={(feature, layer) => {
                const popupContent = `<strong>${feature.properties?.name}</strong><br/>${feature.properties?.description || ""}`;
                layer.bindPopup(popupContent);
              }}
            />
          );
        })}

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
        <SimulasiPanel onGenerate={handleGenerateTransek} onStartDrawing={handleStartDrawing} isDrawing={isDrawing} hasLine={hasLine} onDeleteLine={clearDrawnLine} onClosePanel={() => setActiveTool(null)} onSaveLine={handleSaveLine} />
      )}
    </>
  );
}
