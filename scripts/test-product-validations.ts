// scripts/test-product-validations.ts
import "dotenv/config"
import { createProductSchema, createAffiliateLinkSchema } from "@/lib/validations"

function testProductValidations() {
  console.log("🔍 Testing Product Validations...\n")

  // Test valid product
  try {
    const validProduct = createProductSchema.parse({
      name: "Test Product",
      slug: "test-product",
      description: "A test product",
      shortDescription: "Test product",
      price: 999.99,
      currency: "USD",
      bestFor: "Developers",
      availability: "IN_STOCK",
    })
    console.log("✅ Valid product passed:", validProduct.name)
  } catch (error) {
    console.error("❌ Valid product failed:", error)
  }

  // Test invalid product (should fail)
  try {
    const invalidProduct = createProductSchema.parse({
      name: "A", // Too short
      slug: "Test Product", // Invalid slug
      price: -10, // Negative price
    })
    console.log("❌ Invalid product should have failed!")
  } catch (error) {
    console.log("✅ Invalid product correctly failed validation")
  }

  // Test valid affiliate link
  try {
    const validAffiliate = createAffiliateLinkSchema.parse({
      url: "https://example.com/product",
      productId: "cmtbew3fi0000l8uy84qeur0w",
      merchant: "Test Merchant",
      label: "Buy Now",
      country: "US",
    })
    console.log("✅ Valid affiliate link passed:", validAffiliate.merchant)
  } catch (error) {
    console.error("❌ Valid affiliate link failed:", error)
  }

  // Test invalid affiliate link (should fail)
  try {
    const invalidAffiliate = createAffiliateLinkSchema.parse({
      url: "not-a-url", // Invalid URL
      productId: "not-a-cuid", // Invalid CUID
      merchant: "", // Empty merchant
    })
    console.log("❌ Invalid affiliate link should have failed!")
  } catch (error) {
    console.log("✅ Invalid affiliate link correctly failed validation")
  }

  console.log("\n🎉 Product validation tests complete!")
}

testProductValidations()
