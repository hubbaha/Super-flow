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
        .sf-social-btn1 {
              width: 44px;
              height: 44px;
              border-radius: 8px;
              border: 1px solid rgba(249,115,22,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #f97316;
              transition: border-color 0.2s, color 0.2s, background 0.2s;
              cursor: pointer;
              text-decoration: none;
            }
            .sf-social-btn1:hover { 
              border-color: rgba(255,255,255,0.1); 
              color: #64748b; 
              background: rgba(100,116,139,0.08); 
            }

        .sf-social-btn {
          width: 44px;
          height: 44px;
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

        .sf-map-wrapper { padding-bottom: 45%; min-height: 200px; position: relative; width: 100%; }
        @media (max-width: 640px) { .sf-map-wrapper { padding-bottom: 65%; } }
      `}</style>

      <footer className="sf-footer mt-16 border-t border-slate-800 bg-slate-950">

        {/* Orange top accent line */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #f97316, #fb923c 40%, #2563eb)' }} />

        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">

          {/* ── Top 4-column grid ── */}
          <div className="grid gap-10 md:grid-cols-4">

            {/* Brand col */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src={siteAssets.logo} alt="Super flow logo" className="h-16 w-auto" />
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em' , marginLeft:-16 }}>
                  Superflow PVC
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.7, maxWidth: '220px' }}>
                Industrial PVC and CPVC piping systems for water, utilities, and process industries since 1992.
              </p>
              {/* Socials */}
              <div className="mt-5 flex gap-2">
                <a href="https://www.linkedin.com/in/pvc-city-546b8836b?utm_source=share_via&utm_content=profile&utm_medium=member_ios"  target="_blank"
                rel="noopener noreferrer"
                  className="sf-social-btn">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a 
                  href="https://wa.me/923314766611" 
                  className="sf-social-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                    <path d="M20.52 3.48A11.82 11.82 0 0 0 12.01 0C5.37 0 .01 5.36.01 12c0 2.11.55 4.17 1.6 6L0 24l6.18-1.62A11.94 11.94 0 0 0 12.01 24c6.63 0 12-5.36 12-12 0-3.2-1.25-6.2-3.49-8.52zM12 21.82c-1.82 0-3.6-.49-5.16-1.42l-.37-.22-3.67.96.98-3.58-.24-.37A9.78 9.78 0 0 1 2.18 12c0-5.41 4.4-9.82 9.82-9.82 2.62 0 5.08 1.02 6.93 2.87A9.75 9.75 0 0 1 21.82 12c0 5.41-4.4 9.82-9.82 9.82zm5.4-7.36c-.3-.15-1.78-.88-2.06-.98-.27-.1-.47-.15-.66.15-.2.3-.76.98-.93 1.18-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.67-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.2-.23-.55-.47-.48-.66-.49h-.56c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.52 0 1.48 1.08 2.91 1.23 3.11.15.2 2.13 3.25 5.16 4.56.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.44.25-.71.25-1.32.17-1.44-.07-.12-.27-.2-.57-.35z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/pvccity" className="sf-social-btn" target="_blank"
                rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <p className="sf-footer-heading">Quick Links</p>
              <div className="flex flex-col gap-3">
                {[
                  { href: "/", label: "Home" },
                  { href: "/products", label: "Products" },
                  // { href: "/e-catalog", label: "E-catalog" },
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
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <span>12-Al-Qurtaba Fiber Glass Market, 5/A Main Ferozepur Road, Near Qurtaba Chawk, Lahore, Pakistan, 54000
                </span>
                </div>
                <div className="sf-contact-item">
                  <span className="sf-contact-icon">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <span>info@superflow.com</span>
                </div>
                <div className="sf-contact-item">
                  <span className="sf-contact-icon">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.21 1.18 2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </span>
                  <span>+92 331 4766611</span>
                </div>
              </div>
            </div>

          </div>{/* end 4-col grid */}

          {/* ── Google Map — full width below columns ── */}
          <div className="mt-10">
            <p className="sf-footer-heading">Find Us</p>
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
              <a
                href="https://www.google.com/maps?q=31.545593,74.316120"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.65)',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '20px',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Open in Google Maps
              </a>
              <div className="sf-map-wrapper">
                <iframe
                  src="https://maps.google.com/maps?q=31.545593,74.316120&z=15&output=embed"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                    display: 'block',
                    filter: 'grayscale(20%) contrast(1.05)',
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Superflow Location - Firozpur Road, Lahore"
                />
              </div>
            </div>
          </div>

        </div>{/* end max-w-7xl */}

        {/* ── Bottom bar ── */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', padding: '16px 24px' }}>
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-3">
            <p style={{ fontSize: '0.90rem', color: '#475569' }}>
              © {new Date().getFullYear()} Superflow. All rights reserved.
            </p>
            
          </div>
        </div>

      </footer>
    </>
  );
}