import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import { login } from "@/lib/auth";
import mysql from "mysql2/promise";
import { MongoClient } from "mongodb";

const MONGO_URI = "mongodb+srv://avnishkrmbd_db_user:l2H8DZxu6a3HbaAP@cluster0s.kp3pdkq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0s";

export async function POST(req: Request) {
  let connection;
  let mongoClient;
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let user: any = null;

    // --- MONGODB (Primary Check) ---
    try {
      console.log("LOGIN: Connecting to MongoDB...");
      mongoClient = new MongoClient(MONGO_URI);
      await mongoClient.connect();
      const db = mongoClient.db("colvo_seo");
      const usersCollection = db.collection("users");
      
      console.log("LOGIN: Searching for user in Mongo", email);
      const mongoUser = await usersCollection.findOne({ email });
      if (mongoUser) {
        user = {
          id: mongoUser._id.toString(),
          email: mongoUser.email,
          password: mongoUser.password
        };
      }
    } catch (mongoErr: any) {
      console.warn("LOGIN: Mongo connection failed during login:", mongoErr.message);
    }

    // --- MYSQL (Secondary Check) ---
    if (!user && process.env.DATABASE_URL) {
      try {
        console.log("LOGIN: User not found in Mongo or Mongo failed. Trying MySQL...");
        connection = await mysql.createConnection(process.env.DATABASE_URL);
        const [rows]: any = await connection.execute(
          'SELECT id, email, password FROM User WHERE email = ? LIMIT 1',
          [email]
        );
        if (rows.length > 0) {
          user = rows[0];
        }
      } catch (mysqlErr: any) {
         console.warn("LOGIN: MySQL connection failed during login:", mysqlErr.message);
      }
    }

    if (!user) {
      console.log("LOGIN: User not found in any database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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
    if (connection) await connection.end().catch(() => {});
    if (mongoClient) await mongoClient.close();
  }
}
