import { NextResponse } from "next/server";
import { analyzeUrl } from "@/lib/seo";
import { getSession } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import DBConnect from "@/lib/DBConnect";
import SeoCheck from "@/model/SeoCheck";
import mongoose from "mongoose";

async function getUnifiedUser(req: Request) {
  const customSession = await getSession();
  if (customSession?.user) return customSession.user;
  
  const nextAuthSession = await getServerSession(authOptions);
  if (nextAuthSession?.user) return nextAuthSession.user;
  
  return null;
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "A valid URL is required." }, { status: 400 });
    }

    console.log("[SEO Audit] Starting analysis for:", url);
    const report = await analyzeUrl(url);
    console.log("[SEO Audit] Done. Score:", report.score);

    // Save to dashboard if the user is authenticated
    try {
      await DBConnect();
      const user = await getUnifiedUser(req);
      if (user) {
        const uid = user.id || user._id;
        const userId = mongoose.Types.ObjectId.isValid(uid) ? new mongoose.Types.ObjectId(uid) : uid;

        console.log("[SEO Audit] User detected, saving check to DB:", uid);
        await SeoCheck.create({
          url,
          score: report.score,
          onPageScore: report.categories.onPage.score,
          technicalScore: report.categories.technical.score,
          contentScore: report.categories.content.score,
          performanceScore: report.pagespeed?.performance || report.score,
          linksScore: report.categories.links.score,
          details: report,
          userId: userId,
          checkedAt: new Date()
        });
      }
    } catch (dbErr: any) {
      console.error("[SEO Audit] Failed to save to MongoDB (ignoring):", dbErr.message);
    }

    return NextResponse.json(report);
  } catch (error: any) {
    console.error("[SEO Audit] Error:", error);
    return NextResponse.json(
      { error: error.message || "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
