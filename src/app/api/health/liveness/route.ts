// src/app/api/health/liveness/route.ts
import { NextResponse } from "next/server"
import { healthService } from "@/services/health.service"

export async function GET() {
  const isAlive = await healthService.checkLiveness()

  if (!isAlive) {
    return NextResponse.json(
      {
        status: "dead",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }

  return NextResponse.json({
    status: "alive",
    timestamp: new Date().toISOString(),
  })
}
