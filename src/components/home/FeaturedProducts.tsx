// src/components/home/FeaturedProducts.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Star, Package, ArrowRight } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  currency: string
  rating: number
  reviewCount: number
  images: string[]
  brand: { name: string }
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/products?featured=true&limit=5")
      .then(res => res.json())
      .then(data => {
        setProducts(data.data || [])
        setLoading(false)
      })
      .catch(() => {
        setProducts([
          {
            id: "1",
            name: "MacBook Pro 16-inch",
            slug: "macbook-pro-16",
            price: 2499,
            currency: "USD",
            rating: 4.9,
            reviewCount: 156,
            images: [],
            brand: { name: "Apple" }
          },
          {
            id: "2",
            name: "Sony WH-1000XM5",
            slug: "sony-wh-1000xm5",
            price: 399,
            currency: "USD",
            rating: 4.8,
            reviewCount: 234,
            images: [],
            brand: { name: "Sony" }
          },
          {
            id: "3",
            name: "Dell XPS 15",
            slug: "dell-xps-15",
            price: 1899,
            currency: "USD",
            rating: 4.7,
            reviewCount: 89,
            images: [],
            brand: { name: "Dell" }
          },
          {
            id: "4",
            name: "AirPods Pro 2",
            slug: "airpods-pro-2",
            price: 249,
            currency: "USD",
            rating: 4.6,
            reviewCount: 312,
            images: [],
            brand: { name: "Apple" }
          },
          {
            id: "5",
            name: "Samsung Galaxy S24",
            slug: "samsung-galaxy-s24",
            price: 1199,
            currency: "USD",
            rating: 4.5,
            reviewCount: 178,
            images: [],
            brand: { name: "Samsung" }
          }
        ])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="py-16 border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#1a1a2e]">Featured Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 rounded-lg aspect-square mb-3" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) return null

  const heroProduct = products[0]
  const gridProducts = products.slice(1, 5)

  return (
    <section className="py-12 sm:py-16 border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a2e]">Featured Products</h2>
            <p className="text-sm text-gray-500 mt-0.5 sm:mt-1">Hand-picked recommendations</p>
          </div>
          <Link href="/products" className="text-sm text-[#1a1a2e] hover:underline flex items-center gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="hidden md:grid md:grid-cols-5 gap-6">
          {products.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="md:hidden space-y-4">
          <ProductCard product={heroProduct} isHero />
          <div className="grid grid-cols-2 gap-3">
            {gridProducts.map((product) => (
              <ProductCard key={product.id} product={product} isGrid />
            ))}
          </div>
        </div>

        <div className="hidden sm:grid md:hidden grid-cols-2 gap-4">
          <div className="col-span-1">
            <ProductCard product={heroProduct} isHero />
          </div>
          <div className="col-span-1 grid grid-cols-1 gap-4">
            {gridProducts.slice(0, 2).map((product) => (
              <ProductCard key={product.id} product={product} isGrid />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product, isHero = false, isGrid = false }: { product: Product; isHero?: boolean; isGrid?: boolean }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: product.currency || "USD",
    }).format(price)
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`product-card ${isHero ? "block" : ""}`}
    >
      <div className={`${isHero ? "flex flex-row sm:flex-col" : ""} ${isGrid ? "flex flex-col" : ""}`}>
        <div className={`relative bg-gray-50 flex items-center justify-center ${
          isHero ? "w-2/5 sm:w-full aspect-square" : "aspect-square"
        }`}>
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <Package className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300" />
          )}
        </div>

        <div className={`flex-1 p-3 ${isHero ? "flex flex-col justify-center" : ""}`}>
          <p className="text-xs text-gray-400 mb-0.5">{product.brand.name}</p>
          <h3 className={`font-medium text-[#1a1a2e] group-hover:text-[#1a1a2e]/70 transition-colors ${
            isHero ? "text-base sm:text-lg" : "text-sm"
          } line-clamp-2`}>
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            {product.rating > 0 && (
              <div className="flex items-center gap-0.5">
                <Star className={`${isHero ? "h-4 w-4" : "h-3 w-3"} fill-[#1a1a2e] text-[#1a1a2e]`} />
                <span className={`${isHero ? "text-sm" : "text-xs"} font-medium`}>{product.rating}</span>
              </div>
            )}
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>
          <p className={`font-bold text-[#1a1a2e] ${isHero ? "text-lg sm:text-xl" : "text-base"}`}>
            {formatPrice(product.price)}
          </p>
          {isHero && (
            <div className="mt-2 text-xs text-[#1a1a2e] font-medium group-hover:text-[#1a1a2e]/70 transition-colors inline-flex items-center gap-1">
              View Product
              <ArrowRight className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
