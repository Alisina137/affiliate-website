// src/services/internal-linking.service.ts
import { db } from "@/lib/db";

export interface LinkSuggestion {
  id: string;
  title: string;
  slug: string;
  type:
    | "product"
    | "review"
    | "comparison"
    | "guide"
    | "article"
    | "category"
    | "brand";
  url: string;
  relevance: number;
  reason: string;
}

export const internalLinkingService = {
  // Get related content for a product
  async getRelatedForProduct(
    productId: string,
    limit: number = 5,
  ): Promise<LinkSuggestion[]> {
    const product = await db.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        brand: true,
        niche: true,
      },
    });

    if (!product) return [];

    const suggestions: LinkSuggestion[] = [];

    // 1. Reviews of this product
    const reviews = await db.review.findMany({
      where: {
        productId: product.id,
        status: "PUBLISHED",
      },
      take: 2,
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    reviews.forEach((review) => {
      suggestions.push({
        id: review.id,
        title: review.title,
        slug: review.slug,
        type: "review",
        url: `/reviews/${review.slug}`,
        relevance: 1.0,
        reason: "Review of this product",
      });
    });

    // 2. Comparisons including this product
    const comparisons = await db.comparison.findMany({
      where: {
        products: {
          some: { productId: product.id },
        },
        status: "PUBLISHED",
      },
      take: 2,
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    comparisons.forEach((comparison) => {
      suggestions.push({
        id: comparison.id,
        title: comparison.title,
        slug: comparison.slug,
        type: "comparison",
        url: `/comparisons/${comparison.slug}`,
        relevance: 0.9,
        reason: "Comparison including this product",
      });
    });

    // 3. Best Of lists including this product
    const bestOfEntries = await db.bestOfEntry.findMany({
      where: {
        productId: product.id,
        bestOf: { status: "PUBLISHED" },
      },
      take: 2,
      include: {
        bestOf: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    bestOfEntries.forEach((entry) => {
      suggestions.push({
        id: entry.bestOf.id,
        title: entry.bestOf.title,
        slug: entry.bestOf.slug,
        type: "article",
        url: `/best/${entry.bestOf.slug}`,
        relevance: 0.8,
        reason: "Featured in this best-of list",
      });
    });

    // 4. Products from same category
    if (product.categoryId) {
      const relatedProducts = await db.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
          isActive: true,
        },
        take: 3,
        select: {
          id: true,
          name: true,
          slug: true,
        },
      });

      relatedProducts.forEach((p) => {
        suggestions.push({
          id: p.id,
          title: p.name,
          slug: p.slug,
          type: "product",
          url: `/products/${p.slug}`,
          relevance: 0.7,
          reason: "Same category",
        });
      });
    }

    // 5. Products from same brand
    if (product.brandId) {
      const brandProducts = await db.product.findMany({
        where: {
          brandId: product.brandId,
          id: { not: product.id },
          isActive: true,
        },
        take: 2,
        select: {
          id: true,
          name: true,
          slug: true,
        },
      });

      brandProducts.forEach((p) => {
        suggestions.push({
          id: p.id,
          title: p.name,
          slug: p.slug,
          type: "product",
          url: `/products/${p.slug}`,
          relevance: 0.6,
          reason: "Same brand",
        });
      });
    }

    // Sort by relevance and remove duplicates
    const seen = new Set();
    const unique = suggestions.filter((s) => {
      const key = s.url;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return unique.sort((a, b) => b.relevance - a.relevance).slice(0, limit);
  },

  // Get related content for an article/review
  async getRelatedForContent(
    contentId: string,
    _contentType: string, // Prefixed with underscore to indicate unused
    keywords: string[] = [],
    limit: number = 5,
  ): Promise<LinkSuggestion[]> {
    const suggestions: LinkSuggestion[] = [];

    // Search for products matching keywords
    if (keywords.length > 0) {
      const productMatches = await db.product.findMany({
        where: {
          isActive: true,
          OR: keywords.map((keyword) => ({
            OR: [
              { name: { contains: keyword, mode: "insensitive" } },
              { description: { contains: keyword, mode: "insensitive" } },
            ],
          })),
        },
        take: 3,
        select: {
          id: true,
          name: true,
          slug: true,
        },
      });

      productMatches.forEach((product) => {
        suggestions.push({
          id: product.id,
          title: product.name,
          slug: product.slug,
          type: "product",
          url: `/products/${product.slug}`,
          relevance: 0.8,
          reason: "Related to content keywords",
        });
      });
    }

    // Get related reviews
    const reviews = await db.review.findMany({
      where: {
        status: "PUBLISHED",
        id: { not: contentId },
      },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    reviews.forEach((review) => {
      suggestions.push({
        id: review.id,
        title: review.title,
        slug: review.slug,
        type: "review",
        url: `/reviews/${review.slug}`,
        relevance: 0.6,
        reason: "Related review",
      });
    });

    // Get guides
    const guides = await db.guide.findMany({
      where: {
        status: "PUBLISHED",
        id: { not: contentId },
      },
      take: 2,
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    guides.forEach((guide) => {
      suggestions.push({
        id: guide.id,
        title: guide.title,
        slug: guide.slug,
        type: "guide",
        url: `/guides/${guide.slug}`,
        relevance: 0.5,
        reason: "Related guide",
      });
    });

    // Remove duplicates and sort
    const seen = new Set();
    const unique = suggestions.filter((s) => {
      const key = s.url;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return unique.sort((a, b) => b.relevance - a.relevance).slice(0, limit);
  },

  // Get internal linking opportunities
  async getLinkingOpportunities(limit: number = 10) {
    // Find products without affiliate links
    const productsWithoutLinks = await db.product.findMany({
      where: {
        isActive: true,
        affiliateLinks: { none: {} },
      },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    // Find products with low review count
    const productsWithLowReviews = await db.product.findMany({
      where: {
        isActive: true,
        reviewCount: 0,
      },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    // Find categories with no products
    const emptyCategories = await db.category.findMany({
      where: {
        isActive: true,
        products: { none: {} },
      },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return {
      productsWithoutLinks,
      productsWithLowReviews,
      emptyCategories,
    };
  },
};
