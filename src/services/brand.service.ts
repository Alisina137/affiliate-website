// src/services/brand.service.ts
import { db } from "@/lib/db"
import type { Brand } from "@prisma/client"

export const brandService = {
  // Get all brands
  async getAll(): Promise<Brand[]> {
    return db.brand.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    })
  },

  // Get brands by niche
  async getByNiche(nicheSlug: string): Promise<Brand[]> {
    return db.brand.findMany({
      where: {
        niche: { slug: nicheSlug },
        isActive: true,
      },
      orderBy: { name: "asc" },
    })
  },

  // Get a brand by slug
  async getBySlug(slug: string): Promise<Brand | null> {
    return db.brand.findUnique({
      where: { slug },
      include: {
        niche: true,
        products: {
          where: { isActive: true },
        },
        categories: {
          where: { isActive: true },
        },
      },
    })
  },

  // Get a brand by ID
  async getById(id: string): Promise<Brand | null> {
    return db.brand.findUnique({
      where: { id },
    })
  },

  // Create a new brand
  async create(data: {
    name: string
    slug: string
    description?: string
    logo?: string
    website?: string
    foundedYear?: number
    headquarters?: string
    nicheId?: string
  }): Promise<Brand> {
    return db.brand.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        logo: data.logo,
        website: data.website,
        foundedYear: data.foundedYear,
        headquarters: data.headquarters,
        nicheId: data.nicheId,
      },
    })
  },

  // Update a brand
  async update(id: string, data: Partial<Pick<Brand, "name" | "slug" | "description" | "logo" | "website" | "foundedYear" | "headquarters" | "isActive" | "nicheId">>): Promise<Brand> {
    return db.brand.update({
      where: { id },
      data,
    })
  },

  // Delete a brand (soft delete)
  async delete(id: string): Promise<Brand> {
    return db.brand.update({
      where: { id },
      data: { isActive: false },
    })
  },
}
