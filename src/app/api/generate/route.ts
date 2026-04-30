import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest", 
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return NextResponse.json({
      result: response.text(),
    });
  } catch (error: any) {
    console.error("AI GENERATE ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate code" },
      { status: 500 },
    );
  }
}
