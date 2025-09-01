// src/utils/analysis.ts
export function calculateCrossSectionDifference(surveyA: string, surveyB: string, allData: Record<string, { distance: number; offset: number; depth: number }[]>, targetDistance: number) {
  const pointsA = allData[surveyA] || [];
  const pointsB = allData[surveyB] || [];

  // ✅ Threshold 10 meter → sesuaikan dengan resolusi data
  const threshold = 10;
  const pointsAFiltered = pointsA.filter((p) => Math.abs(p.distance - targetDistance) <= threshold);
  const pointsBFiltered = pointsB.filter((p) => Math.abs(p.distance - targetDistance) <= threshold);

  // ✅ Cek: apakah ada data?
  if (pointsAFiltered.length === 0 && pointsBFiltered.length === 0) {
    console.warn(`⚠️ Tidak ada data di ${targetDistance}m untuk kedua survey`);
    return [];
  }

  // ✅ Mapping offset → depth
  const mapA = new Map<number, number>();
  const mapB = new Map<number, number>();

  pointsAFiltered.forEach((p) => {
    const offset = Math.round(p.offset);
    if (!isNaN(p.depth)) mapA.set(offset, p.depth);
  });

  pointsBFiltered.forEach((p) => {
    const offset = Math.round(p.offset);
    if (!isNaN(p.depth)) mapB.set(offset, p.depth);
  });

  // ✅ Gabung semua offset unik
  const allOffsets = Array.from(new Set([...mapA.keys(), ...mapB.keys()])).sort((a, b) => a - b);

  // ✅ Hitung selisih: depthB - depthA → positif = lebih dalam (sedimentasi)
  const differences = allOffsets.map((offset) => {
    const depthA = mapA.get(offset) ?? 0;
    const depthB = mapB.get(offset) ?? 0;
    const diff = depthB - depthA;
    return { offset, diff, depthA, depthB };
  });

  return differences;
}
