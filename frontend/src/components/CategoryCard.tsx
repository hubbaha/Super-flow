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
      <div className="flex items-center justify-between p-5">
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition">
          {title}
        </h3>
        {typeof count === "number" && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
            {count} {count === 1 ? "item" : "items"}
          </span>
        )}
      </div>
    </Link>
  );
}