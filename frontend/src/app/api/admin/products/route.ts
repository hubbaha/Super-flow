import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { prismaErrorCode } from "@/lib/prisma-error-code";
import { slugify } from "@/lib/slugify";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { getReferenceProducts } from "@/lib/reference-products";
import { adminTableInputToCreateRows, type AdminTableInputRow } from "@/lib/admin-product-tables";

export const runtime = "nodejs";

const LEGACY_DISC_CATEGORY_SLUGS = ["pvc-disc-filter", "pvc-strainer"] as const;
const MERGED_DISC_CATEGORY = {
  slug: "pvc-disc-filters-and-strainers",
  name: "PVC DISC FILTERS AND STRAINERS",
};

function titleizeSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeCategorySlug(slug: string) {
  if (LEGACY_DISC_CATEGORY_SLUGS.includes(slug as (typeof LEGACY_DISC_CATEGORY_SLUGS)[number])) {
    return MERGED_DISC_CATEGORY.slug;
  }
  return slug;
}

function getCategoryNameBySlug(slug: string) {
  if (slug === MERGED_DISC_CATEGORY.slug) return MERGED_DISC_CATEGORY.name;
  return titleizeSlug(slug);
}

async function enforceMergedDiscCategory() {
  const mergedCategory = await prisma.category.upsert({
    where: { slug: MERGED_DISC_CATEGORY.slug },
    update: { name: MERGED_DISC_CATEGORY.name },
    create: MERGED_DISC_CATEGORY,
  });

  const legacyCategories = await prisma.category.findMany({
    where: { slug: { in: [...LEGACY_DISC_CATEGORY_SLUGS] } },
    select: { id: true },
  });

  for (const legacyCategory of legacyCategories) {
    await prisma.product.updateMany({
      where: { categoryId: legacyCategory.id },
      data: { categoryId: mergedCategory.id },
    });
    await prisma.category.delete({ where: { id: legacyCategory.id } });
  }
}

async function syncProductsFromJsonCatalog() {
  const referenceProducts = await getReferenceProducts();

  for (const refProduct of referenceProducts) {
    const normalizedCategorySlug = normalizeCategorySlug(refProduct.categorySlug);
    const category = await prisma.category.upsert({
      where: { slug: normalizedCategorySlug },
      update: { name: getCategoryNameBySlug(normalizedCategorySlug) },
      create: {
        slug: normalizedCategorySlug,
        name: getCategoryNameBySlug(normalizedCategorySlug),
      },
    });

    const existing = await prisma.product.findUnique({
      where: { slug: refProduct.slug },
      select: { id: true },
    });
    if (existing) continue;

    await prisma.product.create({
      data: {
        name: refProduct.name,
        slug: refProduct.slug || slugify(refProduct.name),
        description: refProduct.descriptionHtml,
        image: refProduct.image ?? null,
        categoryId: category.id,
        specs: {
          create: (refProduct.specs ?? []).map((s) => ({ key: s.key, value: s.value })),
        },
        tables: {
          create: (refProduct.tables ?? [])
            .map((t) => {
              const data: Record<string, string> = {};
              for (const [k, v] of Object.entries(t)) {
                if (typeof v === "string" && v.trim()) data[k] = v.trim();
              }
              return {
                size: data.size ?? "",
                od_mm: data.od_mm ?? data.diameter ?? "",
                weight_kg: data.weight_kg ?? "",
                data,
              };
            })
            .filter((row) => row.size),
        },
      },
    });
  }
}

export async function GET(req: NextRequest) {
  const admin = verifyAdminRequest(req);
  if (!admin) return Response.json({ message: "Invalid token" }, { status: 401 });

  await enforceMergedDiscCategory();

  const shouldSync = req.nextUrl.searchParams.get("sync") === "1";
  if (shouldSync) {
    await syncProductsFromJsonCatalog();
    await enforceMergedDiscCategory();
  }

  const products = await prisma.product.findMany({
    include: { category: true, specs: true, tables: true },
    orderBy: { id: "desc" },
  });

  return Response.json(products);
}

type SpecsInput = { key: string; value: string };

type CreateProductInput = {
  name: string;
  description: string;
  image?: string | null;
  categoryId: number;
  specs?: SpecsInput[];
  tables?: AdminTableInputRow[];
  technicalTableTitle?: string | null;
  technicalTableColumnLabels?: Record<string, string> | null;
};

function parseCategoryId(raw: unknown): number | null {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n) || n < 1) return null;
  return Math.floor(n);
}

function normalizeSpecsForCreate(body: CreateProductInput) {
  if (!Array.isArray(body.specs)) return [];
  return body.specs
    .filter(
      (s): s is SpecsInput =>
        Boolean(s) && typeof s.key === "string" && typeof s.value === "string",
    )
    .map((s) => ({ key: s.key.trim(), value: s.value.trim() }))
    .filter((s) => s.key && s.value);
}

function parseColumnLabels(raw: unknown): Record<string, string> | null | undefined {
  if (raw === undefined) return undefined;
  if (raw === null) return null;
  if (typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v === "string" && v.trim()) out[k] = v.trim();
  }
  return out;
}

export async function POST(req: NextRequest) {
  const admin = verifyAdminRequest(req);
  if (!admin) return Response.json({ message: "Invalid token" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as CreateProductInput | null;
  if (
    !body ||
    typeof body.name !== "string" ||
    typeof body.description !== "string" ||
    body.categoryId === undefined ||
    body.categoryId === null ||
    !Array.isArray(body.specs) ||
    !Array.isArray(body.tables)
  ) {
    return Response.json({ message: "Invalid request body" }, { status: 400 });
  }

  const categoryId = parseCategoryId(body.categoryId);
  if (categoryId === null) {
    return Response.json({ message: "Invalid category selected." }, { status: 400 });
  }

  if (!body.name.trim() || !body.description.trim()) {
    return Response.json({ message: "Missing required fields" }, { status: 400 });
  }

  const specs = normalizeSpecsForCreate(body);
  const tableRows = adminTableInputToCreateRows(body.tables);
  const columnLabels = parseColumnLabels(body.technicalTableColumnLabels);
  const tableTitle =
    typeof body.technicalTableTitle === "string" ? body.technicalTableTitle.trim() : "";

  try {
    const product = await prisma.product.create({
      data: {
        name: body.name.trim(),
        slug: slugify(body.name.trim()),
        description: body.description.trim(),
        image: body.image ?? null,
        categoryId,
        technicalTableTitle: tableTitle.length ? tableTitle : null,
        ...(columnLabels && Object.keys(columnLabels).length
          ? { technicalTableColumnLabels: columnLabels }
          : {}),
        specs: {
          create: specs.map((s) => ({ key: s.key, value: s.value })),
        },
        tables: {
          create: tableRows.map((t) => ({
            size: t.size || null,
            od_mm: t.od_mm || null,
            weight_kg: t.weight_kg || null,
            data: t.data,
          })),
        },
      } as Parameters<typeof prisma.product.create>[0]["data"],
      include: { specs: true, tables: true, category: true },
    });

    return Response.json(product, { status: 201 });
  } catch (error: unknown) {
    const code = prismaErrorCode(error);
    if (code === "P2002") {
      return Response.json(
        { message: "A product with this name already exists." },
        { status: 409 },
      );
    }
    if (code === "P2003") {
      return Response.json({ message: "Invalid category selected." }, { status: 400 });
    }
    console.error("Failed to create product", error);
    return Response.json({ message: "Failed to create product" }, { status: 500 });
  }
}