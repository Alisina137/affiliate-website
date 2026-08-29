// src/lib/validation/schemas.ts
import { z } from "zod"

// Common validation patterns
export const idSchema = z.string().cuid()
export const emailSchema = z.string().email("Please enter a valid email address")
export const urlSchema = z.string().url("Please enter a valid URL")
export const slugSchema = z.string()
  .min(2, "Slug must be at least 2 characters")
  .max(100, "Slug must be at most 100 characters")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only")

// User schemas
export const userRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: emailSchema,
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number"),
  acceptTerms: z.boolean().refine((val) => val === true, "You must accept the terms"),
})

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
})

// Product schemas
export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: slugSchema,
  description: z.string().max(5000, "Description must be at most 5000 characters").optional(),
  shortDescription: z.string().max(500, "Short description must be at most 500 characters").optional(),
  price: z.number().positive("Price must be greater than 0").optional(),
  currency: z.string().length(3, "Currency must be a 3-letter code").default("USD"),
  brandId: idSchema.optional(),
  categoryId: idSchema.optional(),
  nicheId: idSchema.optional(),
  availability: z.enum(["IN_STOCK", "OUT_OF_STOCK", "PRE_ORDER", "DISCONTINUED"]).default("IN_STOCK"),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  bestFor: z.string().max(200, "Best for must be at most 200 characters").optional(),
})

// Review schemas
export const reviewSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  slug: slugSchema,
  content: z.string().max(10000, "Content must be at most 10000 characters").optional(),
  excerpt: z.string().max(500, "Excerpt must be at most 500 characters").optional(),
  rating: z.number().min(0).max(5, "Rating must be between 0 and 5").optional(),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  verdict: z.string().max(1000, "Verdict must be at most 1000 characters").optional(),
  bestFor: z.string().max(200, "Best for must be at most 200 characters").optional(),
  featured: z.boolean().default(false),
  productId: idSchema,
  authorId: idSchema,
})

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: emailSchema,
  subject: z.string().min(2, "Subject is required").max(100),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
})

// Newsletter schema
export const newsletterSchema = z.object({
  email: emailSchema,
  name: z.string().max(50).optional(),
})

// API request schemas
export const apiKeySchema = z.object({
  key: z.string().min(32).max(64),
})

// Search schema
export const searchSchema = z.object({
  query: z.string().min(2, "Search query must be at least 2 characters").max(100),
  type: z.enum(["all", "product", "review", "comparison", "guide", "brand", "category"]).default("all"),
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
})
