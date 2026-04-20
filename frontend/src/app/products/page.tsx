import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getCategoriesData, getProductsData } from "@/lib/catalog";
import { getCategoryDisplayName, preferredCategories } from "@/lib/category-config";
import { getReferenceProducts } from "@/lib/reference-products";
import { siteAssets } from "@/lib/site-assets";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    tag?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const normalizedQuery = params.search?.trim() ?? "";
  const selectedCategory = params.category?.trim() ?? "";
  const selectedTag = params.tag?.trim() ?? "";
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
    const allTags = Array.from(
      new Set(referenceProducts.flatMap((product) => product.filterTags ?? [])),
    );
    const filteredReferenceProducts = referenceProducts.filter((product) => {
      const categoryMatch = selectedCategory ? product.categorySlug === selectedCategory : true;
      const tagMatch = selectedTag
        ? (product.filterTags ?? []).some(
            (tag) => tag.toLowerCase() === selectedTag.toLowerCase(),
          )
        : true;
      const queryMatch = normalizedQuery
        ? `${product.name} ${product.preview ?? ""} ${product.descriptionHtml}`
            .toLowerCase()
            .includes(normalizedQuery.toLowerCase())
        : true;
      return categoryMatch && tagMatch && queryMatch;
    });

    const buildHref = (updates: { category?: string; tag?: string }) => {
      const query = new URLSearchParams();
      if (normalizedQuery) query.set("search", normalizedQuery);
      const nextCategory = updates.category !== undefined ? updates.category : selectedCategory;
      const nextTag = updates.tag !== undefined ? updates.tag : selectedTag;
      if (nextCategory) query.set("category", nextCategory);
      if (nextTag) query.set("tag", nextTag);
      const stringified = query.toString();
      return stringified ? `/products?${stringified}` : "/products";
    };

    const chipBase =
      "rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all duration-200";
    const chipActive = "border-slate-900 bg-slate-900 text-white shadow-sm";
    const chipIdle =
      "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50";

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
              Browse all products with category and standard-based filters.
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link href={buildHref({ category: "", tag: selectedTag })} className={`${chipBase} ${!selectedCategory ? chipActive : chipIdle}`}>
              All
            </Link>
            {allCategories.map((category) => (
              <Link
                key={category}
                href={buildHref({ category, tag: selectedTag })}
                className={`${chipBase} ${selectedCategory === category ? chipActive : chipIdle}`}
              >
                {getCategoryDisplayName(category)}
              </Link>
            ))}
          </div>
        </div>

        {/* Tag Filter
        {allTags.length ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Filter by standard / type
            </h2>
            <div className="flex flex-wrap gap-2">
              <Link href={buildHref({ tag: "" })} className={`${chipBase} ${!selectedTag ? chipActive : chipIdle}`}>
                All
              </Link>
              {allTags.map((tag) => (
                <Link
                  key={tag}
                  href={buildHref({ tag })}
                  className={`${chipBase} ${selectedTag === tag ? chipActive : chipIdle}`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        ) : null} */}

        {/* Results */}
        <div className="space-y-5">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900">
              {normalizedQuery ? `Results for "${normalizedQuery}"` : "All products"}
            </h2>
            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              {filteredReferenceProducts.length}{" "}
              {filteredReferenceProducts.length === 1 ? "product" : "products"}
            </span>
          </div>

          {filteredReferenceProducts.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredReferenceProducts.map((product) => (
                <article
                  key={product.slug}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                >
                  {product.image ? (
                    <div className="overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                      <svg className="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-semibold text-slate-900 transition group-hover:text-blue-700">
                      {product.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                      {product.preview ?? "View full specifications and technical details."}
                    </p>
                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <Link
                        href={`/products/${product.categorySlug}/${product.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-600 hover:gap-2.5 active:scale-95"
                      >
                        View Details
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
              <svg className="mb-4 h-10 w-10 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p className="text-sm font-medium text-slate-500">No products matched your filters.</p>
              <p className="mt-1 text-xs text-slate-400">Try clearing category, tag, or search.</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  const categories = await getCategoriesData();
  const products = await getProductsData(normalizedQuery);
  const categoryItems = categories.map((category) => ({
    id: category.id,
    href: `/categories/${category.slug}`,
    title: category.name,
    image:
      siteAssets.categories[category.slug as keyof typeof siteAssets.categories] ??
      "/images/carousel/hero-01.jpg",
    count: category._count?.products,
  }));

  const chipBase =
    "rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all duration-200";
  const chipIdle =
    "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50";

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
            Browse all Superflow products and filter them from the navbar search.
          </p>
        </div>
      </div>

      {/* Category Chips */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Shop by category
        </h2>
        <div className="flex flex-wrap gap-2">
          {categoryItems.map((item) => (
            <Link key={item.id} href={item.href} className={`${chipBase} ${chipIdle}`}>
              {item.title}
              {typeof item.count === "number" && (
                <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                  {item.count}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-5">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">
            {normalizedQuery ? `Results for "${normalizedQuery}"` : "All products"}
          </h2>
          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            {products.length} {products.length === 1 ? "product" : "products"}
          </span>
        </div>

        {products.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
            <svg className="mb-4 h-10 w-10 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <p className="text-sm font-medium text-slate-500">No products matched your search.</p>
            <p className="mt-1 text-xs text-slate-400">Try a different term or browse by category above.</p>
          </div>
        )}
      </div>
    </section>
  );
}