// src/components/panels/utils/chartDataHelpers.ts

/**
 * Ambil semua jarak unik dari semua survey (untuk longitudinal)
 * Snap ke kelipatan 10m untuk konsistensi
 */
export const getAllDistances = (allData: Record<string, { distance: number; depth: number }[]>): number[] => {
  const distances = new Set<number>();
  Object.values(allData).forEach((points) => {
    points.forEach((p) => {
      if (isFinite(p.distance)) {
        distances.add(Math.round(p.distance / 10) * 10); // Snap ke 10m
      }
    });
  });
  return Array.from(distances).sort((a, b) => a - b);
};

/**
 * Ambil semua offset unik dari semua survey (untuk cross-section)
 */
export const getAllOffsets = (allData: Record<string, { offset: number; depth: number }[]>): number[] => {
  const offsets = new Set<number>();
  Object.values(allData).forEach((points) => {
    points.forEach((p) => {
      if (isFinite(p.offset)) {
        offsets.add(Math.round(p.offset));
      }
    });
  });
  return Array.from(offsets).sort((a, b) => a - b);
};

/**
 * Interpolasi linear untuk kedalaman pada jarak tertentu
 */
const interpolateDepthAtDistance = (points: { distance: number; depth: number }[], targetDistance: number): number | null => {
  if (points.length === 0) return null;

  // Urutkan berdasarkan jarak
  const sorted = [...points].sort((a, b) => a.distance - b.distance);
  const low = sorted.findLast((p) => p.distance <= targetDistance);
  const high = sorted.find((p) => p.distance >= targetDistance);

  if (!low && !high) return null;
  if (!low) return high.depth;
  if (!high) return low.depth;
  if (low.distance === high.distance) return low.depth;

  const ratio = (targetDistance - low.distance) / (high.distance - low.distance);
  return low.depth + ratio * (high.depth - low.depth);
};

/**
 * Siapkan data untuk grafik Longitudinal Section
 */
export const getLongitudinalChartData = (selectedSurveyIds: string[], allData: Record<string, { distance: number; depth: number }[]>, allDistances: number[]) => {
  const datasets = selectedSurveyIds.map((surveyId) => {
    const points = allData[surveyId] || [];
    const data = allDistances.map((dist) => {
      const depth = interpolateDepthAtDistance(points, dist);
      return {
        x: dist,
        y: depth !== null && isFinite(depth) ? depth : null,
      };
    });

    // Warna konsisten berdasarkan ID
    let hash = 0;
    for (let i = 0; i < surveyId.length; i++) {
      hash = surveyId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    const hsl = `hsl(${hue}, 70%, 50%)`;

    return {
      label: `Survey ${surveyId.slice(-6)}`,
      data,
      borderColor: hsl,
      backgroundColor: `hsla(${hue}, 70%, 50%, 0.1)`,
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
  if (!selectedDistance || !isFinite(selectedDistance)) {
    return { datasets: [] };
  }

  const datasets = selectedSurveyIds.map((surveyId) => {
    const points = allData[surveyId] || [];

    const data = allOffsets.map((offset) => {
      // Ambil titik yang dekat dengan offset ini
      const nearby = points.filter((p) => isFinite(p.offset) && Math.abs(p.offset - offset) < 5);
      if (nearby.length === 0) return { x: offset, y: null };

      // Interpolasi kedalaman di jarak `selectedDistance`
      const depth = interpolateDepthAtDistance(
        nearby.map((p) => ({ distance: p.distance, depth: p.depth })),
        selectedDistance
      );

      return {
        x: offset,
        y: depth !== null && isFinite(depth) ? depth : null,
      };
    });

    // Warna konsisten
    let hash = 0;
    for (let i = 0; i < surveyId.length; i++) {
      hash = surveyId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    const hsl = `hsl(${hue}, 70%, 50%)`;

    return {
      label: `Survey ${surveyId.slice(-6)}`,
      data,
      borderColor: hsl,
      backgroundColor: `hsla(${hue}, 70%, 50%, 0.1)`,
      fill: true,
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
    };
  });

  return { datasets };
};
