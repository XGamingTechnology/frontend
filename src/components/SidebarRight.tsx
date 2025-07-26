// src/components/SidebarRight.tsx
"use client";

// 1. Impor useData dari DataContext
import { useData } from "@/context/DataContext";
// 2. Impor library yang dibutuhkan untuk chart
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import "echarts-gl";

// 3. Daftarkan komponen ChartJS
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

// 4. Import ReactECharts secara dinamis untuk menghindari masalah SSR
const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

export default function SidebarRight() {
  // 5. Dapatkan echosounderData dari DataContext
  const { echosounderData } = useData();

  // 6. Siapkan data dan opsi untuk chart 2D
  const data = {
    // 7. Pastikan echosounderData adalah array sebelum menggunakan .map
    labels: Array.isArray(echosounderData) ? echosounderData.map((d) => d.jarak) : [],
    datasets: [
      {
        label: "Kedalaman (m)",
        // 8. Pastikan echosounderData adalah array sebelum menggunakan .map
        data: Array.isArray(echosounderData) ? echosounderData.map((d) => d.kedalaman) : [],
        fill: true,
        backgroundColor: "rgba(59,130,246,0.2)",
        borderColor: "rgba(59,130,246,1)",
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "rgba(59,130,246,1)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: {
        reverse: true,
        title: {
          display: true,
          text: "Kedalaman (m)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Jarak (m)",
        },
      },
    },
  };

  // 9. Siapkan opsi untuk chart 3D menggunakan useMemo untuk optimasi
  const option3D = useMemo(() => {
    // 10. Pastikan echosounderData adalah array dan tidak kosong
    if (!Array.isArray(echosounderData) || echosounderData.length === 0) {
      return {}; // Kembalikan objek kosong jika tidak ada data
    }

    const xLen = echosounderData.length;
    const yLen = 5;
    // const stepY = 1; // Tidak digunakan dalam logika saat ini
    const surfaceData: number[][] = [];

    for (let i = 0; i < xLen; i++) {
      const row: number[] = [];
      for (let j = 0; j < yLen; j++) {
        // 11. Tambahkan variasi halus pada data Z untuk visualisasi 3D yang lebih menarik
        row.push(echosounderData[i].kedalaman + Math.sin(j * 0.5) * 0.1);
      }
      surfaceData.push(row);
    }

    // 12. Kembalikan konfigurasi chart 3D
    return {
      tooltip: {},
      visualMap: {
        show: true,
        // 13. Hitung min/max dengan aman
        min: Math.min(...echosounderData.map((d) => d.kedalaman)),
        max: Math.max(...echosounderData.map((d) => d.kedalaman)),
        inRange: {
          color: ["#4575b4", "#91bfdb", "#e0f3f8", "#ffffbf", "#fee090", "#fc8d59", "#d73027"],
        },
        calculable: true,
        orient: "vertical",
        left: "left",
        bottom: "10%",
      },
      xAxis3D: {
        type: "category",
        name: "Jarak",
        // 14. Format data jarak untuk sumbu X
        data: echosounderData.map((d) => d.jarak.toFixed(1)),
      },
      yAxis3D: {
        type: "category",
        name: "Offset",
        // 15. Buat label untuk sumbu Y
        data: Array.from({ length: yLen }, (_, j) => `W${j}`),
      },
      zAxis3D: {
        type: "value",
        name: "Kedalaman (m)",
      },
      grid3D: {
        boxWidth: 100,
        boxDepth: 30,
        viewControl: {
          autoRotate: true,
          projection: "perspective",
        },
        light: {
          main: {
            intensity: 1.2,
            shadow: true,
          },
          ambient: {
            intensity: 0.3,
          },
        },
      },
      series: [
        {
          type: "surface",
          wireframe: {
            show: false,
          },
          shading: "color",
          data: surfaceData,
        },
      ],
    };
  }, [echosounderData]); // 16. Dependensi useMemo adalah echosounderData

  return (
    <div className="p-4 w-full space-y-6">
      {/* --- Diagram 2D --- */}
      <div>
        <h2 className="font-bold mb-4 text-lg text-slate-700">📊 Diagram Penampang Echosounder</h2>
        {/* 17. Tampilkan chart atau pesan jika tidak ada data */}
        {Array.isArray(echosounderData) && echosounderData.length > 0 ? <Line data={data} options={options} /> : <p className="text-sm text-gray-400 italic">Belum ada data untuk divisualisasikan.</p>}
      </div>

      {/* --- Visualisasi 3D --- */}
      <div>
        <h2 className="font-bold mb-4 text-lg text-slate-700">🧊 Visualisasi 3D</h2>
        {/* 18. Tampilkan chart 3D atau pesan jika tidak ada data */}
        {Array.isArray(echosounderData) && echosounderData.length > 0 ? (
          // 19. Gunakan ReactECharts dengan opsi 3D
          <ReactECharts option={option3D} style={{ height: 400 }} />
        ) : (
          <p className="text-sm text-gray-400 italic">Belum ada data untuk divisualisasikan.</p>
        )}
      </div>
    </div>
  );
}
