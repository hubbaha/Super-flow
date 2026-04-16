import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { verifyAdminToken } from "@/lib/adminAuth";

export const runtime = "nodejs";

type SpecsInput = { key: string; value: string };
type TablesInput = { size: string; diameter: string; thickness: string };

type CreateProductInput = {
  name: string;
  description: string;
  image?: string | null;
  categoryId: number;
  specs?: SpecsInput[];
  tables?: TablesInput[];
};

export async function GET(_req: NextRequest) {
  const products = await prisma.product.findMany({
    include: { category: true, specs: true, tables: true },
    orderBy: { name: "asc" },
  });

  return Response.json(products);
}

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

  const product = await prisma.product.create({
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
    include: { category: true, specs: true, tables: true },
  });

  return Response.json(product, { status: 201 });
}

