// src/app/comparisons/page.tsx
import Link from "next/link";
import { comparisonService } from "@/services";
import { GitCompare, Calendar, User } from "lucide-react";

export const metadata = {
  title: "Product Comparisons",
  description: "Compare products side by side to make the best decision",
};

export default async function ComparisonsPage() {
  const { data: comparisons, total } = await comparisonService.getAll({
    status: "PUBLISHED",
    limit: 12,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Product Comparisons</h1>
        <p className="text-gray-600 mb-8">
          Compare products side by side to make the best decision
        </p>

        {comparisons && comparisons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparisons.map((comparison) => (
              <Link
                key={comparison.id}
                href={`/comparisons/${comparison.slug}`}
                className="group bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start gap-3">
                    <GitCompare className="h-5 w-5 text-blue-600 shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                        {comparison.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {comparison.products.slice(0, 3).map((cp, index) => (
                          <span
                            key={cp.productId}
                            className="text-xs text-gray-500"
                          >
                            {cp.product.name}
                            {index < comparison.products.length - 1 && " vs "}
                          </span>
                        ))}
                      </div>
                      {comparison.winner && (
                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">
                          <span>🏆</span>
                          Winner: {comparison.winner}
                        </div>
                      )}
                    </div>
                  </div>

                  {comparison.excerpt && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {comparison.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                    {comparison.author && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {comparison.author.name || "Anonymous"}
                      </span>
                    )}
                    {comparison.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(comparison.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <GitCompare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No comparisons available yet.</p>
          </div>
        )}

        {total > 12 && (
          <div className="mt-8 text-center">
            <Link
              href="/comparisons?page=2"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Load More
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
