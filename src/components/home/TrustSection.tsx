// src/components/home/TrustSection.tsx
"use client";

import { useState, useEffect } from "react";
import { Shield, Clock, Heart, Search } from "lucide-react";

export function TrustSection() {
  const [stats, setStats] = useState({
    products: 0,
    reviews: 0,
    comparisons: 0,
    guides: 0,
  });

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats({
          products: data.totalProducts || 250,
          reviews: data.totalReviews || 180,
          comparisons: data.totalComparisons || 45,
          guides: data.totalGuides || 30,
        });
      })
      .catch(() => {
        setStats({
          products: 250,
          reviews: 180,
          comparisons: 45,
          guides: 30,
        });
      });
  }, []);

  return (
    <section className="py-16 bg-white border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="stat-card">
            <p className="text-3xl md:text-4xl font-bold text-[#1a1a2e]">
              {stats.products}+
            </p>
            <p className="text-sm text-gray-500 mt-1">Products reviewed</p>
          </div>
          <div className="stat-card">
            <p className="text-3xl md:text-4xl font-bold text-[#1a1a2e]">
              {stats.reviews}+
            </p>
            <p className="text-sm text-gray-500 mt-1">Expert reviews</p>
          </div>
          <div className="stat-card">
            <p className="text-3xl md:text-4xl font-bold text-[#1a1a2e]">
              {stats.comparisons}+
            </p>
            <p className="text-sm text-gray-500 mt-1">Comparisons</p>
          </div>
          <div className="stat-card">
            <p className="text-3xl md:text-4xl font-bold text-[#1a1a2e]">
              {stats.guides}+
            </p>
            <p className="text-sm text-gray-500 mt-1">Buying guides</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="trust-card">
            <Shield className="h-6 w-6 text-[#1a1a2e] mb-3" />
            <h3 className="font-semibold text-[#1a1a2e] mb-1">
              Honest reviews
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              We never accept payment for reviews.
            </p>
          </div>
          <div className="trust-card">
            <Search className="h-6 w-6 text-[#1a1a2e] mb-3" />
            <h3 className="font-semibold text-[#1a1a2e] mb-1">Real research</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Every product is thoroughly researched.
            </p>
          </div>
          <div className="trust-card">
            <Clock className="h-6 w-6 text-[#1a1a2e] mb-3" />
            <h3 className="font-semibold text-[#1a1a2e] mb-1">
              Always updated
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Content reflects the latest products.
            </p>
          </div>
          <div className="trust-card">
            <Heart className="h-6 w-6 text-[#1a1a2e] mb-3" />
            <h3 className="font-semibold text-[#1a1a2e] mb-1">User-first</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Designed to help you decide.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
