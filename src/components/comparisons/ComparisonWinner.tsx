// src/components/comparisons/ComparisonWinner.tsx
"use client";

import Link from "next/link";
import {
  Trophy,
  Star,
  Check,
  X,
  ShoppingCart,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price?: number | null;
  currency: string;
  rating?: number | null;
  reviewCount: number;
  images: string[];
  description?: string | null;
  shortDescription?: string | null;
  bestFor?: string | null;
  brand?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  affiliateLinks?: Array<{
    id: string;
    url: string;
    label: string;
    merchant: string;
  }>;
}

interface ComparisonWinnerProps {
  winner: string;
  explanation?: string | null;
  products: Product[];
  comparisonProducts?: Array<{
    productId: string;
    strengths: string[];
    weaknesses: string[];
    bestFor?: string | null;
  }>;
}

export function ComparisonWinner({
  winner,
  explanation,
  products,
  comparisonProducts,
}: ComparisonWinnerProps) {
  // Find the winner product
  const winnerProduct = products.find(
    (p) => p.name === winner || p.id === winner,
  );

  // Get the winner's comparison data
  const winnerComparison = comparisonProducts?.find(
    (cp) => cp.productId === winnerProduct?.id,
  );

  if (!winnerProduct) {
    return null;
  }

  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  // Get the best affiliate link
  const bestLink = winnerProduct.affiliateLinks?.[0];

  // Get runner up (second best product)
  const runnerUp = products.find((p) => p.id !== winnerProduct.id);

  return (
    <div className="space-y-6">
      {/* Winner Banner */}
      <div className="relative overflow-hidden bg-linear-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 opacity-10">
          <Trophy className="h-32 w-32" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-6 w-6" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Editor&apos;s Choice
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Our Winner</h2>
          <p className="text-lg mt-1 text-amber-100">{winnerProduct.name}</p>
        </div>
      </div>

      {/* Winner Details */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
          {/* Product Info */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-700 mb-2">
              Product Details
            </h3>
            <p className="text-xl font-bold">{winnerProduct.name}</p>
            {winnerProduct.brand && (
              <p className="text-sm text-gray-500">
                {winnerProduct.brand.name}
              </p>
            )}
            {winnerProduct.bestFor && (
              <div className="mt-2">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  Best for: {winnerProduct.bestFor}
                </span>
              </div>
            )}
            {winnerProduct.shortDescription && (
              <p className="text-sm text-gray-600 mt-2">
                {winnerProduct.shortDescription}
              </p>
            )}
          </div>

          {/* Rating & Price */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-700 mb-2">Rating & Price</h3>
            <div className="flex items-center gap-4">
              {winnerProduct.rating && winnerProduct.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">
                    {winnerProduct.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({winnerProduct.reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>
            {winnerProduct.price && (
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {formatPrice(winnerProduct.price, winnerProduct.currency)}
              </p>
            )}
          </div>

          {/* CTA */}
          <div className="p-6 flex flex-col justify-center items-center md:items-end">
            <p className="text-sm text-gray-500 mb-2">Ready to buy?</p>
            {bestLink ? (
              <a
                href={bestLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                Buy Now at {bestLink.merchant}
                <ArrowRight className="h-4 w-4" />
              </a>
            ) : (
              <Link
                href={`/products/${winnerProduct.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Product Details
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Explanation */}
        {explanation && (
          <div className="p-6 bg-green-50 border-t border-green-100">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-green-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-green-800">
                  Why we chose this:
                </h4>
                <p className="text-green-700 mt-1">{explanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Winner vs Runner Up */}
      {runnerUp && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-700 mb-4">
            Why {winnerProduct.name} beats {runnerUp.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <Check className="h-4 w-4" />
                {winnerProduct.name}
              </h4>
              <ul className="space-y-1">
                {winnerComparison?.strengths?.slice(0, 3).map((strength, i) => (
                  <li
                    key={i}
                    className="text-sm text-green-700 flex items-start gap-1"
                  >
                    <span className="text-green-500">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <X className="h-4 w-4" />
                {runnerUp.name}
              </h4>
              <ul className="space-y-1">
                {comparisonProducts
                  ?.find((cp) => cp.productId === runnerUp.id)
                  ?.weaknesses?.slice(0, 3)
                  .map((weakness, i) => (
                    <li
                      key={i}
                      className="text-sm text-red-700 flex items-start gap-1"
                    >
                      <span className="text-red-500">•</span>
                      {weakness}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span>Verified Rating</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span>Trusted Review</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span>Best Price Guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span>Secure Checkout</span>
        </div>
      </div>

      {/* Affiliate Disclosure */}
      <p className="text-xs text-center text-gray-400">
        As an affiliate, we may earn a commission from qualifying purchases.
      </p>
    </div>
  );
}
