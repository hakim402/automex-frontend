"use client";

// app/[locale]/(auth)/_components/GoogleButton.tsx

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { googleLogin } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { getMe } from "@/lib/auth";

interface GoogleButtonProps {
  redirectTo?: string;
}

export function GoogleButton({ redirectTo }: GoogleButtonProps) {
  const router = useRouter();
  const locale = useLocale();
  const { setUser } = useAuth();

  async function handleSuccess(credentialResponse: CredentialResponse) {
    if (!credentialResponse.credential) return;

    try {
      await googleLogin(credentialResponse.credential);

      // Hydrate auth context without an extra round-trip page load
      const user = await getMe();
      setUser(user);

      const destination =
        redirectTo && redirectTo.startsWith("/")
          ? redirectTo
          : `/${locale}/dashboard`;

      router.push(destination);
    } catch {
      toast.error("Google sign-in failed. Please try again.");
    }
  }

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error("Google sign-in failed. Please try again.")}
        useOneTap={false}
        auto_select={false}
        width="100%"
        shape="rectangular"
        theme="outline"
        size="large"
        text="continue_with"
      />
    </div>
  );
}
