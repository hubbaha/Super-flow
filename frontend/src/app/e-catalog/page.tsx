

const requiredAssets = [
  "/images/logo/logo-main.png",
  "/images/logo/logo-white.png",
  "/images/carousel/hero-01.jpg",
  "/images/carousel/hero-02.jpg",
  "/images/carousel/hero-03.jpg",
  "/images/categories/pvc-pipes.jpg",
  "/images/categories/pvc-fitting.jpg",
  "/images/categories/pvc-valves.jpg",
  "/images/sections/about-company.jpg",
  "/images/sections/industries.jpg",
  "/images/sections/innovation.jpg",
  "/images/sections/trust-partnership.jpg",
  "/e-catalog/superflow-catalog.pdf",
] as const;

export default function ECatalogPage() {
  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold">E-catalog</h1>
        <p className="mt-2 text-slate-200">
          Add your brochure PDF and image assets below to complete the full website visual style.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Required image files</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          {requiredAssets.map((file) => (
            <li key={file} className="rounded bg-slate-50 px-3 py-2 font-mono">
              {file}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Catalog PDF</h2>
        <p className="mt-2 text-sm text-slate-600">
          Place your PDF at <span className="font-mono">public/e-catalog/superflow-catalog.pdf</span>
        </p>
        <a
          href="/e-catalog/superflow-catalog.pdf"
          target="_blank"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          rel="noreferrer"
        >
          Open E-catalog PDF
        </a>
      </div>
    </section>
  );
}
