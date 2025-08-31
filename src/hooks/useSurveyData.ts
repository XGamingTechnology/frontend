// src/hooks/useSurveyData.ts
import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/apiClient";

export interface SurveyGroup {
  surveyId: string;
  date: string;
  source: string;
}

export function useSurveyData(activeTab: "field" | "simulated") {
  const [surveyGroups, setSurveyGroups] = useState<SurveyGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (activeTab === "field") {
          const saved = localStorage.getItem("fieldSurveys");
          const parsed: SurveyGroup[] = saved ? JSON.parse(saved) : [];
          const valid = parsed.filter((s) => s.source === "import");
          setSurveyGroups(valid);
        } else {
          console.log("🔍 [Simulasi] Memulai fetch data...");
          const response = await fetchWithAuth("http://localhost:5000/graphql", {
            method: "POST",
            body: JSON.stringify({
              query: `
                query GetSimulatedSurveys {
                  spatialFeatures(layerType: "valid_sampling_point") {
                    meta
                    source
                    createdAt
                    name
                  }
                }
              `,
            }),
          });

          const result = await response.json();
          const features = result?.data?.spatialFeatures || [];

          const grouped = features.reduce((acc: Record<string, SurveyGroup>, item: any) => {
            const meta = item.meta || {};
            const surveyId = meta.survey_id;

            if (!surveyId) return acc;

            // ✅ Perbaiki: parse createdAt sebagai timestamp
            let dateStr = "Tidak Diketahui";
            try {
              const timestamp = parseInt(item.createdAt, 10); // → 1756453930789
              if (!isNaN(timestamp)) {
                const date = new Date(timestamp); // ✅ new Date(1756453930789)
                dateStr = date.toLocaleDateString("id-ID"); // → "28/8/2025"
              }
            } catch (err) {
              console.error("❌ Gagal parse timestamp:", item.createdAt, err);
            }

            if (!acc[surveyId]) {
              acc[surveyId] = {
                surveyId,
                date: dateStr,
                source: item.source,
              };
            }
            return acc;
          }, {});

          const finalGroups = Object.values(grouped);
          console.log("✅ [Simulasi] surveyGroups SIAP:", finalGroups);
          setSurveyGroups(finalGroups);
        }
      } catch (err) {
        console.error("❌ Gagal muat surveyGroups:", err);
        setSurveyGroups([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [activeTab]);

  return { surveyGroups, loading };
}
