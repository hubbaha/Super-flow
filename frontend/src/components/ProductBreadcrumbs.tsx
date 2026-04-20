import Link from "next/link";

type Props = {
  items: Array<{ label: string; href?: string }>;
};

export function ProductBreadcrumbs({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition hover:text-blue-700">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-medium text-slate-700" : ""}>{item.label}</span>
              )}
              {!isLast ? <span aria-hidden>/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
