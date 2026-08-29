// scripts/setup-env.ts
import fs from "fs"
import readline from "readline"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function setupEnvironment() {
  console.log("🔧 Environment Setup Wizard")
  console.log("")

  const env = process.argv[2] || "development"
  const envFile = `.env.${env}`

  // Check if env file already exists
  if (fs.existsSync(envFile)) {
    const answer = await question(`⚠️ ${envFile} already exists. Overwrite? (y/n): `)
    if (answer.toLowerCase() !== "y") {
      console.log("❌ Setup cancelled")
      process.exit(0)
    }
  }

  console.log(`📝 Creating ${envFile}...`)
  console.log("")

  const config: Record<string, string> = {}

  // Database
  config.DATABASE_URL = await question("DATABASE_URL (postgresql://...): ")

  // Auth
  console.log("")
  console.log("🔐 Auth Configuration:")
  config.NEXTAUTH_SECRET = await question("NEXTAUTH_SECRET (generate with: node -e 'console.log(require(\"crypto\").randomBytes(32).toString(\"hex\"))'): ")
  config.NEXTAUTH_URL = await question("NEXTAUTH_URL (http://localhost:3000): ") || "http://localhost:3000"

  // App
  console.log("")
  console.log("📱 App Configuration:")
  config.NEXT_PUBLIC_SITE_URL = await question("NEXT_PUBLIC_SITE_URL: ") || config.NEXTAUTH_URL

  // Optional: Analytics
  console.log("")
  console.log("📊 Analytics (Optional):")
  const enableAnalytics = await question("Enable analytics? (y/n): ")
  if (enableAnalytics.toLowerCase() === "y") {
    config.NEXT_PUBLIC_GA_MEASUREMENT_ID = await question("GA_MEASUREMENT_ID (G-XXXXXXXXXX): ")
    config.NEXT_PUBLIC_ENABLE_ANALYTICS = "true"
  } else {
    config.NEXT_PUBLIC_ENABLE_ANALYTICS = "false"
  }

  // Email (Production only)
  if (env === "production") {
    console.log("")
    console.log("📧 Email Configuration (Required for production):")
    config.SMTP_HOST = await question("SMTP_HOST: ")
    config.SMTP_PORT = await question("SMTP_PORT (587): ") || "587"
    config.SMTP_USER = await question("SMTP_USER: ")
    config.SMTP_PASS = await question("SMTP_PASS: ")
    config.EMAIL_FROM = await question("EMAIL_FROM: ")
  }

  // Write the file
  const content = Object.entries(config)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `${key}="${value}"`)
    .join("\n")

  fs.writeFileSync(envFile, content + "\n")
  console.log("")
  console.log(`✅ ${envFile} created successfully!`)

  rl.close()
}

setupEnvironment().catch(console.error)
