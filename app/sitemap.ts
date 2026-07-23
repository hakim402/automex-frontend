// app/sitemap.ts
import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES } from "@/lib/locale";
import { fetchSitemapUrls } from "@/lib/automex/content";

const BASE_URL = "https://automex.tech";

/** Static pages that always exist regardless of API data. */
const STATIC_PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  // Main
  { path: "", priority: 1.0, changeFrequency: "daily" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },

  // Public listing pages
  { path: "/services", priority: 0.9, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/case-studies", priority: 0.8, changeFrequency: "weekly" },
  { path: "/portfolio", priority: 0.8, changeFrequency: "weekly" },
  { path: "/partners", priority: 0.7, changeFrequency: "monthly" },
  { path: "/solutions/ai-capabilities", priority: 0.8, changeFrequency: "weekly" },
  { path: "/tech-expertise", priority: 0.8, changeFrequency: "weekly" },
  { path: "/industries", priority: 0.7, changeFrequency: "monthly" },

  // CRM hub & conversion pages
  { path: "/crm", priority: 0.8, changeFrequency: "weekly" },
  { path: "/crm/book-a-call", priority: 0.9, changeFrequency: "weekly" },
  { path: "/crm/quote", priority: 0.9, changeFrequency: "weekly" },
  { path: "/crm/contact-sales", priority: 0.8, changeFrequency: "weekly" },

  // Company
  { path: "/about/leadership", priority: 0.6, changeFrequency: "monthly" },
  { path: "/careers", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faqs", priority: 0.6, changeFrequency: "monthly" },
  { path: "/downloads", priority: 0.5, changeFrequency: "monthly" },

  // Legal
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Fetch dynamic content URLs from the API
  let apiEntries: { path: string; lastmod: string; priority: number; changefreq: string }[] = [];
  try {
    apiEntries = await fetchSitemapUrls();
  } catch {
    // API unreachable -- ship static pages only; don't break the build.
    console.warn("[sitemap] Could not fetch sitemap URLs from API -- shipping static-only sitemap.");
  }

  // Build a set of paths already covered by static pages (normalised: no
  // trailing slash) so dynamic entries don't produce duplicates.
  const staticPathSet = new Set(STATIC_PAGES.map((p) => p.path.replace(/\/$/, "")));

  // Merge API entries that aren't already in the static set.
  const merged: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; lastModified?: Date }[] = [];

  for (const sp of STATIC_PAGES) {
    merged.push({
      path: sp.path,
      priority: sp.priority,
      changeFrequency: sp.changeFrequency,
      lastModified: new Date(),
    });
  }

  for (const entry of apiEntries) {
    // Normalise: strip trailing slash so /services/foo/ -> /services/foo
    const normalised = entry.path.replace(/\/$/, "");
    if (!staticPathSet.has(normalised)) {
      merged.push({
        path: normalised,
        priority: entry.priority,
        changeFrequency: entry.changefreq as MetadataRoute.Sitemap[number]["changeFrequency"],
        lastModified: entry.lastmod ? new Date(entry.lastmod) : new Date(),
      });
      staticPathSet.add(normalised); // guard against API duplicates too
    }
  }

  // 2. Expand every path across all supported locales
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of SUPPORTED_LOCALES) {
    for (const page of merged) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: page.lastModified ?? new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  return entries;
}
