import Link from "next/link";
import { siteAssets } from "@/lib/site-assets";

type FooterCategory = {
  slug: string;
  name: string;
};

export function SiteFooter({ categories }: { categories: FooterCategory[] }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .sf-footer * { font-family: 'Plus Jakarta Sans', sans-serif; }

        .sf-footer-link {
          font-size: 0.875rem;
          color: #94a3b8;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s ease, padding-left 0.2s ease;
        }
        .sf-footer-link:hover { color: #f97316; padding-left: 4px; }
        .sf-footer-link::before {
          content: '→';
          font-size: 0.75rem;
          opacity: 0;
          margin-right: -10px;
          transition: opacity 0.2s, margin-right 0.2s;
        }
        .sf-footer-link:hover::before { opacity: 1; margin-right: 0; }

        .sf-footer-heading {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: white;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sf-footer-heading::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        .sf-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.85rem;
          color: #94a3b8;
          line-height: 1.5;
        }
        .sf-contact-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: rgba(249,115,22,0.12);
          color: #f97316;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .sf-footer-bottom-link {
          font-size: 0.75rem;
          color: #475569;
          text-decoration: none;
          transition: color 0.2s;
        }
        .sf-footer-bottom-link:hover { color: #f97316; }

        .sf-social-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          cursor: pointer;
          text-decoration: none;
        }
        .sf-social-btn:hover { border-color: #f97316; color: #f97316; background: rgba(249,115,22,0.08); }
      `}</style>

      <footer className="sf-footer mt-16 border-t border-slate-800 bg-slate-950">

        {/* Orange top accent line */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #f97316, #fb923c 40%, #2563eb)' }} />

        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
          <div className="grid gap-10 md:grid-cols-4">

            {/* Brand col */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src={siteAssets.logo} alt="Super flow logo" className="h-10 w-auto" />
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>
                  Superflow
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.7, maxWidth: '220px' }}>
                Industrial PVC and CPVC piping systems for water, utilities, and process industries since 1992.
              </p>
              {/* Socials */}
              <div className="mt-5 flex gap-2">
                {[
                  <svg key="li" viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
                  <svg key="tw" viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                  <svg key="fb" viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
                ].map((icon, i) => (
                  <a key={i} href="#" className="sf-social-btn">{icon}</a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <p className="sf-footer-heading">Quick Links</p>
              <div className="flex flex-col gap-3">
                {[
                  { href: "/", label: "Home" },
                  { href: "/products", label: "Products" },
                  { href: "/e-catalog", label: "E-catalog" },
                  { href: "/contact-us", label: "Contact Us" },
                ].map(link => (
                  <Link key={link.href} href={link.href} className="sf-footer-link">{link.label}</Link>
                ))}
              </div>
            </div>

            {/* Products */}
            <div>
              <p className="sf-footer-heading">Products</p>
              <div className="flex flex-col gap-3">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className="sf-footer-link"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="sf-footer-heading">Contact Details</p>
              <div className="flex flex-col gap-4">
                <div className="sf-contact-item">
                  <span className="sf-contact-icon">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                  </span>
                  <span>3340 St Marys Rd, Winnipeg district, Manitoba city</span>
                </div>
                <div className="sf-contact-item">
                  <span className="sf-contact-icon">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <span>info@superflow.com</span>
                </div>
                <div className="sf-contact-item">
                  <span className="sf-contact-icon">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.21 1.18 2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                  </span>
                  <span>+1 (204) 000-0000</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px' }}>
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 md:flex-row">
            <p style={{ fontSize: '0.75rem', color: '#475569' }}>
              © {new Date().getFullYear()} Superflow. All rights reserved.
            </p>
            <div className="flex gap-5">
              <a href="#" className="sf-footer-bottom-link">Privacy Policy</a>
              <a href="#" className="sf-footer-bottom-link">Terms of Use</a>
              <a href="#" className="sf-footer-bottom-link">Sitemap</a>
            </div>
          </div>
        </div>

      </footer>
    </>
  );
}