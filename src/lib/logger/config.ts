// src/lib/logger/config.ts
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
  SILENT = 5,
}

export interface LoggerConfig {
  level: LogLevel
  format: "json" | "pretty"
  destination: "console" | "file" | "remote"
  filePath?: string
  remoteUrl?: string
  serviceName: string
  environment: string
}

export const defaultConfig: LoggerConfig = {
  level: process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG,
  format: process.env.NODE_ENV === "production" ? "json" : "pretty",
  destination: "console",
  serviceName: "affiliate-website",
  environment: process.env.NODE_ENV || "development",
}

export function getConfig(): LoggerConfig {
  const config = { ...defaultConfig }

  // Override from environment variables
  if (process.env.LOG_LEVEL) {
    const level = process.env.LOG_LEVEL.toUpperCase()
    if (level in LogLevel) {
      config.level = LogLevel[level as keyof typeof LogLevel]
    }
  }

  if (process.env.LOG_FORMAT) {
    config.format = process.env.LOG_FORMAT as "json" | "pretty"
  }

  if (process.env.LOG_DESTINATION) {
    config.destination = process.env.LOG_DESTINATION as "console" | "file" | "remote"
  }

  return config
}
