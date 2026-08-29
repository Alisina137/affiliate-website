// src/components/home/ReviewCard.tsx
import Link from "next/link"
import { Star, User } from "lucide-react"

interface ReviewCardProps {
  title: string
  slug: string
  excerpt?: string | null
  rating?: number | null
  productName: string
  authorName?: string | null
  publishedAt?: Date | null
}

export function ReviewCard({
  title,
  slug,
  excerpt,
  rating,
  productName,
  authorName,
  publishedAt,
}: ReviewCardProps) {
  return (
    <Link href={`/reviews/${slug}`} className="group">
      <div className="bg-white rounded-lg shadow-md border p-5 hover:shadow-xl transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold group-hover:text-blue-600 transition-colors line-clamp-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {productName}
            </p>
          </div>
          {rating && rating > 0 && (
            <div className="flex items-center gap-1 ml-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {excerpt && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{excerpt}</p>
        )}

        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
          {authorName && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {authorName}
            </span>
          )}
          {publishedAt && (
            <span>{new Date(publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
