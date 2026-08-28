// src/components/home/SectionHeader.tsx
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface SectionHeaderProps {
  title: string
  description?: string
  viewAllLink?: string
  viewAllText?: string
}

export function SectionHeader({
  title,
  description,
  viewAllLink,
  viewAllText = "View All",
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {description && (
          <p className="text-gray-600 mt-1">{description}</p>
        )}
      </div>
      {viewAllLink && (
        <Link
          href={viewAllLink}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 mt-2 sm:mt-0"
        >
          {viewAllText}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
