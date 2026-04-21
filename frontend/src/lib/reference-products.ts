import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";

export type ReferenceSpec = {
  key: string;
  value: string;
};

// Flexible — any string keys
export type ReferenceTableRow = Record<string, string>;

export type ReferenceProduct = {
  categorySlug: string;
  name: string;
  slug: string;
  image?: string;
  preview?: string;
  filterTags?: string[];
  descriptionHtml: string;
  specs?: ReferenceSpec[];
  tables?: ReferenceTableRow[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeSpecs(specifications: unknown): ReferenceSpec[] {
  if (!specifications || typeof specifications !== "object") {
    return [];
  }

  return Object.entries(specifications as Record<string, unknown>)
    .filter(([, value]) => typeof value === "string" && value.trim())
    .map(([key, value]) => ({
      key: key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
      value: value as string,
    }));
}

function normalizeTables(input: unknown): ReferenceTableRow[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((row) => {
      if (!row || typeof row !== "object") {
        return null;
      }
      const item = row as Record<string, unknown>;

      // Convert all string values dynamically — no hardcoded columns
      const normalized: ReferenceTableRow = {};
      for (const [key, value] of Object.entries(item)) {
        if (typeof value === "string" && value.trim()) {
          normalized[key] = value.trim();
        } else if (typeof value === "number") {
          normalized[key] = String(value);
        }
      }

      if (Object.keys(normalized).length === 0) {
        return null;
      }

      return normalized;
    })
    .filter((row): row is ReferenceTableRow => row !== null);
}

function deriveTablesFromSpecs(specs: ReferenceSpec[]): ReferenceTableRow[] {
  const sizeSpec = specs.find((spec) => spec.key.toLowerCase() === "size");
  if (!sizeSpec?.value) {
    return [];
  }

  const sizes = sizeSpec.value
    .split(",")
    .map((size) => size.trim())
    .filter(Boolean);

  if (!sizes.length) {
    return [];
  }

  return sizes.map((size) => ({ size }));
}

function normalizeProduct(
  item: Record<string, unknown>,
  inheritedCategorySlug?: string,
): ReferenceProduct | null {
  const name = typeof item.name === "string" ? item.name.trim() : "";
  const slug = typeof item.slug === "string" ? item.slug.trim() : "";
  const description = typeof item.description === "string" ? item.description.trim() : "";
  const descriptionHtml =
    typeof item.descriptionHtml === "string" ? item.descriptionHtml.trim() : "";
  const categorySlug =
    typeof item.categorySlug === "string"
      ? item.categorySlug.trim()
      : inheritedCategorySlug ??
        (typeof item.category === "string" ? slugify(item.category) : "");

  if (!name || !slug || !categorySlug || (!description && !descriptionHtml)) {
    return null;
  }

  const image = typeof item.image === "string" ? item.image : undefined;
  const preview =
    typeof item.preview === "string"
      ? item.preview
      : description
        ? description.slice(0, 140)
        : undefined;
  const filterTags = Array.isArray(item.filterTags)
    ? item.filterTags.filter((tag): tag is string => typeof tag === "string")
    : [];
  const specs = Array.isArray(item.specs)
    ? item.specs.filter(
        (spec): spec is ReferenceSpec =>
          typeof spec === "object" &&
          spec !== null &&
          typeof (spec as ReferenceSpec).key === "string" &&
          typeof (spec as ReferenceSpec).value === "string",
      )
    : normalizeSpecs(item.specifications);

  // Use size_table from JSON first, then fallback to tables, then derive from specs
  const rawTables = item.size_table ?? item.tables;
  const tables = normalizeTables(rawTables);
  const normalizedTables = tables.length ? tables : deriveTablesFromSpecs(specs);

  return {
    categorySlug,
    name,
    slug,
    image,
    preview,
    filterTags,
    descriptionHtml: descriptionHtml || `<p>${description}</p>`,
    specs,
    tables: normalizedTables,
  };
}

const readReferenceProducts = cache(async (): Promise<ReferenceProduct[]> => {
  const filePath = path.join(process.cwd(), "public", "data", "products.json");

  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    if (!fileContent.trim()) {
      return [];
    }

    const parsed = JSON.parse(fileContent) as unknown;

    if (Array.isArray(parsed)) {
      const flatProducts = parsed
        .map((item) =>
          typeof item === "object" && item !== null
            ? normalizeProduct(item as Record<string, unknown>)
            : null,
        )
        .filter((item): item is ReferenceProduct => item !== null);

      if (flatProducts.length) {
        return flatProducts;
      }

      return parsed
        .flatMap((group) => {
          if (typeof group !== "object" || group === null) {
            return [];
          }
          const categorySlug =
            typeof (group as { slug?: unknown }).slug === "string"
              ? ((group as { slug: string }).slug ?? "")
              : "";
          const products = Array.isArray((group as { products?: unknown }).products)
            ? ((group as { products: unknown[] }).products ?? [])
            : [];
          return products.map((item) =>
            typeof item === "object" && item !== null
              ? normalizeProduct(item as Record<string, unknown>, categorySlug)
              : null,
          );
        })
        .filter((item): item is ReferenceProduct => item !== null);
    }

    if (typeof parsed === "object" && parsed !== null) {
      const categorySlug =
        typeof (parsed as { slug?: unknown }).slug === "string"
          ? ((parsed as { slug: string }).slug ?? "")
          : "";
      const products = Array.isArray((parsed as { products?: unknown }).products)
        ? ((parsed as { products: unknown[] }).products ?? [])
        : [];

      return products
        .map((item) =>
          typeof item === "object" && item !== null
            ? normalizeProduct(item as Record<string, unknown>, categorySlug)
            : null,
        )
        .filter((item): item is ReferenceProduct => item !== null);
    }

    return [];
  } catch {
    return [];
  }
});

export async function getReferenceProductsByCategory(categorySlug: string) {
  const products = await readReferenceProducts();
  return products.filter((product) => product.categorySlug === categorySlug);
}

export async function getReferenceProducts() {
  return readReferenceProducts();
}

export async function getReferenceProduct(categorySlug: string, productSlug: string) {
  const products = await readReferenceProducts();
  return products.find(
    (product) => product.categorySlug === categorySlug && product.slug === productSlug,
  );
}