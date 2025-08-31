// src/hooks/useSamplingPoints.ts
import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/apiClient";

export interface SamplingPoint {
  surveyId: string;
  distance: number;
  offset: number;
  depth: number; // ← bisa negatif (misal: -2.44)
}

export function useSamplingPoints(selectedSurveyIds: string[], surveyGroups: { surveyId: string; source: string }[]) {
  const [allData, setAllData] = useState<Record<string, SamplingPoint[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedSurveyIds.length === 0) {
      setAllData({});
      return;
    }

    setLoading(true);
    const fetchPoints = async () => {
      const newData: Record<string, SamplingPoint[]> = {};

      for (const surveyId of selectedSurveyIds) {
        const survey = surveyGroups.find((s) => s.surveyId === surveyId);
        if (!survey) continue;

        const isField = survey.source === "import";
        const query = isField ? `{ fieldSurveyPointsBySurveyId(surveyId: "${surveyId}") { meta } }` : `{ simulatedPointsBySurveyId(surveyId: "${surveyId}") { meta } }`;

        try {
          const res = await fetchWithAuth("http://localhost:5000/graphql", {
            method: "POST",
            body: JSON.stringify({ query }),
          });

          const result = await res.json();
          console.log("📊 [useSamplingPoints] Result dari GraphQL:", result);

          const key = Object.keys(result.data || {})[0];
          const pointsData = result.data?.[key] || [];

          console.log("📍 [useSamplingPoints] Raw pointsData:", pointsData);

          const points = pointsData
            .map((p: any) => {
              const meta = p.meta || {};
              // Ambil nilai asli (bisa negatif)
              const depth = parseFloat(meta.depth_value ?? meta.kedalaman ?? 0);
              const distance = parseFloat(meta.distance_from_start ?? meta.distance ?? 0);
              const offset = parseFloat(meta.offset_m ?? meta.offset ?? 0);

              if (isNaN(depth) || isNaN(distance) || isNaN(offset)) {
                console.warn("⚠️ Data tidak valid dilewati:", meta);
                return null;
              }

              return {
                surveyId,
                distance,
                offset,
                depth, // ✅ HAPUS Math.abs() → biarkan negatif
              };
            })
            .filter(Boolean) as SamplingPoint[];

          // Urutkan berdasarkan jarak
          points.sort((a, b) => a.distance - b.distance);
          newData[surveyId] = points;

          console.log(`✅ [useSamplingPoints] ${points.length} titik untuk ${surveyId}`);
        } catch (err) {
          console.error("❌ Gagal ambil titik:", surveyId, err);
        }
      }

      setAllData(newData);
      setLoading(false);
    };

    fetchPoints();
  }, [selectedSurveyIds, surveyGroups]);

  return { allData, loading };
}
