
/**
 * providers.tsx — Client-side provider tree ("use client" boundary)
 *
 * Wraps the app with all client-only providers so that root layout
 * and [locale]/layout can remain pure Server Components.
 *
 * Provider order (outer → inner):
 *   ThemeProvider        — dark/light mode (must be outermost for CSS vars)
 *   GoogleOAuthProvider  — Google SDK available everywhere below
 *   AuthProvider         — user state, login/logout helpers
 *
 * Add future client providers (React Query, etc.) here — never in layout.tsx.
 */

"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { getGoogleClientId } from "@/lib/env";

interface ProvidersProps {
  children: React.ReactNode;
}

export function GoogleOauthProvider({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId={getGoogleClientId()}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}