// scripts/test-db.ts
import "dotenv/config"
import { testDatabaseConnection } from "../src/lib/db/health"

async function main() {
  console.log("🚀 Starting database connection test...")
  console.log(`📡 Target: ${process.env.DATABASE_URL?.substring(0, 50)}...`)
  console.log("")
  
  try {
    await testDatabaseConnection()
    console.log("")
    console.log("✨ Database is ready for use!")
    process.exit(0)
  } catch (error) {
    console.error("")
    console.error("💥 Database test failed.")
    process.exit(1)
  }
}

main()
