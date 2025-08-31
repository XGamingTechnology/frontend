// src/components/panels/charts/CrossSectionChart.tsx
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import { getCrossSectionChartData, getAllOffsets } from "../utils/chartDataHelpers";

interface Props {
  selectedSurveyIds: string[];
  allData: Record<string, any[]>;
  selectedDistance: number | null;
}

export default function CrossSectionChart({ selectedSurveyIds, allData, selectedDistance }: Props) {
  const allOffsets = getAllOffsets(allData);
  const chartData = getCrossSectionChartData(selectedSurveyIds, allData, allOffsets, selectedDistance);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { usePointStyle: true, boxWidth: 6, font: { size: 11 } } },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (ctx) => `${ctx.dataset?.label}: ${ctx.parsed.y} m`,
        },
      },
    },
    scales: {
      y: { reverse: true, title: { display: true, text: "Kedalaman (m)" } },
      x: { title: { display: true, text: "Offset Melintang (m)" } },
    },
  };

  if (!selectedDistance) return null;

  return <Line data={chartData} options={options} />;
}
