// src/app/map/page-inner.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import HeaderBar from "@/components/HeaderBar";
import SidebarLeft from "@/components/SidebarLeft";
import BottomPanel from "@/components/BottomPanel";
import FeaturePanel from "@/components/panels/FeaturePanel";
import BasemapSwitcher from "@/components/utils/BasemapSwitcher";
import PanelToggler from "@/components/PanelToggler";
import SamplingBottomSidebar from "@/components/SamplingBottomSidebar";
import { useTool } from "@/context/ToolContext";
import Survey3DPanel from "@/components/panels/Survey3DPanel";
import SidebarRightControl from "@/components/panels/SidebarRightControl"; // ✅ Ganti: Gunakan kontroler mandiri
import { Map } from "leaflet";

const MapComponent = dynamic(() => import("@/components/map/MapComponent"), {
  ssr: false,
});

export default function MapPageInner() {
  const [latlng, setLatLng] = useState<[number, number]>([0, 0]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [basemapType, setBasemapType] = useState("osm");

  const [leftVisible, setLeftVisible] = useState(true);
  const [bottomVisible, setBottomVisible] = useState(false);
  const [bottomHeight, setBottomHeight] = useState(300);
  const [showSamplingInfo, setShowSamplingInfo] = useState(false);

  const mapRef = useRef<Map | null>(null);

  const { showSidebarRight, setShowSidebarRight, samplingUpdatedAt, activeTool, setActiveTool } = useTool();

  // Update showSamplingInfo saat ada data baru
  useEffect(() => {
    if (samplingUpdatedAt) {
      setShowSamplingInfo(true);
    }
  }, [samplingUpdatedAt]);

  // Perbaiki ukuran peta saat layout berubah
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 300);
    }
  }, [leftVisible, showSidebarRight, bottomVisible, bottomHeight]);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          mapRef.current?.setView([latitude, longitude], 14);
        },
        (error) => {
          alert("Gagal mendapatkan lokasi: " + error.message);
        }
      );
    } else {
      alert("Geolocation tidak didukung di browser ini.");
    }
  };

  return (
    <main className="flex flex-col h-screen overflow-hidden">
      <HeaderBar />

      <div className="flex flex-1 relative overflow-hidden bg-gray-200">
        {/* Sidebar Kiri */}
        {leftVisible && (
          <div className="w-72 bg-white border-r border-gray-200 z-20">
            <SidebarLeft />
          </div>
        )}

        {/* Area Peta */}
        <div className="flex-1 relative h-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            <MapComponent setLatLng={setLatLng} basemapType={basemapType} mapRef={mapRef} userLocation={userLocation} />
          </div>

          <SamplingBottomSidebar visible={showSamplingInfo} onClose={() => setShowSamplingInfo(false)} />

          {/* Koordinat */}
          <div className="absolute bottom-2 left-2 bg-blue-500 text-xs px-3 py-1 rounded shadow text-white z-10">
            Lat: {latlng[0].toFixed(5)}, Lng: {latlng[1].toFixed(5)}
          </div>

          {/* Tombol Lokasi */}
          <div className="absolute bottom-32 right-2 z-10">
            <button onClick={handleLocateMe} className="bg-blue-600 text-white p-3 rounded-full shadow-xl hover:bg-blue-700 transition-all duration-200 hover:scale-110 relative" title="Lokasi Saya">
              <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-75"></div>
              <div className="relative z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
            </button>
          </div>

          {/* Basemap Switcher */}
          <BasemapSwitcher onChange={setBasemapType} current={basemapType} defaultPosition={{ x: 1810, y: 210 }} />

          {/* Feature Panel */}
          {activeTool === "echosounder" && <FeaturePanel activePanel="echosounder" close={() => setActiveTool(null)} />}

          {/* Panel Toggler */}
          <PanelToggler onToggleLeft={() => setLeftVisible(!leftVisible)} onToggleRight={() => setShowSidebarRight((prev) => !prev)} onToggleBottom={() => setBottomVisible(!bottomVisible)} />
        </div>

        {/* ✅ Sidebar Kanan: Gunakan SidebarRightControl yang mandiri */}
        {/* 🔥 Tidak ada resize handle di sini lagi */}
        {showSidebarRight && <SidebarRightControl />}
      </div>

      {/* Panel Bawah */}
      {bottomVisible && (
        <>
          <div
            onMouseDown={(e) => {
              const startY = e.clientY;
              const startHeight = bottomHeight;
              const handleMouseMove = (moveEvent: MouseEvent) => {
                const newHeight = Math.max(120, startHeight + (startY - moveEvent.clientY));
                setBottomHeight(newHeight);
              };
              const handleMouseUp = () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
              };
              window.addEventListener("mousemove", handleMouseMove);
              window.addEventListener("mouseup", handleMouseUp);
            }}
            className="h-2 cursor-row-resize bg-gray-300 z-30"
          />
          <div className="bg-white border-t border-gray-300 z-20 overflow-hidden" style={{ height: `${bottomHeight}px` }}>
            <BottomPanel />
          </div>
        </>
      )}

      {/* ✅ Survey3DPanel: Harus di level terluar */}
      <Survey3DPanel />
    </main>
  );
}
