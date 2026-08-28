// src/app/api/affiliate/track/route.ts
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { affiliateService } from "@/services"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { affiliateLinkId, productId } = body

    if (!affiliateLinkId) {
      return NextResponse.json(
        { error: "Affiliate link ID is required" },
        { status: 400 }
      )
    }

    // Track the click
    const result = await affiliateService.trackClick(affiliateLinkId, {
      productId,
      userAgent: request.headers.get("user-agent") || undefined,
      ipAddress: request.headers.get("x-forwarded-for") || undefined,
      referer: request.headers.get("referer") || undefined,
    })

    return NextResponse.json({
      success: true,
      message: "Click tracked successfully",
    })
  } catch (error) {
    console.error("Error tracking affiliate click:", error)
    return NextResponse.json(
      { error: "Failed to track click" },
      { status: 500 }
    )
  }
}
