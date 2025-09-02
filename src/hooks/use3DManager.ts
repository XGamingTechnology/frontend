// src/hooks/use3DManager.ts
import { useState } from "react";
import { useData } from "@/context/DataContext";

export function use3DManager() {
  const { setCurrent3DData } = useData();
  const [is3DPanelOpen, setIs3DPanelOpen] = useState(false);
  const [currentSurveyId, setCurrentSurveyId] = useState<string | null>(null);

  const open3DPanel = (surveyId: string) => {
    console.log("🚀 [use3DManager] Buka 3D untuk:", surveyId);
    setCurrentSurveyId(surveyId);
    setIs3DPanelOpen(true);
  };

  const close3DPanel = () => {
    setIs3DPanelOpen(false);
    setCurrentSurveyId(null);
  };

  const generate3DFromData = (allData: Record<string, any[]>) => {
    if (!currentSurveyId) return;

    const points = allData[currentSurveyId] || [];
    if (points.length === 0) {
      console.log("❌ Tidak ada data untuk 3D:", currentSurveyId);
      setCurrent3DData(null);
      return;
    }

    const processedPoints = points
      .map((p) => ({
        x: parseFloat(p.distance),
        y: parseFloat(p.offset),
        z: -Math.abs(parseFloat(p.depth)),
      }))
      .filter((p) => !isNaN(p.x) && !isNaN(p.y) && !isNaN(p.z));

    setCurrent3DData({
      surveyId: currentSurveyId,
      points: processedPoints,
    });
  };

  return {
    is3DPanelOpen,
    currentSurveyId,
    open3DPanel,
    close3DPanel,
    generate3DFromData,
  };
}
