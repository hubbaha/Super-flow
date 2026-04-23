import { DataTable } from "@/components/DataTable";
import { InquiryForm } from "@/components/InquiryForm";
import { ProductBreadcrumbs } from "@/components/ProductBreadcrumbs";
import { SpecTable } from "@/components/SpecTable";
import { getProductData } from "@/lib/catalog";
import { getCategoryDisplayName } from "@/lib/category-config";
import { getReferenceProduct } from "@/lib/reference-products";
import { notFound } from "next/navigation";
import { ImageLightbox } from "@/components/ImageLightbox";

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
      <section className="w-full min-w-0 space-y-6 overflow-hidden px-4 sm:px-6 lg:px-0">
        <ProductBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: getCategoryDisplayName(categorySlug), href: `/categories/${categorySlug}` },
            { label: referenceProduct.name },
          ]}
        />

        {/* FIX 1: overflow-hidden on grid, min-w-0 on article prevents grid blowout */}
        <div className="grid gap-8 overflow-hidden lg:grid-cols-[2fr_1fr]">
          <article className="min-w-0 space-y-6">
          {/* Main Product Card */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {referenceProduct.image ? (
                  <ImageLightbox 
                    src={referenceProduct.image} 
                    alt={referenceProduct.name}
                    className="h-100 w-full object-cover sm:h-100 lg:h-140"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 sm:h-72 lg:h-80">
                    <svg className="h-14 w-14 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </div>
                )}
              {/* FIX 3: p-7 → p-4 sm:p-7 so padding isn't too large on small screens */}
              <div className="p-4 sm:p-7">
                <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
                  {getCategoryDisplayName(categorySlug)}
                </span>
                {/* FIX 4: text-3xl → text-xl sm:text-2xl lg:text-3xl so title doesn't overflow on mobile */}
                <h1 className="mt-3 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
                  {referenceProduct.name}
                </h1>
                {/* FIX 5: prose max-w-none ensures description doesn't overflow its container */}
                <div
                  className="prose prose-slate mt-4 max-w-none break-words text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: referenceProduct.descriptionHtml }}
                />
              </div>
            </div>

            {/* Specs */}
            {referenceProduct.specs?.length ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Specifications
                </h2>
                {/* FIX 6: overflow-x-auto wrapper allows table to scroll horizontally on mobile */}
                <div className="overflow-x-auto">
                  <SpecTable specs={referenceProduct.specs} />
                </div>
              </div>
            ) : null}

            {/* Technical Data */}
            {referenceProduct.tables?.length ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Product Size Table
                </h2>
                {/* FIX 7: overflow-x-auto wrapper allows data table to scroll horizontally on mobile */}
                <div className="overflow-x-auto">
                  <DataTable rows={referenceProduct.tables} />
                </div>
              </div>
            ) : null}
          </article>

          {/* FIX 8: aside only gets sticky behaviour on lg+, stacks normally on mobile */}
          <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
            <InquiryForm />
          </aside>
        </div>
      </section>
    );
  }

  const product = await getProductData(categorySlug, productSlug);
  if (!product) notFound();

  return (
    <section className="w-full min-w-0 space-y-6 overflow-hidden px-4 sm:px-6 lg:px-0">
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

      <div className="grid gap-8 overflow-hidden lg:grid-cols-[2fr_1fr]">
        <article className="min-w-0 space-y-6">
         {/* Main Product Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {product.image ? (
                <ImageLightbox 
                  src={product.image} 
                  alt={product.name}
                  className="h-80 w-full object-cover sm:h-80 lg:h-80"
                />
              ) : (
                <div className="flex h-80 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 sm:h-80 lg:h-80">
                  <svg className="h-14 w-14 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
  )}
            <div className="p-4 sm:p-7">
              <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
                {getCategoryDisplayName(product.category.slug)}
              </span>
              <h1 className="mt-3 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
                {product.name}
              </h1>
              <p className="mt-3 break-words text-sm leading-relaxed text-slate-600">{product.description}</p>
            </div>
          </div>

          {/* Specs */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Specifications
            </h2>
            <div className="overflow-x-auto">
              <SpecTable specs={product.specs} />
            </div>
          </div>

          {/* Technical Data */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Product Size Table
            </h2>
            <div className="overflow-x-auto">
              <DataTable rows={product.tables} />
            </div>
          </div>
        </article>

        <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
          <InquiryForm />
        </aside>
      </div>
    </section>
  );
}