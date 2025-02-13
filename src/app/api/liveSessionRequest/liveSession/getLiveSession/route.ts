import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/dbConfig";
import LiveSession from "@/models/liveSession.model";

Connect();

export async function GET(request: NextRequest) {
  try {
    // ✅ Extract lsId from query parameters instead of request body
    const { searchParams } = new URL(request.url);
    const lsId = searchParams.get("lsId");

    if (!lsId) {
      return NextResponse.json({ error: "lsId is required" }, { status: 400 });
    }

    const liveSession = await LiveSession.findById(lsId);
    if (!liveSession) {
      return NextResponse.json(
        { error: "Live Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      date: new Date().toUTCString(),
      data: liveSession,
    });
  } catch (error) {
    console.error("Error fetching live Session status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
