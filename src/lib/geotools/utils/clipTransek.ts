// src/utils/clipTransek.ts
import * as turf from "@turf/turf";
import { Feature, LineString, Polygon, Geometry } from "geojson";

interface ClipResult {
  clippedSegment: Feature<LineString> | null;
  method: "within" | "intersect" | "lineSplit" | "none";
  debugInfo?: any; // Untuk logging tambahan jika diperlukan
}

/**
 * Memotong transek dengan polygon untuk mendapatkan bagian yang berada di dalam polygon.
 * @param transect - Transek (garis) yang akan dipotong.
 * @param polygon - Polygon batas.
 * @returns Objek hasil clipping.
 */
export function clipTransekWithPolygon(transect: Feature<LineString>, polygon: Feature<Polygon>): ClipResult {
  let clipped: Feature<LineString> | null = null;
  let method: "within" | "intersect" | "lineSplit" | "none" = "none";

  // --- CEK INTERAKSI DENGAN POLYGON ---
  let intersects = false;
  let within = false;

  try {
    intersects = turf.booleanIntersects(polygon, transect);
    within = turf.booleanWithin(transect, polygon);
  } catch (e: any) {
    console.warn(`❌ Gagal cek geometri antara transek dan polygon:`, e?.message);
    return { clippedSegment: null, method: "none" };
  }

  // --- CLIPPING: Gunakan intersect atau lineSplit ---
  if (within) {
    clipped = transect;
    method = "within";
  } else if (intersects) {
    try {
      // Cast ke unknown dulu untuk menghindari error typescript
      const result = turf.intersect(transect, polygon) as unknown as Feature<Geometry> | null;

      if (result) {
        if (result.geometry.type === "LineString") {
          // Aman untuk di-cast ke Feature<LineString>
          clipped = result as Feature<LineString>;
          method = "intersect";
        }
        // Bisa juga menangani MultiLineString jika diperlukan
        // else if (result.geometry.type === "MultiLineString" && result.geometry.coordinates.length > 0) {
        //   // Ambil garis pertama dari MultiLineString
        //   const firstLine = result.geometry.coordinates[0];
        //   clipped = turf.lineString(firstLine) as Feature<LineString>;
        //   method = "intersect";
        // }
      }
    } catch (e: any) {
      console.warn("⚠️ intersect gagal, coba lineSplit...", e?.message);
      try {
        const split = turf.lineSplit(transect, polygon);
        for (const seg of split.features) {
          if (turf.booleanWithin(seg, polygon)) {
            clipped = seg as Feature<LineString>; // Kita yakin ini LineString
            method = "lineSplit";
            break;
          }
        }
      } catch (splitErr: any) {
        console.error("❌ lineSplit juga gagal:", splitErr?.message);
      }
    }
  }

  return { clippedSegment: clipped, method };
}
