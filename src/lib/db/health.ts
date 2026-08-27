// src/lib/db/health.ts
import { db } from "./index"

export interface DatabaseHealth {
  isConnected: boolean
  error?: string
  latency?: number
  timestamp: Date
}

export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const startTime = Date.now()
  
  try {
    // Execute a simple query to check connection
    await db.$queryRaw`SELECT 1 as connected`
    
    const latency = Date.now() - startTime
    
    return {
      isConnected: true,
      latency,
      timestamp: new Date(),
    }
  } catch (error) {
    return {
      isConnected: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date(),
    }
  }
}

export async function testDatabaseConnection(): Promise<void> {
  console.log("🔍 Testing database connection...")
  
  const health = await checkDatabaseHealth()
  
  if (health.isConnected) {
    console.log(`✅ Database connected successfully! (${health.latency}ms)`)
  } else {
    console.error(`❌ Database connection failed: ${health.error}`)
    throw new Error(`Database connection failed: ${health.error}`)
  }
}
