// src/lib/geotools/clipTransectsSimple.ts
import * as turf from "@turf/turf";
import type { Feature, LineString, Polygon, Point, MultiPolygon } from "geojson";

// --- Definisi Tipe ---
export interface ClipTransectsSimpleOptions {
  useAutoBufferPolygon?: boolean;
  bufferDistance?: number;
  manualPolygon?: Feature<Polygon | MultiPolygon>;
  riverLine?: Feature<LineString>;
}

export interface ClipTransectsSimpleResult {
  clippedTransects: Feature<LineString>[];
  unclippedTransects: Feature<LineString>[];
}

export interface GeneratedTransectsData {
  transects: Feature<LineString>[];
  samplingPoints: Feature<Point>[];
  meta?: {
    clippedBy?: string;
    totalClipped?: number;
    [key: string]: any;
  };
}

// --- Fungsi Bantu untuk Debugging Geometri ---
function logGeometryInfo(label: string, geometry: any) {
  try {
    const bbox = turf.bbox(geometry);
    const centroid = turf.centroid(geometry).geometry.coordinates;
    let coordCount = 0;
    if (geometry.geometry?.type === "Polygon") {
      coordCount = geometry.geometry.coordinates[0]?.length || 0;
    } else if (geometry.geometry?.type === "MultiPolygon") {
      geometry.geometry.coordinates.forEach((poly: any[]) => {
        coordCount += poly[0]?.length || 0;
      });
    } else if (geometry.geometry?.type === "LineString") {
      coordCount = geometry.geometry.coordinates.length;
    }
    console.log(`🔍 Debug ${label}: BBox=[${bbox.map((c) => c.toFixed(6)).join(", ")}], Centroid=[${centroid.map((c) => c.toFixed(6)).join(", ")}], CoordCount=${coordCount}`);
  } catch (e) {
    console.warn(`⚠️ Gagal mendapatkan info debug untuk ${label}:`, e);
  }
}

// --- Clipping Single Transect ---
function clipSingleTransect(transect: Feature<LineString>, polygon: Feature<Polygon | MultiPolygon>): Feature<LineString> | null {
  try {
    const transectId = transect.properties?.id || "N/A";
    console.log(`\n--- START CLIP TRANSEK ${transectId} ---`);

    // ✅ Validasi input transect
    if (!transect?.geometry?.coordinates || transect.geometry.coordinates.length < 2) {
      console.warn("❌ Transect tidak valid (koordinat hilang/tidak cukup):", transectId);
      return null;
    }

    // ✅ Validasi input polygon
    if (!polygon?.geometry) {
      console.warn("❌ Polygon tidak valid untuk clipping (geometri hilang).");
      return null;
    }

    // ✅ Bersihkan geometri untuk menghindari error
    // PERHATIAN: turf.cleanCoords bisa menyebabkan masalah pada beberapa geometri kompleks
    // Oleh karena itu, kita gunakan geometri asli untuk booleanIntersects dan intersect,
    // dan hanya membersihkan jika diperlukan untuk operasi tertentu.
    const cleanTransect = transect; // Gunakan geometri asli
    const cleanPolygon = polygon; // Gunakan geometri asli

    // === TAMBAHAN: Debugging Geometri ===
    console.log("🔍 [DEBUG GEOMETRY]");
    logGeometryInfo("Transect (Asli)", cleanTransect);
    logGeometryInfo("Polygon (Asli)", cleanPolygon);
    console.log("%c------------------------------", "color: gray;");
    // === AKHIR TAMBAHAN ===

    // === TAMBAHAN: Pemeriksaan Bounding Box Awal ===
    const transectBbox = turf.bbox(cleanTransect);
    const polygonBbox = turf.bbox(cleanPolygon);
    const transectCenter = [(transectBbox[0] + transectBbox[2]) / 2, (transectBbox[1] + transectBbox[3]) / 2];
    const polygonCenter = [(polygonBbox[0] + polygonBbox[2]) / 2, (polygonBbox[1] + polygonBbox[3]) / 2];
    const distanceBetweenCenters = turf.distance(turf.point(transectCenter), turf.point(polygonCenter), { units: "kilometers" });
    console.log(`📏 Jarak antar centroid (km): ${distanceBetweenCenters.toFixed(2)}`);

    // Cek apakah bbox memiliki range yang masuk akal (misal, tidak lebih dari 1000 km)
    const transectWidth = turf.distance(turf.point([transectBbox[0], transectCenter[1]]), turf.point([transectBbox[2], transectCenter[1]]), { units: "kilometers" });
    const transectHeight = turf.distance(turf.point([transectCenter[0], transectBbox[1]]), turf.point([transectCenter[0], transectBbox[3]]), { units: "kilometers" });
    const polygonWidth = turf.distance(turf.point([polygonBbox[0], polygonCenter[1]]), turf.point([polygonBbox[2], polygonCenter[1]]), { units: "kilometers" });
    const polygonHeight = turf.distance(turf.point([polygonCenter[0], polygonBbox[1]]), turf.point([polygonCenter[0], polygonBbox[3]]), { units: "kilometers" });
    console.log(`📏 Ukuran Transect (WxH km): ${transectWidth.toFixed(2)} x ${transectHeight.toFixed(2)}`);
    console.log(`📏 Ukuran Polygon (WxH km): ${polygonWidth.toFixed(2)} x ${polygonHeight.toFixed(2)}`);

    if (distanceBetweenCenters > 1000) {
      // Threshold arbitrer, bisa disesuaikan
      console.warn(`⚠️ Jarak antar centroid sangat besar (${distanceBetweenCenters.toFixed(2)} km). Mungkin ada masalah koordinat (misal, [lat,lng] <-> [lng,lat]).`);
      return null;
    }
    // === AKHIR TAMBAHAN ===

    // ✅ Cek apakah transek berpotongan secara spasial dengan polygon
    const intersects = turf.booleanIntersects(cleanTransect, cleanPolygon);
    console.log(`📊 Transect ${transectId} intersects polygon: ${intersects}`);

    if (!intersects) {
      console.log(`⏭️  Transect ${transectId} dilewati (tidak berpotongan).`);
      return null;
    }

    // ✅ --- METODE UTAMA CLIPPING: turf.intersect ---
    const intersectResult = turf.intersect(cleanTransect, cleanPolygon);

    if (intersectResult && intersectResult.geometry?.type === "LineString") {
      console.log(`✅ Transect ${transectId} berhasil dipotong.`);
      return {
        ...intersectResult, // Gunakan geometri hasil intersect
        properties: {
          ...(transect.properties || {}),
          clipped: true,
          clipMethod: "turfIntersect",
          clippedLength: parseFloat(turf.length(intersectResult, { units: "meters" }).toFixed(2)),
        },
      };
    } else if (intersectResult && intersectResult.geometry?.type === "MultiLineString") {
      // Jika hasilnya MultiLineString, ambil garis terpanjang sebagai representasi
      console.warn(`⚠️  Transect ${transectId} menghasilkan MultiLineString. Mengambil segmen terpanjang.`);
      const lineStrings = intersectResult.geometry.coordinates.map((coords) => turf.lineString(coords));
      // Cari LineString dengan panjang terbesar
      let longestLine: turf.Feature<turf.LineString> | null = null;
      let maxLength = 0;
      lineStrings.forEach((line) => {
        const len = turf.length(line, { units: "meters" });
        if (len > maxLength) {
          maxLength = len;
          longestLine = line;
        }
      });

      if (longestLine) {
        return {
          ...longestLine,
          properties: {
            ...(transect.properties || {}),
            clipped: true,
            clipMethod: "turfIntersect_MultiLineString_Longest",
            clippedLength: parseFloat(maxLength.toFixed(2)),
          },
        };
      } else {
        console.warn(`⚠️  Transect ${transectId} MultiLineString kosong setelah diproses.`);
        return null;
      }
    }
    // Jika intersectResult null, bukan LineString, atau MultiLineString kosong/tidak bisa diproses
    console.warn(`⚠️  Gagal memotong Transect ${transectId} dengan turf.intersect. Hasil:`, intersectResult?.geometry?.type || "null/undefined");
    return null;
  } catch (error: any) {
    // Lebih spesifik tangkap error
    const transectId = transect.properties?.id || "unknown";
    console.error(`❌ Error clipping transek ${transectId}:`, error.message || error);
    return null; // Jika error, anggap transek ini tidak bisa diproses
  } finally {
    console.log(`--- END CLIP TRANSEK ${transect.properties?.id || "unknown"} ---\n`);
  }
}

// --- Clipping Banyak Transek ---
export async function clipTransectsSimple(transects: Feature<LineString>[], options: ClipTransectsSimpleOptions): Promise<ClipTransectsSimpleResult> {
  console.log("🔍 [CLIP GARIS SIMPLE] Mulai clipTransectsSimple:", options);

  const { useAutoBufferPolygon, bufferDistance, manualPolygon, riverLine } = options;

  let clippingPolygon: Feature<Polygon | MultiPolygon> | null = null;

  // --- Menentukan Polygon untuk Clipping ---
  if (useAutoBufferPolygon) {
    console.log("🔄 Mode: Menggunakan buffer otomatis dari riverLine");
    if (!riverLine || !bufferDistance || bufferDistance <= 0) {
      const errorMsg = "❌ Buffer otomatis memerlukan riverLine dan bufferDistance.";
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    try {
      const bufferResult = turf.buffer(riverLine, bufferDistance, {
        units: "meters",
      });
      if (bufferResult.geometry?.type === "Polygon" || bufferResult.geometry?.type === "MultiPolygon") {
        clippingPolygon = bufferResult as Feature<Polygon | MultiPolygon>;
        console.log("✅ Polygon buffer berhasil dibuat.");
      } else {
        const errorMsg = "Buffer tidak valid.";
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (e: any) {
      const errorMsg = `❌ Gagal membuat buffer otomatis: ${e?.message}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  } else {
    console.log("🔄 Mode: Menggunakan polygon manual");
    if (!manualPolygon) {
      const errorMsg = "❌ Polygon manual tidak ditemukan.";
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    clippingPolygon = manualPolygon;
    console.log("✅ Menggunakan polygon manual.");

    // Validasi geometri polygon manual
    if (!(clippingPolygon.geometry?.type === "Polygon" || clippingPolygon.geometry?.type === "MultiPolygon")) {
      const errorMsg = `❌ manualPolygon yang diberikan bukan Polygon atau MultiPolygon (tipe: ${clippingPolygon.geometry?.type || "null/undefined"}).`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }

  if (!clippingPolygon) {
    const errorMsg = "❌ Tidak ada polygon valid untuk clipping.";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // === DEBUGGING: LOG DATA KE CONSOLE UNTUK DICEK DI geojson.io ===
  console.log("%c📋 === DEBUG GEOJSON UNTUK geojson.io ===", "color: blue; font-weight: bold");
  console.log("Polygon Clipping (dipilih oleh user):");
  // Hapus properti yang besar jika ada untuk mencegah log terlalu panjang
  const { properties: selectedProps, ...selectedPolygonToLog } = clippingPolygon;
  console.log(JSON.stringify(selectedPolygonToLog));
  console.log("Beberapa Transek Mentah (5 pertama):");
  console.log(
    JSON.stringify({
      type: "FeatureCollection",
      features: transects.slice(0, 5).map((t) => {
        // Hapus properti besar untuk log
        const { properties, ...geom } = t;
        return { ...geom, properties: { id: properties?.id, index: properties?.index } };
      }),
    })
  );
  console.log("%c==============================", "color: blue; font-weight: bold");
  // === END DEBUGGING ===

  // --- Validasi Polygon Clipping ---
  try {
    const kinks = turf.kinks(clippingPolygon);
    if (kinks.features.length > 0) {
      console.warn("⚠️ Polygon clipping memiliki self-intersections! Ini bisa menyebabkan hasil clipping tidak akurat.");
    }
  } catch (e) {
    console.warn("⚠️ Gagal memeriksa self-intersections pada polygon clipping:", e);
  }

  const clippedTransects: Feature<LineString>[] = [];
  const unclippedTransects: Feature<LineString>[] = []; // Untuk menyimpan transek yang tidak terpotong/error

  console.log(`📊 Memulai clipping ${transects.length} transects...`);

  for (const [index, transect] of transects.entries()) {
    console.log(`\n--- Processing transect ${index + 1}/${transects.length} ---`);
    const clipped = clipSingleTransect(transect, clippingPolygon);
    if (clipped) {
      clippedTransects.push(clipped);
    } else {
      unclippedTransects.push(transect);
    }
  }

  console.log(`\n✅ Clipping selesai:`);
  console.log(`   - Berhasil dipotong (clipped): ${clippedTransects.length}`);
  console.log(`   - Tidak dipotong/error (unclipped): ${unclippedTransects.length}`);

  return {
    clippedTransects,
    unclippedTransects, // Dikembalikan untuk transparansi
  };
}
