import Link from "next/link";
import { HeroCarousel } from "@/components/HeroCarousel";
import { siteAssets } from "@/lib/site-assets";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 px-6 py-8 text-white shadow-xl md:px-12 md:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.2),_transparent_45%)]" />
      <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <p className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-300">
            Industrial Flow Solutions
          </p>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Reliable PVC and CPVC Systems for Modern Industry
          </h1>
          <p className="max-w-2xl text-base text-slate-200 md:text-lg">
            Engineered piping products for utility networks, processing plants, and critical infrastructure.
            Explore our catalog and connect with our team for technical guidance.
          </p>
          <Link
            href="/contact-us"
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Request a Quote
          </Link>
        </div>
        <HeroCarousel images={siteAssets.carousel} />
      </div>
    </section>
  );
}
