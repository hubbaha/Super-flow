import { prisma } from "@/lib/prisma";

export async function getCategoriesData() {
  return prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  });
}

export async function getCategoryProductsData(categorySlug: string) {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    return null;
  }

  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
    include: { category: true },
    orderBy: { name: "asc" },
  });

  return { category, products };
}

export async function getProductData(categorySlug: string, productSlug: string) {
  return prisma.product.findFirst({
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
}

