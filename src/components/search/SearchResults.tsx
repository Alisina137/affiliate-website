// src/components/search/SearchResults.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Star,
  GitCompare,
  BookOpen,
  Building2,
  FolderOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  type:
    | "product"
    | "review"
    | "comparison"
    | "guide"
    | "article"
    | "brand"
    | "category";
  excerpt?: string | null;
  image?: string | null;
  url: string;
  rating?: number | null;
  price?: number | null;
  currency?: string;
  relevance: number;
}

interface SearchResultsProps {
  query: string;
  currentPage: number;
  limit: number;
  filters: {
    type?: string;
    sortBy?: string;
    sortOrder?: string;
    categoryId?: string;
    brandId?: string;
    minPrice?: number;
    maxPrice?: number;
  };
}

export function SearchResults({
  query,
  currentPage,
  limit,
  filters,
}: SearchResultsProps) {
  const router = useRouter();

  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(query.length >= 2);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (query.length < 2) {
      return;
    }

    const controller = new AbortController();

    const fetchResults = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams();

        params.set("q", query);
        params.set("page", currentPage.toString());
        params.set("limit", limit.toString());

        if (filters.type && filters.type !== "all") {
          params.set("type", filters.type);
        }

        if (filters.sortBy && filters.sortBy !== "relevance") {
          params.set("sortBy", filters.sortBy);
        }

        if (filters.sortOrder && filters.sortOrder !== "desc") {
          params.set("sortOrder", filters.sortOrder);
        }

        if (filters.minPrice !== undefined) {
          params.set("minPrice", filters.minPrice.toString());
        }

        if (filters.maxPrice !== undefined) {
          params.set("maxPrice", filters.maxPrice.toString());
        }

        if (filters.categoryId) {
          params.set("categoryId", filters.categoryId);
        }

        if (filters.brandId) {
          params.set("brandId", filters.brandId);
        }

        const response = await fetch(`/api/search?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Search request failed with status ${response.status}`,
          );
        }

        const data = await response.json();

        setResults(data.results || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
        setSuggestions(data.suggestions || []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Error fetching search results:", error);

        setResults([]);
        setTotal(0);
        setTotalPages(0);
        setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      controller.abort();
    };
  }, [query, currentPage, limit, filters]);

  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(price);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "product":
        return <Package className="h-5 w-5 text-blue-600" />;

      case "review":
        return <Star className="h-5 w-5 text-yellow-600" />;

      case "comparison":
        return <GitCompare className="h-5 w-5 text-purple-600" />;

      case "guide":
        return <BookOpen className="h-5 w-5 text-green-600" />;

      case "brand":
        return <Building2 className="h-5 w-5 text-orange-600" />;

      case "category":
        return <FolderOpen className="h-5 w-5 text-teal-600" />;

      default:
        return <Search className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "product":
        return "Product";

      case "review":
        return "Review";

      case "comparison":
        return "Comparison";

      case "guide":
        return "Guide";

      case "brand":
        return "Brand";

      case "category":
        return "Category";

      default:
        return "Result";
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);

    params.set("page", page.toString());

    router.push(`/search?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border p-6 animate-pulse"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />

              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0 && query.length >= 2) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 rounded-full p-4 mb-4">
            <Search className="h-10 w-10 text-gray-400" />
          </div>

          <h3 className="text-xl font-semibold text-gray-700">
            No results found
          </h3>

          <p className="text-gray-500 mt-2 max-w-md">
            We couldn&apos;t find anything matching{" "}
            <span className="font-medium">&quot;{query}&quot;</span>
          </p>

          {suggestions.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Try searching for:</p>

              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion) => (
                  <Link
                    key={suggestion}
                    href={`/search?q=${encodeURIComponent(suggestion)}`}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-blue-100 rounded-full transition-colors"
                  >
                    {suggestion}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-400">
            <p>Suggestions:</p>

            <ul className="mt-1 space-y-1">
              <li>• Check your spelling</li>
              <li>• Try more general keywords</li>
              <li>• Try fewer keywords</li>
              <li>• Browse categories instead</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium">{Math.min(results.length, limit)}</span>{" "}
          of <span className="font-medium">{total}</span> results for{" "}
          <span className="font-medium">&quot;{query}&quot;</span>
        </p>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {results.map((result) => (
          <div
            key={result.id}
            className="bg-white rounded-lg shadow-sm border p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Type Icon */}
              <div className="shrink-0">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  {getTypeIcon(result.type)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={result.url}
                    className="text-lg font-semibold hover:text-blue-600 transition-colors"
                  >
                    {result.title}
                  </Link>

                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {getTypeLabel(result.type)}
                  </span>
                </div>

                {result.excerpt && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {result.excerpt}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                  {result.type === "product" && (
                    <>
                      {result.price !== null && result.price !== undefined && (
                        <span className="font-bold text-blue-600">
                          {formatPrice(result.price, result.currency || "USD")}
                        </span>
                      )}

                      {result.rating !== null &&
                        result.rating !== undefined &&
                        result.rating > 0 && (
                          <span className="flex items-center gap-1 text-gray-500">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {result.rating.toFixed(1)}
                          </span>
                        )}
                    </>
                  )}

                  {result.type === "review" &&
                    result.rating !== null &&
                    result.rating !== undefined &&
                    result.rating > 0 && (
                      <span className="flex items-center gap-1 text-gray-500">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {result.rating.toFixed(1)} / 5.0
                      </span>
                    )}

                  <Link
                    href={result.url}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    View {getTypeLabel(result.type)}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNumber: number;

              if (totalPages <= 7) {
                pageNumber = i + 1;
              } else if (currentPage <= 4) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 3) {
                pageNumber = totalPages - 6 + i;
              } else {
                pageNumber = currentPage - 3 + i;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    pageNumber === currentPage
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
