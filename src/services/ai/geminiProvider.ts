import { GoogleGenAI } from "@google/genai";
import { AIProvider } from "./provider";
import { AIResult } from "@/types/ai";

/**
 * All labels the AI is allowed to return.
 * Must stay in sync with wasteKnowledgeDB IDs in src/data/wasteKnowledge.ts.
 */
const VALID_LABELS = [
  "plastic-pet",
  "plastic-hdpe",
  "paper",
  "cardboard",
  "glass",
  "metal-can",
  "organic",
  "battery",
  "electronic",
] as const;

type ValidLabel = (typeof VALID_LABELS)[number];

/** The exact shape Gemini must return in its JSON response. */
interface GeminiRawResponse {
  detectedLabel: string;
  confidence: number;
}

/** Structured prompt that forces Gemini to respond with valid JSON only. */
const CLASSIFICATION_PROMPT = `You are an image classification model.
Identify the main waste object in the image.
Return ONLY valid JSON. No markdown, no explanation, no code fences.

Example response:
{"detectedLabel":"plastic-pet","confidence":96}

Choose detectedLabel from ONLY these values:
plastic-pet, plastic-hdpe, paper, cardboard, glass, metal-can, organic, battery, electronic

If unsure, return the closest matching label.`;

/**
 * Converts a browser File object into a base64-encoded string.
 * Required by the Gemini SDK's inlineData format.
 */
async function fileToBase64(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return buffer.toString("base64");
}

/**
 * Validates that a raw label string is one of the accepted waste labels.
 */
function isValidLabel(label: string): label is ValidLabel {
  return VALID_LABELS.includes(label as ValidLabel);
}

/**
 * Clamps a numeric confidence value to the range [0, 100].
 */
function clampConfidence(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

/**
 * Real implementation of AIProvider using Google Gemini 2.5 Flash vision.
 * API key is read exclusively from server-side environment variables —
 * never exposed to the client.
 */
export class GeminiProvider implements AIProvider {
  private client: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "GeminiProvider: GEMINI_API_KEY environment variable is not set."
      );
    }

    // Initialize the official Google GenAI client (server-side only)
    this.client = new GoogleGenAI({ apiKey });
  }

  /**
   * Analyzes an image using Gemini 2.5 Flash and returns a normalized AIResult.
   *
   * @param image - The image File to classify.
   * @returns A validated AIResult with a known detectedLabel and clamped confidence.
   * @throws A descriptive Error if the API call or response parsing fails.
   */
  public async analyze(image: File): Promise<AIResult> {
    // Step 1: Convert the File to a base64 string for inlineData
    const base64Data = await fileToBase64(image);

    // Step 2: Build the multimodal request content
    const contents = [
      {
        inlineData: {
          data: base64Data,
          mimeType: image.type as string,
        },
      },
      { text: CLASSIFICATION_PROMPT },
    ];

    // Step 3: Send to Gemini 2.5 Flash
    let rawText: string;
    try {
      const response = await this.client.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
      });

      rawText = response.text ?? "";
    } catch (err) {
      throw new Error(
        `GeminiProvider: API call failed — ${err instanceof Error ? err.message : String(err)}`
      );
    }

    // Step 4: Strip any accidental markdown fences Gemini might still produce
    const cleaned = rawText
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();

    // Step 5: Parse JSON safely
    let parsed: GeminiRawResponse;
    try {
      parsed = JSON.parse(cleaned) as GeminiRawResponse;
    } catch {
      throw new Error(
        `GeminiProvider: Failed to parse Gemini response as JSON. Raw output: "${cleaned}"`
      );
    }

    // Step 6: Validate the detectedLabel field
    const label = typeof parsed.detectedLabel === "string"
      ? parsed.detectedLabel.trim().toLowerCase()
      : "";

    if (!isValidLabel(label)) {
      throw new Error(
        `GeminiProvider: Gemini returned an unrecognized label "${label}". ` +
        `Expected one of: ${VALID_LABELS.join(", ")}`
      );
    }

    // Step 7: Validate and clamp confidence
    const rawConfidence = typeof parsed.confidence === "number"
      ? parsed.confidence
      : parseFloat(String(parsed.confidence));

    if (isNaN(rawConfidence)) {
      throw new Error(
        `GeminiProvider: Gemini returned an invalid confidence value: "${parsed.confidence}"`
      );
    }

    const confidence = clampConfidence(rawConfidence);

    // Step 8: Return the normalized AIResult
    return {
      id: label,
      detectedLabel: label,
      confidence,
    };
  }
}

