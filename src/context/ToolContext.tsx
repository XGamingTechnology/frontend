// src/context/ToolContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import * as L from "leaflet";
import type { Feature, FeatureCollection, LineString, Point, GeoJsonProperties, Geometry } from "geojson";

// Tambahkan "drawline" di sini agar sesuai kebutuhan
export type Tool = "toponimi" | "rute" | "echosounder" | "simulasi" | "drawline" | null;

export type LayerVisibility = {
  toponimi: boolean;
  sampling: boolean;
  sungai: boolean;
  batimetri: boolean;
};

// Hapus interface SamplingSummary dan EchosounderPoint dari sini jika tidak digunakan secara global

interface ToolContextType {
  // --- STATE TOOLS/UI ---
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;

  showToponimiForm: boolean;
  setShowToponimiForm: (value: boolean) => void;

  formLatLng: L.LatLng | null;
  setFormLatLng: (value: L.LatLng | null) => void;

  routePoints: L.LatLng[];
  setRoutePoints: (value: L.LatLng[]) => void;

  layers: LayerVisibility;
  setLayers: React.Dispatch<React.SetStateAction<LayerVisibility>>;

  selectedFeatures: Feature<Geometry, GeoJsonProperties>[];
  setSelectedFeatures: (features: Feature<Geometry, GeoJsonProperties>[]) => void;

  geojsonData: FeatureCollection | null;
  setGeojsonData: (data: FeatureCollection | null) => void;

  showSidebarRight: boolean;
  setShowSidebarRight: React.Dispatch<React.SetStateAction<boolean>>;

  // --- STATE drawline tool SUDAH DIHAPUS ---
  // State `drawnLine` sekarang dikelola secara lokal di MapComponent.
  // drawnLine: L.LatLng[];
  // setDrawnLine: (value: L.LatLng[]) => void;
}

const ToolContext = createContext<ToolContextType | undefined>(undefined);

export function ToolProvider({ children }: { children: ReactNode }) {
  // --- STATE TOOLS/UI ---
  const [activeTool, setActiveTool] = useState<Tool>(null);
  const [showToponimiForm, setShowToponimiForm] = useState(false);
  const [formLatLng, setFormLatLng] = useState<L.LatLng | null>(null);
  const [routePoints, setRoutePoints] = useState<L.LatLng[]>([]);
  const [layers, setLayers] = useState<LayerVisibility>({
    toponimi: true,
    sampling: true,
    sungai: false,
    batimetri: true,
  });
  const [selectedFeatures, setSelectedFeatures] = useState<Feature<Geometry, GeoJsonProperties>[]>([]);
  const [geojsonData, setGeojsonData] = useState<FeatureCollection | null>(null);
  const [showSidebarRight, setShowSidebarRight] = useState(false);

  // --- STATE UNTUK DRAWLINE TOOL SUDAH DIHAPUS ---
  // State `drawnLine` sekarang dikelola secara lokal di MapComponent.
  // const [drawnLine, setDrawnLine] = useState<L.LatLng[]>([]);

  // Hapus useEffect yang menghitung samplingPoints, slicedLine, dll.
  // Logika tersebut akan dipindah ke MapComponent atau DataContext

  return (
    <ToolContext.Provider
      value={{
        // --- STATE TOOLS/UI ---
        activeTool,
        setActiveTool,
        showToponimiForm,
        setShowToponimiForm,
        formLatLng,
        setFormLatLng,
        routePoints,
        setRoutePoints,
        layers,
        setLayers,
        selectedFeatures,
        setSelectedFeatures,
        geojsonData,
        setGeojsonData,
        showSidebarRight,
        setShowSidebarRight,

        // --- STATE UNTUK DRAWLINE TOOL SUDAH DIHAPUS ---
        // drawnLine,
        // setDrawnLine,
      }}
    >
      {children}
    </ToolContext.Provider>
  );
}

export function useTool() {
  const context = useContext(ToolContext);
  if (!context) {
    throw new Error("useTool must be used within a ToolProvider");
  }
  return context;
}
