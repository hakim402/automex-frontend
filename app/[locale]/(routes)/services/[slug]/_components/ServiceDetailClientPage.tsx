"use client";

// app/[locale]/(routes)/services/[slug]/_components/ServiceDetailClientPage.tsx
//
// Redesigned service detail page.
// — Every icon is a lucide-react component. No emoji, no text glyphs (✓ / ✕ / 💻 etc).
// — Hero has two fully designed states: multi-image carousel, and a no-image
//   "spec card" fallback. On mobile, the compact thumbnail+text hero is always used.
// — Every section shares one structural device: a terminal-style breadcrumb
//   ("// 04 · STACK") pairing a lucide icon with a numbered eyebrow, so the page
//   reads like a spec sheet — appropriate for a custom-software-development brand.

import { useState, useEffect, useCallback, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getMediaUrl } from "@/lib/env";
import {
  CheckCircle2,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowUpRight,
  FileText,
  PhoneCall,
  Clock,
  ShieldCheck,
  Users,
  DollarSign,
  BarChart3,
  Star,
  Download,
  ExternalLink,
  Send,
  Sparkles,
  Pause,
  Play,
  Code2,
  Server,
  Database,
  Cloud,
  Cpu,
  Brain,
  Terminal,
  Smartphone,
  Monitor,
  Globe,
  Layout,
  Component,
  FileCode,
  Workflow,
  Box,
  Building2,
  Car,
  GitBranch,
  BookOpen,
  FlaskConical,
  ClipboardList,
  Timer,
  Lock,
  Search,
  PenLine,
  Settings2,
  Rocket,
  Target,
  Mail,
  CalendarDays,
  Puzzle,
  Zap,
  Heart,
  Eye,
  Megaphone,
  Wrench,
  Palette,
  Quote,
  Layers,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import type {
  ServiceDetailFull,
  ServiceListItem,
  ServiceListItemRef,
} from "@/lib/automex/types";
import type {
  ServiceHeroImage,
  ServiceProcessStep,
  ServiceDeliverable,
  ServiceAddOn,
  ServiceComparisonRow,
  ServiceClientLogo,
  ServiceTestimonialSub,
  ServiceDocument,
  ServiceSLA,
  ServiceFAQSub,
} from "@/lib/automex/types";
import { FooterSection } from "@/app/[locale]/_components/Footer/FooterSections";

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────

function asArr<T>(val: unknown): T[] {
  if (Array.isArray(val)) return val as T[];
  return [];
}

/** Check whether an icon string looks like a URL / image path. */
function isImageUrl(icon?: string): boolean {
  if (!icon) return false;
  return (
    /^(https?:\/\/|\/media\/|\/uploads\/)/i.test(icon) ||
    /\.(png|jpe?g|gif|svg|webp|ico)(\?.*)?$/i.test(icon)
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Icon system — lucide only. Every name coming from the API (icon strings
// like "lucide:code-2") resolves to a real lucide component. Nothing here
// ever falls back to an emoji or a text glyph.
// ─────────────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  search: Search,
  code: Code2,
  "code-2": Code2,
  code2: Code2,
  rocket: Rocket,
  lightbulb: Sparkles,
  gear: Settings2,
  settings: Settings2,
  target: Target,
  chart: BarChart3,
  "bar-chart": BarChart3,
  "bar-chart-3": BarChart3,
  mail: Mail,
  calendar: CalendarDays,
  puzzle: Puzzle,
  zap: Zap,
  heart: Heart,
  eye: Eye,
  megaphone: Megaphone,
  wrench: Wrench,
  palette: Palette,
  shield: ShieldCheck,
  "shield-check": ShieldCheck,
  users: Users,
  clock: Clock,
  star: Star,
  "file-text": FileText,
  download: Download,
  "dollar-sign": DollarSign,
  check: CheckCircle2,
  "check-circle": CheckCircle2,
  "check-circle-2": CheckCircle2,
  "arrow-right": ArrowRight,
  "external-link": ExternalLink,
  send: Send,
  sparkles: Sparkles,
  brain: Brain,
  cpu: Cpu,
  server: Server,
  database: Database,
  cloud: Cloud,
  terminal: Terminal,
  smartphone: Smartphone,
  monitor: Monitor,
  globe: Globe,
  layout: Layout,
  component: Component,
  "file-code": FileCode,
  workflow: Workflow,
  box: Box,
  "building-2": Building2,
  "git-branch": GitBranch,
  "book-open": BookOpen,
  "test-tubes": FlaskConical,
  "clipboard-list": ClipboardList,
  timer: Timer,
  lock: Lock,
  "brain-circuit": Brain,
  "cloud-cog": Cloud,
  layers: Layers,
};

/** Resolve an icon name (optionally "lucide:" prefixed) to a lucide component. Always lucide, never emoji. */
function resolveIcon(name?: string | null): LucideIcon {
  if (!name) return Sparkles;
  const key = name
    .replace(/^lucide:/i, "")
    .toLowerCase()
    .trim();
  return ICON_MAP[key] ?? Sparkles;
}

/** Render a lucide icon node for a given icon name. */
function iconFor(name: string | undefined | null, size: string = "size-4") {
  const Icon = resolveIcon(name);
  return <Icon className={size} aria-hidden="true" />;
}

// ─────────────────────────────────────────────────────────────────────────
// Technology rendering (image > lucide icon > slug fallback)
// ─────────────────────────────────────────────────────────────────────────

function renderTechnology(t: {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  category?: string;
  website_url?: string;
}) {
  const size = "size-4";

  const chipClasses =
    "inline-flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-2.5 py-1.5 text-[12px] text-foreground/80 hover:border-primary/40 hover:bg-muted/50 transition-colors";

  let content: React.ReactNode;

  if (isImageUrl(t.icon)) {
    content = (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={t.icon!} alt={t.name} className="size-4 object-contain" />
        {t.name}
      </>
    );
  } else if (t.icon) {
    content = (
      <>
        {iconFor(t.icon, size)}
        {t.name}
      </>
    );
  } else {
    const LucideIcon = techLucideIcon(t.slug, t.category);
    content = (
      <>
        <LucideIcon className={size} aria-hidden="true" />
        {t.name}
      </>
    );
  }

  if (t.website_url) {
    return (
      <a
        key={t.id}
        href={t.website_url}
        target="_blank"
        rel="noopener noreferrer"
        className={chipClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <span key={t.id} className={chipClasses}>
      {content}
    </span>
  );
}

const TECH_ICON_MAP: Record<string, LucideIcon> = {
  python: Terminal,
  javascript: FileCode,
  typescript: FileCode,
  go: Terminal,
  rust: Terminal,
  java: FileCode,
  csharp: FileCode,
  php: FileCode,
  ruby: Terminal,
  kotlin: Smartphone,
  swift: Smartphone,
  dart: Code2,
  elixir: Terminal,
  scala: FileCode,
  c: Terminal,
  cpp: Terminal,
  "c++": Terminal,
  r: BarChart3,
  matlab: BarChart3,
  react: Component,
  angular: Component,
  vue: Component,
  svelte: Component,
  nextjs: Layout,
  next: Layout,
  nuxt: Layout,
  tailwindcss: Layout,
  tailwind: Layout,
  bootstrap: Layout,
  webpack: Box,
  vite: Box,
  redux: Box,
  zustand: Box,
  gatsby: Layout,
  astro: Layout,
  remix: Layout,
  django: Server,
  "django-drf": Server,
  express: Server,
  flask: Server,
  fastapi: Server,
  spring: Server,
  laravel: Server,
  rails: Server,
  graphql: Globe,
  rest: Globe,
  nodejs: Server,
  node: Server,
  "node.js": Server,
  nestjs: Server,
  dotnet: Server,
  ".net": Server,
  postgresql: Database,
  postgres: Database,
  mysql: Database,
  mongodb: Database,
  redis: Database,
  sqlite: Database,
  elasticsearch: Database,
  firebase: Database,
  supabase: Database,
  prisma: Database,
  aws: Cloud,
  gcp: Cloud,
  azure: Cloud,
  vercel: Cloud,
  netlify: Cloud,
  cloudflare: Cloud,
  digitalocean: Cloud,
  docker: Box,
  kubernetes: Workflow,
  k8s: Workflow,
  jenkins: Workflow,
  terraform: Workflow,
  ansible: Workflow,
  github: Globe,
  gitlab: Globe,
  nginx: Server,
  prometheus: BarChart3,
  grafana: BarChart3,
  datadog: BarChart3,
  sentry: ShieldCheck,
  tensorflow: Brain,
  pytorch: Brain,
  openai: Brain,
  langchain: Brain,
  huggingface: Brain,
  pandas: Brain,
  numpy: Brain,
  flutter: Smartphone,
  "react-native": Smartphone,
  expo: Smartphone,
  salesforce: Building2,
  sap: Building2,
  oracle: Database,
  jest: ShieldCheck,
  cypress: ShieldCheck,
  playwright: ShieldCheck,
  vitest: ShieldCheck,
  linux: Terminal,
  git: Globe,
  figma: Layout,
  solidity: FileCode,
  web3: Globe,
  ethereum: Globe,
};

const TECH_CATEGORY_ICON: Record<string, LucideIcon> = {
  frontend: Layout,
  backend: Server,
  database: Database,
  cloud: Cloud,
  ai: Brain,
  enterprise: Building2,
  mobile: Smartphone,
  devops: Workflow,
  other: Code2,
};

function techLucideIcon(slug: string, category?: string): LucideIcon {
  const key = slug.toLowerCase().replace(/[^a-z0-9.+]/g, "");
  const keyNoDot = key.replace(/\./g, "");
  const keyNoDash = key.replace(/-/g, "");
  const match =
    TECH_ICON_MAP[key] ?? TECH_ICON_MAP[keyNoDot] ?? TECH_ICON_MAP[keyNoDash];
  if (match) return match;
  return TECH_CATEGORY_ICON[category ?? ""] ?? Code2;
}

// ─────────────────────────────────────────────────────────────────────────
// Industry rendering (image > lucide icon name > slug fallback)
// ─────────────────────────────────────────────────────────────────────────

const INDUSTRY_ICON_MAP: Record<string, LucideIcon> = {
  healthcare: Building2,
  medical: Building2,
  hospital: Building2,
  finance: DollarSign,
  banking: DollarSign,
  fintech: DollarSign,
  insurance: ShieldCheck,
  realestate: Building2,
  "real-estate": Building2,
  retail: Building2,
  ecommerce: Building2,
  "e-commerce": Building2,
  education: BookOpen,
  edtech: BookOpen,
  logistics: Box,
  transportation: Box,
  supplychain: Box,
  "supply-chain": Box,
  manufacturing: Box,
  automotive: Car,
  energy: Cloud,
  agriculture: Building2,
  construction: Building2,
  telecom: Smartphone,
  telecommunications: Smartphone,
  media: Monitor,
  entertainment: Monitor,
  gaming: Monitor,
  sports: Monitor,
  travel: Globe,
  hospitality: Building2,
  tourism: Globe,
  food: Building2,
  restaurant: Building2,
  legal: ShieldCheck,
  government: Building2,
  nonprofit: Heart,
  ngo: Heart,
  saas: Cloud,
  paas: Cloud,
  iaas: Cloud,
  cybersecurity: ShieldCheck,
  blockchain: Globe,
  crypto: Globe,
  defi: Globe,
  marketing: BarChart3,
  advertising: BarChart3,
  hr: Users,
  humanresources: Users,
  "human-resources": Users,
  recruitment: Users,
  consulting: Building2,
  pharmaceutical: Building2,
  biotech: FlaskConical,
  aviation: Cloud,
  aerospace: Cloud,
  defense: ShieldCheck,
  maritime: Cloud,
  mining: Box,
};

function industryIcon(slug: string): LucideIcon {
  const key = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
  const keyNoDash = key.replace(/-/g, "");
  return INDUSTRY_ICON_MAP[key] ?? INDUSTRY_ICON_MAP[keyNoDash] ?? Building2;
}

function renderIndustryIcon(
  ind: { id: string; name: string; slug: string; icon?: string },
  size: string = "size-6",
) {
  if (isImageUrl(ind.icon)) {
    return (
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-muted/30 ring-1 ring-border/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ind.icon!}
          alt={ind.name}
          className="size-full object-contain p-1.5"
        />
      </div>
    );
  }

  const Icon = ind.icon ? resolveIcon(ind.icon) : industryIcon(ind.slug);
  return (
    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient/10 text-primary ring-1 ring-primary/10">
      <Icon className={size} aria-hidden="true" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Shared structural device — spec-sheet breadcrumb section header.
// Every section on the page is labelled the same way: a monospace,
// numbered "// 0N · LABEL" tag with an icon, then the real heading.
// This mirrors how the subject itself (custom software) is organised —
// numbered, labelled, versioned — rather than being decoration.
// ─────────────────────────────────────────────────────────────────────────

function SectionHeader({
  index,
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  index: number;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="inline-flex items-center gap-2 rounded-md border border-border/50 bg-muted/40 px-2.5 py-1 mb-3">
        <Icon className="size-3.5 text-primary" aria-hidden="true" />
        <span className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground">
          {`// ${String(index).padStart(2, "0")} · ${eyebrow.toUpperCase()}`}
        </span>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-[13px] sm:text-[14px] text-muted-foreground mt-1.5 max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}

/** Faint blueprint dot-grid, used as an ambient backdrop behind hero states. */
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
        opacity: 0.4,
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Hero Carousel (desktop, when hero_images exist)
// ─────────────────────────────────────────────────────────────────────────

function HeroCarousel({
  images,
  service,
}: {
  images: ServiceHeroImage[];
  service: ServiceDetailFull;
}) {
  const t = useTranslations("ServicesDetail");
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, images.length]);

  const goTo = useCallback((idx: number) => setCurrent(idx), []);
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + images.length) % images.length),
    [images.length],
  );
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % images.length),
    [images.length],
  );

  const currentImage = images[current];
  const isCover = currentImage?.is_cover;
  const CategoryIcon = resolveIcon(service.category?.icon);

  return (
    <section className="relative mx-auto max-w-full mt-6 mb-10 sm:mb-14 px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 -z-10"
      >
        <div className="absolute -top-10 -left-10 size-64 rounded-full bg-[#0ab8fb]/10 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-10 -right-10 size-72 rounded-full bg-[#324b9d]/10 blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/20"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative h-105 sm:h-130 md:h-140">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className={cn(
                "absolute inset-0 transition-all duration-1000 ease-out",
                idx === current
                  ? "opacity-100 z-0 scale-100"
                  : "opacity-0 z-0 scale-110",
              )}
            >
              {img.image?.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getMediaUrl(img.image.url)}
                  alt={img.caption || service.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          ))}

          <div
            aria-hidden="true"
            className="absolute inset-0 z-1"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.05) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/60 to-transparent z-1"
          />

          <div className="absolute inset-0 flex items-center z-2">
            <div className="px-6 sm:px-10 lg:px-14 max-w-xl space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                {service.category && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                    <CategoryIcon className="size-3" aria-hidden="true" />
                    {service.category.name}
                  </span>
                )}
                {isCover && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-2.5 py-1 text-[11px] font-semibold text-white">
                    <Star className="size-3 fill-white" aria-hidden="true" />
                    {t("cover")}
                  </span>
                )}
                {service.service_level_display && (
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md",
                      service.service_level === "enterprise"
                        ? "bg-[#324b9d]/40 text-white border border-[#324b9d]/30"
                        : service.service_level === "premium"
                          ? "bg-[#13a89e]/40 text-white border border-[#13a89e]/30"
                          : "bg-white/10 text-white border border-white/20",
                    )}
                  >
                    {service.service_level_display}
                  </span>
                )}
                {service.is_featured && !isCover && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/30 text-white border border-amber-500/30 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md">
                    <Star className="size-3" aria-hidden="true" />
                    {t("featured")}
                  </span>
                )}
              </div>

              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight"
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
              >
                {currentImage?.title || service.name}
              </h1>

              <div className="flex flex-wrap gap-3 pt-1">
                <Button
                  asChild
                  size="lg"
                  className="bg-brand-gradient shadow-brand shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  <Link
                    href={
                      {
                        pathname: service.cta_url || "/crm/quote",
                        query: { service: service.id },
                      } as any
                    }
                  >
                    {t("getQuote")}
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
                  className="border-white/30 text-black hover:bg-white/10 hover:text-white backdrop-blur-md"
                >
                  <Link href="/crm/book-a-call">
                    <PhoneCall
                      className="size-4 mr-1.5 rtl:ml-1.5 rtl:mr-0"
                      aria-hidden="true"
                    />
                    {t("bookFreeCall")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {images.length > 1 && (
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 font-mono text-[11px] text-white/70 bg-black/30 backdrop-blur-md rounded-full px-3 py-1 border border-white/10">
              {String(current + 1).padStart(2, "0")} /{" "}
              {String(images.length).padStart(2, "0")}
            </div>
          )}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex size-12 items-center justify-center rounded-full bg-black/25 backdrop-blur-md text-white hover:bg-black/45 transition-all border border-white/10 hover:scale-110"
              aria-label={t("previousSlide")}
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex size-12 items-center justify-center rounded-full bg-black/25 backdrop-blur-md text-white hover:bg-black/45 transition-all border border-white/10 hover:scale-110"
              aria-label={t("nextSlide")}
            >
              <ChevronRight className="size-5" />
            </button>

            {/* Segmented progress bar — reads as a load/playback indicator, not decorative dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 overflow-hidden bg-white/25",
                    idx === current ? "w-10" : "w-4 hover:bg-white/45",
                  )}
                  aria-label={t("goToSlide", { n: idx + 1 })}
                >
                  {idx === current && !isPaused && (
                    <span
                      key={current}
                      className="block h-full bg-white rounded-full"
                      style={{
                        animation: "hero-progress 5.5s linear forwards",
                      }}
                    />
                  )}
                  {idx === current && isPaused && (
                    <span className="block h-full w-full bg-white rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsPaused((p) => !p)}
              className="absolute bottom-4.5 right-5 z-30 flex size-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/50 transition-colors border border-white/10"
              aria-label={isPaused ? t("resumeSlideshow") : t("pauseSlideshow")}
            >
              {isPaused ? (
                <Play className="size-3.5" />
              ) : (
                <Pause className="size-3.5" />
              )}
            </button>
          </>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Scroll Carousel (smooth horizontal scroll + arrows)
// ─────────────────────────────────────────────────────────────────────────

function ScrollCarousel({
  children,
  className,
  gap = "gap-4",
}: {
  children: React.ReactNode;
  className?: string;
  gap?: string;
}) {
  const t = useTranslations("ServicesDetail");
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
    const amount = el.clientWidth * 0.75;
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className={cn("relative group/carousel", className)}>
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 flex size-9 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm border border-border/50 shadow-md text-foreground/70 hover:text-foreground hover:bg-card transition-all opacity-0 group-hover/carousel:opacity-100"
          aria-label={t("scrollLeft")}
        >
          <ChevronLeft className="size-4 rtl:rotate-180" />
        </button>
      )}

      <div
        ref={scrollRef}
        className={cn(
          "flex overflow-x-auto scroll-smooth snap-x snap-mandatory",
          "[&::-webkit-scrollbar]:hidden",
          gap,
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 flex size-9 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm border border-border/50 shadow-md text-foreground/70 hover:text-foreground hover:bg-card transition-all opacity-0 group-hover/carousel:opacity-100"
          aria-label={t("scrollRight")}
        >
          <ChevronRight className="size-4 rtl:rotate-180" />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Count-up + intersection hooks
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
// Hero Skeleton — used whenever there is no hero image carousel, AND
// always used on mobile (thumbnail + text, image first / text second),
// per spec. Fully lucide, no emoji fallback.
// ─────────────────────────────────────────────────────────────────────────

// ─── Hero Skeleton (image-left/text-right layout) ──────────────────────

function HeroSkeleton({
  service,
  hasThumbnail,
}: {
  service: ServiceDetailFull;
  hasThumbnail: boolean;
}) {
  const t = useTranslations("ServicesDetail");
  const ctaUrl = service.cta_url || "/crm/quote";
  const ServiceIcon = resolveIcon(service.icon);
  const CategoryIcon = resolveIcon(service.category?.icon);

  return (
    <section className="relative mb-16 sm:mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <BlueprintGrid className="rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-center">
        {/* ─── Image / icon panel — always on the LEFT on desktop ─── */}
        <div className="lg:col-span-2 order-1 lg:order-1">
          {hasThumbnail ? (
            <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-lg group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getMediaUrl(service.thumbnail_image!.url)}
                alt={service.thumbnail_image?.alt_text || service.name}
                className="h-64 sm:h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {service.thumbnail_image?.caption && (
                <p className="absolute bottom-3 left-3 right-3 text-[12px] text-white/80 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  {service.thumbnail_image.caption}
                </p>
              )}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute -inset-1 bg-brand-gradient/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"
              />
            </div>
          ) : (
            <div className="relative flex items-center justify-center h-64 sm:h-80 rounded-2xl border border-border/50 bg-linear-to-br from-[#0ab8fb]/10 to-[#324b9d]/10 overflow-hidden group">
              <BlueprintGrid />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-brand-gradient/5 blur-3xl animate-pulse"
              />
              <div className="relative z-10 flex flex-col items-center text-center gap-4">
                <div className="flex size-20 items-center justify-center rounded-2xl bg-card border border-border/60 shadow-sm text-primary transition-transform duration-500 group-hover:scale-105">
                  <ServiceIcon className="size-9" aria-hidden="true" />
                </div>
                <p className="text-[13px] font-medium text-muted-foreground">
                  {service.name}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ─── Text panel — always on the RIGHT on desktop ────────── */}
        <div className="lg:col-span-3 order-2 lg:order-2 space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {service.category && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf]">
                <CategoryIcon className="size-3" aria-hidden="true" />
                {service.category.name}
              </span>
            )}
            {service.service_level_display && (
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider",
                  service.service_level === "enterprise"
                    ? "bg-[#324b9d]/10 text-[#324b9d] border border-[#324b9d]/20"
                    : service.service_level === "premium"
                      ? "bg-[#13a89e]/10 text-[#13a89e] border border-[#13a89e]/20"
                      : "bg-muted text-muted-foreground border border-border/40",
                )}
              >
                {service.service_level_display}
              </span>
            )}
            {service.is_featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2.5 py-1 text-[11px] font-semibold">
                <Star className="size-3" aria-hidden="true" />
                {t("featured")}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {service.name}
          </h1>

          {/* Short description */}
          <p className="text-[15px] sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            {service.short_description}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="bg-brand-gradient shadow-brand hover:shadow-xl transition-all"
            >
              <Link
                href={
                  { pathname: ctaUrl, query: { service: service.id } } as any
                }
              >
                {t("getQuote")}
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
              className="border-brand-gradient hover:border-primary/50 transition-all"
            >
              <Link href="/crm/book-a-call">
                <PhoneCall
                  className="size-4 mr-1.5 rtl:ml-1.5 rtl:mr-0"
                  aria-hidden="true"
                />
                {t("bookFreeCall")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────

interface ServiceDetailClientPageProps {
  service: ServiceDetailFull;
  relatedServices: (ServiceListItem | ServiceListItemRef)[];
}

export function ServiceDetailClientPage({
  service,
  relatedServices,
}: ServiceDetailClientPageProps) {
  const locale = useLocale();
  const t = useTranslations("ServicesDetail");

  const heroImages = service.hero_images;
  const processSteps = service.process_steps;
  const deliverables = service.deliverables;
  const addOns = service.add_ons;
  const comparisonRows = service.comparison_rows;
  const clientLogos = service.client_logos;
  const testimonials = service.service_testimonials;
  const documents = service.documents;
  const slas = service.slas;
  const faqs = service.faqs;
  const relatedSvcs = service.related_services;
  const enterpriseFeatures = service.enterprise_features;
  const keyMetrics = (service.key_metrics ?? {}) as Record<string, number>;

  const hasHeroImages = heroImages.length > 0;
  const hasThumbnail = !!service.thumbnail_image?.url;

  const ctaUrl = service.cta_url || "/crm/quote";

  const publishedDate = service.published_at
    ? new Date(service.published_at).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const [showStickyCta, setShowStickyCta] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const heroBottom = heroRef.current.getBoundingClientRect().bottom;
      const triggerPoint = window.innerHeight * 0.8;
      setShowStickyCta(heroBottom < triggerPoint);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const metricsRef = useRef<HTMLDivElement>(null);
  const metricsVisible = useIntersectionObserver(metricsRef, 0.1);
  const metricKeys = Object.keys(keyMetrics);

  const processRef = useRef<HTMLDivElement>(null);
  const processVisible = useIntersectionObserver(processRef, 0.1);

  const faqCategories = Array.from(
    new Set(faqs.map((f) => f.category).filter(Boolean)),
  );

  // Icons used for process step fallback, in order — fully lucide.
  const stepIconFallback: LucideIcon[] = [Search, PenLine, Settings2, Rocket];

  return (
    <>
      <div className="relative overflow-hidden mt-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-32 right-0 size-125 rounded-full bg-[#0ab8fb]/3 blur-3xl" />
          <div className="absolute top-1/4 -left-40 size-100 rounded-full bg-[#324b9d]/3 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 size-87.5 rounded-full bg-[#13a89e]/3 blur-3xl" />
        </div>

        {/* ─── HERO ─────────────────────────────────────────────────── */}
        {/* Mobile: always the compact thumbnail+text hero (image, then text). */}
        <div className="block md:hidden px-4" ref={heroRef as any}>
          <HeroSkeleton service={service} hasThumbnail={hasThumbnail} />
        </div>

        {/* Desktop: carousel when images exist, otherwise the same spec-card hero. */}
        <div className="hidden md:block">
          {hasHeroImages ? (
            <section ref={heroRef}>
              <HeroCarousel images={heroImages} service={service} />
            </section>
          ) : (
            <div className="px-4" ref={heroRef as any}>
              <HeroSkeleton service={service} hasThumbnail={hasThumbnail} />
            </div>
          )}
        </div>

        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
          {/* Quick info bar */}
          <div className="flex flex-wrap gap-4 text-[13px] mb-16 sm:mb-20 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-150">
            {service.delivery_time_estimate && (
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/60 px-3 py-2">
                <Clock
                  className="size-4 text-primary shrink-0"
                  aria-hidden="true"
                />
                <span className="text-muted-foreground">
                  {t("delivery")}:{" "}
                  <strong className="text-foreground">
                    {service.delivery_time_estimate}
                  </strong>
                </span>
              </div>
            )}
            {service.team_size_range && (
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/60 px-3 py-2">
                <Users
                  className="size-4 text-primary shrink-0"
                  aria-hidden="true"
                />
                <span className="text-muted-foreground">
                  {t("team")}:{" "}
                  <strong className="text-foreground">
                    {service.team_size_range}
                  </strong>
                </span>
              </div>
            )}
            {service.pricing_model_display && (
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/60 px-3 py-2">
                <DollarSign
                  className="size-4 text-primary shrink-0"
                  aria-hidden="true"
                />
                <span className="text-muted-foreground">
                  {t("pricingLabel")}:{" "}
                  <strong className="text-foreground">
                    {service.pricing_model_display}
                  </strong>
                </span>
              </div>
            )}
          </div>

          {/* ═══ KEY METRICS ═══ */}
          {metricKeys.length > 0 && (
            <section ref={metricsRef} className="mb-16 sm:mb-20">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {metricKeys.map((key, index) => {
                  const rawValue = keyMetrics[key];
                  const numericValue =
                    typeof rawValue === "number" ? rawValue : 0;
                  const displayValue = useCountUp(
                    numericValue,
                    1200 + index * 200,
                    metricsVisible,
                  );

                  return (
                    <div
                      key={key}
                      className="group rounded-xl border border-border/50 bg-card/70 backdrop-blur-sm p-5 text-center transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/5 hover:border-primary/30 animate-in fade-in zoom-in duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="text-2xl sm:text-3xl font-bold text-brand-gradient">
                        {metricsVisible
                          ? typeof rawValue === "number"
                            ? displayValue.toLocaleString()
                            : rawValue
                          : typeof rawValue === "number"
                            ? "0"
                            : rawValue}
                        {typeof rawValue === "number" &&
                          key.includes("rate") &&
                          "%"}
                        {typeof rawValue === "number" &&
                          key.includes("seconds") &&
                          "s"}
                      </span>
                      <p className="text-[12px] text-muted-foreground mt-1 capitalize">
                        {key.replace(/_/g, " ")}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ═══ OVERVIEW ═══ */}
          {service.overview && (
            <section className="mb-16 sm:mb-20 animate-in fade-up duration-700">
              <SectionHeader
                index={1}
                icon={Layers}
                eyebrow="Overview"
                title={t("overview")}
              />
              <div className="max-w-3xl prose text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed space-y-3">
                {service.overview.split("\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          )}

          {/* ═══ PROBLEMS WE SOLVE ═══ */}
          {service.problems_we_solve && (
            <section className="mb-16 sm:mb-20 animate-in fade-up duration-700 delay-100">
              <SectionHeader
                index={2}
                icon={Target}
                eyebrow="Problems"
                title={t("problemsWeSolve")}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.problems_we_solve
                  .split("\n")
                  .filter(Boolean)
                  .map((problem, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg border border-red-100/20 bg-red-50/30 dark:bg-red-950/10 p-4 transition-all hover:border-red-300/40 hover:bg-red-50/50 dark:hover:bg-red-950/20"
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500 mt-0.5">
                        <X className="size-3" aria-hidden="true" />
                      </span>
                      <span className="text-[14px] text-foreground/80">
                        {problem.replace(/^-\s*|^•\s*/, "")}
                      </span>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* ═══ FEATURES ═══ */}
          {service.features && (
            <section className="mb-16 sm:mb-20 animate-in fade-up duration-700 delay-150">
              <SectionHeader
                index={3}
                icon={Zap}
                eyebrow="Features"
                title={t("keyFeatures")}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.features
                  .split(/\n- |\n• |\n/)
                  .filter(Boolean)
                  .map((feat, i) => {
                    const icons: LucideIcon[] = [
                      Rocket,
                      ShieldCheck,
                      Zap,
                      Cloud,
                      Code2,
                      Database,
                      Users,
                      Globe,
                    ];
                    const Icon = icons[i % icons.length];
                    return (
                      <div
                        key={i}
                        className="group flex items-start gap-3 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30 hover:bg-card/80 animate-in fade-up"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-gradient/10 text-primary group-hover:bg-brand-gradient group-hover:text-white transition-colors duration-300">
                          <Icon className="size-4.5" aria-hidden="true" />
                        </div>
                        <span className="text-[14px] text-foreground/90">
                          {feat.replace(/^-\s*|^•\s*/, "")}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </section>
          )}

          {/* ═══ BENEFITS ═══ */}
          {service.benefits && (
            <section className="mb-16 sm:mb-20 animate-in fade-up duration-700 delay-200">
              <SectionHeader
                index={4}
                icon={CheckCircle2}
                eyebrow="Benefits"
                title={t("benefits")}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.benefits
                  .split("\n")
                  .filter(Boolean)
                  .map((benefit, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg border border-emerald-100/20 bg-emerald-50/30 dark:bg-emerald-950/10 p-4 transition-all hover:border-emerald-300/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20"
                    >
                      <CheckCircle2
                        className="size-5 text-emerald-500 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-[14px] text-foreground/80">
                        {benefit.replace(/^-\s*|^•\s*/, "")}
                      </span>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* ═══ TECH STACK ═══ */}
          {service.technologies.length > 0 &&
            (() => {
              const grouped: Record<string, typeof service.technologies> = {};
              for (const tech of service.technologies) {
                const cat = tech.category || "other";
                (grouped[cat] ??= []).push(tech);
              }
              return (
                <section className="mb-16 sm:mb-20 animate-in fade-up duration-700 delay-250">
                  <SectionHeader
                    index={5}
                    icon={Layers}
                    eyebrow="Stack"
                    title={t("technologyStack")}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Object.entries(grouped).map(([cat, techs], idx) => {
                      const CatIcon = techLucideIcon(cat, cat);
                      return (
                        <div
                          key={cat}
                          className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30 animate-in fade-up"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <h3 className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <CatIcon className="size-4" aria-hidden="true" />
                            {cat}
                          </h3>
                          <div className="flex flex-wrap gap-1.5">
                            {techs.map((tech) => renderTechnology(tech))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })()}

          {/* ═══ INDUSTRIES ═══ */}
          {service.industries.length > 0 && (
            <section className="mb-16 sm:mb-20 animate-in fade-up duration-700 delay-300">
              <SectionHeader
                index={6}
                icon={Building2}
                eyebrow="Industries"
                title={t("industriesServed")}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {service.industries.map((ind, idx) => (
                  <div
                    key={ind.id}
                    className="group rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-brand/5 hover:border-primary/30 animate-in fade-up"
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {renderIndustryIcon(ind)}
                      <h3 className="text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors">
                        {ind.name}
                      </h3>
                    </div>
                    {ind.description && (
                      <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-3">
                        {ind.description}
                      </p>
                    )}
                    {ind.compliance_standards &&
                      Array.isArray(ind.compliance_standards) &&
                      ind.compliance_standards.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {ind.compliance_standards.map((std) => (
                            <span
                              key={std}
                              className="inline-flex items-center gap-1 text-[10px] font-medium bg-muted/50 px-2 py-0.5 rounded-full text-muted-foreground"
                            >
                              <ShieldCheck
                                className="size-2.5"
                                aria-hidden="true"
                              />
                              {std}
                            </span>
                          ))}
                        </div>
                      )}
                    <div className="mt-3 h-0.5 w-0 group-hover:w-full rounded-full bg-linear-to-r from-[#0ab8fb] to-[#324b9d] transition-all duration-500" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ═══ PROCESS ═══ */}
          {processSteps.length > 0 && (
            <section ref={processRef} className="mb-16 sm:mb-20">
              <SectionHeader
                index={7}
                icon={Workflow}
                eyebrow="Process"
                title={t("ourProcess")}
              />
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute left-4 top-0 bottom-0 w-0.5 bg-linear-to-b from-[#0ab8fb]/30 via-[#324b9d]/30 to-[#0ab8fb]/30 hidden sm:block"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {processSteps.map((step, i) => {
                    const StepIcon = step.icon
                      ? resolveIcon(step.icon)
                      : stepIconFallback[i % stepIconFallback.length];
                    return (
                      <div
                        key={step.id}
                        className="relative group animate-in fade-up"
                        style={{ animationDelay: `${i * 150}ms` }}
                      >
                        {i < processSteps.length - 1 && (
                          <div
                            aria-hidden="true"
                            className="absolute top-9 left-full w-[calc(100%-2rem)] h-0.5 bg-linear-to-r from-[#0ab8fb]/30 to-[#324b9d]/30 hidden lg:block"
                          />
                        )}
                        <div className="flex flex-col items-center text-center rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-brand/5 hover:border-primary/30">
                          <div className="flex size-14 items-center justify-center rounded-full bg-brand-gradient text-white shadow-brand mb-4 transition-transform duration-300 group-hover:scale-110">
                            <StepIcon className="size-6" aria-hidden="true" />
                          </div>
                          <span className="font-mono text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            {`Step ${String(i + 1).padStart(2, "0")}`}
                          </span>
                          <h3 className="text-[15px] font-semibold text-foreground mb-1.5">
                            {step.title}
                          </h3>
                          {step.description && (
                            <p className="text-[12px] text-muted-foreground leading-relaxed">
                              {step.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* ═══ DELIVERABLES ═══ */}
          {deliverables.length > 0 && (
            <section className="mb-16 sm:mb-20 animate-in fade-up duration-700 delay-350">
              <SectionHeader
                index={8}
                icon={ClipboardList}
                eyebrow="Deliverables"
                title={t("deliverables")}
              />
              <ScrollCarousel>
                {deliverables.map((d) => (
                  <div
                    key={d.id}
                    className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 snap-start shrink-0 w-65 sm:w-70 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                        {iconFor(d.icon, "size-3.5")}
                      </span>
                      <h3 className="text-[14px] font-semibold text-foreground">
                        {d.title}
                      </h3>
                    </div>
                    {d.description && (
                      <p className="text-[13px] text-muted-foreground leading-relaxed">
                        {d.description}
                      </p>
                    )}
                  </div>
                ))}
              </ScrollCarousel>
            </section>
          )}

          {/* ═══ PLAN COMPARISON ═══ */}
          {comparisonRows.length > 0 && (
            <section className="mb-16 sm:mb-20 animate-in fade-up duration-700 delay-400">
              <SectionHeader
                index={9}
                icon={BarChart3}
                eyebrow="Plans"
                title={t("planComparison")}
              />
              <div className="overflow-x-auto rounded-xl border border-border/50">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="text-left px-4 py-3 font-semibold text-foreground">
                        {t("feature")}
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground bg-muted/20">
                        {t("standard")}
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-[#13a89e] bg-[#13a89e]/5">
                        {t("premium")}
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-[#324b9d] bg-[#324b9d]/5 rounded-r-xl">
                        {t("enterprise")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {comparisonRows.map((row) => (
                      <tr
                        key={row.id}
                        className={cn(
                          "transition-colors hover:bg-muted/20",
                          row.is_highlighted && "bg-[#0ab8fb]/5",
                        )}
                      >
                        <td className="px-4 py-2.5 font-medium text-foreground">
                          {row.feature_name}
                          {row.is_highlighted && (
                            <span className="ml-2 text-[10px] text-[#0a9fdf] font-semibold uppercase bg-[#0a9fdf]/10 px-2 py-0.5 rounded-full">
                              {t("popular")}
                            </span>
                          )}
                        </td>
                        <ComparisonCell
                          value={row.standard_value}
                          className="text-muted-foreground"
                        />
                        <ComparisonCell
                          value={row.premium_value}
                          className="text-[#13a89e] font-medium"
                        />
                        <ComparisonCell
                          value={row.enterprise_value}
                          className="text-[#324b9d] font-medium"
                        />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ═══ ENTERPRISE FEATURES ═══ */}
          {enterpriseFeatures.length > 0 && (
            <section className="mb-16 sm:mb-20 animate-in fade-up duration-700 delay-450">
              <div className="rounded-2xl border border-[#324b9d]/30 bg-linear-to-br from-[#324b9d]/5 to-[#0ab8fb]/5 p-6 sm:p-8">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <ShieldCheck
                    className="size-5 text-[#324b9d]"
                    aria-hidden="true"
                  />
                  {t("enterpriseFeatures")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {enterpriseFeatures.map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 animate-in fade-up"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <CheckCircle2
                        className="size-4 text-[#324b9d] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-[14px] text-foreground/80">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ═══ ADD-ONS ═══ */}
          {addOns.length > 0 && (
            <section className="mb-16 sm:mb-20 animate-in fade-up duration-700 delay-500">
              <SectionHeader
                index={10}
                icon={Puzzle}
                eyebrow="Add-ons"
                title={t("availableAddOns")}
              />
              <ScrollCarousel>
                {addOns.map((addon) => (
                  <div
                    key={addon.id}
                    className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 snap-start shrink-0 w-65 sm:w-70 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[14px] font-semibold text-foreground">
                        {addon.name}
                      </h3>
                      {addon.price && (
                        <span className="text-[13px] font-bold text-primary">
                          ${Number(addon.price).toLocaleString()}{" "}
                          {service.currency}
                        </span>
                      )}
                    </div>
                    {addon.description && (
                      <p className="text-[13px] text-muted-foreground leading-relaxed">
                        {addon.description}
                      </p>
                    )}
                    {addon.is_included_in_enterprise && (
                      <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium text-[#324b9d] bg-[#324b9d]/10 rounded-full px-2.5 py-0.5 border border-[#324b9d]/20">
                        <Check className="size-3" aria-hidden="true" />
                        {t("includedInEnterprise")}
                      </span>
                    )}
                  </div>
                ))}
              </ScrollCarousel>
            </section>
          )}

          {/* ═══ CLIENT LOGOS ═══ */}
          {clientLogos.length > 0 && (
            <section className="mb-16 sm:mb-20 animate-in fade-up duration-700 delay-550">
              <SectionHeader
                index={11}
                icon={Users}
                eyebrow="Clients"
                title={t("trustedBy")}
                description="Join 200+ companies that trust AUTOMEX"
              />
              <div className="flex flex-wrap gap-4">
                {clientLogos.map((logo) => {
                  const logoContent = logo.logo?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getMediaUrl(logo.logo.url)}
                      alt={logo.client_name}
                      className="max-h-10 max-w-full object-contain opacity-60 hover:opacity-100 transition-all duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-[13px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                      {logo.client_name}
                    </span>
                  );

                  const cardClasses =
                    "group flex items-center justify-center rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-5 h-20 min-w-[140px] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30 hover:bg-card/80";

                  return logo.client_url ? (
                    <a
                      key={logo.id}
                      href={logo.client_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cardClasses}
                      title={logo.client_name}
                    >
                      {logoContent}
                    </a>
                  ) : (
                    <div key={logo.id} className={cardClasses}>
                      {logoContent}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ═══ TESTIMONIALS ═══ */}
          {testimonials.length > 0 && (
            <section className="mb-16 sm:mb-20 animate-in fade-up duration-700 delay-600">
              <SectionHeader
                index={12}
                icon={Quote}
                eyebrow="Testimonials"
                title={t("clientTestimonials")}
              />
              <ScrollCarousel>
                {testimonials.map((tm) => (
                  <div
                    key={tm.id}
                    className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 snap-start shrink-0 w-[320px] sm:w-95 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "size-3.5 transition-all duration-300",
                              i < tm.rating
                                ? "text-amber-500 fill-amber-500"
                                : "text-muted-foreground/20",
                            )}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <Quote
                        className="size-5 text-primary/20"
                        aria-hidden="true"
                      />
                    </div>
                    <blockquote className="text-[14px] text-foreground/80 italic mb-4 leading-relaxed">
                      {tm.quote}
                    </blockquote>
                    <div className="flex items-center gap-3">
                      {tm.client_avatar?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getMediaUrl(tm.client_avatar.url)}
                          alt={tm.client_name}
                          className="size-10 rounded-full object-cover border-2 border-primary/20"
                        />
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-full bg-brand-gradient text-white text-[13px] font-bold">
                          {tm.client_name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-[13px] font-semibold text-foreground">
                          {tm.client_name}
                        </p>
                        <p className="text-[12px] text-muted-foreground">
                          {tm.client_role}
                          {tm.client_company ? `, ${tm.client_company}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollCarousel>
            </section>
          )}

          {/* ═══ SLAs ═══ */}
          {slas.length > 0 && (
            <section className="mb-16 sm:mb-20 animate-in fade-up duration-700 delay-650">
              <SectionHeader
                index={13}
                icon={ShieldCheck}
                eyebrow="Guarantees"
                title={t("serviceGuarantees")}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {slas.map((sla, idx) => (
                  <div
                    key={sla.id}
                    className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30 animate-in fade-up"
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                        {iconFor(sla.icon, "size-3.5")}
                      </span>
                      <h3 className="text-[14px] font-semibold text-foreground">
                        {sla.guarantee_name}
                      </h3>
                    </div>
                    <p className="text-2xl font-bold text-brand-gradient mb-1">
                      {sla.value}
                    </p>
                    {sla.description && (
                      <p className="text-[12px] text-muted-foreground">
                        {sla.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ═══ DOCUMENTS ═══ */}
          {documents.length > 0 && (
            <section className="mb-16 sm:mb-20 animate-in fade-up duration-700 delay-700">
              <SectionHeader
                index={14}
                icon={FileText}
                eyebrow="Resources"
                title={t("resourcesDocuments")}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documents.map((doc, idx) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 group hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-in fade-up"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-brand-gradient group-hover:text-white transition-all duration-300">
                      <FileText className="size-5" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-foreground truncate">
                        {doc.title}
                      </p>
                      {doc.description && (
                        <p className="text-[12px] text-muted-foreground truncate">
                          {doc.description}
                        </p>
                      )}
                      <span className="text-[11px] text-muted-foreground/70">
                        {doc.document_type_display || "Document"}
                      </span>
                    </div>
                    {doc.file?.url && (
                      <a
                        href={getMediaUrl(doc.file.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-300 hover:scale-110"
                      >
                        <Download className="size-4" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ═══ FAQs ═══ */}
          {faqs.length > 0 && (
            <section className="mb-16 sm:mb-20 animate-in fade-up duration-700 delay-750">
              <SectionHeader
                index={15}
                icon={Search}
                eyebrow="FAQ"
                title={t("frequentlyAskedQuestions")}
              />

              {faqCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  <button className="text-[12px] font-medium px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                    All
                  </button>
                  {faqCategories.map((cat) => (
                    <button
                      key={cat}
                      className="text-[12px] font-medium px-3 py-1.5 rounded-full border border-border/40 bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                {faqs
                  .filter((f) => f.is_prominent)
                  .map((faq) => (
                    <FAQItem
                      key={faq.id}
                      question={faq.question}
                      answer={faq.answer}
                      prominent
                    />
                  ))}
                {faqs
                  .filter((f) => !f.is_prominent)
                  .map((faq) => (
                    <FAQItem
                      key={faq.id}
                      question={faq.question}
                      answer={faq.answer}
                      prominent={false}
                    />
                  ))}
              </div>
            </section>
          )}

          {/* ═══ RELATED SERVICES ═══ */}
          {(relatedServices.length > 0 || relatedSvcs.length > 0) && (
            <section className="mb-16 sm:mb-20 animate-in fade-up duration-700 delay-800">
              <SectionHeader
                index={16}
                icon={ArrowUpRight}
                eyebrow="Related"
                title={t("relatedServices")}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(relatedServices.length > 0
                  ? relatedServices
                  : relatedSvcs.slice(0, 3)
                ).map((s, idx) => {
                  const isRef = !("hero_image" in s && "category" in s);
                  const slug = isRef
                    ? (s as ServiceListItemRef).slug
                    : (s as ServiceListItem).slug;
                  const name = isRef
                    ? (s as ServiceListItemRef).name
                    : (s as ServiceListItem).name;
                  const desc = isRef
                    ? (s as ServiceListItemRef).short_description
                    : (s as ServiceListItem).short_description;
                  const img = isRef
                    ? (s as ServiceListItemRef).hero_image
                    : (s as ServiceListItem).hero_image;
                  const category = isRef
                    ? (s as ServiceListItemRef).category
                    : (s as ServiceListItem).category;
                  const svcIcon = isRef
                    ? (s as ServiceListItemRef).icon
                    : undefined;
                  const FallbackIcon = resolveIcon(svcIcon);

                  return (
                    <Link
                      key={slug}
                      href={`/services/${slug}` as any}
                      className="group flex flex-col rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/5 animate-in fade-up"
                      style={{ animationDelay: `${idx * 80}ms` }}
                    >
                      {img?.url ? (
                        <div className="h-36 overflow-hidden relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getMediaUrl(img.url)}
                            alt={img.alt_text || name}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="inline-flex items-center gap-1.5 text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                              Learn more{" "}
                              <ArrowUpRight
                                className="size-3.5"
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-36 bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <FallbackIcon
                            className="size-9 text-primary/30"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                      <div className="p-4 flex-1 flex flex-col">
                        {category && (
                          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                            {typeof category === "object" && "name" in category
                              ? category.name
                              : category}
                          </span>
                        )}
                        <h3 className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors">
                          {name}
                        </h3>
                        {desc && (
                          <p className="text-[12px] text-muted-foreground mt-1 line-clamp-2 flex-1">
                            {desc}
                          </p>
                        )}
                        <div className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Explore{" "}
                          <ArrowRight className="size-3" aria-hidden="true" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ═══ BOTTOM CTA ═══ */}
          <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-8 sm:p-12 text-center animate-in fade-up duration-700 delay-900">
            <BlueprintGrid />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-[#0ab8fb]/5 via-transparent to-[#324b9d]/5"
              style={{
                backgroundSize: "200% 200%",
                animation: "gradient-shift 8s ease-in-out infinite alternate",
              }}
            />

            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
              <Sparkles className="size-3" aria-hidden="true" />
              {t("getStarted")}
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              {t("readyToBuild", { name: service.name })}
            </h2>
            <p className="text-[14px] text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
              {t("letsDiscuss")}
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-brand-gradient shadow-brand hover:shadow-xl transition-all hover:scale-105"
              >
                <Link
                  href={
                    { pathname: ctaUrl, query: { service: service.id } } as any
                  }
                >
                  <Send
                    className="size-4 mr-1.5 rtl:ml-1.5 rtl:mr-0"
                    aria-hidden="true"
                  />
                  {t("requestQuote")}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-brand-gradient hover:border-primary/50 transition-all hover:scale-105"
              >
                <Link href="/crm/book-a-call">
                  <PhoneCall
                    className="size-4 mr-1.5 rtl:ml-1.5 rtl:mr-0"
                    aria-hidden="true"
                  />
                  {t("bookFreeCall")}
                </Link>
              </Button>
            </div>
          </section>

          {/* ═══ ADDITIONAL RESOURCES ═══ */}
          {(service.thumbnail_image ||
            service.video_presentation ||
            service.brochure) && (
            <section className="mb-16 sm:mb-20 mt-16 sm:mt-20 animate-in fade-up duration-700 delay-950">
              <SectionHeader
                index={17}
                icon={FileText}
                eyebrow="Media"
                title={t("additionalResources")}
              />
              <div className="flex flex-wrap gap-4">
                {service.thumbnail_image?.url && (
                  <a
                    href={getMediaUrl(service.thumbnail_image.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 hover:border-primary/40 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getMediaUrl(service.thumbnail_image.url)}
                        alt={service.thumbnail_image.alt_text || "Thumbnail"}
                        className="size-8 object-contain"
                      />
                    </div>
                    <span className="text-[13px] font-medium text-foreground">
                      {service.thumbnail_image.alt_text ||
                        t("serviceThumbnail")}
                    </span>
                    <ExternalLink
                      className="size-3.5 text-muted-foreground ml-auto"
                      aria-hidden="true"
                    />
                  </a>
                )}
                {service.video_presentation?.url && (
                  <a
                    href={service.video_presentation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 hover:border-primary/40 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#0ab8fb]/10 text-[#0ab8fb]">
                      <Play className="size-5" aria-hidden="true" />
                    </div>
                    <span className="text-[13px] font-medium text-foreground">
                      {t("videoPresentation")}
                    </span>
                    <ExternalLink
                      className="size-3.5 text-muted-foreground ml-auto"
                      aria-hidden="true"
                    />
                  </a>
                )}
                {service.brochure?.url && (
                  <a
                    href={getMediaUrl(service.brochure.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 hover:border-primary/40 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#13a89e]/10 text-[#13a89e]">
                      <FileText className="size-5" aria-hidden="true" />
                    </div>
                    <span className="text-[13px] font-medium text-foreground">
                      {t("serviceBrochure")}
                    </span>
                    <Download
                      className="size-4 text-muted-foreground ml-auto"
                      aria-hidden="true"
                    />
                  </a>
                )}
              </div>
            </section>
          )}

          {/* ═══ PUBLISHED DATE ═══ */}
          {publishedDate && (
            <div className="text-center pt-4 pb-8 border-t border-border/30">
              <p className="text-[12px] text-muted-foreground/60 inline-flex items-center gap-1.5">
                <Clock className="size-3" aria-hidden="true" />
                {t("lastUpdated")}: {publishedDate}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── STICKY CTA BAR ────────────────────────────────────────────── */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border/50 shadow-lg transition-all duration-500",
          showStickyCta
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none",
        )}
      >
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="text-[13px] font-semibold text-foreground hidden sm:inline">
              {service.name}
            </span>
            {service.starting_price && (
              <span className="text-[12px] text-muted-foreground">
                {t("startingAt")}{" "}
                <strong className="text-primary">
                  ${Number(service.starting_price).toLocaleString()}
                </strong>{" "}
                {service.currency}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className="bg-brand-gradient shadow-brand hover:shadow-lg transition-all"
            >
              <Link
                href={
                  { pathname: ctaUrl, query: { service: service.id } } as any
                }
              >
                <Send
                  className="size-3.5 mr-1.5 rtl:ml-1.5 rtl:mr-0"
                  aria-hidden="true"
                />
                {t("getQuote")}
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-brand-gradient hidden sm:inline-flex"
            >
              <Link href="/crm/book-a-call">
                <PhoneCall
                  className="size-3.5 mr-1.5 rtl:ml-1.5 rtl:mr-0"
                  aria-hidden="true"
                />
                {t("bookFreeCall")}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <FooterSection />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Comparison table cell — renders lucide Check / X for boolean-like values
// ("✓" / "-" / "✗" from the API) instead of raw text glyphs.
// ─────────────────────────────────────────────────────────────────────────

function ComparisonCell({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const v = value.trim();
  if (v === "✓" || v.toLowerCase() === "yes" || v.toLowerCase() === "true") {
    return (
      <td className={cn("text-center px-4 py-2.5", className)}>
        <Check className="size-4 mx-auto" aria-hidden="true" />
      </td>
    );
  }
  if (
    v === "✗" ||
    v === "-" ||
    v.toLowerCase() === "no" ||
    v.toLowerCase() === "false"
  ) {
    return (
      <td className="text-center px-4 py-2.5 text-muted-foreground/40">
        <X className="size-4 mx-auto" aria-hidden="true" />
      </td>
    );
  }
  return <td className={cn("text-center px-4 py-2.5", className)}>{value}</td>;
}

// ─────────────────────────────────────────────────────────────────────────
// FAQ accordion item
// ─────────────────────────────────────────────────────────────────────────

function FAQItem({
  question,
  answer,
  prominent = false,
}: {
  question: string;
  answer: string;
  prominent?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-xl border overflow-hidden transition-all duration-200",
        prominent
          ? "border-[#0ab8fb]/20 bg-[#0ab8fb]/5 dark:bg-[#0ab8fb]/5"
          : "border-border/40 bg-card/50 backdrop-blur-sm",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-[14px] font-medium text-foreground hover:bg-muted/20 transition-colors"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2.5">
          <Search
            className="size-3.5 text-muted-foreground shrink-0"
            aria-hidden="true"
          />
          {question}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="px-5 pb-4 pl-11 text-[13px] text-muted-foreground leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}
