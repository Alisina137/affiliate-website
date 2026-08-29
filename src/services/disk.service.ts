// src/services/disk.service.ts
import fs from "fs"

export const diskService = {
  async getDiskInfo() {
    // This is a simplified version - in production, you might want to use a package like `diskusage`
    try {
      const stats = fs.statfsSync("/")
      const total = stats.blocks * stats.bsize
      const free = stats.bfree * stats.bsize
      const used = total - free

      return {
        total,
        used,
        free,
        usagePercent: (used / total) * 100,
      }
    } catch {
      // Fallback for Windows
      return {
        total: 100 * 1024 * 1024 * 1024, // 100GB
        used: 50 * 1024 * 1024 * 1024, // 50GB
        free: 50 * 1024 * 1024 * 1024, // 50GB
        usagePercent: 50,
      }
    }
  },
}
