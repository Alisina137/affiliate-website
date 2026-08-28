// src/services/category.service.ts
import { db } from "@/lib/db"
import { productService } from "./product.service"

export const categoryService = {
  // Get all categories
  async getAll() {
    return db.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: {
        niche: true,
        children: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
        products: {
          where: { isActive: true },
          take: 6,
          include: {
            brand: true,
          },
        },
      },
    })
  },

  // Get a category by slug
  async getBySlug(slug: string) {
    return db.category.findUnique({
      where: { slug },
      include: {
        niche: true,
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
        products: {
          where: { isActive: true },
          include: {
            brand: true,
          },
        },
      },
    })
  },

  // Get products in a category with pagination and filters
  async getProducts(
    categoryId: string,
    params?: {
      brandId?: string
      minPrice?: number
      maxPrice?: number
      sortBy?: string
      sortOrder?: "asc" | "desc"
      limit?: number
      offset?: number
    }
  ) {
    const {
      brandId,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "desc",
      limit = 12,
      offset = 0,
    } = params || {}

    return productService.getAll({
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      limit,
      offset,
      isActive: true,
    })
  },

  // Get brands in a category
  async getBrands(categoryId: string) {
    const products = await db.product.findMany({
      where: {
        categoryId,
        isActive: true,
        brandId: { not: null },
      },
      distinct: ["brandId"],
      include: {
        brand: true,
      },
    })

    return products
      .map((p) => p.brand)
      .filter((brand) => brand !== null)
  },
}
