import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { analyzeUrl } from "@/lib/seo";
import DBConnect from "@/lib/DBConnect";
import SeoCheck from "@/model/SeoCheck";
import mongoose from "mongoose";

/**
 * Get user from NextAuth only (clean approach)
 */
async function getUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

/**
 * Convert user id safely
 */
function getUserObjectId(user: any) {
  const uid = user?.id;

  if (!uid || !mongoose.Types.ObjectId.isValid(uid)) {
    throw new Error("Invalid user ID");
  }

  return new mongoose.Types.ObjectId(uid);
}

/**
 * POST: Analyze URL
 */
export async function POST(req: Request) {
  try {
    await DBConnect();

    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = getUserObjectId(user);

    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

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
      userId,
      checkedAt: new Date(),
    });

    return NextResponse.json({
      id: newCheck._id,
      ...results,
    });
  } catch (error: any) {
    console.error("POST ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}

/**
 * GET: Fetch reports
 */
export async function GET(req: Request) {
  try {
    await DBConnect();

    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = getUserObjectId(user);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
      }

      const report = await SeoCheck.findOne({
        _id: new mongoose.Types.ObjectId(id),
        userId,
      });

      if (!report) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      return NextResponse.json(report);
    }

    const reports = await SeoCheck.find({ userId })
      .select("_id url score checkedAt")
      .sort({ checkedAt: -1 });

    return NextResponse.json(reports);
  } catch (error: any) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
