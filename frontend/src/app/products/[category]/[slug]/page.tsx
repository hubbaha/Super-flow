import { DataTable } from "@/components/DataTable";
import { InquiryForm } from "@/components/InquiryForm";
import { SpecTable } from "@/components/SpecTable";
import { getProduct } from "@/lib/api";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const product = await getProduct(category, slug);

  return (
    <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <article className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-72 w-full rounded-xl object-cover" />
          ) : (
            <div className="flex h-72 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              No image
            </div>
          )}
          <h1 className="mt-5 text-3xl font-bold text-slate-900">{product.name}</h1>
          <p className="mt-2 text-slate-600">{product.description}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">Specifications</h2>
          <SpecTable specs={product.specs} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">Technical Data</h2>
          <DataTable rows={product.tables} />
        </div>
      </article>

      <aside>
        <InquiryForm />
      </aside>
    </section>
  );
}
