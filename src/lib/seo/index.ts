// src/lib/seo/index.ts
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + "..."
}

export function generateMetaTitle(
  title: string,
  siteName: string = "Affiliate Platform"
): string {
  return `${title} | ${siteName}`
}

export function generateMetaDescription(
  description: string,
  maxLength: number = 160
): string {
  return truncateText(description, maxLength)
}

export function generateKeywords(
  primary: string,
  secondary: string[] = []
): string[] {
  const keywords = [primary]
  secondary.forEach((kw) => {
    if (!keywords.includes(kw)) {
      keywords.push(kw)
    }
  })
  return keywords
}

export const defaultSEO = {
  title: "Affiliate Platform - Find the Best Products",
  description: "Discover reviews, comparisons, and buying guides for products across all categories.",
  keywords: [
    "product reviews",
    "comparisons",
    "buying guides",
    "affiliate",
    "best products",
  ],
  siteName: "Affiliate Platform",
  twitterHandle: "@affiliateplatform",
}
