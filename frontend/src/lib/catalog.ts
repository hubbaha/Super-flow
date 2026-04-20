import { prisma } from "@/lib/prisma";

export async function getCategoriesData() {
  try {
    return await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
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

export async function getProductData(categorySlug: string, productSlug: string) {
  try {
    return await prisma.product.findFirst({
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
  } catch {
    return null;
  }
}

