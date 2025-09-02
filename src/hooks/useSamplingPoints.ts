// src/hooks/useSamplingPoints.ts
import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/apiClient";

export interface SamplingPoint {
  surveyId: string;
  distance: number; // Jarak dari awal transek (untuk longitudinal)
  offset: number; // Offset melintang (untuk cross-section)
  depth: number; // Kedalaman (negatif = lebih dalam)
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
          let query: string;
          let fieldName: string;

          // ✅ Tentukan query berdasarkan source
          if (survey.source === "import") {
            // Data lapangan: urutkan berdasarkan sequence
            query = `
              query GetFieldPoints($surveyId: String!) {
                fieldSurveyPointsBySurveyId(surveyId: $surveyId) {
                  meta
                  geometry
                }
              }
            `;
            fieldName = "fieldSurveyPointsBySurveyId";
          } else {
            // Data simulasi: bisa dari transect atau langsung
            query = `
              query GetSimulatedPoints($surveyId: String!) {
                samplingPointsBySurveyId(surveyId: $surveyId) {
                  meta
                  geometry
                }
              }
            `;
            fieldName = "samplingPointsBySurveyId";
          }

          const res = await fetchWithAuth("http://localhost:5000/graphql", {
            method: "POST",
            body: JSON.stringify({ query, variables: { surveyId } }),
          });

          const result = await res.json();
          console.log(`📊 [useSamplingPoints] Result for ${surveyId}:`, result);

          if (result.errors) {
            console.error(`❌ GraphQL Error for ${surveyId}:`, result.errors);
            continue;
          }

          const pointsData = result.data?.[fieldName] || [];
          console.log(`📍 Raw points for ${surveyId}:`, pointsData);

          const points = pointsData
            .map((p: any) => {
              const meta = p.meta || {};

              // ✅ Ambil kedalaman — prioritas: depth_value > kedalaman > 0
              const depthRaw = meta.depth_value ?? meta.kedalaman ?? meta.depth ?? 0;
              const depth = parseFloat(depthRaw);
              if (isNaN(depth)) return null;

              // ✅ Ambil jarak — prioritas: distance_from_start > distance_m > distance > 0
              const distanceRaw = meta.distance_from_start ?? meta.distance_m ?? meta.distance ?? 0;
              const distance = parseFloat(distanceRaw);
              if (isNaN(distance)) return null;

              // ✅ Ambil offset — prioritas: offset_m > offset > 0
              const offsetRaw = meta.offset_m ?? meta.offset ?? 0;
              const offset = parseFloat(offsetRaw);
              if (isNaN(offset)) return null;

              return {
                surveyId,
                distance, // → longitudinal
                offset, // → cross-section
                depth: -Math.abs(depth), // ✅ Kedalaman negatif (semakin dalam, semakin negatif)
              };
            })
            .filter((point): point is SamplingPoint => point !== null); // Type guard

          // ✅ Urutkan berdasarkan jarak
          points.sort((a, b) => a.distance - b.distance);

          newData[surveyId] = points;
          console.log(`✅ [useSamplingPoints] ${points.length} titik valid untuk ${surveyId}`);
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
