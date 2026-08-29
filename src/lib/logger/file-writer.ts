// src/lib/logger/file-writer.ts
import fs from "fs"
import path from "path"
import { LogEntry, formatLogEntry } from "./formatter"

export class FileLogWriter {
  private logDir: string
  private logFile: string
  private stream: fs.WriteStream | null = null

  constructor(logDir: string = "logs") {
    this.logDir = path.join(process.cwd(), logDir)
    this.logFile = path.join(this.logDir, `app-${new Date().toISOString().split("T")[0]}.log`)

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true })
    }
  }

  write(entry: LogEntry): void {
    const line = formatLogEntry(entry) + "\n"

    if (!this.stream) {
      this.stream = fs.createWriteStream(this.logFile, { flags: "a" })
    }

    this.stream.write(line)
  }

  close(): void {
    if (this.stream) {
      this.stream.end()
      this.stream = null
    }
  }

  getLogFiles(): string[] {
    return fs.readdirSync(this.logDir)
      .filter((file) => file.startsWith("app-") && file.endsWith(".log"))
      .map((file) => path.join(this.logDir, file))
  }

  getLogContent(fileName: string): string {
    const filePath = path.join(this.logDir, fileName)
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf8")
    }
    return ""
  }
}
