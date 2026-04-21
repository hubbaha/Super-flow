export const siteAssets = {
  logo: "/images/logo/logo-main.png",
  logoWhite: "/images/logo/logo-white.png",
  favicon: "/images/logo/favicon.ico",
  carousel: [
    "/images/carousel/hero-01.jpg",
    "/images/carousel/hero-02.jpg",
    "/images/carousel/hero-03.jpg",
  ],
  categories: {
    "pvc-pipes": "/images/categories/pvc-pipes.jpg",
    "pvc-fittings": "/images/categories/pvc-fitting.jpg",
    "pvc-valve": "/images/categories/pvc-valve.jpg",
    "pvc-disc-filter": "/images/categories/pvc-disc-filter.jpg",  // ← make sure this key exists and points to the right file
    "pvc-strainer": "/images/categories/pvc-valve.jpg",
    "bs-standard-female-threaded-fittings": "/images/categories/pvc-valve.jpg",
  },
  sections: {
    aboutCompany: "/images/sections/about-company.jpg",
    industries: "/images/sections/industries.jpg",
    innovation: "/images/sections/innovation.jpg",
    trustPartnership: "/images/sections/trust-partnership.jpg",
  },
} as const;

export function getProductImageBySlug(slug: string) {
  return `/images/products/${slug}.jpg`;
}

export const homeSections = {
  services: [
    "Water Technology",
    "Industry Utilities",
    "Building Construction",
    "Agriculture & Irrigation",
  ],
  industries: [
    "Chemical Industry",
    "Waste Water",
    "Heavy Industrial",
    "Power Generation",
    "Irrigation Landscaping",
    "Oil & Gas",
    "Mining Industry",
    "Marine Industry",
    "Water Industry",
  ],
  advantages: [
    "We are always improving",
    "We are passionate",
    "Honest and independent",
    "We are stockist",
  ],
} as const;
