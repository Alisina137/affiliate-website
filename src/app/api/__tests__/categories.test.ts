// src/app/api/__tests__/categories.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { testDb, cleanDatabase, closeTestDb } from "../../../../test/db"

describe("Categories API", () => {
  beforeAll(async () => {
    await cleanDatabase()
  })

  afterAll(async () => {
    await closeTestDb()
  })

  it("should create a niche", async () => {
    const niche = await testDb.niche.create({
      data: {
        name: "Electronics",
        slug: "electronics",
        description: "Test niche",
        isActive: true,
      },
    })

    expect(niche).toBeDefined()
    expect(niche.name).toBe("Electronics")
    expect(niche.slug).toBe("electronics")
  })

  it("should create a category", async () => {
    const niche = await testDb.niche.findFirst({
      where: { slug: "electronics" },
    })

    const category = await testDb.category.create({
      data: {
        name: "Laptops",
        slug: "laptops",
        description: "Test category",
        nicheId: niche!.id,
        isActive: true,
      },
    })

    expect(category).toBeDefined()
    expect(category.name).toBe("Laptops")
    expect(category.nicheId).toBe(niche!.id)
  })

  it("should find categories", async () => {
    const categories = await testDb.category.findMany({
      where: { isActive: true },
    })

    expect(categories.length).toBeGreaterThan(0)
  })
})
