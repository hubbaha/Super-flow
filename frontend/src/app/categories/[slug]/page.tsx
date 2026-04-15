import { ProductCard } from "@/components/ProductCard";
import { getCategoryProducts } from "@/lib/api";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCategoryProducts(slug);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{data.category.name}</h1>
        <p className="mt-2 text-slate-600">Explore available products and specifications.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
