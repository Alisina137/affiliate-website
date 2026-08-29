// scripts/test-integration.ts
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

async function runIntegrationTests() {
  console.log("🧪 Running integration tests...")
  console.log("")

  try {
    // Run the tests
    const { stdout, stderr } = await execAsync("npx vitest run --dir src/app/api/__tests__")

    if (stderr) {
      console.error(stderr)
    }

    console.log(stdout)
    console.log("✅ Integration tests passed!")
  } catch (error) {
    console.error("❌ Integration tests failed:", error)
    process.exit(1)
  }
}

runIntegrationTests()
