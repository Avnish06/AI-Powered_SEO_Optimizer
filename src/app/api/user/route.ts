import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  try {
    // 1. Check custom session
    const customSession = await getSession();
    if (customSession?.user) {
      return NextResponse.json({ user: customSession.user });
    }

    // 2. Check NextAuth session
    const nextAuthSession = await getServerSession(authOptions);
    if (nextAuthSession?.user) {
      return NextResponse.json({ user: nextAuthSession.user });
    }

    return NextResponse.json({ user: null });
  } catch (error: any) {
    console.error("API USER ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
