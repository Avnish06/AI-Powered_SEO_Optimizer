import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  const publicApiPaths = ["/api/login", "/api/signup", "/api/user", "/api/audit", "/api/analyze", "/api/logout"];
  const isPublicApi = publicApiPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  if (!session) {
    if (request.nextUrl.pathname.startsWith("/api/") && !isPublicApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  
  if (session) {
    try {
      await decrypt(session);
    } catch (error) {
      if (request.nextUrl.pathname.startsWith("/api/") && !isPublicApi) {
        return NextResponse.json({ error: "Invalid session" }, { status: 401 });
      }
      if (!isPublicApi && !request.nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
