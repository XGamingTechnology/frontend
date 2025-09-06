// src/components/map/MapLabel.tsx
"use client";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import * as L from "leaflet";

interface MapLabelProps {
  position: [number, number];
  text: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: string;
  zIndex?: number;
}

export default function MapLabel({ position, text, fontSize = 12, color = "white", backgroundColor = "rgba(0, 0, 0, 0.8)", borderRadius = 4, padding = "4px 8px", zIndex = 1000 }: MapLabelProps) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!map || !position) return;

    // ⏳ Tunggu map siap dan punya pane
    const addLabel = () => {
      // Cegah duplikat
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }

      const labelIcon = L.divIcon({
        className: "map-label-icon",
        html: `<span style="
          font-size: ${fontSize}px;
          color: ${color};
          background: ${backgroundColor};
          padding: ${padding};
          border-radius: ${borderRadius}px;
          font-weight: bold;
          white-space: nowrap;
          box-shadow: 0 1px 3px rgba(0,0,0,0.5);
          text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
          pointer-events: none;
          border: 1px solid rgba(255,255,255,0.2);
        ">${text}</span>`,
        iconSize: null,
        iconAnchor: [0, 0],
      });

      const marker = L.marker(position, {
        icon: labelIcon,
        zIndexOffset: zIndex,
        interactive: false, // ✅ Nonaktifkan interaksi jika hanya label
      }).addTo(map);

      markerRef.current = marker;
    };

    // Coba tambahkan langsung
    addLabel();

    // Jika gagal, coba saat peta selesai dimuat ulang
    map.on("moveend", addLabel);

    return () => {
      map.off("moveend", addLabel);
      if (markerRef.current && map.hasLayer?.(markerRef.current)) {
        map.removeLayer(markerRef.current);
      }
      markerRef.current = null;
    };
  }, [map, position, text, fontSize, color, backgroundColor, padding, borderRadius, zIndex]);

  return null;
}
