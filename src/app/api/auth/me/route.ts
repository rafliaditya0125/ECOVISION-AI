import { NextResponse } from "next/server";
import { findUserById } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: true, user: null },
        { status: 200 }
      );
    }

    const user = await findUserById(token);
    if (!user) {
      // Token is stale or invalid, clear it
      cookieStore.delete("session_token");
      return NextResponse.json(
        { success: true, user: null },
        { status: 200 }
      );
    }

    const { passwordHash: _, ...safeUser } = user;

    return NextResponse.json(
      { success: true, user: safeUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.json(
      { success: false, message: "Session check failed." },
      { status: 500 }
    );
  }
}
