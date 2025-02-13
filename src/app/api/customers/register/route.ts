import { Connect } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
Connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log("reqBody", reqBody);
    const { user } = reqBody;

    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const newUser = await User.create({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      role : user.role
    });



    const accessToken = jwt.sign(
      { _id: newUser._id },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "10d",
      }
    );
    console.log('accessToken123: ', accessToken);
    const createdUser = await User.findById(newUser._id).select(
      "-password "
    );
    if (!createdUser) {
      return NextResponse.json(
        { error: "Something went wrong while registering the user" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      date: new Date().toUTCString(),
      data: {
        user: createdUser,
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
