/**
 * ActiveSessionsCard.tsx — List + revoke active sessions
 *
 * Calls:
 *   GET    /auth/sessions/              → list sessions
 *   DELETE /auth/sessions/:id/revoke/   → revoke single session
 *
 * Features:
 *   • Highlights the "current" session (most recently used)
 *   • Per-session revoke button with optimistic UI update
 *   • Device name + IP + last used + expiry
 *   • Loading skeleton while fetching
 *   • Empty state
 */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Smartphone,
  Globe,
  Loader2,
  LogOut,
  Shield,
  Clock,
  Wifi,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  getActiveSessions,
  revokeSession,
  getErrorMessage,
  type Session,
} from "@/lib/auth";
import { SectionCard } from "../../profile/_components/SectionCard";
import { cn } from "@/lib/utils";

// ─── Device icon heuristic ────────────────────────────────────────────────────

function DeviceIcon({ name }: { name: string }) {
  const lower = name.toLowerCase();
  if (
    lower.includes("mobile") ||
    lower.includes("iphone") ||
    lower.includes("android")
  ) {
    return <Smartphone className="size-4" />;
  }
  if (
    lower.includes("chrome") ||
    lower.includes("firefox") ||
    lower.includes("safari")
  ) {
    return <Globe className="size-4" />;
  }
  return <Monitor className="size-4" />;
}

// ─── Time formatter ───────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SessionSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border/50 p-4 flex items-start gap-4"
        >
          <div className="size-10 rounded-xl bg-muted/60 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 bg-muted/60 rounded animate-pulse" />
            <div className="h-3 w-56 bg-muted/60 rounded animate-pulse" />
            <div className="h-3 w-32 bg-muted/60 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Single session row ───────────────────────────────────────────────────────

interface SessionRowProps {
  session: Session;
  isCurrent: boolean;
  onRevoke: (id: string) => Promise<void>;
  revoking: boolean;
  t: (key: string) => string;
}

function SessionRow({
  session,
  isCurrent,
  onRevoke,
  revoking,
  t,
}: SessionRowProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative rounded-xl border p-4 transition-colors",
        isCurrent
          ? "border-primary/25 bg-primary/5"
          : "border-border/50 bg-card/50 hover:bg-muted/20",
      )}
    >
      {/* Current badge */}
      {isCurrent && (
        <span
          className="absolute top-3 inset-e-3 inline-flex items-center gap-1
                         rounded-full border border-emerald-500/25
                         bg-emerald-500/10 px-2 py-0.5
                         text-[10px] font-bold text-emerald-500"
        >
          <Wifi className="size-2.5" />
          {t("currentSession")}
        </span>
      )}

      <div className="flex items-start gap-4">
        {/* Device icon chip */}
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            isCurrent
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground",
          )}
        >
          <DeviceIcon name={session.device_name} />
        </div>

        {/* Session details */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="text-[13px] font-semibold text-foreground truncate pe-16">
            {session.device_name || t("unknownDevice")}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <Globe className="size-3" />
              {session.ip_address || "—"}
            </span>
            <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <Clock className="size-3" />
              {t("lastActive")} {timeAgo(session.last_used_at)}
            </span>
          </div>

          <p className="text-[11px] text-muted-foreground/60">
            {t("expires")} {formatDate(session.expires_at)}
          </p>
        </div>
      </div>

      {/* Revoke button — hidden for current session */}
      {!isCurrent && (
        <div className="mt-3 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            disabled={revoking}
            onClick={() => onRevoke(session.id)}
            className="text-destructive hover:text-destructive
                       hover:bg-destructive/10 rounded-lg gap-1.5
                       text-[12px] h-7 px-3"
          >
            {revoking ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <LogOut className="size-3.5" />
            )}
            {t("revokeSession")}
          </Button>
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function ActiveSessionsCard() {
  const t = useTranslations("Security");

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);

  // ── Load sessions ───────────────────────────────────────────────────────────
  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getActiveSessions();
      setSessions(res.sessions);
    } catch {
      toast.error(t("sessionLoadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // ── Revoke single session ────────────────────────────────────────────────────
  async function handleRevoke(sessionId: string) {
    setRevoking(sessionId);
    // Optimistic removal
    const previous = sessions;
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));

    try {
      await revokeSession(sessionId);
      toast.success(t("sessionRevoked"));
    } catch (err) {
      // Rollback
      setSessions(previous);
      toast.error(getErrorMessage(err));
    } finally {
      setRevoking(null);
    }
  }

  // Most recently used = current session
  const currentSession = sessions.reduce<Session | null>((latest, s) => {
    if (!latest) return s;
    return new Date(s.last_used_at) > new Date(latest.last_used_at)
      ? s
      : latest;
  }, null);

  return (
    <SectionCard
      icon={Shield}
      title={t("sectionSessions")}
      description={t("sectionSessionsDesc")}
      delay={0.2}
    >
      {/* Refresh button */}
      <div className="flex justify-end mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={loadSessions}
          disabled={loading}
          className="text-muted-foreground hover:text-foreground
                     rounded-lg gap-1.5 text-[12px] h-7 px-3"
        >
          <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
          {t("refresh")}
        </Button>
      </div>

      {loading ? (
        <SessionSkeleton />
      ) : sessions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <div
            className="flex size-12 items-center justify-center
                          rounded-2xl bg-muted/30"
          >
            <Shield className="size-5 text-muted-foreground/40" />
          </div>
          <p className="text-[13px] font-medium text-foreground/60">
            {t("noSessions")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {sessions.map((session) => (
              <SessionRow
                key={session.id}
                session={session}
                isCurrent={session.id === currentSession?.id}
                onRevoke={handleRevoke}
                revoking={revoking === session.id}
                t={t}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </SectionCard>
  );
}
