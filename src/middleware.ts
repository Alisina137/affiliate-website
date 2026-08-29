// src/middleware.ts (update with security headers)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { addSecurityHeaders } from "@/lib/security/headers";

export async function middleware(req: NextRequest) {
  // Get the token - pass secret explicitly
  const token = await getToken({ 
    req,
    secret: process.env.NEXTAUTH_SECRET 
  });

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register");
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");

  // Protect admin routes - require ADMIN role
  if (isAdminRoute && !isApiRoute) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Check if user has ADMIN role
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect dashboard routes - require any authenticated user
  if (isDashboardRoute && !isApiRoute) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Add security headers
  const response = NextResponse.next();

  // Check if addSecurityHeaders exists, otherwise add basic headers
  if (typeof addSecurityHeaders === "function") {
    addSecurityHeaders(response);
  } else {
    // Basic security headers if the utility doesn't exist
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
    // Exclude API routes from middleware to avoid conflicts
    // But still apply security headers to all routes via the last matcher
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
