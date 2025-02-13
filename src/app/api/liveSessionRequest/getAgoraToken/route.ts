import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/dbConfig";
import generateAgoraToken from "@/components/agoraDashboard/agoraToken";
import { getUser } from "@/utils/getUser";

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
    // Extract `lsId` from query parameters
    const { lsId } = await request.json();

    if (!lsId) {
      return NextResponse.json({ error: "lsId is required" }, { status: 400 });
    }

    const aToken: string | undefined = generateAgoraToken(lsId, user._id);
    console.log("aToken: ", aToken);

    return NextResponse.json({
      date: new Date().toUTCString(),
      data: { agoraToken: aToken },
    });
  } catch (error) {
    console.error("Error fetching live request status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
