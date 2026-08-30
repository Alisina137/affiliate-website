// src/app/affiliate-links/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface AffiliateLinkPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: AffiliateLinkPageProps) {
  const { id } = await params;
  const link = await db.affiliateLink.findUnique({
    where: { id },
    include: {
      product: true,
    },
  });

  if (!link) {
    return {
      title: "Affiliate Link Not Found",
    };
  }

  return {
    title: `${link.merchant} - ${link.product?.name || "Affiliate Link"}`,
    description: `Buy ${link.product?.name || "this product"} from ${link.merchant}`,
  };
}

export default async function AffiliateLinkPage({
  params,
}: AffiliateLinkPageProps) {
  const { id } = await params;

  const link = await db.affiliateLink.findUnique({
    where: { id },
    include: {
      product: {
        include: {
          brand: true,
          category: true,
        },
      },
    },
  });

  if (!link || !link.isActive) {
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
          <Link href="/affiliate-links" className="hover:text-blue-600">
            Affiliate Links
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{link.merchant}</span>
        </nav>

        {/* Back Button */}
        <Link
          href="/affiliate-links"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Affiliate Links
        </Link>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold">{link.merchant}</h1>
              {link.product && (
                <p className="text-lg text-gray-600 mt-2">
                  Product: {link.product.name}
                  {link.product.brand && (
                    <span className="text-gray-400 ml-2">
                      by {link.product.brand.name}
                    </span>
                  )}
                </p>
              )}
              <div className="flex flex-wrap gap-3 mt-4">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    link.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {link.isActive ? "Active" : "Inactive"}
                </span>
                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                  {link.country}
                </span>
                {link.priority > 0 && (
                  <span className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full">
                    Priority: {link.priority}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {link.url && (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Visit Affiliate Link
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              {link.product && (
                <Link
                  href={`/products/${link.product.slug}`}
                  className="flex items-center gap-2 px-6 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Product
                </Link>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Affiliate URL
              </h3>
              <p className="mt-1 text-sm text-gray-900 break-all">{link.url}</p>
            </div>
            {link.trackingUrl && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Tracking URL
                </h3>
                <p className="mt-1 text-sm text-gray-900 break-all">
                  {link.trackingUrl}
                </p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Label</h3>
              <p className="mt-1 text-sm text-gray-900">{link.label}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Clicks</h3>
              <p className="mt-1 text-sm text-gray-900">{link.clicks || 0}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Click</h3>
              <p className="mt-1 text-sm text-gray-900">
                {link.lastClicked
                  ? new Date(link.lastClicked).toLocaleDateString()
                  : "Never"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created</h3>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(link.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
