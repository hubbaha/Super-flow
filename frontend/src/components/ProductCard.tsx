import Link from "next/link";
import { Product } from "@/lib/types";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
      <h3 className="text-lg font-semibold text-slate-900 transition group-hover:text-blue-700">{product.name}</h3>
      <p className="mt-2 min-h-16 text-sm leading-6 text-slate-600">{product.description}</p>
      <Link
        href={`/products/${product.category.slug}/${product.slug}`}
        className="mt-4 inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        View Details →
      </Link>
    </div>
  );
}
