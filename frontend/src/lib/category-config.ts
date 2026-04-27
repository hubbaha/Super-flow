export const preferredCategories: Array<{ slug: string; name: string }> = [
  { slug: "pvc-pipes", name: "PVC PIPES" },
  { slug: "pvc-fittings", name: "PVC FITTINGS" },
  { slug: "pvc-valve", name: "PVC VALVE" },
  { slug: "pvc-disc-filters-and-strainers", name: "PVC DISC FILTERS AND STRAINERS" },
  {
    slug: "bs-standard-female-threaded-fittings",
    name: "BS STANDARD FEMALE THREADED FITTINGS",
  },
];

export function getCategoryDisplayName(categorySlug: string) {
  const matched = preferredCategories.find((category) => category.slug === categorySlug);
  if (matched) {
    return matched.name;
  }

  return categorySlug.replace(/-/g, " ").toUpperCase();
}
