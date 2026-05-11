import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { prismaErrorCode } from "@/lib/prisma-error-code";
import { slugify } from "@/lib/slugify";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { adminTableInputToCreateRows, type AdminTableInputRow } from "@/lib/admin-product-tables";

export const runtime = "nodejs";

type SpecsInput = { key: string; value: string };

type UpsertProductInput = {
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

function normalizeSpecs(body: UpsertProductInput) {
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  const admin = verifyAdminRequest(req);
  if (!admin) return Response.json({ message: "Invalid token" }, { status: 401 });

  const { productId } = await params;
  const id = Number(productId);
  if (!Number.isFinite(id) || id <= 0) {
    return Response.json({ message: "Invalid product id" }, { status: 400 });
  }

  const body = (await req.json().catch(() => null)) as UpsertProductInput | null;
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

  const specs = normalizeSpecs(body);
  const tableRows = adminTableInputToCreateRows(body.tables);
  const columnLabels = parseColumnLabels(body.technicalTableColumnLabels);
  const tableTitle =
    typeof body.technicalTableTitle === "string" ? body.technicalTableTitle.trim() : undefined;

  await prisma.specification.deleteMany({ where: { productId: id } });
  await prisma.technicalTable.deleteMany({ where: { productId: id } });

  const data = {
    name: body.name.trim(),
    slug: slugify(body.name.trim()),
    description: body.description.trim(),
    image: body.image === undefined ? undefined : body.image ?? null,
    category: { connect: { id: categoryId } },
    specs: { create: specs.map((s) => ({ key: s.key, value: s.value })) },
    tables: {
      create: tableRows.map((t) => ({
        size: t.size || null,
        od_mm: t.od_mm || null,
        weight_kg: t.weight_kg || null,
        data: t.data,
      })),
    },
    ...(tableTitle !== undefined
      ? { technicalTableTitle: tableTitle.length ? tableTitle : null }
      : {}),
    ...(columnLabels !== undefined
      ? {
          technicalTableColumnLabels:
            columnLabels === null
              ? null
              : Object.keys(columnLabels).length
                ? columnLabels
                : null,
        }
      : {}),
  } as Parameters<typeof prisma.product.update>[0]["data"];

  try {
    const product = await prisma.product.update({
      where: { id },
      data,
      include: { specs: true, tables: true, category: true },
    });
    return Response.json(product);
  } catch (error: unknown) {
    const code = prismaErrorCode(error);
    if (code === "P2002") {
      return Response.json(
        {
          message:
            "That name produces a URL slug already used by another product. Try a slightly different name.",
        },
        { status: 409 },
      );
    }
    if (code === "P2003") {
      return Response.json({ message: "Invalid category selected." }, { status: 400 });
    }
    if (code === "P2025") {
      return Response.json({ message: "Product not found." }, { status: 404 });
    }
    console.error("admin PUT /products/[id]", error);
    return Response.json({ message: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  const admin = verifyAdminRequest(req);
  if (!admin) return Response.json({ message: "Invalid token" }, { status: 401 });

  const { productId } = await params;
  const id = Number(productId);
  if (!Number.isFinite(id) || id <= 0) {
    return Response.json({ message: "Invalid product id" }, { status: 400 });
  }

  await prisma.product.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
