"use client";

import { useTranslations } from "next-intl";
import {
  FileText,
  PhoneCall,
  MessageSquare,
  ArrowRight,
  Zap,
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "./crm-shared/NewsletterForm";
import type { ProcessStep } from "@/lib/automex/types";
import { FooterSection } from "@/app/[locale]/_components/Footer/FooterSections";

interface CrmClientPageProps {
  processSteps: ProcessStep[];
}

const BRAND_PATHS = [
  {
    key: "quote" as const,
    icon: FileText,
    href: "/crm/quote" as const,
    gradient: "from-[#0ab8fb]/10 to-[#324b9d]/10",
    border: "border-[#0ab8fb]/30",
    iconBg: "bg-[#0ab8fb]/10 text-[#0ab8fb]",
  },
  {
    key: "booking" as const,
    icon: PhoneCall,
    href: "/crm/book-a-call" as const,
    gradient: "from-[#13a89e]/10 to-[#0ab8fb]/10",
    border: "border-[#13a89e]/30",
    iconBg: "bg-[#13a89e]/10 text-[#13a89e]",
  },
  {
    key: "contact" as const,
    icon: MessageSquare,
    href: "/crm/contact-sales" as const,
    gradient: "from-[#324b9d]/10 to-[#7c3aed]/10",
    border: "border-[#324b9d]/30",
    iconBg: "bg-[#324b9d]/10 text-[#324b9d]",
  },
] as const;

const STATS = [
  { value: "< 2 min", labelKey: "stats.response" },
  { value: "24h", labelKey: "stats.followUp" },
  { value: "150+", labelKey: "stats.projects" },
] as const;

export function CrmClientPage({ processSteps }: CrmClientPageProps) {
  const t = useTranslations("CrmPages.overview");

  return (
    <>
      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden mt-10 md:mt-20">
        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-40 -right-40 size-125 rounded-full bg-[#0ab8fb]/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 size-100 rounded-full bg-[#324b9d]/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl px-4 pt-20 pb-12 sm:pt-28 sm:pb-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            {t("hero.headlineLead")}{" "}
            <span className="text-brand-gradient">
              {t("hero.headlineAccent")}
            </span>
          </h1>

          <p className="text-[15px] sm:text-base text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            {t("hero.description")}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-brand-gradient shadow-brand"
            >
              <Link href="/crm/quote">
                {t("hero.ctaQuote")}
                <ArrowRight
                  className="size-4 ml-1.5 rtl:rotate-180"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-brand-gradient"
            >
              <Link href="/crm/book-a-call">
                <PhoneCall
                  className="size-4 mr-1.5 rtl:ml-1.5 rtl:mr-0"
                  aria-hidden="true"
                />
                {t("hero.ctaBooking")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Stats bar ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 pb-16">
        <div className="grid grid-cols-3 gap-1 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-1">
          {STATS.map((stat) => (
            <div
              key={stat.labelKey}
              className="flex flex-col items-center py-3 px-2"
            >
              <span className="text-lg sm:text-xl font-bold text-brand-gradient">
                {stat.value}
              </span>
              <span className="text-[11px] text-muted-foreground mt-0.5">
                {t(stat.labelKey)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Three paths ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="text-center mb-10">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-primary mb-2">
            {t("paths.eyebrow")}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t("paths.title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {BRAND_PATHS.map(
            ({ key, icon: Icon, href, gradient, border, iconBg }) => (
              <Link
                key={key}
                href={href}
                className={cn(
                  "group relative flex flex-col gap-4 rounded-2xl border bg-card/80 backdrop-blur-sm p-6 transition-all duration-300",
                  "hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-start/5",
                  border,
                )}
              >
                {/* Gradient wash on hover */}
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                    gradient,
                  )}
                />

                <div
                  className={cn(
                    "relative z-10 flex size-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                    iconBg,
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </div>

                <div className="relative z-10 flex-1">
                  <h3 className="text-base font-bold text-foreground mb-1.5">
                    {t(`paths.${key}.title`)}
                  </h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {t(`paths.${key}.description`)}
                  </p>
                </div>

                <span className="relative z-10 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary transition-colors group-hover:text-[#0ab8fb]">
                  {t(`paths.${key}.cta`)}
                  <ArrowRight
                    className="size-3.5 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ),
          )}
        </div>
      </section>

      {/* ─── Newsletter ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card/60 backdrop-blur-sm p-10 sm:p-12 text-center shadow-lg shadow-primary/5 transition-shadow hover:shadow-xl hover:shadow-primary/10">
          {/* Animated gradient background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-primary/5 via-transparent to-accent/10 animate-gradient"
            style={{
              backgroundSize: "200% 200%",
              animation: "gradient-shift 6s ease-in-out infinite alternate",
            }}
          />

          {/* Decorative dots pattern */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary/90 mb-5 animate-pulse">
              <Sparkles className="size-3.5" aria-hidden="true" />
              {t("newsletter.eyebrow")}
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight">
              {t("newsletter.title")}
            </h2>
            <p className="text-[15px] text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
              {t("newsletter.description")}
            </p>

            <div className="max-w-md mx-auto">
              <NewsletterForm source="crm_hub" />
            </div>
          </div>
        </div>
      </section>
      <FooterSection />
    </>
  );
}

function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
