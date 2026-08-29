// src/app/api/health/route.ts
import { NextResponse } from "next/server"
import { healthService } from "@/services/health.service"
import { logger } from "@/lib/logger"

export async function GET() {
  try {
    const health = await healthService.checkHealth()

    // Log if unhealthy
    if (health.status !== "healthy") {
      logger.warn(`Health check status: ${health.status}`, {
        status: health.status,
        checks: health.checks,
      })
    }

    const status = health.status === "healthy" ? 200
      : health.status === "degraded" ? 200
      : 503

    return NextResponse.json(health, { status })
  } catch (error) {
    logger.error("Health check failed", error as Error)
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Health check failed",
      },
      { status: 503 }
    )
  }
}
