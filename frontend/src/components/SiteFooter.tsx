import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-12 bg-slate-900 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <div>
          <h3 className="text-xl font-semibold text-white">Super flow</h3>
          <p className="mt-3 text-sm text-slate-300">
            Industrial PVC and CPVC piping systems for water, utilities, and process industries.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white">Quick Links</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
            <Link href="/e-catalog">E-catalog</Link>
            <Link href="/contact-us">Contact us</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white">Contact Info</h4>
          <p className="mt-3 text-sm">3340 St Marys Rd, Winnipeg district, Manitoba city</p>
          <p className="text-sm">info@superflow.com</p>
          <p className="text-sm">+1 (204) 000-0000</p>
        </div>
      </div>
      <div className="border-t border-slate-700 py-4 text-center text-xs text-slate-400">
        Copyright {new Date().getFullYear()} Super flow. All rights reserved.
      </div>
    </footer>
  );
}
