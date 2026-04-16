import { ProductCard } from "@/components/ProductCard";
import { getCategoryProductsData } from "@/lib/catalog";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCategoryProductsData(slug);
  if (!data) {
    notFound();
  }

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">{data.category.name}</h1>
        <p className="mt-2 text-slate-600">Explore available products and specifications.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
