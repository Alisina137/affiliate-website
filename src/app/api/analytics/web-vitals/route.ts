// src/app/api/analytics/web-vitals/route.ts
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, value, rating } = body

    // Log Web Vitals
    console.log(`[Web Vitals] ${name}: ${value} (${rating})`)

    // Store in database or send to analytics service
    // await db.webVital.create({ data: { name, value, rating, createdAt: new Date() } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error recording Web Vitals:", error)
    return NextResponse.json(
      { error: "Failed to record Web Vitals" },
      { status: 500 }
    )
  }
}
