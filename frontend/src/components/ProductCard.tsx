import Link from "next/link";
import { Product } from "@/lib/types";

type ProductCardProduct = Pick<Product, "id" | "name" | "slug" | "description" | "image" | "category">;

type Props = {
  product: ProductCardProduct;
};

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "").trim();
}

export function ProductCard({ product }: Props) {
  const descriptionText = stripHtml(product.description);
  const imageSrc = product.image?.trim() || `/images/products/${product.slug}.jpg`;

  return (
    <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
      {imageSrc ? (
        <div className="overflow-hidden">
          <img
            src={imageSrc}
            alt={product.name}
            className="h-70 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex h-52 w-full items-center justify-center bg-slate-100">
          <svg className="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </div>
      )}

      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 transition group-hover:text-blue-700">{product.name}</h3>
        <p className="mt-2 min-h-16 text-sm leading-6 text-slate-600">{descriptionText}</p>
        <Link
          href={`/products/${product.category.slug}/${product.slug}`}
          className="mt-4 inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
