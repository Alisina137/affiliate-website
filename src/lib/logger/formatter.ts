// src/lib/logger/formatter.ts
import { LogLevel } from "./config"

export interface LogEntry {
  timestamp: string
  level: string
  message: string
  service: string
  environment: string
  traceId?: string
  spanId?: string
  userId?: string
  sessionId?: string
  ip?: string
  userAgent?: string
  duration?: number
  metadata?: Record<string, any>
  error?: {
    name: string
    message: string
    stack?: string
    code?: string
  }
}

export function formatLogEntry(entry: LogEntry): string {
  return JSON.stringify(entry)
}

export function formatPrettyLogEntry(entry: LogEntry): string {
  const timestamp = entry.timestamp
  const level = entry.level.padEnd(5)
  const message = entry.message

  let output = `[${timestamp}] ${level} ${message}`

  if (entry.traceId) {
    output += ` trace=${entry.traceId}`
  }

  if (entry.userId) {
    output += ` user=${entry.userId}`
  }

  if (entry.duration !== undefined) {
    output += ` duration=${entry.duration}ms`
  }

  if (entry.metadata && Object.keys(entry.metadata).length > 0) {
    output += `\n  Metadata: ${JSON.stringify(entry.metadata, null, 2)}`
  }

  if (entry.error) {
    output += `\n  Error: ${entry.error.name}: ${entry.error.message}`
    if (entry.error.stack) {
      output += `\n  Stack: ${entry.error.stack}`
    }
  }

  return output
}

export function createLogEntry(
  level: LogLevel,
  message: string,
  options: Partial<LogEntry> = {}
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level: LogLevel[level],
    message,
    service: options.service || "affiliate-website",
    environment: options.environment || process.env.NODE_ENV || "development",
    ...options,
  }
}
