// src/components/statistics/StatisticSidebar.tsx
import Link from "next/link";
import { Download, BarChart3 } from "lucide-react";

interface StatisticSidebarProps {
  statistic: {
    id: string;
    title: string;
    sources: string[];
    publishedAt?: Date | null;
    niche?: {
      id: string;
      name: string;
      slug: string;
    } | null;
  };
}

export function StatisticSidebar({ statistic }: StatisticSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-4">Quick Stats</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-500">Published</span>
            <span className="font-medium">
              {statistic.publishedAt
                ? new Date(statistic.publishedAt).toLocaleDateString()
                : "Not published"}
            </span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-500">Sources</span>
            <span className="font-medium">{statistic.sources.length}</span>
          </div>
        </div>
      </div>

      {/* Download Options */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-3">Download Data</h3>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors text-sm">
            <Download className="h-4 w-4" />
            Download as CSV
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors text-sm">
            <Download className="h-4 w-4" />
            Download as JSON
          </button>
        </div>
      </div>

      {/* Share */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-3">Share</h3>
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
            Twitter
          </button>
          <button className="flex-1 px-3 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition-colors text-sm">
            LinkedIn
          </button>
          <button className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors text-sm">
            Copy Link
          </button>
        </div>
      </div>

      {/* Related Niche */}
      {statistic.niche && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-lg mb-2">Related Niche</h3>
          <Link
            href={`/niches/${statistic.niche.slug}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <BarChart3 className="h-4 w-4" />
            {statistic.niche.name}
          </Link>
        </div>
      )}
    </div>
  );
}
