// scripts/check-env.ts
import "dotenv/config"
import { env } from "../src/lib/env"

console.log("✅ Environment variables validated successfully!")
console.log(`   NODE_ENV: ${env.NODE_ENV}`)
console.log(`   NEXTAUTH_URL: ${env.NEXTAUTH_URL}`)
console.log(`   DATABASE_URL: ${env.DATABASE_URL.substring(0, 30)}...`)
