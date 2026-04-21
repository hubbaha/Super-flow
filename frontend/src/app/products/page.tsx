import Link from "next/link";
import { getCategoriesData } from "@/lib/catalog";
import { getCategoryDisplayName, preferredCategories } from "@/lib/category-config";
import { getReferenceProducts } from "@/lib/reference-products";
import { siteAssets } from "@/lib/site-assets";
import { CategoryCard } from "@/components/CategoryCard";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const normalizedQuery = params.search?.trim() ?? "";
  const referenceProducts = await getReferenceProducts();

  if (referenceProducts.length) {
    const categoriesInData = Array.from(
      new Set(referenceProducts.map((product) => product.categorySlug)),
    );
    const preferredCategorySlugs: string[] = preferredCategories.map((category) => category.slug);
    const extraCategorySlugs = categoriesInData.filter(
      (slug) => !preferredCategorySlugs.includes(slug),
    );
    const allCategories = [...preferredCategorySlugs, ...extraCategorySlugs];

    return (
      <section className="space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-10 shadow-xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="relative">
            <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-300">
              Catalog
            </span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Products</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              Browse all Superflow products by category.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="space-y-5">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900">All Categories</h2>
            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              {allCategories.length}{" "}
              {allCategories.length === 1 ? "category" : "categories"}
            </span>
          </div>

          {allCategories.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {allCategories.map((categorySlug) => {
                const productCount = referenceProducts.filter(
                  (p) => p.categorySlug === categorySlug,
                ).length;
                const image =
                  siteAssets.categories[categorySlug as keyof typeof siteAssets.categories] ??
                  "/images/categories/pvc-valve.jpg";
                return (
                  <CategoryCard
                    key={categorySlug}
                    href={`/categories/${categorySlug}`}
                    title={getCategoryDisplayName(categorySlug)}
                    image={image}
                    count={productCount}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
              <p className="text-sm font-medium text-slate-500">No categories found.</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Fallback: database-driven categories
  const categories = await getCategoriesData();
  const categoryItems = categories.map((category) => ({
    id: category.id,
    href: `/categories/${category.slug}`,
    title: category.name,
    image:
      siteAssets.categories[category.slug as keyof typeof siteAssets.categories] ??
      "/images/categories/pvc-valve.jpg",
    count: category._count?.products,
  }));

  return (
    <section className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-10 shadow-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="relative">
          <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-300">
            Catalog
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Products</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Browse all Superflow products by category.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="space-y-5">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">All Categories</h2>
          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            {categoryItems.length}{" "}
            {categoryItems.length === 1 ? "category" : "categories"}
          </span>
        </div>

        {categoryItems.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {categoryItems.map((item) => (
              <CategoryCard
                key={item.id}
                href={item.href}
                title={item.title}
                image={item.image}
                count={item.count}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
            <p className="text-sm font-medium text-slate-500">No categories found.</p>
          </div>
        )}
      </div>
    </section>
  );
}