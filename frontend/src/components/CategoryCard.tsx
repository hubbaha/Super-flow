import Link from "next/link";

type Props = {
  href: string;
  title: string;
  image: string;
  count?: number;
};

export function CategoryCard({ href, title, image, count }: Props) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-2 p-5">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{count ?? 0} products available</p>
      </div>
    </Link>
  );
}
