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
  const normalizedQuery = params.search?.trim().toLowerCase() ?? "";
  const categories = await getCategoriesData();
  const referenceProducts = await getReferenceProducts();

  // Prefer database so admin add/delete is reflected immediately on site.
  if (!categories.length && referenceProducts.length) {
    // ── SEARCH RESULTS ──────────────────────────────────────────
    if (normalizedQuery) {
      const results = referenceProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(normalizedQuery) ||
        p.categorySlug?.toLowerCase().includes(normalizedQuery) ||
          (p.filterTags ?? []).some((tag: string) =>
            tag.toLowerCase().includes(normalizedQuery)
          )
      );

      return (
        <section className="space-y-8">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-10 shadow-xl">
            <div className="relative">
              <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-300">
                Search Results
              </span>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
                &ldquo;{params.search?.trim()}&rdquo;
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                {results.length} {results.length === 1 ? "product" : "products"} found
              </p>
            </div>
          </div>

          {/* Back link */}
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-orange-500 transition-colors"
          >
            ← Back to all products
          </Link>

          {results.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((product) => (
                <Link
                key={product.slug}
                  href={`/products/${product.categorySlug}/${product.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow no-underline"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-48 w-full bg-slate-100 flex items-center justify-center">
                      <svg className="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-5">
                    <span className="text-xs font-semibold uppercase tracking-widest text-blue-500">
                      {getCategoryDisplayName(product.categorySlug)}
                    </span>
                    <h3 className="mt-1 text-sm font-semibold text-slate-900 group-hover:text-orange-500 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    {product.preview && (
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">{product.preview}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
              <p className="text-sm font-medium text-slate-500">No products matched your search.</p>
              <Link href="/products" className="mt-3 text-sm text-orange-500 hover:underline">
                Browse all products
              </Link>
            </div>
          )}
        </section>
      );
    }

    // ── CATEGORY GRID (no search) ────────────────────────────────
    const categoriesInData = Array.from(
      new Set(referenceProducts.map((product) => product.categorySlug)),
    ).filter(
      (slug) => slug !== "pvc-disc-filter" && slug !== "pvc-strainer", // ✅ hide old slugs
    );
    const preferredCategorySlugs = preferredCategories.map((c) => c.slug);
    const extraCategorySlugs = categoriesInData.filter(
      (slug) => !preferredCategorySlugs.includes(slug),
    );
    const allCategories = [...preferredCategorySlugs, ...extraCategorySlugs];

    return (
      <section className="space-y-8">
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

        <div className="space-y-5">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900">All Categories</h2>
            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              {allCategories.length} {allCategories.length === 1 ? "category" : "categories"}
            </span>
          </div>

          {allCategories.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {allCategories.map((categorySlug) => {
                const productCount = referenceProducts.filter((p) => {
                  if (categorySlug === "pvc-disc-filters-and-strainers") {
                    return p.categorySlug === "pvc-disc-filter" || p.categorySlug === "pvc-strainer";
                  }
                  return p.categorySlug === categorySlug;
                }).length;
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

  // ── FALLBACK: database-driven ────────────────────────────────
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-10 shadow-xl">
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

      <div className="space-y-5">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">All Categories</h2>
          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            {categoryItems.length} {categoryItems.length === 1 ? "category" : "categories"}
          </span>
        </div>

        {categoryItems.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {categoryItems.map((item) => (
              <CategoryCard key={item.id} href={item.href} title={item.title} image={item.image} count={item.count} />
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
