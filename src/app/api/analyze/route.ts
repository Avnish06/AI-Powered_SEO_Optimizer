import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { analyzeUrl } from "@/lib/seo";
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
    await DBConnect();
    const user = await getUnifiedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const uid = user.id || user._id;
    const userId = mongoose.Types.ObjectId.isValid(uid) ? new mongoose.Types.ObjectId(uid) : uid;

    console.log("ANALYZE POST (MongoDB): Starting for", url);
    const results = await analyzeUrl(url);

    const newCheck = await SeoCheck.create({
      url,
      score: results.score,
      onPageScore: results.categories.onPage.score,
      technicalScore: results.categories.technical.score,
      contentScore: results.categories.content.score,
      performanceScore: results.pagespeed?.performance || results.score,
      linksScore: results.categories.links.score,
      details: results,
      userId: userId,
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

    const uid = user.id || user._id;
    const userId = mongoose.Types.ObjectId.isValid(uid) ? new mongoose.Types.ObjectId(uid) : uid;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
      }
      // Get single report
      const report = await SeoCheck.findOne({ _id: id, userId: userId });
      if (!report) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(report);
    } else {
      // Get all reports for user
      const reports = await SeoCheck.find({ userId: userId })
        .select("_id url score checkedAt")
        .sort({ checkedAt: -1 });

      const mapped = reports.map(r => ({
        id: r._id,
        _id: r._id,
        url: r.url,
        score: r.score,
        checkedAt: r.checkedAt
      }));
      return NextResponse.json(mapped);
    }
  } catch (error: any) {
    console.error("ANALYZE GET ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
