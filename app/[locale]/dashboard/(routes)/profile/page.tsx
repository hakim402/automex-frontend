/**
 * profile/page.tsx — User profile management page
 *
 * Layout (top → bottom):
 *   1. ProfileHeader    — avatar + name + status chips
 *   2. PersonalInfoForm — editable fields (name, bio, address, etc.)
 *   3. AccountInfoCard  — read-only metadata (ID, sign-in method, dates)
 *
 * Data flow:
 *   • useAuth() provides the live User object from AuthContext
 *   • Forms call updateMe() → reloadUser() to sync context
 *   • Loading skeleton shown while auth context is hydrating
 */
"use client";

import { useTranslations } from "next-intl";
import { usePathname }     from "next/navigation";
import { useRouter }       from "next/navigation";
import { useEffect }       from "react";
import { useAuth }         from "@/contexts/AuthContext";

import { ProfileHeader }   from "./_components/ProfileHeader";
import { PersonalInfoForm } from "./_components/PersonalInfoForm";
import { AccountInfoCard } from "./_components/AccountInfoCard";
import { ProfileSkeleton } from "./_components/ProfileSkeleton";

// ─────────────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const t               = useTranslations("Profile");
  const { user, loading } = useAuth();
  const pathname        = usePathname();
  const router          = useRouter();
  const isAr            = pathname.startsWith("/ar");

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
        <p className="text-[14px] text-muted-foreground mt-1">{t("pageDescription")}</p>
      </div>

      {/* ── Sections ── */}
      <ProfileHeader   user={user} />
      <PersonalInfoForm user={user} />
      <AccountInfoCard  user={user} />
    </div>
  );
}