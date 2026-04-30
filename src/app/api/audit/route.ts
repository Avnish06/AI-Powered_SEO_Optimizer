import { NextResponse } from "next/server";
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { getSession } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/lib/DBConnect";
import SeoCheck from "@/model/SeoCheck";

const execAsync = promisify(exec);

async function getUnifiedUser(req: Request) {
  const customSession = await getSession();
  if (customSession?.user) return customSession.user;
  
  const nextAuthSession = await getServerSession(authOptions);
  if (nextAuthSession?.user) return nextAuthSession.user;
  
  return null;
}

export async function POST(req: Request) {
  const tempFile = path.join(process.cwd(), `lh-${Date.now()}.json`);
  
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    console.log("AUDIT POST (MongoDB): Starting for", url);

    const isWindows = process.platform === 'win32';
    const lhPath = path.join(process.cwd(), 'node_modules', '.bin', isWindows ? 'lighthouse.cmd' : 'lighthouse');
    
    const cmd = `"${lhPath}" "${url}" --output=json --output-path="${tempFile}" --chrome-flags="--headless --no-sandbox --disable-gpu" --only-categories=performance,accessibility,best-practices,seo --max-wait-for-load=30000 --quiet --no-update-check`;

    try {
      await execAsync(cmd);
    } catch (cliError: any) {
      if (!fs.existsSync(tempFile)) {
        throw new Error(`Audit execution failed: ${cliError.message}`);
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

    // DB Storage (MongoDB only)
    try {
      await dbConnect();
      const user = await getUnifiedUser(req);
      if (user) {
        await SeoCheck.create({
          url,
          score: Math.round(results.performanceScore),
          performanceScore: Math.round(results.performanceScore),
          details: results,
          userId: user.id,
          checkedAt: new Date()
        });
        console.log("AUDIT POST: Saved to MongoDB via Mongoose");
      }
    } catch (dbError) {
      console.error("DB Storage failed", dbError);
    }

    return NextResponse.json(results);
  } catch (error: any) {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    console.error("AUDIT POST ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
