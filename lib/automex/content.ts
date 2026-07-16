/**
 * content.ts — Read-only fetchers for the AUTOMEX content domain
 * (Services, Case Studies, Blog, Team, Testimonials, taxonomy).
 *
 * Two return shapes, deliberately:
 *   - Services / Case Studies / Blog Posts (the three things with real
 *     pagination UI) return the full Paginated<T> envelope.
 *   - Everything else (taxonomy, team, testimonials, FAQs) is small and
 *     rendered in full on one page — those return plain T[] via
 *     unwrapPaginated, so callers don't have to think about pages.
 *
 * 404s resolve to `null` instead of throwing, so page components can do:
 *   const service = await fetchServiceBySlug(slug, lang);
 *   if (!service) notFound();
 * Any other error (network, 500, 403 auth_config, 429) still throws —
 * those aren't "this page doesn't exist," they're "something is broken,"
 * and should surface to an error boundary rather than a fake 404.
 */
import { automexFetch, unwrapPaginated, AutomexApiError, type Paginated } from "./client";
import type {
  ServiceListItem,
  ServiceDetail,
  ServiceCategory,
  Technology,
  Industry,
  ProcessStep,
  FAQ,
  CaseStudyListItem,
  CaseStudyDetail,
  BlogCategory,
  BlogTag,
  BlogPostListItem,
  BlogPostDetail,
  TeamMember,
  Testimonial,
} from "./types";

import type { SupportedLocale } from "@/lib/locale";

// ─── Revalidate windows — per §12 of the data-fetching roadmap ───────────

const REVALIDATE = {
  content: 600, // Services/CaseStudies/BlogPosts — 5-15 min band, middle value
  taxonomy: 3600, // Technologies/Industries/ProcessSteps/Categories — changes rarely
  people: 1200, // Team/Testimonials — 15-30 min band, middle value
} as const;

/** Resolves a 404 to null; rethrows everything else. */
async function orNull<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch (err) {
    if (err instanceof AutomexApiError && err.kind === "not_found") return null;
    throw err;
  }
}

// ─── Services ─────────────────────────────────────────────────────────

export interface ServiceListParams {
  category?: string; // slug
  industry?: string; // slug
  technology?: string; // slug
  is_featured?: boolean;
  search?: string;
  ordering?: string; // "order" | "-order" | "published_at" | "-published_at"
  page?: number;
}

export async function fetchServices(
  params: ServiceListParams = {},
  lang?: SupportedLocale
): Promise<Paginated<ServiceListItem>> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) query.set(key, String(value));
  }
  const qs = query.toString();
  return automexFetch<Paginated<ServiceListItem>>(`/services/${qs ? `?${qs}` : ""}`, {
    lang,
    revalidate: REVALIDATE.content,
    tags: ["services"],
  });
}

export function fetchServiceBySlug(slug: string, lang?: SupportedLocale): Promise<ServiceDetail | null> {
  return orNull(
    automexFetch<ServiceDetail>(`/services/${slug}/`, {
      lang,
      revalidate: REVALIDATE.content,
      tags: ["services", `service:${slug}`],
    })
  );
}

export async function fetchServiceCategories(lang?: SupportedLocale): Promise<ServiceCategory[]> {
  const data = await automexFetch<unknown>(`/service-categories/`, {
    lang,
    revalidate: REVALIDATE.taxonomy,
    tags: ["service-categories"],
  });
  return unwrapPaginated<ServiceCategory>(data);
}

// ─── Case Studies ─────────────────────────────────────────────────────

export interface CaseStudyListParams {
  industry?: string;
  service?: string;
  technology?: string;
  is_featured?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
}

export async function fetchCaseStudies(
  params: CaseStudyListParams = {},
  lang?: SupportedLocale
): Promise<Paginated<CaseStudyListItem>> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) query.set(key, String(value));
  }
  const qs = query.toString();
  return automexFetch<Paginated<CaseStudyListItem>>(`/case-studies/${qs ? `?${qs}` : ""}`, {
    lang,
    revalidate: REVALIDATE.content,
    tags: ["case-studies"],
  });
}

export function fetchCaseStudyBySlug(slug: string, lang?: SupportedLocale): Promise<CaseStudyDetail | null> {
  return orNull(
    automexFetch<CaseStudyDetail>(`/case-studies/${slug}/`, {
      lang,
      revalidate: REVALIDATE.content,
      tags: ["case-studies", `case-study:${slug}`],
    })
  );
}

// ─── Blog ─────────────────────────────────────────────────────────────

export interface BlogPostListParams {
  category?: string; // slug
  tag?: string; // slug
  is_featured?: boolean;
  search?: string;
  ordering?: string; // "published_at" | "-published_at" | "views_count" | "-views_count"
  page?: number;
}

export async function fetchBlogPosts(
  params: BlogPostListParams = {},
  lang?: SupportedLocale
): Promise<Paginated<BlogPostListItem>> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) query.set(key, String(value));
  }
  const qs = query.toString();
  return automexFetch<Paginated<BlogPostListItem>>(`/blog/posts/${qs ? `?${qs}` : ""}`, {
    lang,
    revalidate: REVALIDATE.content,
    tags: ["blog-posts"],
  });
}

export function fetchBlogPostBySlug(slug: string, lang?: SupportedLocale): Promise<BlogPostDetail | null> {
  return orNull(
    automexFetch<BlogPostDetail>(`/blog/posts/${slug}/`, {
      lang,
      revalidate: REVALIDATE.content,
      tags: ["blog-posts", `blog-post:${slug}`],
    })
  );
}

export async function fetchBlogCategories(lang?: SupportedLocale): Promise<BlogCategory[]> {
  const data = await automexFetch<unknown>(`/blog/categories/`, {
    lang,
    revalidate: REVALIDATE.taxonomy,
    tags: ["blog-categories"],
  });
  return unwrapPaginated<BlogCategory>(data);
}

export async function fetchBlogTags(lang?: SupportedLocale): Promise<BlogTag[]> {
  const data = await automexFetch<unknown>(`/blog/tags/`, {
    lang,
    revalidate: REVALIDATE.taxonomy,
    tags: ["blog-tags"],
  });
  return unwrapPaginated<BlogTag>(data);
}

// ─── Taxonomy (small, static-ish sets — always fetched in full) ───────

export async function fetchTechnologies(
  category?: string,
  lang?: SupportedLocale
): Promise<Technology[]> {
  const qs = category ? `?category=${encodeURIComponent(category)}` : "";
  const data = await automexFetch<unknown>(`/technologies/${qs}`, {
    lang,
    revalidate: REVALIDATE.taxonomy,
    tags: ["technologies"],
  });
  return unwrapPaginated<Technology>(data);
}

export async function fetchIndustries(lang?: SupportedLocale): Promise<Industry[]> {
  const data = await automexFetch<unknown>(`/industries/`, {
    lang,
    revalidate: REVALIDATE.taxonomy,
    tags: ["industries"],
  });
  return unwrapPaginated<Industry>(data);
}

export async function fetchProcessSteps(lang?: SupportedLocale): Promise<ProcessStep[]> {
  const data = await automexFetch<unknown>(`/process-steps/`, {
    lang,
    revalidate: REVALIDATE.taxonomy,
    tags: ["process-steps"],
  });
  return unwrapPaginated<ProcessStep>(data);
}

export async function fetchFAQs(
  filters: { category?: FAQ["category"]; service?: string } = {},
  lang?: SupportedLocale
): Promise<FAQ[]> {
  const query = new URLSearchParams();
  if (filters.category) query.set("category", filters.category);
  if (filters.service) query.set("service", filters.service);
  const qs = query.toString();
  const data = await automexFetch<unknown>(`/faqs/${qs ? `?${qs}` : ""}`, {
    lang,
    revalidate: REVALIDATE.taxonomy,
    tags: ["faqs"],
  });
  return unwrapPaginated<FAQ>(data);
}

// ─── Team & Testimonials ────────────────────────────────────────────────

export async function fetchTeamMembers(lang?: SupportedLocale): Promise<TeamMember[]> {
  const data = await automexFetch<unknown>(`/team/`, {
    lang,
    revalidate: REVALIDATE.people,
    tags: ["team"],
  });
  return unwrapPaginated<TeamMember>(data);
}

export async function fetchTestimonials(
  filters: { is_featured?: boolean; related_service?: string; related_case_study?: string } = {},
  lang?: SupportedLocale
): Promise<Testimonial[]> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined) query.set(key, String(value));
  }
  const qs = query.toString();
  const data = await automexFetch<unknown>(`/testimonials/${qs ? `?${qs}` : ""}`, {
    lang,
    revalidate: REVALIDATE.people,
    tags: ["testimonials"],
  });
  return unwrapPaginated<Testimonial>(data);
}