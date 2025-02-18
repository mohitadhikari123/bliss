import { Connect } from "@/dbConfig/dbConfig";
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

    const userInDB = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!userInDB) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log("upcomingSessions before removal: ", userInDB.upcomingSessions);

    // Extract reminderTime from URL searchParams
    const { searchParams } = new URL(request.url);
    const reminderTime = searchParams.get("reminderTime");
    if (!reminderTime) {
      return NextResponse.json(
        { error: "reminderTime is required" },
        { status: 400 }
      );
    }

    // Convert reminderTime to Date object
    const sessionDate = new Date(reminderTime);
    if (isNaN(sessionDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format. Expected format is YYYY-MM-DDTHH:mm" },
        { status: 400 }
      );
    }

    // Remove the session matching the provided date from the upcomingSessions array
    userInDB.upcomingSessions = userInDB.upcomingSessions.filter(
      (session :Date) => new Date(session).toISOString() !== sessionDate.toISOString()
    );
    await userInDB.save();

    console.log("upcomingSessions after removal: ", userInDB.upcomingSessions);

    return NextResponse.json({
      date: new Date().toUTCString(),
      data: userInDB,
    });
  } catch (error: any) {
    console.error("Error in LiveRequest POST:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
