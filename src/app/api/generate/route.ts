import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key is missing. Please check your configuration." },
        { status: 500 },
      );
    }

    const { prompt } = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", 
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return NextResponse.json({
      result: response.text(),
    });
  } catch (error: any) {
    console.error("AI GENERATE ERROR:", error);
    const msg: string = error.message || "";
    if (msg.includes("429") || msg.includes("quota") || msg.includes("Too Many Requests")) {
      return NextResponse.json(
        { error: "API quota exceeded. Free tier limit reached — please wait a few minutes or upgrade at https://ai.google.dev" },
        { status: 429 },
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to generate code" },
      { status: 500 },
    );
  }
}
