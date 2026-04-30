import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/DBConnect";
import User from "@/model/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, password, phone, accountType, fullName, organizationName } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      phone: phone || null,
      accountType: accountType || "INDIVIDUAL",
      fullName: (accountType === "INDIVIDUAL" ? fullName : null) || null,
      organizationName: (accountType === "ORGANIZATION" ? organizationName : null) || null,
      createdAt: new Date()
    });

    return NextResponse.json({ 
      message: "User created successfully", 
      user: { email: newUser.email, id: newUser._id } 
    });
  } catch (error: any) {
    console.error("SIGNUP ERROR:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
