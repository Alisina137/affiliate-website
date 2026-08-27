// scripts/test-validations.ts
import "dotenv/config"
import { createNicheSchema, createCategorySchema, createBrandSchema } from "@/lib/validations"

function testValidations() {
  console.log("🔍 Testing Validations...\n")

  // Test valid niche
  try {
    const validNiche = createNicheSchema.parse({
      name: "Test Niche",
      slug: "test-niche",
      description: "A test niche",
    })
    console.log("✅ Valid niche passed:", validNiche.name)
  } catch (error) {
    console.error("❌ Valid niche failed:", error)
  }

  // Test invalid niche (should fail)
  try {
    const invalidNiche = createNicheSchema.parse({
      name: "A", // Too short
      slug: "Test Niche", // Invalid slug (uppercase + space)
    })
    console.log("❌ Invalid niche should have failed!")
  } catch (error) {
    console.log("✅ Invalid niche correctly failed validation")
  }

  // Test valid category
  try {
    const validCategory = createCategorySchema.parse({
      name: "Test Category",
      slug: "test-category",
      nicheId: "cmtbd8nji0000rou...", // This is a cuid format example
      description: "A test category",
    })
    console.log("✅ Valid category passed:", validCategory.name)
  } catch (error) {
    console.error("❌ Valid category failed:", error)
  }

  // Test valid brand
  try {
    const validBrand = createBrandSchema.parse({
      name: "Test Brand",
      slug: "test-brand",
      description: "A test brand",
      website: "https://example.com",
      foundedYear: 2020,
    })
    console.log("✅ Valid brand passed:", validBrand.name)
  } catch (error) {
    console.error("❌ Valid brand failed:", error)
  }

  console.log("\n🎉 Validation tests complete!")
}

testValidations()
