"use client";

// app/[locale]/(routes)/services/_components/ServicesClientPage.tsx
//
// Redesigned services listing page.
// — Fixes the broken-image bug: `getMediaUrl()` was being applied to URLs
//   that are already absolute (http://127.0.0.1:8001/media/...), and
//   next/image requires the source host to be allow-listed in
//   next.config.js or it silently fails to render. Both are handled below
//   via `resolveMediaUrl()` + a plain <img> with a real error fallback.
// — Every icon is lucide-react. No emoji, no text glyphs.
// — Shares the "spec-sheet" structural language from the service detail
//   page (monospace numbered eyebrows + blueprint grid) for consistency.

import {
  useState,
  useTransition,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
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
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Headset,
  Zap,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  ImageOff,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

import { getMediaUrl } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import type { SupportedLocale } from "@/lib/locale";
import type { ServiceListItem, ServiceCategory } from "@/lib/automex/types";

import { loadMoreServicesAction } from "../actions";
import { FooterSection } from "@/app/[locale]/_components/Footer/FooterSections";

// ─────────────────────────────────────────────────────────────────────────
// Media URL resolver — the actual fix for the "images not showing" bug.
// The API already returns fully-qualified URLs for media assets
// (http://127.0.0.1:8001/media/...). Only relative paths should ever be
// passed through getMediaUrl(); absolute URLs are returned as-is.
// ─────────────────────────────────────────────────────────────────────────

function resolveMediaUrl(url?: string | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return getMediaUrl(url);
}

// ─────────────────────────────────────────────────────────────────────────
// Icon mapping
// ─────────────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  cpu: Cpu,
  "brain-circuit": BrainCircuit,
  bot: BrainCircuit,
  database: Database,
  cloud: Cloud,
  palette: Palette,
  users: Users,
  server: Server,
  "code-2": Cpu,
  code2: Cpu,
};

function resolveIcon(icon?: string): LucideIcon {
  if (!icon) return Sparkles;
  return ICON_MAP[icon.replace(/^lucide:/, "")] ?? Sparkles;
}

// ─────────────────────────────────────────────────────────────────────────
// Image with graceful fallback — plain <img> (no next/image host
// allow-listing required) that swaps to a lucide icon tile if the URL is
// missing or fails to load, instead of showing a broken image / nothing.
// ─────────────────────────────────────────────────────────────────────────

function MediaImage({
  src,
  alt,
  fallbackIcon: FallbackIcon,
  className,
  imgClassName,
}: {
  src?: string | null;
  alt: string;
  fallbackIcon: LucideIcon;
  className?: string;
  imgClassName?: string;
}) {
  const resolved = resolveMediaUrl(src);
  const [errored, setErrored] = useState(false);

  if (!resolved || errored) {
    return (
      <div
        className={cn(
          "flex size-full items-center justify-center bg-linear-to-br from-primary/10 via-primary/5 to-transparent",
          className,
        )}
      >
        <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-gradient/10">
          <FallbackIcon className="size-7 text-primary/50" aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className={cn("size-full object-cover", imgClassName)}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Shared structural device — same spec-sheet breadcrumb as the detail page
// ─────────────────────────────────────────────────────────────────────────

function SectionEyebrow({
  icon: Icon,
  label,
  className,
}: {
  icon: LucideIcon;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary/80",
        className,
      )}
    >
      <Icon className="size-3" aria-hidden="true" />
      {label}
    </span>
  );
}

function BlueprintGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      style={{
        backgroundImage:
          "radial-gradient(circle, currentColor 1px, transparent 1px)",
        backgroundSize: "22px 22px",
        color: "var(--border)",
        opacity: 0.35,
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Service Card Skeleton
// ─────────────────────────────────────────────────────────────────────────

function ServiceCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border/30 bg-card/60 backdrop-blur-sm overflow-hidden animate-pulse">
      <div className="h-48 w-full bg-muted/60" />
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-muted/60" />
          <div className="h-3 w-20 rounded-full bg-muted/60" />
        </div>
        <div className="h-5 w-3/4 rounded-lg bg-muted/60" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded-lg bg-muted/60" />
          <div className="h-3 w-2/3 rounded-lg bg-muted/60" />
        </div>
        <div className="flex items-center gap-2 mt-2 pt-3 border-t border-border/20">
          <div className="h-9 flex-1 rounded-lg bg-muted/60" />
          <div className="size-9 rounded-lg bg-muted/60" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────

interface ServicesClientPageProps {
  initialServices: ServiceListItem[];
  hasMoreInitial: boolean;
  categories: ServiceCategory[];
  activeCategory?: string;
  totalCount: number;
}

const TRUST_ITEMS = [
  { icon: ShieldCheck, labelKey: "trust.enterpriseSecurity" },
  { icon: Clock, labelKey: "trust.onTimeDelivery" },
  { icon: Headset, labelKey: "trust.dedicatedSupport" },
  { icon: Zap, labelKey: "trust.aiPowered" },
];

// ─────────────────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────────────────

function useCountUp(
  target: number,
  duration: number = 1500,
  shouldStart: boolean = true,
): number {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldStart) return;
    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const progress = Math.min(
        (timestamp - startTimeRef.current) / duration,
        1,
      );
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      startTimeRef.current = null;
    };
  }, [target, duration, shouldStart]);

  return count;
}

function useIntersectionObserver(
  ref: React.RefObject<HTMLElement | null>,
  threshold: number = 0.1,
): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return isVisible;
}

// ─────────────────────────────────────────────────────────────────────────
// Featured Services Carousel — uses hero_image (cover image)
// ─────────────────────────────────────────────────────────────────────────

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

  useEffect(() => {
    if (isHovered || totalSlides <= 1) return;
    timerRef.current = setInterval(next, 5500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, next, totalSlides]);

  if (totalSlides === 0) return null;

  const service = services[current];
  const Icon = resolveIcon(service.icon);
  const imageSrc =
    service.hero_image?.url || service.thumbnail_image?.url || null;
  const imageAlt = service.hero_image?.alt_text || service.name;

  return (
    <section
      className="relative w-full overflow-hidden rounded-2xl border border-border/30 bg-card/60 backdrop-blur-sm shadow-lg mb-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-21/9 sm:aspect-21/7 bg-muted/30">
        <div className="absolute inset-0 overflow-hidden">
          <MediaImage
            src={imageSrc}
            alt={imageAlt}
            fallbackIcon={Icon}
            imgClassName={cn(
              "transition-transform duration-700",
              isHovered ? "scale-105" : "scale-100",
            )}
          />
        </div>

        <div className="absolute inset-0 bg-linear-to-t from-background/95 via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-background/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-2xl">
            <div className="flex-wrap items-center gap-2 mb-3 hidden md:flex">
              {service.category && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                  <Icon className="size-3" aria-hidden="true" />
                  {service.category.name}
                </span>
              )}
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
              className="hidden md:block text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
            >
              {service.name}
            </h2>

            <p className="hidden md:block text-[14px] sm:text-[15px] text-white/80 mb-4 line-clamp-2 leading-relaxed">
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

        {totalSlides > 1 && (
          <div className="absolute top-3 right-3 z-10 rounded-full bg-black/30 px-2.5 py-1 font-mono text-[11px] text-white/70 backdrop-blur-sm">
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(totalSlides).padStart(2, "0")}
          </div>
        )}

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

        {totalSlides > 1 && (
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
            {services.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={cn(
                  "cursor-pointer rounded-full transition-all duration-300 h-1.5",
                  i === current
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/80",
                )}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {totalSlides > 1 && (
          <div className="absolute bottom-0 left-0 right-0 z-10 h-0.5 bg-white/20">
            <div
              key={current}
              className="h-full bg-white/60"
              style={{
                width: isHovered
                  ? `${((current + 1) / totalSlides) * 100}%`
                  : "100%",
                animation: isHovered
                  ? "none"
                  : "carousel-progress 5.5s linear forwards",
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Category filters with horizontal scroll
// ─────────────────────────────────────────────────────────────────────────

function CategoryFilters({
  categories,
  activeCategory,
  t,
  totalCount,
}: {
  categories: ServiceCategory[];
  activeCategory?: string;
  t: ReturnType<typeof useTranslations>;
  totalCount: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 flex size-8 items-center justify-center rounded-full bg-background/80 shadow-md border border-border/30 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <ChevronLeft className="size-4 rtl:rotate-180" />
        </button>
      )}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <Link
          href={{ pathname: "/services" }}
          className={cn(
            "shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200 whitespace-nowrap",
            !activeCategory
              ? "bg-brand-gradient text-brand-foreground shadow-brand"
              : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/60",
          )}
        >
          <LayoutGrid className="size-3.5" aria-hidden="true" />
          {t("filters.all")}
          <span className="text-[10px] opacity-60">({totalCount})</span>
        </Link>
        {categories.map((cat) => {
          const CatIcon = resolveIcon(cat.icon);
          return (
            <Link
              key={cat.id}
              href={{ pathname: "/services", query: { category: cat.slug } }}
              className={cn(
                "shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200 whitespace-nowrap",
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
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 flex size-8 items-center justify-center rounded-full bg-background/80 shadow-md border border-border/30 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <ChevronRight className="size-4 rtl:rotate-180" />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────

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
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const statsVisible = useIntersectionObserver(statsRef, 0.1);

  const displayedCount = useCountUp(totalCount, 1200, statsVisible);
  const categoriesCount = useCountUp(categories.length, 1000, statsVisible);
  const projectsCount = useCountUp(150, 1000, statsVisible);
  const satisfactionCount = useCountUp(98, 1000, statsVisible);

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return services;
    const query = searchQuery.toLowerCase().trim();
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.short_description.toLowerCase().includes(query) ||
        s.category?.name.toLowerCase().includes(query) ||
        false,
    );
  }, [services, searchQuery]);

  const featuredServices = filteredServices.filter((s) => s.is_featured);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

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
    setIsLoadingMore(false);
  }, [activeCategory, hasMore, isLoadingMore, locale, page]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !isLoadingMore && !isPending) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isPending, handleLoadMore]);

  useEffect(() => {
    setSearchQuery("");
  }, [activeCategory]);

  const showSearch = services.length > 0;

  return (
    <div className="relative overflow-hidden mt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-24 right-0 size-112.5 rounded-full bg-primary/4 blur-3xl" />
        <div className="absolute top-1/3 -left-32 size-87.5 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 size-75 rounded-full bg-primary/3 blur-3xl -translate-x-1/2" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:pb-24">
        {/* ═══ FEATURED SERVICES CAROUSEL ═══ */}
        {featuredServices.length > 0 && (
          <div className="animate-in fade-up duration-700">
            <FeaturedServicesCarousel services={featuredServices} t={t} />
          </div>
        )}

        {/* ═══ STATS BAR ═══ */}
        <div ref={statsRef}>
          <section className="mb-10 sm:mb-14">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl border border-border/20 bg-card/40 backdrop-blur-sm p-5 text-center transition-all hover:border-primary/30 hover:shadow-sm animate-in fade-up duration-500 delay-100">
                <span className="text-2xl sm:text-3xl font-bold text-brand-gradient">
                  {statsVisible ? displayedCount : 0}+
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("stats.services")}
                </p>
              </div>
              <div className="rounded-xl border border-border/20 bg-card/40 backdrop-blur-sm p-5 text-center transition-all hover:border-primary/30 hover:shadow-sm animate-in fade-up duration-500 delay-200">
                <span className="text-2xl sm:text-3xl font-bold text-brand-gradient">
                  {statsVisible ? categoriesCount : 0}+
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("stats.categories")}
                </p>
              </div>
              <div className="rounded-xl border border-border/20 bg-card/40 backdrop-blur-sm p-5 text-center transition-all hover:border-primary/30 hover:shadow-sm animate-in fade-up duration-500 delay-300">
                <span className="text-2xl sm:text-3xl font-bold text-brand-gradient">
                  {statsVisible ? satisfactionCount : 0}%
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("stats.clientSatisfaction")}
                </p>
              </div>
              <div className="rounded-xl border border-border/20 bg-card/40 backdrop-blur-sm p-5 text-center transition-all hover:border-primary/30 hover:shadow-sm animate-in fade-up duration-500 delay-400">
                <span className="text-2xl sm:text-3xl font-bold text-brand-gradient">
                  {statsVisible ? projectsCount : 0}+
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("stats.projectsDelivered")}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ═══ CATEGORY FILTERS ═══ */}
        {categories.length > 0 && (
          <div className="mb-8 animate-in fade-up duration-500 delay-200">
            <CategoryFilters
              categories={categories}
              activeCategory={activeCategory}
              t={t}
              totalCount={totalCount}
            />
          </div>
        )}

        {filteredServices.length === 0 ? (
          <div className="text-center py-20 animate-in fade-up duration-500">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground/50">
              {searchQuery ? (
                <Search className="size-6" aria-hidden="true" />
              ) : (
                <ImageOff className="size-6" aria-hidden="true" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? t("emptySearch", { query: searchQuery })
                : t("empty")}
            </p>
          </div>
        ) : (
          <>
            {/* ═══ SERVICE CARDS GRID — thumbnail_image first, hero_image fallback ═══ */}
            <div
              ref={cardsRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredServices.map((service, index) => {
                const Icon = resolveIcon(service.icon);
                const imageSrc =
                  service.thumbnail_image?.url ||
                  service.hero_image?.url ||
                  null;
                const imageAlt =
                  service.thumbnail_image?.alt_text ||
                  service.hero_image?.alt_text ||
                  service.name;
                const detailUrl = `/services/${service.slug}` as `/${string}`;

                return (
                  <article
                    key={service.id}
                    className="group relative flex flex-col rounded-2xl border border-border/30 bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 animate-in fade-up"
                    style={{ animationDelay: `${(index % 6) * 80}ms` }}
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <MediaImage
                        src={imageSrc}
                        alt={imageAlt}
                        fallbackIcon={Icon}
                        imgClassName="transition-transform duration-500 group-hover:scale-105"
                      />

                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-card/90 via-card/40 to-transparent"
                      />

                      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                        {service.is_featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-brand-gradient text-brand-foreground text-[11px] font-semibold px-2.5 py-1 shadow-brand">
                            <Sparkles className="size-3" aria-hidden="true" />
                            {t("featuredBadge")}
                          </span>
                        )}
                        {service.is_enterprise && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#324b9d]/80 text-white text-[11px] font-semibold px-2.5 py-1 shadow-sm">
                            <ShieldCheck
                              className="size-3"
                              aria-hidden="true"
                            />
                            Enterprise
                          </span>
                        )}
                      </div>

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

                    <div className="flex flex-col flex-1 p-5 gap-2">
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

                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                        {service.starting_price && (
                          <>
                            <span className="font-semibold text-foreground">
                              ${Number(service.starting_price).toLocaleString()}
                            </span>
                            <span className="text-muted-foreground/60">•</span>
                          </>
                        )}
                        {service.pricing_model_display && (
                          <span>{service.pricing_model_display}</span>
                        )}
                      </div>

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

            {hasMore && (
              <>
                <div ref={sentinelRef} className="h-1" />
                <div className="flex justify-center mt-12">
                  {isLoadingMore || isPending ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                      {[1, 2, 3].map((i) => (
                        <ServiceCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={handleLoadMore}
                      disabled={isPending}
                      className="group relative inline-flex min-w-40 cursor-pointer items-center justify-center gap-2 rounded-full border border-brand-gradient bg-background/80 px-8 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-muted/30 hover:shadow-lg disabled:opacity-60"
                    >
                      {t("loadMore")}
                      <span className="absolute inset-0 rounded-full bg-brand-gradient opacity-0 blur-xl transition-opacity group-hover:opacity-20" />
                    </button>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* ═══ TRUST SECTION ═══ */}
        <section className="mt-16 sm:mt-20">
          <div className="relative rounded-2xl border border-border/20 bg-brand-soft/40 p-6 sm:p-8 backdrop-blur-sm overflow-hidden">
            <BlueprintGrid />
            <div className="text-center mb-6">
              <SectionEyebrow
                icon={ShieldCheck}
                label={t("trust.whyAutomex")}
                className="bg-background/60 border-transparent"
              />
              <h2 className="mt-2 text-xl font-bold text-foreground">
                {t("trust.headline")}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TRUST_ITEMS.map((item, idx) => (
                <div
                  key={item.labelKey}
                  className="flex items-start gap-3 rounded-xl border border-border/20 bg-card/40 backdrop-blur-sm p-4 transition-all hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-sm animate-in fade-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
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

        {/* ═══ BOTTOM CTA ═══ */}
        <section className="mt-12 sm:mt-16 relative overflow-hidden rounded-2xl border border-border/20 bg-brand-soft/40 p-8 sm:p-10 text-center backdrop-blur-sm">
          <BlueprintGrid />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-linear-to-br from-primary/5 via-transparent to-accent/5"
            style={{
              backgroundSize: "200% 200%",
              animation: "gradient-shift 8s ease-in-out infinite alternate",
            }}
          />

          <SectionEyebrow
            icon={Sparkles}
            label={t("letsBuild")}
            className="mb-4 bg-background/60 border-transparent"
          />

          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {t("bottomCta.title")}
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            {t("bottomCta.description")}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/crm/quote"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-brand transition-all hover:opacity-90 hover:scale-105"
            >
              {t("bottomCta.ctaQuote")}
              <ArrowRight
                className="size-4 rtl:rotate-180"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/crm/book-a-call"
              className="inline-flex items-center gap-2 rounded-lg border border-brand-gradient bg-transparent px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted/30 hover:scale-105"
            >
              {t("bottomCta.ctaBooking")}
            </Link>
          </div>
        </section>
      </div>
      <FooterSection />
    </div>
  );
}
