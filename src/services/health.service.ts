// src/services/health.service.ts
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import packageJson from "../../package.json";

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: {
    database: {
      status: "healthy" | "degraded" | "unhealthy";
      latency?: number;
      error?: string;
    };
    memory: {
      status: "healthy" | "degraded" | "unhealthy";
      usage: number;
      limit: number;
    };
    disk?: {
      status: "healthy" | "degraded" | "unhealthy";
      usage: number;
      free: number;
    };
  };
}

export const healthService = {
  async checkHealth(): Promise<HealthStatus> {
    const checks: HealthStatus["checks"] = {
      database: { status: "healthy" as const },
      memory: { status: "healthy" as const, usage: 0, limit: 0 },
    };

    // Check database
    try {
      const dbStart = Date.now();
      await db.$queryRaw`SELECT 1`;
      checks.database.latency = Date.now() - dbStart;
      checks.database.status = "healthy";
    } catch (error) {
      checks.database.status = "unhealthy";
      checks.database.error =
        error instanceof Error ? error.message : "Database connection failed";
      logger.error("Database health check failed", error as Error);
    }

    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const heapUsed = memoryUsage.heapUsed / 1024 / 1024; // MB
    const maxMemory = 1024; // 1GB limit

    checks.memory.usage = Math.round(heapUsed);
    checks.memory.limit = maxMemory;
    checks.memory.status =
      heapUsed > maxMemory * 0.9
        ? "unhealthy"
        : heapUsed > maxMemory * 0.75
          ? "degraded"
          : "healthy";

    // Check disk (if available in Node.js)
    try {
      const { diskService } = await import("./disk.service");
      const diskInfo = await diskService.getDiskInfo();
      checks.disk = {
        status:
          diskInfo.free < 1024 * 1024 * 100
            ? "unhealthy" // < 100MB free
            : diskInfo.free < 1024 * 1024 * 500
              ? "degraded" // < 500MB free
              : "healthy",
        usage: Math.round((diskInfo.used / 1024 / 1024 / 1024) * 100) / 100, // GB
        free: Math.round((diskInfo.free / 1024 / 1024 / 1024) * 100) / 100, // GB
      };
    } catch {
      // Disk check not available
    }

    // Determine overall status - use explicit type assertions
    const dbStatus = checks.database.status as
      | "healthy"
      | "degraded"
      | "unhealthy";
    const memStatus = checks.memory.status as
      | "healthy"
      | "degraded"
      | "unhealthy";

    let overallStatus: HealthStatus["status"] = "healthy";

    if (dbStatus === "unhealthy" || memStatus === "unhealthy") {
      overallStatus = "unhealthy";
    } else if (dbStatus === "degraded" || memStatus === "degraded") {
      overallStatus = "degraded";
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: packageJson.version,
      environment: process.env.NODE_ENV || "development",
      checks,
    };
  },

  async checkReadiness(): Promise<boolean> {
    try {
      // Check database connectivity
      await db.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  },

  async checkLiveness(): Promise<boolean> {
    // Basic liveness check - always true if process is running
    return true;
  },
};
