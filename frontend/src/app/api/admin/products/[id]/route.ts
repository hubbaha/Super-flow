import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { verifyAdminToken } from "@/lib/adminAuth";

export const runtime = "nodejs";

type SpecsInput = { key: string; value: string };
type TablesInput = { size: string; diameter: string; thickness: string };

type UpsertProductInput = {
  name: string;
  description: string;
  image?: string | null;
  categoryId: number;
  specs?: SpecsInput[];
  tables?: TablesInput[];
};

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = verifyAdminToken(req.headers.get("authorization"));
  if (!admin) return Response.json({ message: "Invalid token" }, { status: 401 });

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id) || id <= 0) {
    return Response.json({ message: "Invalid product id" }, { status: 400 });
  }

  const body = (await req.json().catch(() => null)) as UpsertProductInput | null;
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

  await prisma.specification.deleteMany({ where: { productId: id } });
  await prisma.technicalTable.deleteMany({ where: { productId: id } });

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: body.name,
      slug: slugify(body.name),
      description: body.description,
      image: body.image ?? null,
      categoryId: Number(body.categoryId),
      specs: { create: body.specs.map((s) => ({ key: s.key, value: s.value })) },
      tables: {
        create: body.tables.map((t) => ({
          size: t.size,
          diameter: t.diameter,
          thickness: t.thickness,
        })),
      },
    },
    include: { specs: true, tables: true, category: true },
  });

  return Response.json(product);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = verifyAdminToken(req.headers.get("authorization"));
  if (!admin) return Response.json({ message: "Invalid token" }, { status: 401 });

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id) || id <= 0) {
    return Response.json({ message: "Invalid product id" }, { status: 400 });
  }

  await prisma.product.delete({ where: { id } });
  return new Response(null, { status: 204 });
}

