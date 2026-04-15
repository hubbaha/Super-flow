"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminInquiries,
  getAdminProducts,
  getCategories,
} from "@/lib/api";
import { Category, Inquiry, Product } from "@/lib/types";

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) {
      router.push("/admin/login");
      return;
    }
    Promise.all([getAdminProducts(t), getAdminInquiries(t), getCategories()])
      .then(([p, i, c]) => {
        setProducts(p);
        setInquiries(i);
        setCategories(c);
      })
      .catch(() => router.push("/admin/login"));
  }, [router]);

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = localStorage.getItem("adminToken");
    if (!token) return;
    const fd = new FormData(event.currentTarget);

    await createAdminProduct(token, {
      name: String(fd.get("name")),
      description: String(fd.get("description")),
      image: String(fd.get("image")) || undefined,
      categoryId: Number(fd.get("categoryId")),
      specs: [{ key: "Standard", value: String(fd.get("standard")) }],
      tables: [
        {
          size: String(fd.get("size")),
          diameter: String(fd.get("diameter")),
          thickness: String(fd.get("thickness")),
        },
      ],
    });

    const refreshed = await getAdminProducts(token);
    setProducts(refreshed);
    event.currentTarget.reset();
  }

  async function onDelete(id: number) {
    const token = localStorage.getItem("adminToken");
    if (!token) return;
    await deleteAdminProduct(token, id);
    const refreshed = await getAdminProducts(token);
    setProducts(refreshed);
  }

  return (
    <section className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Add Product</h2>
        <form onSubmit={onCreate} className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="name" required placeholder="Product name" className="rounded border border-slate-300 px-3 py-2" />
          <select name="categoryId" required className="rounded border border-slate-300 px-3 py-2">
            <option value="">Select category</option>
            {categories.map((c) => (
              <option value={c.id} key={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input name="image" placeholder="Image URL" className="rounded border border-slate-300 px-3 py-2 md:col-span-2" />
          <textarea name="description" required placeholder="Description" className="rounded border border-slate-300 px-3 py-2 md:col-span-2" />
          <input name="standard" required placeholder="ASTM Standard" className="rounded border border-slate-300 px-3 py-2" />
          <input name="size" required placeholder="Size" className="rounded border border-slate-300 px-3 py-2" />
          <input name="diameter" required placeholder="Diameter" className="rounded border border-slate-300 px-3 py-2" />
          <input name="thickness" required placeholder="Thickness" className="rounded border border-slate-300 px-3 py-2" />
          <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white md:col-span-2">
            Create Product
          </button>
        </form>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Products</h2>
        <div className="mt-4 space-y-2">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between rounded border border-slate-100 p-3">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-slate-500">{product.category.name}</p>
              </div>
              <button
                onClick={() => onDelete(product.id)}
                className="rounded bg-red-600 px-3 py-1 text-sm text-white"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Inquiries</h2>
        <div className="mt-4 space-y-3">
          {inquiries.map((inq) => (
            <div key={inq.id} className="rounded border border-slate-100 p-3">
              <p className="font-medium">{inq.name} ({inq.email})</p>
              <p className="text-sm text-slate-500">Buyer type: {inq.buyerType}</p>
              <p className="mt-2 text-sm">{inq.message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
