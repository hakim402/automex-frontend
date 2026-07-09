/**
 * AuthContext.tsx — Single source of truth for auth state
 *
 * Provides:
 *   user        — the authenticated User object, or null
 *   loading     — true while the initial /auth/me/ call is in flight
 *   reloadUser  — manually re-fetch the user (e.g. after profile update)
 *   logout      — revoke session + clear tokens + redirect
 *
 * Architecture decisions:
 *   • AuthProvider wraps the entire app (in Providers.tsx).
 *   • It calls getMe() once on mount to rehydrate the session from
 *     the stored access token. No token → user stays null.
 *   • Components consume useAuth() — throws if used outside provider.
 *   • Route-level protection is handled by middleware.ts, NOT here.
 *     This context is for reading user data inside pages, not gating access.
 */

"use client";

// app/[locale]/_components/Header/Header.tsx

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { getMe, logout as authLogout, User } from "@/lib/auth";
import { TokenStorage } from "@/lib/api";

// ─── Context shape ────────────────────────────────────────────────────────────

interface AuthContextValue {
  /** The authenticated user, or null if not logged in. */
  user: User | null;

  /**
   * True only during the initial session rehydration on mount.
   * Use this to avoid showing a login redirect flash.
   */
  loading: boolean;

  /**
   * Re-fetch the current user from /auth/me/.
   * Call after profile updates or role changes.
   */
  reloadUser: () => Promise<void>;

  /**
   * Log out: revoke server session, clear tokens, redirect to /login.
   */
  logout: () => Promise<void>;

  /**
   * Manually set user after login (avoids a redundant /auth/me/ round-trip).
   * Called by login/Google login flows after receiving tokens.
   */
  setUser: (user: User | null) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Prevent double-fetch in React StrictMode (dev only)
  const didFetch = useRef(false);

  const reloadUser = useCallback(async () => {
    // No token at all → skip the network call
    if (TokenStorage.isAccessExpiredOrMissing() && !TokenStorage.getRefresh()) {
      setUser(null);
      return;
    }

    try {
      const data = await getMe();
      setUser(data);
    } catch {
      // 401 or network error → treat as logged out
      setUser(null);
    }
  }, []);

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
    router.push("/login");
  }, [router]);

  // ── Initial session rehydration ─────────────────────────────────────────
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    reloadUser().finally(() => setLoading(false));
  }, [reloadUser]);

  return (
    <AuthContext.Provider value={{ user, loading, reloadUser, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useAuth — Access auth state inside any client component.
 *
 * @example
 * const { user, loading, logout } = useAuth();
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "[useAuth] must be used inside <AuthProvider>.\n" +
        "Make sure <Providers> wraps your layout."
    );
  }

  return context;
}

// ─── Convenience selectors ────────────────────────────────────────────────────

/** True only when we're certain the user is logged in (loading finished + user exists). */
export function useIsAuthenticated(): boolean {
  const { user, loading } = useAuth();
  return !loading && user !== null;
}

/** Returns the user or throws if called before loading is done or user is null. */
export function useRequireUser(): User {
  const { user, loading } = useAuth();

  if (loading) {
    throw new Error("[useRequireUser] called before auth finished loading.");
  }

  if (!user) {
    throw new Error(
      "[useRequireUser] No authenticated user. " +
        "This hook should only be used in pages protected by middleware."
    );
  }

  return user;
}