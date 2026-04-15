const requiredAssets = [
  "public/images/logo/logo-main.png",
  "public/images/logo/logo-white.png",
  "public/images/logo/favicon.ico",
  "public/images/carousel/hero-01.jpg",
  "public/images/carousel/hero-02.jpg",
  "public/images/carousel/hero-03.jpg",
  "public/images/categories/pvc-pipes.jpg",
  "public/images/categories/pvc-fittings.jpg",
  "public/images/categories/pvc-valves.jpg",
];

export default function ECatalogPage() {
  return (
    <section className="space-y-8">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">E-catalog</h1>
        <p className="mt-2 text-slate-600">
          Add your brochure PDF and image assets below to complete the full website visual style.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Required image files</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          {requiredAssets.map((file) => (
            <li key={file} className="rounded bg-slate-50 px-3 py-2 font-mono">
              {file}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Catalog PDF</h2>
        <p className="mt-2 text-sm text-slate-600">
          Place your PDF at <span className="font-mono">public/e-catalog/superflow-catalog.pdf</span>
        </p>
        <a
          href="/e-catalog/superflow-catalog.pdf"
          target="_blank"
          className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          rel="noreferrer"
        >
          Open E-catalog PDF
        </a>
      </div>
    </section>
  );
}
