import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { analyzeUrl } from "@/lib/seo";
import DBConnect from "@/lib/DBConnect";
import SeoCheck from "@/model/SeoCheck";

async function getUnifiedUser(req: Request) {
  const customSession = await getSession();
  if (customSession?.user) return customSession.user;
  
  const nextAuthSession = await getServerSession(authOptions);
  if (nextAuthSession?.user) return nextAuthSession.user;
  
  return null;
}

export async function POST(req: Request) {
  try {
    await DBConnect();
    const user = await getUnifiedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    console.log("ANALYZE POST (MongoDB): Starting for", url);
    const results = await analyzeUrl(url);

    const newCheck = await SeoCheck.create({
      url,
      score: results.score,
      onPageScore: results.onPageScore,
      technicalScore: results.technicalScore,
      contentScore: results.contentScore,
      performanceScore: results.performanceScore,
      linksScore: results.linksScore,
      details: results.details,
      userId: user.id,
      checkedAt: new Date()
    });

    return NextResponse.json({ id: newCheck._id, ...results });
  } catch (error: any) {
    console.error("ANALYZE POST ERROR:", error);
    return NextResponse.json({ 
      error: error.message || "An unexpected error occurred" 
    },
   { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await DBConnect();
    const user = await getUnifiedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // Get single report
      const report = await SeoCheck.findOne({ _id: id, userId: user.id });
      if (!report) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(report);
    } else {
      // Get all reports for user
      const reports = await SeoCheck.find({ userId: user.id })
        .select("id url score checkedAt")
        .sort({ checkedAt: -1 });
      return NextResponse.json(reports);
    }
  } catch (error: any) {
    console.error("ANALYZE GET ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
