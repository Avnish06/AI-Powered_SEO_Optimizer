import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key is missing. Please check your .env file." },
        { status: 500 },
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { product } = await req.json();

    if (!product) {
      return NextResponse.json(
        { error: "Product description is required" },
        { status: 400 },
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });


    const prompt = `
You are a professional digital marketing expert.

Create a Facebook/Instagram ad campaign for the product: "${product}"

Give output in this format:

Headline:
Description:
Target Audience:
CTA:
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("AI returned an empty response.");
    }

    return NextResponse.json({
      result: text,
    });
  } catch (error: any) {
    console.error("Marketing API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate marketing content" },
      { status: 500 },
    );
  }
}
