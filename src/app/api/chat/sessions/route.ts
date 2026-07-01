import { NextRequest, NextResponse } from "next/server";
import { getChatSessions, getChatMessages } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("id");

    if (sessionId) {
      const messages = await getChatMessages(sessionId);
      return NextResponse.json(
        { success: true, messages },
        { status: 200 }
      );
    } else {
      const sessions = await getChatSessions(token);
      return NextResponse.json(
        { success: true, sessions },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Fetch chat sessions error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load chat history data." },
      { status: 500 }
    );
  }
}
