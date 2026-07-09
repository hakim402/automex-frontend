/**
 * api.ts — Core fetch wrapper
 *
 * Two public functions:
 *   apiRequest()  — unauthenticated / public endpoints
 *   authRequest() — protected endpoints (auto-attaches token + retries on 401)
 *
 * No Axios. Native fetch keeps the bundle lean and works in
 * Next.js Server Components, Route Handlers, and the browser equally.
 */

// lib/api.ts

import { getApiBaseUrl } from "./env";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ApiError {
  status: number;
  message: string;
  // DRF field-level errors: { email: ["..."], non_field_errors: ["..."] }
  fieldErrors?: Record<string, string[]>;
  raw?: unknown;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  /** Skip attaching the Authorization header even if a token exists. */
  skipAuth?: boolean;
  /** Next.js-specific fetch cache control. */
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

// ─── Token helpers (browser only) ───────────────────────────────────────────

const isBrowser = typeof window !== "undefined";

export const TokenStorage = {
  getAccess(): string | null {
    return isBrowser ? localStorage.getItem("access") : null;
  },
  getRefresh(): string | null {
    return isBrowser ? localStorage.getItem("refresh") : null;
  },
  getExpiresAt(): Date | null {
    if (!isBrowser) return null;
    const raw = localStorage.getItem("access_expires_at");
    return raw ? new Date(raw) : null;
  },
  set(access: string, refresh: string, expiresAt?: string): void {
    if (!isBrowser) return;
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    if (expiresAt) localStorage.setItem("access_expires_at", expiresAt);
  },
  clear(): void {
    if (!isBrowser) return;
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("access_expires_at");
  },
  /** Returns true if the access token is absent or expires within 30 seconds. */
  isAccessExpiredOrMissing(): boolean {
    const access = this.getAccess();
    if (!access) return true;
    const expiresAt = this.getExpiresAt();
    if (!expiresAt) return false; // no expiry info → assume valid
    return expiresAt.getTime() - Date.now() < 30_000; // 30 s buffer
  },
};

// ─── Error normaliser ────────────────────────────────────────────────────────

function buildApiError(status: number, body: unknown): ApiError {
  if (!body || typeof body !== "object") {
    return { status, message: "Something went wrong", raw: body };
  }

  const b = body as Record<string, unknown>;

  // { detail: "..." }
  if (typeof b.detail === "string") {
    return { status, message: b.detail, raw: body };
  }

  // { non_field_errors: ["..."] }
  if (Array.isArray(b.non_field_errors) && b.non_field_errors.length > 0) {
    return {
      status,
      message: String(b.non_field_errors[0]),
      fieldErrors: b as Record<string, string[]>,
      raw: body,
    };
  }

  // { email: ["..."], password: ["..."] }
  const fieldErrors: Record<string, string[]> = {};
  let firstMessage = "Something went wrong";
  let foundField = false;

  for (const [key, val] of Object.entries(b)) {
    if (Array.isArray(val)) {
      fieldErrors[key] = val.map(String);
      if (!foundField) {
        firstMessage = String(val[0]);
        foundField = true;
      }
    }
  }

  return { status, message: firstMessage, fieldErrors, raw: body };
}

// ─── Core fetch ──────────────────────────────────────────────────────────────

async function coreFetch<T = unknown>(
  path: string,
  options: RequestOptions & { accessToken?: string | null }
): Promise<T> {
  const {
    method = "GET",
    body,
    headers: extraHeaders = {},
    skipAuth = false,
    cache,
    next,
    accessToken,
  } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  if (!skipAuth && accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    ...(cache ? { cache } : {}),
    ...(next ? { next } : {}),
  };

  if (body !== undefined) {
    fetchOptions.body = JSON.stringify(body);
  }

  const url = `${getApiBaseUrl()}${path}`;
  const response = await fetch(url, fetchOptions);

  // 204 No Content — return empty object
  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw buildApiError(response.status, data);
  }

  return data as T;
}

// ─── Refresh logic (singleton promise to prevent parallel refresh calls) ─────

let _refreshPromise: Promise<{ access: string; refresh: string; access_expires_at?: string }> | null = null;

async function performTokenRefresh() {
  // Import here to avoid circular dependency (auth.ts imports api.ts)
  const { refreshToken } = await import("./auth");
  return refreshToken();
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * apiRequest — For public (unauthenticated) endpoints.
 * Never attaches an Authorization header.
 */
export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  return coreFetch<T>(path, { ...options, skipAuth: true, accessToken: null });
}

/**
 * authRequest — For protected endpoints.
 *
 * 1. Proactively refreshes the access token if it's expired / expiring soon.
 * 2. Attaches the access token to every request.
 * 3. On 401, refreshes once and retries automatically.
 * 4. On second 401 (refresh itself failed), clears tokens and redirects to /login.
 */
export async function authRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  // ── Proactive refresh ───────────────────────────────────────────────────
  if (TokenStorage.isAccessExpiredOrMissing()) {
    if (!_refreshPromise) {
      _refreshPromise = performTokenRefresh().finally(() => {
        _refreshPromise = null;
      });
    }
    try {
      await _refreshPromise;
    } catch {
      // Refresh failed — clear tokens and let the request fail naturally
      TokenStorage.clear();
      if (isBrowser) window.location.href = "/login";
      throw { status: 401, message: "Session expired. Please log in again." };
    }
  }

  const accessToken = TokenStorage.getAccess();

  try {
    return await coreFetch<T>(path, { ...options, accessToken });
  } catch (error) {
    const apiErr = error as ApiError;

    // ── Reactive 401 retry ──────────────────────────────────────────────
    if (apiErr.status !== 401) throw error;

    // Deduplicate parallel 401 retries
    if (!_refreshPromise) {
      _refreshPromise = performTokenRefresh().finally(() => {
        _refreshPromise = null;
      });
    }

    try {
      await _refreshPromise;
    } catch {
      TokenStorage.clear();
      if (isBrowser) window.location.href = "/login";
      throw { status: 401, message: "Session expired. Please log in again." };
    }

    // One more attempt with the new token
    const newToken = TokenStorage.getAccess();
    return coreFetch<T>(path, { ...options, accessToken: newToken });
  }
}