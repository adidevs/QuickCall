import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { identifier, password } = await req.json();

  if (!identifier || !password) {
    return NextResponse.json({
      message: "Missing required fields",
      status: 400,
    });
  }

  try {
    await dbConnect();

    const checkUser = await User.findOne({ email: identifier });

    if (!checkUser)
      return NextResponse.json({
        message: "Invalid Email!",
        status: 400,
      });

    const isValid = await bcrypt.compare(password, checkUser.password);
    if (isValid)
      return NextResponse.json({
        message: "User Found",
        status: 200,
        user: {
          _id: checkUser._id,
          email: checkUser.email,
          name: checkUser.name,
        },
      });
    else
      return NextResponse.json({
        message: "Invalid Password!",
        status: 400,
      });
  } catch (error) {
    console.log("ERROR" + error);
    return NextResponse.json({ message: "Internal Server Error", status: 500 });
  }
}
