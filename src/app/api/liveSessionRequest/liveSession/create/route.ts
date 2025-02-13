import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/dbConfig";
import LiveSession from "@/models/liveSession.model";
import { getUser } from "@/utils/getUser";
import User from "@/models/user.model";

Connect();

export async function POST(request: NextRequest) {
  try {
    
    // Extract token from Authorization header
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];

    // Decode user from token
    const user = await getUser(token);

    if (!user || typeof user === "string") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Parse request body
    const { lsId } = await request.json();

    if (!lsId) {
      return NextResponse.json(
        { error: "Missing required lsId fields" },
        { status: 400 }
      );
    }

    // Find the first available coach
    const coachUser = await User.findOne({ role: "COACH" }).select("_id");
    console.log("Found Coach:", coachUser);

    if (!coachUser) {
      return NextResponse.json(
        { error: "No coach available" },
        { status: 404 }
      );
    }

    const newSession = new LiveSession({
      _id: lsId,
      lsId,
      createdBy: user._id,
      coachUserId: coachUser._id,
      startTime: Math.floor(Date.now() / 1000),
      endTime: null,
      rs: "IN_PROGRESS",
      participants: [
        {
          userId: user._id,
          role: "CUSTOMER",
          jTime: new Date(),
          rs: "JOINED",
        },
        {
          userId: coachUser._id,
          role: "COACH",
          jTime: new Date(),
          rs: "BOOKED",
        },
      ],
    });

    await newSession.save();

    return NextResponse.json({
      date: new Date().toUTCString(),
      data: newSession,
    });
  } catch (error) {
    console.error("Error in creating Live Session:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
