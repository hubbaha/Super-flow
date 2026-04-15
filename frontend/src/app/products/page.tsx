import Link from "next/link";
import { getCategories } from "@/lib/api";
import { siteAssets } from "@/lib/site-assets";

export default async function ProductsPage() {
  const categories = await getCategories();

  return (
    <section className="space-y-8">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="mt-2 text-slate-600">
          Browse our full Super flow PVC catalog by category.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <img
              src={siteAssets.categories[category.slug as keyof typeof siteAssets.categories]}
              alt={category.name}
              className="h-52 w-full object-cover"
            />
            <div className="p-5">
              <h2 className="text-lg font-semibold">{category.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{category._count?.products ?? 0} items</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
