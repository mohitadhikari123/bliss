import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/dbConfig";
import LiveSession from "@/models/liveSession.model";
import { getUser } from "@/utils/getUser";
import User from "@/models/user.model";

Connect();

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const user = await getUser(token);
    if (!user || typeof user === "string") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { lsId } = await request.json();

    if (!lsId) {
      return NextResponse.json(
        { error: "Missing required lsId fields" },
        { status: 400 }
      );
    }

    const liveSession = await LiveSession.findById(lsId);
    liveSession.rs = "FINISHED";

    await liveSession.save();

    return NextResponse.json({
      date: new Date().toUTCString(),
      data: liveSession,
    });
  } catch (error) {
    console.error("Error in creating Live Session:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
