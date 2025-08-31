// src/components/panels/charts/LongitudinalChart.tsx
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import { getLongitudinalChartData, getAllDistances } from "../utils/chartDataHelpers";

interface Props {
  selectedSurveyIds: string[];
  allData: Record<string, any[]>;
}

export default function LongitudinalChart({ selectedSurveyIds, allData }: Props) {
  const allDistances = getAllDistances(allData);
  const chartData = getLongitudinalChartData(selectedSurveyIds, allData, allDistances);

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
      x: { title: { display: true, text: "Jarak dari Awal Transek (m)" } },
    },
  };

  return <Line data={chartData} options={options} />;
}
