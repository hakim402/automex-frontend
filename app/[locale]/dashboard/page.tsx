/**
 * app/[locale]/dashboard/page.tsx — Dashboard home (Client Component)
 *
 * Fixes vs original:
 *   • `bg-primary/8` → `bg-primary/[8%]`   (non-standard opacity step)
 *   • Framer Motion easing arrays are fine — kept as-is
 *   • `isAr` derived from useLocale() instead of pathname hacking
 *   • `cn` import confirmed present
 *   • Static data stays — swap with real API calls when backend is ready
 */
"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  ArrowRight, PackageSearch, Video, BriefcaseBusiness,
  BotMessageSquare, Bell, CheckCircle, Clock, TrendingUp,
  Zap, FileText, CalendarDays, MessageSquare, Star,
  AlertCircle, ChevronRight, Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Animation presets ───────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease, delay },
});

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.07 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

// ─── Static data — replace with API calls ────────────────────────────────────

const STATS = [
  { icon: PackageSearch, labelKey: "statRequests", value: "12", delta: "+3 this month", deltaPositive: true, color: "text-primary", bg: "bg-primary/10" },
  { icon: Video, labelKey: "statBookings", value: "4", delta: "1 upcoming", deltaPositive: true, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { icon: BriefcaseBusiness, labelKey: "statConsulting", value: "2", delta: "Active sessions", deltaPositive: true, color: "text-amber-500", bg: "bg-amber-500/10" },
  { icon: BotMessageSquare, labelKey: "statTickets", value: "1", delta: "Awaiting reply", deltaPositive: false, color: "text-[#7c3aed]", bg: "bg-[#7c3aed]/10" },
] as const;

const ACTIVITY = [
  { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", titleKey: "actApproved", time: "14 min ago" },
  { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", titleKey: "actPending", time: "1 hour ago" },
  { icon: Video, color: "text-primary", bg: "bg-primary/10", titleKey: "actBooking", time: "Yesterday" },
  { icon: MessageSquare, color: "text-[#7c3aed]", bg: "bg-[#7c3aed]/10", titleKey: "actSupport", time: "2 days ago" },
] as const;

const QUICK_LINKS = [
  { icon: PackageSearch, labelKey: "quickRequests", descKey: "quickRequestsDesc", href: "/dashboard/requests", color: "text-primary", bg: "bg-primary/10", border: "hover:border-primary/30" },
  { icon: Video, labelKey: "quickBookings", descKey: "quickBookingsDesc", href: "/dashboard/bookings", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "hover:border-emerald-500/30" },
  { icon: BriefcaseBusiness, labelKey: "quickConsulting", descKey: "quickConsultingDesc", href: "/dashboard/consulting", color: "text-amber-500", bg: "bg-amber-500/10", border: "hover:border-amber-500/30" },
  { icon: BotMessageSquare, labelKey: "quickSupport", descKey: "quickSupportDesc", href: "/dashboard/support", color: "text-[#7c3aed]", bg: "bg-[#7c3aed]/10", border: "hover:border-[#7c3aed]/30" },
  { icon: Bell, labelKey: "quickNotifications", descKey: "quickNotificationsDesc", href: "/dashboard/notifications", color: "text-ring", bg: "bg-ring/10", border: "hover:border-ring/30" },
  { icon: FileText, labelKey: "quickProfile", descKey: "quickProfileDesc", href: "/profile", color: "text-muted-foreground", bg: "bg-muted", border: "hover:border-border" },
] as const;

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const isRtl = ["ar", "fa", "ps"].includes(locale);

  const { user } = useAuth();

  const firstName = user?.full_name?.split(" ")[0] ?? t("defaultName");
  const isVerified = user?.is_email_verified ?? false;

  const hour = new Date().getHours();
  const greetKey = hour < 12 ? "greetMorning" : hour < 17 ? "greetAfternoon" : "greetEvening";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8"
    >

      {/* ── 1. Welcome banner ─────────────────────────────────────────── */}
      <motion.div {...fadeUp(0)}>
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 sm:p-8">
          {/* Background */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_0%_50%,rgb(10_184_251/6%),transparent)]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle,#94c6e9 1px,transparent 1px)", backgroundSize: "24px 24px" }} />

          <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              {/* Eyebrow */}
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1">
                <Sparkles className="size-3 text-primary" aria-hidden="true" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                  {t("welcomeEyebrow")}
                </span>
              </div>

              <h2 className="mb-1.5 text-2xl font-bold text-foreground sm:text-3xl">
                {t(greetKey as Parameters<typeof t>[0])},{" "}
                <span className="text-color">{firstName}</span> 👋
              </h2>
              <p className="max-w-lg text-[14px] leading-6 text-muted-foreground">
                {t("welcomeDescription")}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex shrink-0 flex-wrap gap-3">
              <Button
                asChild
                className="rounded-full bg-color shadow-brand hover:-translate-y-0.5 transition-transform duration-200 font-semibold gap-2"
              >
                <Link href="/dashboard/requests">
                  {t("ctaNewRequest")}
                  <ArrowRight className={cn("size-4", isRtl && "rotate-180")} aria-hidden="true" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="rounded-full hover:border-primary/40 hover:text-primary transition-colors gap-2"
              >
                <Link href="/dashboard/bookings">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {t("ctaBookSession")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 2. Stats strip ────────────────────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.labelKey}
              variants={staggerItem}
              className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/80 p-5 backdrop-blur-sm hover:border-primary/25 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className={cn("flex size-9 items-center justify-center rounded-xl", stat.bg)}>
                  <Icon className={cn("size-4", stat.color)} aria-hidden="true" />
                </div>
                <TrendingUp className="size-3.5 text-muted-foreground/40" aria-hidden="true" />
              </div>

              <div>
                <p className="text-2xl font-bold tabular-nums text-foreground">{stat.value}</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">{t(stat.labelKey as Parameters<typeof t>[0])}</p>
              </div>

              <p className={cn("text-[11px] font-medium", stat.deltaPositive ? "text-emerald-500" : "text-amber-500")}>
                {stat.delta}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── 3 + 4. Activity + Quick links ─────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Recent activity */}
        <motion.div {...fadeUp(0.1)}>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="size-3.5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-[14px] font-semibold text-foreground">{t("sectionActivity")}</h3>
              </div>
              <Link
                href="/dashboard/requests"
                className="flex items-center gap-1 text-[12px] font-medium text-primary hover:underline underline-offset-4"
              >
                {t("viewAll")}
                <ChevronRight className={cn("size-3.5", isRtl && "rotate-180")} aria-hidden="true" />
              </Link>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border/30">
              {ACTIVITY.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors"
                  >
                    <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-xl", item.bg)}>
                      <Icon className={cn("size-4", item.color)} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[13px] font-medium text-foreground">
                        {t(item.titleKey as Parameters<typeof t>[0])}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{item.time}</p>
                    </div>
                    <ChevronRight className={cn("size-3.5 shrink-0 text-muted-foreground/40", isRtl && "rotate-180")} aria-hidden="true" />
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Quick links */}
        <motion.div {...fadeUp(0.15)}>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-border/40 px-5 py-4">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
                <Star className="size-3.5 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-[14px] font-semibold text-foreground">{t("sectionQuickLinks")}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4">
              {QUICK_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href as Parameters<typeof Link>[0]["href"]}
                    className={cn(
                      "flex flex-col gap-3 rounded-xl border border-border/60",
                      "bg-card/50 p-4 transition-all duration-200",
                      "hover:-translate-y-0.5 hover:shadow-sm",
                      link.border,
                    )}
                  >
                    <div className={cn("flex size-8 items-center justify-center rounded-xl", link.bg)}>
                      <Icon className={cn("size-4", link.color)} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-foreground">
                        {t(link.labelKey as Parameters<typeof t>[0])}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                        {t(link.descKey as Parameters<typeof t>[0])}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── 5. Account status ─────────────────────────────────────────── */}
      <motion.div {...fadeUp(0.2)}>
        <div className="rounded-2xl border border-border/60 bg-card/80 p-5 backdrop-blur-sm sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
              <CheckCircle className="size-3.5 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-[14px] font-semibold text-foreground">{t("sectionAccount")}</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatusBadge
              icon={isVerified ? CheckCircle : AlertCircle}
              label={t("statusEmail")}
              value={isVerified ? t("statusVerified") : t("statusUnverified")}
              positive={isVerified}
            />
            <StatusBadge
              icon={user?.is_oauth_user ? Sparkles : CheckCircle}
              label={t("statusAuthMethod")}
              value={user?.is_oauth_user ? "Google OAuth" : t("statusPassword")}
              positive
            />
            <StatusBadge
              icon={CheckCircle}
              label={t("statusRole")}
              value={user?.role ?? "Client"}
              positive
            />
          </div>
        </div>
      </motion.div>

    </div>
  );
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  icon: React.ElementType;
  label: string;
  value: string;
  positive: boolean;
}

function StatusBadge({ icon: Icon, label, value, positive }: StatusBadgeProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
      <div className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-xl",
        positive ? "bg-emerald-500/10" : "bg-amber-500/10",
      )}>
        <Icon
          className={cn("size-4", positive ? "text-emerald-500" : "text-amber-500")}
          aria-hidden="true"
        />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="truncate text-[13px] font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}