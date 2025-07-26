// === IMPORTS ===
import * as turf from "@turf/turf";
import { Feature, LineString, Point } from "geojson"; // Hapus Polygon dari sini

// === INTERFACE ===
// Sesuaikan interface untuk hasil yang hanya berisi transek mentah
interface GenerateRawTransectsResult {
  allTransects: Feature<LineString>[];
  samplingPoints: Feature<Point>[]; // Titik tengah setiap transek
  metadata: {
    totalLength: number;
    spasi: number;
    panjang: number;
    jumlahTransek: number;
    timestamp: string;
    useAutoBuffer: boolean; // Simpan info ini untuk referensi
  };
  riverLine: Feature<LineString>;
  // polygon akan dihapus dari return value karena tidak digunakan untuk clipping di sini
}

// === FUNGSI UTAMA (HANYA GENERATE TRANSEK MENTAH) ===
export function generateTransek( // Bisa tetap nama generateTransek
  riverLine: Feature<LineString>,
  // Hapus polygonFeature dari parameter karena tidak digunakan untuk generate
  spasi: number,
  panjang: number,
  useAutoBuffer: boolean = false // Tetap terima, tapi abaikan untuk clipping
): GenerateRawTransectsResult | null {
  const allTransects: Feature<LineString>[] = [];
  const samplingPoints: Feature<Point>[] = [];

  console.log("🚀 Memulai generateRawTransects (tanpa clipping)");
  console.log("PropertyParams:", { spasi, panjang, useAutoBuffer }); // Log tetap ada

  // --- VALIDASI INPUT DASAR ---
  if (!riverLine) {
    console.warn("❌ Input tidak valid: riverLine kosong");
    return null;
  }

  if (riverLine.geometry?.type !== "LineString") {
    console.error("❌ riverLine bukan LineString:", riverLine.geometry?.type);
    return null;
  }

  // --- HITUNG PANJANG SUNGAI & JUMLAH TRANSEK ---
  const totalLength = turf.length(riverLine, { units: "meters" });
  const steps = Math.floor(totalLength / spasi);

  console.log(`📏 Total panjang sungai: ${totalLength.toFixed(2)} meter`);
  console.log(`🎯 Jumlah transek yang akan dibuat: ${steps + 1} (spasi: ${spasi}m)`);

  // --- LOOP UNTUK SETIAP TRANSEK ---
  for (let i = 0; i <= steps; i++) {
    const dist = i * spasi;
    let center, prev, next;

    try {
      center = turf.along(riverLine, dist, { units: "meters" });
    } catch (e: any) {
      console.warn(`❌ Gagal ambil titik center pada jarak ${dist}m`, e?.message);
      continue;
    }

    // --- OFFSET DINAMIS UNTUK PERHITUNGAN BEARING ---
    const offset = Math.max(1, Math.min(spasi / 2, 5)); // Antara 1m sampai 5m

    try {
      // Hindari jarak 0 untuk prev
      prev = turf.along(riverLine, Math.max(dist - offset, 0.001), { units: "meters" });
      // Hindari melebihi panjang total untuk next
      next = turf.along(riverLine, Math.min(dist + offset, totalLength), { units: "meters" });
    } catch (e: any) {
      console.warn(`❌ Gagal ambil titik prev/next di dist=${dist}`, e?.message);
      // Jika gagal, skip transek ini
      continue;
    }

    const bearing = turf.bearing(prev, next);
    const normalBearing = bearing + 90;
    const normalizedNormalBearing = ((normalBearing % 360) + 360) % 360;

    // --- GENERATE TRANSEK TEGAK LURUS ---
    const p1 = turf.destination(center, panjang / 2, normalizedNormalBearing, { units: "meters" });
    const p2 = turf.destination(center, panjang / 2, normalizedNormalBearing + 180, { units: "meters" });

    const transect = turf.lineString([p1.geometry.coordinates, p2.geometry.coordinates]);

    // --- TAMBAHKAN ID DAN INFO ---
    const id = `TR_RAW-${String(i + 1).padStart(3, "0")}`;
    const transectWithProps = turf.lineString(transect.geometry.coordinates, {
      id,
      index: i,
      distanceFromStart: parseFloat(dist.toFixed(2)),
      bearing: parseFloat(bearing.toFixed(2)),
      normalBearing: parseFloat(normalizedNormalBearing.toFixed(2)),
      center: center.geometry.coordinates,
      color: "#0000FF", // Biru untuk menandakan mentah
      // Tambahkan panjang teoritis transek
      theoreticalLength: panjang,
    });

    allTransects.push(transectWithProps);

    // --- TAMBAHKAN SAMPLING POINT (CENTER) ---
    samplingPoints.push({
      type: "Feature",
      geometry: center.geometry,
      properties: {
        transectId: id,
        index: i,
        distanceFromStart: parseFloat(dist.toFixed(2)),
        color: "#FF0000", // Merah untuk menandakan titik
      },
    });

    console.log(`🏗️  Transek mentah dibuat: ${id} (dist: ${dist.toFixed(2)}m)`);
  }

  // --- SIAPKAN OUTPUT ---
  const metadata = {
    totalLength,
    spasi,
    panjang,
    jumlahTransek: allTransects.length,
    timestamp: new Date().toISOString(),
    useAutoBuffer, // Simpan untuk info
  };

  console.log(`\n✅=== GENERATE TRANSEK MENTAH SELESAI ===✅`);
  console.log(`📊 Jumlah transek mentah: ${allTransects.length}`);
  console.log(`📊 Jumlah sampling points: ${samplingPoints.length}`);

  // --- INSTRUKSI VISUALISASI ---
  console.log("%c📋 SALIN DATA DI BAWAH KE https://geojson.io   ", "color: blue; font-weight: bold");
  console.log("👉 River Line:", JSON.stringify(riverLine));
  console.log("👉 Semua Transek Mentah:", JSON.stringify({ type: "FeatureCollection", features: allTransects }));
  console.log("👉 Semua Sampling Points:", JSON.stringify({ type: "FeatureCollection", features: samplingPoints }));
  console.log("✅ Selesai. Salin salah satu untuk lihat di peta.");

  return {
    allTransects,
    samplingPoints,
    metadata,
    riverLine,
    // polygon tidak dikembalikan karena tidak digunakan
  };
}
