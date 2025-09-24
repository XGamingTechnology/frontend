// src/context/ToolContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import * as L from "leaflet";
import type { Feature, Geometry, GeoJsonProperties } from "geojson";

// --- Tipe Tool ---
export type Tool = "toponimi" | "rute" | "echosounder" | "simulasi" | "drawline" | "drawpolygon" | null;

// --- Tipe Mode Survei ---
type SurveyMode = "line" | "polygon" | null;

// --- Interface Context ---
interface ToolContextType {
  // --- TOOL & MODE ---
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;

  surveyMode: SurveyMode;
  setSurveyMode: (mode: SurveyMode) => void;

  // --- FORM & INPUT ---
  showToponimiForm: boolean;
  setShowToponimiForm: (value: boolean) => void;

  formLatLng: L.LatLng | null;
  setFormLatLng: (value: L.LatLng | null) => void;

  routePoints: L.LatLng[];
  setRoutePoints: (value: L.LatLng[]) => void;

  // --- SELEKSI ---
  selectedFeatures: Feature<Geometry, GeoJsonProperties>[];
  setSelectedFeatures: (features: Feature<Geometry, GeoJsonProperties>[]) => void;

  // --- UI PANEL ---
  showSidebarRight: boolean;
  setShowSidebarRight: (value: boolean) => void;

  // --- 3D PANEL ---
  show3DPanel: boolean;
  setShow3DPanel: (show: boolean) => void;

  // ✅ --- BATIMETRI PANEL ---
  isBatimetriPanelOpen: boolean;
  setIsBatimetriPanelOpen: (open: boolean) => void;
}

const ToolContext = createContext<ToolContextType | undefined>(undefined);

export function ToolProvider({ children }: { children: ReactNode }) {
  const [activeTool, setActiveTool] = useState<Tool>(null);
  const [surveyMode, setSurveyMode] = useState<SurveyMode>(null);
  const [showToponimiForm, setShowToponimiForm] = useState(false);
  const [formLatLng, setFormLatLng] = useState<L.LatLng | null>(null);
  const [routePoints, setRoutePoints] = useState<L.LatLng[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<Feature<Geometry, GeoJsonProperties>[]>([]);
  const [showSidebarRight, setShowSidebarRight] = useState(false);
  const [show3DPanel, setShow3DPanel] = useState(false);

  // ✅ Tambahkan state untuk Batimetri Panel
  const [isBatimetriPanelOpen, setIsBatimetriPanelOpen] = useState(false);

  return (
    <ToolContext.Provider
      value={{
        activeTool,
        setActiveTool,
        surveyMode,
        setSurveyMode,
        showToponimiForm,
        setShowToponimiForm,
        formLatLng,
        setFormLatLng,
        routePoints,
        setRoutePoints,
        selectedFeatures,
        setSelectedFeatures,
        showSidebarRight,
        setShowSidebarRight,
        show3DPanel,
        setShow3DPanel,

        // ✅ Ekspos state dan setter ke komponen
        isBatimetriPanelOpen,
        setIsBatimetriPanelOpen,
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
