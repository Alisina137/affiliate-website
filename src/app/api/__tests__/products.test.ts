// src/app/api/__tests__/products.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { testDb, cleanDatabase, closeTestDb } from "../../../../test/db"

describe("Products API", () => {
  let nicheId: string
  let categoryId: string
  let brandId: string

  beforeAll(async () => {
    await cleanDatabase()

    // Create test data
    const niche = await testDb.niche.create({
      data: {
        name: "Test Niche",
        slug: "test-niche",
        isActive: true,
      },
    })
    nicheId = niche.id

    const category = await testDb.category.create({
      data: {
        name: "Test Category",
        slug: "test-category",
        nicheId: niche.id,
        isActive: true,
      },
    })
    categoryId = category.id

    const brand = await testDb.brand.create({
      data: {
        name: "Test Brand",
        slug: "test-brand",
        isActive: true,
      },
    })
    brandId = brand.id
  })

  afterAll(async () => {
    await closeTestDb()
  })

  it("should create a product", async () => {
    const product = await testDb.product.create({
      data: {
        name: "Test Product",
        slug: "test-product",
        description: "Test description",
        price: 99.99,
        currency: "USD",
        categoryId: categoryId,
        brandId: brandId,
        nicheId: nicheId,
        isActive: true,
      },
    })

    expect(product).toBeDefined()
    expect(product.name).toBe("Test Product")
    expect(product.price).toBe(99.99)
  })

  it("should find product by slug", async () => {
    const product = await testDb.product.findUnique({
      where: { slug: "test-product" },
      include: {
        brand: true,
        category: true,
      },
    })

    expect(product).toBeDefined()
    expect(product?.name).toBe("Test Product")
    expect(product?.brand?.name).toBe("Test Brand")
    expect(product?.category?.name).toBe("Test Category")
  })

  it("should update product", async () => {
    const product = await testDb.product.update({
      where: { slug: "test-product" },
      data: {
        price: 149.99,
        featured: true,
      },
    })

    expect(product.price).toBe(149.99)
    expect(product.featured).toBe(true)
  })
})
