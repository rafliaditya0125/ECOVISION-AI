import { NextRequest, NextResponse } from "next/server";
import { AIService } from "@/services/ai/aiService";
import { ProviderManager } from "@/services/ai/providerManager";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    // Validation: Ensure messages array is present
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid 'messages' field in request body." },
        { status: 400 }
      );
    }

    // Validate structure of individual messages
    for (const msg of messages) {
      if (!msg.role || typeof msg.content !== "string") {
        return NextResponse.json(
          { success: false, message: "Invalid message structure. Each message must have 'role' and 'content' fields." },
          { status: 400 }
        );
      }
    }

    // Resolve the active AI provider (Gemini or Mock)
    const provider = ProviderManager.getProvider();
    const aiService = new AIService(provider);

    // Call chat service
    const responseText = await aiService.chat(messages);

    return NextResponse.json({
      success: true,
      response: responseText,
    });
  } catch (error) {
    console.error("[EcoVision API] Chat error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate chat response." },
      { status: 500 }
    );
  }
}
