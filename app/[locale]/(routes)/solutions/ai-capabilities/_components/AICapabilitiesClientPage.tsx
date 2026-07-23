"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Loader2, ArrowRight, Sparkles, Brain, Cpu } from "lucide-react";
import * as LucideIcons from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import type { SupportedLocale } from "@/lib/locale";
import type { AICapability, Technology } from "@/lib/automex/types";
import { getMediaUrl } from "@/lib/env";

import { loadMoreAICapabilitiesAction } from "../actions";

interface AICapabilitiesClientPageProps {
  initialCapabilities: AICapability[];
  hasMoreInitial: boolean;
  technologies: Technology[];
  activeCategory?: string;
  totalCount: number;
}

const MATURITY_COLORS: Record<string, string> = {
  research: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  production: "bg-green-500/10 text-green-500 border-green-500/20",
  experimental: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
};

/** Resolve a lucide:icon-name string to a lucide-react component. */
function resolveLucideIcon(iconName: string | undefined): React.ElementType {
  if (!iconName) return Cpu;
  const name = iconName.startsWith("lucide:") ? iconName.slice(7) : iconName;
  const pascal = name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
  const map = LucideIcons as unknown as Record<string, React.ElementType>;
  return map[pascal] || Cpu;
}

function extractCategories(capabilities: AICapability[]): { value: string; label: string }[] {
  const seen = new Set<string>();
  return capabilities
    .filter((c) => {
      if (seen.has(c.category)) return false;
      seen.add(c.category);
      return true;
    })
    .map((c) => ({ value: c.category, label: c.category_display }));
}

export function AICapabilitiesClientPage({
  initialCapabilities,
  hasMoreInitial,
  technologies,
  activeCategory,
  totalCount,
}: AICapabilitiesClientPageProps) {
  const locale = useLocale() as SupportedLocale;
  const t = useTranslations("AICapabilities");
  const [capabilities, setCapabilities] = useState(initialCapabilities);
  const [hasMore, setHasMore] = useState(hasMoreInitial);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  function handleLoadMore() {
    startTransition(async () => {
      const nextPage = page + 1;
      const result = await loadMoreAICapabilitiesAction(nextPage, activeCategory, locale);
      if (result.success) {
        setCapabilities((prev) => [...prev, ...result.data.items]);
        setHasMore(result.data.hasMore);
        setPage(nextPage);
      }
    });
  }

  const categories = extractCategories(initialCapabilities);

  function maturityLabel(level: string): string {
    const key = `listing.maturity.${level}` as const;
    // Only valid maturity levels exist in i18n
    try {
      return t(key as any);
    } catch {
      return level;
    }
  }

  return (
    <div className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-0 size-[450px] rounded-full bg-[#0ab8fb]/3 blur-3xl" />
        <div className="absolute top-1/3 -left-32 size-[350px] rounded-full bg-[#324b9d]/3 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        {/* Hero */}
        <section className="text-center mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
            <Brain className="size-3" aria-hidden="true" />
            {t("listing.hero.eyebrow")}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            <span className="text-brand-gradient">{t("listing.hero.headline")}</span>
          </h1>
          <p className="text-[15px] sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("listing.hero.description")}
          </p>
        </section>

        {/* Category filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <Link
              href={{ pathname: "/solutions/ai-capabilities", query: {} as any }}
              className={cn(
                "rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                !activeCategory ? "bg-brand-gradient text-white shadow-brand" : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80"
              )}
            >
              {t("listing.filters.all")}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={{ pathname: "/solutions/ai-capabilities", query: { category: cat.value } as any }}
                className={cn(
                  "rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                  activeCategory === cat.value ? "bg-brand-gradient text-white shadow-brand" : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        )}

        <p className="text-center text-[12px] text-muted-foreground mb-10">
          {t("listing.filters.count", { count: totalCount, plural: totalCount !== 1 ? "ies" : "y" })}
        </p>

        {/* Grid */}
        {capabilities.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 opacity-30"><Brain className="size-10 mx-auto" aria-hidden="true" /></div>
            <p className="text-[14px] text-muted-foreground">{t("listing.empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map((cap) => (
              <article
                key={cap.id}
                className="group relative flex flex-col rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5 hover:border-primary/40"
              >
                <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                  {cap.cover_image?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getMediaUrl(cap.cover_image.url)}
                      alt={cap.cover_image.alt_text || cap.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <Brain className="size-10 text-primary/30" aria-hidden="true" />
                    </div>
                  )}
                  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card/90 via-card/40 to-transparent" />

                  {/* Maturity badge */}
                  {cap.maturity_level && (
                    <span
                      className={cn(
                        "absolute top-3 end-3 inline-flex items-center rounded-full border text-[10px] font-semibold px-2 py-0.5",
                        MATURITY_COLORS[cap.maturity_level] || "bg-muted/50 text-muted-foreground border-border/20"
                      )}
                    >
                      {cap.maturity_level ? maturityLabel(cap.maturity_level) : cap.maturity_level_display}
                    </span>
                  )}

                  {/* Icon badge */}
                  {cap.icon && (() => { const Icon = resolveLucideIcon(cap.icon); return (
                    <span className="absolute top-3 start-3 inline-flex items-center justify-center size-7 rounded-lg bg-background/80 backdrop-blur-sm border border-border/30 shadow-sm">
                      <Icon className="size-3.5 text-primary" aria-hidden="true" />
                    </span>
                  ); })()}
                </div>

                <div className="flex flex-col flex-1 p-5 gap-2">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-primary">
                    {cap.category_display}
                  </span>
                  <h2 className="text-[16px] font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {cap.name}
                  </h2>
                  {cap.description && (
                    <p className="text-[13px] text-muted-foreground flex-1 leading-relaxed line-clamp-3">
                      {cap.description}
                    </p>
                  )}
                  <div className="mt-auto pt-3">
                    <Link
                      href={`/solutions/ai-capabilities/${cap.slug}` as any}
                      className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"
                    >
                      {t("listing.card.learnMore")}
                      <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-12">
            <Button variant="outline" size="lg" onClick={handleLoadMore} disabled={isPending} className="min-w-[160px] border-brand-gradient">
              {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : t("listing.loadMore")}
            </Button>
          </div>
        )}

        {/* Bottom CTA */}
        <section className="mt-16 sm:mt-20 relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-8 sm:p-10 text-center">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#0ab8fb]/5 via-transparent to-[#324b9d]/5" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
            <Sparkles className="size-3" aria-hidden="true" />
            {t("listing.cta.eyebrow")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{t("listing.cta.title")}</h2>
          <p className="text-[14px] text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            {t("listing.cta.description")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-brand-gradient shadow-brand">
              <Link href="/crm/quote">
                {t("listing.cta.quote")}
                <ArrowRight className="size-4 ml-1.5 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-brand-gradient">
              <Link href="/crm/book-a-call">{t("listing.cta.booking")}</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
