// src/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  
  // Check if user is admin for admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
  ],
}
