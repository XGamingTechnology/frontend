// src/components/panels/utils/chartDataHelpers.ts

/**
 * Ambil semua jarak unik dari semua survey (untuk longitudinal)
 */
export const getAllDistances = (allData: Record<string, { distance: number; depth: number }[]>): number[] => {
  const distances = new Set<number>();
  Object.values(allData).forEach((points) => {
    points.forEach((p) => distances.add(Math.round(p.distance)));
  });
  return Array.from(distances).sort((a, b) => a - b);
};

/**
 * Ambil semua offset unik dari semua survey (untuk cross-section)
 */
export const getAllOffsets = (allData: Record<string, { offset: number; depth: number }[]>): number[] => {
  const offsets = new Set<number>();
  Object.values(allData).forEach((points) => {
    points.forEach((p) => offsets.add(Math.round(p.offset)));
  });
  return Array.from(offsets).sort((a, b) => a - b);
};

/**
 * Siapkan data untuk grafik Longitudinal Section
 */
export const getLongitudinalChartData = (selectedSurveyIds: string[], allData: Record<string, { distance: number; depth: number }[]>, allDistances: number[]) => {
  const datasets = selectedSurveyIds.map((surveyId) => {
    const points = allData[surveyId] || [];
    const dataMap = new Map<number, number>();

    points.forEach((p) => {
      const roundedDistance = Math.round(p.distance);
      if (!dataMap.has(roundedDistance) || p.depth < dataMap.get(roundedDistance)!) {
        dataMap.set(roundedDistance, p.depth);
      }
    });

    const data = allDistances.map((dist) => ({
      x: dist,
      y: dataMap.has(dist) ? dataMap.get(dist) : null,
    }));

    const r = Math.floor(Math.random() * 200) + 55;
    const g = Math.floor(Math.random() * 200) + 55;
    const b = Math.floor(Math.random() * 200) + 55;

    return {
      label: `Survey ${surveyId.slice(-6)}`,
      data,
      borderColor: `rgb(${r}, ${g}, ${b})`,
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
      fill: true,
      tension: 0.3,
      pointRadius: 3,
      pointHoverRadius: 5,
    };
  });

  return { datasets };
};

/**
 * Siapkan data untuk grafik Cross-Section pada jarak tertentu
 */
export const getCrossSectionChartData = (selectedSurveyIds: string[], allData: Record<string, { distance: number; offset: number; depth: number }[]>, allOffsets: number[], selectedDistance: number | null) => {
  if (!selectedDistance) {
    return { datasets: [] };
  }

  const datasets = selectedSurveyIds.map((surveyId) => {
    const points = allData[surveyId] || [];
    const dataMap = new Map<number, number>();

    // Filter titik yang jaraknya mendekati selectedDistance
    points.forEach((p) => {
      if (Math.abs(p.distance - selectedDistance) < 5) {
        const roundedOffset = Math.round(p.offset);
        if (!dataMap.has(roundedOffset) || p.depth < dataMap.get(roundedOffset)!) {
          dataMap.set(roundedOffset, p.depth);
        }
      }
    });

    // Siapkan data untuk semua offset
    const data = allOffsets.map((offset) => ({
      x: offset,
      y: dataMap.has(offset) ? dataMap.get(offset) : null,
    }));

    const r = Math.floor(Math.random() * 200) + 55;
    const g = Math.floor(Math.random() * 200) + 55;
    const b = Math.floor(Math.random() * 200) + 55;

    return {
      label: `Survey ${surveyId.slice(-6)}`,
      data,
      borderColor: `rgb(${r}, ${g}, ${b})`,
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
      fill: true,
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
    };
  });

  return { datasets };
};
