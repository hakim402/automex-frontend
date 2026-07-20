"use client";

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
  Layers,
  Wrench,
  Building2,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import type { SupportedLocale } from "@/lib/locale";
import type { ServiceListItem, ServiceCategory } from "@/lib/automex/types";

import { loadMoreServicesAction } from "../actions";

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

interface ServicesClientPageProps {
  initialServices: ServiceListItem[];
  hasMoreInitial: boolean;
  categories: ServiceCategory[];
  activeCategory?: string;
  totalCount: number;
  techCount: number;
  industryCount: number;
}

export function ServicesClientPage({
  initialServices,
  hasMoreInitial,
  categories,
  activeCategory,
  totalCount,
  techCount,
  industryCount,
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
    <div className="min-h-screen">
      {/* ================================================================
                          HERO — Modern gradient style
      ================================================================ */}
      <section className="relative isolate overflow-hidden pb-16 pt-20 sm:pb-20 sm:pt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 -translate-x-1/2 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div className="relative aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-cyan-400 to-blue-600 opacity-20 sm:w-288.75" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(148_198_233/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_198_233/0.04)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)]"
        />

        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-primary">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mx-auto max-w-4xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {t("hero.description")}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/crm/quote">
                {t("hero.ctaQuote")}
                <ArrowRight
                  className="size-4 rtl:rotate-180"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/crm/book-a-call">{t("hero.ctaBooking")}</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-4">
            {[
              { icon: Layers, value: totalCount, label: t("stats.services") },
              {
                icon: Wrench,
                value: techCount,
                label: t("stats.technologies"),
              },
              {
                icon: Building2,
                value: industryCount,
                label: t("stats.industries"),
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm px-4 py-4"
              >
                <stat.icon
                  className="size-4 text-primary/60"
                  aria-hidden="true"
                />
                <span className="text-xl font-bold text-foreground tabular-nums">
                  {stat.value}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
                      CATEGORY FILTERS — Sticky
      ================================================================ */}
      <div className="sticky top-18 z-30 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 py-3">
          <div className="flex justify-center gap-2 min-w-max">
            <Link
              href={{ pathname: "/services" }}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-all",
                !activeCategory
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {t("filters.all")}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={{ pathname: "/services", query: { category: cat.slug } }}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-all",
                  activeCategory === cat.slug
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================
                          SERVICE CARDS GRID
      ================================================================ */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <p className="mb-8 text-center text-[12px] text-muted-foreground">
          {t("resultsCount", { count: totalCount })}
        </p>

        {services.length === 0 ? (
          <p className="py-16 text-center text-[14px] text-muted-foreground">
            {t("empty")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = resolveIcon(service.icon);
              const imageUrl = service.hero_image?.url;

              return (
                <Link
                  key={service.id}
                  href={{
                    pathname: "/services/[slug]",
                    params: { slug: service.slug },
                  }}
                  className="group flex flex-col rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_40px_-12px_rgb(10_184_251/15%)]"
                >
                  <div className="relative h-44 w-full bg-linear-to-br from-primary/10 via-primary/5 to-transparent flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-t from-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt={service.hero_image?.alt_text || service.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/20">
                        <Icon className="size-6" aria-hidden="true" />
                      </div>
                    )}

                    {service.is_featured && (
                      <span className="absolute top-3 inset-s-3 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[11px] font-semibold text-primary-foreground backdrop-blur-sm">
                        <span className="size-1.5 rounded-full bg-white animate-pulse" />
                        {t("featuredBadge")}
                      </span>
                    )}

                    <span className="absolute bottom-3 inset-s-3 rounded-full bg-background/90 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground backdrop-blur-sm">
                      {service.category.name}
                    </span>
                  </div>

                  <div className="flex flex-col flex-1 gap-2 p-5">
                    <h2 className="text-[16px] font-semibold text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </h2>
                    <p className="text-[13px] leading-relaxed text-muted-foreground flex-1 line-clamp-2">
                      {service.short_description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[13px] font-medium text-primary">
                      {t("cardCtaDetail")}
                      <ArrowRight
                        className="size-3.5 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {hasMore && (
          <div className="mt-12 flex justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadMore}
              disabled={isPending}
              className="rounded-full border-primary/30 px-8 hover:border-primary/60 hover:bg-primary/5"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> {t("loading")}
                </>
              ) : (
                <>
                  {t("loadMore")}
                  <ArrowRight
                    className="size-4 rtl:rotate-180"
                    aria-hidden="true"
                  />
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* ================================================================
                          BOTTOM CTA — Gradient card
      ================================================================ */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 sm:p-12 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgb(10_184_251/8%),transparent)]"
          />
          <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
            {t("bottomCta.title")}
          </h2>
          <p className="mb-6 text-[14px] text-muted-foreground sm:text-base">
            {t("bottomCta.description")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/crm/quote">{t("bottomCta.ctaQuote")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/crm/book-a-call">{t("bottomCta.ctaBooking")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
