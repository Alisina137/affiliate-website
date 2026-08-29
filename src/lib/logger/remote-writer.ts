// src/lib/logger/remote-writer.ts
import { LogEntry, formatLogEntry } from "./formatter"

interface RemoteLogWriterConfig {
  url: string
  apiKey?: string
  headers?: Record<string, string>
  batchSize?: number
  flushInterval?: number
}

export class RemoteLogWriter {
  private config: RemoteLogWriterConfig
  private buffer: LogEntry[] = []
  private timer: NodeJS.Timeout | null = null

  constructor(config: RemoteLogWriterConfig) {
    this.config = {
      batchSize: 100,
      flushInterval: 5000,
      ...config,
    }
  }

  write(entry: LogEntry): void {
    this.buffer.push(entry)

    if (this.buffer.length >= (this.config.batchSize || 100)) {
      this.flush()
    }

    if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.config.flushInterval)
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) return

    const entries = [...this.buffer]
    this.buffer = []

    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }

    try {
      const response = await fetch(this.config.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.config.apiKey && { "Authorization": `Bearer ${this.config.apiKey}` }),
          ...this.config.headers,
        },
        body: JSON.stringify(entries.map((entry) => formatLogEntry(entry))),
      })

      if (!response.ok) {
        console.error(`Failed to send logs: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error("Failed to send logs:", error)
    }
  }

  close(): void {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    this.flush()
  }
}
