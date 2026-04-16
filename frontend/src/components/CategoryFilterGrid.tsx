"use client";

import { useMemo, useState } from "react";
import { CategoryCard } from "@/components/CategoryCard";

type CategoryFilterItem = {
  id: number;
  href: string;
  title: string;
  image: string;
  count?: number;
};

type Props = {
  items: CategoryFilterItem[];
  initialQuery?: string;
  emptyMessage?: string;
};

export function CategoryFilterGrid({ items, initialQuery = "", emptyMessage }: Props) {
  const [query, setQuery] = useState(initialQuery);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return items;
    }

    return items.filter((item) => item.title.toLowerCase().includes(normalized));
  }, [items, query]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700">Search categories</p>
          <p className="text-xs text-slate-500">Start typing to filter the list instantly.</p>
        </div>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by category name"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 sm:w-72"
        />
      </div>

      {filteredItems.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((category) => (
            <CategoryCard
              key={category.id}
              href={category.href}
              title={category.title}
              image={category.image}
              count={category.count}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
          {emptyMessage ?? "No categories match your search yet."}
        </div>
      )}
    </div>
  );
}
