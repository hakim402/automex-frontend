"use client";

// app/[locale]/(routes)/services/_components/ServicesClientPage.tsx
import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Cpu,
  BrainCircuit,
  Database,
  Cloud,
  Palette,
  Users,
  Server,
  Sparkles,
  Loader2,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Headset,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { getMediaUrl } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import type { SupportedLocale } from "@/lib/locale";
import type { ServiceListItem, ServiceCategory } from "@/lib/automex/types";

import { loadMoreServicesAction } from "../actions";

// ─── Icon mapping ────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  cpu: Cpu,
  "brain-circuit": BrainCircuit,
  bot: BrainCircuit,
  database: Database,
  cloud: Cloud,
  palette: Palette,
  users: Users,
  server: Server,
};

function resolveIcon(icon?: string): LucideIcon {
  if (!icon) return Sparkles;
  return ICON_MAP[icon.replace(/^lucide:/, "")] ?? Sparkles;
}

// ─── Props ───────────────────────────────────────────────────────────

interface ServicesClientPageProps {
  initialServices: ServiceListItem[];
  hasMoreInitial: boolean;
  categories: ServiceCategory[];
  activeCategory?: string;
  totalCount: number;
}

// ─── Trust items (static, not from API) ──────────────────────────────

const TRUST_ITEMS = [
  { icon: ShieldCheck, labelKey: "trust.enterpriseSecurity" },
  { icon: Clock, labelKey: "trust.onTimeDelivery" },
  { icon: Headset, labelKey: "trust.dedicatedSupport" },
  { icon: Zap, labelKey: "trust.aiPowered" },
];

export function ServicesClientPage({
  initialServices,
  hasMoreInitial,
  categories,
  activeCategory,
  totalCount,
}: ServicesClientPageProps) {
  const t = useTranslations("ServicesPage");
  const locale = useLocale() as SupportedLocale;

  const [services, setServices] = useState(initialServices);
  const [hasMore, setHasMore] = useState(hasMoreInitial);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  function handleLoadMore() {
    startTransition(async () => {
      const nextPage = page + 1;
      const result = await loadMoreServicesAction(activeCategory, nextPage, locale);
      if (result.success) {
        setServices((prev) => [...prev, ...result.data.items]);
        setHasMore(result.data.hasMore);
        setPage(nextPage);
      }
    });
  }

  return (
    <div className="relative overflow-hidden">
      {/* ─── Background decoration ─────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-0 size-[450px] rounded-full bg-[#0ab8fb]/3 blur-3xl" />
        <div className="absolute top-1/3 -left-32 size-[350px] rounded-full bg-[#324b9d]/3 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 size-[300px] rounded-full bg-[#13a89e]/3 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        {/* ═════════════════════════════════════════════════════════
            BRAND HERO
           ═════════════════════════════════════════════════════════ */}
        <section className="text-center mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
            <Sparkles className="size-3" aria-hidden="true" />
            {t("hero.eyebrow")}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            <span className="text-brand-gradient">{t("hero.titleGradient")}</span>{" "}
            <span className="text-foreground">{t("hero.titleRest")}</span>
          </h1>

          <p className="text-[15px] sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("hero.description")}
          </p>
        </section>

        {/* ═════════════════════════════════════════════════════════
            STATS BAR
           ═════════════════════════════════════════════════════════ */}
        <section className="mb-10 sm:mb-14">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-border/50 bg-card/70 backdrop-blur-sm p-5 text-center">
              <span className="text-2xl sm:text-3xl font-bold text-brand-gradient">
                {totalCount}+</span>
              <p className="text-[12px] text-muted-foreground mt-1">{t("stats.services")}</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/70 backdrop-blur-sm p-5 text-center">
              <span className="text-2xl sm:text-3xl font-bold text-brand-gradient">
                {categories.length}+</span>
              <p className="text-[12px] text-muted-foreground mt-1">{t("stats.categories")}</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/70 backdrop-blur-sm p-5 text-center">
              <span className="text-2xl sm:text-3xl font-bold text-brand-gradient">98%</span>
              <p className="text-[12px] text-muted-foreground mt-1">{t("stats.clientSatisfaction")}</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/70 backdrop-blur-sm p-5 text-center">
              <span className="text-2xl sm:text-3xl font-bold text-brand-gradient">150+</span>
              <p className="text-[12px] text-muted-foreground mt-1">{t("stats.projectsDelivered")}</p>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════
            CATEGORY FILTERS
           ═════════════════════════════════════════════════════════ */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Link
              href={{ pathname: "/services" }}
              className={cn(
                "rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                !activeCategory
                  ? "bg-brand-gradient shadow-brand text-brand-foreground"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80"
              )}
            >
              {t("filters.all")}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={{ pathname: "/services", query: { category: cat.slug } }}
                className={cn(
                  "rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                  activeCategory === cat.slug
                    ? "bg-brand-gradient shadow-brand text-brand-foreground"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        <p className="text-center text-[12px] text-muted-foreground mb-10">
          {t("resultsCount", { count: totalCount })}
        </p>

        {/* ═════════════════════════════════════════════════════════
            SERVICE CARDS GRID
           ═════════════════════════════════════════════════════════ */}
        {services.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 opacity-30">📦</div>
            <p className="text-[14px] text-muted-foreground">{t("empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => {
              const Icon = resolveIcon(service.icon);
              const imageUrl = getMediaUrl(service.hero_image?.url);
              const detailUrl = `/services/${service.slug}` as `/${string}`;

              return (
                <article
                  key={service.id}
                  className="group relative flex flex-col rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5 hover:border-primary/40"
                >
                  {/* Card image */}
                  <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt={service.hero_image?.alt_text || service.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-gradient/10">
                          <Icon className="size-8 text-primary/50" aria-hidden="true" />
                        </div>
                      </div>
                    )}

                    {/* Gradient overlay at bottom of image */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card/90 via-card/40 to-transparent"
                    />

                    {/* Featured badge */}
                    {service.is_featured && (
                      <span className="absolute top-3 start-3 inline-flex items-center gap-1 rounded-full bg-brand-gradient text-brand-foreground text-[11px] font-semibold px-2.5 py-1 shadow-brand">
                        <Sparkles className="size-3" aria-hidden="true" />
                        {t("featuredBadge")}
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col flex-1 p-5 gap-3">
                    {/* Category + icon row */}
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                        <Icon className="size-4" aria-hidden="true" />
                      </div>
                      {service.category && (
                        <span className="text-[12px] font-medium text-muted-foreground">
                          {service.category.name}
                        </span>
                      )}
                    </div>

                    <h2 className="text-[16px] font-semibold text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </h2>

                    <p className="text-[13px] text-muted-foreground flex-1 leading-relaxed">
                      {service.short_description}
                    </p>

                    {/* Card footer with actions */}
                    <div className="flex items-center gap-2 mt-1 pt-3 border-t border-border/30">
                      <Button asChild size="sm" variant="outline" className="flex-1 group/btn border-brand-gradient">
                        <Link href={{ pathname: "/crm/quote", query: { service: service.id } }}>
                          {t("cardCta")}
                          <ArrowRight className="size-3.5 rtl:rotate-180 ml-1 group-hover/btn:translate-x-0.5 rtl:group-hover/btn:-translate-x-0.5 transition-transform" aria-hidden="true" />
                        </Link>
                      </Button>
                      <Link
                        href={detailUrl as any}
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                        aria-label={`View details for ${service.name}`}
                      >
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════
            LOAD MORE
           ═════════════════════════════════════════════════════════ */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadMore}
              disabled={isPending}
              className="min-w-[160px] border-brand-gradient"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                t("loadMore")
              )}
            </Button>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════
            TRUST SECTION
           ═════════════════════════════════════════════════════════ */}
        <section className="mt-16 sm:mt-20">
          <div className="rounded-2xl border border-[#324b9d]/20 bg-gradient-to-br from-[#324b9d]/5 via-[#0ab8fb]/3 to-transparent p-6 sm:p-8">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#324b9d]/20 bg-[#324b9d]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#324b9d] mb-3">
                <ShieldCheck className="size-3" aria-hidden="true" />
                {t("trust.whyAutomex")}
              </span>
              <h2 className="text-xl font-bold text-foreground">{t("trust.headline")}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TRUST_ITEMS.map((item) => (
                <div
                  key={item.labelKey}
                  className="flex items-start gap-3 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm p-4"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#324b9d]/10 text-[#324b9d]">
                    <item.icon className="size-4" aria-hidden="true" />
                  </div>
                  <p className="text-[13px] text-foreground/80 leading-snug">{t(item.labelKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════
            BOTTOM CTA
           ═════════════════════════════════════════════════════════ */}
        <section className="mt-12 sm:mt-16 relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-8 sm:p-10 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#0ab8fb]/5 via-transparent to-[#324b9d]/5"
          />

          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
            <Sparkles className="size-3" aria-hidden="true" />
            {t("letsBuild")}
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {t("bottomCta.title")}
          </h2>
          <p className="text-[14px] text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            {t("bottomCta.description")}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-brand-gradient shadow-brand">
              <Link href="/crm/quote">
                {t("bottomCta.ctaQuote")}
                <ArrowRight className="size-4 ml-1.5 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-brand-gradient">
              <Link href="/crm/book-a-call">{t("bottomCta.ctaBooking")}</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}