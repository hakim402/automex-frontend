"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Code2, ArrowUpRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import type { TechExpertiseArea } from "@/lib/automex/types";

// ─── Category metadata ──────────────────────────────────────────────────

const CATEGORY_META: Record<string, { icon: string }> = {
  architecture: { icon: "cpu" },
  cloud: { icon: "cloud" },
  data_engineering: { icon: "database" },
  ai: { icon: "sparkles" },
  security: { icon: "shield" },
  mobile: { icon: "smartphone" },
  devops: { icon: "container" },
  qa: { icon: "shield-check" },
};

const ALL_CATEGORIES = Object.keys(CATEGORY_META);

// ─── Helpers ────────────────────────────────────────────────────────────

/** Resolve a lucide:icon-name or plain icon-name string to a lucide-react component. */
function resolveLucideIcon(iconName: string | undefined): React.ElementType {
  if (!iconName) return Code2;
  const name = iconName.startsWith("lucide:") ? iconName.slice(7) : iconName;
  const pascal = name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
  const map = LucideIcons as unknown as Record<string, React.ElementType>;
  return map[pascal] || Code2;
}

/** Title-case a slug for fallback display when name is null. */
function titleCase(slug: string): string {
  return slug
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function groupByCategory(
  areas: TechExpertiseArea[],
): Map<string, TechExpertiseArea[]> {
  const groups = new Map<string, TechExpertiseArea[]>();
  for (const area of areas) {
    const key = area.category;
    const list = groups.get(key);
    if (list) list.push(area);
    else groups.set(key, [area]);
  }
  return groups;
}

// ─── Component ──────────────────────────────────────────────────────────

export function TechExpertiseClientPage({
  areas,
  activeCategory,
}: {
  areas: TechExpertiseArea[];
  activeCategory?: string;
}) {
  const t = useTranslations("TechExpertise");
  const router = useRouter();

  const grouped = groupByCategory(areas);
  const availableCategories = ALL_CATEGORIES.filter((cat) => grouped.has(cat));

  function handleFilter(category: string | undefined) {
    if (!category) {
      router.push("/tech-expertise");
    } else {
      router.push(`/tech-expertise?category=${category}`);
    }
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-24 right-0 size-[450px] rounded-full bg-[#0ab8fb]/3 blur-3xl" />
        <div className="absolute top-1/3 -left-32 size-[350px] rounded-full bg-[#324b9d]/3 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        {/* ── Hero ── */}
        <section className="text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
            <Code2 className="size-3" aria-hidden="true" />
            {t("listing.hero.eyebrow")}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            <span className="text-brand-gradient">
              {t("listing.hero.headline")}
            </span>
          </h1>
          <p className="text-[15px] sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("listing.hero.description")}
          </p>
        </section>

        {/* ── Category filter tabs ── */}
        {availableCategories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              type="button"
              onClick={() => handleFilter(undefined)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200 border",
                !activeCategory
                  ? "bg-brand-gradient text-white border-transparent shadow-brand"
                  : "border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/40",
              )}
            >
              {t("listing.filters.all")}
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleFilter(cat)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200 border",
                  activeCategory === cat
                    ? "bg-brand-gradient text-white border-transparent shadow-brand"
                    : "border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/40",
                )}
              >
                {titleCase(cat)}
              </button>
            ))}
          </div>
        )}

        {/* ── Content ── */}
        {areas.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-muted/50 mb-4">
              <Code2
                className="size-7 text-muted-foreground/40"
                aria-hidden="true"
              />
            </div>
            <p className="text-[14px] text-muted-foreground">
              {t("listing.empty")}
            </p>
          </div>
        ) : (
          <>
            {Array.from(grouped.entries()).map(([category, items]) => {
              const meta = CATEGORY_META[category];
              const CatIcon = meta ? resolveLucideIcon(meta.icon) : Code2;
              const displayCategory =
                items[0]?.category_display || titleCase(category);

              return (
                <section key={category} className="mb-16 last:mb-0">
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center size-8 rounded-lg bg-brand-gradient text-white shadow-brand shrink-0">
                        <CatIcon className="size-4" aria-hidden="true" />
                      </div>
                      <h2 className="text-[15px] font-bold text-foreground uppercase tracking-wider">
                        {displayCategory}
                      </h2>
                    </div>
                    <div
                      className="h-px flex-1 bg-gradient-to-r from-border/40 to-transparent"
                      aria-hidden="true"
                    />
                  </div>

                  {/* Cards grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((area) => {
                      const displayName = area.name || titleCase(area.slug);
                      const AreaIcon = resolveLucideIcon(area.icon);

                      return (
                        <div
                          key={area.id}
                          className="group relative flex flex-col rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5 hover:border-primary/40"
                        >
                          {/* Icon badge */}
                          <div className="flex items-center justify-center size-10 rounded-xl bg-brand-gradient text-white shadow-brand mb-4 shrink-0">
                            <AreaIcon className="size-5" aria-hidden="true" />
                          </div>

                          {/* Name */}
                          <h3 className="text-[16px] font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                            {displayName}
                          </h3>

                          {/* Description */}
                          {area.description && (
                            <p className="text-[13px] text-muted-foreground flex-1 leading-relaxed line-clamp-3 mb-3">
                              {area.description}
                            </p>
                          )}

                          {/* Technology count */}
                          {area.technologies.length > 0 && (
                            <p className="text-[12px] text-muted-foreground mb-3">
                              {t("listing.card.technologies", {
                                count: area.technologies.length,
                                plural:
                                  area.technologies.length !== 1 ? "ies" : "y",
                              })}
                            </p>
                          )}

                          {/* Explore link */}
                          <Link
                            href={`/tech-expertise/${area.slug}` as any}
                            className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline mt-auto"
                          >
                            {t("listing.card.explore")}
                            <ArrowUpRight
                              className="size-3.5 rtl:rotate-180"
                              aria-hidden="true"
                            />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </>
        )}

        {/* ── Bottom CTA ── */}
        <section className="mt-8 relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-8 sm:p-10 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#0ab8fb]/5 via-transparent to-[#324b9d]/5"
          />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
            <Sparkles className="size-3" aria-hidden="true" />
            {t("listing.cta.eyebrow")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {t("listing.cta.title")}
          </h2>
          <p className="text-[14px] text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            {t("listing.cta.description")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-brand-gradient shadow-brand"
            >
              <Link href="/crm/quote">
                {t("listing.cta.quote")}
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
              <Link href="/crm/book-a-call">{t("listing.cta.booking")}</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
