"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, ArrowUpRight, Building2, Cpu, HeartPulse, GraduationCap, Landmark, Factory, Truck, ShoppingBag, HardHat, Utensils } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import type { Industry } from "@/lib/automex/types";

interface IndustriesClientPageProps {
  industries: Industry[];
}

/** Map lucide icon names to components for industry cards. */
const ICON_MAP: Record<string, LucideIcon> = {
  "lucide:code-2": Cpu,
  "lucide:heart-pulse": HeartPulse,
  "lucide:graduation-cap": GraduationCap,
  "lucide:landmark": Landmark,
  "lucide:factory": Factory,
  "lucide:truck": Truck,
  "lucide:shopping-bag": ShoppingBag,
  "lucide:hard-hat": HardHat,
  "lucide:utensils": Utensils,
  "lucide:building-2": Building2,
};

function getIndustryIcon(iconName?: string): LucideIcon {
  if (iconName && ICON_MAP[iconName]) return ICON_MAP[iconName];
  return Building2;
}

export function IndustriesClientPage({ industries }: IndustriesClientPageProps) {
  const t = useTranslations("IndustriesPage");

  return (
    <div className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-0 size-[450px] rounded-full bg-[#0ab8fb]/3 blur-3xl" />
        <div className="absolute top-1/3 -left-32 size-[350px] rounded-full bg-[#324b9d]/3 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        {/* Hero */}
        <section className="text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
            <Building2 className="size-3" aria-hidden="true" />
            {t("hero.eyebrow")}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            <span className="text-brand-gradient">{t("hero.headline")}</span>
          </h1>
          <p className="text-[15px] sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("hero.description")}
          </p>
        </section>

        {/* Industry Cards Grid */}
        {industries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[14px] text-muted-foreground">No industries available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {industries.map((industry) => {
              const Icon = getIndustryIcon(industry.icon);
              return (
                <Link
                  key={industry.id}
                  href={`/industries/${industry.slug}` as any}
                  className="group relative flex flex-col gap-4 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5 hover:border-primary/40"
                >
                  {/* Icon */}
                  <div className="flex size-12 items-center justify-center rounded-xl bg-brand-gradient/5 text-primary/80 transition-colors group-hover:text-primary group-hover:bg-brand-gradient/10">
                    <Icon className="size-6" aria-hidden="true" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {industry.name}
                    </h3>
                    {industry.description && (
                      <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2">
                        {industry.description}
                      </p>
                    )}
                  </div>

                  {/* Arrow indicator */}
                  <div className="flex items-center gap-1.5 text-[12px] font-medium text-primary/60 group-hover:text-primary transition-colors mt-auto">
                    <span>Learn more</span>
                    <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <section className="mt-12 relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-8 sm:p-10 text-center">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#0ab8fb]/5 via-transparent to-[#324b9d]/5" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
            <Building2 className="size-3" aria-hidden="true" />
            {t("hero.eyebrow")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{t("cta.title")}</h2>
          <p className="text-[14px] text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            {t("cta.description")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-brand-gradient shadow-brand">
              <Link href="/crm/quote">
                {t("cta.button")}
                <ArrowRight className="size-4 ml-1.5 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
