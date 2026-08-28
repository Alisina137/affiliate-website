// src/components/products/RelatedProducts.tsx
import Link from "next/link"
import { Star, Package } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  price?: number | null
  currency: string
  rating?: number | null
  reviewCount: number
  images: string[]
  brand?: {
    id: string
    name: string
    slug: string
  } | null
}

interface RelatedProductsProps {
  products: Product[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) {
    return null
  }

  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-xl font-bold mb-4">Related Products</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group hover:shadow-lg transition-all duration-300"
          >
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <Package className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <div className="p-3">
                {product.brand && (
                  <p className="text-xs text-gray-500">{product.brand.name}</p>
                )}
                <h4 className="text-sm font-medium line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h4>
                {product.rating && product.rating > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
                  </div>
                )}
                {product.price && (
                  <p className="text-sm font-bold text-blue-600 mt-1">
                    {formatPrice(product.price, product.currency)}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
