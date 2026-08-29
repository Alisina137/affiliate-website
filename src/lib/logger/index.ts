// src/lib/logger/index.ts
import { LogLevel, getConfig, LoggerConfig } from "./config"
import { createLogEntry, formatPrettyLogEntry, formatLogEntry } from "./formatter"
import { FileLogWriter } from "./file-writer"
import { RemoteLogWriter } from "./remote-writer"

// Define a type for the error code
type ErrorWithCode = Error & { code?: string | number }

// Define a type for context values
type ContextValue = string | number | boolean | null | undefined | ContextValue[] | { [key: string]: ContextValue }
type ContextRecord = Record<string, ContextValue>

// Define a type for metadata values
type MetadataValue = string | number | boolean | null | undefined | MetadataValue[] | { [key: string]: MetadataValue }
type MetadataRecord = Record<string, MetadataValue>

class Logger {
  private config: LoggerConfig
  private fileWriter: FileLogWriter | null = null
  private remoteWriter: RemoteLogWriter | null = null
  private context: ContextRecord = {}

  constructor(config: LoggerConfig = getConfig()) {
    this.config = config

    if (config.destination === "file") {
      this.fileWriter = new FileLogWriter()
    }

    if (config.destination === "remote" && config.remoteUrl) {
      this.remoteWriter = new RemoteLogWriter({
        url: config.remoteUrl,
        apiKey: process.env.LOG_API_KEY,
      })
    }
  }

  withContext(context: ContextRecord): Logger {
    const newLogger = new Logger(this.config)
    newLogger.context = { ...this.context, ...context }
    return newLogger
  }

  private log(level: LogLevel, message: string, error?: Error, metadata?: MetadataRecord): void {
    if (level < this.config.level) return

    // Convert error code to string if it's a number
    const errorCode = error ? (error as ErrorWithCode).code : undefined
    const errorCodeString = errorCode !== undefined ? String(errorCode) : undefined

    const entry = createLogEntry(level, message, {
      service: this.config.serviceName,
      environment: this.config.environment,
      metadata: { ...this.context, ...metadata },
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: errorCodeString,
      } : undefined,
    })

    // Console output
    if (this.config.destination === "console" || this.config.destination === "file") {
      const output = this.config.format === "pretty"
        ? formatPrettyLogEntry(entry)
        : formatLogEntry(entry)

      if (level >= LogLevel.ERROR) {
        console.error(output)
      } else if (level >= LogLevel.WARN) {
        console.warn(output)
      } else {
        console.log(output)
      }
    }

    // File output
    if (this.fileWriter) {
      this.fileWriter.write(entry)
    }

    // Remote output
    if (this.remoteWriter) {
      this.remoteWriter.write(entry)
    }
  }

  debug(message: string, metadata?: MetadataRecord): void {
    this.log(LogLevel.DEBUG, message, undefined, metadata)
  }

  info(message: string, metadata?: MetadataRecord): void {
    this.log(LogLevel.INFO, message, undefined, metadata)
  }

  warn(message: string, metadata?: MetadataRecord): void {
    this.log(LogLevel.WARN, message, undefined, metadata)
  }

  error(message: string, error?: Error, metadata?: MetadataRecord): void {
    this.log(LogLevel.ERROR, message, error, metadata)
  }

  fatal(message: string, error?: Error, metadata?: MetadataRecord): void {
    this.log(LogLevel.FATAL, message, error, metadata)
  }

  close(): void {
    if (this.fileWriter) {
      this.fileWriter.close()
    }
    if (this.remoteWriter) {
      this.remoteWriter.close()
    }
  }
}

export * from "./config"
export * from "./formatter"
export const logger = new Logger()
export default logger
