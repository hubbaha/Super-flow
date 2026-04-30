import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { preferredCategories } from "@/lib/category-config";

export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    where: {
      slug: { in: preferredCategories.map((category) => category.slug) },
    },
  });

  const ordered = preferredCategories
    .map((preferred) => categories.find((category) => category.slug === preferred.slug))
    .filter((category): category is (typeof categories)[number] => Boolean(category));

  return Response.json(ordered);
}

