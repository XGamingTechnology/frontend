import { Feature, FeatureCollection, LineString } from "geojson";
import * as turf from "@turf/turf";

/**
 * Generate transek lines perpendicular to a centerline.
 * @param centerline - Feature or FeatureCollection of LineString
 * @param spacing - Distance between each transect (in meters)
 * @param length - Total length of each transect (in meters)
 * @returns FeatureCollection of LineString transects
 */
export function generateTransekLines(centerline: Feature<LineString> | FeatureCollection<LineString>, spacing: number, length: number): FeatureCollection<LineString> {
  const transekLines: Feature<LineString>[] = [];

  let lineFeature: Feature<LineString>;
  if (centerline.type === "FeatureCollection") {
    const foundLine = centerline.features.find((f) => f.geometry.type === "LineString") as Feature<LineString> | undefined;
    if (!foundLine) throw new Error("FeatureCollection does not contain a LineString");
    lineFeature = foundLine;
  } else {
    if (centerline.geometry.type !== "LineString") throw new Error("Provided centerline is not a LineString");
    lineFeature = centerline;
  }

  const spacingKm = spacing / 1000; // convert to kilometers
  const lengthKm = length / 1000; // convert to kilometers
  const halfLength = lengthKm / 2;

  const totalLength = turf.length(lineFeature, { units: "kilometers" });

  for (let dist = 0; dist <= totalLength; dist += spacingKm) {
    const point = turf.along(lineFeature, dist, { units: "kilometers" });
    const before = turf.along(lineFeature, Math.max(dist - 0.01, 0), { units: "kilometers" });

    const bearing = turf.bearing(before, point);
    const perpendicularBearing = bearing + 90;

    const p1 = turf.destination(point, halfLength, perpendicularBearing, { units: "kilometers" });
    const p2 = turf.destination(point, halfLength, perpendicularBearing - 180, { units: "kilometers" });

    const transect = turf.lineString([p1.geometry.coordinates, p2.geometry.coordinates]);
    transekLines.push(transect);
  }

  return turf.featureCollection(transekLines);
}
