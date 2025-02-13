import { Connect } from "@/dbConfig/dbConfig";
import LiveRequest from "@/models/liveRequest.model";
import User from "@/models/user.model";
import { getUser } from "@/utils/getUser";
import { NextRequest, NextResponse } from "next/server";

Connect();

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUser(token);
    console.log("user: ", user);
    if (!user || typeof user === "string") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    console.log("User ID extracted:", user._id);
    
    const userInDB = await User.findOne({ _id: user._id });
    console.log("userInDB: ", userInDB);

    
    const newLiveRequest = new LiveRequest({
      custUserId: user._id, // Attach userId from token
      rs: "WAITING_COACH_CONFIRMATION",
    });

    await newLiveRequest.save(); // Save to database

    return NextResponse.json({
      date: new Date().toUTCString(),
      data: newLiveRequest,
    });
  } catch (error) {
    console.error("Error in LiveRequest POST:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
