"use client";

import { memo, type ElementType } from "react";
import Link from "next/link";
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
  liveLabel: string;
  tickerItems: TickerItem[];
  floatingLabels: string[];
};

const SUPPORTED_LOCALES: Locale[] = ["en", "zh", "ar", "fa", "ps"];
const RTL_LOCALES = new Set<Locale>(["ar", "fa", "ps"]);

const TICKER_ICON_MAP: Record<string, ElementType> = {
  bot: Bot,
  zap: Zap,
  sparkles: Sparkles,
};

// Badge variant style mapping
const BADGE_VARIANTS: Record<
  TickerItem["badgeVariant"],
  { border: string; bg: string; text: string }
> = {
  cyan: {
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/10",
    text: "text-cyan-600 dark:text-cyan-400",
  },
  blue: {
    border: "border-blue-500/20",
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
  },
  teal: {
    border: "border-teal-500/20",
    bg: "bg-teal-500/10",
    text: "text-teal-600 dark:text-teal-400",
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
      liveLabel: t("liveLabel"),
      tickerItems: getArrayValue<TickerItem>(t.raw("tickerItems"), []),
      floatingLabels: getArrayValue<string>(t.raw("floatingLabels"), []),
    },
  };
}

function ActivityTicker({
  items,
  liveLabel,
  isRtl,
}: {
  items: TickerItem[];
  liveLabel: string;
  isRtl: boolean;
}) {
  const doubled = [...items, ...items];
  // In RTL we animate from 0% to +50% (move right), in LTR from 0% to -50% (move left)
  const direction = isRtl ? "50%" : "-50%";

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
              {liveLabel}
            </span>
          </div>

          <div className="min-w-0 overflow-hidden py-3">
            <div
              className="flex gap-1 whitespace-nowrap animate-ticker-scroll"
              style={{
                animationDuration: "28s",
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
                animationDirection: "normal",
                transform: isRtl ? "translateX(0%)" : "translateX(0%)",
              }}
            >
              {doubled.map((item, i) => {
                const Icon = TICKER_ICON_MAP[item.icon] ?? Sparkles;
                const variantStyles =
                  BADGE_VARIANTS[item.badgeVariant] || BADGE_VARIANTS.cyan;

                return (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2.5 rounded-xl border border-transparent px-4 py-1 text-xs text-muted-foreground transition-colors duration-200 hover:border-border/60 hover:bg-accent/40 hover:text-foreground"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                      <Icon className="size-3" />
                    </span>
                    <span>{item.text}</span>
                    <span
                      className={`rounded-full border px-1.5 py-px text-[9px] font-bold leading-none ${variantStyles.border} ${variantStyles.bg} ${variantStyles.text}`}
                    >
                      {item.badge}
                    </span>
                    <span className="size-1 shrink-0 rounded-full bg-border" />
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-ticker-scroll {
          animation: ticker-scroll linear infinite;
          animation-duration: 28s;
        }
        @keyframes ticker-scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(${isRtl ? "50%" : "-50%"});
          }
        }
      `}</style>
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
          <div
            className={[
              "flex w-full min-w-0 flex-col gap-8 text-center lg:basis-0 lg:flex-1",
              isRtl ? "lg:text-right" : "lg:text-left",
            ].join(" ")}
          >
            <h1
              id="home-hero-title"
              className="text-balance text-4xl font-bold leading-tight tracking-tighter text-foreground sm:text-5xl sm:leading-[1.22] md:text-6xl md:leading-[1.18] xl:text-6xl xl:leading-[1.14]"
            >
              {content.headlineLead}{" "}
              <span className="text-color">{content.headlineAccent}</span>
              {content.headlineSuffix && <> {content.headlineSuffix}</>}
            </h1>

            <p className="mx-auto max-w-lg text-pretty text-base leading-8 text-muted-foreground sm:text-lg lg:mx-0">
              {content.description}
            </p>

            {/* CTA buttons */}
            <div
              className={[
                "flex w-full flex-col items-center justify-center gap-3 sm:flex-row",
                isRtl ? "lg:justify-end" : "lg:justify-start",
              ].join(" ")}
            >
              <Link
                href={buildLocalePath(locale, "/crm/quote")}
                className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-color px-6 py-3 text-sm font-semibold text-white shadow-brand transition duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:w-auto sm:px-8"
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
            </div>

            <div className="w-full max-w-xl lg:hidden lg:max-w-none">
              <ActivityTicker
                items={content.tickerItems}
                liveLabel={content.liveLabel}
                isRtl={isRtl}
              />
            </div>
          </div>

          <div className="relative flex h-90 w-full min-w-0 shrink-0 items-center justify-center sm:h-107.5 lg:h-auto lg:basis-125 xl:basis-140">
            <div
              className="absolute rounded-full bg-primary/6 blur-3xl dark:bg-primary/10"
              style={{ width: 530, height: 530 }}
            />

            <div className="scale-[0.58] sm:scale-[0.72] lg:scale-[0.88] xl:scale-[0.92]">
              <OrbitalSystem floatingLabels={content.floatingLabels} />
            </div>
          </div>
        </div>

        <div className="hidden w-full max-w-xl lg:block lg:max-w-none">
          <ActivityTicker
            items={content.tickerItems}
            liveLabel={content.liveLabel}
            isRtl={isRtl}
          />
        </div>
      </div>
    </section>
  );
}
