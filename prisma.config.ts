import { defineConfig } from "prisma/config"
import { config } from "dotenv"

config({ path: ".env.local" })
config()

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required. Add it to .env.local or .env.")
}

export default defineConfig({
  datasource: {
    url: databaseUrl,
  },
})
