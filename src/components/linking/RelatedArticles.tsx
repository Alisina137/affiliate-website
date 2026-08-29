// src/components/linking/RelatedArticles.tsx
import Link from "next/link"
import { FileText, Clock, ArrowRight } from "lucide-react"

interface RelatedArticle {
  id: string
  title: string
  slug: string
  type: string
  url: string
  relevance: number
  reason: string
  excerpt?: string
  date?: string
}

interface RelatedArticlesProps {
  articles: RelatedArticle[]
  title?: string
  limit?: number
}

export function RelatedArticles({ articles, title = "Related Articles", limit = 3 }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null

  const displayArticles = articles.slice(0, limit)

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="space-y-4">
        {displayArticles.map((article) => (
          <Link
            key={article.id}
            href={article.url}
            className="block p-3 hover:bg-gray-50 rounded-lg transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </p>
                {article.excerpt && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{article.excerpt}</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {article.type}
                  </span>
                  {article.date && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.date}
                    </span>
                  )}
                  <span className="text-gray-300">•</span>
                  <span>{article.reason}</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
