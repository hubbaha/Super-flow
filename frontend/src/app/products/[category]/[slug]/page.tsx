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
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <article className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-64 w-full rounded object-cover" />
          ) : (
            <div className="flex h-64 items-center justify-center rounded bg-slate-100">No image</div>
          )}
          <h1 className="mt-4 text-3xl font-bold">{product.name}</h1>
          <p className="mt-2 text-slate-600">{product.description}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Specifications</h2>
          <SpecTable specs={product.specs} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Technical Data</h2>
          <DataTable rows={product.tables} />
        </div>
      </article>

      <aside>
        <InquiryForm />
      </aside>
    </section>
  );
}
