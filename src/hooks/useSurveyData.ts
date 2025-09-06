// src/hooks/useSurveyData.ts
import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/apiClient";

export interface SurveyGroup {
  surveyId: string;
  date: string;
  source: "import" | "simulated" | "processed"; // ✅ Bedakan sumber data
}

export function useSurveyData(activeTab: "field" | "simulated") {
  const [surveyGroups, setSurveyGroups] = useState<SurveyGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (activeTab === "field") {
          // 🔹 Data lapangan: hasil upload CSV
          console.log("🔍 [Field] Memuat data dari localStorage...");
          const saved = localStorage.getItem("fieldSurveys");
          const parsed: SurveyGroup[] = saved ? JSON.parse(saved) : [];
          const valid = parsed.filter((s) => s.source === "import");

          console.log("✅ [Field] Data upload siap:", valid);
          setSurveyGroups(valid);
        } else {
          // 🔹 Data simulasi: hasil dari process_survey / generate_survey
          console.log("🔍 [Simulasi] Memulai fetch data dari DB...");
          const response = await fetchWithAuth("http://localhost:5000/graphql", {
            method: "POST",
            body: JSON.stringify({
              query: `
                query GetSimulatedSurveys {
                  spatialFeatures(layerType: "valid_sampling_point") {
                    meta
                    source
                    createdAt
                  }
                }
              `,
            }),
          });

          const result = await response.json();
          if (result.errors) {
            console.error("❌ GraphQL Error:", result.errors);
            setSurveyGroups([]);
            setLoading(false);
            return;
          }

          const features = result?.data?.spatialFeatures || [];

          const grouped = features.reduce((acc: Record<string, SurveyGroup>, item: any) => {
            const meta = item.meta || {};
            const surveyId = meta.survey_id;

            if (!surveyId) return acc;

            let dateStr = "Tidak Diketahui";
            try {
              const date = new Date(item.createdAt);
              if (!isNaN(date.getTime())) {
                dateStr = date.toLocaleDateString("id-ID");
              }
            } catch (err) {
              console.error("❌ Gagal parse createdAt:", item.createdAt);
            }

            if (!acc[surveyId]) {
              acc[surveyId] = {
                surveyId,
                date: dateStr,
                source: "simulated", // ✅ Ini adalah data hasil proses
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
