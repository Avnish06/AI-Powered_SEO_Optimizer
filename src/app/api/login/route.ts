import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import { login } from "@/lib/auth";
import mysql from "mysql2/promise";

export async function POST(req: Request) {
  let connection;
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    console.log("LOGIN: Connecting to DB directly...");
    connection = await mysql.createConnection(process.env.DATABASE_URL!);

    console.log("LOGIN: Searching for user", email);
    const [rows]: any = await connection.execute(
      'SELECT id, email, password FROM User WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      console.log("LOGIN: User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      console.log("LOGIN: Invalid password");
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    console.log("LOGIN: Success, creating session");
    await login({ id: user.id, email: user.email });

    return NextResponse.json({ message: "Login successful" });
  } catch (error: any) {
    console.error("LOGIN ERROR DETAILS:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
