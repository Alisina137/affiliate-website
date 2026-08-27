// scripts/test-affiliate-validations.ts
import "dotenv/config"
import {
  createAffiliateLinkSchema,
  createAffiliateProgramSchema,
  createAffiliateMerchantSchema,
} from "@/lib/validations"

function testAffiliateValidations() {
  console.log("🔍 Testing Affiliate Validations...\n")

  // Test valid affiliate link
  try {
    const validLink = createAffiliateLinkSchema.parse({
      url: "https://example.com/product",
      productId: "cmtbew3fi0000l8uy84qeur0w",
      merchant: "Amazon",
      label: "Buy Now",
      country: "US",
      priority: 1,
    })
    console.log("✅ Valid affiliate link passed:", validLink.merchant)
  } catch (error) {
    console.error("❌ Valid affiliate link failed:", error)
  }

  // Test invalid affiliate link (should fail)
  try {
    const invalidLink = createAffiliateLinkSchema.parse({
      url: "not-a-url", // Invalid URL
      productId: "not-a-cuid", // Invalid CUID
      merchant: "", // Empty merchant
      country: "USA", // Too long
    })
    console.log("❌ Invalid affiliate link should have failed!")
  } catch (error) {
    console.log("✅ Invalid affiliate link correctly failed validation")
  }

  // Test valid program
  try {
    const validProgram = createAffiliateProgramSchema.parse({
      name: "Amazon Associates",
      slug: "amazon-associates",
      description: "Amazon affiliate program",
      website: "https://affiliate.amazon.com",
      commission: "Up to 10%",
      cookieDuration: 24,
    })
    console.log("✅ Valid program passed:", validProgram.name)
  } catch (error) {
    console.error("❌ Valid program failed:", error)
  }

  // Test valid merchant
  try {
    const validMerchant = createAffiliateMerchantSchema.parse({
      name: "Amazon US",
      slug: "amazon-us",
      programId: "cmtbew3fi0000l8uy84qeur0w",
      description: "Amazon US store",
      website: "https://amazon.com",
    })
    console.log("✅ Valid merchant passed:", validMerchant.name)
  } catch (error) {
    console.error("❌ Valid merchant failed:", error)
  }

  console.log("\n🎉 Affiliate validation tests complete!")
}

testAffiliateValidations()
