import Link from "next/link";
import { HeroSection } from "@/components/HeroSection";
import { CategoryCard } from "@/components/CategoryCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getCategoriesData } from "@/lib/catalog";
import { getReferenceProducts } from "@/lib/reference-products";
import { homeSections, siteAssets } from "@/lib/site-assets";
import type { Category } from "@/lib/types";
import { preferredCategories } from "@/lib/category-config";

export const dynamic = "force-dynamic";

const categoryImageFallback = "/images/categories/pvc-valve.jpg";

export default async function HomePage() {
  const categories = await getCategoriesData();
  const referenceProducts = await getReferenceProducts();

  const processSteps = [
    {
      title: "Requirement Study",
      description: "We begin by deeply understanding your project scope, material specs, and industry requirements.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 6h16"/><path d="M4 12h10"/><path d="M4 18h7"/>
        </svg>
      ),
      number: "01",
      color: "#f97316",
    },
    {
      title: "Technical Selection",
      description: "Our engineers identify optimal materials and products matched precisely to your conditions.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="6"/><path d="M20 20l-3.5-3.5"/>
        </svg>
      ),
      number: "02",
      color: "#2563eb",
    },
    {
      title: "Quality Verification",
      description: "Every product undergoes rigorous quality control checks before it leaves our facility.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="m5 12 4 4L19 6"/>
        </svg>
      ),
      number: "03",
      color: "#f97316",
    },
    {
      title: "Reliable Delivery",
      description: "We guarantee on-time delivery with full traceability and documentation support.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 7h13v10H3z"/><path d="M16 10h3l2 2v5h-5z"/>
          <circle cx="7" cy="18" r="1.5"/><circle cx="18" cy="18" r="1.5"/>
        </svg>
      ),
      number: "04",
      color: "#2563eb",
    },
  ];

  const categoryItems = categories.map((category: Category) => ({
    id: category.id,
    href: `/categories/${category.slug}`,
    title: category.name,
    image:
      siteAssets.categories[category.slug as keyof typeof siteAssets.categories] ??
      categoryImageFallback,
    // ← Count from JSON reference products instead of database
    count: referenceProducts.filter((p) => p.categorySlug === category.slug).length,
  }));

  // Only show first 3 categories on homepage
  const homeCategoryItems = categoryItems.length
    ? categoryItems.slice(0, 3)
    : preferredCategories.slice(0, 3).map((category, index) => ({
        id: index + 1,
        href: `/categories/${category.slug}`,
        title: category.name,
        image:
          siteAssets.categories[category.slug as keyof typeof siteAssets.categories] ??
          categoryImageFallback,
        count: referenceProducts.filter((p) => p.categorySlug === category.slug).length,
      }));

  const stats = [
    { value: "1992", label: "Founded", accent: "#f97316" },
    { value: "30+", label: "Years Experience", accent: "#2563eb" },
    { value: "500+", label: "Product SKUs", accent: "#f97316" },
    { value: "100%", label: "Quality Assured", accent: "#2563eb" },
  ];

  return (
    <>
      <ScrollReveal />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;1,9..144,400&display=swap');

        .sf-page * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .sf-serif { font-family: 'Fraunces', serif; }

        @keyframes sf-fadeup {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sf-shimmer {
          from { left: -80%; }
          to   { left: 130%; }
        }
        @keyframes sf-pulse-ring {
          0%   { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        .sf-animate { animation: sf-fadeup 0.65s cubic-bezier(.22,1,.36,1) both; }
        .sf-delay-1 { animation-delay: 0.08s; }
        .sf-delay-2 { animation-delay: 0.16s; }
        .sf-delay-3 { animation-delay: 0.24s; }
        .sf-delay-4 { animation-delay: 0.32s; }

        .sf-reveal {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1);
        }
        .sf-reveal.sf-visible { opacity: 1; transform: translateY(0); }

        .sf-badge-orange {
          display: inline-flex; align-items: center; gap: 7px;
          background: #fff7ed; border: 1px solid #fed7aa;
          color: #c2410c; font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.07em; text-transform: uppercase;
          padding: 4px 13px; border-radius: 999px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .sf-badge-blue {
          display: inline-flex; align-items: center; gap: 7px;
          background: #eff6ff; border: 1px solid #bfdbfe;
          color: #1e40af; font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.07em; text-transform: uppercase;
          padding: 4px 13px; border-radius: 999px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .sf-dot {
          width: 6px; height: 6px; border-radius: 50%;
          position: relative; flex-shrink: 0;
        }
        .sf-dot-orange { background: #f97316; }
        .sf-dot-blue   { background: #2563eb; }
        .sf-dot::after {
          content: '';
          position: absolute; inset: -3px;
          border-radius: 50%;
          animation: sf-pulse-ring 1.8s ease-out infinite;
        }
        .sf-dot-orange::after { border: 1.5px solid #f97316; }
        .sf-dot-blue::after   { border: 1.5px solid #2563eb; }

        .sf-stat {
          transition: all 0.25s cubic-bezier(.22,1,.36,1);
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .sf-stat::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 2px 2px 0 0;
        }
        .sf-stat-orange::before { background: #f97316; }
        .sf-stat-blue::before   { background: #2563eb; }
        .sf-stat:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px -6px rgba(0,0,0,0.12);
        }
        .sf-stat:hover .sf-stat-label { color: #64748b !important; }

        .sf-card {
          transition: transform 0.25s cubic-bezier(.22,1,.36,1), box-shadow 0.25s ease;
        }
        .sf-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 44px -8px rgba(0,0,0,0.12);
        }

        .sf-img-wrap { overflow: hidden; border-radius: 10px; }
        .sf-img-wrap img { transition: transform 0.5s cubic-bezier(.22,1,.36,1); }
        .sf-img-wrap:hover img { transform: scale(1.05); }

        .sf-process-step {
          transition: all 0.3s cubic-bezier(.22,1,.36,1);
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .sf-process-step:hover {
          transform: translateY(-5px) scale(1.01);
          border-color: rgba(255,255,255,0.3) !important;
        }
        .sf-process-step:hover .sf-step-icon { transform: rotate(-8deg) scale(1.15); }
        .sf-step-icon { transition: transform 0.3s ease; }
        .sf-step-number {
          font-family: 'Fraunces', serif;
          font-size: 4rem; line-height: 1;
          opacity: 0.1;
          position: absolute; bottom: 8px; right: 12px;
          color: white; pointer-events: none;
        }

        .sf-service-card {
          transition: all 0.3s cubic-bezier(.22,1,.36,1);
          position: relative; overflow: hidden;
        }
        .sf-service-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s cubic-bezier(.22,1,.36,1);
        }
        .sf-service-card:hover::after { transform: scaleX(1); }
        .sf-service-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px -10px rgba(0,0,0,0.13);
        }
        .sf-service-icon { transition: all 0.3s cubic-bezier(.22,1,.36,1); }

        .sf-service-orange::after { background: linear-gradient(90deg, #f97316, #fb923c); }
        .sf-service-blue::after   { background: linear-gradient(90deg, #2563eb, #60a5fa); }
        .sf-service-orange:hover .sf-service-icon { background: #fff7ed !important; color: #f97316 !important; }
        .sf-service-blue:hover   .sf-service-icon { background: #eff6ff !important; color: #2563eb !important; }
        .sf-service-orange:hover .sf-service-icon { transform: scale(1.15) rotate(8deg); }
        .sf-service-blue:hover   .sf-service-icon { transform: scale(1.15) rotate(-8deg); }

        .sf-advantage { transition: all 0.2s ease; cursor: default; }
        .sf-advantage-orange:hover { background: #fff7ed !important; color: #c2410c !important; border-color: #fed7aa !important; }
        .sf-advantage-blue:hover   { background: #eff6ff !important; color: #1e40af !important; border-color: #bfdbfe !important; }
        .sf-check { transition: all 0.2s ease; }
        .sf-advantage-orange:hover .sf-check { background: #f97316 !important; color: white !important; border-color: transparent !important; }
        .sf-advantage-blue:hover   .sf-check { background: #2563eb !important; color: white !important; border-color: transparent !important; }

        .sf-industry { transition: all 0.2s ease; cursor: default; }
        .sf-industry:hover { background: #0f172a !important; color: #f97316 !important; }

        .sf-btn-orange {
          position: relative; overflow: hidden;
          display: inline-flex; align-items: center; gap: 8px;
          background: #f97316; color: white;
          border-radius: 10px; padding: 10px 20px;
          font-size: 0.875rem; font-weight: 600;
          text-decoration: none;
          transition: all 0.25s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .sf-btn-orange::after {
          content: '';
          position: absolute;
          top: 0; left: -80%;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transform: skewX(-15deg);
        }
        .sf-btn-orange:hover::after { animation: sf-shimmer 0.55s ease forwards; }
        .sf-btn-orange:hover { background: #ea6c00; transform: translateY(-1px); box-shadow: 0 8px 20px -4px rgba(249,115,22,0.45); }

        .sf-bar-orange { width: 40px; height: 3px; background: linear-gradient(90deg, #f97316, #fb923c); border-radius: 2px; margin-bottom: 12px; }
        .sf-bar-blue   { width: 40px; height: 3px; background: linear-gradient(90deg, #2563eb, #60a5fa); border-radius: 2px; margin-bottom: 12px; }

        .sf-connector {
          position: absolute; top: 38px; right: -16px;
          width: 32px; height: 1px;
          background: rgba(255,255,255,0.15); z-index: 1;
        }

        .sf-divider { height: 1px; background: linear-gradient(90deg, #f97316 0%, #2563eb 50%, transparent 100%); margin-top: 20px; border-radius: 1px; }
      `}</style>

      <section className="sf-page space-y-16">

        {/* Hero */}
        <div className="sf-animate"><HeroSection /></div>

        {/* Stats */}
        <div className="sf-animate sf-delay-1 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`sf-stat rounded-xl border border-slate-200 bg-white p-5 text-center ${i % 2 === 0 ? "sf-stat-orange" : "sf-stat-blue"}`}
            >
              <p className="sf-serif text-3xl font-bold text-slate-900" style={{ color: stat.accent }}>{stat.value}</p>
              <p className="sf-stat-label mt-1 text-xs font-semibold uppercase tracking-widest text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Distribution */}
        <section className="sf-reveal grid gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">
          <div className="space-y-4 p-8 md:p-10">
            <div className="sf-badge-orange"><span className="sf-dot sf-dot-orange" />Worldwide Distribution</div>
            <h2 className="sf-serif text-4xl font-bold text-slate-900 leading-tight">Available In<br />Pakistan</h2>
            <div className="sf-bar-orange" />
            <p className="text-slate-600 leading-relaxed text-sm">
              Super Flow delivers robust industrial piping products with strong chemical resistance and reliable long-term performance for utilities and processing sectors.
            </p>
          </div>
          <div className="flex flex-col gap-4 bg-slate-50 p-8 md:p-10" style={{ borderLeft: '1px solid #f1f5f9' }}>
            <div className="sf-img-wrap">
              <img src={siteAssets.carousel[1]} alt="Industrial piping products" className="h-40 w-full object-cover" />
            </div>
            <h3 className="font-semibold text-slate-900">Browse Collection</h3>
            <p className="text-sm text-slate-600">
              Discover a complete range of pipes, fittings, valves, and accessories designed for critical industrial applications.
            </p>
            <Link href="/products" className="sf-btn-orange w-fit">
              See All Products
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
            </Link>
          </div>
        </section>

        {/* Categories - only 3 shown */}
        <section className="sf-reveal space-y-6">
          <div>
            <div className="sf-badge-blue mb-3"><span className="sf-dot sf-dot-blue" />Product Categories</div>
            <h2 className="sf-serif text-4xl font-bold text-slate-900">Product Range Categories</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {homeCategoryItems.map((category) => (
              <CategoryCard
                key={category.id}
                href={category.href}
                title={category.title}
                image={category.image}
                count={category.count}
              />
            ))}
          </div>
          <div>
            <Link href="/products" className="sf-btn-orange">
              Explore All Categories
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
            </Link>
          </div>
        </section>

        {/* Process */}
        <section className="sf-reveal rounded-2xl p-8 md:p-12 shadow-xl" style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a2332 100%)' }}>
          <div className="mb-8">
            <div className="sf-badge-orange mb-4"><span className="sf-dot sf-dot-orange" />How We Work</div>
            <h2 className="sf-serif text-4xl font-bold text-white leading-tight">Our Process</h2>
            <p className="mt-3 max-w-xl text-slate-400 text-sm leading-relaxed">
              Seamless innovation defines our process — from engineering and product selection to precision supply for industrial projects.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {processSteps.map((step, idx) => (
              <div
                key={step.title}
                className="sf-process-step relative rounded-xl border p-5"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderColor: `${step.color}30`,
                  borderTopColor: step.color,
                  borderTopWidth: '2px',
                }}
              >
                {idx < processSteps.length - 1 && <span className="sf-connector hidden md:block" />}
                <div className="sf-step-icon mb-4 inline-flex rounded-lg p-2.5" style={{ background: `${step.color}20`, color: step.color }}>
                  {step.icon}
                </div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: step.color }}>{step.number}</p>
                <h3 className="font-semibold text-white text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                <span className="sf-step-number">{step.number}</span>
              </div>
            ))}
          </div>
        </section>

        {/* About + Industries */}
        <section className="sf-reveal grid gap-6 md:grid-cols-2">
          <div className="sf-card rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="sf-img-wrap mb-5">
              <img src={siteAssets.sections.aboutCompany} alt="Industrial operations" className="h-44 w-full object-cover" />
            </div>
            <div className="sf-badge-orange mb-3"><span className="sf-dot sf-dot-orange" />Know Who We Are</div>
            <h2 className="sf-serif mt-2 text-3xl font-bold text-slate-900 leading-tight">Built for Industrial Reliability Since 1992</h2>
            <p className="mt-3 text-slate-600 text-sm leading-relaxed">
              We focus on robust pipe systems that combine quality, safety, and innovation for process plants, construction, and utilities.
            </p>
            <div className="sf-divider" />
          </div>
          <div className="sf-card rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="sf-img-wrap mb-5">
              <img src={siteAssets.sections.industries} alt="Industry sectors" className="h-44 w-full object-cover" />
            </div>
            <div className="sf-badge-blue mb-3"><span className="sf-dot sf-dot-blue" />Service Is Our Purpose</div>
            <h2 className="sf-serif mt-2 text-3xl font-bold text-slate-900 leading-tight">Where Our Products Perform</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {homeSections.industries.map((industry) => (
                <div key={industry} className="sf-industry rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                  {industry}
                </div>
              ))}
            </div>
            <div className="sf-divider" />
          </div>
        </section>

        {/* Services */}
        <section className="sf-reveal space-y-6">
          <div>
            <div className="sf-badge-orange mb-3"><span className="sf-dot sf-dot-orange" />Our Services</div>
            <h2 className="sf-serif mt-1 text-4xl font-bold text-slate-900">Industrial Expertise<br />Across Core Sectors</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {homeSections.services.map((service, i) => (
              <article key={service} className={`sf-service-card rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${i % 2 === 0 ? "sf-service-orange" : "sf-service-blue"}`}>
                <div className={`sf-service-icon mb-4 inline-flex rounded-xl p-3 ${i % 2 === 0 ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"}`}>
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 3v18"/><path d="M3 12h18"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 text-base">{service}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  Tailored industrial-grade support with durable piping systems and technical confidence.
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Advantages */}
        <section className="sf-reveal space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div>
            <div className="sf-badge-blue mb-3"><span className="sf-dot sf-dot-blue" />Why Choose Us</div>
            <h2 className="sf-serif mt-1 text-4xl font-bold text-slate-900">Your Trusted Piping Partner</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {homeSections.advantages.map((advantage, i) => (
              <div
                key={advantage}
                className={`sf-advantage flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 border border-slate-100 ${i % 2 === 0 ? "sf-advantage-orange" : "sf-advantage-blue"}`}
              >
                <span className={`sf-check inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 ${i % 2 === 0 ? "text-orange-500" : "text-blue-600"}`}>
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M3 8l3.5 3.5L13 5"/>
                  </svg>
                </span>
                {advantage.toUpperCase()}
              </div>
            ))}
          </div>
        </section>

        {/* Innovation + Commitment */}
        <section className="sf-reveal grid gap-6 md:grid-cols-2">
          <article className="sf-card rounded-2xl border border-slate-200 bg-white p-7 shadow-sm" style={{ borderTop: '3px solid #f97316' }}>
            <div className="sf-img-wrap mb-5">
              <img src={siteAssets.sections.innovation} alt="Innovation" className="h-44 w-full object-cover" />
            </div>
            <h3 className="sf-serif text-2xl font-bold text-slate-900">Our Continuous Innovation Journey</h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Innovation drives our product quality through advanced materials, practical engineering, and continuous improvement to meet evolving industrial standards.
            </p>
            <div className="sf-divider" />
          </article>
          <article className="sf-card rounded-2xl border border-slate-200 bg-white p-7 shadow-sm" style={{ borderTop: '3px solid #2563eb' }}>
            <div className="sf-img-wrap mb-5">
              <img src={siteAssets.sections.trustPartnership} alt="Commitment" className="h-44 w-full object-cover" />
            </div>
            <h3 className="sf-serif text-2xl font-bold text-slate-900">Commitment to Honesty and Independence</h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              We prioritize transparent communication and practical recommendations, ensuring clients receive dependable solutions for every stage of their project lifecycle.
            </p>
            <div className="sf-divider" />
          </article>
        </section>

      </section>
    </>
  );
}