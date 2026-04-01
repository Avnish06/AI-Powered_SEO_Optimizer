import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

export async function POST(req: Request) {
  let connection;
  try {
    const body = await req.json();
    console.log("SIGNUP: Received body", body);
    
    const { email, password, phone, accountType, fullName, organizationName } = body;

    if (!email || !password) {
      console.log("SIGNUP: Missing email or password");
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    console.log("SIGNUP: Connecting to DB directly...");
    connection = await mysql.createConnection(process.env.DATABASE_URL!);

    console.log("SIGNUP: Checking existing user", email);
    const [rows]: any = await connection.execute(
      'SELECT id FROM User WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length > 0) {
      console.log("SIGNUP: User already exists");
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    console.log("SIGNUP: Hashing password");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("SIGNUP: Creating user in DB...");
    const [result]: any = await connection.execute(
      'INSERT INTO User (email, password, phone, accountType, fullName, organizationName, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        email, 
        hashedPassword, 
        phone || null, 
        accountType || "INDIVIDUAL", 
        (accountType === "INDIVIDUAL" ? fullName : null) || null,
        (accountType === "ORGANIZATION" ? organizationName : null) || null,
        new Date()
      ]
    );

    console.log("SIGNUP: Success, new user ID:", result.insertId);
    return NextResponse.json({ message: "User created", user: { email } });
  } catch (error: any) {
    console.error("SIGNUP ERROR DETAILS:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}
