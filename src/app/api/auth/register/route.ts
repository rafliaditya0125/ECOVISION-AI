import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, saveUser } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Email is already registered." },
        { status: 400 }
      );
    }

    // Save the user
    const user = await saveUser({
      name,
      email,
      passwordHash: password, // plaintext password stored directly for mock/prototype purposes
    });

    // Create session cookie
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
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed." },
      { status: 500 }
    );
  }
}
