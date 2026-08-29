// test/db.ts
import { PrismaClient } from "@prisma/client"

// Use a separate test database
// The URL is automatically used from DATABASE_URL environment variable
export const testDb = new PrismaClient()

export async function cleanDatabase() {
  const tables = [
    "analytics_events",
    "affiliate_links",
    "reviews",
    "comparisons",
    "best_of",
    "guides",
    "statistics",
    "articles",
    "products",
    "brands",
    "categories",
    "niches",
    "subscribers",
    "users",
  ]

  for (const table of tables) {
    try {
      await testDb.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`)
    } catch {
      // Table might not exist - ignore
    }
  }
}

export async function closeTestDb() {
  await testDb.$disconnect()
}
