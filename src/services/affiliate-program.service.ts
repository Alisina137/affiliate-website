// src/services/affiliate-program.service.ts
import { db } from "@/lib/db"
import type { Prisma } from "@prisma/client"

type ProgramCreateInput = {
  name: string
  slug: string
  description?: string
  logo?: string
  website?: string
  commission?: string
  cookieDuration?: number
}

type ProgramUpdateInput = Partial<ProgramCreateInput>

type MerchantCreateInput = {
  name: string
  slug: string
  programId: string
  description?: string
  logo?: string
  website?: string
}

type MerchantUpdateInput = Partial<MerchantCreateInput>

export const affiliateProgramService = {
  // ============================================
  // PROGRAM CRUD
  // ============================================

  // Get all programs
  async getAllPrograms(params?: {
    isActive?: boolean
    search?: string
    limit?: number
    offset?: number
  }) {
    const {
      isActive = true,
      search,
      limit = 20,
      offset = 0,
    } = params || {}

    const where: Prisma.AffiliateProgramWhereInput = { isActive }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const [data, total] = await Promise.all([
      db.affiliateProgram.findMany({
        where,
        include: {
          merchants: {
            where: { isActive: true },
          },
        },
        orderBy: { name: "asc" },
        skip: offset,
        take: limit,
      }),
      db.affiliateProgram.count({ where }),
    ])

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // Get a program by slug
  async getProgramBySlug(slug: string) {
    return db.affiliateProgram.findUnique({
      where: { slug },
      include: {
        merchants: {
          where: { isActive: true },
        },
      },
    })
  },

  // Get a program by ID
  async getProgramById(id: string) {
    return db.affiliateProgram.findUnique({
      where: { id },
      include: {
        merchants: {
          where: { isActive: true },
        },
      },
    })
  },

  // Create a program
  async createProgram(data: ProgramCreateInput) {
    return db.affiliateProgram.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        logo: data.logo,
        website: data.website,
        commission: data.commission,
        cookieDuration: data.cookieDuration,
      },
    })
  },

  // Update a program
  async updateProgram(id: string, data: ProgramUpdateInput) {
    return db.affiliateProgram.update({
      where: { id },
      data,
    })
  },

  // Delete a program (soft delete)
  async deleteProgram(id: string) {
    return db.affiliateProgram.update({
      where: { id },
      data: { isActive: false },
    })
  },

  // ============================================
  // MERCHANT CRUD
  // ============================================

  // Get all merchants for a program
  async getMerchantsByProgram(programId: string) {
    return db.affiliateMerchant.findMany({
      where: {
        programId,
        isActive: true,
      },
      orderBy: { name: "asc" },
      include: {
        program: true,
      },
    })
  },

  // Get a merchant by slug
  async getMerchantBySlug(slug: string) {
    return db.affiliateMerchant.findUnique({
      where: { slug },
      include: {
        program: true,
      },
    })
  },

  // Get a merchant by ID
  async getMerchantById(id: string) {
    return db.affiliateMerchant.findUnique({
      where: { id },
      include: {
        program: true,
      },
    })
  },

  // Create a merchant
  async createMerchant(data: MerchantCreateInput) {
    return db.affiliateMerchant.create({
      data: {
        name: data.name,
        slug: data.slug,
        programId: data.programId,
        description: data.description,
        logo: data.logo,
        website: data.website,
      },
    })
  },

  // Update a merchant
  async updateMerchant(id: string, data: MerchantUpdateInput) {
    return db.affiliateMerchant.update({
      where: { id },
      data,
    })
  },

  // Delete a merchant (soft delete)
  async deleteMerchant(id: string) {
    return db.affiliateMerchant.update({
      where: { id },
      data: { isActive: false },
    })
  },

  // Get all merchants (across all programs)
  async getAllMerchants(params?: {
    isActive?: boolean
    search?: string
    limit?: number
    offset?: number
  }) {
    const {
      isActive = true,
      search,
      limit = 20,
      offset = 0,
    } = params || {}

    const where: Prisma.AffiliateMerchantWhereInput = { isActive }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const [data, total] = await Promise.all([
      db.affiliateMerchant.findMany({
        where,
        include: {
          program: true,
        },
        orderBy: { name: "asc" },
        skip: offset,
        take: limit,
      }),
      db.affiliateMerchant.count({ where }),
    ])

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },
}
