// src/utils/bearingUtils.ts
import * as turf from "@turf/turf";
import { Feature, Point } from "geojson";

/**
 * Menghitung bearing antara dua titik.
 * @param point1 - Titik awal.
 * @param point2 - Titik akhir.
 * @returns Bearing dalam derajat.
 */
export function calculateBearing(point1: Feature<Point>, point2: Feature<Point>): number {
  return turf.bearing(point1, point2);
}

/**
 * Menghitung bearing normal (tegak lurus) dari sebuah bearing.
 * @param bearing - Bearing awal.
 * @returns Bearing normal dalam rentang [0, 360).
 */
export function getNormalBearing(bearing: number): number {
  const normalBearing = bearing + 90;
  // Normalisasi ke rentang [0, 360)
  return ((normalBearing % 360) + 360) % 360;
}

/**
 * Menghitung offset dinamis untuk sampling titik sekitar.
 * @param spasi - Jarak antar transek.
 * @returns Offset dalam meter.
 */
export function calculateDynamicOffset(spasi: number): number {
  // Offset antara 1m hingga 5m, atau setengah dari spasi jika lebih kecil.
  return Math.max(1, Math.min(spasi / 2, 5));
}
