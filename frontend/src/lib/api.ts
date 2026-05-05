import { Category, Inquiry, Product, Specification } from "./types";

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
    credentials: "include",
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!response.ok) {
    const errorBody = isJson ? await response.json().catch(() => null) : null;
    const message =
      errorBody && typeof errorBody.message === "string"
        ? errorBody.message
        : `API request failed: ${response.status}`;
    throw new Error(message);
  }

  // Some successful endpoints (e.g. DELETE 204) return no body.
  if (response.status === 204 || response.status === 205 || !isJson) {
    return undefined as T;
  }

  return (await response.json()) as T;
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

function getAuthHeaders(token?: string) {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export async function adminLogout() {
  return request<{ success: boolean }>("/auth/logout", {
    method: "POST",
  });
}

export async function getAdminProducts(token?: string, options?: { syncFromJson?: boolean }) {
  const query = options?.syncFromJson ? "?sync=1" : "";
  return request<Product[]>(`/admin/products${query}`, {
    headers: getAuthHeaders(token),
  });
}

export async function getAdminInquiries(token?: string) {
  return request<Inquiry[]>("/admin/inquiries", {
    headers: getAuthHeaders(token),
  });
}

export async function uploadAdminProductImage(token: string | undefined, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${getApiBase()}/admin/upload`, {
    method: "POST",
    headers: getAuthHeaders(token),
    credentials: "include",
    body: formData,
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message =
      body && typeof body.message === "string" ? body.message : `Upload failed: ${response.status}`;
    throw new Error(message);
  }

  return body as { url: string };
}

export async function createAdminProduct(
  token: string | undefined,
  payload: {
    name: string;
    description: string;
    image?: string;
    categoryId: number;
    specs: Specification[];
    tables: Array<{ size?: string; od_mm?: string; weight_kg?: string }>;
  },
) {
  return request<Product>("/admin/products", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminProduct(token: string | undefined, id: number) {
  return request(`/admin/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
}
