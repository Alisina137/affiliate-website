// scripts/test-auth.ts
import "dotenv/config"
import { auth } from "../src/lib/auth"

async function testAuth() {
  console.log("🔐 Testing Auth Configuration...")
  console.log(`NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}`)
  console.log(`NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing"}`)
  console.log("Auth configuration loaded successfully!")
}

testAuth()
