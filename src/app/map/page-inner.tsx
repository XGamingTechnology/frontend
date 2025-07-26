// src/app/map/page-inner.tsx
"use client"; // 1. Pastikan ini adalah Client Component

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import HeaderBar from "@/components/HeaderBar";
import SidebarLeft from "@/components/SidebarLeft";
import SidebarRight from "@/components/SidebarRight";
import BottomPanel from "@/components/BottomPanel";
import FeaturePanel from "@/components/panels/FeaturePanel";
// 2. Perbaiki path import BasemapSwitcher jika diperlukan
//    (jika file dipindah ke folder components/utils/)
import BasemapSwitcher from "@/components/utils/BasemapSwitcher";
import PanelToggler from "@/components/PanelToggler";
import SamplingBottomSidebar from "@/components/SamplingBottomSidebar";
import { useTool } from "@/context/ToolContext"; // 3. Gunakan ToolContext untuk state tools/UI
// 4. Impor useData untuk memastikan SidebarRight bisa mengakses echosounderData jika diperlukan
//    (meskipun dalam implementasi terbaru SidebarRight langsung menggunakan useData,
//     mengimpornya di sini tidak merugikan dan bisa memberikan gambaran ketergantungan)
// import { useData } from "@/context/DataContext";
import { Map } from "leaflet";
// 5. HAPUS import SimulasiPanel dan ToponimiFormModal dari sini karena akan dihandle MapComponent
// import SimulasiPanel from "@/components/panels/SimulasiPanel";
// import ToponimiFormModal from "@/components/forms/ToponimiFormModal";
// import type { Tool } from "@/context/ToolContext"; // Tidak digunakan secara langsung di sini

// 6. Impor MapComponent secara dinamis untuk menghindari masalah SSR dengan Leaflet
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
  const [rightWidth, setRightWidth] = useState(384);
  const [showSamplingInfo, setShowSamplingInfo] = useState(false);

  const mapRef = useRef<Map | null>(null);

  // 7. Gunakan state dan fungsi dari ToolContext
  const { showSidebarRight, setShowSidebarRight, samplingUpdatedAt, activeTool, setActiveTool } = useTool();
  // 8. Gunakan state dan fungsi dari DataContext jika diperlukan di level ini
  // const { features, loading, error } = useData();

  // 9. Efek untuk menampilkan SamplingBottomSidebar saat sampling selesai
  useEffect(() => {
    if (samplingUpdatedAt) {
      setShowSamplingInfo(true);
    }
  }, [samplingUpdatedAt]);

  // 10. Efek untuk memperbarui ukuran peta saat panel diubah
  useEffect(() => {
    if (mapRef.current) {
      // Timeout kecil untuk memastikan DOM sudah diperbarui
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 300);
    }
  }, [leftVisible, showSidebarRight, bottomVisible, bottomHeight, rightWidth]);

  // 11. Fungsi untuk mendapatkan lokasi pengguna
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          // 12. Fokuskan peta ke lokasi pengguna
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

  // 13. Fungsi untuk menangani proses echosounder (membuka sidebar kanan)
  //     Fungsi ini dikirim ke FeaturePanel sebagai prop 'onEchosounderProses'.
  //     Namun, karena FeaturePanel sekarang bisa langsung menggunakan useData
  //     dan memanggil setShowSidebarRight, prop ini mungkin tidak terlalu diperlukan lagi.
  //     Tapi kita tetap pertahankan untuk kompatibilitas atau jika ada logika tambahan.
  const handleEchosounderProses = () => {
    // 14. Buka sidebar kanan untuk menampilkan hasil echosounder
    //     (Tidak perlu menutup tool, karena FeaturePanel bisa melakukannya sendiri jika perlu)
    // setActiveTool(null); // Opsional, tergantung desain UX
    setShowSidebarRight(true);
  };

  return (
    <main className="flex flex-col h-screen overflow-hidden">
      {/* 15. Header aplikasi */}
      <HeaderBar />

      {/* 16. Kontainer utama untuk konten (peta dan panel) */}
      <div className="flex flex-1 relative overflow-hidden bg-gray-200">
        {/* 17. Sidebar kiri */}
        {leftVisible && (
          <div className="w-72 bg-white border-r border-gray-200 z-20">
            <SidebarLeft />
          </div>
        )}

        {/* 18. Area konten utama (peta) */}
        <div className="flex-1 relative h-full overflow-hidden">
          {/* 19. Komponen peta utama */}
          <div className="absolute inset-0 z-0">
            <MapComponent setLatLng={setLatLng} basemapType={basemapType} mapRef={mapRef} userLocation={userLocation} />
          </div>

          {/* 20. Sidebar informasi sampling */}
          <SamplingBottomSidebar visible={showSamplingInfo} onClose={() => setShowSamplingInfo(false)} />

          {/* 21. Koordinat mouse di pojok kiri bawah */}
          <div className="absolute bottom-2 left-2 bg-blue-500 text-xs px-3 py-1 rounded shadow text-white z-10">
            Lat: {latlng[0].toFixed(5)}, Lng: {latlng[1].toFixed(5)}
          </div>

          {/* 22. Tombol lokasi pengguna di pojok kanan bawah */}
          <div className="absolute bottom-32 right-2 z-10">
            <button onClick={handleLocateMe} className="bg-blue-600 text-white p-3 rounded-full shadow-xl hover:bg-blue-700 transition-all duration-200 hover:scale-110 relative" title="Lokasi Saya">
              {/* Pulse Animation */}
              <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-75"></div>

              <div className="relative z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
            </button>
          </div>

          {/* 23. Switcher basemap */}
          <BasemapSwitcher onChange={setBasemapType} current={basemapType} defaultPosition={{ x: 1810, y: 210 }} />

          {/* 24. === FEATURE PANEL === */}
          {/* Perbarui props yang dikirim ke FeaturePanel */}
          {/* Hapus prop 'onEchosounderProses' jika FeaturePanel tidak memerlukannya lagi */}
          {/* Tambahkan prop 'setShowSidebarRight' jika FeaturePanel perlu mengontrol sidebar kanan secara langsung */}
          {activeTool === "echosounder" && (
            <FeaturePanel
              activePanel="echosounder"
              close={() => setActiveTool(null)}
              // onEchosounderProses={handleEchosounderProses} // Opsional, bisa dihapus
              // setShowSidebarRight={setShowSidebarRight} // Jika FeaturePanel butuh ini, tambahkan sebagai props
            />
          )}

          {/* 
            25. === SIMULASI PANEL & TOPONIMI FORM MODAL === 
            DIHAPUS/KOMENTARI karena akan dihandle oleh MapComponent.
            MapComponent memiliki semua state dan logika yang diperlukan untuk 
            membuat SimulasiPanel dan ToponimiFormModal berfungsi dengan benar.
            Mereka tidak lagi dirender secara langsung oleh MapPageInner.
          */}
          {/* 
          {activeTool === "simulasi" && <SimulasiPanel onGenerate={() => {}} onStartDrawing={() => {}} isDrawing={false} hasLine={false} onDeleteLine={() => {}} onClosePanel={() => setActiveTool(null)} />}
          {activeTool === "toponimi" && (
            <ToponimiFormModal
              initialLatLng={latlng}
              onSubmit={(lat, lng, name) => {
                console.log("Toponimi submitted:", { lat, lng, name });
              }}
              onClosePanel={() => setActiveTool(null)}
            />
          )} 
          */}

          {/* 26. Tombol toggle panel */}
          <PanelToggler onToggleLeft={() => setLeftVisible(!leftVisible)} onToggleRight={() => setShowSidebarRight((prev) => !prev)} onToggleBottom={() => setBottomVisible(!bottomVisible)} />
        </div>

        {/* 27. Sidebar kanan */}
        {showSidebarRight && (
          <>
            {/* 28. Handle untuk mengubah ukuran sidebar kanan */}
            <div
              onMouseDown={(e) => {
                const startX = e.clientX;
                const startWidth = rightWidth;

                const handleMouseMove = (moveEvent: MouseEvent) => {
                  const newWidth = Math.max(240, startWidth - (moveEvent.clientX - startX));
                  setRightWidth(newWidth);
                };

                const handleMouseUp = () => {
                  window.removeEventListener("mousemove", handleMouseMove);
                  window.removeEventListener("mouseup", handleMouseUp);
                };

                window.addEventListener("mousemove", handleMouseMove);
                window.addEventListener("mouseup", handleMouseUp);
              }}
              className="w-2 cursor-col-resize bg-gray-300 z-30"
            />
            <div className="bg-white border-l border-gray-200 z-20 h-full overflow-hidden" style={{ width: `${rightWidth}px` }}>
              <SidebarRight />
            </div>
          </>
        )}
      </div>

      {/* 29. Panel bawah */}
      {bottomVisible && (
        <>
          {/* 30. Handle untuk mengubah ukuran panel bawah */}
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
    </main>
  );
}
