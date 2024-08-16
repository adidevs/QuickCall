import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({
      message: "Missing required fields",
      status: 400,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await dbConnect();

    const checkUser = await User.findOne({ email });

    if (checkUser)
      return NextResponse.json({
        message: "User already exists!",
        status: 400,
      });

    const addUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return NextResponse.json({
      message: "User created successfully",
      status: 200,
      user: addUser,
    });
  } catch (error) {
    console.log("ERROR: "+error);
    return NextResponse.json({ message: "Internal Server Error", status: 500 });
  }
}
