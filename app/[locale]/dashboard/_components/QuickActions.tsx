"use client";

// app/[locale]/dashboard/_components/QuickActions.tsx

import { motion } from "framer-motion";
import { FilePlus2, CalendarPlus, LifeBuoy, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

// ─── Animation ──────────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

// ─── Actions config ─────────────────────────────────────────────────────────

interface ActionConfig {
  icon: React.ElementType;
  href: string;
  iconBgClass: string;
  iconColorClass: string;
  labelKey: string;
  descKey: string;
}

const ACTIONS: ActionConfig[] = [
  {
    icon: FilePlus2,
    href: "/crm/quote",
    iconBgClass: "bg-blue-500/10",
    iconColorClass: "text-blue-500",
    labelKey: "actionNewRequest",
    descKey: "actionNewRequestDesc",
  },
  {
    icon: CalendarPlus,
    href: "/crm/book-a-call",
    iconBgClass: "bg-emerald-500/10",
    iconColorClass: "text-emerald-500",
    labelKey: "actionBookCall",
    descKey: "actionBookCallDesc",
  },
  {
    icon: LifeBuoy,
    href: "/dashboard/support",
    iconBgClass: "bg-amber-500/10",
    iconColorClass: "text-amber-500",
    labelKey: "actionSupport",
    descKey: "actionSupportDesc",
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

interface QuickActionsProps {
  labels: {
    actionNewRequest: string;
    actionNewRequestDesc: string;
    actionBookCall: string;
    actionBookCallDesc: string;
    actionSupport: string;
    actionSupportDesc: string;
  };
}

export function QuickActions({ labels }: QuickActionsProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      {ACTIONS.map((action) => {
        const Icon = action.icon;

        return (
          <motion.div key={action.href} variants={item}>
            <Link
              href={action.href as any}
              className="group flex flex-col rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-5 transition-all duration-200 hover:border-border hover:shadow-sm"
            >
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl mb-3 transition-transform duration-200 group-hover:scale-105",
                  action.iconBgClass
                )}
              >
                <Icon className={cn("size-5", action.iconColorClass)} />
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-semibold text-foreground">
                  {labels[action.labelKey as keyof typeof labels]}
                </h3>
                <ArrowRight
                  className="size-4 text-muted-foreground/30 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                {labels[action.descKey as keyof typeof labels]}
              </p>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
