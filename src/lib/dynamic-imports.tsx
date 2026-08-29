// src/lib/dynamic-imports.ts
import dynamic from "next/dynamic";

// Dynamically import heavy components
export const DynamicProductSummary = dynamic(
  () =>
    import("@/components/products/ProductSummary").then(
      (mod) => mod.ProductSummary,
    ),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 rounded-lg h-64" />
    ),
    ssr: true,
  },
);

export const DynamicProductReviews = dynamic(
  () =>
    import("@/components/products/ProductReviews").then(
      (mod) => mod.ProductReviews,
    ),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 rounded-lg h-32" />
    ),
    ssr: true,
  },
);

export const DynamicComparisonTable = dynamic(
  () =>
    import("@/components/comparisons/ComparisonTable").then(
      (mod) => mod.ComparisonTable,
    ),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 rounded-lg h-48" />
    ),
    ssr: true,
  },
);

export const DynamicAnalyticsDashboard = dynamic(
  () =>
    import("@/components/admin/analytics/AnalyticsDashboard").then(
      (mod) => mod.AnalyticsDashboard,
    ),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 rounded-lg h-64" />
    ),
    ssr: false,
  },
);

export const DynamicAIContentStudio = dynamic(
  () =>
    import("@/components/admin/ai/AIContentStudio").then(
      (mod) => mod.AIContentStudio,
    ),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 rounded-lg h-64" />
    ),
    ssr: false,
  },
);
