import { prisma } from "@/lib/prisma";
import { preferredCategories } from "@/lib/category-config";
import type { Product } from "@/lib/types";

export async function getCategoriesData() {
  try {
    return await prisma.category.findMany({
      where: {
        slug: { in: preferredCategories.map((category) => category.slug) },
      },
      include: {
        _count: { select: { products: true } },
      },
    });
  } catch {
    return [];
  }
}

export async function getCategoryProductsData(categorySlug: string) {
  let category;
  try {
    category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });
  } catch {
    return null;
  }

  if (!category) {
    return null;
  }

  try {
    const products = await prisma.product.findMany({
      where: { categoryId: category.id },
      include: { category: true },
      orderBy: { name: "asc" },
    });

    return { category, products };
  } catch {
    return null;
  }
}

export async function getProductsData(search?: string) {
  const normalizedSearch = search?.trim();

  try {
    return await prisma.product.findMany({
      where: normalizedSearch
        ? {
            OR: [
              { name: { contains: normalizedSearch, mode: "insensitive" } },
              { description: { contains: normalizedSearch, mode: "insensitive" } },
              { category: { name: { contains: normalizedSearch, mode: "insensitive" } } },
              { category: { slug: { contains: normalizedSearch, mode: "insensitive" } } },
            ],
          }
        : undefined,
      include: { category: true },
      orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
    });
  } catch {
    return [];
  }
}

export async function getProductData(
  categorySlug: string,
  productSlug: string,
): Promise<Product | null> {
  try {
    const row = await prisma.product.findFirst({
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
    return row as Product | null;
  } catch {
    return null;
  }
}

