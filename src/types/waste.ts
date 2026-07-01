/**
 * Represents the general category of waste.
 */
export type WasteCategory =
  | 'Plastic'
  | 'Paper'
  | 'Glass'
  | 'Metal'
  | 'Organic'
  | 'Hazardous'
  | 'E-Waste';

/**
 * Represents the difficulty level of recycling the item.
 */
export type RecyclingDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Specialized';

/**
 * Interface representing a specific waste item in the Knowledge Engine.
 */
export interface WasteKnowledge {
  id: string;
  name: string;
  category: string; // Dynamic localized string
  description: string;
  recyclable: boolean;
  recyclingBin: string; // Dynamic localized string
  estimatedDecomposition: string; // Dynamic localized string
  environmentalImpact: string;
  recommendations: string[];
  difficulty: string; // Dynamic localized string
  confidenceNote: string;
}

/**
 * Interface representing a waste item stored with both EN and ID translations.
 */
export interface BilingualWasteKnowledge {
  id: string;
  nameEn: string;
  nameId: string;
  categoryEn: string;
  categoryId: string;
  descriptionEn: string;
  descriptionId: string;
  recyclable: boolean;
  recyclingBinEn: string;
  recyclingBinId: string;
  estimatedDecompositionEn: string;
  estimatedDecompositionId: string;
  environmentalImpactEn: string;
  environmentalImpactId: string;
  recommendationsEn: string[];
  recommendationsId: string[];
  difficultyEn: string;
  difficultyId: string;
  confidenceNoteEn: string;
  confidenceNoteId: string;
}

