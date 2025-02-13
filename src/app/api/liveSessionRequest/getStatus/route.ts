import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/dbConfig";
import LiveRequest from "@/models/liveRequest.model";

Connect();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lsId = searchParams.get("lsId");

    if (!lsId) {
      return NextResponse.json({ error: "lsId is required" }, { status: 400 });
    }

    const liveRequest = await LiveRequest.findById(lsId);
    if (!liveRequest) {
      return NextResponse.json(
        { error: "Live request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      date: new Date().toUTCString(),
      data: liveRequest,
    });
  } catch (error) {
    console.error("Error fetching live request status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
