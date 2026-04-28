"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { siteAssets } from "@/lib/site-assets";

type HeaderCategory = {
  slug: string;
  name: string;
};

export function SiteHeader({ categories }: { categories: HeaderCategory[] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const productDropdownItems = categories.map((category) => ({
    href: `/categories/${category.slug}`,
    label: category.name,
  }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isProductsSection =
    pathname === "/products" ||
    pathname.startsWith("/categories/") ||
    pathname.startsWith("/products/");

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim();
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
    setMobileMenuOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .sf-header * { font-family: 'Plus Jakarta Sans', sans-serif; }

        .sf-nav-link {
          position: relative;
          font-size: 0.875rem;
          font-weight: 500;
          color: #334155;
          padding: 6px 10px;
          border-radius: 6px;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .sf-nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 10px; right: 10px;
          height: 2px;
          background: #f97316;
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s cubic-bezier(.22,1,.36,1);
        }
        .sf-nav-link:hover { color: #f97316; }
        .sf-nav-link:hover::after { transform: scaleX(1); }
        .sf-nav-link.active { color: #f97316; }
        .sf-nav-link.active::after { transform: scaleX(1); }

        .sf-dropdown {
          pointer-events: none;
          visibility: hidden;
          opacity: 0;
          position: absolute;
          left: 0; top: calc(100% + 4px);
          width: 220px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 8px;
          box-shadow: 0 16px 40px -8px rgba(0,0,0,0.14);
          transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
          transform: translateY(6px);
        }
        .sf-products-wrap:hover .sf-dropdown {
          pointer-events: auto;
          visibility: visible;
          opacity: 1;
          transform: translateY(0);
        }
        .sf-dropdown a {
          display: block;
          padding: 8px 12px;
          font-size: 0.875rem;
          color: #475569;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .sf-dropdown a:hover { background: #fff7ed; color: #c2410c; }

        .sf-search-wrap {
          display: flex;
          align-items: center;
          border: 1.5px solid #e2e8f0;
          border-radius: 999px;
          background: #f8fafc;
          padding: 3px 4px 3px 14px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .sf-search-wrap:focus-within {
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249,115,22,0.12);
          background: white;
        }
        .sf-search-input {
          width: 148px;
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.8rem;
          color: #334155;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .sf-search-input::placeholder { color: #94a3b8; }
        .sf-search-btn {
          background: #0f172a;
          color: white;
          border: none;
          border-radius: 999px;
          padding: 5px 14px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .sf-search-btn:hover { background: #f97316; }

        .sf-header-bar {
          height: 3px;
          background: linear-gradient(90deg, #f97316, #fb923c, #2563eb);
        }

        .sf-logo-text {
          font-size: 1.2rem;
          font-weight: 700;
          color: #0f172a;
          font-family: 'Plus Jakarta Sans', sans-serif;
          letter-spacing: -0.02em;
        }
        .sf-logo-text span { color: #f97316; }

        .sf-menu-btn {
          align-items: center;
          gap: 6px;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          padding: 7px 13px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #334155;
          background: white;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .sf-menu-btn:hover { border-color: #f97316; color: #f97316; }

        .sf-mobile-link {
          display: block;
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #334155;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .sf-mobile-link:hover, .sf-mobile-link.active { background: #fff7ed; color: #c2410c; }
      `}</style>

      <header className={`sf-header sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 transition-shadow ${scrolled ? "shadow-md" : "shadow-none"}`}>
        <div className="sf-header-bar" />

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 no-underline">
            <img src={siteAssets.logo} alt="Super flow logo" className="h-18 w-auto " />
            <span className="sf-logo-text ml-[-16]" style={{ color: "#201e1f" }}>Superflow PVC</span>
          </Link>

          {/* Mobile/tablet menu toggle */}
          <button
            className="sf-menu-btn inline-flex lg:hidden"
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 18 18" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen
                ? <><path d="M3 3l12 12M15 3L3 15"/></>
                : <><path d="M2 4h14M2 9h14M2 14h14"/></>}
            </svg>
            Menu
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            <Link href="/" className={`sf-nav-link ${pathname === "/" ? "active" : ""}`}>Home</Link>

            <div className="sf-products-wrap relative">
              <Link href="/products" className={`sf-nav-link inline-flex items-center gap-1 ${isProductsSection ? "active" : ""}`}>
                Products
                <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 4l4 4 4-4"/>
                </svg>
              </Link>
              <div className="sf-dropdown">
                {productDropdownItems.map(item => (
                  <Link key={item.href} href={item.href}>{item.label}</Link>
                ))}
              </div>
            </div>

            {/* <Link href="/e-catalog" className={`sf-nav-link ${pathname.startsWith("/e-catalog") ? "active" : ""}`}>E-catalog</Link> */}
            <Link href="/contact-us" className={`sf-nav-link ${pathname.startsWith("/contact-us") ? "active" : ""}`}>Contact Us</Link>

            <form onSubmit={handleSearchSubmit} className="ml-3">
              <div className="sf-search-wrap">
                <input
                  className="sf-search-input"
                  type="search"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search products"
                />
                <button type="submit" className="sf-search-btn">Go</button>
              </div>
            </form>
          </nav>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <nav className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`sf-mobile-link ${pathname === "/" ? "active" : ""}`}
              >
                Home
              </Link>

              {/* Products row: link + chevron separated */}
              <div className="rounded-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <Link
                    href="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`sf-mobile-link flex-1 ${isProductsSection ? "active" : ""}`}
                  >
                    Products
                  </Link>
                  <button
                    type="button"
                    className="px-3 py-2 text-slate-500 hover:text-orange-500 transition-colors"
                    onClick={() => setMobileProductsOpen((v) => !v)}
                    aria-label="Toggle products menu"
                  >
                    <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={mobileProductsOpen ? "M2 8l4-4 4 4" : "M2 4l4 4 4-4"} />
                    </svg>
                  </button>
                </div>

                {mobileProductsOpen && (
                  <div className="border-t border-slate-100 p-2 space-y-1">
                    {productDropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileProductsOpen(false);
                        }}
                        className="sf-mobile-link block"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* <Link
                href="/e-catalog"
                onClick={() => setMobileMenuOpen(false)}
                className={`sf-mobile-link ${pathname.startsWith("/e-catalog") ? "active" : ""}`}
              >
                E-catalog
              </Link> */}
              <Link
                href="/contact-us"
                onClick={() => setMobileMenuOpen(false)}
                className={`sf-mobile-link ${pathname.startsWith("/contact-us") ? "active" : ""}`}
              >
                Contact Us
              </Link>

              <form onSubmit={handleSearchSubmit} className="mt-2 flex gap-2">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search products"
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
                <button type="submit" className="sf-search-btn rounded-lg px-4 py-2 text-sm">
                  Search
                </button>
              </form>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}