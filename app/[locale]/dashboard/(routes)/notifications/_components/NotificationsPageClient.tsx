"use client";

// app/[locale]/dashboard/(routes)/notifications/_components/NotificationsPageClient.tsx

import { useEffect, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  Bell,
  Check,
  CheckCheck,
  AlertCircle,
  Inbox,
  RefreshCw,
  Mail,
  MailOpen,
  Clock,
  Settings,
  ChevronDown,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  fetchNotificationPreferences,
  updateNotificationPreferences,
} from "@/lib/automex/notifications";
import type { NotificationList, NotificationPreference, NotificationPreferenceUpdate } from "@/lib/automex/types";

// ─── Animation variants ─────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease, delay },
});

// ─── Priority colors mapping ────────────────────────────────────────────────

const PRIORITY_COLORS: Record<string, string> = {
  low: "text-gray-400",
  normal: "text-blue-400",
  high: "text-amber-400",
  urgent: "text-red-500",
};

// ─── Notification Card Component ────────────────────────────────────────────

interface NotificationCardProps {
  notification: NotificationList;
  locale: string;
  onMarkRead: (id: string) => void;
}

function NotificationCard({
  notification,
  locale,
  onMarkRead,
}: NotificationCardProps) {
  const isUnread = !notification.is_read;
  const priorityColor =
    PRIORITY_COLORS[notification.priority] || "text-gray-400";

  return (
    <motion.div
      {...fadeUp(0)}
      className={cn(
        "flex items-start gap-4 rounded-2xl border p-4 transition-all duration-200",
        isUnread
          ? "border-primary/30 bg-primary/5"
          : "border-border/50 bg-card/70",
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-xl shrink-0",
          isUnread ? "bg-primary/20" : "bg-muted/50",
        )}
      >
        {isUnread ? (
          <Mail className="size-5 text-primary" />
        ) : (
          <MailOpen className="size-5 text-muted-foreground" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              className={cn(
                "text-[14px] truncate",
                isUnread
                  ? "font-semibold text-foreground"
                  : "font-medium text-foreground",
              )}
            >
              {notification.subject}
            </p>
            <p className="text-[12px] text-muted-foreground mt-0.5 line-clamp-2">
              {notification.body}
            </p>
          </div>
          <span className={cn("text-[10px] shrink-0", priorityColor)}>
            <Clock className="size-3" />
          </span>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <span className="text-[11px] text-muted-foreground">
            {notification.event_type_display}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {new Date(notification.created_at).toLocaleString(locale, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isUnread && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[11px] gap-1"
              onClick={() => onMarkRead(notification.id)}
            >
              <Check className="size-3" />
              Mark read
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Skeleton Component ─────────────────────────────────────────────────────

function NotificationsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card/70 p-4"
        >
          <div className="size-10 rounded-xl bg-muted-foreground/10 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 bg-muted-foreground/10 rounded animate-pulse" />
            <div className="h-3 w-full bg-muted-foreground/10 rounded animate-pulse" />
            <div className="h-3 w-24 bg-muted-foreground/10 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page Client ───────────────────────────────────────────────────────

export function NotificationsPageClient() {
  const t = useTranslations("Notifications");
  const locale = useLocale();

  const [notifications, setNotifications] = useState<NotificationList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Preferences state
  const [showPrefs, setShowPrefs] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [prefsLoading, setPrefsLoading] = useState(false);
  const [prefsSaving, setPrefsSaving] = useState(false);
  const [prefsError, setPrefsError] = useState<string | null>(null);
  const [prefsSaved, setPrefsSaved] = useState(false);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load notifications",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  // Handle mark single as read
  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // Handle mark all as read
  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Load preferences
  const loadPreferences = async () => {
    setPrefsLoading(true);
    setPrefsError(null);
    try {
      const data = await fetchNotificationPreferences();
      setPreferences(data);
    } catch (err) {
      setPrefsError(err instanceof Error ? err.message : "Failed to load preferences");
    } finally {
      setPrefsLoading(false);
    }
  };

  // Toggle prefs panel and load on first open
  const handleTogglePrefs = () => {
    const next = !showPrefs;
    setShowPrefs(next);
    if (next && preferences.length === 0) {
      loadPreferences();
    }
  };

  // Toggle a preference's is_enabled
  const togglePref = (id: string) => {
    setPreferences((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_enabled: !p.is_enabled } : p))
    );
    setPrefsSaved(false);
  };

  // Change digest frequency
  const changeDigest = (id: string, freq: string) => {
    setPreferences((prev) =>
      prev.map((p) => (p.id === id ? { ...p, digest_frequency: freq as any } : p))
    );
    setPrefsSaved(false);
  };

  // Save preferences
  const handleSavePrefs = async () => {
    setPrefsSaving(true);
    try {
      const payload: NotificationPreferenceUpdate = {
        preferences: preferences.map((p) => ({
          event_type: p.event_type,
          channel: p.channel,
          is_enabled: p.is_enabled,
          digest_frequency: p.digest_frequency,
        })),
      };
      const updated = await updateNotificationPreferences(payload);
      setPreferences(updated);
      setPrefsSaved(true);
      setTimeout(() => setPrefsSaved(false), 3000);
    } catch (err) {
      setPrefsError(err instanceof Error ? err.message : "Failed to save preferences");
    } finally {
      setPrefsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("pageTitle")}
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            {t("pageDescription")}
            {unreadCount > 0 && (
              <span className="ml-1 font-medium text-primary">
                ({unreadCount} {t("unread")})
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTogglePrefs}
            className="gap-2"
          >
            <Settings className="size-3.5" />
            {t("preferences")}
            <ChevronDown className={cn("size-3.5 transition-transform", showPrefs && "rotate-180")} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadNotifications}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
            {t("refresh")}
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              className="gap-2"
            >
              <CheckCheck className="size-3.5" />
              {t("markAllRead")}
            </Button>
          )}
        </div>
      </div>

      {/* Notification Preferences Panel */}
      {showPrefs && (
        <div className="rounded-2xl border border-border/50 bg-card/70 p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-foreground">
              {t("prefsTitle")}
            </h2>
            <Button
              size="sm"
              onClick={handleSavePrefs}
              disabled={prefsSaving || preferences.length === 0}
              className="gap-2"
            >
              {prefsSaving ? (
                <RefreshCw className="size-3.5 animate-spin" />
              ) : prefsSaved ? (
                <Check className="size-3.5" />
              ) : (
                <Save className="size-3.5" />
              )}
              {prefsSaved ? t("prefsSaved") : t("prefsSave")}
            </Button>
          </div>

          {prefsError && (
            <p className="text-[13px] text-red-400">{prefsError}</p>
          )}

          {prefsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="h-4 w-40 bg-muted-foreground/10 rounded animate-pulse" />
                  <div className="h-8 w-20 bg-muted-foreground/10 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {preferences.map((pref) => (
                <div
                  key={pref.id}
                  className={cn(
                    "flex items-center justify-between gap-4 rounded-lg p-3 transition-colors",
                    pref.is_enabled ? "bg-muted/30" : "bg-muted/10 opacity-60"
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-foreground">
                      {pref.event_type_display}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {pref.channel_display}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Digest frequency selector */}
                    {pref.is_enabled && (
                      <select
                        value={pref.digest_frequency || "instant"}
                        onChange={(e) => changeDigest(pref.id, e.target.value)}
                        className="h-8 rounded-lg border border-border/50 bg-card text-[12px] px-2 text-foreground"
                      >
                        <option value="instant">{t("freqInstant")}</option>
                        <option value="daily">{t("freqDaily")}</option>
                        <option value="weekly">{t("freqWeekly")}</option>
                      </select>
                    )}
                    {/* Toggle switch */}
                    <button
                      onClick={() => togglePref(pref.id)}
                      className={cn(
                        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                        pref.is_enabled ? "bg-primary" : "bg-muted-foreground/30"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block size-3.5 rounded-full bg-white transition-transform",
                          pref.is_enabled ? "translate-x-4.5" : "translate-x-0.5"
                        )}
                      />
                    </button>
                  </div>
                </div>
              ))}
              {preferences.length === 0 && !prefsLoading && (
                <p className="text-[13px] text-muted-foreground text-center py-4">
                  {t("prefsEmpty")}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {loading && <NotificationsSkeleton />}

      {/* Error state */}
      {error && !loading && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <AlertCircle className="size-8 text-red-400" />
          <p className="text-[14px] text-red-400">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={loadNotifications}
            className="gap-2"
          >
            <RefreshCw className="size-3.5" />
            {t("retry")}
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && notifications.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <Inbox className="size-12 text-muted-foreground/30" />
          <div>
            <p className="text-[14px] font-medium text-foreground">
              {t("emptyTitle")}
            </p>
            <p className="text-[13px] text-muted-foreground mt-1">
              {t("emptyDescription")}
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && !error && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              locale={locale}
              onMarkRead={handleMarkRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}
