import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { login } from "@/lib/auth";
import dbConnect from "@/lib/DBConnect";
import User from "@/model/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Success, create session
    await login({ 
      id: user._id.toString(), 
      email: user.email, 
      fullName: user.fullName 
    });

    return NextResponse.json({ message: "Login successful" });
  } catch (error: any) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
