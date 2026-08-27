// scripts/test-auth-api.ts
import "dotenv/config"

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000"

async function testAPIs() {
  console.log("🔐 Testing Auth API Routes...")
  console.log(`Base URL: ${BASE_URL}`)

  try {
    // Test session endpoint
    console.log("\n📡 Testing session endpoint...")
    const sessionRes = await fetch(`${BASE_URL}/api/auth/session`)
    const sessionData = await sessionRes.json()
    console.log(`Session status: ${sessionRes.status}`)
    console.log(`Session data:`, sessionData)

    console.log("\n✅ Auth API routes are working!")
  } catch (error) {
    console.error("❌ Error testing auth APIs:", error)
    console.log("\nMake sure the server is running: npm run dev")
  }
}

testAPIs()
