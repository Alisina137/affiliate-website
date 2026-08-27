// src/services/product.service.ts
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

// Type for product create input
type ProductCreateInput = {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  currency?: string;
  brandId?: string;
  categoryId?: string;
  nicheId?: string;
  specifications?: Prisma.InputJsonValue;
  features?: Prisma.InputJsonValue;
  images?: string[];
  bestFor?: string;
  availability?: string;
};

// Type for product update input
type ProductUpdateInput = Partial<{
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  currency: string;
  brandId: string;
  categoryId: string;
  nicheId: string;
  specifications: Prisma.InputJsonValue;
  features: Prisma.InputJsonValue;
  images: string[];
  bestFor: string;
  availability: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  isActive: boolean;
}>;

// Type for getAll params
type GetAllParams = {
  categoryId?: string;
  brandId?: string;
  nicheId?: string;
  search?: string;
  isActive?: boolean;
  featured?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export const productService = {
  // Get all products with optional filtering
  async getAll(params: GetAllParams = {}) {
    const {
      categoryId,
      brandId,
      nicheId,
      search,
      isActive = true,
      featured,
      limit = 20,
      offset = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const where: Prisma.ProductWhereInput = { isActive };

    if (categoryId) where.categoryId = categoryId;
    if (brandId) where.brandId = brandId;
    if (nicheId) where.nicheId = nicheId;
    if (featured !== undefined) where.featured = featured;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          brand: true,
          category: true,
          niche: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  // Get a product by slug
  async getBySlug(slug: string) {
    return db.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        category: true,
        niche: true,
        affiliateLinks: {
          where: { isActive: true },
          orderBy: { priority: "desc" },
        },
        reviews: {
          where: { status: "PUBLISHED" },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },

  // Get a product by ID
  async getById(id: string) {
    return db.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        niche: true,
        affiliateLinks: {
          where: { isActive: true },
          orderBy: { priority: "desc" },
        },
      },
    });
  },

  // Create a new product
  async create(data: ProductCreateInput) {
    return db.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        price: data.price,
        currency: data.currency || "USD",
        brandId: data.brandId,
        categoryId: data.categoryId,
        nicheId: data.nicheId,
        specifications: data.specifications,
        features: data.features,
        images: data.images || [],
        bestFor: data.bestFor,
        availability: data.availability || "IN_STOCK",
      },
    });
  },

  // Update a product
  async update(id: string, data: ProductUpdateInput) {
    return db.product.update({
      where: { id },
      data,
    });
  },

  // Delete a product (soft delete)
  async delete(id: string) {
    return db.product.update({
      where: { id },
      data: { isActive: false },
    });
  },

  // Get popular products
  async getPopular(limit: number = 10) {
    return db.product.findMany({
      where: { isActive: true },
      orderBy: { rating: "desc" },
      take: limit,
      include: {
        brand: true,
        category: true,
      },
    });
  },

  // Get featured products
  async getFeatured(limit: number = 6) {
    return db.product.findMany({
      where: { isActive: true, featured: true },
      orderBy: { rating: "desc" },
      take: limit,
      include: {
        brand: true,
        category: true,
      },
    });
  },

  // Search products
  async search(query: string, limit: number = 10) {
    if (!query || query.length < 2) {
      return [];
    }

    return db.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { shortDescription: { contains: query, mode: "insensitive" } },
          { brand: { name: { contains: query, mode: "insensitive" } } },
          { category: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: {
        brand: true,
        category: true,
      },
      take: limit,
    });
  },
};
