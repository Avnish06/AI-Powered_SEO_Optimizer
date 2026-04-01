import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { analyzeUrl } from "@/lib/seo";
import mysql from "mysql2/promise";

export async function POST(req: Request) {
  let connection;
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    console.log("ANALYZE POST: Starting for", url);
    const results = await analyzeUrl(url);

    connection = await mysql.createConnection(process.env.DATABASE_URL!);
    const [result]: any = await connection.execute(
      'INSERT INTO SeoCheck (url, score, onPageScore, technicalScore, contentScore, performanceScore, linksScore, details, userId, checkedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        url,
        results.score,
        results.onPageScore,
        results.technicalScore,
        results.contentScore,
        results.performanceScore,
        results.linksScore,
        JSON.stringify(results.details),
        session.user.id,
        new Date()
      ]
    );

    return NextResponse.json({ id: result.insertId, ...results });
  } catch (error: any) {
    console.error("ANALYZE POST ERROR:", error);
    return NextResponse.json({ 
      error: error.message || "An unexpected error occurred during analysis" 
    }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  let connection;
  try {
    connection = await mysql.createConnection(process.env.DATABASE_URL!);
    const [rows]: any = await connection.execute(
      'SELECT * FROM SeoCheck WHERE id = ? AND userId = ? LIMIT 1',
      [id, session.user.id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const report = rows[0];
    if (typeof report.details === 'string') {
      report.details = JSON.parse(report.details);
    }

    return NextResponse.json(report);
  } catch (error: any) {
    console.error("ANALYZE GET ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
