// src/context/ToolContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import * as L from "leaflet";
import type { Feature, FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

// --- Tipe Tool: Perjelas makna tiap tool ---
export type Tool =
  | "toponimi"
  | "rute"
  | "echosounder"
  | "simulasi" // Menu utama simulasi
  | "drawline" // Generic draw line (untuk kompatibilitas)
  | "drawline-transek" // Khusus untuk transek sungai
  | "drawpolygon" // Untuk survei area
  | "drawpolygon-transek"
  | null;

// --- Tipe Mode Survei (opsional, untuk lacak konteks) ---
type SurveyMode = "line" | "polygon" | null;

interface ToolContextType {
  // --- STATE UTAMA ---
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;

  // --- FORM & INPUT ---
  showToponimiForm: boolean;
  setShowToponimiForm: (value: boolean) => void;

  formLatLng: L.LatLng | null;
  setFormLatLng: (value: L.LatLng | null) => void;

  routePoints: L.LatLng[];
  setRoutePoints: (value: L.LatLng[]) => void;

  // --- SURVEY MODE (untuk bantu panel tahu konteks) ---
  surveyMode: SurveyMode;
  setSurveyMode: (mode: SurveyMode) => void;

  // --- LAYER VISIBILITY ---
  layers: {
    toponimi: boolean;
    sampling: boolean;
    sungai: boolean;
    batimetri: boolean;
  };
  setLayers: React.Dispatch<
    React.SetStateAction<{
      toponimi: boolean;
      sampling: boolean;
      sungai: boolean;
      batimetri: boolean;
    }>
  >;

  // --- SELEKSI & DATA ---
  selectedFeatures: Feature<Geometry, GeoJsonProperties>[];
  setSelectedFeatures: (features: Feature<Geometry, GeoJsonProperties>[]) => void;

  geojsonData: FeatureCollection | null;
  setGeojsonData: (data: FeatureCollection | null) => void;

  // --- UI ---
  showSidebarRight: boolean;
  setShowSidebarRight: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToolContext = createContext<ToolContextType | undefined>(undefined);

export function ToolProvider({ children }: { children: ReactNode }) {
  const [activeTool, setActiveTool] = useState<Tool>(null);
  const [showToponimiForm, setShowToponimiForm] = useState(false);
  const [formLatLng, setFormLatLng] = useState<L.LatLng | null>(null);
  const [routePoints, setRoutePoints] = useState<L.LatLng[]>([]);

  // ✅ Tambah: lacak mode survei saat dalam alur simulasi
  const [surveyMode, setSurveyMode] = useState<SurveyMode>(null);

  const [layers, setLayers] = useState({
    toponimi: true,
    sampling: true,
    sungai: false,
    batimetri: true,
  });

  const [selectedFeatures, setSelectedFeatures] = useState<Feature<Geometry, GeoJsonProperties>[]>([]);
  const [geojsonData, setGeojsonData] = useState<FeatureCollection | null>(null);
  const [showSidebarRight, setShowSidebarRight] = useState(false);

  return (
    <ToolContext.Provider
      value={{
        activeTool,
        setActiveTool,
        showToponimiForm,
        setShowToponimiForm,
        formLatLng,
        setFormLatLng,
        routePoints,
        setRoutePoints,
        surveyMode, // ✅ Tambahkan
        setSurveyMode, // ✅ Tambahkan
        layers,
        setLayers,
        selectedFeatures,
        setSelectedFeatures,
        geojsonData,
        setGeojsonData,
        showSidebarRight,
        setShowSidebarRight,
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
