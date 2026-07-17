// app/sitemap.ts
import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES } from "@/lib/locale";

const BASE_URL = "https://automex.tech";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    // Main
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },

    // Public pages
    { path: "/products", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/services", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/blogs", priority: 0.7, changeFrequency: "weekly" as const },

    // CRM hub & conversion pages
    { path: "/crm", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/crm/book-a-call", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/crm/quote", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/crm/contact-sales", priority: 0.8, changeFrequency: "weekly" as const },

    // Legal
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of SUPPORTED_LOCALES) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  return entries;
}