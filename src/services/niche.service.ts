// src/services/niche.service.ts
import { db } from "@/lib/db"
import type { Niche } from "@prisma/client"

export const nicheService = {
  // Get all niches
  async getAll(): Promise<Niche[]> {
    return db.niche.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    })
  },

  // Get a niche by slug
  async getBySlug(slug: string): Promise<Niche | null> {
    return db.niche.findUnique({
      where: { slug },
      include: {
        categories: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
        brands: {
          where: { isActive: true },
          orderBy: { name: "asc" },
        },
      },
    })
  },

  // Get a niche by ID
  async getById(id: string): Promise<Niche | null> {
    return db.niche.findUnique({
      where: { id },
    })
  },

  // Create a new niche
  async create(data: { name: string; slug: string; description?: string; image?: string }): Promise<Niche> {
    return db.niche.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
      },
    })
  },

  // Update a niche
  async update(id: string, data: Partial<Pick<Niche, "name" | "slug" | "description" | "image" | "isActive">>): Promise<Niche> {
    return db.niche.update({
      where: { id },
      data,
    })
  },

  // Delete a niche (soft delete)
  async delete(id: string): Promise<Niche> {
    return db.niche.update({
      where: { id },
      data: { isActive: false },
    })
  },
}
