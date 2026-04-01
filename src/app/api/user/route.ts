import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    console.log("API USER: Fetching session...");
    const session = await getSession();
    
    if (!session) {
      console.log("API USER: No session found");
      return NextResponse.json({ user: null });
    }

    console.log("API USER: Session found for user", session.user.email);
    return NextResponse.json({ user: session.user });
  } catch (error: any) {
    console.error("API USER ERROR DETAILS:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
