import { Connect } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
Connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log("reqBody", reqBody);
    const { email, password } = reqBody;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid user Password" },
        { status: 401 }
      );
    }

    const accessToken = jwt.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "10d",
      }
    );
  const loggedInUser = await User.findById(user._id).select(
    "-password"
  );

    return NextResponse.json({
      date: new Date().toUTCString(),
      data: {
        user: loggedInUser,
        accessToken,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
