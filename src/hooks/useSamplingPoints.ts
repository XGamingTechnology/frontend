// src/hooks/useSamplingPoints.ts
import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/apiClient";

export interface SamplingPoint {
  surveyId: string;
  distance: number;
  offset: number;
  depth: number;
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
          const key = Object.keys(result.data || {})[0];
          const pointsData = result.data?.[key] || [];

          const points = pointsData
            .map((p: any) => {
              const meta = p.meta || {};
              const depth = parseFloat(meta.depth_value ?? meta.kedalaman ?? 0);
              const distance = parseFloat(meta.distance_from_start ?? meta.distance ?? 0);
              const offset = parseFloat(meta.offset_m ?? meta.offset ?? 0);
              return isNaN(depth) || isNaN(distance) || isNaN(offset)
                ? null
                : {
                    surveyId,
                    distance,
                    offset,
                    depth: Math.abs(depth),
                  };
            })
            .filter(Boolean) as SamplingPoint[];

          points.sort((a, b) => a.distance - b.distance);
          newData[surveyId] = points;
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
