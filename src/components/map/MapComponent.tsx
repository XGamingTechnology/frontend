// src/components/map/MapComponent.tsx
"use client";
import * as L from "leaflet";
import { MapContainer, TileLayer, useMapEvents, ZoomControl, useMap, Marker, Popup, GeoJSON, Polyline, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MutableRefObject, useEffect, useState } from "react";
import { Map as LeafletMap } from "leaflet";
import { useTool } from "@/context/ToolContext";
import { useData } from "@/context/DataContext";
import ToponimiPanel from "@/components/panels/ToponimiPanel";
import SimulasiPanel from "@/components/panels/SimulasiPanel";
import LineSurveyPanel from "@/components/panels/LineSurveyPanel";
import PolygonSurveyPanel from "@/components/panels/PolygonSurveyPanel";
import type { Feature, FeatureCollection } from "geojson";
import { getAuthHeaders, fetchWithAuth } from "@/lib/apiClient";

// --- Cegah Leaflet mencari marker-icon.png dan marker-shadow.png ---
import { Icon } from "leaflet";

// ✅ Set default icon ke file yang PASTI ADA
const DefaultIcon = L.icon({
  iconUrl: "/icons/Bendera_1.png",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
  shadowUrl: null,
});

L.Marker.prototype.options.icon = DefaultIcon;

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
    <Marker position={location}>
      <Popup>📍 Kamu di sini</Popup>
    </Marker>
  );
}

// --- Hook: Ambil data spatial dari DataContext ---
function useSpatialFeatures(layerType?: string, source?: string) {
  const { features: allFeatures } = useData();
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    if (!allFeatures?.features) return;

    let filtered: Feature[] = allFeatures.features;

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

// --- Komponen: Tombol Cetak Peta dengan leaflet-image ---
function PrintControl() {
  const map = useMap();

  const handlePrintMap = () => {
    import("leaflet-image")
      .then(({ default: leafletImage }) => {
        console.log("🔄 Mulai ekspor peta...");

        leafletImage(map, (err: any, canvas: HTMLCanvasElement) => {
          if (err) {
            console.error("❌ Gagal ambil gambar peta:", err);
            alert("Gagal mengekspor peta. Coba lagi.");
            return;
          }

          try {
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
              console.log("✅ PDF berhasil disimpan");
            });
          } catch (pdfErr) {
            console.error("❌ Gagal generate PDF:", pdfErr);
            alert("Gagal membuat PDF. Coba screenshot manual.");
          }
        });
      })
      .catch((err) => {
        console.error("❌ Gagal load leaflet-image:", err);
        alert("Modul cetak tidak tersedia. Coba refresh.");
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

// --- GLOBAL: Tambahkan show3D ke window ---
declare global {
  interface Window {
    show3D: (surveyId: string) => void;
  }
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

  const { layerDefinitions, layerVisibility, refreshData, deleteFeature, updateFeature, features: allFeatures } = useData();
  const { activeTool, setActiveTool, formLatLng, setFormLatLng, showToponimiForm, setShowToponimiForm, routePoints, setRoutePoints, surveyMode, setSurveyMode } = useTool();

  // --- Ambil data dari useSpatialFeatures ---
  const { features: toponimiFeatures } = useSpatialFeatures("toponimi");
  const { features: userToponimiFeatures } = useSpatialFeatures("toponimi_user");
  const { features: batimetriFeatures } = useSpatialFeatures("batimetri");
  const { features: areaSungaiFeatures } = useSpatialFeatures("area_sungai");
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
    } as const;

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

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message || "Gagal simpan draft");
      }

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
    } as const;

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

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server mengembalikan data tidak valid");
      }

      if (data.errors) {
        throw new Error(data.errors[0].message || "Gagal simpan draft");
      }

      if (data.data?.savePolygonDraft.success) {
        const newDraftId = data.data.savePolygonDraft.draftId;
        setPolygonDraftId(newDraftId);
        alert(`✅ ${data.data.savePolygonDraft.message}`);
        refreshData();
      } else {
        throw new Error(data.data?.savePolygonDraft.message || "Gagal simpan draft");
      }
    } catch (err: any) {
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
              L.marker(e.latlng)
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

  // --- CRUD: Edit Feature ---
  const editFeature = (feature: Feature) => {
    const newName = prompt("Nama baru:", feature.properties?.name || "");
    if (newName === null) return;

    const newDesc = prompt("Deskripsi baru:", feature.properties?.description || "");

    const updates: any = { name: newName };
    if (newDesc !== null) updates.description = newDesc;

    updateFeature(feature.id as number, updates);
  };

  // --- CRUD: Delete Feature ---
  const deleteFeatureWithConfirm = (id: number) => {
    if (confirm("Yakin ingin hapus feature ini?")) {
      deleteFeature(id);
    }
  };

  // ✅ Inisialisasi fungsi global: show3D
  useEffect(() => {
    (window as any).editFeature = editFeature;
    (window as any).deleteFeature = deleteFeatureWithConfirm;

    // ✅ Tambahkan show3D untuk trigger 3D dari popup
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

        {/* --- TOMBOL CETAK DI PETA --- */}
        <PrintControl />

        {/* --- RENDER 6 LAYER YANG DIMINTA --- */}
        {layerDefinitions
          ?.filter((layer) => ["toponimi_user", "valid_transect_line", "valid_sampling_point", "toponimi", "area_sungai", "batimetri"].includes(layer.layerType))
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
              case "batimetri":
                features = batimetriFeatures;
                break;
              default:
                return null;
            }

            if (!isVisible || features.length === 0) return null;

            // --- Valid Sampling Point (Circle) ---
            if (pointLayerType === "valid_sampling_point") {
              return (
                <GeoJSON
                  key={`valid-sampling-${features.length}`}
                  data={{ type: "FeatureCollection", features } as FeatureCollection}
                  pointToLayer={(point, latlng) =>
                    L.circleMarker(latlng, {
                      radius: layer.meta?.radius || 6,
                      color: point.properties?.color || layer.meta?.color || "#16a34a",
                      fillColor: point.properties?.color || layer.meta?.fillColor || "#16a34a",
                      fillOpacity: layer.meta?.fillOpacity || 0.7,
                    })
                  }
                  onEachFeature={(feature, layer) => {
                    console.log("Processing feature:", feature); // 🔥 Debug

                    const props = feature.properties || {};
                    const metadata = props.metadata || props; // fallback ke props jika metadata tidak ada

                    const depth = metadata.kedalaman ?? metadata.depth_value ?? "-";
                    const distance = metadata.distance_m ?? metadata.distance_from_start ?? "-";
                    const transectId = metadata.transect_id || props.transect_id || "Unknown";
                    const surveyId = metadata.survey_id || props.survey_id || "-";

                    // 🔁 Pastikan id aman
                    const featureId = feature.id || props.id || Math.random();

                    const popupContent = `
                      <div style="font-family: 'Segoe UI', sans-serif; line-height: 1.4; padding: 12px 16px; border-radius: 8px; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 220px;">
                        <div style="background:#1e40af;color:white;padding:8px;border-radius:4px 4px 0 0;font-weight:bold;text-align:center;">Sampling Point</div>
                        <table style="width:100%;margin-top:8px;border-collapse:collapse;">
                          <tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 0;color:#64748b;font-weight:500;">Transect</td><td style="padding:6px 0;text-align:right;font-weight:bold;">${transectId}</td></tr>
                          <tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 0;color:#64748b;font-weight:500;">Survey ID</td><td style="padding:6px 0;text-align:right;font-weight:bold;">${surveyId}</td></tr>
                          <tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 0;color:#64748b;font-weight:500;">Jarak</td><td style="padding:6px 0;text-align:right;font-weight:bold;">${distance} m</td></tr>
                          <tr><td style="padding:6px 0;color:#64748b;font-weight:500;">Kedalaman</td><td style="padding:6px 0;text-align:right;font-weight:bold;color:${
                            depth !== "-" && depth < 0 ? "#1e40af" : "#10b981"
                          };">${depth} m</td></tr>
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

            // --- Toponimi (User) - Gunakan ikon dari properties.icon ---
            if (layer.layerType === "toponimi_user") {
              return (
                <GeoJSON
                  key={`toponimi-user-${features.length}`}
                  data={{ type: "FeatureCollection", features } as FeatureCollection}
                  pointToLayer={(point, latlng) => {
                    const iconFilename = point.properties?.icon;
                    const fallbackIcon = "/icons/Bendera_1.png";
                    const iconUrl = iconFilename ? `/icons/${iconFilename}` : fallbackIcon;

                    if (!/\.(png)$/i.test(iconUrl)) {
                      console.warn("⚠️ Format tidak didukung:", iconUrl);
                      return L.marker(latlng, {
                        icon: L.icon({
                          iconUrl: fallbackIcon,
                          iconSize: [24, 24],
                          iconAnchor: [12, 12],
                          shadowUrl: null,
                        }),
                      });
                    }

                    return L.marker(latlng, {
                      icon: L.icon({
                        iconUrl,
                        iconSize: [24, 24],
                        iconAnchor: [12, 12],
                        shadowUrl: null,
                      }),
                    });
                  }}
                  onEachFeature={(feature, layer) => {
                    const props = feature.properties || {};
                    const popupContent = `
                      <div style="font-family: 'Segoe UI', sans-serif; line-height: 1.4; padding: 12px 16px; border-radius: 8px; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 200px;">
                        <div style="background:#1e40af;color:white;padding:8px;border-radius:4px 4px 0 0;font-weight:bold;text-align:center;">${props.name || "Toponimi"}</div>
                        <div style="padding:12px 0;">
                          ${props.description ? `<div style="margin-bottom:6px;"><strong style="color:#64748b;">Deskripsi:</strong> ${props.description}</div>` : ""}
                          <div style="margin-bottom:6px;"><strong style="color:#64748b;">Kategori:</strong> ${props.category || "-"}</div>
                        </div>
                        <div style="margin-top: 8px; display: flex; gap: 4px;">
                          <button onclick="window.editFeature(${feature.id})" style="font-size:0.8em;padding:4px 8px;background:#10b981;color:white;border:none;border-radius:4px;cursor-pointer;">✏️ Edit</button>
                          <button onclick="window.deleteFeature(${feature.id})" style="font-size:0.8em;padding:4px 8px;background:#ef4444;color:white;border:none;border-radius:4px;cursor-pointer;">🗑️ Hapus</button>
                        </div>
                      </div>
                    `;
                    layer.bindPopup(popupContent);
                  }}
                />
              );
            }

            // --- Toponimi (Existing) - Ikon default ---
            if (layer.layerType === "toponimi") {
              return (
                <GeoJSON
                  key={`toponimi-existing-${features.length}`}
                  data={{ type: "FeatureCollection", features } as FeatureCollection}
                  pointToLayer={(point, latlng) => {
                    return L.marker(latlng, {
                      icon: L.icon({
                        iconUrl: "/icons/Bendera_1.png",
                        iconSize: [24, 24],
                        iconAnchor: [12, 12],
                        shadowUrl: null,
                      }),
                    });
                  }}
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

            // --- Line & Polygon ---
            return (
              <GeoJSON
                key={layer.id}
                data={{ type: "FeatureCollection", features } as FeatureCollection}
                style={{
                  fillColor: layer.meta?.fillColor || "#0284c7",
                  color: layer.meta?.color || "#0284c7",
                  fillOpacity: layer.meta?.fillOpacity || 0.4,
                  weight: layer.meta?.weight || 2,
                  dashArray: layer.meta?.dashArray || undefined,
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
                        <button onclick="window.editFeature(${feature.id})" style="font-size:0.8em;padding:4px 8px;background:#10b981;color:white;border:none;border-radius:4px;cursor-pointer;">✏️ Edit</button>
                        <button onclick="window.deleteFeature(${feature.id})" style="font-size:0.8em;padding:4px 8px;background:#ef4444;color:white;border:none;border-radius:4px;cursor-pointer;">🗑️ Hapus</button>
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

      {/* --- PANEL TAMBAH TOPONIMI --- */}
      {showToponimiForm && <ToponimiPanel onClose={() => setShowToponimiForm(false)} />}

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
