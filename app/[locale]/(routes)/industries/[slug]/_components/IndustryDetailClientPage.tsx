"use client";

import { useTranslations } from "next-intl";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  ChevronLeft,
  Cpu,
  GraduationCap,
  HeartPulse,
  Landmark,
  Factory,
  Truck,
  ShoppingBag,
  HardHat,
  Utensils,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import type { Industry, ServiceListItem, CaseStudyListItem } from "@/lib/automex/types";
import { getMediaUrl } from "@/lib/env";

interface IndustryDetailClientPageProps {
  industry: Industry;
  relatedServices: ServiceListItem[];
  relatedCaseStudies: CaseStudyListItem[];
}

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

export function IndustryDetailClientPage({
  industry,
  relatedServices,
  relatedCaseStudies,
}: IndustryDetailClientPageProps) {
  const t = useTranslations("IndustriesPage");
  const Icon = getIndustryIcon(industry.icon);

  return (
    <div className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-0 size-[450px] rounded-full bg-[#0ab8fb]/3 blur-3xl" />
        <div className="absolute top-1/3 -left-32 size-[350px] rounded-full bg-[#324b9d]/3 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:py-20">
        {/* Back link */}
        <Link
          href="/industries"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
          {t("hero.headline")}
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-10">
          {/* Icon */}
          <div className="flex size-20 sm:size-24 shrink-0 items-center justify-center rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm">
            <Icon className="size-10 text-primary" aria-hidden="true" />
          </div>

          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-3">
              <Building2 className="size-3" aria-hidden="true" />
              {t("hero.eyebrow")}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
              {industry.name}
            </h1>
            {industry.description && (
              <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                {industry.description}
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/40 my-10" aria-hidden="true" />

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
              {industry.name} Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}` as any}
                  className="group flex items-start gap-3 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand/5 hover:border-primary/40"
                >
                  {service.icon ? (
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-gradient/5 text-primary/60 mt-0.5">
                      <Cpu className="size-4" aria-hidden="true" />
                    </div>
                  ) : (
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-gradient/5 text-primary/60 mt-0.5">
                      <Cpu className="size-4" aria-hidden="true" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                      {service.name}
                    </h3>
                    {service.short_description && (
                      <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
                        {service.short_description}
                      </p>
                    )}
                  </div>
                  <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors mt-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Case Studies */}
        {relatedCaseStudies.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
              {industry.name} Case Studies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedCaseStudies.map((cs) => (
                <Link
                  key={cs.id}
                  href={`/case-studies/${cs.slug}` as any}
                  className="group flex flex-col gap-3 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand/5 hover:border-primary/40"
                >
                  {cs.thumbnail?.url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getMediaUrl(cs.thumbnail.url)}
                      alt={cs.thumbnail.alt_text || cs.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {cs.title}
                  </h3>
                  {cs.client_name && (
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                      Client: {cs.client_name}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1 text-[12px] font-medium text-primary/70 group-hover:text-primary transition-colors mt-auto">
                    Read case study
                    <ArrowUpRight className="size-3" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="mt-8 relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-8 sm:p-10 text-center">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#0ab8fb]/5 via-transparent to-[#324b9d]/5" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
            <Building2 className="size-3" aria-hidden="true" />
            {t("hero.eyebrow")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Need {industry.name} solutions?
          </h2>
          <p className="text-[14px] text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            Let&apos;s discuss how our {industry.name.toLowerCase()} expertise can help your business.
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
