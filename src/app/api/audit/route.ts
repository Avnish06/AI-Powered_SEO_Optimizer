import { NextResponse } from "next/server";
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { getSession } from "@/lib/auth";
import mysql from "mysql2/promise";
import { MongoClient } from "mongodb";

const execAsync = promisify(exec);
const MONGO_URI = "mongodb+srv://avnishkrmbd_db_user:l2H8DZxu6a3HbaAP@cluster0s.kp3pdkq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0s";

export async function POST(req: Request) {
  let connection;
  let mongoClient;
  const tempFile = path.join(process.cwd(), `lh-${Date.now()}.json`);
  
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    console.log("AUDIT POST: Starting for", url);

    const isWindows = process.platform === 'win32';
    const lhPath = path.join(process.cwd(), 'node_modules', '.bin', isWindows ? 'lighthouse.cmd' : 'lighthouse');
    
    // Using the same command that worked in the test
    const cmd = `"${lhPath}" "${url}" --output=json --output-path="${tempFile}" --chrome-flags="--headless --no-sandbox --disable-gpu" --only-categories=performance,accessibility,best-practices,seo --max-wait-for-load=30000 --quiet --no-update-check`;

    console.log("Executing CLI:", cmd);
    try {
      await execAsync(cmd);
    } catch (cliError: any) {
      console.error("Lighthouse CLI threw an error:", cliError.stderr || cliError.message);
      
      // On Windows, Node.js v24 often throws an EPERM error when ChromeLauncher tries to 
      // synchronously delete its temporary profile directory after completing the audit.
      // If our JSON report file was already created, the audit succeeded and we can ignore this cleanup error.
      if (!fs.existsSync(tempFile)) {
        throw new Error(`Audit execution failed. This might be due to a timeout or a problem with the URL: ${cliError.message}`);
      } else {
        console.log("Ignoring CLI error because the Lighthouse report file was successfully generated.");
      }
    }
    
    if (!fs.existsSync(tempFile)) {
      throw new Error("Lighthouse report file was not created.");
    }

    const reportJson = fs.readFileSync(tempFile, 'utf8');
    const lhr = JSON.parse(reportJson);
    fs.unlinkSync(tempFile);

    const results = {
      url: lhr.requestedUrl,
      performanceScore: (lhr.categories.performance.score || 0) * 100,
      accessibilityScore: (lhr.categories.accessibility.score || 0) * 100,
      bestPracticesScore: (lhr.categories['best-practices'].score || 0) * 100,
      seoScore: (lhr.categories.seo.score || 0) * 100,
      pwaScore: (lhr.categories.pwa?.score || 0) * 100,
      metrics: {
        lcp: lhr.audits['largest-contentful-paint']?.numericValue || 0,
        tbt: lhr.audits['total-blocking-time']?.numericValue || 0,
        cls: lhr.audits['cumulative-layout-shift']?.numericValue || 0,
        fcp: lhr.audits['first-contentful-paint']?.numericValue || 0,
        si: lhr.audits['speed-index']?.numericValue || 0,
        tti: lhr.audits['interactive']?.numericValue || 0,
      },
      audits: lhr.audits,
    };

    // DB Storage
    try {
      const session = await getSession();
      if (session) {
        // --- MONGODB INTEGRATION ---
        try {
          mongoClient = new MongoClient(MONGO_URI);
          await mongoClient.connect();
          const db = mongoClient.db("colvo_seo");
          const seoChecksCollection = db.collection("seo_checks");
          
          await seoChecksCollection.insertOne({
            url,
            score: Math.round(results.performanceScore),
            performanceScore: Math.round(results.performanceScore),
            details: results,
            userId: session.user.id,
            checkedAt: new Date()
          });
          console.log("AUDIT POST: Saved to MongoDB");
        } catch (mongoErr) {
          console.warn("AUDIT POST: MongoDB save failed:", mongoErr);
        }

        // --- MYSQL INTEGRATION ---
        if (process.env.DATABASE_URL) {
          try {
            connection = await mysql.createConnection(process.env.DATABASE_URL);
            await connection.execute(
              'INSERT INTO SeoCheck (url, score, performanceScore, details, userId, checkedAt) VALUES (?, ?, ?, ?, ?, ?)',
              [
                url,
                Math.round(results.performanceScore),
                Math.round(results.performanceScore),
                JSON.stringify(results),
                session.user.id,
                new Date()
              ]
            );
            console.log("AUDIT POST: Saved to MySQL");
          } catch (mysqlErr) {
            console.warn("AUDIT POST: MySQL save skipped/failed");
          }
        }
      }
    } catch (dbError) {
      console.error("DB Storage wrapper failed", dbError);
    }

    return NextResponse.json(results);
  } catch (error: any) {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    console.error("AUDIT POST ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end().catch(() => {});
    if (mongoClient) await mongoClient.close();
  }
}
