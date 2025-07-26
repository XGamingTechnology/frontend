// src/utils/validatePolygon.ts
import * as turf from "@turf/turf";
import { Feature, Polygon } from "geojson";

/**
 * Memvalidasi dan memperbaiki orientasi ring polygon jika perlu.
 * @param polygonFeature - Polygon yang akan divalidasi.
 * @returns Polygon yang telah divalidasi (dan mungkin diperbaiki).
 */
export function validateAndFixPolygon(polygonFeature: Feature<Polygon>): Feature<Polygon> {
  let processedPolygon: Feature<Polygon> = polygonFeature;

  try {
    const isValid = turf.booleanValid(processedPolygon);
    if (!isValid) {
      console.warn("⚠️ Polygon tidak valid, mencoba perbaiki ring orientation...");
      // Gunakan rewind untuk memperbaiki orientasi
      processedPolygon = turf.rewind(processedPolygon, { reverse: false });
      if (!turf.booleanValid(processedPolygon)) {
        console.error("❌ Gagal memperbaiki polygon. Tetap lanjut dengan risiko.");
      } else {
        console.log("✅ Polygon berhasil diperbaiki.");
      }
    } else {
      console.log("✅ Polygon input sudah valid.");
    }
  } catch (e) {
    console.error("❌ Error saat validasi/perbaikan polygon:", e);
  }

  return processedPolygon;
}
