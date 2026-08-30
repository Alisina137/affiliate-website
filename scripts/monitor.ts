// scripts/monitor.ts
import "dotenv/config"
import { healthService } from "../src/services/health.service"

async function monitor() {
  console.log("🔍 Running health check...")
  console.log("")

  try {
    const health = await healthService.checkHealth()
    
    console.log(`📊 Status: ${health.status.toUpperCase()}`)
    console.log(`⏱️ Uptime: ${formatUptime(health.uptime)}`)
    console.log(`📦 Version: ${health.version}`)
    console.log(`🌍 Environment: ${health.environment}`)
    console.log("")
    console.log("🔍 Checks:")

    console.log(`  🗄️  Database: ${health.checks.database.status}`)
    if (health.checks.database.latency) {
      console.log(`     Latency: ${health.checks.database.latency}ms`)
    }
    if (health.checks.database.error) {
      console.log(`     Error: ${health.checks.database.error}`)
    }

    console.log(`  💾 Memory: ${health.checks.memory.status}`)
    console.log(`     Usage: ${health.checks.memory.usage}MB / ${health.checks.memory.limit}MB`)

    if (health.checks.disk) {
      console.log(`  💿 Disk: ${health.checks.disk.status}`)
      console.log(`     Used: ${health.checks.disk.usage}GB`)
      console.log(`     Free: ${health.checks.disk.free}GB`)
    }

    console.log("")
    if (health.status === "healthy") {
      console.log("✅ All systems are healthy!")
      process.exit(0)
    } else if (health.status === "degraded") {
      console.log("⚠️ System is degraded but operational")
      process.exit(1)
    } else {
      console.log("❌ System is unhealthy!")
      process.exit(2)
    }
  } catch (error) {
    console.error("❌ Health check failed:", error)
    process.exit(3)
  }
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

monitor()
