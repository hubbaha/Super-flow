import { Category, Inquiry, Product, Specification, TechnicalTable } from "./types";

function getApiBase() {
  const envBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envBase) {
    return envBase;
  }

  return "/api";
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiBase()}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getCategories() {
  return request<Category[]>("/categories");
}

export async function getCategoryProducts(categorySlug: string) {
  return request<{ category: Category; products: Product[] }>(
    `/categories/${categorySlug}/products`,
  );
}

export async function getProduct(categorySlug: string, productSlug: string) {
  return request<Product>(`/products/${categorySlug}/${productSlug}`);
}

export async function createInquiry(data: {
  name: string;
  email: string;
  message: string;
  buyerType: string;
}) {
  return request("/inquiries", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function adminLogin(email: string, password: string) {
  return request<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getAdminProducts(token: string) {
  return request<Product[]>("/admin/products", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getAdminInquiries(token: string) {
  return request<Inquiry[]>("/admin/inquiries", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createAdminProduct(
  token: string,
  payload: {
    name: string;
    description: string;
    image?: string;
    categoryId: number;
    specs: Specification[];
    tables: TechnicalTable[];
  },
) {
  return request<Product>("/admin/products", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminProduct(token: string, id: number) {
  return request(`/admin/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
