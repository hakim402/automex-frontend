/**
 * app/[locale]/dashboard/_components/Header/DashboardHeader.tsx — Sticky top bar for dashboard pages
 *
 * Features:
 *   • Mobile hamburger → opens Sidebar drawer via SidebarContext
 *   • Breadcrumb / page title (passed as prop)
 *   • Notification bell with unread badge + popover preview
 *   • Theme toggle
 *   • Language switcher
 *   • User avatar chip linking to profile
 *   • Full RTL support — dir attribute + isAr-aware layout
 *   • i18n labels from useTranslations("DashboardHeader")
 *
 * Notification data is STATIC for now — replace the STATIC_NOTIFICATIONS
 * array with a real API call when the backend is ready.
 */
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Bell,
  BellOff,
  CheckCheck,
  Check,
  X,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle,
  AlertTriangle,
  Package,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/app/[locale]/_components/Theme/theme-toggle";
import { LanguageSwitcher } from "@/app/[locale]/_components/Language/LanguageSwitcher";
import { Link } from "@/i18n/routing";
import { useSidebar } from "@/contexts/sidebar-context";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

// ─── Static notification type ─────────────────────────────────────────────────

type NotifType = "info" | "success" | "warning" | "request";

interface StaticNotification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string; // ISO string
}

// ─── Static demo data (replace with API call when backend ready) ──────────────

const STATIC_NOTIFICATIONS: StaticNotification[] = [
  {
    id: "1",
    type: "success",
    title: "Request approved",
    message: "Your service request #1042 has been approved and is now in progress.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
  },
  {
    id: "2",
    type: "info",
    title: "New message from support",
    message: "Your ticket #203 received a reply. Click to view the conversation.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "3",
    type: "warning",
    title: "Booking reminder",
    message: "You have a video consultation scheduled for tomorrow at 10:00 AM.",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "4",
    type: "request",
    title: "Invoice ready",
    message: "Invoice #INV-2024-089 is ready for download in your documents.",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

// ─── Notif config map ─────────────────────────────────────────────────────────

const NOTIF_CONFIG: Record<
  NotifType,
  {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    dot: string;
    chip: string;
    label: string;
    labelAr: string;
  }
> = {
  info:    { icon: Info,          iconBg: "bg-primary/10",     iconColor: "text-primary",    dot: "bg-primary",    chip: "border-primary/20 bg-primary/8 text-primary",       label: "Info",     labelAr: "معلومة" },
  success: { icon: CheckCircle,   iconBg: "bg-emerald-500/10", iconColor: "text-emerald-500",dot: "bg-emerald-500",chip: "border-emerald-500/20 bg-emerald-500/8 text-emerald-500", label: "Done",  labelAr: "تم" },
  warning: { icon: AlertTriangle, iconBg: "bg-amber-500/10",   iconColor: "text-amber-500",  dot: "bg-amber-500",  chip: "border-amber-500/20 bg-amber-500/8 text-amber-500",  label: "Alert",    labelAr: "تنبيه" },
  request: { icon: Package,       iconBg: "bg-accent",         iconColor: "text-accent-foreground", dot: "bg-ring", chip: "border-ring/20 bg-ring/8 text-ring",              label: "Request",  labelAr: "طلب" },
};

// ─── Time-ago helper (lightweight, no date-fns needed) ───────────────────────

function timeAgo(iso: string, isAr: boolean): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)   return isAr ? "الآن"          : "just now";
  if (diff < 3600) return isAr ? `منذ ${Math.floor(diff/60)} دقيقة`    : `${Math.floor(diff/60)}m ago`;
  if (diff < 86400)return isAr ? `منذ ${Math.floor(diff/3600)} ساعة`   : `${Math.floor(diff/3600)}h ago`;
  return               isAr ? `منذ ${Math.floor(diff/86400)} يوم`   : `${Math.floor(diff/86400)}d ago`;
}

// ─── Bilingual string map ─────────────────────────────────────────────────────

const L = {
  en: {
    notifications: "Notifications",
    markAllRead:   "Mark all read",
    allCaughtUp:   "All caught up!",
    noNew:         "No new notifications.",
    viewAll:       "View all notifications",
    markAsRead:    "Mark as read",
    delete:        "Delete",
  },
  ar: {
    notifications: "الإشعارات",
    markAllRead:   "تعليم الكل كمقروء",
    allCaughtUp:   "أنت على اطلاع كامل!",
    noNew:         "لا توجد إشعارات جديدة.",
    viewAll:       "عرض كل الإشعارات",
    markAsRead:    "تعليم كمقروء",
    delete:        "حذف",
  },
} as const;

// ─── Notification row ─────────────────────────────────────────────────────────

interface NotifRowProps {
  n: StaticNotification;
  isAr: boolean;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function NotifRow({ n, isAr, onRead, onDelete }: NotifRowProps) {
  const cfg  = NOTIF_CONFIG[n.type];
  const Icon = cfg.icon;
  const l    = isAr ? L.ar : L.en;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      dir={isAr ? "rtl" : "ltr"}
      className={cn(
        "group relative rounded-xl border transition-all duration-150",
        n.isRead
          ? "bg-muted/10 border-border/10 hover:bg-muted/20"
          : "bg-primary/5 border-primary/15 hover:border-primary/25",
      )}
    >
      {/* Unread accent bar */}
      {!n.isRead && (
        <div
          className={cn(
            "absolute top-3 bottom-3 w-0.5 rounded-full bg-primary/60",
            isAr ? "right-0" : "left-0",
          )}
        />
      )}

      <div className="flex items-start gap-2.5 px-3.5 py-2.5">
        {/* Icon badge */}
        <div className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-xl mt-0.5",
          cfg.iconBg,
        )}>
          <Icon className={cn("size-3.5", cfg.iconColor)} strokeWidth={2} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-1">
            <div className="flex items-center gap-1.5 min-w-0">
              {!n.isRead && (
                <span className={cn("size-1.5 rounded-full shrink-0", cfg.dot)} />
              )}
              <p className={cn(
                "text-[12px] leading-tight truncate",
                n.isRead ? "font-normal text-foreground/65" : "font-semibold text-foreground",
              )}>
                {n.title}
              </p>
            </div>

            {/* Action buttons — appear on hover */}
            <div
              className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100
                         transition-opacity shrink-0 -mt-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              {!n.isRead && (
                <button
                  title={l.markAsRead}
                  onClick={() => onRead(n.id)}
                  className="flex size-5 items-center justify-center rounded-md
                             text-muted-foreground hover:text-foreground
                             hover:bg-muted/40 transition-colors"
                >
                  <Check className="size-3" />
                </button>
              )}
              <button
                title={l.delete}
                onClick={() => onDelete(n.id)}
                className="flex size-5 items-center justify-center rounded-md
                           text-muted-foreground hover:text-destructive
                           hover:bg-destructive/10 transition-colors"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>

          {/* Message */}
          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
            {n.message}
          </p>

          {/* Type chip + time */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className={cn(
              "inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border",
              cfg.chip,
            )}>
              <Icon className="size-2" strokeWidth={2.5} />
              {isAr ? cfg.labelAr : cfg.label}
            </span>
            <span className="text-muted-foreground/40 text-[9px]">·</span>
            <span className="text-[10px] text-muted-foreground/60">
              {timeAgo(n.createdAt, isAr)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Notification bell popover ────────────────────────────────────────────────

function NotificationBell({ isAr }: { isAr: boolean }) {
  const [open, setOpen]   = useState(false);
  const [items, setItems] = useState<StaticNotification[]>(STATIC_NOTIFICATIONS);
  const l                 = isAr ? L.ar : L.en;

  const unread = items.filter((n) => !n.isRead).length;

  const handleRead = (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAll = () => {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label={isAr ? `الإشعارات (${unread} غير مقروء)` : `Notifications (${unread} unread)`}
          className="relative flex size-9 items-center justify-center rounded-xl
                     text-muted-foreground hover:text-foreground
                     hover:bg-accent/40 transition-colors"
        >
          <Bell className="size-4.25" />

          {/* Unread badge */}
          <AnimatePresence>
            {unread > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4
                           items-center justify-center rounded-full
                           bg-color px-1 text-[9px] font-bold text-white
                           leading-none shadow-brand"
              >
                {unread > 99 ? "99+" : unread}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align={isAr ? "start" : "end"}
        sideOffset={10}
        className="w-85 p-0 rounded-2xl border border-border/20
                   bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden"
      >
        {/* Popover header */}
        <div
          dir={isAr ? "rtl" : "ltr"}
          className="relative overflow-hidden border-b border-border/10"
        >
          {/* Subtle brand glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none
                       bg-[radial-gradient(ellipse_80%_100%_at_10%_50%,rgb(10_184_251/6%),transparent)]"
          />
          <div className="relative flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center
                              rounded-lg bg-primary/10">
                <Bell className="size-3.5 text-primary" />
              </div>
              <span className="font-semibold text-[13px] text-foreground">
                {l.notifications}
              </span>
              {unread > 0 && (
                <span className="inline-flex items-center justify-center
                                 h-4.5 min-w-4.5 px-1.5 rounded-full
                                 bg-primary/10 text-primary text-[10px] font-bold">
                  {unread}
                </span>
              )}
            </div>

            <button
              onClick={handleMarkAll}
              disabled={unread === 0}
              className="flex items-center gap-1 h-6 px-2 text-[11px] font-medium
                         rounded-lg text-muted-foreground hover:text-foreground
                         hover:bg-muted/30 transition-colors
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <CheckCheck className="size-3" />
              {l.markAllRead}
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div className="max-h-85 overflow-y-auto p-2 space-y-1
                        [&::-webkit-scrollbar]:w-1
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-border/30">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-2.5 py-10 text-center"
            >
              <div className="flex size-12 items-center justify-center
                              rounded-2xl bg-muted/30 ring-1 ring-border/10">
                <BellOff className="size-5 text-muted-foreground/40" />
              </div>
              <p className="text-[12px] font-medium text-foreground/60">
                {l.allCaughtUp}
              </p>
              <p className="text-[11px] text-muted-foreground">{l.noNew}</p>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {items.map((n) => (
                <NotifRow
                  key={n.id}
                  n={n}
                  isAr={isAr}
                  onRead={handleRead}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border/10 p-2">
          <Link
            href="/dashboard/notifications"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1.5 w-full
                       rounded-xl py-2 text-[12px] font-medium
                       text-muted-foreground hover:text-foreground
                       hover:bg-muted/20 transition-colors"
            dir={isAr ? "rtl" : "ltr"}
          >
            {isAr
              ? <><ArrowRight className="size-3 rotate-180" />{l.viewAll}<Sparkles className="size-3" /></>
              : <><Sparkles className="size-3" />{l.viewAll}<ArrowRight className="size-3" /></>
            }
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ─── DashboardHeader ─────────────────────────────────────────────────────────

interface DashboardHeaderProps {
  /** Optional page title shown in the header */
  title?: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const t              = useTranslations("DashboardHeader");
  const { toggleMobile } = useSidebar();
  const { user }       = useAuth();
  const pathname       = usePathname();

  // Detect RTL from URL locale prefix
  const isAr = pathname.startsWith("/ar");

  const initial = user?.full_name?.charAt(0).toUpperCase() ?? "U";

  return (
    <header
      className="sticky top-0 z-30 h-14 bg-sidebar/90 backdrop-blur-md
                 border-b border-border/10 shrink-0"
    >
      <div
        dir={isAr ? "rtl" : "ltr"}
        className="flex items-center justify-between h-full px-4 lg:px-6 max-w-full"
      >
        {/* ── Left: hamburger + page title ── */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobile}
            className="lg:hidden size-8 text-muted-foreground
                       hover:text-foreground hover:bg-accent/40"
            aria-label="Open navigation"
          >
            <Menu className="size-4.5" />
          </Button>

          {/* Page title */}
          {title && (
            <h1 className="text-[15px] font-semibold text-foreground hidden sm:block">
              {title}
            </h1>
          )}
        </div>

        {/* ── Right: actions ── */}
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />

          {/* Divider */}
          <div className="h-5 w-px bg-border/20 mx-1" aria-hidden="true" />

          <NotificationBell isAr={isAr} />

          {/* Divider */}
          <div className="h-5 w-px bg-border/20 mx-1" aria-hidden="true" />

          {/* Avatar chip → profile */}
          <a
            href="/profile"
            aria-label={`Profile — ${user?.full_name ?? "User"}`}
            className="flex size-8 items-center justify-center rounded-xl
                       bg-color text-white text-[13px] font-bold shadow-brand
                       hover:opacity-90 transition-opacity"
          >
            {initial}
          </a>
        </div>
      </div>
    </header>
  );
}