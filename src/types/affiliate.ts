// src/types/affiliate.ts

import type {
  AffiliateLink,
  AffiliateProgram,
  AffiliateMerchant,
  AffiliateClick,
  Product,
  User,
} from "@prisma/client";

// ============================================
// AFFILIATE LINK TYPES
// ============================================

export type AffiliateLinkWithRelations = AffiliateLink & {
  product?: Product | null;
  merchant?: AffiliateMerchantWithRelations | null;
};

export type AffiliateLinkWithProduct = AffiliateLink & {
  product: Product;
};

export interface AffiliateLinkListItem {
  id: string;
  url: string;
  label: string;
  merchant: string;
  merchantId: string | null;
  trackingUrl: string | null;
  country: string;
  priority: number;
  clicks: number;
  lastClicked: Date | null;
  isActive: boolean;

  product: {
    id: string;
    name: string;
    slug: string;
    price: number | null;
  };

  merchantDetails?: {
    id: string;
    name: string;
    slug: string;
    program?: {
      id: string;
      name: string;
      slug: string;
    };
  } | null;
}

// ============================================
// AFFILIATE PROGRAM TYPES
// ============================================

export type AffiliateProgramWithRelations = AffiliateProgram & {
  merchants: AffiliateMerchant[];
};

export interface AffiliateProgramListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  commission: string | null;
  cookieDuration: number | null;
  merchantCount: number;
  isActive: boolean;
}

// ============================================
// AFFILIATE MERCHANT TYPES
// ============================================

export type AffiliateMerchantWithRelations = AffiliateMerchant & {
  program: AffiliateProgram;
};

export interface AffiliateMerchantListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  website: string | null;

  program: {
    id: string;
    name: string;
    slug: string;
  };

  isActive: boolean;
}

// ============================================
// AFFILIATE CLICK TYPES
// ============================================

export type AffiliateClickWithRelations = AffiliateClick & {
  affiliateLink: AffiliateLink;
  product?: Product | null;
  user?: Pick<User, "id" | "name" | "email"> | null;
};

export interface AffiliateClickStats {
  totalClicks: number;
  convertedClicks: number;
  conversionRate: number;

  byCountry: {
    country: string;
    count: number;
  }[];

  byDevice: {
    device: string;
    count: number;
  }[];
}

export interface AffiliateDailyStats {
  date: string;
  clicks: number;
  conversions: number;
  value: number;
}

// ============================================
// AFFILIATE PERFORMANCE
// ============================================

export interface AffiliatePerformanceMetrics {
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  totalRevenue: number;
  averageOrderValue: number;

  topPerformingLinks: AffiliateLinkListItem[];

  topPerformingProducts: {
    productId: string;
    productName: string;
    clicks: number;
    conversions: number;
    revenue: number;
  }[];
}

// ============================================
// COUNTRY CODES
// ============================================

export const countryCodes = [
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "BR", name: "Brazil" },
  { code: "IN", name: "India" },
  { code: "CN", name: "China" },
] as const;

export type CountryCode = (typeof countryCodes)[number]["code"];
