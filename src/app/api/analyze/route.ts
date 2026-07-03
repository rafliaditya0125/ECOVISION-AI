import { NextRequest, NextResponse } from "next/server";
import { AIService } from "@/services/ai/aiService";
import { ProviderManager } from "@/services/ai/providerManager";
import { normalizeLabel } from "@/lib/labelMapper";

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming multipart/form-data
    const formData = await req.formData();

    // Extract the file from the form data using the expected key 'image'
    const image = formData.get("image") as File | null;

    // Validation 1: Ensure a file was provided
    if (!image) {
      return NextResponse.json(
        { success: false, message: "No image file provided." },
        { status: 400 }
      );
    }

    // Validation 2: Ensure the uploaded file is an image
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Invalid image." },
        { status: 400 }
      );
    }

    // Validation 3: Enforce maximum file size of 10MB
    const MAX_SIZE_BYTES = 10 * 1024 * 1024;
    if (image.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, message: "Image size exceeds the maximum limit of 10MB." },
        { status: 400 }
      );
    }

    // Resolve the active AI provider via ProviderManager (Factory Pattern)
    const apiKey = req.headers.get("x-api-key") || undefined;
    const provider = ProviderManager.getProvider(apiKey);
    const aiService = new AIService(provider);

    // Run analysis through the AI Service layer
    const rawResult = await aiService.analyze(image);

    // [DEBUG] Log the raw Gemini output to the server terminal
    console.log("[EcoVision] Gemini detectedLabel:", rawResult.detectedLabel);
    console.log("[EcoVision] Gemini confidence:", rawResult.confidence);

    // Normalize the raw label from the AI model to a local Knowledge Engine ID
    const normalizedId = normalizeLabel(rawResult.detectedLabel);

    // [DEBUG] Log the result of the normalizer
    console.log("[EcoVision] Normalized label:", normalizedId);

    return NextResponse.json(
      {
        success: true,
        id: normalizedId,
        confidence: rawResult.confidence,
        detectedLabel: rawResult.detectedLabel,
        dynamicData: rawResult.dynamicData,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in /api/analyze:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

