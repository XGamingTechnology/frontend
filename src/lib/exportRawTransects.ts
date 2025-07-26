// src/lib/exportRawTransects.ts
import type { Feature, LineString, Point } from "geojson";

interface ExportRawTransectsOptions {
  allTransects: Feature<LineString>[];
  samplingPoints: Feature<Point>[];
  fileName?: string;
}

export function exportRawTransectsToGeoJSON(options: ExportRawTransectsOptions) {
  const { allTransects, samplingPoints, fileName = "transects_raw" } = options;

  // Gabung transek + titik sampling
  const featureCollection = {
    type: "FeatureCollection",
    features: [...allTransects, ...samplingPoints],
  };

  const blob = new Blob([JSON.stringify(featureCollection)], {
    type: "application/geo+json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.geojson`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportRawTransectsToCSV(options: ExportRawTransectsOptions) {
  const { allTransects, fileName = "transects_raw" } = options;

  const headers = ["id", "distanceFromStart", "bearing", "normalBearing", "theoreticalLength", "start_lon", "start_lat", "end_lon", "end_lat"].join(",");

  const rows = allTransects.map((transect) => {
    const props = transect.properties || {};
    const coords = transect.geometry.coordinates;
    const start = coords[0];
    const end = coords[coords.length - 1];

    return [props.id || "", props.distanceFromStart || "", props.bearing || "", props.normalBearing || "", props.theoreticalLength || "", start[0], start[1], end[0], end[1]].join(",");
  });

  const csv = [headers, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Ekspor keduanya sekaligus
export function exportRawTransects(options: ExportRawTransectsOptions) {
  exportRawTransectsToGeoJSON(options);
  exportRawTransectsToCSV(options);
}
