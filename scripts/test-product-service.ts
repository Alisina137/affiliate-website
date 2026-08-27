// scripts/test-product-service.ts
import "dotenv/config"
import { productService, affiliateService } from "@/services"

async function testProductService() {
  console.log("🔍 Testing Product Services...\n")

  try {
    // Clean up any existing test product
    console.log("🧹 Cleaning up existing test products...")
    const existing = await productService.search("test-product")
    for (const p of existing) {
      await productService.delete(p.id)
      console.log(`  Deleted: ${p.name}`)
    }

    // Create a test product
    console.log("📝 Creating test product...")
    const product = await productService.create({
      name: "Test Product",
      slug: "test-product",
      description: "A test product for development",
      shortDescription: "Test product short description",
      price: 999.99,
      currency: "USD",
      bestFor: "Developers",
      availability: "IN_STOCK",
    })
    console.log(`✅ Product created: ${product.name} (${product.id})\n`)

    // Get product by slug
    console.log("📋 Getting product by slug...")
    const foundProduct = await productService.getBySlug("test-product")
    console.log(`✅ Found product: ${foundProduct?.name}\n`)

    // Test search
    console.log("🔍 Searching for 'test'...")
    const results = await productService.search("test")
    console.log(`✅ Found ${results.length} products\n`)

    // Test affiliate link
    console.log("🔗 Creating affiliate link...")
    const affiliate = await affiliateService.create({
      url: "https://example.com/test-product",
      productId: product.id,
      merchant: "Test Merchant",
      label: "Buy Now",
    })
    console.log(`✅ Affiliate link created: ${affiliate.label}\n`)

    // Test getting affiliate links
    console.log("📋 Getting affiliate links for product...")
    const links = await affiliateService.getByProduct(product.id)
    console.log(`✅ Found ${links.length} affiliate links\n`)

    console.log("🎉 All product service tests passed!")
  } catch (error) {
    console.error("❌ Error testing services:", error)
  }
}

testProductService()
