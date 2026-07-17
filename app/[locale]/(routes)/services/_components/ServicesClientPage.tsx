"use client";

// app/[locale]/(routes)/services/_component/ServicesClientPage.tsx
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
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import type { SupportedLocale } from "@/lib/locale";
import type { ServiceListItem, ServiceCategory } from "@/lib/automex/types";

import { loadMoreServicesAction } from "../actions";

// Maps the backend's "lucide:cpu" icon identifier (per ServiceCategory's
// doc comment) to an actual component. Unmapped/missing icons fall back
// to Sparkles rather than breaking — the backend seed data currently
// ships empty icon strings for most services, so this fallback carries
// real weight right now, not just theoretical safety.
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
}

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
    <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
      {/* Hero */}
      <section className="text-center mb-12">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-primary mb-3">{t("hero.eyebrow")}</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t("hero.title")}</h1>
        <p className="text-[15px] text-muted-foreground max-w-2xl mx-auto">{t("hero.description")}</p>
      </section>

      {/* Category filters — real URLs, crawlable, not client-only state */}
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <Link
            href={{ pathname: "/services" }}
            className={cn(
              "rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
              !activeCategory ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground"
            )}
          >
            {t("filters.all")}
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={{ pathname: "/services", query: { category: cat.slug } }}
              className={cn(
                "rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
                activeCategory === cat.slug ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground"
              )}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      <p className="text-center text-[12px] text-muted-foreground mb-10">{t("resultsCount", { count: totalCount })}</p>

      {/* Grid */}
      {services.length === 0 ? (
        <p className="text-center text-[14px] text-muted-foreground py-16">{t("empty")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => {
            const Icon = resolveIcon(service.icon);
            const imageUrl = service.hero_image?.url;

            return (
              <article
                key={service.id}
                className="group flex flex-col rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden hover:border-primary/50 transition-colors"
              >
                <div className="relative h-40 w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden">
                  {imageUrl ? (
                    // Plain <img>, not next/image — the media host's domain
                    // isn't in next.config's remotePatterns yet. Swap once
                    // the production storage domain (S3/GCS) is confirmed.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={service.hero_image?.alt_text || service.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Icon className="size-10 text-primary/60" aria-hidden="true" />
                  )}
                  {service.is_featured && (
                    <span className="absolute top-3 start-3 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold px-2.5 py-1">
                      {t("featuredBadge")}
                    </span>
                  )}
                </div>

                <div className="flex flex-col flex-1 p-5 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <Icon className="size-4" aria-hidden="true" />
                    </div>
                    <span className="text-[12px] font-medium text-muted-foreground">{service.category.name}</span>
                  </div>

                  <h2 className="text-[16px] font-semibold text-foreground">{service.name}</h2>
                  <p className="text-[13px] text-muted-foreground flex-1">{service.short_description}</p>

                  <Button asChild size="sm" variant="outline" className="mt-2 w-full">
                    <Link href={{ pathname: "/crm/quote", query: { service: service.id } }}>
                      {t("cardCta")}
                      <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center mt-10">
          <Button variant="outline" onClick={handleLoadMore} disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : t("loadMore")}
          </Button>
        </div>
      )}

      {/* Bottom CTA strip */}
      <section className="mt-20 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm p-8 sm:p-10 text-center">
        <h2 className="text-xl font-bold text-foreground mb-2">{t("bottomCta.title")}</h2>
        <p className="text-[14px] text-muted-foreground mb-6 max-w-xl mx-auto">{t("bottomCta.description")}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/crm/quote">{t("bottomCta.ctaQuote")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/crm/book-a-call">{t("bottomCta.ctaBooking")}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}