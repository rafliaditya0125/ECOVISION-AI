import { WasteKnowledge } from "@/types/waste";

/**
 * The local knowledge base of waste items.
 * Contains detailed educational and recycling information for various materials.
 */
export const wasteKnowledgeDB: WasteKnowledge[] = [
  {
    id: "plastic-pet",
    name: "Plastic PET (Type 1)",
    category: "Plastic",
    description: "Polyethylene terephthalate (PET) is highly recyclable and commonly used for water bottles, soft drinks, and food packaging.",
    recyclable: true,
    recyclingBin: "Yellow Bin / Plastics",
    estimatedDecomposition: "450 years",
    environmentalImpact: "If not recycled, PET plastics break down into microplastics that pollute oceans and enter the food chain.",
    recommendations: [
      "Empty all liquids.",
      "Crush the bottle to save space.",
      "Leave the cap on, as modern recycling facilities can process them."
    ],
    difficulty: "Easy",
    confidenceNote: "Easily identifiable due to clarity and common shapes (e.g., water bottles)."
  },
  {
    id: "plastic-hdpe",
    name: "HDPE (Type 2)",
    category: "Plastic",
    description: "High-density polyethylene is a durable plastic used for milk jugs, shampoo bottles, and cleaning product containers.",
    recyclable: true,
    recyclingBin: "Yellow Bin / Plastics",
    estimatedDecomposition: "100+ years",
    environmentalImpact: "HDPE is highly sought after by recyclers and saves significant energy compared to producing new plastic.",
    recommendations: [
      "Rinse out any residual liquids.",
      "Labels can usually be left on."
    ],
    difficulty: "Easy",
    confidenceNote: "Usually opaque or solid-colored thick plastics."
  },
  {
    id: "paper",
    name: "Paper",
    category: "Paper",
    description: "Standard paper includes office paper, newspapers, and magazines. It is highly recyclable.",
    recyclable: true,
    recyclingBin: "Blue Bin / Paper",
    estimatedDecomposition: "2-6 weeks",
    environmentalImpact: "Recycling 1 ton of paper saves 17 trees, 7,000 gallons of water, and 4,000 kilowatts of energy.",
    recommendations: [
      "Keep it dry and clean.",
      "Remove staples if possible, though large facilities can handle them.",
      "Do not recycle paper stained with food or grease."
    ],
    difficulty: "Easy",
    confidenceNote: "AI might confuse heavily crumpled paper with organic waste. Verify if it's clean paper."
  },
  {
    id: "cardboard",
    name: "Cardboard",
    category: "Paper",
    description: "Corrugated cardboard used for shipping boxes and packaging.",
    recyclable: true,
    recyclingBin: "Blue Bin / Paper",
    estimatedDecomposition: "2 months",
    environmentalImpact: "Reduces deforestation and saves significant water in the manufacturing process.",
    recommendations: [
      "Flatten the boxes to save space in the bin.",
      "Remove plastic tape or labels if possible.",
      "Greasy pizza boxes belong in the compost or regular trash, not recycling."
    ],
    difficulty: "Easy",
    confidenceNote: "Easily identified. Watch out for food contamination."
  },
  {
    id: "glass",
    name: "Glass",
    category: "Glass",
    description: "Glass bottles and jars can be recycled endlessly without loss in quality or purity.",
    recyclable: true,
    recyclingBin: "Green Bin / Glass",
    estimatedDecomposition: "1 million years",
    environmentalImpact: "Recycling glass reduces related air pollution by 20% and water pollution by 50%.",
    recommendations: [
      "Rinse lightly.",
      "Remove metal or plastic caps and recycle them separately.",
      "Broken glass (like windows or mirrors) often cannot be recycled with standard container glass."
    ],
    difficulty: "Medium",
    confidenceNote: "Transparent materials can sometimes challenge AI models due to reflections."
  },
  {
    id: "metal-can",
    name: "Metal Can",
    category: "Metal",
    description: "Aluminum and steel/tin cans are among the most valuable and easy-to-recycle materials.",
    recyclable: true,
    recyclingBin: "Yellow Bin / Metals",
    estimatedDecomposition: "50-200 years",
    environmentalImpact: "Recycling one aluminum can saves enough energy to run a TV for 3 hours. It uses 95% less energy than producing new aluminum.",
    recommendations: [
      "Empty and rinse.",
      "Crushing is optional but helps save space.",
      "Leave the pop tab attached."
    ],
    difficulty: "Easy",
    confidenceNote: "High confidence. Metal reflections are distinct."
  },
  {
    id: "organic-waste",
    name: "Organic Waste",
    category: "Organic",
    description: "Food scraps, yard waste, and other biodegradable materials.",
    recyclable: false, // In traditional terms; usually compostable
    recyclingBin: "Brown Bin / Compost",
    estimatedDecomposition: "2 weeks - 6 months",
    environmentalImpact: "Organic waste in landfills produces methane, a potent greenhouse gas. Composting turns it into nutrient-rich soil.",
    recommendations: [
      "Use for home composting or place in municipal organics bin.",
      "Do not include plastic bags or non-biodegradable stickers."
    ],
    difficulty: "Medium",
    confidenceNote: "Vast variety of shapes and colors. Verification is important."
  },
  {
    id: "battery",
    name: "Battery",
    category: "Hazardous",
    description: "Alkaline, lithium-ion, and other types of batteries contain toxic heavy metals.",
    recyclable: true,
    recyclingBin: "Specialized E-Waste / Battery Drop-off",
    estimatedDecomposition: "100+ years",
    environmentalImpact: "If landfilled, heavy metals like lead and cadmium can leach into soil and groundwater.",
    recommendations: [
      "Do NOT put in standard recycling or trash bins.",
      "Tape the ends of lithium batteries to prevent fires.",
      "Take to designated collection points or retail stores."
    ],
    difficulty: "Specialized",
    confidenceNote: "Small objects. May require close-up scan for correct identification."
  },
  {
    id: "electronic-waste",
    name: "Electronic Waste",
    category: "E-Waste",
    description: "Phones, computers, cables, and appliances containing valuable metals but also hazardous materials.",
    recyclable: true,
    recyclingBin: "Specialized E-Waste Drop-off",
    estimatedDecomposition: "1-2 million years",
    environmentalImpact: "E-waste contains precious metals like gold and silver, but also toxic substances like lead and mercury.",
    recommendations: [
      "Do NOT put in standard recycling or trash bins.",
      "Wipe personal data before recycling.",
      "Use certified e-waste recyclers to ensure safe handling."
    ],
    difficulty: "Specialized",
    confidenceNote: "Complex structures. AI usually detects the general object type (e.g., 'phone' or 'cable')."
  }
];
