"use client";

// app/[locale]/(routes)/services/_components/ServicesClientPage.tsx
import { useState, useTransition, useEffect, useCallback, useRef } from "react";
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
  ShieldCheck,
  Clock,
  Headset,
  Zap,
  ChevronLeft,
  ChevronRight,
  BookOpen,
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

// ─── Trust items ──────────────────────────────────────────────────────

const TRUST_ITEMS = [
  { icon: ShieldCheck, labelKey: "trust.enterpriseSecurity" },
  { icon: Clock, labelKey: "trust.onTimeDelivery" },
  { icon: Headset, labelKey: "trust.dedicatedSupport" },
  { icon: Zap, labelKey: "trust.aiPowered" },
];

// ─── Featured Services Carousel ──────────────────────────────────────

function FeaturedServicesCarousel({
  services,
  t,
}: {
  services: ServiceListItem[];
  t: ReturnType<typeof useTranslations>;
}) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalSlides = services.length;

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [isTransitioning],
  );

  const next = useCallback(() => {
    goToSlide((current + 1) % totalSlides);
  }, [current, totalSlides, goToSlide]);

  const prev = useCallback(() => {
    goToSlide((current - 1 + totalSlides) % totalSlides);
  }, [current, totalSlides, goToSlide]);

  // Auto-rotate every 5s
  useEffect(() => {
    if (isHovered || totalSlides <= 1) return;
    timerRef.current = setInterval(next, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, next, totalSlides]);

  if (totalSlides === 0) return null;

  const service = services[current];
  const Icon = resolveIcon(service.icon);
  const imageUrl = service.hero_image?.url
    ? getMediaUrl(service.hero_image.url)
    : null;

  return (
    <section
      className="relative w-full overflow-hidden rounded-2xl border border-border/30 bg-card/60 backdrop-blur-sm shadow-lg mb-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-21/9 sm:aspect-21/7] bg-muted/30">
        {/* Image with zoom effect */}
        <div className="absolute inset-0 overflow-hidden">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={service.hero_image?.alt_text || service.name}
              className={cn(
                "size-full object-cover transition-transform duration-700",
                isHovered ? "scale-105" : "scale-100",
              )}
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-muted/30">
              <Icon
                className="size-16 text-muted-foreground/30"
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-background/95 via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-background/60 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {/* Category badge */}
              {service.category && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                  <Icon className="size-3" aria-hidden="true" />
                  {service.category.name}
                </span>
              )}
              {/* Service level badge */}
              {service.service_level_display && (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md border border-white/20",
                    service.service_level === "enterprise"
                      ? "bg-[#324b9d]/40 text-white"
                      : service.service_level === "premium"
                        ? "bg-[#13a89e]/40 text-white"
                        : "bg-white/10 text-white",
                  )}
                >
                  {service.service_level_display}
                </span>
              )}
              {service.is_enterprise && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#324b9d]/40 text-white text-[11px] font-semibold px-2.5 py-1 backdrop-blur-md border border-white/20">
                  <ShieldCheck className="size-3" aria-hidden="true" />
                  Enterprise
                </span>
              )}
            </div>

            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
            >
              {service.name}
            </h2>

            <p className="text-[14px] sm:text-[15px] text-white/80 mb-4 line-clamp-2 leading-relaxed">
              {service.short_description}
            </p>

            <Link
              href={`/services/${service.slug}` as any}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-gradient text-white px-5 py-2.5 text-[14px] font-semibold shadow-brand hover:opacity-90 transition-opacity"
            >
              {t("carousel.viewService")}
              <ArrowRight
                className="size-4 rtl:rotate-180"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        {/* Slide counter */}
        {totalSlides > 1 && (
          <div className="absolute top-3 right-3 z-10 rounded-full bg-black/30 px-2.5 py-1 text-xs text-white/70 backdrop-blur-sm">
            {current + 1} / {totalSlides}
          </div>
        )}

        {/* Navigation arrows */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background/80 text-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-background hover:shadow-xl"
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-5 rtl:rotate-180" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background/80 text-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-background hover:shadow-xl"
              aria-label="Next slide"
            >
              <ChevronRight className="size-5 rtl:rotate-180" />
            </button>
          </>
        )}

        {/* Dot navigation */}
        {totalSlides > 1 && (
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
            {services.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={cn(
                  "cursor-pointer rounded-full transition-all duration-300",
                  i === current
                    ? "w-6 bg-white h-1.5"
                    : "w-1.5 bg-white/50 hover:bg-white/80 h-1.5",
                )}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Main Component ────────────────────────────────────────────────────

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

  // Featured services for carousel
  const featuredServices = services.filter((s) => s.is_featured);

  function handleLoadMore() {
    startTransition(async () => {
      const nextPage = page + 1;
      const result = await loadMoreServicesAction(
        activeCategory,
        nextPage,
        locale,
      );
      if (result.success) {
        setServices((prev) => [...prev, ...result.data.items]);
        setHasMore(result.data.hasMore);
        setPage(nextPage);
      }
    });
  }

  return (
    <div className="relative overflow-hidden mt-32">
      {/* ─── Background decoration ─────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-24 right-0 ize-112.5 rounded-full bg-primary/4 blur-3xl" />
        <div className="absolute top-1/3 -left-32 size-87.5 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2size-75 rounded-full bg-primary/3 blur-3xl -translate-x-1/2" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:pb-24">
        {/* ═════════════════════════════════════════════════════════
            FEATURED SERVICES CAROUSEL
           ═════════════════════════════════════════════════════════ */}
        {featuredServices.length > 0 && (
          <FeaturedServicesCarousel services={featuredServices} t={t} />
        )}

        {/* ═════════════════════════════════════════════════════════
            HERO
           ═════════════════════════════════════════════════════════ */}
        <section className="text-center mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary/80 mb-4">
            <Sparkles className="size-3" aria-hidden="true" />
            {t("hero.eyebrow")}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            <span className="text-brand-gradient">
              {t("hero.titleGradient")}
            </span>{" "}
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
            <div className="rounded-xl border border-border/20 bg-card/40 backdrop-blur-sm p-5 text-center transition-all hover:border-primary/30 hover:shadow-sm">
              <span className="text-2xl sm:text-3xl font-bold text-brand-gradient">
                {totalCount}+
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                {t("stats.services")}
              </p>
            </div>
            <div className="rounded-xl border border-border/20 bg-card/40 backdrop-blur-sm p-5 text-center transition-all hover:border-primary/30 hover:shadow-sm">
              <span className="text-2xl sm:text-3xl font-bold text-brand-gradient">
                {categories.length}+
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                {t("stats.categories")}
              </p>
            </div>
            <div className="rounded-xl border border-border/20 bg-card/40 backdrop-blur-sm p-5 text-center transition-all hover:border-primary/30 hover:shadow-sm">
              <span className="text-2xl sm:text-3xl font-bold text-brand-gradient">
                98%
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                {t("stats.clientSatisfaction")}
              </p>
            </div>
            <div className="rounded-xl border border-border/20 bg-card/40 backdrop-blur-sm p-5 text-center transition-all hover:border-primary/30 hover:shadow-sm">
              <span className="text-2xl sm:text-3xl font-bold text-brand-gradient">
                150+
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                {t("stats.projectsDelivered")}
              </p>
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
                  ? "bg-brand-gradient text-brand-foreground shadow-brand"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/60",
              )}
            >
              {t("filters.all")}
            </Link>
            {categories.map((cat) => {
              const CatIcon = resolveIcon(cat.icon);
              return (
                <Link
                  key={cat.id}
                  href={{
                    pathname: "/services",
                    query: { category: cat.slug },
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                    activeCategory === cat.slug
                      ? "bg-brand-gradient text-brand-foreground shadow-brand"
                      : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )}
                >
                  <CatIcon className="size-3.5" aria-hidden="true" />
                  {cat.name}
                </Link>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground/70 mb-8">
          {t("resultsCount", { count: totalCount })}
        </p>

        {/* ═════════════════════════════════════════════════════════
            SERVICE CARDS GRID
           ═════════════════════════════════════════════════════════ */}
        {services.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 opacity-30">📦</div>
            <p className="text-sm text-muted-foreground">{t("empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = resolveIcon(service.icon);
              const imageUrl = service.hero_image?.url
                ? getMediaUrl(service.hero_image.url)
                : null;
              const detailUrl = `/services/${service.slug}` as `/${string}`;

              return (
                <article
                  key={service.id}
                  className="group relative flex flex-col rounded-2xl border border-border/30 bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30"
                >
                  {/* Card image */}
                  <div className="relative h-48 w-full overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-transparent">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt={service.hero_image?.alt_text || service.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-gradient/10">
                          <Icon
                            className="size-8 text-primary/50"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    )}

                    {/* Gradient overlay at bottom */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-card/90 via-card/40 to-transparent"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      {service.is_featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-gradient text-brand-foreground text-[11px] font-semibold px-2.5 py-1 shadow-brand">
                          <Sparkles className="size-3" aria-hidden="true" />
                          {t("featuredBadge")}
                        </span>
                      )}
                      {service.is_enterprise && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#324b9d]/80 text-white text-[11px] font-semibold px-2.5 py-1 shadow-sm">
                          <ShieldCheck className="size-3" aria-hidden="true" />
                          Enterprise
                        </span>
                      )}
                    </div>

                    {/* Service level badge */}
                    {service.service_level_display && (
                      <span
                        className={cn(
                          "absolute bottom-3 right-3 rounded-full px-2.5 py-1 text-[10px] font-medium backdrop-blur-sm border border-white/20",
                          service.service_level === "enterprise"
                            ? "bg-[#324b9d]/60 text-white"
                            : service.service_level === "premium"
                              ? "bg-[#13a89e]/60 text-white"
                              : "bg-black/30 text-white/90",
                        )}
                      >
                        {service.service_level_display}
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col flex-1 p-5 gap-2">
                    {/* Category + icon */}
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                        <Icon className="size-3.5" aria-hidden="true" />
                      </div>
                      {service.category && (
                        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                          {service.category.name}
                        </span>
                      )}
                    </div>

                    <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {service.name}
                    </h2>

                    <p className="text-sm text-muted-foreground flex-1 leading-relaxed line-clamp-3">
                      {service.short_description}
                    </p>

                    {/* Card footer */}
                    <div className="flex items-center gap-2 mt-2 pt-3 border-t border-border/20">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="flex-1 group/btn border-primary/20 hover:border-primary/40"
                      >
                        <Link
                          href={{
                            pathname: "/crm/quote",
                            query: { service: service.id },
                          }}
                        >
                          {t("cardCta")}
                          <ArrowRight
                            className="size-3.5 rtl:rotate-180 ml-1 group-hover/btn:translate-x-0.5 rtl:group-hover/btn:-translate-x-0.5 transition-transform"
                            aria-hidden="true"
                          />
                        </Link>
                      </Button>
                      <Link
                        href={detailUrl as any}
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/30 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
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
            <button
              onClick={handleLoadMore}
              disabled={isPending}
              className="relative inline-flex min-w-40 cursor-pointer items-center justify-center gap-2 rounded-full border border-brand-gradient bg-background/80 px-8 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-muted/30 disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                t("loadMore")
              )}
              <span className="absolute inset-0 rounded-full bg-brand-gradient opacity-0 blur-xl transition-opacity group-hover:opacity-20" />
            </button>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════
            TRUST SECTION
           ═════════════════════════════════════════════════════════ */}
        <section className="mt-16 sm:mt-20">
          <div className="rounded-2xl border border-border/20 bg-brand-soft/40 p-6 sm:p-8 backdrop-blur-sm">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary/80">
                <ShieldCheck className="size-3" aria-hidden="true" />
                {t("trust.whyAutomex")}
              </span>
              <h2 className="mt-2 text-xl font-bold text-foreground">
                {t("trust.headline")}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TRUST_ITEMS.map((item) => (
                <div
                  key={item.labelKey}
                  className="flex items-start gap-3 rounded-xl border border-border/20 bg-card/40 backdrop-blur-sm p-4 transition-all hover:border-primary/30"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="size-4" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-foreground/80 leading-snug">
                    {t(item.labelKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════
            BOTTOM CTA
           ═════════════════════════════════════════════════════════ */}
        <section className="mt-12 sm:mt-16 relative overflow-hidden rounded-2xl border border-border/20 bg-brand-soft/40 p-8 sm:p-10 text-center backdrop-blur-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary/80 mb-4">
            <Sparkles className="size-3" aria-hidden="true" />
            {t("letsBuild")}
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {t("bottomCta.title")}
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            {t("bottomCta.description")}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/crm/quote"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-brand transition-opacity hover:opacity-90"
            >
              {t("bottomCta.ctaQuote")}
              <ArrowRight
                className="size-4 rtl:rotate-180"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/crm/book-a-call"
              className="inline-flex items-center gap-2 rounded-lg border border-brand-gradient bg-transparent px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/30"
            >
              {t("bottomCta.ctaBooking")}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
