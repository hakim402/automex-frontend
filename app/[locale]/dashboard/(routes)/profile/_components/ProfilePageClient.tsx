"use client";

// app/[locale]/dashboard/(routes)/profile/_components/ProfilePageClient.tsx

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import { ProfileHeader } from "./ProfileHeader";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { AccountInfoCard } from "./AccountInfoCard";
import { ProfileSkeleton } from "./ProfileSkeleton";

// ─────────────────────────────────────────────────────────────────────────────

export function ProfilePageClient() {
  const t = useTranslations("Profile");
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isAr = pathname.startsWith("/ar");

  // Redirect if session expired (middleware handles it, but belt + braces)
  useEffect(() => {
    if (!loading && !user) router.replace("/sign-in");
  }, [loading, user, router]);

  if (loading || !user) return <ProfileSkeleton />;

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6"
    >
      {/* Page heading */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground">{t("pageTitle")}</h1>
        <p className="text-[14px] text-muted-foreground mt-1">
          {t("pageDescription")}
        </p>
      </div>

      {/* ── Sections ── */}
      <ProfileHeader user={user} />
      <PersonalInfoForm user={user} />
      <AccountInfoCard user={user} />
    </div>
  );
}
