import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return Response.json({ message: "Category not found" }, { status: 404 });
  }

  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
    include: {
      category: true,
      specs: true,
      tables: true,
    },
    orderBy: { name: "asc" },
  });
  return Response.json({ category, products });
}

