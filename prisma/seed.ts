// prisma/seed.ts
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding products...")

  const products = [
    {
      name: "Premium Wireless Headphones",
      slug: "premium-wireless-headphones",
      description: "High-quality wireless headphones with noise cancellation.",
      shortDescription: "Best wireless headphones for music lovers.",
      price: 299.99,
      currency: "USD",
      rating: 4.8,
      reviewCount: 156,
      isActive: true,
    },
    {
      name: "Ultra-Slim Laptop Pro",
      slug: "ultra-slim-laptop-pro",
      description: "Powerful laptop with ultra-slim design for professionals.",
      shortDescription: "The perfect laptop for work and play.",
      price: 1299.99,
      currency: "USD",
      rating: 4.6,
      reviewCount: 89,
      isActive: true,
    },
    {
      name: "Smart Fitness Watch",
      slug: "smart-fitness-watch",
      description: "Track your fitness and health with this smart watch.",
      shortDescription: "Your ultimate fitness companion.",
      price: 249.99,
      currency: "USD",
      rating: 4.4,
      reviewCount: 234,
      isActive: true,
    },
    {
      name: "4K Action Camera",
      slug: "4k-action-camera",
      description: "Capture stunning 4K videos with this action camera.",
      shortDescription: "Perfect for adventure enthusiasts.",
      price: 399.99,
      currency: "USD",
      rating: 4.7,
      reviewCount: 102,
      isActive: true,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
    console.log(`✅ Created product: ${product.name}`)
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
