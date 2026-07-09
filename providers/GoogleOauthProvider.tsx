// app/providers/GoogleOauthProvider.tsx

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