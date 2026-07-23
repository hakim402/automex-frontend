/**
 * Route Handler — Resolves translated slugs for language switching.
 *
 * When a user switches language on a dynamic page (e.g. /services/[slug]),
 * the slug in the URL may differ in the target language because `slug` is a
 * translated field (django-parler). This endpoint resolves the correct slug
 * by:
 *   1. Fetching the item by its current slug (in English / source language)
 *      to get its stable UUID.
 *   2. Fetching the list endpoint in the target language and matching by ID.
 *   3. Returning the translated slug.
 *
 * Results are cached in-memory for 10 minutes to avoid repeated API calls.
 */
import { NextRequest, NextResponse } from "next/server";
import { automexFetch, type Paginated } from "@/lib/automex/client";

// ─── Locale mapping ──────────────────────────────────────────────────────────
// Frontend uses `zh`; backend (django-parler) uses `zh-hans`.
function toBackendLang(lang: string): string {
  return lang === "zh" ? "zh-hans" : lang;
}

// ─── Model → endpoint mapping ────────────────────────────────────────────────

const MODEL_ENDPOINTS: Record<string, string> = {
  service: "/services/",
  "blog-post": "/blog/posts/",
  "case-study": "/case-studies/",
  portfolio: "/portfolio/",
};

// ─── In-memory cache (10 min TTL) ────────────────────────────────────────────

interface CacheEntry {
  slug: string;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function cacheKey(model: string, slug: string, lang: string): string {
  return `${model}:${slug}:${lang}`;
}

function getCached(model: string, slug: string, lang: string): string | null {
  const key = cacheKey(model, slug, lang);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.slug;
}

function setCache(model: string, slug: string, lang: string, resolvedSlug: string): void {
  const key = cacheKey(model, slug, lang);
  cache.set(key, { slug: resolvedSlug, expiresAt: Date.now() + CACHE_TTL });
}

// ─── Resolver ────────────────────────────────────────────────────────────────

async function resolveSlug(
  model: string,
  slug: string,
  targetLang: string
): Promise<string | null> {
  // Check cache first
  const cached = getCached(model, slug, targetLang);
  if (cached !== null) return cached;

  const listPath = MODEL_ENDPOINTS[model];
  if (!listPath) return null;

  const backendLang = toBackendLang(targetLang);

  try {
    // Step 1: Fetch the item by slug in the source language (no lang param → default en)
    // to get its stable UUID.
    const sourceItem = await automexFetch<{ id: string }>(
      `${listPath}${slug}/`
    );

    // Step 2: Fetch all items in the target language and find the one with matching ID.
    const targetList = await automexFetch<Paginated<{ id: string; slug: string }>>(
      `${listPath}?lang=${backendLang}`,
      { revalidate: 600 }
    );

    const match = targetList.results.find((item) => item.id === sourceItem.id);
    if (match) {
      setCache(model, slug, targetLang, match.slug);
      return match.slug;
    }

    return null;
  } catch {
    // If the source slug doesn't resolve or the list fails, return null.
    return null;
  }
}

// ─── GET handler ─────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const model = searchParams.get("model");
  const slug = searchParams.get("slug");
  const lang = searchParams.get("lang");

  if (!model || !slug || !lang) {
    return NextResponse.json(
      { error: "Missing required params: model, slug, lang" },
      { status: 400 }
    );
  }

  if (!MODEL_ENDPOINTS[model]) {
    return NextResponse.json(
      { error: `Unknown model: ${model}. Supported: ${Object.keys(MODEL_ENDPOINTS).join(", ")}` },
      { status: 400 }
    );
  }

  const resolvedSlug = await resolveSlug(model, slug, lang);

  if (!resolvedSlug) {
    return NextResponse.json(
      { error: "Could not resolve translated slug" },
      { status: 404 }
    );
  }

  return NextResponse.json({ slug: resolvedSlug });
}
