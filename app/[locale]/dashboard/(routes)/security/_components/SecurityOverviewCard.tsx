/**
 * SecurityOverviewCard.tsx — Security health summary
 *
 * Shows a traffic-light status grid:
 *   • Email verified
 *   • Password strength (set vs not set for OAuth users)
 *   • Active sessions count
 *   • Sign-in method
 *   • Account age
 *
 * Read-only — links to the relevant section below for action.
 */
"use client";

import { useTranslations } from "next-intl";
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  AlertCircle,
  KeyRound,
  Mail,
  Users,
  Fingerprint,
} from "lucide-react";
import { motion } from "framer-motion";
import { type User } from "@/lib/auth";
import { SectionCard } from "../../profile/_components/SectionCard";
import { cn } from "@/lib/utils";

interface SecurityOverviewCardProps {
  user: User;
  sessionCount: number;
}

// ─── Single status item ───────────────────────────────────────────────────────

interface StatusItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  status: "good" | "warn" | "info";
}

function StatusItem({ icon: Icon, label, value, status }: StatusItemProps) {
  const colors = {
    good: {
      bg: "bg-emerald-500/10",
      icon: "text-emerald-500",
      dot: "bg-emerald-500",
    },
    warn: {
      bg: "bg-amber-500/10",
      icon: "text-amber-500",
      dot: "bg-amber-500",
    },
    info: { bg: "bg-primary/10", icon: "text-primary", dot: "bg-primary" },
  }[status];

  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-border/50
                    bg-card/50 px-4 py-3 hover:bg-muted/20 transition-colors"
    >
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl",
          colors.bg,
        )}
      >
        <Icon className={cn("size-4", colors.icon)} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-[13px] font-semibold text-foreground truncate">
          {value}
        </p>
      </div>
      <div className={cn("size-2 rounded-full shrink-0", colors.dot)} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function SecurityOverviewCard({
  user,
  sessionCount,
}: SecurityOverviewCardProps) {
  const t = useTranslations("Security");

  const allGood = user.is_email_verified && sessionCount <= 3;

  return (
    <SectionCard
      icon={allGood ? ShieldCheck : ShieldAlert}
      title={t("sectionOverview")}
      description={t("sectionOverviewDesc")}
      delay={0}
    >
      {/* Overall health banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "flex items-start gap-4 rounded-xl border p-4 mb-6",
          allGood
            ? "border-emerald-500/20 bg-emerald-500/5"
            : "border-amber-500/20 bg-amber-500/5",
        )}
      >
        {allGood ? (
          <ShieldCheck className="size-5 text-emerald-500 shrink-0 mt-0.5" />
        ) : (
          <ShieldAlert className="size-5 text-amber-500 shrink-0 mt-0.5" />
        )}
        <div>
          <p
            className={cn(
              "text-[13px] font-semibold",
              allGood
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-600 dark:text-amber-400",
            )}
          >
            {allGood ? t("overallGood") : t("overallWarn")}
          </p>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {allGood ? t("overallGoodDesc") : t("overallWarnDesc")}
          </p>
        </div>
      </motion.div>

      {/* Status grid */}
      <div className="grid sm:grid-cols-2 gap-3">
        <StatusItem
          icon={Mail}
          label={t("statusEmailLabel")}
          value={
            user.is_email_verified
              ? t("statusVerified")
              : t("statusNotVerified")
          }
          status={user.is_email_verified ? "good" : "warn"}
        />
        <StatusItem
          icon={KeyRound}
          label={t("statusPasswordLabel")}
          value={
            user.is_oauth_user ? t("statusOAuthOnly") : t("statusPasswordSet")
          }
          status={user.is_oauth_user ? "info" : "good"}
        />
        <StatusItem
          icon={Users}
          label={t("statusSessionsLabel")}
          value={`${sessionCount} ${t("statusActiveSessions")}`}
          status={sessionCount <= 3 ? "good" : "warn"}
        />
        <StatusItem
          icon={Fingerprint}
          label={t("statusSignInLabel")}
          value={user.is_oauth_user ? "Google OAuth" : t("statusEmailPassword")}
          status="info"
        />
      </div>
    </SectionCard>
  );
}
