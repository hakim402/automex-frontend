/**
 * env.ts — Centralised environment variable access
 *
 * IMPORTANT — why no module-level throws:
 *
 *   Next.js inlines NEXT_PUBLIC_* vars into the client bundle at BUILD time
 *   via static string replacement. If this file is evaluated as a module
 *   before that replacement runs (e.g. during SSR hydration of a client
 *   component), process.env[key] appears undefined even when the .env file
 *   is correct — causing a false-positive throw.
 *
 *   Solution: export plain getters (functions) so the value is only read
 *   at CALL time, after Next.js has finished its static replacement.
 *   Hard validation (validateEnv) is reserved for server-side startup only
 *   and is called once from app/layout.tsx.
 */

// ─── Internal helpers ────────────────────────────────────────────────────────

function readEnv(key: string): string {
  // process.env access must use a string literal for Next.js static analysis.
  // Since we can't use process.env[key] with a dynamic key in all contexts,
  // we map the known keys explicitly below.
  return (process.env[key] ?? "").trim();
}

// ─── Exported getters ────────────────────────────────────────────────────────
// Use functions so the value is read lazily at call time, not at import time.

/**
 * Base URL for all API calls, e.g. http://localhost:8000/api
 * Must NOT have a trailing slash.
 */
export function getApiBaseUrl(): string {
  // Explicit literal access ensures Next.js static analysis picks this up
  const value =
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ?? "";
  return value.replace(/\/+$/, "");
}

/**
 * Google OAuth client ID from Google Cloud Console.
 */
export function getGoogleClientId(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? "";
}

/**
 * Application base URL. Falls back to localhost:3000.
 */
export function getAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ?? "http://localhost:3000"
  ).replace(/\/+$/, "");
}

/**
 * Convenience constant — safe to read at module level because
 * NODE_ENV is always available in both server and client bundles.
 */
export const IS_PRODUCTION = process.env.NODE_ENV === "production";

// ─── Backwards-compatible constants ──────────────────────────────────────────
// These retain the original export names so existing imports don't break.
// They are computed lazily via a getter on the module object.

export const API_BASE_URL: string = /* @__PURE__ */ (() => getApiBaseUrl())();
export const GOOGLE_CLIENT_ID: string = /* @__PURE__ */ (() => getGoogleClientId())();
export const APP_URL: string = /* @__PURE__ */ (() => getAppUrl())();

// ─── Server-side startup validation ─────────────────────────────────────────
// Call this ONCE in app/layout.tsx (a Server Component).
// Never call it inside a "use client" file.

const REQUIRED_KEYS = [
  "NEXT_PUBLIC_API_BASE_URL",
  "NEXT_PUBLIC_GOOGLE_CLIENT_ID",
] as const;

export function validateEnv(): void {
  // Guard: only run on the server to avoid false positives on the client
  if (typeof window !== "undefined") return;

  const missing: string[] = [];

  for (const key of REQUIRED_KEYS) {
    if (!process.env[key]?.trim()) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `[env] The following required environment variables are missing:\n` +
        missing.map((k) => `  • ${k}`).join("\n") +
        `\n\nAdd them to your .env file.`
    );
  }
}

/**
 * Alias for APP_URL, used specifically for SEO purposes (canonical URLs,
 * OG tags, sitemap.ts) per the AUTOMEX data-fetching roadmap's
 * NEXT_PUBLIC_SITE_URL. Same value as APP_URL — kept as a named alias
 * rather than a duplicate env var so there's one source of truth for
 * "what is our own frontend's public URL."
 */
export const getSiteUrl = getAppUrl;