import { wasteKnowledgeDB } from "@/data/wasteKnowledge";
import { WasteKnowledge } from "@/types/waste";

/**
 * Retrieves detailed educational and recycling knowledge about a specific waste item.
 * 
 * @param id - The unique identifier of the waste item (e.g., "plastic-pet")
 * @param lang - The current user display language ('en' or 'id')
 * @returns The localized WasteKnowledge object if found, otherwise null.
 */
export function getWasteKnowledge(id: string, lang: "en" | "id" = "en"): WasteKnowledge | null {
  // Finds the specific item by ID in the local knowledge database
  const item = wasteKnowledgeDB.find((waste) => waste.id === id);
  if (!item) return null;

  // Map to localized fields based on selected language
  return {
    id: item.id,
    name: lang === "id" ? item.nameId : item.nameEn,
    category: lang === "id" ? item.categoryId : item.categoryEn,
    description: lang === "id" ? item.descriptionId : item.descriptionEn,
    recyclable: item.recyclable,
    recyclingBin: lang === "id" ? item.recyclingBinId : item.recyclingBinEn,
    estimatedDecomposition: lang === "id" ? item.estimatedDecompositionId : item.estimatedDecompositionEn,
    environmentalImpact: lang === "id" ? item.environmentalImpactId : item.environmentalImpactEn,
    recommendations: lang === "id" ? item.recommendationsId : item.recommendationsEn,
    difficulty: lang === "id" ? item.difficultyId : item.difficultyEn,
    confidenceNote: lang === "id" ? item.confidenceNoteId : item.confidenceNoteEn,
  };
}

