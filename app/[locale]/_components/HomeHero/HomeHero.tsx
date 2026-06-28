"use client";

import type { ElementType } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Bot, Sparkles, Zap } from "lucide-react";

import OrbitalSystem from "./OrbitalSystem";

type Locale = "en" | "zh" | "ar" | "fa" | "ps";

type TickerItem = {
  icon: string;
  text: string;
  badge: string;
  badgeVariant: "cyan" | "blue" | "teal";
};

type HomeHeroContent = {
  headlineLead: string;
  headlineAccent: string;
  headlineSuffix: string;
  description: string;
  primaryAction: string;
  secondaryAction: string;
  tickerItems: TickerItem[];
};

const SUPPORTED_LOCALES: Locale[] = ["en", "zh", "ar", "fa", "ps"];
const RTL_LOCALES = new Set<Locale>(["ar", "fa", "ps"]);
const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TICKER_ICON_MAP: Record<string, ElementType> = {
  bot: Bot,
  zap: Zap,
  sparkles: Sparkles,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: smoothEase },
  },
};

const fadeInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: smoothEase, delay: 0.25 },
  },
};

function getSupportedLocale(locale: string): Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale)
    ? (locale as Locale)
    : "en";
}

function buildLocalePath(locale: Locale, path: string) {
  return `/${locale}${path}`;
}

function getArrayValue<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function useHomeHeroContent(): { locale: Locale; content: HomeHeroContent } {
  const locale = getSupportedLocale(useLocale());
  const t = useTranslations("HomeHero");

  return {
    locale,
    content: {
      headlineLead: t("headlineLead"),
      headlineAccent: t("headlineAccent"),
      headlineSuffix: t("headlineSuffix"),
      description: t("description"),
      primaryAction: t("primaryAction"),
      secondaryAction: t("secondaryAction"),
      tickerItems: getArrayValue<TickerItem>(t.raw("tickerItems"), []),
    },
  };
}

function ActivityTicker({ items }: { items: TickerItem[] }) {
  const doubled = [...items, ...items];

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/60 shadow-sm backdrop-blur-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-background/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-background/80 to-transparent" />

        <div className="flex items-center">
          <div className="relative z-20 flex shrink-0 items-center gap-2 border-r border-border/50 bg-background/80 px-4 py-3 backdrop-blur-sm">
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Live
            </span>
          </div>

          <div className="min-w-0 overflow-hidden py-3">
            <motion.div
              className="flex gap-1 whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 28, ease: "linear", repeat: Infinity }}
            >
              {doubled.map((item, i) => {
                const Icon = TICKER_ICON_MAP[item.icon] ?? Sparkles;

                return (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2.5 rounded-xl border border-transparent px-4 py-1 text-xs text-muted-foreground transition-colors duration-200 hover:border-border/60 hover:bg-accent/40 hover:text-foreground"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                      <Icon className="size-3" />
                    </span>
                    <span>{item.text}</span>
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-1.5 py-px text-[9px] font-bold leading-none text-primary">
                      {item.badge}
                    </span>
                    <span className="size-1 shrink-0 rounded-full bg-border" />
                  </span>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeHero() {
  const { locale, content } = useHomeHeroContent();
  const isRtl = RTL_LOCALES.has(locale);
  const direction = isRtl ? "rtl" : "ltr";

  return (
    <section
      dir={direction}
      aria-labelledby="home-hero-title"
      className="relative isolate w-full overflow-hidden bg-background px-5 pb-20 pt-32 text-foreground sm:px-5 lg:px-5 lg:pb-28 lg:pt-28"
    >
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgb(10_184_251/12%),transparent)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgb(10_184_251/8%),transparent)]" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-6 xl:gap-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={[
              "flex w-full min-w-0 flex-col gap-8 text-center lg:basis-0 lg:flex-1",
              isRtl ? "lg:text-right" : "lg:text-left",
            ].join(" ")}
          >
            <motion.h1
              id="home-hero-title"
              variants={fadeUpVariants}
              className="text-balance text-4xl font-bold leading-tight tracking-tighter text-foreground sm:text-5xl sm:leading-[1.22] md:text-6xl md:leading-[1.18] xl:text-6xl xl:leading-[1.14]"
            >
              {content.headlineLead}{" "}
              <span className="text-color">{content.headlineAccent}</span>
              {content.headlineSuffix && <> {content.headlineSuffix}</>}
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              className="mx-auto max-w-lg text-pretty text-base leading-8 text-muted-foreground sm:text-lg lg:mx-0"
            >
              {content.description}
            </motion.p>

            {/* CTA buttons – responsive alignment */}
            <motion.div
              variants={fadeUpVariants}
              className={[
                "flex w-full flex-col items-center justify-center gap-3 sm:flex-row",
                isRtl ? "lg:justify-end" : "lg:justify-start",
              ].join(" ")}
            >
              <Link
                href={buildLocalePath(locale, "/contact")}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-color px-6 py-3 text-sm font-semibold shadow-brand transition duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:w-auto sm:px-8"
              >
                {content.primaryAction}
                <ArrowRight
                  className={`size-4 transition-transform ${
                    isRtl
                      ? "rotate-180 group-hover:-translate-x-1"
                      : "group-hover:translate-x-1"
                  }`}
                />
              </Link>

              <Link
                href={buildLocalePath(locale, "/services")}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-border bg-background/75 px-6 py-3 text-sm font-semibold text-foreground shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary sm:w-auto sm:px-8"
              >
                {content.secondaryAction}
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUpVariants}
              className="w-full max-w-xl lg:hidden lg:max-w-none"
            >
              <ActivityTicker items={content.tickerItems} />
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeInVariants}
            initial="hidden"
            animate="show"
            className="relative flex h-90 w-full min-w-0 shrink-0 items-center justify-center sm:h-107.5 lg:h-auto lg:basis-125 xl:basis-140"
          >
            <div
              className="absolute rounded-full bg-primary/6 blur-3xl dark:bg-primary/10"
              style={{ width: 530, height: 530 }}
            />

            <div className="scale-[0.58] sm:scale-[0.72] lg:scale-[0.88] xl:scale-[0.92]">
              <OrbitalSystem />
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUpVariants}
          className="hidden w-full max-w-xl lg:block lg:max-w-none"
        >
          <ActivityTicker items={content.tickerItems} />
        </motion.div>
      </div>
    </section>
  );
}
