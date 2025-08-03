// === IMPORTS ===
import * as turf from "@turf/turf";
import { Feature, LineString, Point } from "geojson";

interface GenerateRawTransectsResult {
  allTransects: Feature<LineString>[];
  samplingPoints: Feature<Point>[];
  metadata: {
    totalLength: number;
    spasi: number;
    panjang: number;
    jumlahTransek: number;
    timestamp: string;
    useAutoBuffer: boolean;
  };
  riverLine: Feature<LineString>;
}

export function generateTransek(riverLine: Feature<LineString>, spasi: number, panjang: number, useAutoBuffer: boolean = false): GenerateRawTransectsResult | null {
  const allTransects: Feature<LineString>[] = [];
  const samplingPoints: Feature<Point>[] = [];

  console.log("🚀 Memulai generateRawTransects (tanpa clipping)");
  console.log("PropertyParams:", { spasi, panjang, useAutoBuffer });

  if (!riverLine) {
    console.warn("❌ Input tidak valid: riverLine kosong");
    return null;
  }

  if (riverLine.geometry?.type !== "LineString") {
    console.error("❌ riverLine bukan LineString:", riverLine.geometry?.type);
    return null;
  }

  const totalLength = turf.length(riverLine, { units: "meters" });
  const steps = Math.floor(totalLength / spasi);

  console.log(`📏 Total panjang sungai: ${totalLength.toFixed(2)} meter`);
  console.log(`🎯 Jumlah transek yang akan dibuat: ${steps + 1} (spasi: ${spasi}m)`);

  for (let i = 0; i <= steps; i++) {
    const dist = i * spasi;
    let center, prev, next;

    try {
      center = turf.along(riverLine, dist, { units: "meters" });
    } catch (e: any) {
      console.warn(`❌ Gagal ambil titik center pada jarak ${dist}m`, e?.message);
      continue;
    }

    const offset = Math.max(1, Math.min(spasi / 2, 5));

    try {
      prev = turf.along(riverLine, Math.max(dist - offset, 0.001), { units: "meters" });
      next = turf.along(riverLine, Math.min(dist + offset, totalLength), { units: "meters" });
    } catch (e: any) {
      console.warn(`❌ Gagal ambil titik prev/next di dist=${dist}`, e?.message);
      continue;
    }

    const bearing = turf.bearing(prev, next);
    const normalBearing = bearing + 90;
    const normalizedNormalBearing = ((normalBearing % 360) + 360) % 360;

    const p1 = turf.destination(center, panjang / 2, normalizedNormalBearing, { units: "meters" });
    const p2 = turf.destination(center, panjang / 2, normalizedNormalBearing + 180, { units: "meters" });

    const transect = turf.lineString([p1.geometry.coordinates, p2.geometry.coordinates]);

    const id = `TR_RAW-${String(i + 1).padStart(3, "0")}`;
    const transectWithProps = turf.lineString(transect.geometry.coordinates, {
      id,
      index: i,
      distanceFromStart: parseFloat(dist.toFixed(2)),
      bearing: parseFloat(bearing.toFixed(2)),
      normalBearing: parseFloat(normalizedNormalBearing.toFixed(2)),
      center: center.geometry.coordinates,
      color: "#0000FF",
      theoreticalLength: panjang,
    });

    allTransects.push(transectWithProps);

    // ✅ Perbaiki: pastikan coordinates [lng, lat]
    samplingPoints.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [center.geometry.coordinates[0], center.geometry.coordinates[1]],
      },
      properties: {
        transectId: id,
        index: i,
        distanceFromStart: parseFloat(dist.toFixed(2)),
        color: "#FF0000",
      },
    });

    console.log(`🏗️  Transek mentah dibuat: ${id} (dist: ${dist.toFixed(2)}m)`);
  }

  const metadata = {
    totalLength,
    spasi,
    panjang,
    jumlahTransek: allTransects.length,
    timestamp: new Date().toISOString(),
    useAutoBuffer,
  };

  console.log(`\n✅=== GENERATE TRANSEK MENTAH SELESAI ===✅`);
  console.log(`📊 Jumlah transek mentah: ${allTransects.length}`);
  console.log(`📊 Jumlah sampling points: ${samplingPoints.length}`);

  console.log("%c📋 SALIN DATA DI BAWAH KE https://geojson.io     ", "color: blue; font-weight: bold");
  console.log("👉 River Line:", JSON.stringify(riverLine));
  console.log("👉 Semua Transek Mentah:", JSON.stringify({ type: "FeatureCollection", features: allTransects }));
  console.log("👉 Semua Sampling Points:", JSON.stringify({ type: "FeatureCollection", features: samplingPoints }));
  console.log("✅ Selesai. Salin salah satu untuk lihat di peta.");

  return {
    allTransects,
    samplingPoints,
    metadata,
    riverLine,
  };
}
