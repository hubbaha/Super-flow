import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getCategoriesData } from "@/lib/catalog";
import { preferredCategories } from "@/lib/category-config";

const fallbackNavCategories = [...preferredCategories];

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Super flow | Industrial Piping Solutions",
  description: "Industrial PVC/CPVC product catalog and inquiry website",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let navCategories: Array<{ slug: string; name: string }> = [...fallbackNavCategories];
  try {
    const categories = await getCategoriesData();
    if (categories.length) {
      const dbCategories = categories.map((category) => ({
        slug: category.slug,
        name: category.name.toUpperCase(),
      }));
      const dbBySlug = new Map(dbCategories.map((category) => [category.slug, category]));
      const orderedPreferred = preferredCategories.map((category) => dbBySlug.get(category.slug) ?? category);
      const extras = dbCategories.filter(
        (category) => !preferredCategories.some((preferred) => preferred.slug === category.slug),
      );
      navCategories = [...orderedPreferred, ...extras];
    }
  } catch {
    navCategories = fallbackNavCategories;
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900 flex flex-col">
        <SiteHeader categories={navCategories} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-6 md:py-10">{children}</main>
        <SiteFooter categories={navCategories} />
      </body>
    </html>
  );
}
