// prisma/seed-niches-categories.ts
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding niches and categories...")

  // Create Niches
  const niches = [
    { name: "Electronics", slug: "electronics", description: "All things electronic" },
    { name: "Fashion", slug: "fashion", description: "Clothing and accessories" },
    { name: "Home & Garden", slug: "home-garden", description: "Home improvement and gardening" },
    { name: "Sports & Outdoors", slug: "sports-outdoors", description: "Sports equipment and outdoor gear" },
    { name: "Health & Beauty", slug: "health-beauty", description: "Health products and beauty supplies" },
    { name: "Automotive", slug: "automotive", description: "Cars, parts, and accessories" },
  ]

  for (const niche of niches) {
    await prisma.niche.upsert({
      where: { slug: niche.slug },
      update: {},
      create: niche,
    })
    console.log(`✅ Created niche: ${niche.name}`)
  }

  console.log("🎉 Seeding complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
