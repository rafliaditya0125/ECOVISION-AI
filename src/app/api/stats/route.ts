import { NextResponse } from "next/server";
import { getUserStats } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const stats = await getUserStats(token);

    return NextResponse.json(
      { success: true, stats },
      { status: 200 }
    );
  } catch (error) {
    console.error("Calculate stats error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load dashboard statistics." },
      { status: 500 }
    );
  }
}
