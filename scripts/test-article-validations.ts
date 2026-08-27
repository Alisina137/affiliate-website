// scripts/test-article-validations.ts
import "dotenv/config"
import {
  createReviewSchema,
  createComparisonSchema,
  createBestOfSchema,
  createGuideSchema,
  createStatisticSchema,
} from "@/lib/validations"

function testArticleValidations() {
  console.log("🔍 Testing Article Validations...\n")

  // Test valid review
  try {
    const validReview = createReviewSchema.parse({
      title: "Amazing Product Review",
      slug: "amazing-product-review",
      productId: "cmtbew3fi0000l8uy84qeur0w",
      authorId: "cmtbew3fi0000l8uy84qeur0w",
      rating: 4.5,
      pros: ["Great quality", "Excellent battery life"],
      cons: ["Expensive"],
      verdict: "Highly recommended",
    })
    console.log("✅ Valid review passed:", validReview.title)
  } catch (error) {
    console.error("❌ Valid review failed:", error)
  }

  // Test valid comparison
  try {
    const validComparison = createComparisonSchema.parse({
      title: "Product A vs Product B",
      slug: "product-a-vs-product-b",
      authorId: "cmtbew3fi0000l8uy84qeur0w",
      products: [
        { productId: "cmtbew3fi0000l8uy84qeur0w" },
        { productId: "cmtbew3fi0000l8uy84qeur0w" },
      ],
    })
    console.log("✅ Valid comparison passed:", validComparison.title)
  } catch (error) {
    console.error("❌ Valid comparison failed:", error)
  }

  // Test valid best-of
  try {
    const validBestOf = createBestOfSchema.parse({
      title: "Best Products of 2026",
      slug: "best-products-2026",
      authorId: "cmtbew3fi0000l8uy84qeur0w",
      entries: [
        { productId: "cmtbew3fi0000l8uy84qeur0w" },
        { productId: "cmtbew3fi0000l8uy84qeur0w" },
        { productId: "cmtbew3fi0000l8uy84qeur0w" },
      ],
    })
    console.log("✅ Valid best-of passed:", validBestOf.title)
  } catch (error) {
    console.error("❌ Valid best-of failed:", error)
  }

  // Test valid guide
  try {
    const validGuide = createGuideSchema.parse({
      title: "How to Choose a Product",
      slug: "how-to-choose-a-product",
      authorId: "cmtbew3fi0000l8uy84qeur0w",
      introduction: "This guide will help you choose the best product",
      guideProducts: [{ productId: "cmtbew3fi0000l8uy84qeur0w" }],
    })
    console.log("✅ Valid guide passed:", validGuide.title)
  } catch (error) {
    console.error("❌ Valid guide failed:", error)
  }

  // Test valid statistic
  try {
    const validStatistic = createStatisticSchema.parse({
      title: "Industry Statistics 2026",
      slug: "industry-statistics-2026",
      authorId: "cmtbew3fi0000l8uy84qeur0w",
      data: { marketSize: "$100B", growth: "15%" },
      sources: ["https://example.com/source"],
    })
    console.log("✅ Valid statistic passed:", validStatistic.title)
  } catch (error) {
    console.error("❌ Valid statistic failed:", error)
  }

  console.log("\n🎉 Article validation tests complete!")
}

testArticleValidations()
