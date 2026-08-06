"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import HeroVisual, { type HeroVisualContent } from "./HeroVisual";
import TrustedByLogos from "./TrustedByLogos";

type Locale =
  | "en"
  | "es"
  | "de"
  | "fr"
  | "zh"
  | "ar";

type HomeHeroContent = {
  eyebrow: string;
  headlineLead: string;
  headlineAccent: string;
  headlineSuffix: string;
  description: string;
  primaryAction: string;
  secondaryAction: string;
  visual: HeroVisualContent;
};

const SUPPORTED_LOCALES: Locale[] = [
  "en",
  "es",
  "de",
  "fr",
  "zh",
  "ar",
];
const RTL_LOCALES = new Set<Locale>(["ar"]);

function getSupportedLocale(locale: string): Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale)
    ? (locale as Locale)
    : "en";
}

function buildLocalePath(locale: Locale, path: string) {
  return `/${locale}${path}`;
}

function useHomeHeroContent(): { locale: Locale; content: HomeHeroContent } {
  const locale = getSupportedLocale(useLocale());
  const t = useTranslations("HomeHero");

  return {
    locale,
    content: {
      eyebrow: t("eyebrow"),
      headlineLead: t("headlineLead"),
      headlineAccent: t("headlineAccent"),
      headlineSuffix: t("headlineSuffix"),
      description: t("description"),
      primaryAction: t("primaryAction"),
      secondaryAction: t("secondaryAction"),
      visual: t.raw("visual") as HeroVisualContent,
    },
  };
}

export default function HomeHero() {
  const { locale, content } = useHomeHeroContent();
  const isRtl = RTL_LOCALES.has(locale);
  const direction = isRtl ? "rtl" : "ltr";

  return (
    <section
      dir={direction}
      aria-labelledby="home-hero-title"
      className="relative isolate w-full overflow-hidden bg-background px-5 pb-16 pt-28 md:pt-48 text-foreground sm:px-5 lg:px-5 md:pb-20"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgb(10_184_251/8%),transparent)] dark:bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgb(10_184_251/6%),transparent)]" />

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 text-center sm:px-6">

        <h1
          id="home-hero-title"
          className="text-balance text-[28px] font-bold leading-[1.28] tracking-tight text-foreground sm:text-4xl sm:leading-[1.24] md:text-5xl md:leading-[1.18]"
        >
          {content.headlineLead}{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--foreground) 0%, var(--foreground) 15%, var(--brand-start) 85%, var(--brand-start) 100%)",
            }}
          >
            {content.headlineAccent}
          </span>
          {content.headlineSuffix && <> {content.headlineSuffix}</>}
        </h1>

        <p className="text-pretty text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
          {content.description}
        </p>

        {/* CTA row: stays on one line at every width — no wrap, buttons share space equally on mobile */}
        <div className="flex w-full max-w-90 items-center justify-center gap-2 pb-8 pt-1 sm:max-w-none sm:w-auto sm:gap-2.5 sm:pb-10">
          <Link
            href={buildLocalePath(locale, "/services")}
            className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-full bg-secondary px-4 py-2.5 text-xs font-medium text-foreground transition duration-300 hover:-translate-y-0.5 sm:flex-none sm:px-5.5 sm:text-sm"
          >
            {content.secondaryAction}
          </Link>

          <Link
            href={buildLocalePath(locale, "/crm/quote")}
            className="group inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-color pl-4 pr-1.5 py-2 text-xs font-medium text-white shadow-brand transition duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:flex-none sm:gap-2.5 sm:pl-5.5 sm:pr-2 sm:text-sm"
          >
            {content.primaryAction}
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/25">
              <ArrowRight
                className={`size-2.5 transition-transform ${
                  isRtl
                    ? "rotate-180 group-hover:-translate-x-0.5"
                    : "group-hover:translate-x-0.5"
                }`}
              />
            </span>
          </Link>
        </div>

        <TrustedByLogos />
      </div>

      <HeroVisual content={content.visual} />
    </section>
  );
}