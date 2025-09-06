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
        if (!survey) {
          console.warn(`⚠️ Survey tidak ditemukan di surveyGroups: ${surveyId}`);
          continue;
        }

        try {
          let points: SamplingPoint[] = [];

          if (survey.source === "import") {
            // ✅ GUNAKAN RESOLVER YANG SUDAH DIPERBAIKI
            console.log(`🔍 [useSamplingPoints] Ambil data upload untuk ${surveyId}`);
            const query = `
              query GetFieldPoints($surveyId: String!) {
                fieldSurveyPointsBySurveyId(surveyId: $surveyId) {
                  meta
                  geometry
                }
              }
            `;

            const res = await fetchWithAuth("http://localhost:5000/graphql", {
              method: "POST",
              body: JSON.stringify({ query, variables: { surveyId } }),
            });

            const result = await res.json();
            if (result.errors) {
              console.error(`❌ GraphQL Error for ${surveyId}:`, result.errors);
              continue;
            }

            const pointsData = result.data?.fieldSurveyPointsBySurveyId || [];

            points = pointsData
              .map((p: any) => {
                const meta = p.meta || {};
                const depth = parseFloat(meta.depth_value ?? meta.kedalaman ?? 0);
                const distance = parseFloat(meta.distance_m ?? 0);
                const offset = parseFloat(meta.offset_m ?? 0);

                if (isNaN(depth) || isNaN(distance) || isNaN(offset)) return null;

                return {
                  surveyId,
                  distance,
                  offset,
                  depth: -Math.abs(depth),
                };
              })
              .filter((p): p is SamplingPoint => p !== null);

            points.sort((a, b) => a.distance - b.distance);
          } else {
            // 🔹 Data simulasi: pakai resolver asli
            console.log(`🔍 [useSamplingPoints] Ambil data simulasi untuk ${surveyId}`);
            const query = `
              query GetSimulatedPoints($surveyId: String!) {
                samplingPointsBySurveyId(surveyId: $surveyId) {
                  meta
                  geometry
                }
              }
            `;

            const res = await fetchWithAuth("http://localhost:5000/graphql", {
              method: "POST",
              body: JSON.stringify({ query, variables: { surveyId } }),
            });

            const result = await res.json();
            if (result.errors) {
              console.error(`❌ GraphQL Error for ${surveyId}:`, result.errors);
              continue;
            }

            const pointsData = result.data?.samplingPointsBySurveyId || [];

            points = pointsData
              .map((p: any) => {
                const meta = p.meta || {};
                const depth = parseFloat(meta.depth_value ?? meta.kedalaman ?? 0);
                const distance = parseFloat(meta.distance_m ?? meta.distance_from_start ?? 0);
                const offset = parseFloat(meta.offset_m ?? 0);

                if (isNaN(depth) || isNaN(distance) || isNaN(offset)) return null;

                return {
                  surveyId,
                  distance,
                  offset,
                  depth: -Math.abs(depth),
                };
              })
              .filter((p): p is SamplingPoint => p !== null);

            points.sort((a, b) => a.distance - b.distance);
          }

          console.log(`✅ [useSamplingPoints] ${points.length} titik dimuat untuk ${surveyId}`);
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
