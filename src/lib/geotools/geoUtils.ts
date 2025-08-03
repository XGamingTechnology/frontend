// utils/geoUtils.ts
export const createPointFeature = (coordinates: [number, number], properties: Record<string, any>) => {
  // ✅ Validasi
  if (!coordinates || coordinates.length !== 2) {
    throw new Error("Koordinat harus array [lng, lat]");
  }
  if (isNaN(coordinates[0]) || isNaN(coordinates[1])) {
    throw new Error(`Koordinat tidak valid: [${coordinates[0]}, ${coordinates[1]}]`);
  }

  // ✅ Pastikan format benar: [lng, lat]
  const geoJsonGeometry = {
    type: "Point" as const,
    coordinates: [coordinates[0], coordinates[1]], // ✅ [lng, lat]
  };

  return {
    type: "Feature" as const,
    geometry: geoJsonGeometry,
    properties: {
      ...properties,
      layerType: properties.layerType || "custom",
    },
  };
};
