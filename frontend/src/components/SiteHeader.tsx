"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { siteAssets } from "@/lib/site-assets";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/e-catalog", label: "E-catalog" },
  { href: "/contact-us", label: "Contact us" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold text-slate-800">
          <img src={siteAssets.logo} alt="Super flow logo" className="h-9 w-auto" />
          <span>Super flow</span>
        </Link>

        <button
          className="rounded border border-slate-300 px-3 py-1 text-sm md:hidden"
          onClick={() => setOpen((v) => !v)}
          type="button"
        >
          Menu
        </button>

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-700 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-blue-700 ${
                pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                  ? "text-blue-700"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-slate-700">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={
                  pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                    ? "text-blue-700"
                    : ""
                }
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
