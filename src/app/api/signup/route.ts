import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import { MongoClient } from "mongodb";

const MONGO_URI = "mongodb+srv://avnishkrmbd_db_user:l2H8DZxu6a3HbaAP@cluster0s.kp3pdkq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0s";

export async function POST(req: Request) {
  let connection;
  let mongoClient;
  try {
    const body = await req.json();
    console.log("SIGNUP: Received body", body);
    
    const { email, password, phone, accountType, fullName, organizationName } = body;

    if (!email || !password) {
      console.log("SIGNUP: Missing email or password");
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    console.log("SIGNUP: Hashing password");
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- MONGODB (Primary for Cloud/Vercel) ---
    console.log("SIGNUP: Connecting to MongoDB...");
    mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();
    const db = mongoClient.db("colvo_seo");
    const usersCollection = db.collection("users");

    console.log("SIGNUP: Checking existing user in Mongo", email);
    const existingMongoUser = await usersCollection.findOne({ email });
    if (existingMongoUser) {
      console.log("SIGNUP: User already exists in Mongo");
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    console.log("SIGNUP: Creating user in MongoDB...");
    const mongoResult = await usersCollection.insertOne({
      email, 
      password: hashedPassword, 
      phone: phone || null, 
      accountType: accountType || "INDIVIDUAL", 
      fullName: (accountType === "INDIVIDUAL" ? fullName : null) || null,
      organizationName: (accountType === "ORGANIZATION" ? organizationName : null) || null,
      createdAt: new Date()
    });
    
    const newUserId = mongoResult.insertedId.toString();
    console.log("SIGNUP: Success in Mongo, new user ID:", newUserId);

    // --- MYSQL (Secondary sync for Local) ---
    try {
      console.log("SIGNUP: Syncing to local MySQL DB...");
      if (process.env.DATABASE_URL) {
        connection = await mysql.createConnection(process.env.DATABASE_URL);
        const [rows]: any = await connection.execute('SELECT id FROM User WHERE email = ? LIMIT 1', [email]);
        
        if (rows.length === 0) {
          await connection.execute(
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
          console.log("SIGNUP: User successfully synced to local MySQL");
        }
      }
    } catch (mysqlError: any) {
      console.warn("SIGNUP: MySQL sync skipped (Normal in Vercel):", mysqlError.message);
    }

    return NextResponse.json({ message: "User created", user: { email, id: newUserId } });
  } catch (error: any) {
    console.error("SIGNUP ERROR DETAILS:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end().catch(() => {});
    if (mongoClient) await mongoClient.close();
  }
}
