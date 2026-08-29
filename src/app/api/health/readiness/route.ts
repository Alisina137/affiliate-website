// src/app/api/health/readiness/route.ts
import { NextResponse } from "next/server"
import { healthService } from "@/services/health.service"
import { logger } from "@/lib/logger"

export async function GET() {
  try {
    const isReady = await healthService.checkReadiness()

    if (!isReady) {
      logger.warn("Readiness check failed - database not ready")
      return NextResponse.json(
        {
          status: "not ready",
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      )
    }

    return NextResponse.json({
      status: "ready",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error("Readiness check failed", error as Error)
    return NextResponse.json(
      {
        status: "not ready",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Readiness check failed",
      },
      { status: 503 }
    )
  }
}
