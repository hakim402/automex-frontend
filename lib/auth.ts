/**
 * auth.ts — All authentication functions
 *
 * Pure async functions — no side effects beyond token storage.
 * Each function maps 1-to-1 with a backend endpoint.
 * UI components call these; they never call apiRequest directly.
 */

// lib/auth.ts

import { apiRequest, authRequest, TokenStorage } from "./api";

// ─── Response Types ───────────────────────────────────────────────────────────

export interface TokenResponse {
  success: boolean;
  message: string;
  access: string;
  refresh: string;
  access_expires_at: string;
}

export interface UserProfile {
  date_of_birth: string | null;
  phone_number: string | null;
  alternate_email: string | null;
  address_line1: string;
  address_line2: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  profile_picture: string | null;
  bio: string;
  preferences: Record<string, unknown>;
  timezone: string;
  language: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_email_verified: boolean;
  is_oauth_user: boolean;
  google_picture_url: string;
  tenant: string | null;
  terms_accepted_at: string;
  created_at: string;
  profile: UserProfile;
}

export interface Session {
  id: string;
  device_name: string;
  ip_address: string;
  last_used_at: string;
  created_at: string;
  expires_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Persist tokens + sync the auth_status cookie for middleware. */
async function storeTokens(data: TokenResponse): Promise<void> {
  TokenStorage.set(data.access, data.refresh, data.access_expires_at);
  // Notify the middleware via a lightweight cookie (no JWT stored in cookie)
  try {
    await fetch("/api/auth/session", { method: "POST" });
  } catch {
    // Non-fatal: the cookie sync is a best-effort middleware hint
  }
}

/** Clear tokens + remove the auth_status cookie. */
async function clearSession(): Promise<void> {
  TokenStorage.clear();
  try {
    await fetch("/api/auth/session", { method: "DELETE" });
  } catch {
    // Non-fatal
  }
}

// ─── 1. Register ──────────────────────────────────────────────────────────────

export interface RegisterPayload {
  email: string;
  full_name: string;
  password: string;
  password_confirm: string;
  terms_accepted: boolean;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user_id: string;
  email: string;
}

/**
 * Create a new account.
 * Does NOT log the user in — they must verify their email first.
 */
export async function register(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>("/auth/register/", {
    method: "POST",
    body: payload,
  });
}

// ─── 2. Verify Email ──────────────────────────────────────────────────────────

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

/**
 * Consume the email verification token from the URL query param.
 * Called on the /auth/verify-email page.
 */
export async function verifyEmail(token: string): Promise<VerifyEmailResponse> {
  return apiRequest<VerifyEmailResponse>("/auth/verify-email/", {
    method: "POST",
    body: { token },
  });
}

// ─── 3. Login ─────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Email + password login.
 * Stores access + refresh tokens on success.
 */
export async function login(payload: LoginPayload): Promise<TokenResponse> {
  const data = await apiRequest<TokenResponse>("/auth/login/", {
    method: "POST",
    body: payload,
  });
  await storeTokens(data);
  return data;
}

// ─── 4. Google OAuth ──────────────────────────────────────────────────────────

/**
 * Exchange a Google ID token (credential) for JWT pair.
 * Called after the @react-oauth/google callback fires.
 */
export async function googleLogin(credential: string): Promise<TokenResponse> {
  const data = await apiRequest<TokenResponse>("/auth/google/", {
    method: "POST",
    body: { credential },
  });
  await storeTokens(data);
  return data;
}

// ─── 5. Logout ────────────────────────────────────────────────────────────────

/**
 * Revoke the refresh token on the backend, then clear local storage.
 * Always clears tokens locally even if the API call fails.
 */
export async function logout(): Promise<void> {
  const refresh = TokenStorage.getRefresh();

  if (refresh) {
    try {
      await authRequest("/auth/logout/", {
        method: "POST",
        body: { refresh },
      });
    } catch {
      // Backend revocation failed — still clear locally.
    }
  }

  await clearSession();
}

// ─── 6. Token Refresh ─────────────────────────────────────────────────────────

export interface RefreshResponse {
  success: boolean;
  access: string;
  refresh: string;
  access_expires_at: string;
}

/**
 * Exchange the current refresh token for a new token pair.
 * Called automatically by authRequest() — you rarely need this directly.
 * Always replaces both tokens (rotation).
 */
export async function refreshToken(): Promise<RefreshResponse> {
  const refresh = TokenStorage.getRefresh();

  if (!refresh) {
    throw new Error("No refresh token available");
  }

  const data = await apiRequest<RefreshResponse>("/auth/token/refresh/", {
    method: "POST",
    body: { refresh },
  });

  // Replace both tokens
  TokenStorage.set(data.access, data.refresh, data.access_expires_at);

  return data;
}

// ─── 7. Get Current User ──────────────────────────────────────────────────────

/**
 * Fetch the authenticated user's profile.
 * Used by AuthContext on mount to rehydrate the session.
 */
export async function getMe(): Promise<User> {
  return authRequest<User>("/auth/me/");
}

// ─── 8. Update Current User ───────────────────────────────────────────────────

export interface UpdateMePayload {
  full_name?: string;
  privacy_accepted_version?: string;
  profile?: Partial<UserProfile>;
}

/**
 * Partial update of the authenticated user's profile.
 */
export async function updateMe(payload: UpdateMePayload): Promise<User> {
  return authRequest<User>("/auth/me/update/", {
    method: "PATCH",
    body: payload,
  });
}

// ─── 9. Change Password ───────────────────────────────────────────────────────

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirm: string;
}

/**
 * Change password for the authenticated user.
 * The backend invalidates existing sessions on success.
 * Always follow with logout() + redirect to /login.
 */
export async function changePassword(
  payload: ChangePasswordPayload
): Promise<{ success: boolean; message: string }> {
  const current_refresh = TokenStorage.getRefresh();

  return authRequest("/auth/me/change-password/", {
    method: "POST",
    body: { ...payload, current_refresh },
  });
}

// ─── 10. Magic Link ───────────────────────────────────────────────────────────

export interface MagicLinkRequestResponse {
  success: boolean;
  message: string;
}

/**
 * Request a magic link email.
 * Response is always "success" to prevent email enumeration.
 */
export async function requestMagicLink(
  email: string
): Promise<MagicLinkRequestResponse> {
  return apiRequest<MagicLinkRequestResponse>("/auth/magic-link/request/", {
    method: "POST",
    body: { email },
  });
}

/**
 * Consume the magic link token from the URL.
 * Called on /auth/magic-link page.
 * Stores tokens on success.
 */
export async function verifyMagicLink(token: string): Promise<TokenResponse> {
  const data = await apiRequest<TokenResponse>("/auth/magic-link/verify/", {
    method: "POST",
    body: { token },
  });
  await storeTokens(data);
  return data;
}

// ─── 11. Password Reset ───────────────────────────────────────────────────────

/**
 * Request a password reset email.
 * Response is always "success" to prevent email enumeration.
 */
export async function requestPasswordReset(
  email: string
): Promise<{ success: boolean; message: string }> {
  return apiRequest("/auth/password-reset/request/", {
    method: "POST",
    body: { email },
  });
}

export interface ConfirmPasswordResetPayload {
  token: string;
  password: string;
  password_confirm: string;
}

/**
 * Submit the new password using the reset token from the URL.
 * Called on /auth/reset-password page.
 * Does NOT log the user in — they must login manually after reset.
 */
export async function confirmPasswordReset(
  payload: ConfirmPasswordResetPayload
): Promise<{ success: boolean; message: string }> {
  return apiRequest("/auth/password-reset/confirm/", {
    method: "POST",
    body: payload,
  });
}

// ─── 12. Sessions ─────────────────────────────────────────────────────────────

export interface SessionsResponse {
  sessions: Session[];
}

/**
 * List all active sessions for the authenticated user.
 */
export async function getActiveSessions(): Promise<SessionsResponse> {
  return authRequest<SessionsResponse>("/auth/sessions/");
}

/**
 * Revoke a specific session by ID.
 * Use for "Log out this device" functionality.
 */
export async function revokeSession(
  sessionId: string
): Promise<{ success: boolean }> {
  return authRequest(`/auth/sessions/${sessionId}/revoke/`, {
    method: "DELETE",
  });
}

// ─── 13. Error Message Formatter ──────────────────────────────────────────────

/**
 * Extract a human-readable message from any thrown error.
 * Handles DRF validation errors, ApiError, and plain Error objects.
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return "Something went wrong";

  if (typeof error === "string") return error;

  if (error instanceof Error) return error.message;

  const e = error as Record<string, unknown>;

  if (typeof e.message === "string") return e.message;
  if (typeof e.detail === "string") return e.detail;

  if (Array.isArray(e.non_field_errors) && e.non_field_errors.length > 0) {
    return String(e.non_field_errors[0]);
  }

  if (e.fieldErrors && typeof e.fieldErrors === "object") {
    const fields = e.fieldErrors as Record<string, string[]>;
    const first = Object.values(fields)[0];
    if (Array.isArray(first) && first.length > 0) return String(first[0]);
  }

  return "Something went wrong";
}