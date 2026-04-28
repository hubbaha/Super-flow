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
          </div>
        </div>
      </div>

      <InquiryForm />
    </section>
  );
}