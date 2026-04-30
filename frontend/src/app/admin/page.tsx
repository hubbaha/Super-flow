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

type Tab = "products" | "inquiries";

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("products");

  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<number | "">("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Extra spec/table rows state
  const [specs, setSpecs] = useState([{ key: "Standard", value: "" }]);
  const [tables, setTables] = useState([{ size: "", od_mm: "", weight_kg: "" }]);

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }

    Promise.all([getAdminProducts(t), getAdminInquiries(t), getCategories()])
      .then(([p, i, c]) => {
        setProducts(p);
        setInquiries(i);
        setCategories(c);
      })
      .catch(() => router.push("/admin/login"))
      .finally(() => setLoading(false));
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  }

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    setSubmitting(true);
    setFormError("");
    const fd = new FormData(event.currentTarget);

    try {
      await createAdminProduct(token, {
        name: String(fd.get("name")),
        description: String(fd.get("description")),
        image: String(fd.get("image")) || undefined,
        categoryId: Number(fd.get("categoryId")),
        specs: specs.filter((s) => s.key && s.value),
        tables: tables
          .filter((t) => t.size)
          .map((t) => ({ size: t.size, od_mm: t.od_mm, weight_kg: t.weight_kg })),
      });

      const refreshed = await getAdminProducts(token);
      setProducts(refreshed);
      event.currentTarget.reset();
      setSpecs([{ key: "Standard", value: "" }]);
      setTables([{ size: "", od_mm: "", weight_kg: "" }]);
      setShowForm(false);
    } catch {
      setFormError("Failed to create product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    const token = localStorage.getItem("adminToken");
    if (!token) return;
    await deleteAdminProduct(token, id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "" || p.categoryId === filterCat;
    return matchSearch && matchCat;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ── */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo/logo-main.png" alt="Superflow" className="h-7" />
          <span className="text-slate-400">|</span>
          <span className="font-semibold text-slate-700 text-sm">Admin Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="text-sm text-slate-500 hover:text-slate-800">
            View Site ↗
          </a>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Products", value: products.length },
            { label: "Categories", value: categories.length },
            { label: "Inquiries", value: inquiries.length },
            { label: "Status", value: "Live" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-slate-800">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-white rounded-xl shadow-sm p-1 w-fit">
          {(["products", "inquiries"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition ${
                tab === t
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Products Tab ── */}
        {tab === "products" && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex gap-3 flex-wrap">
                <input
                  type="search"
                  placeholder="Search products…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
                />
                <select
                  value={filterCat}
                  onChange={(e) =>
                    setFilterCat(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => { setShowForm((v) => !v); setFormError(""); }}
                className="bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition whitespace-nowrap"
              >
                {showForm ? "Cancel" : "+ Add Product"}
              </button>
            </div>

            {/* Add Product Form */}
            {showForm && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-base font-semibold text-slate-800 mb-4">New Product</h2>
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                    {formError}
                  </div>
                )}
                <form onSubmit={onCreate} className="space-y-5">
                  {/* Basic */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Product Name *</label>
                      <input
                        name="name"
                        required
                        placeholder="e.g. SCH 80 PVC Ball Valve 2 Inch"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Category *</label>
                      <select
                        name="categoryId"
                        required
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select category…</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-600 mb-1">Image Path</label>
                      <input
                        name="image"
                        placeholder="/images/products/my-product.jpg"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-600 mb-1">Description *</label>
                      <textarea
                        name="description"
                        required
                        rows={3}
                        placeholder="Full product description…"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Specs */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-slate-600">Specifications</label>
                      <button
                        type="button"
                        onClick={() => setSpecs((s) => [...s, { key: "", value: "" }])}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        + Add Row
                      </button>
                    </div>
                    <div className="space-y-2">
                      {specs.map((s, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <input
                            value={s.key}
                            onChange={(e) => {
                              const n = [...specs]; n[i].key = e.target.value; setSpecs(n);
                            }}
                            placeholder="Key (e.g. material)"
                            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            value={s.value}
                            onChange={(e) => {
                              const n = [...specs]; n[i].value = e.target.value; setSpecs(n);
                            }}
                            placeholder="Value (e.g. PVC / UPVC)"
                            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))}
                            className="text-slate-400 hover:text-red-500 text-lg leading-none px-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Size Table */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-slate-600">Size Table</label>
                      <button
                        type="button"
                        onClick={() => setTables((t) => [...t, { size: "", od_mm: "", weight_kg: "" }])}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        + Add Row
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs font-medium text-slate-500 px-1 mb-1">
                      <span>Size</span><span>OD (mm)</span><span>Weight (kg)</span>
                    </div>
                    <div className="space-y-2">
                      {tables.map((t, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <input
                            value={t.size}
                            onChange={(e) => {
                              const n = [...tables]; n[i].size = e.target.value; setTables(n);
                            }}
                            placeholder='1/2"'
                            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            value={t.od_mm}
                            onChange={(e) => {
                              const n = [...tables]; n[i].od_mm = e.target.value; setTables(n);
                            }}
                            placeholder="21.3"
                            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            value={t.weight_kg}
                            onChange={(e) => {
                              const n = [...tables]; n[i].weight_kg = e.target.value; setTables(n);
                            }}
                            placeholder="0.08"
                            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setTables(tables.filter((_, idx) => idx !== i))}
                            className="text-slate-400 hover:text-red-500 text-lg leading-none px-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-5 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-700 disabled:opacity-50 rounded-lg transition"
                    >
                      {submitting ? "Creating…" : "Create Product"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Product List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-sm">
                  {search || filterCat ? "No products match your filters." : "No products yet."}
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-3 text-slate-500 font-medium">Product</th>
                      <th className="text-left px-6 py-3 text-slate-500 font-medium hidden md:table-cell">Category</th>
                      <th className="text-left px-6 py-3 text-slate-500 font-medium hidden lg:table-cell">Details</th>
                      <th className="text-right px-6 py-3 text-slate-500 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-800">{p.name}</div>
                          <div className="text-xs text-slate-400 mt-0.5">/{p.slug}</div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">
                            {p.category.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell text-slate-400 text-xs">
                          {p.specs.length} spec{p.specs.length !== 1 ? "s" : ""} · {p.tables.length} size{p.tables.length !== 1 ? "s" : ""}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => onDelete(p.id)}
                            className="text-red-500 hover:text-red-700 font-medium text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── Inquiries Tab ── */}
        {tab === "inquiries" && (
          <div className="space-y-3">
            {inquiries.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm text-center py-16 text-slate-400 text-sm">
                No inquiries yet.
              </div>
            ) : (
              inquiries.map((inq) => (
                <div key={inq.id} className="bg-white rounded-xl shadow-sm p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-800">{inq.name}</p>
                      <p className="text-sm text-slate-500">{inq.email}</p>
                    </div>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full whitespace-nowrap">
                      {inq.buyerType}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-700 leading-relaxed">{inq.message}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(inq.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

      </main>
    </div>
  );
}