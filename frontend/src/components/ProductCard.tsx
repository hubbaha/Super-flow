import Link from "next/link";
import { Product } from "@/lib/types";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
      <p className="mt-2 min-h-16 text-sm text-slate-600">{product.description}</p>
      <Link
        href={`/products/${product.category.slug}/${product.slug}`}
        className="mt-4 inline-block rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        View Details
      </Link>
    </div>
  );
}
