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
  const product = await getProductData(categorySlug, productSlug);

  if (!product) {
    const referenceProduct = await getReferenceProduct(categorySlug, productSlug);
    if (!referenceProduct) notFound();

    // Resolve the display category slug — always show merged page in breadcrumb
    const displayCategorySlug =
      referenceProduct.categorySlug === "pvc-disc-filter" ||
      referenceProduct.categorySlug === "pvc-strainer"
        ? "pvc-disc-filters-and-strainers"
        : referenceProduct.categorySlug;
  
    const images = referenceProduct.images?.length
      ? referenceProduct.images
      : referenceProduct.image
      ? [referenceProduct.image]
      : [];
  
    return (
      <section className="w-full min-w-0 space-y-6 overflow-hidden px-4 sm:px-6 lg:px-0">
        <ProductBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            {
              label: getCategoryDisplayName(displayCategorySlug),
              href: `/categories/${displayCategorySlug}`,  // ✅ points to merged page
            },
            { label: referenceProduct.name },
          ]}
        />
  
        <div className="grid gap-8 overflow-hidden lg:grid-cols-[2fr_1fr]">
          <article className="min-w-0 space-y-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
  
              {/* ✅ Multi-image support */}
              {images.length > 1 ? (
                <div className="grid grid-cols-2 gap-1">
                  {images.map((src, idx) => (
                    <ImageLightbox
                      key={idx}
                      src={src}
                      alt={`${referenceProduct.name} ${idx + 1}`}
                      className={`w-full object-cover ${
                        images.length === 2 ? "h-72 sm:h-80 lg:h-96" : "h-56 sm:h-64"
                      }`}
                    />
                  ))}
                </div>
              ) : images.length === 1 ? (
                <ImageLightbox
                  src={images[0]}
                  alt={referenceProduct.name}
                  className="h-100 w-full object-cover sm:h-100 lg:h-140"
                />
              ) : (
                <div className="flex h-70 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 sm:h-72 lg:h-80">
                  <svg className="h-14 w-14 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
              )}
  
              <div className="p-4 sm:p-7">
                <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
                  {getCategoryDisplayName(displayCategorySlug)}
                </span>
                <h1 className="mt-3 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
                  {referenceProduct.name}
                </h1>
                <div
                  className="prose prose-slate mt-4 max-w-none break-words text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: referenceProduct.descriptionHtml }}
                />
              </div>
            </div>
  
            {referenceProduct.specs?.length ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Specifications</h2>
                <div className="overflow-x-auto">
                  <SpecTable specs={referenceProduct.specs} />
                </div>
              </div>
            ) : null}
  
            {referenceProduct.tables?.length ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Product Size Table</h2>
                <div className="overflow-x-auto">
                  <DataTable rows={referenceProduct.tables} />
                </div>
              </div>
            ) : null}
          </article>
  
          <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
            <InquiryForm />
          </aside>
        </div>
      </section>
    );
  }

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