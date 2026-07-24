"use client";

// app/[locale]/dashboard/_components/RecentActivity.tsx

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  FileText,
  Calendar,
  BotMessageSquare,
  ArrowRight,
  Inbox,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
  fetchDashboardLeads,
  fetchDashboardBookings,
  fetchDashboardTickets,
} from "@/lib/automex/dashboard";
import type {
  DashboardLead,
  DashboardBooking,
  DashboardTicketList,
} from "@/lib/automex/types";

// ─── Animation ──────────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease } },
};

// ─── Unified activity item ──────────────────────────────────────────────────

interface ActivityItem {
  id: string;
  type: "request" | "booking" | "ticket";
  title: string;
  subtitle: string;
  href: string;
  date: string;
  icon: React.ElementType;
  iconBgClass: string;
  iconColorClass: string;
  badge?: string;
  badgeColor?: string;
}

// ─── Status colors ──────────────────────────────────────────────────────────

const LEAD_STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-500",
  contacted: "bg-cyan-500/10 text-cyan-500",
  qualified: "bg-indigo-500/10 text-indigo-500",
  proposal_sent: "bg-purple-500/10 text-purple-500",
  won: "bg-emerald-500/10 text-emerald-500",
  lost: "bg-red-500/10 text-red-500",
};

const BOOKING_STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500",
  confirmed: "bg-emerald-500/10 text-emerald-500",
  rescheduled: "bg-blue-500/10 text-blue-500",
  cancelled: "bg-red-500/10 text-red-500",
  completed: "bg-gray-500/10 text-gray-500",
};

const TICKET_STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-500/10 text-blue-500",
  in_progress: "bg-amber-500/10 text-amber-500",
  resolved: "bg-emerald-500/10 text-emerald-500",
  closed: "bg-gray-500/10 text-gray-500",
};

// ─── Component ──────────────────────────────────────────────────────────────

interface RecentActivityProps {
  labels: {
    sectionTitle: string;
    viewAll: string;
    emptyText: string;
    recentRequest: string;
    recentBooking: string;
    recentTicket: string;
  };
}

export function RecentActivity({ labels }: RecentActivityProps) {
  const locale = useLocale();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [leadsRes, bookingsRes, ticketsRes] = await Promise.allSettled([
          fetchDashboardLeads(1),
          fetchDashboardBookings(1),
          fetchDashboardTickets(1),
        ]);

        const items: ActivityItem[] = [];

        // Requests (up to 3)
        if (leadsRes.status === "fulfilled") {
          const leads = leadsRes.value.results.slice(0, 3);
          for (const lead of leads) {
            items.push({
              id: lead.id,
              type: "request",
              title: lead.full_name || lead.company || labels.recentRequest,
              subtitle: lead.message?.slice(0, 60) || lead.lead_type_display,
              href: `/dashboard/requests/${lead.id}`,
              date: lead.created_at,
              icon: FileText,
              iconBgClass: "bg-blue-500/10",
              iconColorClass: "text-blue-500",
              badge: lead.status_display,
              badgeColor:
                LEAD_STATUS_COLORS[lead.status] ||
                "bg-gray-500/10 text-gray-500",
            });
          }
        }

        // Bookings (up to 2)
        if (bookingsRes.status === "fulfilled") {
          const bookings = bookingsRes.value.results.slice(0, 2);
          for (const b of bookings) {
            items.push({
              id: b.id,
              type: "booking",
              title: b.meeting_type_display,
              subtitle: `${b.scheduled_date} · ${b.scheduled_time}`,
              href: `/dashboard/bookings/${b.id}`,
              date: b.created_at,
              icon: Calendar,
              iconBgClass: "bg-emerald-500/10",
              iconColorClass: "text-emerald-500",
              badge: b.status_display,
              badgeColor:
                BOOKING_STATUS_COLORS[b.status] ||
                "bg-gray-500/10 text-gray-500",
            });
          }
        }

        // Tickets (up to 2)
        if (ticketsRes.status === "fulfilled") {
          const tickets = ticketsRes.value.results.slice(0, 2);
          for (const t of tickets) {
            items.push({
              id: t.id,
              type: "ticket",
              title: t.title,
              subtitle: t.ticket_type_display,
              href: `/dashboard/support/${t.id}`,
              date: t.created_at,
              icon: BotMessageSquare,
              iconBgClass: "bg-amber-500/10",
              iconColorClass: "text-amber-500",
              badge: t.status_display,
              badgeColor:
                TICKET_STATUS_COLORS[t.status] ||
                "bg-gray-500/10 text-gray-500",
            });
          }
        }

        // Sort by date descending, take top 5
        items.sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setActivities(items.slice(0, 5));
      } catch {
        // Silently fail — recent activity is non-critical
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [labels.recentRequest, labels.recentBooking, labels.recentTicket]);

  // Skeleton
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/70 p-3"
          >
            <div className="size-8 rounded-lg bg-muted-foreground/10 animate-pulse" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-28 bg-muted-foreground/10 rounded animate-pulse" />
              <div className="h-3 w-40 bg-muted-foreground/10 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty
  if (!loading && activities.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <Inbox className="size-8 text-muted-foreground/25" />
        <p className="text-[13px] text-muted-foreground">
          {labels.emptyText}
        </p>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <div className="space-y-2">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <motion.div key={`${activity.type}-${activity.id}`} variants={item}>
              <Link
                href={activity.href as any}
                className="group flex items-center gap-3 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm px-3 py-2.5 transition-all duration-200 hover:border-border hover:shadow-sm"
              >
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg shrink-0",
                    activity.iconBgClass
                  )}
                >
                  <Icon className={cn("size-3.5", activity.iconColorClass)} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    {activity.badge && (
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium shrink-0",
                          activity.badgeColor
                        )}
                      >
                        {activity.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {activity.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-muted-foreground/50 hidden sm:block">
                    {new Date(activity.date).toLocaleDateString(locale, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <ArrowRight
                    className="size-3 text-muted-foreground/25 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* View all link */}
      <div className="mt-3 flex gap-3 justify-center">
        <Link
          href="/dashboard/requests"
          className="text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {labels.viewAll}
        </Link>
      </div>
    </motion.div>
  );
}
