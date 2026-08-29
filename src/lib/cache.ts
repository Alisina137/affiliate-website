// src/lib/cache.ts
export const cacheConfig = {
  // Static assets (images, fonts, etc.)
  static: {
    "Cache-Control": "public, max-age=31536000, immutable",
  },
  // Pages with static content
  pages: {
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
  },
  // API responses
  api: {
    "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
  },
  // Admin pages (no cache)
  admin: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
  },
}

export function getCacheHeaders(type: keyof typeof cacheConfig) {
  return {
    headers: cacheConfig[type],
  }
}

export function revalidatePage(_path: string) {
  // This triggers a revalidation for the page
  // In Next.js App Router, you can use revalidatePath or revalidateTag
  return { revalidate: 3600 } // 1 hour
}
