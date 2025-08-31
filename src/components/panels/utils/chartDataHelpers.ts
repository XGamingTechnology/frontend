// src/components/panels/utils/chartDataHelpers.ts

import { SamplingPoint } from "@/types"; // Pastikan Anda punya types

export const getAllDistances = (allData: Record<string, SamplingPoint[]>) => {
  const distances = new Set<number>();
  Object.values(allData).forEach((points) => points.forEach((p) => distances.add(Math.round(p.distance))));
  return Array.from(distances).sort((a, b) => a - b);
};

export const getAllOffsets = (allData: Record<string, SamplingPoint[]>) => {
  const offsets = new Set<number>();
  Object.values(allData).forEach((points) => points.forEach((p) => offsets.add(p.offset)));
  return Array.from(offsets).sort((a, b) => a - b);
};

export const getLongitudinalChartData = (selectedSurveyIds: string[], allData: Record<string, SamplingPoint[]>, allDistances: number[]) => {
  return {
    labels: allDistances.map((d) => d.toFixed(0)),
    datasets: selectedSurveyIds.map((surveyId, idx) => {
      const points = allData[surveyId] || [];
      const colorHue = (idx * 130) % 360;
      const borderColor = `hsl(${colorHue}, 70%, 50%)`;
      const backgroundColor = `hsl(${colorHue}, 70%, 50%, 0.2)`;

      const data = allDistances.map((dist) => {
        const point = points.find((p) => Math.abs(p.distance - dist) < 0.5);
        return point ? point.depth : null;
      });

      return {
        label: `Survey ${surveyId.slice(-6)}`,
        data,
        borderColor,
        backgroundColor,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      };
    }),
  };
};

export const getCrossSectionChartData = (selectedSurveyIds: string[], allData: Record<string, SamplingPoint[]>, allOffsets: number[], selectedDistance: number | null) => {
  if (!selectedDistance) return null;

  const datasets = selectedSurveyIds.map((surveyId, idx) => {
    const points = allData[surveyId] || [];
    const colorHue = (idx * 130) % 360;
    const borderColor = `hsl(${colorHue}, 70%, 50%)`;
    const backgroundColor = `hsl(${colorHue}, 70%, 50%, 0.2)`;

    const data = allOffsets.map((offset) => {
      const point = points.find((p) => Math.abs(p.distance - selectedDistance) < 0.5 && Math.abs(p.offset - offset) < 0.5);
      return point ? point.depth : null;
    });

    return {
      label: `Survey ${surveyId.slice(-6)}`,
      data,
      borderColor,
      backgroundColor,
      fill: true,
      tension: 0.4,
      pointRadius: 4,
    };
  });

  return {
    labels: allOffsets.map((o) => o.toFixed(1)),
    datasets,
  };
};
