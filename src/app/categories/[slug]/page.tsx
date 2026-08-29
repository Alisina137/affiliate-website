import { notFound } from "next/navigation";

import { categoryService } from "@/services";

import { CategoryProducts } from "@/components/categories/CategoryProducts";
import { CategoryHeader } from "@/components/categories/CategoryHeader";
import { CategoryFilters } from "@/components/categories/CategoryFilters";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    brandId?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;

  const category = await categoryService.getBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} - Products & Reviews`,
    description:
      category.description || `Browse the best ${category.name} products`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const search = await searchParams;

  const category = await categoryService.getBySlug(slug);

  if (!category) {
    notFound();
  }

  const brandId = search.brandId;

  const minPrice = search.minPrice ? parseFloat(search.minPrice) : undefined;

  const maxPrice = search.maxPrice ? parseFloat(search.maxPrice) : undefined;

  const sortBy = search.sortBy || "createdAt";
  const sortOrder = search.sortOrder || "desc";
  const page = parseInt(search.page || "1", 10);
  const limit = 12;

  const productsData = await categoryService.getProducts(category.id, {
    brandId,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    limit,
    offset: (page - 1) * limit,
  });

  const brandsData = await categoryService.getBrands(category.id);

  const brands = brandsData.filter(
    (brand): brand is NonNullable<typeof brand> => brand !== null,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <CategoryHeader category={category} />

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <aside className="lg:w-64 shrink-0">
            <CategoryFilters
              brands={brands}
              currentFilters={{
                brandId: search.brandId,
                minPrice: search.minPrice
                  ? parseFloat(search.minPrice)
                  : undefined,
                maxPrice: search.maxPrice
                  ? parseFloat(search.maxPrice)
                  : undefined,
                sortBy,
                sortOrder,
              }}
            />
          </aside>

          <main className="flex-1">
            <CategoryProducts
              products={productsData.data}
              total={productsData.total}
              currentPage={productsData.page}
              totalPages={productsData.totalPages}
              limit={productsData.limit}
              categorySlug={category.slug}
              currentFilters={{
                brandId: search.brandId,
                minPrice: search.minPrice
                  ? parseFloat(search.minPrice)
                  : undefined,
                maxPrice: search.maxPrice
                  ? parseFloat(search.maxPrice)
                  : undefined,
                sortBy,
                sortOrder,
              }}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
