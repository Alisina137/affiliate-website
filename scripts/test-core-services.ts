// scripts/test-core-services.ts
import "dotenv/config"
import { nicheService, categoryService, brandService } from "@/services"

async function testServices() {
  console.log("🔍 Testing Core Services...\n")

  try {
    // Test creating a niche
    console.log("📝 Creating test niche...")
    const niche = await nicheService.create({
      name: "Test Niche",
      slug: "test-niche",
      description: "A test niche for development",
    })
    console.log(`✅ Niche created: ${niche.name} (${niche.id})\n`)

    // Test creating a category
    console.log("📝 Creating test category...")
    const category = await categoryService.create({
      name: "Test Category",
      slug: "test-category",
      nicheId: niche.id,
      description: "A test category",
    })
    console.log(`✅ Category created: ${category.name} (${category.id})\n`)

    // Test creating a brand
    console.log("📝 Creating test brand...")
    const brand = await brandService.create({
      name: "Test Brand",
      slug: "test-brand",
      description: "A test brand",
      nicheId: niche.id,
    })
    console.log(`✅ Brand created: ${brand.name} (${brand.id})\n`)

    // Test getting all niches
    console.log("📋 Getting all niches...")
    const niches = await nicheService.getAll()
    console.log(`✅ Found ${niches.length} niches\n`)

    console.log("🎉 All core services test passed!")
  } catch (error) {
    console.error("❌ Error testing services:", error)
  }
}

testServices()
