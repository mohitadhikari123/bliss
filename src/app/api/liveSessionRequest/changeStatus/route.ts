import { Connect } from "@/dbConfig/dbConfig";
import LiveRequest from "@/models/liveRequest.model";
import User from "@/models/user.model";
import { getUser } from "@/utils/getUser";
import { NextRequest, NextResponse } from "next/server";

Connect();

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lsId = searchParams.get("lsId");

    if (!lsId) {
      return NextResponse.json({ error: "lsId is required" }, { status: 400 });
    }

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

    const userInDB = await User.findById(user._id).select("-password");
    console.log("userInDB: ", userInDB.role);

    // if (userInDB.role !== "COACH") {
    //   return NextResponse.json(
    //     { error: "Only Coach can accept the Call" },
    //     { status: 401 }
    //   );
    // }
    const liveRequest = await LiveRequest.findById(lsId);
    if (!liveRequest) {
      return NextResponse.json(
        { error: "Live request not found" },
        { status: 404 }
      );
    }
    liveRequest.rs = "ACCEPTED";
    await liveRequest.save();


    return NextResponse.json({
      date: new Date().toUTCString(),
      data: liveRequest,
    });
  } catch (error) {
    console.error("Error in LiveRequest POST:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
