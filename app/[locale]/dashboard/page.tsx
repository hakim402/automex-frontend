"use client";

// app/[locale]/dashboard/page.tsx

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GreetingBanner } from "./_components/GreetingBanner";
import { StatsCards } from "./_components/StatsCards";
import { QuickActions } from "./_components/QuickActions";
import { RecentActivity } from "./_components/RecentActivity";
import { DashboardSkeleton } from "./_components/DashboardSkeleton";
import { fetchDashboardSummary } from "@/lib/automex/dashboard";
import type { DashboardSummary } from "@/lib/automex/types";

// ─── Page client component ──────────────────────────────────────────────────

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = () => {
    setLoading(true);
    setError(null);
    fetchDashboardSummary()
      .then(setSummary)
      .catch((err) => setError(err.message || "Failed to load dashboard data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSummary();
  }, []);

  // ─── Labels for child components ────────────────────────────────────────

  const statsLabels = {
    requests: t("statsRequests"),
    requestsSub: t("statsRequestsActive"),
    bookings: t("statsBookings"),
    bookingsSub: t("statsBookingsUpcoming"),
    tickets: t("statsTickets"),
    ticketsSub: t("statsTicketsOpen"),
    calculations: t("statsCalculations"),
    calculationsSub: t("statsCalculationsTotal"),
  };

  const quickActionLabels = {
    actionNewRequest: t("actionNewRequest"),
    actionNewRequestDesc: t("actionNewRequestDesc"),
    actionBookCall: t("actionBookCall"),
    actionBookCallDesc: t("actionBookCallDesc"),
    actionSupport: t("actionSupport"),
    actionSupportDesc: t("actionSupportDesc"),
  };

  const recentActivityLabels = {
    sectionTitle: t("sectionRecentActivity"),
    viewAll: t("recentViewAll"),
    emptyText: t("recentEmpty"),
    recentRequest: t("recentRequest"),
    recentBooking: t("recentBooking"),
    recentTicket: t("recentTicket"),
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Greeting banner */}
      <GreetingBanner />

      {/* Loading state */}
      {loading && <DashboardSkeleton />}

      {/* Error state */}
      {error && !loading && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <AlertCircle className="size-8 text-red-400" />
          <p className="text-[14px] text-red-400">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={loadSummary}
            className="gap-2"
          >
            <RefreshCw className="size-3.5" />
            {t("retry")}
          </Button>
        </div>
      )}

      {/* Success state */}
      {!loading && !error && summary && (
        <>
          {/* Stats section */}
          <section>
            <h2 className="mb-4 text-[15px] font-semibold text-foreground">
              {t("sectionOverview")}
            </h2>
            <StatsCards summary={summary} labels={statsLabels} />
          </section>

          {/* Quick actions section */}
          <section>
            <h2 className="mb-4 text-[15px] font-semibold text-foreground">
              {t("sectionQuickActions")}
            </h2>
            <QuickActions labels={quickActionLabels} />
          </section>

          {/* Recent activity section */}
          <section>
            <h2 className="mb-4 text-[15px] font-semibold text-foreground">
              {t("sectionRecentActivity")}
            </h2>
            <RecentActivity labels={recentActivityLabels} />
          </section>
        </>
      )}
    </div>
  );
}
