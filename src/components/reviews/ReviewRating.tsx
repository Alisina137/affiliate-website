// src/components/reviews/ReviewRating.tsx
"use client"

import { Star, StarHalf } from "lucide-react"

interface ReviewRatingProps {
  rating: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function ReviewRating({ rating, size = "md", showLabel = true }: ReviewRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating - fullStars >= 0.5

  const sizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} className={`${sizes[size]} fill-yellow-400 text-yellow-400`} />
          } else if (i === fullStars && hasHalfStar) {
            return <StarHalf key={i} className={`${sizes[size]} fill-yellow-400 text-yellow-400`} />
          } else {
            return <Star key={i} className={`${sizes[size]} text-gray-300`} />
          }
        })}
      </div>
      {showLabel && (
        <span className={`${textSizes[size]} font-bold ml-1`}>{rating.toFixed(1)}</span>
      )}
    </div>
  )
}
