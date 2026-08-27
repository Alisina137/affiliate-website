// src/services/category.service.ts
import { db } from "@/lib/db"
import type { Category } from "@prisma/client"

export const categoryService = {
  // Get all categories for a niche
  async getByNiche(nicheSlug: string): Promise<Category[]> {
    return db.category.findMany({
      where: {
        niche: { slug: nicheSlug },
        isActive: true,
      },
      orderBy: { order: "asc" },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    })
  },

  // Get root categories (no parent) for a niche
  async getRootCategories(nicheId: string): Promise<Category[]> {
    return db.category.findMany({
      where: {
        nicheId,
        parentId: null,
        isActive: true,
      },
      orderBy: { order: "asc" },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    })
  },

  // Get a category by slug
  async getBySlug(slug: string): Promise<Category | null> {
    return db.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
        niche: true,
        products: {
          where: { isActive: true },
        },
        brands: {
          where: { isActive: true },
        },
      },
    })
  },

  // Get a category by ID
  async getById(id: string): Promise<Category | null> {
    return db.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        niche: true,
      },
    })
  },

  // Create a new category
  async create(data: {
    name: string
    slug: string
    nicheId: string
    description?: string
    image?: string
    parentId?: string
    order?: number
  }): Promise<Category> {
    return db.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        nicheId: data.nicheId,
        description: data.description,
        image: data.image,
        parentId: data.parentId,
        order: data.order || 0,
      },
    })
  },

  // Update a category
  async update(id: string, data: Partial<Pick<Category, "name" | "slug" | "description" | "image" | "order" | "isActive" | "parentId">>): Promise<Category> {
    return db.category.update({
      where: { id },
      data,
    })
  },

  // Delete a category (soft delete)
  async delete(id: string): Promise<Category> {
    return db.category.update({
      where: { id },
      data: { isActive: false },
    })
  },
}
