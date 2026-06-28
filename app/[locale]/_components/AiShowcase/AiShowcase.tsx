"use client";
// app/[locale]/_components/AiShowcase/AiShowcase.tsx

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, useInView, animate } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import {
  Bot,
  Workflow,
  Globe,
  Smartphone,
  Plug,
  TrendingUp,
  Zap,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Locale = "en" | "zh" | "ar" | "fa" | "ps";

const SUPPORTED_LOCALES: Locale[] = ["en", "zh", "ar", "fa", "ps"];
const RTL_LOCALES = new Set<Locale>(["ar", "fa", "ps"]);

function getSupportedLocale(locale: string): Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale)
    ? (locale as Locale)
    : "en";
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated counter
// ─────────────────────────────────────────────────────────────────────────────

function useCountUp(to: number, duration = 1.6, suffix = "") {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate(v) {
        setDisplay(Math.round(v).toLocaleString() + suffix);
      },
    });
    return () => controls.stop();
  }, [inView, to, duration, suffix]);

  return { ref, display };
}

// ─────────────────────────────────────────────────────────────────────────────
// Stat card (unused, kept for potential future use)
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({
  to,
  suffix,
  label,
  icon: Icon,
  delay,
}: {
  to: number;
  suffix?: string;
  label: string;
  icon: React.ElementType;
  delay: number;
}) {
  const { ref, display } = useCountUp(to, 1.6, suffix ?? "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-card px-5 py-5 shadow-sm transition-colors hover:border-primary/40"
    >
      <div className="flex size-9 items-center justify-center rounded-xl bg-accent text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <div
        ref={ref}
        className="text-2xl font-bold tabular-nums text-foreground"
      >
        {display}
      </div>
      <p className="text-center text-[11px] leading-tight text-muted-foreground">
        {label}
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Service orbit — SVG-based circle with service icons orbiting the center
// ─────────────────────────────────────────────────────────────────────────────

// Static data – memoized by definition outside component
const ORBIT_SERVICES = [
  { Icon: Bot, label: "AI Agents", color: "#0ab8fb" },
  { Icon: Workflow, label: "Automation", color: "#324b9d" },
  { Icon: Globe, label: "Web Dev", color: "#13a89e" },
  { Icon: Smartphone, label: "Mobile Apps", color: "#f59e0b" },
  { Icon: Plug, label: "API Integration", color: "#7c3aed" },
  { Icon: BarChart3, label: "Analytics", color: "#0ab8fb" },
];

function ServiceOrbit() {
  // Fixed size for design – scaling wrapper handles responsiveness
  const SIZE = 320;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const ORBIT_R = 112;

  return (
    <div
      className="relative will-change-transform"
      style={{ width: SIZE, height: SIZE }}
    >
      {/* SVG rings */}
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="absolute inset-0"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="orbitCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0ab8fb" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0ab8fb" stopOpacity="0" />
          </radialGradient>
          <filter id="orbitGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Center ambient glow */}
        <circle cx={CX} cy={CY} r={72} fill="url(#orbitCenterGlow)" />

        {/* Orbit ring */}
        <motion.circle
          cx={CX}
          cy={CY}
          r={ORBIT_R}
          fill="none"
          stroke="rgb(10 184 251 / 0.15)"
          strokeWidth="1"
          strokeDasharray="5 8"
          animate={{ rotate: 360 } as never}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform" }}
        />

        {/* Inner ring */}
        <circle
          cx={CX}
          cy={CY}
          r={62}
          fill="none"
          stroke="rgb(50 75 157 / 0.18)"
          strokeWidth="1"
          strokeDasharray="3 10"
        />

        {/* Pulse rings */}
        {[0, 0.9, 1.8].map((delay, i) => (
          <motion.circle
            key={`pulse-${i}`}
            cx={CX}
            cy={CY}
            r={46}
            fill="none"
            stroke="#0ab8fb"
            strokeWidth="1.5"
            initial={{ r: 46, opacity: 0.5 } as never}
            animate={{ r: 108, opacity: 0 } as never}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut",
              delay,
            }}
            style={{ willChange: "r, opacity" }}
          />
        ))}

        {/* Connection lines from center to nodes */}
        {ORBIT_SERVICES.map(({ color }, i) => {
          const angle = (i / ORBIT_SERVICES.length) * 2 * Math.PI - Math.PI / 2;
          const nx = CX + Math.cos(angle) * ORBIT_R;
          const ny = CY + Math.sin(angle) * ORBIT_R;
          return (
            <motion.line
              key={`line-${i}`}
              x1={CX}
              y1={CY}
              x2={nx}
              y2={ny}
              stroke={color}
              strokeWidth="1"
              strokeOpacity="0.3"
              strokeDasharray="3 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
              style={{ willChange: "pathLength, opacity" }}
            />
          );
        })}
      </svg>

      {/* Center logo node */}
      <div
        className="absolute flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-color shadow-brand"
        style={{ left: CX, top: CY }}
      >
        <Zap className="size-7 text-white" aria-hidden="true" />
      </div>

      {/* Service icon nodes */}
      {ORBIT_SERVICES.map(({ Icon, label, color }, i) => {
        const angle = (i / ORBIT_SERVICES.length) * 2 * Math.PI - Math.PI / 2;
        const nx = CX + Math.cos(angle) * ORBIT_R;
        const ny = CY + Math.sin(angle) * ORBIT_R;

        return (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.5 + i * 0.1,
              duration: 0.4,
              type: "spring",
              bounce: 0.4,
            }}
            className="absolute flex flex-col items-center gap-1 group"
            style={{ left: nx, top: ny, transform: "translate(-50%, -50%)" }}
          >
            <div
              className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-border/60 bg-card shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
              style={{ color }}
            >
              <Icon className="size-4" aria-hidden="true" />
            </div>
            <span className="whitespace-nowrap rounded-full border border-border/40 bg-background/80 px-2 py-0.5 text-[9px] font-semibold text-muted-foreground backdrop-blur-sm">
              {label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Live activity feed card — shows AI automation in action
// ─────────────────────────────────────────────────────────────────────────────

type FeedItem = {
  icon: React.ElementType;
  color: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
};

const FEED_ITEMS_EN: FeedItem[] = [
  {
    icon: Bot,
    color: "#0ab8fb",
    title: "AI Agent Deployed",
    subtitle: "Customer support bot — 98% resolution rate",
    badge: "Live",
    badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Workflow,
    color: "#324b9d",
    title: "Workflow Automated",
    subtitle: "CRM data sync — saved 18 hrs/week",
    badge: "Complete",
    badgeColor: "bg-primary/10 text-primary",
  },
  {
    icon: MessageSquare,
    color: "#13a89e",
    title: "WhatsApp Bot Active",
    subtitle: "Lead gen chatbot — 54 new leads today",
    badge: "Running",
    badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Globe,
    color: "#7c3aed",
    title: "SaaS Platform Launched",
    subtitle: "E-commerce dashboard — 0 downtime deploy",
    badge: "Deployed",
    badgeColor: "bg-primary/10 text-primary",
  },
];

function ActivityFeedCard({ isRtl }: { isRtl: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Memoize the interval setup/cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEED_ITEMS_EN.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Memoize feed items to avoid re‑rendering all items on every tick
  // (the active style changes only on the active item, but the whole list re-renders anyway)
  // This is acceptable given small list size.
  return (
    <div
      className="w-full rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-40" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <p className="text-xs font-semibold text-foreground">Live Activity</p>
        </div>
        <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-medium text-primary">
          AI Systems
        </span>
      </div>

      {/* Feed items */}
      <div className="divide-y divide-border/40">
        {FEED_ITEMS_EN.map((item, i) => {
          const Icon = item.icon;
          const isActive = i === activeIndex;

          return (
            <div
              key={item.title}
              className={[
                "flex items-center gap-3 px-4 py-3 transition-colors duration-300 will-change-transform",
                isActive ? "bg-accent/40" : "bg-transparent",
              ].join(" ")}
            >
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${item.color}18`,
                  color: item.color,
                }}
              >
                <Icon className="size-4" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {item.subtitle}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${item.badgeColor}`}
              >
                {item.badge}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Trust badge row
// ─────────────────────────────────────────────────────────────────────────────

function TrustBadge({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3.5 py-2 text-xs font-medium text-muted-foreground backdrop-blur shadow-sm">
      <Icon className="size-3.5 text-primary shrink-0" aria-hidden="true" />
      {label}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export function AiShowcase() {
  const rawLocale = useLocale();
  const locale = getSupportedLocale(rawLocale);
  const isRtl = RTL_LOCALES.has(locale);
  const t = useTranslations("AiShowcase");

  // Memoize the static value props array to avoid recreation on each render
  const valueProps = useMemo(
    () => [
      {
        icon: Bot,
        title: t("prop1Title"),
        body: t("prop1Body"),
      },
      {
        icon: Workflow,
        title: t("prop2Title"),
        body: t("prop2Body"),
      },
      {
        icon: ShieldCheck,
        title: t("prop3Title"),
        body: t("prop3Body"),
      },
    ],
    [t],
  );

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      aria-labelledby="ai-showcase-title"
      className="relative isolate w-full overflow-hidden bg-background px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_40%_at_50%_100%,rgb(50_75_157/10%),transparent)]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ── Main two-column layout ── */}
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left: Service orbit – responsive scaling wrapper */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center gap-8"
          >
            {/* Scale the fixed‑size orbit on smaller screens (preserves proportions) */}
            <div className="flex justify-center">
              <div className="scale-[0.65] sm:scale-[0.8] md:scale-100 will-change-transform origin-center">
                <ServiceOrbit />
              </div>
            </div>
            <ActivityFeedCard isRtl={isRtl} />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-8"
          >
            {/* Value props */}
            <div className="space-y-4">
              {valueProps.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur transition-colors hover:border-primary/30"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href={`/${locale}/services`}
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-color px-7 py-3 text-sm font-semibold shadow-brand transition duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t("cta")}
              <ArrowRight
                className={`size-4 transition-transform ${isRtl ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
                aria-hidden="true"
              />
            </Link>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              <TrustBadge icon={CheckCircle} label={t("trust1")} />
              <TrustBadge icon={Clock} label={t("trust2")} />
              <TrustBadge icon={Users} label={t("trust3")} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
