import { NextRequest, NextResponse } from "next/server";
import { getUserHistory, saveScan } from "@/lib/db";
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

    const history = await getUserHistory(token);

    return NextResponse.json(
      { success: true, history },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch history error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load scan history." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { wasteId, name, category, confidence, recyclable, imageUrl } = await req.json();

    if (!wasteId || !name || !category || confidence === undefined || recyclable === undefined) {
      return NextResponse.json(
        { success: false, message: "Missing fields in request body." },
        { status: 400 }
      );
    }

    const scanItem = await saveScan(token, {
      wasteId,
      name,
      category,
      confidence,
      recyclable,
      imageUrl,
    });

    return NextResponse.json(
      { success: true, scanItem },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save scan history error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to record scan event." },
      { status: 500 }
    );
  }
}

