// src/lib/geotools/samplingUtils.ts
import * as turf from "@turf/turf";
import { Feature, LineString, Point } from "geojson";

export function generateSamplingPoints(transek: Feature<LineString>, interval: number): Feature<Point>[] {
  const length = turf.length(transek, { units: "meters" });
  const points: Feature<Point>[] = [];

  for (let i = 0; i <= length; i += interval) {
    const point = turf.along(transek, i, { units: "meters" });
    points.push(point);
  }

  return points;
}
