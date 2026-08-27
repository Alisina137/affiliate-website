// scripts/test-ai-validations.ts
import "dotenv/config"
import {
  createAIGenerationSchema,
  createAIPromptTemplateSchema,
  createAIUsageSchema,
} from "@/lib/validations"

function testAIValidations() {
  console.log("🔍 Testing AI Validations...\n")

  // Test valid AI generation
  try {
    const validGeneration = createAIGenerationSchema.parse({
      userId: "cmtbew3fi0000l8uy84qeur0w",
      contentType: "REVIEW",
      operation: "GENERATE",
      model: "gpt-4",
      input: { topic: "Product Review" },
      status: "PENDING",
    })
    console.log("✅ Valid AI generation passed:", validGeneration.contentType)
  } catch (error) {
    console.error("❌ Valid AI generation failed:", error)
  }

  // Test invalid AI generation (should fail)
  try {
    const invalidGeneration = createAIGenerationSchema.parse({
      userId: "invalid-cuid",
      contentType: "INVALID_TYPE",
      operation: "GENERATE",
      model: "",
    })
    console.log("❌ Invalid AI generation should have failed!")
  } catch (error) {
    console.log("✅ Invalid AI generation correctly failed validation")
  }

  // Test valid prompt template
  try {
    const validPrompt = createAIPromptTemplateSchema.parse({
      name: "Review Generation Prompt",
      slug: "review-generation-prompt",
      contentType: "REVIEW",
      operation: "GENERATE",
      userPrompt: "Write a detailed review of this product",
      description: "Default prompt for generating product reviews",
      createdBy: "cmtbew3fi0000l8uy84qeur0w",
    })
    console.log("✅ Valid prompt template passed:", validPrompt.name)
  } catch (error) {
    console.error("❌ Valid prompt template failed:", error)
  }

  // Test valid AI usage
  try {
    const validUsage = createAIUsageSchema.parse({
      userId: "cmtbew3fi0000l8uy84qeur0w",
      contentType: "REVIEW",
      operation: "GENERATE",
      model: "gpt-4",
      inputTokens: 100,
      outputTokens: 200,
      cost: 0.005,
      duration: 3000,
    })
    console.log("✅ Valid AI usage passed:", validUsage.model)
  } catch (error) {
    console.error("❌ Valid AI usage failed:", error)
  }

  console.log("\n🎉 AI validation tests complete!")
}

testAIValidations()
