// src/app/affiliate-programs/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { ArrowLeft, ExternalLink, Building2 } from "lucide-react";

interface AffiliateProgramPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: AffiliateProgramPageProps) {
  const { slug } = await params;
  const program = await db.affiliateProgram.findUnique({
    where: { slug },
  });

  if (!program) {
    return {
      title: "Affiliate Program Not Found",
    };
  }

  return {
    title: `${program.name} - Affiliate Program`,
    description:
      program.description || `Join the ${program.name} affiliate program`,
  };
}

export default async function AffiliateProgramPage({
  params,
}: AffiliateProgramPageProps) {
  const { slug } = await params;

  const program = await db.affiliateProgram.findUnique({
    where: { slug },
  });

  if (!program || !program.isActive) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/affiliate-programs" className="hover:text-blue-600">
            Affiliate Programs
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{program.name}</span>
        </nav>

        {/* Back Button */}
        <Link
          href="/affiliate-programs"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Affiliate Programs
        </Link>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-center gap-4">
              {program.logo ? (
                <div className="relative w-16 h-16 shrink-0">
                  <Image
                    src={program.logo}
                    alt={program.name}
                    fill
                    className="object-contain rounded-lg bg-gray-50"
                    sizes="64px"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold">{program.name}</h1>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      program.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {program.isActive ? "Active" : "Inactive"}
                  </span>
                  {program.commission && (
                    <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                      {program.commission}% commission
                    </span>
                  )}
                  {program.cookieDuration && (
                    <span className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full">
                      {program.cookieDuration} days cookie
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {program.website && (
                <a
                  href={program.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Visit Website
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          {program.description && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Description
              </h3>
              <p className="text-gray-700">{program.description}</p>
            </div>
          )}

          {/* Program Details */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Commission Rate
              </h3>
              <p className="mt-1 text-lg font-semibold">
                {program.commission
                  ? `${program.commission}%`
                  : "Not specified"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Cookie Duration
              </h3>
              <p className="mt-1 text-lg font-semibold">
                {program.cookieDuration
                  ? `${program.cookieDuration} days`
                  : "Not specified"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created</h3>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(program.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
