import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define public paths
  const publicApiPaths = ["/api/login", "/api/signup", "/api/user", "/api/audit", "/api/analyze", "/api/logout"];
  const isPublicApi = publicApiPaths.some((p) => path.startsWith(p));
  const isDashboard = path.startsWith("/dashboard");
  const isApi = path.startsWith("/api/");

  // 1. Check for custom session (jose)
  const customSession = request.cookies.get("session")?.value;
  let hasCustomAuth = false;
  if (customSession) {
    try {
      await decrypt(customSession);
      hasCustomAuth = true;
    } catch {
      hasCustomAuth = false;
    }
  }

  // 2. Check for NextAuth session
  const nextAuthToken = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  const hasNextAuth = !!nextAuthToken;

  const isAuthenticated = hasCustomAuth || hasNextAuth;

  // PROTECTION LOGIC
  if (!isAuthenticated) {
    // Block private APIs
    if (isApi && !isPublicApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Redirect dashboard to login
    if (isDashboard) {
      const loginUrl = new URL("/login", request.url);
      // Optional: add a redirect param
      // loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
