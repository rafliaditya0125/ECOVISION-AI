import { NextRequest, NextResponse } from "next/server";
import { AIService } from "@/services/ai/aiService";
import { ProviderManager } from "@/services/ai/providerManager";
import { saveChatMessage } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, sessionId } = body;

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
    const apiKey = req.headers.get("x-api-key") || undefined;
    const provider = ProviderManager.getProvider(apiKey);
    const aiService = new AIService(provider);

    // Call chat service
    const responseText = await aiService.chat(messages);

    // Persistence: Only save to DB in MySQL mode. In localStorage mode, the client handles persistence.
    const isLocalMode = process.env.NEXT_PUBLIC_DB_STORAGE?.toLowerCase() === "localstorage";
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    let finalSessionId = sessionId;

    if (!isLocalMode && token) {
      const lastUserMsg = messages[messages.length - 1];
      if (lastUserMsg && lastUserMsg.role === "user") {
        try {
          // Save the user's message
          const saveResult = await saveChatMessage(
            sessionId,
            token,
            "user",
            lastUserMsg.content,
            lastUserMsg.image
          );
          finalSessionId = saveResult.sessionId;

          // Save the assistant's response
          await saveChatMessage(
            finalSessionId,
            token,
            "assistant",
            responseText
          );
        } catch (dbError) {
          console.error("Failed to save chat message history:", dbError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      response: responseText,
      sessionId: finalSessionId,
    });
  } catch (error) {
    console.error("[EcoVision API] Chat error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate chat response." },
      { status: 500 }
    );
  }
}
