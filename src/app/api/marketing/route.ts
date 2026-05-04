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
    const { product, type } = await req.json();

    if (!product) {
      return NextResponse.json(
        { error: "Product description is required" },
        { status: 400 },
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    let prompt = "";
    
    switch (type) {
      case "social":
        prompt = `You are a social media growth expert. Create 3 viral-style posts (with emojis) for this product: "${product}". Include hashtags.`;
        break;
      case "email":
        prompt = `You are a direct-response copywriter. Write a 3-email sequence (Subject Line + Body) for this product: "${product}". Focus on a 'problem-agitate-solve' framework.`;
        break;
      case "growth":
        prompt = `You are a SaaS growth strategist. Outline a 90-day growth strategy for this product: "${product}". Include SEO keywords, partnership ideas, and conversion rate optimization tips.`;
        break;
      case "ad":
      default:
        prompt = `
You are a professional digital marketing expert.
Create a Facebook/Instagram ad campaign for the product: "${product}"
Give output in this format:
Headline:
Description:
Target Audience:
CTA:
`;
        break;
    }

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
    const msg: string = error.message || "";
    if (msg.includes("429") || msg.includes("quota") || msg.includes("Too Many Requests")) {
      return NextResponse.json(
        { error: "API quota exceeded. Your free tier limit has been reached. Please wait a few minutes and try again, or upgrade your Google AI plan at https://ai.google.dev" },
        { status: 429 },
      );
    }
    if (msg.includes("404") || msg.includes("not found")) {
      return NextResponse.json(
        { error: "AI model not available. Please check your API configuration." },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to generate marketing content" },
      { status: 500 },
    );
  }
}
