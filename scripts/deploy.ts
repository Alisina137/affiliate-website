// scripts/deploy.ts
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

async function deploy() {
  const env = process.env.DEPLOY_ENV || "staging"
  console.log(`🚀 Deploying to ${env}...`)
  console.log("")

  try {
    // 1. Run tests
    console.log("🧪 Running tests...")
    await execAsync("npm run test")
    await execAsync("npm run test:integration")
    console.log("✅ Tests passed")

    // 2. Build the application
    console.log("📦 Building application...")
    await execAsync("npm run build")
    console.log("✅ Build complete")

    // 3. Run database migrations
    console.log("🗄️ Running database migrations...")
    await execAsync("npx prisma migrate deploy")
    console.log("✅ Migrations complete")

    // 4. Deploy based on environment
    if (env === "production") {
      console.log("🌐 Deploying to production...")
      // Add your production deployment command here
      // e.g., Vercel, AWS, or custom script
    } else {
      console.log("🌐 Deploying to staging...")
      // Add your staging deployment command here
    }

    console.log("")
    console.log("✅ Deployment complete!")
  } catch (error) {
    console.error("❌ Deployment failed:", error)
    process.exit(1)
  }
}

deploy()
