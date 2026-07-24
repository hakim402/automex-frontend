"use client";

// app/[locale]/dashboard/_components/StatsCards.tsx

import { motion } from "framer-motion";
import {
  FileText,
  CalendarDays,
  TicketCheck,
  Calculator,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { DashboardSummary } from "@/lib/automex/types";

// ─── Animation variants ─────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

// ─── Stat card config ───────────────────────────────────────────────────────

interface StatConfig {
  key: keyof DashboardSummary;
  subKey: keyof DashboardSummary;
  icon: React.ElementType;
  href: string;
  colorClass: string;
  iconBgClass: string;
}

const STATS: StatConfig[] = [
  {
    key: "total_requests",
    subKey: "active_requests",
    icon: FileText,
    href: "/dashboard/requests",
    colorClass: "text-blue-500",
    iconBgClass: "bg-blue-500/10",
  },
  {
    key: "total_bookings",
    subKey: "upcoming_bookings",
    icon: CalendarDays,
    href: "/dashboard/bookings",
    colorClass: "text-emerald-500",
    iconBgClass: "bg-emerald-500/10",
  },
  {
    key: "total_tickets",
    subKey: "open_tickets",
    icon: TicketCheck,
    href: "/dashboard/support",
    colorClass: "text-amber-500",
    iconBgClass: "bg-amber-500/10",
  },
  {
    key: "total_calculations",
    subKey: "total_calculations",
    icon: Calculator,
    href: "/dashboard/calculations",
    colorClass: "text-purple-500",
    iconBgClass: "bg-purple-500/10",
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

interface StatsCardsProps {
  summary: DashboardSummary;
  labels: {
    requests: string;
    requestsSub: string;
    bookings: string;
    bookingsSub: string;
    tickets: string;
    ticketsSub: string;
    calculations: string;
    calculationsSub: string;
  };
}

export function StatsCards({ summary, labels }: StatsCardsProps) {
  const labelMap: Record<string, { main: string; sub: string }> = {
    total_requests: { main: labels.requests, sub: labels.requestsSub },
    total_bookings: { main: labels.bookings, sub: labels.bookingsSub },
    total_tickets: { main: labels.tickets, sub: labels.ticketsSub },
    total_calculations: {
      main: labels.calculations,
      sub: labels.calculationsSub,
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {STATS.map((stat) => {
        const Icon = stat.icon;
        const value = summary[stat.key];
        const subValue = summary[stat.subKey];
        const label = labelMap[stat.key];

        return (
          <motion.div key={stat.key} variants={item}>
            <Link
              href={stat.href as any}
              className="group flex items-start justify-between rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-5 transition-all duration-200 hover:border-border hover:shadow-sm"
            >
              <div className="space-y-1">
                <p className="text-[13px] font-medium text-muted-foreground">
                  {label.main}
                </p>
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  {value}
                </p>
                <p className="text-[12px] text-muted-foreground/70">
                  {subValue} {label.sub}
                </p>
              </div>

              <div
                className={cn(
                  "flex size-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105",
                  stat.iconBgClass
                )}
              >
                <Icon className={cn("size-5", stat.colorClass)} />
              </div>

              <ArrowUpRight
                className="size-4 text-muted-foreground/30 opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
