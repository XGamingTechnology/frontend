// src/components/map/MapComponent.tsx
"use client";

import * as L from "leaflet";
import { MapContainer, TileLayer, useMapEvents, ZoomControl, useMap, Marker, Popup, GeoJSON, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MutableRefObject, useEffect, useState } from "react";
import { Map as LeafletMap, Icon, LatLngExpression } from "leaflet";
import GeoJsonLayer from "@/components/layers/GeoJsonLayer";
import { useTool } from "@/context/ToolContext";
import ToponimiFormModal from "@/components/forms/ToponimiFormModal";
import SimulasiPanel from "@/components/panels/SimulasiPanel";
import type { Feature, LineString, Point } from "geojson";
import { generateTransek } from "@/lib/geotools/generateTransek";

interface MapComponentProps {
  setLatLng: (coords: [number, number]) => void;
  basemapType: string;
  mapRef: MutableRefObject<LeafletMap | null>;
  userLocation?: [number, number] | null;
}

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

export default function MapComponent({ setLatLng, basemapType, mapRef, userLocation }: MapComponentProps) {
  const tileLayers: Record<string, string> = {
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    terrain: "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
  };
  const tileUrl = tileLayers[basemapType] || tileLayers["osm"];
  const [centerline, setCenterline] = useState<any>(null);

  // --- STATE UNTUK TRANSEK DAN SAMPLING POINT (LOKAL) ---
  // State ini dikelola secara lokal karena hasil dari logika spesifik komponen ini.
  const [allTransects, setAllTransects] = useState<Feature<LineString>[]>([]);
  const [samplingPoints, setSamplingPoints] = useState<Feature<Point>[]>([]);

  const {
    activeTool,
    setActiveTool,
    formLatLng,
    setFormLatLng,
    showToponimiForm,
    setShowToponimiForm,
    routePoints,
    setRoutePoints,
    // --- STATE DARI TOOLCONTEXT ---
    // Hanya gunakan state tools/UI dari context.
    // State hasil perhitungan seperti samplingPoints di context diabaikan.
    layers,
  } = useTool();

  // --- STATE UNTUK DRAWLINE TOOL (LOKAL) ---
  // State ini tetap dikelola secara lokal karena spesifik untuk interaksi menggambar di komponen ini.
  const [drawnLine, setDrawnLine] = useState<L.LatLng[]>([]);

  const isDrawing = activeTool === "drawline";
  const hasLine = drawnLine.length > 0;

  const addPointToDrawnLine = (latlng: L.LatLng) => {
    setDrawnLine((prev) => [...prev, latlng]);
  };

  // --- FUNGSI UNTUK MENGHAPUS GARIS DAN RESET STATE TRANSEK LOKAL ---
  const clearDrawnLine = () => {
    setDrawnLine([]);
    // Reset state hasil generateTransek yang dikelola secara lokal
    setAllTransects([]);
    setSamplingPoints([]);
    // JANGAN panggil setActiveTool(null) di sini jika hanya ingin hapus garis
    // setActiveTool(null);
    // Fungsi ini sekarang hanya untuk membersihkan garis dan hasil generate lokal.
  };

  // --- FUNGSI UNTUK MENGHASILKAN TRANSEK MENTAH ---
  const handleGenerateTransek = (spasi: number, panjang: number) => {
    console.log("handleGenerateTransek dipanggil dengan:", { spasi, panjang });
    if (!drawnLine || drawnLine.length < 2) {
      alert("Garis sungai belum digambar.");
      return;
    }

    // Buat Feature<LineString> dari drawnLine
    const lineCoords = drawnLine.map((latlng) => [latlng.lng, latlng.lat]);
    const riverLine: Feature<LineString> = {
      type: "Feature",
      geometry: { type: "LineString", coordinates: lineCoords },
      properties: {},
    };

    try {
      // Signature: generateTransek(riverLine, spasi, panjang, useAutoBuffer)
      const result = generateTransek(riverLine, spasi, panjang, true); // useAutoBuffer = true
      if (result) {
        // Simpan hasil ke state lokal komponen
        setAllTransects(result.allTransects);
        setSamplingPoints(result.samplingPoints);
        console.log("Hasil generateTransek (mentah):", result);
        // Tetap di mode simulasi untuk menampilkan hasil
      } else {
        alert("Gagal menghasilkan transek. Silakan cek console untuk detail.");
        console.error("generateTransek mengembalikan null/undefined");
      }
    } catch (error) {
      console.error("Error saat memanggil generateTransek:", error);
      alert("Terjadi kesalahan saat menghasilkan transek.");
    }
  };

  // --- FUNGSI UNTUK MEMULAI MENGgambar GARIS ---
  const handleStartDrawing = () => {
    setDrawnLine([]);
    // Reset state hasil sebelumnya saat mulai menggambar baru
    setAllTransects([]);
    setSamplingPoints([]);
    setActiveTool("drawline");
  };

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
          // Opsional: Otomatis hentikan drawing setelah selesai?
          // setActiveTool(null);
        }
      },
    });
    return null;
  };

  const handleAddToponimi = ({ nama, deskripsi }: { nama: string; deskripsi: string }) => {
    if (!formLatLng || !mapRef.current) return;
    L.marker(formLatLng, { icon: buoyIcon }).addTo(mapRef.current).bindPopup(`<strong>${nama}</strong><br/>${deskripsi}`);
    setFormLatLng(null);
    setShowToponimiForm(false);
  };

  const handleCancelMarker = () => {
    setFormLatLng(null);
    setShowToponimiForm(false);
  };

  // --- FETCH DATA STATIC (CENTERLINE) ---
  useEffect(() => {
    fetch("/data/centerline.geojson")
      .then((res) => res.json())
      .then((data) => {
        setCenterline(data);
      })
      .catch((err) => console.error("Error fetching centerline:", err));
  }, []);

  // --- FETCH DATA POLYGON SUNGAI (DIKOMENTARI) ---
  // Komentari atau hapus fetch riverPolygons karena tidak digunakan lagi
  // untuk clipping di tahap generate
  /*
  useEffect(() => {
    fetch("/data/sungai.geojson")
      .then((res) => res.json())
      .then((data) => {
        // Logika pemrosesan polygon jika diperlukan untuk layer tampilan
        // atau untuk proses clipping terpisah nanti
      })
      .catch((err) => console.error("Error fetching river polygons:", err));
  }, [mapRef]);
  */

  return (
    <>
      <MapContainer center={[-2.98, 104.76]} zoom={13} zoomControl={false} style={{ height: "100%", width: "100%" }} className="z-0">
        <TileLayer attribution="&copy; contributors" url={tileUrl} />
        <ZoomControl position="bottomright" />
        <MapEvents />
        <MapRefSetter mapRef={mapRef} />
        {userLocation && <UserLocationMarker location={userLocation} />}
        {centerline && <GeoJSON data={centerline} style={{ color: "blue", weight: 3 }} />}

        {/* --- TAMPILAN GARIS YANG DIGAMBAR --- */}
        {drawnLine.length > 0 && <Polyline positions={drawnLine} color="red" weight={4} />}

        {/* --- TAMPILAN TRANSEK YANG DIHASILKAN (MENTAH) --- */}
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
                alert(`ID: ${transek.properties?.id}\n` + `Jarak: ${transek.properties?.distanceFromStart}m\n` + `Bearing: ${transek.properties?.bearing}\n` + `Panjang Teoritis: ${transek.properties?.theoreticalLength}m`);
              },
            }}
          />
        ))}

        {/* --- TAMPILAN TITIK SAMPLING --- */}
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

        {/* --- LAYER TAMBAHAN (GeoJsonLayer) --- */}
        {layers.batimetri && <GeoJsonLayer url="/data/toponimi.geojson" popupField="kedalaman" color="#9333ea" radius={6} />}
        {layers.toponimi && <GeoJsonLayer url="/data/toponimi.geojson" popupField="kedalaman" marker />}
        {layers.sungai && <GeoJsonLayer url="/data/sungai.geojson" popupField="nama" color="#0284c7" />}
      </MapContainer>

      {/* --- MODAL FORM TOPONIMI --- */}
      {showToponimiForm && formLatLng && activeTool !== "simulasi" && (
        <ToponimiFormModal latlng={[formLatLng.lat, formLatLng.lng]} onClose={() => setShowToponimiForm(false)} onSubmit={handleAddToponimi} onCancelMarker={handleCancelMarker} />
      )}

      {/* --- PANEL SIMULASI TRANSEK --- */}
      {/* Perbarui pemanggilan SimulasiPanel - hapus props terkait polygon */}
      {/* Asumsi SimulasiPanel sudah memiliki tombol Hapus dan Tutup di dalamnya */}
      {(activeTool === "simulasi" || isDrawing) && (
        <SimulasiPanel
          onGenerate={handleGenerateTransek}
          onStartDrawing={handleStartDrawing}
          isDrawing={isDrawing}
          hasLine={hasLine}
          // --- PROPS UNTUK KONTROL TAMBAHAN ---
          onDeleteLine={clearDrawnLine}
          onClosePanel={() => {
            // Logika tutup panel: keluar dari mode (ini yang menutup panel)
            setActiveTool(null);
          }}
        />
      )}

      {/* --- TOMBOL "HAPUS GARIS" TERPISAH (DIKOMENTARI) --- */}
      {/* 
      {(isDrawing || hasLine) && drawnLine.length > 0 && (
        <button
          onClick={clearDrawnLine}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 999,
            padding: "6px 12px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Hapus Garis
        </button>
      )} 
      */}
    </>
  );
}
