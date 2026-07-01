import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing email or password." },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user || user.passwordHash !== password) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Set cookie session
    const cookieStore = await cookies();
    cookieStore.set("session_token", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    const { passwordHash: _, ...safeUser } = user;

    return NextResponse.json(
      { success: true, user: safeUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed." },
      { status: 500 }
    );
  }
}
