/* eslint-disable react-hooks/set-state-in-effect */
// src/app/admin/affiliate-links/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Link2, Loader2 } from "lucide-react";

interface AffiliateLink {
  id: string;
  merchant: string;
  url: string;
  label: string;
  country: string;
  priority: number;
  clicks: number;
  isActive: boolean;
  product: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
}

export default function AdminAffiliateLinksPage() {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Define fetchLinks with useCallback
  const fetchLinks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/affiliate-links?search=${search}&page=${page}&limit=${limit}`,
      );
      const data = await response.json();
      setLinks(data.data || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching affiliate links:", error);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  // Now useEffect can safely depend on fetchLinks
  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleDelete = async (id: string, merchant: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the affiliate link for "${merchant}"?`,
      )
    )
      return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/affiliate-links/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete affiliate link");
        setDeleting(null);
        return;
      }

      await fetchLinks();
      alert(`Affiliate link deleted successfully!`);
    } catch (error) {
      console.error("Error deleting affiliate link:", error);
      alert("Failed to delete affiliate link");
    } finally {
      setDeleting(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLinks();
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && links.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Affiliate Links</h1>
          <p className="text-gray-500">Manage your affiliate links</p>
        </div>
        <Link
          href="/admin/affiliate-links/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] text-white rounded-lg hover:bg-[#2d2d44] transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Affiliate Link
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by merchant or product..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          Search
        </button>
      </form>

      {/* Links Table */}
      {links.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <Link2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No affiliate links found
          </h3>
          <p className="text-gray-500 mt-1">
            Get started by creating your first affiliate link.
          </p>
          <Link
            href="/admin/affiliate-links/new"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Affiliate Link
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Merchant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Label
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {link.product?.name || "—"}
                        </p>
                        <p className="text-xs text-gray-500">
                          /{link.product?.slug || ""}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{link.merchant}</td>
                    <td className="px-4 py-3 text-sm">{link.label}</td>
                    <td className="px-4 py-3 text-sm">{link.country}</td>
                    <td className="px-4 py-3 text-sm">{link.clicks || 0}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          link.isActive !== false
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {link.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/affiliate-links/${link.id}`}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/affiliate-links/${link.id}/edit`}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(link.id, link.merchant)}
                          disabled={deleting === link.id}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deleting === link.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {Math.min(links.length, limit)} of {total}
          </p>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-md text-sm ${
                  page === i + 1
                    ? "bg-[#1a1a2e] text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
