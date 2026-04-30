import type { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { verifyAdminToken } from "@/lib/adminAuth";
import { getReferenceProducts } from "@/lib/reference-products";

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
            .map((t) => ({
              size: (t.size ?? "").toString().trim(),
              od_mm: (t.od_mm ?? t.diameter ?? "").toString().trim(),
              weight_kg: (t.weight_kg ?? "").toString().trim(),
            }))
            .filter((t) => t.size),
        },
      },
    });
  }
}

export async function GET(req: NextRequest) {
  const admin = verifyAdminToken(req.headers.get("authorization"));
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
type TablesInput = {
  size?: string;
  od_mm?: string;
  weight_kg?: string;
  diameter?: string; // fallback only
};

type CreateProductInput = {
  name: string;
  description: string;
  image?: string | null;
  categoryId: number;
  specs?: SpecsInput[];
  tables?: TablesInput[];
};

export async function POST(req: NextRequest) {
  const admin = verifyAdminToken(req.headers.get("authorization"));
  if (!admin) return Response.json({ message: "Invalid token" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as CreateProductInput | null;
  if (
    !body ||
    typeof body.name !== "string" ||
    typeof body.description !== "string" ||
    typeof body.categoryId !== "number" ||
    !Array.isArray(body.specs) ||
    !Array.isArray(body.tables)
  ) {
    return Response.json({ message: "Invalid request body" }, { status: 400 });
  }

  if (!body.name.trim() || !body.description.trim()) {
    return Response.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: slugify(body.name),
        description: body.description,
        image: body.image ?? null,
        categoryId: Number(body.categoryId),
        specs: {
          create: body.specs.map((s) => ({ key: s.key, value: s.value })),
        },
        tables: {
          create: body.tables
            .map((t) => ({
              size: t.size?.trim() || "",
              od_mm: (t.od_mm ?? t.diameter ?? "").toString().trim(),
              weight_kg: (t.weight_kg ?? "").toString().trim(),
            }))
            .filter((t) => t.size),
        },
      },
      include: { specs: true, tables: true, category: true },
    });

    return Response.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return Response.json(
          { message: "A product with this name already exists." },
          { status: 409 },
        );
      }
      if (error.code === "P2003") {
        return Response.json({ message: "Invalid category selected." }, { status: 400 });
      }
    }
    console.error("Failed to create product", error);
    return Response.json({ message: "Failed to create product" }, { status: 500 });
  }
}