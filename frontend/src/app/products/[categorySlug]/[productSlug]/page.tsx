import { DataTable } from "@/components/DataTable";
import { InquiryForm } from "@/components/InquiryForm";
import { ProductBreadcrumbs } from "@/components/ProductBreadcrumbs";
import { SpecTable } from "@/components/SpecTable";
import { getProductData } from "@/lib/catalog";
import { getCategoryDisplayName } from "@/lib/category-config";
import { getReferenceProduct } from "@/lib/reference-products";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ categorySlug: string; productSlug: string }>;
}) {
  const { categorySlug, productSlug } = await params;
  const referenceProduct = await getReferenceProduct(categorySlug, productSlug);

  if (referenceProduct) {
    return (
      <section className="space-y-6">
        <ProductBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: getCategoryDisplayName(categorySlug), href: `/categories/${categorySlug}` },
            { label: referenceProduct.name },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <article className="space-y-6">
            {/* Main Product Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {referenceProduct.image ? (
                <div className="overflow-hidden">
                  <img
                    src={referenceProduct.image}
                    alt={referenceProduct.name}
                    className="h-140 w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex h-80 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                  <svg className="h-14 w-14 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
              )}
              <div className="p-7">
                <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
                  {getCategoryDisplayName(categorySlug)}
                </span>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  {referenceProduct.name}
                </h1>
                <div
                  className="prose prose-slate mt-4 max-w-none text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: referenceProduct.descriptionHtml }}
                />
              </div>
            </div>

            {/* Specs */}
            {referenceProduct.specs?.length ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Specifications
                </h2>
                <SpecTable specs={referenceProduct.specs} />
              </div>
            ) : null}

            {/* Technical Data */}
            {referenceProduct.tables?.length ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Product Size Table
                </h2>
                <DataTable rows={referenceProduct.tables} />
              </div>
            ) : null}
          </article>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <InquiryForm />
          </aside>
        </div>
      </section>
    );
  }

  const product = await getProductData(categorySlug, productSlug);
  if (!product) notFound();

  return (
    <section className="space-y-6">
      <ProductBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          {
            label: getCategoryDisplayName(product.category.slug),
            href: `/categories/${product.category.slug}`,
          },
          { label: product.name },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <article className="space-y-6">
          {/* Main Product Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {product.image ? (
              <div className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-80 w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ) : (
              <div className="flex h-80 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                <svg className="h-14 w-14 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
            )}
            <div className="p-7">
              <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
                {getCategoryDisplayName(product.category.slug)}
              </span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                {product.name}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{product.description}</p>
            </div>
          </div>

          {/* Specs */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Specifications
            </h2>
            <SpecTable specs={product.specs} />
          </div>

          {/* Technical Data */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Product Size Table
            </h2>
            <DataTable rows={product.tables} />
          </div>
        </article>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <InquiryForm />
        </aside>
      </div>
    </section>
  );
}