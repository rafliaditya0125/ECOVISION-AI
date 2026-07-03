/**
 * Pass 1 — Exact dictionary mapping.
 * Keys are fully normalized (lowercase, hyphens). Values are Knowledge Engine IDs.
 * Covers the most predictable Gemini outputs.
 */
const EXACT_MAPPINGS: Record<string, string> = {
  // --- Plastic PET ---
  "plastic-pet": "plastic-pet",
  "pet": "plastic-pet",
  "pet-bottle": "plastic-pet",
  "pet-plastic": "plastic-pet",
  "plastic-bottle": "plastic-pet",
  "plastic-container": "plastic-pet",
  "water-bottle": "plastic-pet",
  "beverage-bottle": "plastic-pet",
  "soda-bottle": "plastic-pet",
  "soft-drink-bottle": "plastic-pet",

  // --- Plastic HDPE ---
  "plastic-hdpe": "plastic-hdpe",
  "hdpe": "plastic-hdpe",
  "hdpe-bottle": "plastic-hdpe",
  "hdpe-plastic": "plastic-hdpe",
  "detergent-bottle": "plastic-hdpe",
  "shampoo-bottle": "plastic-hdpe",
  "milk-jug": "plastic-hdpe",
  "cleaning-bottle": "plastic-hdpe",

  // --- Paper ---
  "paper": "paper",
  "newspaper": "paper",
  "office-paper": "paper",
  "printing-paper": "paper",
  "magazine": "paper",
  "notebook": "paper",
  "book": "paper",

  // --- Cardboard ---
  "cardboard": "cardboard",
  "cardboard-box": "cardboard",
  "corrugated-cardboard": "cardboard",
  "shipping-box": "cardboard",
  "carton": "cardboard",
  "pizza-box": "cardboard",
  "packaging-box": "cardboard",
  "box": "cardboard",

  // --- Glass ---
  "glass": "glass",
  "glass-bottle": "glass",
  "glass-jar": "glass",
  "jar": "glass",
  "wine-bottle": "glass",
  "beer-bottle": "glass",

  // --- Metal ---
  "metal-can": "metal-can",
  "aluminum-can": "metal-can",
  "aluminium-can": "metal-can",
  "tin-can": "metal-can",
  "steel-can": "metal-can",
  "soda-can": "metal-can",
  "beverage-can": "metal-can",
  "food-can": "metal-can",
  "can": "metal-can",

  // --- Organic ---
  "organic": "organic-waste",
  "organic-waste": "organic-waste",
  "food-waste": "organic-waste",
  "food-scrap": "organic-waste",
  "banana-peel": "organic-waste",
  "fruit-peel": "organic-waste",
  "vegetable-waste": "organic-waste",
  "kitchen-waste": "organic-waste",
  "compost": "organic-waste",
  "biodegradable-waste": "organic-waste",
  "leftover-food": "organic-waste",

  // --- Battery ---
  "battery": "battery",
  "aa-battery": "battery",
  "aaa-battery": "battery",
  "lithium-battery": "battery",
  "alkaline-battery": "battery",
  "rechargeable-battery": "battery",
  "cell-battery": "battery",

  // --- E-Waste ---
  "electronic-waste": "electronic-waste",
  "e-waste": "electronic-waste",
  "electronics": "electronic-waste",
  "electronic-device": "electronic-waste",
  "mobile-phone": "electronic-waste",
  "smartphone": "electronic-waste",
  "laptop": "electronic-waste",
  "computer": "electronic-waste",
  "cable": "electronic-waste",
  "charger": "electronic-waste",
  "circuit-board": "electronic-waste",

  // --- B3 Waste ---
  "b3": "b3-waste",
  "b3-waste": "b3-waste",
  "limbah-b3": "b3-waste",
  "chemical-container": "b3-waste",
  "pesticide": "b3-waste",
  "aerosol": "b3-waste",

  // --- Medical Waste ---
  "medical": "medical-waste",
  "medical-waste": "medical-waste",
  "sampah-medis": "medical-waste",
  "syringe": "medical-waste",
  "mask": "medical-waste",
  "face-mask": "medical-waste",
  "bandage": "medical-waste",

  // --- Non-Can Metal ---
  "metal-non-can": "metal-non-can",
  "logam-non-kaleng": "metal-non-can",
  "fork": "metal-non-can",
  "spoon": "metal-non-can",
  "knife": "metal-non-can",
  "wire": "metal-non-can",
  "pot": "metal-non-can",
  "pan": "metal-non-can",
  "nail": "metal-non-can",
};

/**
 * Pass 2 — Keyword-based fuzzy rules.
 * Each entry is a { keywords, result } pair.
 * The normalized label is checked for substring presence of ALL keywords in a set.
 * Rules are evaluated in order — first match wins.
 */
const KEYWORD_RULES: Array<{ keywords: string[]; result: string }> = [
  // E-Waste (check before generic "electronic" hits plastic-hdpe etc.)
  { keywords: ["electronic", "waste"], result: "electronic-waste" },
  { keywords: ["e-waste"], result: "electronic-waste" },
  { keywords: ["smartphone"], result: "electronic-waste" },
  { keywords: ["laptop"], result: "electronic-waste" },
  { keywords: ["circuit"], result: "electronic-waste" },
  { keywords: ["charger"], result: "electronic-waste" },
  { keywords: ["cable"], result: "electronic-waste" },

  // Battery
  { keywords: ["battery"], result: "battery" },
  { keywords: ["batteries"], result: "battery" },

  // Organic
  { keywords: ["food", "waste"], result: "organic-waste" },
  { keywords: ["organic"], result: "organic-waste" },
  { keywords: ["banana"], result: "organic-waste" },
  { keywords: ["fruit"], result: "organic-waste" },
  { keywords: ["vegetable"], result: "organic-waste" },
  { keywords: ["compost"], result: "organic-waste" },
  { keywords: ["peel"], result: "organic-waste" },

  // Metal
  { keywords: ["metal", "can"], result: "metal-can" },
  { keywords: ["aluminum", "can"], result: "metal-can" },
  { keywords: ["aluminium", "can"], result: "metal-can" },
  { keywords: ["tin", "can"], result: "metal-can" },
  { keywords: ["soda", "can"], result: "metal-can" },
  { keywords: ["beverage", "can"], result: "metal-can" },
  { keywords: ["metal", "non", "can"], result: "metal-non-can" },
  { keywords: ["logam", "non", "kaleng"], result: "metal-non-can" },
  { keywords: ["wire"], result: "metal-non-can" },
  { keywords: ["spoon"], result: "metal-non-can" },
  { keywords: ["fork"], result: "metal-non-can" },
  { keywords: ["knife"], result: "metal-non-can" },
  { keywords: ["nail"], result: "metal-non-can" },

  // B3 Waste
  { keywords: ["b3"], result: "b3-waste" },
  { keywords: ["limbah", "b3"], result: "b3-waste" },
  { keywords: ["chemical"], result: "b3-waste" },
  { keywords: ["pesticide"], result: "b3-waste" },
  { keywords: ["aerosol"], result: "b3-waste" },

  // Medical Waste
  { keywords: ["medical"], result: "medical-waste" },
  { keywords: ["medis"], result: "medical-waste" },
  { keywords: ["syringe"], result: "medical-waste" },
  { keywords: ["mask"], result: "medical-waste" },
  { keywords: ["bandage"], result: "medical-waste" },

  // Glass
  { keywords: ["glass"], result: "glass" },
  { keywords: ["jar"], result: "glass" },

  // Cardboard
  { keywords: ["cardboard"], result: "cardboard" },
  { keywords: ["shipping", "box"], result: "cardboard" },
  { keywords: ["corrugated"], result: "cardboard" },

  // Paper
  { keywords: ["paper"], result: "paper" },
  { keywords: ["newspaper"], result: "paper" },
  { keywords: ["magazine"], result: "paper" },

  // HDPE plastic (check before generic "plastic" rule)
  { keywords: ["hdpe"], result: "plastic-hdpe" },
  { keywords: ["detergent", "bottle"], result: "plastic-hdpe" },
  { keywords: ["shampoo"], result: "plastic-hdpe" },
  { keywords: ["cleaning", "bottle"], result: "plastic-hdpe" },
  { keywords: ["milk", "jug"], result: "plastic-hdpe" },

  // PET plastic (broad — runs after HDPE check)
  { keywords: ["pet", "bottle"], result: "plastic-pet" },
  { keywords: ["plastic", "bottle"], result: "plastic-pet" },
  { keywords: ["plastic", "pet"], result: "plastic-pet" },
  { keywords: ["water", "bottle"], result: "plastic-pet" },
  { keywords: ["beverage", "bottle"], result: "plastic-pet" },
  { keywords: ["plastic", "container"], result: "plastic-pet" },
  { keywords: ["pet"], result: "plastic-pet" },
  { keywords: ["plastic"], result: "plastic-pet" },
];

/**
 * Normalizes a raw AI label into a clean, hyphen-separated, lowercase string.
 */
function normalize(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")   // collapse multiple spaces
    .replace(/_/g, "-")     // underscores → hyphens
    .replace(/\s/g, "-");   // spaces → hyphens
}

/**
 * Maps a raw AI-generated label to a local Knowledge Engine ID.
 *
 * Strategy:
 *   1. Normalize the raw string.
 *   2. Try exact dictionary lookup (fastest, most precise).
 *   3. Fall back to keyword-based fuzzy matching.
 *   4. Return "unknown" if nothing matches.
 *
 * @param label - Raw label from the AI model (e.g. "PET bottle", "plastic-pet").
 * @returns A Knowledge Engine ID string, or "unknown".
 */
export function normalizeLabel(label: string): string {
  if (!label || typeof label !== "string") return "unknown";

  const normalized = normalize(label);

  // --- Pass 1: Exact lookup ---
  const exactMatch = EXACT_MAPPINGS[normalized];
  if (exactMatch) return exactMatch;

  // --- Pass 2: Keyword fuzzy matching ---
  for (const rule of KEYWORD_RULES) {
    const allKeywordsPresent = rule.keywords.every((kw) =>
      normalized.includes(kw)
    );
    if (allKeywordsPresent) return rule.result;
  }

  return "unknown";
}

