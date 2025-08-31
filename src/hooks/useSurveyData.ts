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
          console.log("📁 [Lapangan] Survey dari localStorage:", valid);
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

          console.log("📥 [Simulasi] Response diterima:", response);
          const result = await response.json();
          console.log("📄 [Simulasi] Result JSON:", result);

          const features = result?.data?.spatialFeatures || [];
          console.log("📦 [Simulasi] Jumlah features:", features.length);

          if (features.length === 0) {
            console.warn("⚠️ [Simulasi] Tidak ada data valid_sampling_point");
            setSurveyGroups([]);
            setLoading(false);
            return;
          }

          // 🔍 Debug: cek beberapa item pertama
          console.log("🔍 [Simulasi] Contoh 3 item pertama:", features.slice(0, 3));

          const grouped = features.reduce((acc: Record<string, SurveyGroup>, item: any, index: number) => {
            console.log(`🔍 [Item ${index}] Diproses:`, {
              source: item.source,
              meta: item.meta,
              createdAt: item.createdAt,
            });

            // ✅ Pastikan meta ada
            const meta = item.meta || {};
            const surveyId = meta.survey_id || meta.surveyId;

            console.log(`🆔 surveyId dari meta:`, surveyId);

            // ❌ Skip jika tidak ada surveyId atau dari import
            if (!surveyId) {
              console.log("🚫 Dilewati: survey_id tidak ditemukan di meta");
              return acc;
            }

            if (item.source === "import") {
              console.log("🚫 Dilewati: source = import");
              return acc;
            }

            // ✅ Kelompokkan per surveyId
            if (!acc[surveyId]) {
              acc[surveyId] = {
                surveyId,
                date: new Date(item.createdAt).toLocaleDateString(),
                source: item.source,
              };
              console.log(`✅ [Group] Tambahkan survey:`, acc[surveyId]);
            } else {
              console.log(`🔁 [Group] Sudah ada:`, surveyId);
            }

            return acc;
          }, {});

          const finalGroups = Object.values(grouped);
          console.log("✅ [Simulasi] FINAL surveyGroups:", finalGroups);

          if (finalGroups.length === 0) {
            console.warn("⚠️ [Simulasi] Tidak ada survey yang dikelompokkan. Cek: apakah meta.survey_id ada?");
          }

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
