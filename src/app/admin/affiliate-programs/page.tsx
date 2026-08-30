/* eslint-disable react-hooks/set-state-in-effect */
// src/app/admin/affiliate-programs/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, Eye, Building2, Loader2 } from "lucide-react";

interface AffiliateProgram {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  logo: string | null;
  commission: string | null;
  cookieDuration: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminAffiliateProgramsPage() {
  const [programs, setPrograms] = useState<AffiliateProgram[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/affiliate-programs?search=${search}&page=${page}&limit=${limit}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched programs:", data);

      setPrograms(data.data || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching affiliate programs:", error);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the affiliate program "${name}"?`,
      )
    )
      return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/affiliate-programs/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete affiliate program");
        setDeleting(null);
        return;
      }

      await fetchPrograms();
      alert(`Affiliate program deleted successfully!`);
    } catch (error) {
      console.error("Error deleting affiliate program:", error);
      alert("Failed to delete affiliate program");
    } finally {
      setDeleting(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPrograms();
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && programs.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">
            Affiliate Programs
          </h1>
          <p className="text-gray-500">Manage your affiliate programs</p>
          <p className="text-sm text-gray-400">Total: {total} programs</p>
        </div>
        <Link
          href="/admin/affiliate-programs/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] text-white rounded-lg hover:bg-[#2d2d44] transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Program
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search programs..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          Search
        </button>
      </form>

      {/* Programs Grid */}
      {programs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No affiliate programs found
          </h3>
          <p className="text-gray-500 mt-1">
            Get started by creating your first affiliate program.
          </p>
          <Link
            href="/admin/affiliate-programs/new"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Program
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {program.logo ? (
                    <div className="relative w-12 h-12 shrink-0">
                      <Image
                        src={program.logo}
                        alt={program.name}
                        fill
                        className="object-contain rounded-lg bg-gray-50"
                        sizes="48px"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                      <Building2 className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {program.name}
                    </h3>
                    <p className="text-sm text-gray-500">/{program.slug}</p>
                    <p className="text-xs text-gray-400">
                      Created:{" "}
                      {new Date(program.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/affiliate-programs/${program.slug}`}
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-gray-100 transition-colors"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/admin/affiliate-programs/${program.id}/edit`}
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-gray-100 transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(program.id, program.name)}
                    disabled={deleting === program.id}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    {deleting === program.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              {program.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {program.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    program.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {program.isActive ? "Active" : "Inactive"}
                </span>
                {program.commission && (
                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                    {program.commission}% commission
                  </span>
                )}
                {program.cookieDuration && (
                  <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                    {program.cookieDuration} days
                  </span>
                )}
                {program.website && (
                  <a
                    href={program.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {Math.min(programs.length, limit)} of {total}
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
