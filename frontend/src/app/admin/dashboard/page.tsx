"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminLogout,
  createAdminProduct,
  deleteAdminProduct,
  getAdminInquiries,
  getAdminProducts,
  getCategories,
  updateAdminProduct,
  uploadAdminProductImage,
} from "@/lib/api";
import { Category, Inquiry, Product } from "@/lib/types";
import { getTechnicalTableColumnLabel, orderTechnicalTableColumnKeys } from "@/lib/table-display";

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
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [formSeed, setFormSeed] = useState(0);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategoryId, setFormCategoryId] = useState<number | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [formError, setFormError] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [bootstrapError, setBootstrapError] = useState("");

  function isUnauthorizedError(error: unknown) {
    if (!(error instanceof Error)) return false;
    return (
      error.message.includes("401") ||
      error.message.toLowerCase().includes("invalid token")
    );
  }

  // Extra spec/table rows state
  const [specs, setSpecs] = useState([{ key: "Standard", value: "" }]);
  const [tableSectionTitle, setTableSectionTitle] = useState("");
  const [tableColumnOrder, setTableColumnOrder] = useState<string[]>(["size", "od_mm", "weight_kg"]);
  const [tableColumnLabels, setTableColumnLabels] = useState<Record<string, string>>(() => ({
    size: getTechnicalTableColumnLabel("size", null),
    od_mm: getTechnicalTableColumnLabel("od_mm", null),
    weight_kg: getTechnicalTableColumnLabel("weight_kg", null),
  }));
  const [tableRows, setTableRows] = useState<Record<string, string>[]>([
    { size: "", od_mm: "", weight_kg: "" },
  ]);

  function resetForm() {
    setEditingProductId(null);
    setFormName("");
    setFormDescription("");
    setFormCategoryId("");
    setImagePath("");
    setSpecs([{ key: "Standard", value: "" }]);
    setTableSectionTitle("");
    setTableColumnOrder(["size", "od_mm", "weight_kg"]);
    setTableColumnLabels({
      size: getTechnicalTableColumnLabel("size", null),
      od_mm: getTechnicalTableColumnLabel("od_mm", null),
      weight_kg: getTechnicalTableColumnLabel("weight_kg", null),
    });
    setTableRows([{ size: "", od_mm: "", weight_kg: "" }]);
    setFormError("");
    setFormSeed((s) => s + 1);
  }

  function startCreate() {
    if (showForm) {
      setShowForm(false);
      resetForm();
      return;
    }
    resetForm();
    setShowForm(true);
  }

  function startEdit(product: Product) {
    setEditingProductId(product.id);
    setFormName(product.name);
    setFormDescription(product.description);
    setFormCategoryId(product.categoryId);
    setImagePath(product.image ?? "");
    setSpecs(
      product.specs.length
        ? product.specs.map((s) => ({ key: s.key, value: s.value }))
        : [{ key: "Standard", value: "" }],
    );
    const savedLabels =
      product.technicalTableColumnLabels &&
      typeof product.technicalTableColumnLabels === "object" &&
      !Array.isArray(product.technicalTableColumnLabels)
        ? (product.technicalTableColumnLabels as Record<string, unknown>)
        : {};

    const rowsFromDb: Record<string, string>[] = product.tables.map((table) => {
      const tableData =
        table.data && typeof table.data === "object" && !Array.isArray(table.data)
          ? (table.data as Record<string, unknown>)
          : {};
      const legacy = table as unknown as {
        size?: string | null;
        od_mm?: string | null;
        weight_kg?: string | null;
      };
      const merged: Record<string, unknown> = { ...tableData };
      if (legacy.size != null && merged.size === undefined) merged.size = legacy.size;
      if (legacy.od_mm != null && merged.od_mm === undefined) merged.od_mm = legacy.od_mm;
      if (legacy.weight_kg != null && merged.weight_kg === undefined) {
        merged.weight_kg = legacy.weight_kg;
      }
      return Object.fromEntries(
        Object.entries(merged)
          .filter(([k]) => k !== "id" && k !== "productId")
          .map(([k, v]) => [k, v == null ? "" : String(v)]),
      ) as Record<string, string>;
    });

    const nonEmptyRows = rowsFromDb.filter((row) =>
      Object.values(row).some((v) => String(v).trim()),
    );

    const keySet = new Set<string>();
    nonEmptyRows.forEach((row) => Object.keys(row).forEach((k) => keySet.add(k)));
    const order =
      keySet.size > 0
        ? orderTechnicalTableColumnKeys(keySet)
        : (["size", "od_mm", "weight_kg"] as string[]);

    const labels: Record<string, string> = {};
    for (const key of order) {
      const raw = savedLabels[key];
      labels[key] =
        typeof raw === "string" && raw.trim()
          ? raw.trim()
          : getTechnicalTableColumnLabel(key, null);
    }

    setTableSectionTitle(product.technicalTableTitle?.trim() ?? "");
    setTableColumnOrder(order);
    setTableColumnLabels(labels);
    setTableRows(
      nonEmptyRows.length
        ? nonEmptyRows.map((row) => {
            const filled: Record<string, string> = {};
            for (const k of order) filled[k] = row[k] ?? "";
            return filled;
          })
        : [Object.fromEntries(order.map((k) => [k, ""]))],
    );
    setFormError("");
    setFormSeed((s) => s + 1);
    setShowForm(true);
  }

  useEffect(() => {
    const t = localStorage.getItem("adminToken") ?? undefined;

    Promise.all([getAdminProducts(t), getAdminInquiries(t), getCategories()])
      .then(([p, i, c]) => {
        setProducts(p);
        setInquiries(i);
        setCategories(c);
        setBootstrapError("");
      })
      .catch((error) => {
        if (isUnauthorizedError(error)) {
          localStorage.removeItem("adminToken");
          router.push("/admin/login");
          return;
        }
        setBootstrapError(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data. Please refresh.",
        );
      })
      .finally(() => setLoading(false));
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("adminToken");
    void adminLogout();
    router.push("/admin/login");
  }

  async function onSubmitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = localStorage.getItem("adminToken") ?? undefined;

    setSubmitting(true);
    setFormError("");

    try {
      const categoryId = Number(formCategoryId);
      const tablesPayload = tableRows
        .map((row) => {
          const data: Record<string, string> = {};
          for (const key of tableColumnOrder) {
            data[key] = String(row[key] ?? "").trim();
          }
          return { data };
        })
        .filter((row) => Object.values(row.data).some((cell) => cell.length > 0));

      const columnLabelPayload = tableColumnOrder.reduce<Record<string, string>>((acc, key) => {
        const label = (tableColumnLabels[key] ?? getTechnicalTableColumnLabel(key, null)).trim();
        acc[key] = label || getTechnicalTableColumnLabel(key, null);
        return acc;
      }, {});

      const payload = {
        name: formName.trim(),
        description: formDescription.trim(),
        ...(imagePath.trim() ? { image: imagePath.trim() } : {}),
        categoryId,
        specs: specs.filter((s) => s.key && s.value),
        tables: tablesPayload,
        technicalTableTitle: tableSectionTitle.trim() ? tableSectionTitle.trim() : null,
        technicalTableColumnLabels: columnLabelPayload,
      };

      if (!payload.name || !payload.description || !Number.isFinite(categoryId) || categoryId < 1) {
        setFormError("Name, description, and category are required.");
        return;
      }

      if (editingProductId) {
        await updateAdminProduct(token, editingProductId, payload);
      } else {
        await createAdminProduct(token, payload);
      }

      const refreshed = await getAdminProducts(token);
      setProducts(refreshed);
      resetForm();
      setShowForm(false);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : editingProductId
            ? "Failed to update product. Please try again."
            : "Failed to create product. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    const token = localStorage.getItem("adminToken") ?? undefined;
    try {
      await deleteAdminProduct(token, id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to delete product.");
    }
  }

  async function onSyncProducts() {
    const token = localStorage.getItem("adminToken") ?? undefined;
    setSyncing(true);
    setFormError("");
    try {
      const [p, c] = await Promise.all([
        getAdminProducts(token, { syncFromJson: true }),
        getCategories(),
      ]);
      setProducts(p);
      setCategories(c);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to sync products.");
    } finally {
      setSyncing(false);
    }
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
        {bootstrapError ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {bootstrapError}
          </div>
        ) : null}

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
                onClick={startCreate}
                className="bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition whitespace-nowrap"
              >
                {showForm ? "Cancel" : "+ Add Product"}
              </button>
              <button
                onClick={onSyncProducts}
                disabled={syncing}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-lg transition whitespace-nowrap"
              >
                {syncing ? "Syncing..." : "Sync JSON Products"}
              </button>
            </div>

            {/* Add Product Form */}
            {showForm && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-base font-semibold text-slate-800 mb-4">
                  {editingProductId ? "Edit Product" : "New Product"}
                </h2>
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                    {formError}
                  </div>
                )}
                <form key={formSeed} onSubmit={onSubmitProduct} className="space-y-5">
                  {/* Basic */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Product Name *</label>
                      <input
                        name="name"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. SCH 80 PVC Ball Valve 2 Inch"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Category *</label>
                      <select
                        name="categoryId"
                        required
                        value={formCategoryId}
                        onChange={(e) => setFormCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select category…</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-xs font-medium text-slate-600 mb-1">Product image</label>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          disabled={imageUploading}
                          className="text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            e.target.value = "";
                            if (!file) return;
                            const t = localStorage.getItem("adminToken") ?? undefined;
                            setImageUploading(true);
                            setFormError("");
                            try {
                              const { url } = await uploadAdminProductImage(t, file);
                              setImagePath(url);
                            } catch (err) {
                              setFormError(err instanceof Error ? err.message : "Image upload failed.");
                            } finally {
                              setImageUploading(false);
                            }
                          }}
                        />
                        {imageUploading ? (
                          <span className="text-xs text-slate-500">Uploading…</span>
                        ) : null}
                      </div>
                      <p className="text-xs text-slate-500">Upload a file (max 4 MB), or paste a path below.</p>
                      <input
                        type="text"
                        value={imagePath}
                        onChange={(e) => setImagePath(e.target.value)}
                        placeholder="/images/products/my-product.jpg or uploaded URL"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {imagePath ? (
                        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imagePath} alt="" className="h-14 w-14 rounded object-cover" />
                          <span className="truncate text-xs text-slate-600">{imagePath}</span>
                        </div>
                      ) : null}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-600 mb-1">Description *</label>
                      <textarea
                        name="description"
                        required
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
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

                  {/* Size / technical table */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Table section heading (product page)
                      </label>
                      <input
                        type="text"
                        value={tableSectionTitle}
                        onChange={(e) => setTableSectionTitle(e.target.value)}
                        placeholder="e.g. Product Size Table"
                        className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Leave blank to use the default Product Size Table heading on the site.
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <label className="text-xs font-medium text-slate-600">Table columns &amp; rows</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            let n = tableColumnOrder.filter((k) => k.startsWith("field_")).length + 1;
                            let newKey = `field_${n}`;
                            while (tableColumnOrder.includes(newKey)) {
                              n += 1;
                              newKey = `field_${n}`;
                            }
                            setTableColumnOrder((o) => [...o, newKey]);
                            setTableColumnLabels((prev) => ({
                              ...prev,
                              [newKey]: getTechnicalTableColumnLabel(newKey, null),
                            }));
                            setTableRows((rows) =>
                              rows.map((r) => ({ ...r, [newKey]: "" })),
                            );
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          + Add column
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setTableRows((rows) => [
                              ...rows,
                              Object.fromEntries(
                                tableColumnOrder.map((k) => [k, ""]),
                              ) as Record<string, string>,
                            ])
                          }
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          + Add row
                        </button>
                      </div>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-sm min-w-[320px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            {tableColumnOrder.map((colKey) => (
                              <th key={colKey} className="px-2 py-2 text-left align-bottom font-medium text-slate-600">
                                <div className="space-y-1 min-w-[7rem]">
                                  <input
                                    value={tableColumnLabels[colKey] ?? ""}
                                    onChange={(e) =>
                                      setTableColumnLabels((prev) => ({
                                        ...prev,
                                        [colKey]: e.target.value,
                                      }))
                                    }
                                    placeholder={getTechnicalTableColumnLabel(colKey, null)}
                                    className="w-full rounded border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                  <div className="text-[10px] text-slate-400 font-normal truncate" title={colKey}>
                                    key: {colKey}
                                  </div>
                                  {tableColumnOrder.length > 1 ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (tableColumnOrder.length <= 1) return;
                                        setTableColumnOrder((o) => o.filter((k) => k !== colKey));
                                        setTableColumnLabels((prev) => {
                                          const { [colKey]: _, ...rest } = prev;
                                          return rest;
                                        });
                                        setTableRows((rows) =>
                                          rows.map((r) => {
                                            const { [colKey]: _, ...rest } = r;
                                            return rest;
                                          }),
                                        );
                                      }}
                                      className="text-[10px] text-red-500 hover:text-red-700"
                                    >
                                      Remove column
                                    </button>
                                  ) : null}
                                </div>
                              </th>
                            ))}
                            <th className="w-10 px-1" aria-label="Row actions" />
                          </tr>
                        </thead>
                        <tbody>
                          {tableRows.map((row, i) => (
                            <tr key={i} className="border-b border-slate-100 last:border-0">
                              {tableColumnOrder.map((colKey) => (
                                <td key={colKey} className="px-2 py-1.5">
                                  <input
                                    value={row[colKey] ?? ""}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      setTableRows((rows) => {
                                        const next = [...rows];
                                        next[i] = { ...next[i], [colKey]: v };
                                        return next;
                                      });
                                    }}
                                    className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                </td>
                              ))}
                              <td className="px-1 text-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setTableRows((rows) =>
                                      rows.length <= 1
                                        ? rows
                                        : rows.filter((_, idx) => idx !== i),
                                    )
                                  }
                                  className="text-slate-400 hover:text-red-500 text-lg leading-none"
                                  aria-label="Remove row"
                                >
                                  ×
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-slate-500">
                      Column keys come from your data (e.g. size, od_mm). Add a column for extra fields such as
                      pressure or length. At least one cell in a row must be filled for that row to be saved.
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }}
                      className="px-5 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-700 disabled:opacity-50 rounded-lg transition"
                    >
                      {submitting
                        ? editingProductId
                          ? "Saving…"
                          : "Creating…"
                        : editingProductId
                          ? "Save Changes"
                          : "Create Product"}
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
                            onClick={() => startEdit(p)}
                            className="mr-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            Edit
                          </button>
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