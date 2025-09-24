// src/components/panels/SimulasiPanel.tsx
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTool } from "@/context/ToolContext";

export default function SimulasiPanel({
  onClosePanel,
  setActiveTool,
  setSurveyMode,
}: {
  onClosePanel: () => void;
  setActiveTool: (tool: "toponimi" | "rute" | "echosounder" | "simulasi" | "drawline" | "drawpolygon" | null) => void;
  setSurveyMode: (mode: "line" | "polygon" | null) => void;
}) {
  const [selectedMode, setSelectedMode] = useState<"line" | "polygon">("line");
  const [transekType, setTransekType] = useState<"snake" | "parallel" | "manual">("snake");

  // ✅ Gunakan useCallback agar fungsi stabil
  const handleStartSimulation = useCallback(() => {
    console.log("🚀 [SimulasiPanel] handleStartSimulation dipanggil");
    console.log("📌 Mode terpilih:", selectedMode);
    console.log("📌 Tipe transek:", transekType);

    // ✅ Reset semua flag sebelumnya
    localStorage.removeItem("transekPolygonMode");
    localStorage.removeItem("pendingTransekPolygon");
    console.log("🧹 localStorage transek flag direset");

    if (selectedMode === "line") {
      console.log("🔧 Set surveyMode: 'line'");
      setSurveyMode("line");

      console.log("🖌️ Set activeTool: 'drawline'");
      setActiveTool("drawline");
    } else if (selectedMode === "polygon") {
      console.log("🔧 Set surveyMode: 'polygon'");
      setSurveyMode("polygon");

      console.log("🖌️ Set activeTool: 'drawpolygon'");
      setActiveTool("drawpolygon");

      // ✅ SET TRANSEK MODE DI LOCALSTORAGE — SEBELUM BUKA PANEL
      if (transekType === "parallel") {
        localStorage.setItem("transekPolygonMode", "parallel_centerline");
        console.log('✅ localStorage "transekPolygonMode" di-set ke: "parallel_centerline"');
      } else if (transekType === "manual") {
        localStorage.setItem("transekPolygonMode", "manual_line_only");
        console.log('✅ localStorage "transekPolygonMode" di-set ke: "manual_line_only"');
      } else {
        // Untuk mode snake — tidak perlu set localStorage
        console.log('ℹ️ Mode "snake" — tidak set localStorage');
      }

      // ✅ KIRIM EVENT KE MAPCOMPONENT — SETELAH LOCALSTORAGE DI-SET
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("open-polygon-parallel-panel", {
              detail: { mode: transekType === "parallel" ? "parallel_centerline" : transekType === "manual" ? "manual_line_only" : "snake" },
            })
          );
          console.log(`📡 [SimulasiPanel] Event 'open-polygon-parallel-panel' dikirim dengan mode: ${transekType}`);
        }, 50);
      }
    }

    // ✅ TUNDA PENUTUPAN PANEL — AGAR STATE SEMPAT TER-UPDATE
    setTimeout(() => {
      console.log("🚪 Menutup panel simulasi...");
      onClosePanel();
    }, 100);
  }, [selectedMode, transekType, setSurveyMode, setActiveTool, onClosePanel]);

  // ✅ Dengarkan event 'transek-finished' — lalu buka panel batimetri
  useEffect(() => {
    const handleTransekFinished = () => {
      console.log("✅ [SimulasiPanel] Menerima event 'transek-finished' — membuka panel batimetri");
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("open-batimetri-panel"));
          console.log("📡 [SimulasiPanel] Event 'open-batimetri-panel' dikirim");
        }, 100);
      }
    };

    window.addEventListener("transek-finished", handleTransekFinished as EventListener);

    return () => {
      window.removeEventListener("transek-finished", handleTransekFinished as EventListener);
    };
  }, []);

  // ✅ Fungsi baru: Buka Panel Batimetri Langsung
  const handleOpenBatimetriPanel = useCallback(() => {
    console.log("✅ [SimulasiPanel] Membuka panel batimetri secara manual");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-batimetri-panel"));
      console.log("📡 [SimulasiPanel] Event 'open-batimetri-panel' dikirim");
    }
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        zIndex: 1000,
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        width: "320px",
        fontFamily: "Segoe UI, sans-serif",
        fontSize: "14px",
      }}
    >
      <h3 style={{ margin: 0, color: "#1e40af", marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>🛠️ Panel Simulasi</h3>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#374151" }}>Pilih Mode Survei:</label>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              background: selectedMode === "line" ? "#dbeafe" : "#f3f4f6",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            <input
              type="radio"
              name="mode"
              value="line"
              checked={selectedMode === "line"}
              onChange={() => {
                console.log('🔘 Mode diubah ke: "line"');
                setSelectedMode("line");
              }}
              style={{ cursor: "pointer" }}
            />
            <span>📊 Garis Tunggal</span>
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              background: selectedMode === "polygon" ? "#dbeafe" : "#f3f4f6",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            <input
              type="radio"
              name="mode"
              value="polygon"
              checked={selectedMode === "polygon"}
              onChange={() => {
                console.log('🔘 Mode diubah ke: "polygon"');
                setSelectedMode("polygon");
              }}
              style={{ cursor: "pointer" }}
            />
            <span>🔲 Area (Polygon)</span>
          </label>
        </div>
      </div>

      {selectedMode === "polygon" && (
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#374151" }}>Tipe Transek:</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { value: "snake", label: "Zigzag / Snake (Default)", desc: "Transek berliku otomatis" },
              { value: "parallel", label: "Garis Lurus Sejajar", desc: "Auto-generate transek lurus" },
              { value: "manual", label: "Garis Tengah Manual", desc: "Gambar garis tengah sendiri" },
            ].map((option) => (
              <label
                key={option.value}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "10px",
                  background: transekType === option.value ? "#dcfce7" : "#f9fafb",
                  border: `1px solid ${transekType === option.value ? "#10b981" : "#e5e7eb"}`,
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onClick={() => {
                  console.log(`🔘 Transek type diubah ke: "${option.value}"`);
                  setTransekType(option.value as any);
                }}
              >
                <input
                  type="radio"
                  name="transek"
                  value={option.value}
                  checked={transekType === option.value}
                  onChange={() => {
                    console.log(`🔘 Transek type diubah ke: "${option.value}"`);
                    setTransekType(option.value as any);
                  }}
                  style={{ marginTop: "3px", cursor: "pointer" }}
                />
                <div>
                  <div style={{ fontWeight: "500", color: "#1f2937" }}>{option.label}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
        <button
          onClick={handleStartSimulation}
          disabled={selectedMode === "polygon" && !transekType}
          style={{
            padding: "10px 16px",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: selectedMode === "polygon" && !transekType ? "not-allowed" : "pointer",
            fontWeight: "600",
            flex: 1,
            fontSize: "14px",
            transition: "background 0.2s",
            opacity: selectedMode === "polygon" && !transekType ? 0.7 : 1,
          }}
          title={selectedMode === "polygon" && !transekType ? "Pilih tipe transek terlebih dahulu" : ""}
        >
          ▶️ Mulai Survei
        </button>

        <button
          onClick={onClosePanel}
          style={{
            padding: "10px 16px",
            background: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            flex: 1,
            fontSize: "14px",
            transition: "background 0.2s",
          }}
        >
          ❌ Batal
        </button>
      </div>

      {/* ✅ Tombol Baru: Buka Panel Batimetri */}
      <div style={{ marginTop: "16px" }}>
        <button
          onClick={handleOpenBatimetriPanel}
          style={{
            width: "100%",
            padding: "10px 16px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
            transition: "background 0.2s",
          }}
        >
          🗺️ Buka Panel Batimetri
        </button>
      </div>

      {/* ✅ DEBUG INFO */}
      <div style={{ marginTop: "16px", padding: "8px", background: "#f0fdf4", borderRadius: "6px", fontSize: "12px", color: "#065f46" }}>
        <strong>🛠️ Debug Info:</strong>
        <div>Mode: {selectedMode}</div>
        {selectedMode === "polygon" && <div>Transek: {transekType}</div>}
      </div>
    </div>
  );
}
