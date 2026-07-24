"use client";

// app/[locale]/dashboard/(routes)/security/_components/SecurityPageClient.tsx

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import { SecurityOverviewCard } from "./SecurityOverviewCard";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { ActiveSessionsCard } from "./ActiveSessionsCard";
import { DangerZoneCard } from "./DangerZoneCard";
import { SecuritySkeleton } from "./SecuritySkeleton";
import { getActiveSessions } from "@/lib/auth";

// ─────────────────────────────────────────────────────────────────────────────

export function SecurityPageClient() {
  const t = useTranslations("Security");
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isAr = pathname.startsWith("/ar");

  const [sessionCount, setSessionCount] = useState(0);

  // Redirect if unauthenticated
  useEffect(() => {
    if (!loading && !user) router.replace("/sign-in");
  }, [loading, user, router]);

  // Fetch session count for the overview card
  useEffect(() => {
    if (!user) return;
    getActiveSessions()
      .then((res) => setSessionCount(res.sessions.length))
      .catch(() => {}); // non-critical — overview will show 0
  }, [user]);

  if (loading || !user) return <SecuritySkeleton />;

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
      <SecurityOverviewCard user={user} sessionCount={sessionCount} />
      <ChangePasswordForm isOAuthUser={user.is_oauth_user} />
      <ActiveSessionsCard />
      <DangerZoneCard user={user} />
    </div>
  );
}
