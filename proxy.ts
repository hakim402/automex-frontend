/**
 * proxy.ts — Composed middleware: i18n (next-intl) + auth route protection
 *
 * Execution order:
 *   1. next-intl handles locale detection, redirect, and cookie setting
 *   2. Auth layer reads auth_status cookie and protects / redirects routes
 *
 * Route anatomy (i18n):
 *   Browser URL     /en/dashboard  →  stripped path  /dashboard  →  PROTECTED
 *   Browser URL     /ar/sign-in    →  stripped path  /sign-in    →  AUTH_ROUTE
 */

import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

// ─── next-intl instance ───────────────────────────────────────────────────────

const intlMiddleware = createIntlMiddleware(routing);

// ─── Route lists (without locale prefix) ─────────────────────────────────────

/** Require a valid session — redirect to /sign-in if missing. */
const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/security",
  "/settings",
];

/** Redirect logged-in users away (e.g. back to dashboard). */
const AUTH_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
];

/**
 * Token-consumption pages — always accessible regardless of session state.
 * These pages call the API themselves and handle their own error states.
 */
const PUBLIC_ROUTES = [
  "/auth/verify-email",
  "/auth/magic-link",
  "/auth/reset-password",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripLocale(pathname: string, locales: readonly string[]): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname;
}

function matchesRoute(stripped: string, routes: string[]): boolean {
  return routes.some((r) => stripped === r || stripped.startsWith(`${r}/`));
}

// ─────────────────────────────────────────────────────────────────────────────

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Step 1: next-intl (locale detection + redirect) ────────────────────
  const intlResponse = intlMiddleware(request);

  // Honour next-intl locale redirects immediately (e.g. / → /en)
  if (intlResponse.status === 307 || intlResponse.status === 308) {
    return intlResponse;
  }

  // ── Step 2: strip locale prefix for route matching ──────────────────────
  const locales = routing.locales as readonly string[];
  const stripped = stripLocale(pathname, locales);

  // Always-public token pages — skip auth check entirely
  if (matchesRoute(stripped, PUBLIC_ROUTES)) return intlResponse;

  // ── Step 3: auth cookie ─────────────────────────────────────────────────
  // Set to "1" by POST /api/auth/session after login.
  // Cleared by DELETE /api/auth/session on logout.
  const isLoggedIn = request.cookies.get("auth_status")?.value === "1";

  // Current locale — from next-intl response header or routing default
  const locale =
    intlResponse.headers.get("X-Next-Intl-Locale") ??
    (routing.defaultLocale as string);

  // ── Step 4: protected route + no session → redirect to /sign-in ─────────
  if (matchesRoute(stripped, PROTECTED_ROUTES) && !isLoggedIn) {
    const url = new URL(`/${locale}/sign-in`, request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // ── Step 5: auth route + active session → redirect to /dashboard ─────────
  if (matchesRoute(stripped, AUTH_ROUTES) && isLoggedIn) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    const isSafe =
      redirectParam?.startsWith("/") && !redirectParam.startsWith("//");
    const dest = isSafe ? redirectParam! : `/${locale}/dashboard`;
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // ── Step 6: pass through ─────────────────────────────────────────────────
  return intlResponse;
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*|sitemap|robots|manifest|favicon).*)",
  ],
};