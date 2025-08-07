// src/hooks/useValidatedTransects.ts
import { useState, useEffect } from "react";
import * as turf from "@turf/turf";
import type { Feature, LineString, Point } from "geojson";

function useValidatedTransects() {
  const [features, setFeatures] = useState<Feature<LineString>[]>([]);
  const [points, setPoints] = useState<Feature<Point>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query GetAllValidatedTransects {
                validatedTransects(surveyId: "") {
                  transectId
                  isValid
                  reason
                  clippedLength
                  geometry
                  pointGeometry
                }
              }
            `,
          }),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors.map((e: any) => e.message).join(", "));
        }

        if (result.data?.validatedTransects) {
          const lines = result.data.validatedTransects.map((t: any) => ({
            type: "Feature",
            properties: {
              transectId: t.transectId,
              isValid: t.isValid,
              reason: t.reason,
              clippedLength: t.clippedLength,
              color: t.isValid ? "#00FF00" : "#FF0000",
            },
            geometry: t.geometry,
          }));
          const pts = result.data.validatedTransects.map((t: any) => ({
            type: "Feature",
            properties: {
              transectId: t.transectId,
              isValid: t.isValid,
              color: t.isValid ? "#00FF00" : "#FF0000",
            },
            geometry: t.pointGeometry,
          }));
          setFeatures(lines);
          setPoints(pts);
        }
      } catch (err: any) {
        console.error("Gagal ambil hasil validasi:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return { features, points, loading, error };
}

export default useValidatedTransects;
