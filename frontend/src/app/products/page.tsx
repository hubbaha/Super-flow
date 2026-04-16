import { CategoryFilterGrid } from "@/components/CategoryFilterGrid";
import { getCategories } from "@/lib/api";
import { siteAssets } from "@/lib/site-assets";

type Props = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const categories = await getCategories();
  const initialQuery = params.search ?? "";
  const categoryItems = categories.map((category) => ({
    id: category.id,
    href: `/categories/${category.slug}`,
    title: category.name,
    image:
      siteAssets.categories[category.slug as keyof typeof siteAssets.categories] ??
      "/images/carousel/hero-01.jpg",
    count: category._count?.products,
  }));

  return (
    <section className="space-y-10">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold">Products</h1>
        <p className="mt-2 max-w-2xl text-slate-200">
          Browse our full Super flow PVC catalog by category.
        </p>
      </div>

      <CategoryFilterGrid
        items={categoryItems}
        initialQuery={initialQuery}
        emptyMessage="No category matched your navbar search."
      />
    </section>
  );
}
