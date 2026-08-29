// scripts/validate-env.ts
import "dotenv/config"
import { env } from "../src/lib/env"

console.log("✅ Environment variables validated successfully!")
console.log(`   NODE_ENV: ${env.NODE_ENV}`)
console.log(`   NEXTAUTH_URL: ${env.NEXTAUTH_URL}`)
console.log(`   Site URL: ${env.NEXT_PUBLIC_SITE_URL || "Not set"}`)
console.log(`   OpenAI API Key: ${env.OPENAI_API_KEY ? "✅ Set" : "❌ Not set"}`)
console.log(`   Anthropic API Key: ${env.ANTHROPIC_API_KEY ? "✅ Set" : "❌ Not set"}`)
console.log(`   GA Measurement ID: ${env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "Not set"}`)
