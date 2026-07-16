/**
 * client.ts — The ONLY place that ever constructs a request to the
 * AUTOMEX Django API (content, CRM, assistant, SEO domains — everything
 * gated by X-API-Key, as opposed to the JWT-based accounts API which has
 * its own separate client in lib/api.ts / lib/auth.ts).
 *
 * Every domain fetcher (fetchServices, submitContactLead, etc. — built in
 * later steps) calls through automexFetch() rather than calling fetch()
 * directly.
 */
import "server-only";
import { getApiBaseUrl } from "@/lib/env";
import { getAutomexApiKey } from "./env.server";
import type { SupportedLocale } from "@/lib/locale";

// ─── Error shape ──────────────────────────────────────────────────────────

export type AutomexErrorKind =
  | "validation" // 400 — field-keyed errors, pass through as-is
  | "not_found" // 404
  | "rate_limited" // 429
  | "auth_config" // 403 — API key itself missing/invalid/expired; log loudly
  | "unknown";

export class AutomexApiError extends Error {
  readonly kind: AutomexErrorKind;
  readonly status: number;
  /** Raw parsed JSON body, if any — for 400s this is the field-error dict. */
  readonly body: unknown;

  constructor(kind: AutomexErrorKind, status: number, body: unknown, message: string) {
    super(message);
    this.name = "AutomexApiError";
    this.kind = kind;
    this.status = status;
    this.body = body;
  }
}

function classifyStatus(status: number): AutomexErrorKind {
  switch (status) {
    case 400:
      return "validation";
    case 403:
      return "auth_config";
    case 404:
      return "not_found";
    case 429:
      return "rate_limited";
    default:
      return "unknown";
  }
}

// ─── Pagination envelope ────────────────────────────────────────────────

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

function isPaginated<T>(value: unknown): value is Paginated<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "results" in value &&
    Array.isArray((value as { results?: unknown }).results)
  );
}

export function unwrapPaginated<T>(value: unknown): T[] {
  if (isPaginated<T>(value)) return value.results;
  if (Array.isArray(value)) return value as T[];
  throw new Error("[automex] Expected a paginated response or array, got: " + typeof value);
}

// ─── The fetch wrapper ──────────────────────────────────────────────────

export interface AutomexFetchOptions extends Omit<RequestInit, "next"> {
  /** Locale code — one of the 10 supported AUTOMEX languages. Resolved from route params, not Accept-Language. */
  lang?: SupportedLocale;
  revalidate?: number;
  tags?: string[];
}

export async function automexFetch<T>(path: string, options: AutomexFetchOptions = {}): Promise<T> {
  const { lang, revalidate, tags, headers, ...init } = options;

  const baseUrl = getApiBaseUrl();
  const apiKey = getAutomexApiKey();

  const url = new URL(`${baseUrl}${path}`);
  if (lang) url.searchParams.set("lang", lang);

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      ...init,
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
        ...headers,
      },
      next: { revalidate, tags },
    });
  } catch (err) {
    throw new AutomexApiError(
      "unknown",
      0,
      null,
      `[automex] Network error calling ${path}: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      // non-JSON error body — leave body null
    }

    const kind = classifyStatus(res.status);

    if (kind === "auth_config") {
      // The API key itself is missing/invalid/expired — not a user-facing
      // situation. Log loudly so it doesn't get silently swallowed as a
      // generic "content not found."
      console.error(
        `[automex] 403 from ${path} — AUTOMEX_API_KEY is missing, invalid, inactive, or expired.`
      );
    }

    throw new AutomexApiError(
      kind,
      res.status,
      body,
      `[automex] ${res.status} ${res.statusText} on ${path}`
    );
  }

  // Some write endpoints may return 201 with no body in edge cases; guard it.
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}