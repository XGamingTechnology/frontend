// src/components/ReportGenerator.tsx
"use client";

import { useEffect } from "react";

export default function ReportGenerator({ data }) {
  useEffect(() => {
    // ❌ Pastikan hanya jalan di browser
    if (typeof window === "undefined") return;

    const handleGenerateReport = async () => {
      try {
        // ✅ Dynamic import: hanya load di client-side
        const html2pdf = (await import("html2pdf.js")).default;

        const reportContainer = document.getElementById("report-container");
        if (!reportContainer) {
          alert("❌ Kontainer laporan tidak ditemukan!");
          return;
        }

        const options = {
          margin: [10, 10, 10, 10],
          filename: `laporan_perubahan_${Date.now()}.pdf`,
          html2canvas: {
            scale: 2,
            useCORS: true, // ✅ Penting untuk chart & gambar
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
        };

        html2pdf().from(reportContainer).set(options).save();
      } catch (error) {
        console.error("❌ Gagal load html2pdf.js:", error);
        alert("Gagal membuat laporan. Cek konsol.");
      }
    };

    const button = document.getElementById("btn-generate-report");
    if (button) {
      button.addEventListener("click", handleGenerateReport);
    }

    // Cleanup event listener
    return () => {
      if (button) {
        button.removeEventListener("click", handleGenerateReport);
      }
    };
  }, []);

  return null;
}
