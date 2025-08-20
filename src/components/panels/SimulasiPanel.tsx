// src/components/panels/SimulasiPanel.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { useTool } from "@/context/ToolContext";

interface SimulasiPanelProps {
  onClosePanel: () => void;
  setActiveTool: (tool: "simulasi" | "drawline" | "drawpolygon" | null) => void;
  setSurveyMode: (mode: "line" | "polygon" | null) => void;
}

export default function SimulasiPanel({ onClosePanel, setActiveTool, setSurveyMode }: SimulasiPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 32, y: 16 }); // default: bottom-right

  // Muat posisi dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("simulasiPanelPosition");
    if (saved) {
      try {
        const pos = JSON.parse(saved);
        setPosition(pos);
      } catch (e) {
        console.warn("Gagal baca posisi panel");
      }
    }
  }, []);

  // Simpan posisi ke localStorage
  const savePosition = (x: number, y: number) => {
    setPosition({ x, y });
    localStorage.setItem("simulasiPanelPosition", JSON.stringify({ x, y }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setIsDragging(true);

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;
      savePosition(newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={panelRef}
      className="absolute z-[1000] bg-white rounded-xl shadow-xl p-5 w-80 border border-gray-200 cursor-move"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(0, 0)", // stabil
        willChange: isDragging ? "transform" : "auto",
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header sebagai handle drag */}
      <div className="flex items-center justify-between mb-4 cursor-grab active:cursor-grabbing">
        <h3 className="text-xl font-bold text-gray-800">⚙️ Pilih Alur</h3>
        <button onClick={onClosePanel} className="text-gray-500 hover:text-red-500">
          ✕
        </button>
      </div>

      {/* === STEP 1: Pilih Alur === */}
      <div className="space-y-3">
        <button
          onClick={() => {
            setSurveyMode("line");
            setActiveTool("drawline");
          }}
          className="w-full p-4 text-left border border-blue-200 rounded-lg hover:bg-blue-50 transition"
        >
          <div className="font-semibold text-blue-700">🌊 Transek dari Garis Sungai</div>
          <div className="text-xs text-gray-600">Gambar garis → transek tegak lurus</div>
        </button>

        <button
          onClick={() => {
            setSurveyMode("polygon");
            setActiveTool("drawpolygon");
          }}
          className="w-full p-4 text-left border border-green-200 rounded-lg hover:bg-green-50 transition"
        >
          <div className="font-semibold text-green-700">🟩 Transek dari Area Polygon</div>
          <div className="text-xs text-gray-600">Gambar area → transek zigzag/grid</div>
        </button>
      </div>

      {/* Indicator saat dragging */}
      {isDragging && <div className="absolute inset-0 border-2 border-blue-400 rounded-lg pointer-events-none"></div>}
    </div>
  );
}
