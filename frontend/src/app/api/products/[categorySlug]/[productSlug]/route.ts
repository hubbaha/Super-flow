import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ categorySlug: string; productSlug: string }> },
) {
  const { categorySlug, productSlug } = await params;
  const product = await prisma.product.findFirst({
    where: {
      slug: productSlug,
      category: { slug: categorySlug },
    },
    include: {
      category: true,
      specs: true,
      tables: true,
    },
  });

  if (!product) {
    return Response.json({ message: "Product not found" }, { status: 404 });
  }

  return Response.json(product);
}

