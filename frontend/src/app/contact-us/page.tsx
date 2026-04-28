import { InquiryForm } from "@/components/InquiryForm";

export default function ContactUsPage() {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      {/* Info Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-xl">
        {/* Decorative ring */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-blue-600/20 blur-2xl" />

        <div className="relative">
          <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-300">
            Get in Touch
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white">
            Contact Us
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Reach Superflow for pricing, technical support, and product availability.
          </p>

          <div className="mt-10 space-y-5">
            {[
              {
                icon: (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                label: "Email",
                value: "info@superflow.com",
              },
              {
                icon: (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                ),
                label: "Phone",
                value: "+92 331 4766611",
              },
              {
                icon: (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                label: "Address",
                value: "12-Al-Qurtaba Fiber Glass Market, 5/A Main Ferozepur Road, Near Qurtaba Chawk, Lahore, Pakistan, 54000",
              },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-blue-300">
                  {icon}
                </span>
                
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
                  <p className="mt-0.5 text-sm text-slate-200">{value}</p>
                </div>
                
              </div>
              
            ))}
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
        </div>
      </div>

      <InquiryForm />
    </section>
  );
}