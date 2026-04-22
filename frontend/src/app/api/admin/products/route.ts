import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { verifyAdminToken } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const admin = verifyAdminToken(req.headers.get("authorization"));
  if (!admin) return Response.json({ message: "Invalid token" }, { status: 401 });

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
}