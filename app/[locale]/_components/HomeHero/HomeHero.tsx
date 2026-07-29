"use client";

import { memo } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import OrbitalSystem from "./OrbitalSystem";

type Locale = "en" | "zh" | "ar" | "fa" | "ps";

type HomeHeroContent = {
  headlineLead: string;
  headlineAccent: string;
  headlineSuffix: string;
  description: string;
  primaryAction: string;
  secondaryAction: string;
  floatingLabels: string[];
};

const SUPPORTED_LOCALES: Locale[] = ["en", "zh", "ar", "fa", "ps"];
const RTL_LOCALES = new Set<Locale>(["ar", "fa", "ps"]);

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
      headlineLead: t("headlineLead"),
      headlineAccent: t("headlineAccent"),
      headlineSuffix: t("headlineSuffix"),
      description: t("description"),
      primaryAction: t("primaryAction"),
      secondaryAction: t("secondaryAction"),
      floatingLabels: t.raw("floatingLabels") as string[],
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
      className="relative isolate w-full overflow-hidden bg-background px-5 pb-20 pt-32 text-foreground sm:px-5 lg:px-5 lg:pb-28 lg:pt-28"
    >
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgb(10_184_251/12%),transparent)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgb(10_184_251/8%),transparent)]" />

      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-20 md:mt-16">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-6 xl:gap-12">
          <div
            className={[
              "flex w-full min-w-0 flex-col gap-8 text-center lg:basis-0 lg:flex-1",
              isRtl ? "lg:text-right" : "lg:text-left",
            ].join(" ")}
          >
            <h1
              id="home-hero-title"
              className="text-balance text-4xl font-bold leading-tight tracking-tighter text-foreground sm:text-5xl sm:leading-[1.22] md:text-6xl md:leading-[1.18] xl:text-6xl xl:leading-[1.14] max-w-xl"
            >
              {content.headlineLead}{" "}
              <span className="text-color">{content.headlineAccent}</span>
              {content.headlineSuffix && <> {content.headlineSuffix}</>}
            </h1>

            <p className="mx-auto max-w-lg text-pretty text-base leading-8 text-muted-foreground sm:text-lg lg:mx-0">
              {content.description}
            </p>

            {/* CTA buttons – fixed alignment & text wrapping */}
            <div
              className={`flex w-full flex-wrap items-center justify-center gap-2 sm:gap-3 lg:justify-start`}
            >
              <Link
                href={buildLocalePath(locale, "/crm/quote")}
                className="group inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-color px-3 py-1.5 text-xs font-semibold text-white shadow-brand transition duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:flex-none sm:px-6 sm:py-2 sm:text-sm"
              >
                {content.primaryAction}
                <ArrowRight
                  className={`size-3 transition-transform sm:size-4 ${
                    isRtl
                      ? "rotate-180 group-hover:-translate-x-1"
                      : "group-hover:translate-x-1"
                  }`}
                />
              </Link>

              <Link
                href={buildLocalePath(locale, "/services")}
                className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-full border border-border bg-background/75 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary sm:flex-none sm:px-6 sm:py-2 sm:text-sm"
              >
                {content.secondaryAction}
              </Link>
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
      </div>
    </section>
  );
}
