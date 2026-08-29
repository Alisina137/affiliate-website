// src/middleware.ts (update with security headers)
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { addSecurityHeaders } from "@/lib/security/headers"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
  const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard")

  // Protect admin routes
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  // Protect dashboard routes
  if (isDashboardRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  // Add security headers
  const response = NextResponse.next()
  addSecurityHeaders(response as any)

  return response
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/:path*", // Apply to all routes
  ],
}
