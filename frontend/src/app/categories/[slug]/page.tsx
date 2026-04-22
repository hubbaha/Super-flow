import { ProductCard } from "@/components/ProductCard";
import { getCategoriesData, getCategoryProductsData } from "@/lib/catalog";
import { getCategoryDisplayName, preferredCategories } from "@/lib/category-config";
import { ProductBreadcrumbs } from "@/components/ProductBreadcrumbs";
import { getReferenceProductsByCategory } from "@/lib/reference-products";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const PRODUCTS_PER_PAGE = 12;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  const { slug } = await params;
  const { tag, page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10));
  const isPreferredCategory = preferredCategories.some((c) => c.slug === slug);
  const referenceProducts = await getReferenceProductsByCategory(slug);

  /* ─── Helper: build href preserving existing params ─── */
  const buildHref = (updates: { tag?: string; page?: number }) => {
    const q = new URLSearchParams();
    const nextTag = updates.tag !== undefined ? updates.tag : tag ?? "";
    const nextPage = updates.page ?? 1;
    if (nextTag) q.set("tag", nextTag);
    if (nextPage > 1) q.set("page", String(nextPage));
    const qs = q.toString();
    return qs ? `/categories/${slug}?${qs}` : `/categories/${slug}`;
  };

  /* ─── Reference-products branch ─── */
  if (referenceProducts.length) {
    const tagCounts = referenceProducts.reduce(
      (acc, product) => {
        for (const rawTag of product.filterTags ?? []) {
          const t = rawTag.trim();
          if (!t) continue;
          acc[t] = (acc[t] ?? 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
    const availableTags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    const selectedTag = tag?.trim();
    const filteredProducts = selectedTag
      ? referenceProducts.filter((p) =>
          (p.filterTags ?? []).some(
            (item) => item.toLowerCase() === selectedTag.toLowerCase(),
          ),
        )
      : referenceProducts;

    /* Pagination */
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
    const safePage = Math.min(currentPage, totalPages || 1);
    const paginatedProducts = filteredProducts.slice(
      (safePage - 1) * PRODUCTS_PER_PAGE,
      safePage * PRODUCTS_PER_PAGE,
    );

    return (
      <section className="space-y-8">
        <ProductBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: getCategoryDisplayName(slug) },
          ]}
        />

        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10 shadow-xl sm:px-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="relative">
            <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-300">
              Products
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {getCategoryDisplayName(slug)}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
              Browse available products and filter by standards or specifications.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {totalProducts} {totalProducts === 1 ? "product" : "products"}
              {selectedTag ? ` matching "${selectedTag}"` : " in this category"}
            </p>
          </div>
        </div>

        {/* Sidebar + Grid layout */}
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">

          {/* ── Sidebar filter ── */}
          {availableTags.length ? (
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-6">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Filter by Standard
                </h2>
                {selectedTag && (
                  <Link
                    href={buildHref({ tag: "", page: 1 })}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                  >
                    Clear ×
                  </Link>
                )}
              </div>
              <div className="p-2">
                {/* All row */}
                <Link
                  href={buildHref({ tag: "", page: 1 })}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all ${
                    !selectedTag
                      ? "bg-slate-900 font-semibold text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>All</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      !selectedTag ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {referenceProducts.length}
                  </span>
                </Link>

                {/* Tag rows */}
                <div className="mt-1 space-y-0.5">
                  {availableTags.map((tagItem) => {
                    const isActive =
                      selectedTag?.toLowerCase() === tagItem.name.toLowerCase();
                    return (
                      <Link
                        key={tagItem.name}
                        href={buildHref({ tag: tagItem.name, page: 1 })}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all ${
                          isActive
                            ? "bg-slate-900 font-semibold text-white"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="truncate pr-2">{tagItem.name}</span>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {tagItem.count}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </aside>
          ) : null}

          {/* ── Product grid + pagination ── */}
          <div className="min-w-0 space-y-6">
            {paginatedProducts.length ? (
              <>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {paginatedProducts.map((product) => (
                    <article
                      key={product.slug}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                    >
                      {/* Image */}
                      {product.image ? (
                        <div className="overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="flex h-90 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                          <svg
                            className="h-10 w-10 text-slate-300"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="text-base font-semibold text-slate-900 transition group-hover:text-blue-700">
                          {product.name}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                          {product.preview ?? "View technical details and full specifications."}
                        </p>
                        {/* Tags */}
                        {product.filterTags?.length ? (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {product.filterTags.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        ) : null}
                        <div className="mt-4 border-t border-slate-100 pt-4">
                          <Link
                            href={`/products/${product.categorySlug}/${product.slug}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-600 hover:gap-2.5 active:scale-95"
                          >
                            View Details
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2.5}
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                    <p className="text-sm text-slate-500">
                      Showing{" "}
                      <span className="font-semibold text-slate-900">
                        {(safePage - 1) * PRODUCTS_PER_PAGE + 1}–
                        {Math.min(safePage * PRODUCTS_PER_PAGE, totalProducts)}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-slate-900">{totalProducts}</span>{" "}
                      products
                    </p>
                    <div className="flex items-center gap-1">
                      {/* Prev */}
                      {safePage > 1 ? (
                        <Link
                          href={buildHref({ page: safePage - 1 })}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-300 hover:text-blue-700 active:scale-95"
                          aria-label="Previous page"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                          </svg>
                        </Link>
                      ) : (
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 text-slate-300">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                          </svg>
                        </span>
                      )}

                      {/* Page numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => {
                          if (totalPages <= 7) return true;
                          return p === 1 || p === totalPages || Math.abs(p - safePage) <= 1;
                        })
                        .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                          if (idx > 0) {
                            const prev = arr[idx - 1] as number;
                            if (p - prev > 1) acc.push("…");
                          }
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((item, idx) =>
                          item === "…" ? (
                            <span
                              key={`ellipsis-${idx}`}
                              className="flex h-9 w-9 items-center justify-center text-sm text-slate-400"
                            >
                              …
                            </span>
                          ) : (
                            <Link
                              key={item}
                              href={buildHref({ page: item as number })}
                              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition active:scale-95 ${
                                safePage === item
                                  ? "bg-slate-900 text-white shadow-sm"
                                  : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700"
                              }`}
                            >
                              {item}
                            </Link>
                          ),
                        )}

                      {/* Next */}
                      {safePage < totalPages ? (
                        <Link
                          href={buildHref({ page: safePage + 1 })}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-300 hover:text-blue-700 active:scale-95"
                          aria-label="Next page"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </Link>
                      ) : (
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 text-slate-300">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-20 text-center">
                <svg
                  className="mb-4 h-10 w-10 text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <p className="text-sm font-medium text-slate-500">No products matched this filter.</p>
                <p className="mt-1 text-xs text-slate-400">Try selecting a different tag above.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  /* ─── Catalog-data branch ─── */
  const data = await getCategoryProductsData(slug);

  if (!data) {
    const categories = await getCategoriesData();
    const normalize = (v: string) => v.toLowerCase().replace(/-/g, "").replace(/s$/, "");
    const normalizedSlug = normalize(slug);
    const matchedCategory = categories.find((c) => normalize(c.slug) === normalizedSlug);
    if (matchedCategory) redirect(`/categories/${matchedCategory.slug}`);

    /* Preferred but empty */
    if (isPreferredCategory) {
      return (
        <section className="space-y-8">
          <ProductBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              { label: getCategoryDisplayName(slug) },
            ]}
          />
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10 shadow-xl sm:px-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="relative">
              <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-300">
                Products
              </span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {getCategoryDisplayName(slug)}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
                This category is set up, but products have not been added yet.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-20 text-center">
            <svg className="mb-4 h-10 w-10 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <p className="text-sm font-medium text-slate-500">No products published in this category yet.</p>
            <p className="mt-1 text-xs text-slate-400">
              Add items in <code className="rounded bg-slate-200 px-1 py-0.5 font-mono text-slate-600">public/data/products.json</code> with{" "}
              <code className="rounded bg-slate-200 px-1 py-0.5 font-mono text-slate-600">categorySlug: "{slug}"</code>.
            </p>
          </div>
        </section>
      );
    }

    /* 404-style */
    return (
      <section className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-12 shadow-xl sm:px-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-blue-600/20 blur-2xl" />
          <div className="relative">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">Category not available</h1>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-400">
              This category link is outdated or no products are published for it yet.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-blue-50 active:scale-95">
                Browse all products
              </Link>
              <Link href="/contact-us" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10 active:scale-95">
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ─── Normal catalog grid (with pagination) ─── */
  const totalProducts = data.products.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const safePage = Math.min(currentPage, totalPages || 1);
  const paginatedCatalogProducts = data.products.slice(
    (safePage - 1) * PRODUCTS_PER_PAGE,
    safePage * PRODUCTS_PER_PAGE,
  );

  return (
    <section className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10 shadow-xl sm:px-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="relative">
          <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-300">
            Products
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {data.category.name}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Explore available products and specifications.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {totalProducts} {totalProducts === 1 ? "product" : "products"} in this category
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {paginatedCatalogProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {(safePage - 1) * PRODUCTS_PER_PAGE + 1}–
              {Math.min(safePage * PRODUCTS_PER_PAGE, totalProducts)}
            </span>{" "}
            of <span className="font-semibold text-slate-900">{totalProducts}</span> products
          </p>
          <div className="flex items-center gap-1">
            {safePage > 1 ? (
              <Link href={buildHref({ page: safePage - 1 })} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-300 hover:text-blue-700 active:scale-95" aria-label="Previous">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              </Link>
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 text-slate-300">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              </span>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
              .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                if (idx > 0 && (arr[idx - 1] as number) < p - 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "…" ? (
                  <span key={`el-${idx}`} className="flex h-9 w-9 items-center justify-center text-sm text-slate-400">…</span>
                ) : (
                  <Link key={item} href={buildHref({ page: item as number })}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition active:scale-95 ${safePage === item ? "bg-slate-900 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700"}`}
                  >
                    {item}
                  </Link>
                ),
              )}
            {safePage < totalPages ? (
              <Link href={buildHref({ page: safePage + 1 })} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-300 hover:text-blue-700 active:scale-95" aria-label="Next">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </Link>
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 text-slate-300">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}