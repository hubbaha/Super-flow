"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  tags: string[];
  selectedTag?: string;
};

export function CategoryFilterChips({ tags, selectedTag }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getHref = (tag?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!tag) {
      params.delete("tag");
    } else {
      params.set("tag", tag);
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={getHref(undefined)}
        className={`rounded-full border px-3 py-1.5 text-sm transition ${
          !selectedTag
            ? "border-slate-900 bg-slate-900 text-white"
            : "border-slate-300 text-slate-700 hover:border-blue-300 hover:text-blue-700"
        }`}
      >
        All
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={getHref(tag)}
          className={`rounded-full border px-3 py-1.5 text-sm transition ${
            selectedTag === tag
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-300 text-slate-700 hover:border-blue-300 hover:text-blue-700"
          }`}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
