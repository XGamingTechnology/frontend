// src/components/map/MeasureTool.tsx
"use client";
import { useEffect, useState } from "react";
import { useMap, Polyline, Tooltip } from "react-leaflet";
import * as L from "leaflet";

export default function MeasureTool() {
  const map = useMap();
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [points, setPoints] = useState<L.LatLng[]>([]);

  // Hitung jarak (Haversine)
  const calculateDistance = (latlng1: L.LatLng, latlng2: L.LatLng): number => {
    const R = 6371000;
    const toRad = (x: number) => (x * Math.PI) / 180;
    const dLat = toRad(latlng2.lat - latlng1.lat);
    const dLon = toRad(latlng2.lng - latlng1.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(latlng1.lat)) * Math.cos(toRad(latlng2.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // meter
  };

  // Total jarak dari semua titik
  const getTotalDistance = () => {
    if (points.length < 2) return 0;
    return points.slice(1).reduce((total, point, i) => {
      return total + calculateDistance(points[i], point);
    }, 0);
  };

  // Format jarak: 1234 m → "1.23 km"
  const formatDistance = (meters: number): string => {
    return meters >= 1000 ? `${(meters / 1000).toFixed(2)} km` : `${Math.round(meters)} m`;
  };

  // Saat mengukur aktif
  useEffect(() => {
    if (!isMeasuring) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      setPoints((prev) => [...prev, e.latlng]);
    };

    const handleRightClick = (e: L.LeafletMouseEvent) => {
      e.originalEvent.preventDefault();
      setIsMeasuring(false);
    };

    map.on("click", handleClick);
    map.on("contextmenu", handleRightClick);

    return () => {
      map.off("click", handleClick);
      map.off("contextmenu", handleRightClick);
    };
  }, [isMeasuring, map]);

  // Reset saat selesai
  useEffect(() => {
    if (!isMeasuring) setPoints([]);
  }, [isMeasuring]);

  return (
    <>
      {/* Tombol Kontrol */}
      <div
        style={{
          position: "absolute",
          bottom: "90px",
          left: "10px",
          zIndex: 1000,
          background: "#1e40af",
          color: "white",
          borderRadius: "4px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          padding: "6px 12px",
          cursor: "pointer",
        }}
        onClick={() => setIsMeasuring(!isMeasuring)}
      >
        <span style={{ fontSize: "16px" }}>📏</span>
        <span style={{ fontSize: "12px", fontWeight: "bold", marginLeft: "4px" }}>{isMeasuring ? "Selesai" : "Ukur"}</span>
      </div>

      {/* Garis Ukur */}
      {points.length > 1 && (
        <Polyline positions={points} color="red" weight={3} opacity={0.8}>
          {/* Tooltip menunjukkan total jarak */}
          <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
            {formatDistance(getTotalDistance())}
          </Tooltip>
        </Polyline>
      )}
    </>
  );
}
