"use client";

// app/[locale]/(routes)/services/[slug]/_components/ServiceDetailClientPage.tsx
//
// Full service detail page with all sections from ServiceDetailFull.
// No framer-motion — pure Tailwind transitions and CSS.

import { useState, useEffect, useCallback, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getMediaUrl } from "@/lib/env";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
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
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import type { ServiceDetail, ServiceListItem } from "@/lib/automex/types";
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
  ServiceListItemRef,
} from "@/lib/automex/types";
import { FooterSection } from "@/app/[locale]/_components/Footer/FooterSections";

// ─── Helpers to extract sub-arrays (API returns objects, generated types say string) ──

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

// ─── Icon name → Lucide component mapping ──────────────────────────────

/** Delivers a React node for a given icon name — emojis, lucide names, or fallback. */
function iconFor(
  name: string | undefined | null,
  size: string = "size-4",
): React.ReactNode {
  if (!name) return <Sparkles className={size} />;

  // Normalize: strip "lucide:" prefix, lowercase, dash-separated
  const key = name
    .replace(/^lucide:/i, "")
    .toLowerCase()
    .trim();

  const map: Record<string, React.ReactNode> = {
    // ── Emojis ──────────────────────────────────────────────────
    search: <span className="text-base">🔍</span>,
    code: <span className="text-base">💻</span>,
    rocket: <span className="text-base">🚀</span>,
    lightbulb: <span className="text-base">💡</span>,
    gear: <span className="text-base">⚙️</span>,
    target: <span className="text-base">🎯</span>,
    chart: <span className="text-base">📊</span>,
    mail: <span className="text-base">📧</span>,
    calendar: <span className="text-base">📅</span>,
    puzzle: <span className="text-base">🧩</span>,
    zap: <span className="text-base">⚡</span>,
    heart: <span className="text-base">❤️</span>,
    eye: <span className="text-base">👁️</span>,
    megaphone: <span className="text-base">📣</span>,
    // ── Lucide icons ────────────────────────────────────────────
    shield: <ShieldCheck className={size} />,
    "shield-check": <ShieldCheck className={size} />,
    users: <Users className={size} />,
    clock: <Clock className={size} />,
    "bar-chart": <BarChart3 className={size} />,
    "bar-chart-3": <BarChart3 className={size} />,
    star: <Star className={size} />,
    "file-text": <FileText className={size} />,
    download: <Download className={size} />,
    "dollar-sign": <DollarSign className={size} />,
    check: <CheckCircle2 className={size} />,
    "check-circle": <CheckCircle2 className={size} />,
    "check-circle-2": <CheckCircle2 className={size} />,
    "arrow-right": <ArrowRight className={size} />,
    "external-link": <ExternalLink className={size} />,
    send: <Send className={size} />,
    sparkles: <Sparkles className={size} />,
    brain: <Brain className={size} />,
    cpu: <Cpu className={size} />,
    server: <Server className={size} />,
    database: <Database className={size} />,
    cloud: <Cloud className={size} />,
    terminal: <Terminal className={size} />,
    smartphone: <Smartphone className={size} />,
    monitor: <Monitor className={size} />,
    globe: <Globe className={size} />,
    layout: <Layout className={size} />,
    component: <Component className={size} />,
    "file-code": <FileCode className={size} />,
    workflow: <Workflow className={size} />,
    box: <Box className={size} />,
    "building-2": <Building2 className={size} />,
    "git-branch": <GitBranch className={size} />,
    "book-open": <BookOpen className={size} />,
    "test-tubes": <FlaskConical className={size} />,
    "clipboard-list": <ClipboardList className={size} />,
    timer: <Timer className={size} />,
    lock: <Lock className={size} />,
    wrench: <span className="text-base">🔧</span>,
    "code-2": <Code2 className={size} />,
    code2: <Code2 className={size} />,
    "brain-circuit": <Brain className={size} />,
    "cloud-cog": <Cloud className={size} />,
    palette: <span className="text-base">🎨</span>,
  };

  return map[key] ?? <Sparkles className={size} />;
}

// ─── Technology rendering (image > icon > text) ────────────────────────

/** Render a technology item with priority: image URL > lucide icon from slug > text-only chip.
 * If website_url is provided, the chip becomes a clickable link. */
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
    "inline-flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-2.5 py-1.5 text-[12px] text-foreground/80 hover:border-primary/30 transition-colors";

  let content: React.ReactNode;

  // 1) icon field contains an image URL → render <img>
  if (isImageUrl(t.icon)) {
    content = (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={t.icon!} alt={t.name} className="size-4 object-contain" />
        {t.name}
      </>
    );
  } else if (t.icon && !isImageUrl(t.icon)) {
    // 2) icon field contains a lucide / emoji name → render iconFor
    content = (
      <>
        {iconFor(t.icon)}
        {t.name}
      </>
    );
  } else {
    // 3) fallback: slug → lucide lookup
    const LucideIcon = techLucideIcon(t.slug, t.category);
    content = (
      <>
        <LucideIcon className={size} />
        {t.name}
      </>
    );
  }

  // Wrap in link if website_url is available
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

// ─── Technology Lucide icon lookup (slug + category fallback) ──────────

const TECH_ICON_MAP: Record<string, LucideIcon> = {
  // ── Languages ────────────────────────────────────────────────
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
  perl: Terminal,
  haskell: Terminal,
  clojure: Terminal,
  lua: Terminal,
  // ── Frontend ─────────────────────────────────────────────────
  react: Component,
  angular: Component,
  vue: Component,
  svelte: Component,
  nextjs: Layout,
  next: Layout,
  nuxt: Layout,
  nuxtjs: Layout,
  tailwindcss: Layout,
  tailwind: Layout,
  bootstrap: Layout,
  webpack: Box,
  vite: Box,
  redux: Box,
  zustand: Box,
  mobx: Box,
  gatsby: Layout,
  astro: Layout,
  remix: Layout,
  htmx: Code2,
  jquery: Code2,
  alpine: Code2,
  alpinejs: Code2,
  ember: Component,
  backbone: Component,
  threejs: Box,
  "three.js": Box,
  d3js: BarChart3,
  d3: BarChart3,
  "d3.js": BarChart3,
  chartjs: BarChart3,
  // ── Backend ──────────────────────────────────────────────────
  django: Server,
  "django-drf": Server,
  express: Server,
  flask: Server,
  fastapi: Server,
  spring: Server,
  springboot: Server,
  laravel: Server,
  rails: Server,
  graphql: Globe,
  rest: Globe,
  apollo: Globe,
  nodejs: Server,
  node: Server,
  "node.js": Server,
  nestjs: Server,
  nest: Server,
  dotnet: Server,
  ".net": Server,
  aspnet: Server,
  ktor: Server,
  gin: Server,
  echo: Server,
  fiber: Server,
  phoenix: Server,
  symphony: Server,
  codeigniter: Server,
  yii: Server,
  cakephp: Server,
  strapi: Server,
  directus: Server,
  payload: Server,
  sanity: Server,
  contentful: Server,
  medusa: Server,
  // ── Database ─────────────────────────────────────────────────
  postgresql: Database,
  postgres: Database,
  mysql: Database,
  mongodb: Database,
  redis: Database,
  sqlite: Database,
  elasticsearch: Database,
  firebase: Database,
  supabase: Database,
  mariadb: Database,
  cockroachdb: Database,
  cassandra: Database,
  dynamodb: Database,
  neo4j: Database,
  arangodb: Database,
  influxdb: Database,
  timescaledb: Database,
  clickhouse: Database,
  bigquery: Database,
  snowflake: Database,
  redshift: Database,
  meilisearch: Database,
  typesense: Database,
  algolia: Database,
  prisma: Database,
  drizzle: Database,
  typeorm: Database,
  sequelize: Database,
  knex: Database,
  mongoose: Database,
  // ── Cloud / Infra ────────────────────────────────────────────
  aws: Cloud,
  gcp: Cloud,
  azure: Cloud,
  vercel: Cloud,
  netlify: Cloud,
  cloudflare: Cloud,
  digitalocean: Cloud,
  heroku: Cloud,
  render: Cloud,
  flyio: Cloud,
  railway: Cloud,
  linode: Cloud,
  ovh: Cloud,
  alibabacloud: Cloud,
  s3: Cloud,
  lambda: Cloud,
  ec2: Cloud,
  rds: Cloud,
  ecs: Cloud,
  eks: Cloud,
  cloudfront: Cloud,
  route53: Cloud,
  cloudrun: Cloud,
  "cloud run": Cloud,
  firestore: Cloud,
  // ── DevOps ───────────────────────────────────────────────────
  docker: Box,
  kubernetes: Workflow,
  k8s: Workflow,
  jenkins: Workflow,
  terraform: Workflow,
  ansible: Workflow,
  github: Globe,
  gitlab: Globe,
  bitbucket: Globe,
  nginx: Server,
  apache: Server,
  caddy: Server,
  traefik: Server,
  prometheus: BarChart3,
  grafana: BarChart3,
  datadog: BarChart3,
  elk: Database,
  kibana: BarChart3,
  logstash: Workflow,
  circleci: Workflow,
  travisci: Workflow,
  "github-actions": Workflow,
  githubactions: Workflow,
  argocd: Workflow,
  fluxcd: Workflow,
  helm: Box,
  istio: Workflow,
  consul: Workflow,
  vault: ShieldCheck,
  sonarqube: ShieldCheck,
  newrelic: BarChart3,
  sentry: ShieldCheck,
  // ── AI / ML ──────────────────────────────────────────────────
  tensorflow: Brain,
  pytorch: Brain,
  openai: Brain,
  langchain: Brain,
  "groq-ai": Brain,
  groq: Brain,
  groqai: Brain,
  huggingface: Brain,
  scikit: Brain,
  "scikit-learn": Brain,
  sklearn: Brain,
  pandas: Brain,
  numpy: Brain,
  jupyter: Terminal,
  keras: Brain,
  spacy: Brain,
  nltk: Brain,
  transformers: Brain,
  llamaindex: Brain,
  chroma: Brain,
  pinecone: Brain,
  weaviate: Brain,
  qdrant: Brain,
  milvus: Brain,
  faiss: Brain,
  onnx: Brain,
  mlflow: Brain,
  wandb: Brain,
  evidently: Brain,
  bentoml: Brain,
  // ── Mobile ───────────────────────────────────────────────────
  flutter: Smartphone,
  "react-native": Smartphone,
  expo: Smartphone,
  ionic: Smartphone,
  capacitor: Smartphone,
  nativescript: Smartphone,
  xamarin: Smartphone,
  cordova: Smartphone,
  // ── Enterprise ───────────────────────────────────────────────
  salesforce: Building2,
  sap: Building2,
  oracle: Database,
  dynamics: Building2,
  "microsoft-dynamics": Building2,
  servicenow: Building2,
  workday: Building2,
  hubspot: Building2,
  zoho: Building2,
  odoo: Building2,
  erpnext: Building2,
  netsuite: Building2,
  // ── Testing ──────────────────────────────────────────────────
  jest: ShieldCheck,
  mocha: ShieldCheck,
  cypress: ShieldCheck,
  playwright: ShieldCheck,
  selenium: ShieldCheck,
  puppeteer: ShieldCheck,
  vitest: ShieldCheck,
  storybook: Box,
  // ── Other ────────────────────────────────────────────────────
  linux: Terminal,
  ubuntu: Terminal,
  debian: Terminal,
  centos: Terminal,
  windows: Monitor,
  macos: Monitor,
  bash: Terminal,
  zsh: Terminal,
  git: Globe,
  vscode: Code2,
  figma: Layout,
  blender: Box,
  unity: Box,
  unreal: Box,
  godot: Box,
  raspberrypi: Cpu,
  arduino: Cpu,
  embedded: Cpu,
  iot: Cpu,
  ros: Cpu,
  solidity: FileCode,
  web3: Globe,
  ethereum: Globe,
  polygon: Globe,
  ipfs: Globe,
  hardhat: Box,
  truffle: Box,
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

// ─── Industry rendering (image > icon name > text) ─────────────────────

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
  education: Building2,
  edtech: Building2,
  logistics: Box,
  transportation: Box,
  supplychain: Box,
  "supply-chain": Box,
  manufacturing: Box,
  automotive: Car,
  energy: Cloud,
  oilgas: Cloud,
  "oil-gas": Cloud,
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
  nonprofit: Building2,
  ngo: Building2,
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
  biotech: Building2,
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
  size: string = "size-8",
) {
  // 1) icon field contains an image URL → render <img>
  if (isImageUrl(ind.icon)) {
    return (
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-muted/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ind.icon!}
          alt={ind.name}
          className="size-full object-contain p-1.5"
        />
      </div>
    );
  }

  // 2) icon is a lucide name / emoji
  if (ind.icon) {
    return (
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient/10 text-primary">
        {iconFor(ind.icon, size)}
      </div>
    );
  }

  // 3) slug-based fallback
  const Icon = industryIcon(ind.slug);
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient/10 text-primary">
      <Icon className={size} />
    </div>
  );
}

// ─── Hero Carousel ─────────────────────────────────────────────────────

function HeroCarousel({
  images,
  service,
}: {
  images: ServiceHeroImage[];
  service: ServiceDetail;
}) {
  const t = useTranslations("ServicesDetail");
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
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

  return (
    <section className="relative mb-10 sm:mb-14">
      {/* Ambient gradient blobs behind the carousel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 -z-10"
      >
        <div className="absolute -top-10 -left-10 size-64 rounded-full bg-[#0ab8fb]/10 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-10 -right-10 size-72 rounded-full bg-[#324b9d]/10 blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 rounded-full bg-[#13a89e]/8 blur-3xl animate-pulse"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/20"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative h-[420px] sm:h-[520px] md:h-[560px]">
          {/* Image layers with smooth crossfade */}
          {images.map((img, idx) => (
            <div
              key={img.id}
              className={cn(
                "absolute inset-0 transition-all duration-1000 ease-in-out",
                idx === current
                  ? "opacity-100 scale-100 z-0"
                  : "opacity-0 scale-105 z-0",
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

          {/* Diagonal gradient overlay — dark on left/bottom, fading to transparent */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.05) 100%)",
            }}
          />
          {/* Bottom gradient for controls visibility */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent z-[1]"
          />

          {/* Glass-morphism info card on the left */}
          <div className="absolute inset-0 flex items-center z-[2]">
            <div className="px-6 sm:px-10 lg:px-14 max-w-xl space-y-5">
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2">
                {service.category && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                    {iconFor(service.category.icon, "size-3")}
                    <span className="ml-0.5">{service.category.name}</span>
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

              {/* Title with text shadow for depth */}
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight"
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
              >
                {service.name}
              </h1>

              {/* Description */}
              <p className="text-[15px] sm:text-base text-white/85 max-w-lg leading-relaxed">
                {service.short_description}
              </p>

              {/* Image caption (shows caption of current slide) */}
              {currentImage?.caption && (
                <p className="text-[12px] text-white/50 italic">
                  {currentImage.caption}
                </p>
              )}

              {/* CTAs */}
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
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-md"
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

          {/* Slide counter */}
          {images.length > 1 && (
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 text-[12px] text-white/60 bg-black/30 backdrop-blur-md rounded-full px-3 py-1 border border-white/10">
              {current + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Navigation arrows */}
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

            {/* Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    idx === current
                      ? "bg-white h-2 w-8 shadow-glow"
                      : "bg-white/40 hover:bg-white/70 h-2 w-2",
                  )}
                  aria-label={t("goToSlide", { n: idx + 1 })}
                />
              ))}
            </div>

            {/* Pause / Play */}
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="absolute bottom-5 right-5 z-30 flex size-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/50 transition-colors border border-white/10"
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

// ─── Scroll Carousel (smooth horizontal scroll + arrows) ───────────────

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
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 flex size-9 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm border border-border/50 shadow-md text-foreground/70 hover:text-foreground hover:bg-card transition-all opacity-0 group-hover/carousel:opacity-100"
          aria-label={t("scrollLeft")}
        >
          <ChevronLeft className="size-4 rtl:rotate-180" />
        </button>
      )}

      {/* Scrollable container */}
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

      {/* Right arrow */}
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

// ─── Props ─────────────────────────────────────────────────────────────

interface ServiceDetailClientPageProps {
  service: ServiceDetail;
  relatedServices: ServiceListItem[];
}

export function ServiceDetailClientPage({
  service,
  relatedServices,
}: ServiceDetailClientPageProps) {
  const locale = useLocale();
  const t = useTranslations("ServicesDetail");

  // Extract sub-arrays (cast from generated 'string' type)
  const heroImages = asArr<ServiceHeroImage>(service.hero_images);
  const processSteps = asArr<ServiceProcessStep>(service.process_steps);
  const deliverables = asArr<ServiceDeliverable>(service.deliverables);
  const addOns = asArr<ServiceAddOn>(service.add_ons);
  const comparisonRows = asArr<ServiceComparisonRow>(service.comparison_rows);
  const clientLogos = asArr<ServiceClientLogo>(service.client_logos);
  const testimonials = asArr<ServiceTestimonialSub>(
    service.service_testimonials,
  );
  const documents = asArr<ServiceDocument>(service.documents);
  const slas = asArr<ServiceSLA>(service.slas);
  const faqs = asArr<ServiceFAQSub>(service.faqs);
  const relatedSvcs = asArr<ServiceListItemRef>(service.related_services);
  const enterpriseFeatures = Array.isArray(service.enterprise_features)
    ? (service.enterprise_features as string[])
    : [];
  const keyMetrics = (service.key_metrics ?? {}) as Record<string, number>;
  const techStack = (service.tech_stack_grouped ?? {}) as Record<
    string,
    string[]
  >;

  const hasHeroImages = heroImages.length > 0;
  const coverImage = heroImages.find((h) => h.is_cover) || heroImages[0];

  // Computed CTA URL (use backend value if provided, else fallback to /crm/quote)
  const ctaUrl = service.cta_url || "/crm/quote";
  // Format published date
  const publishedDate = service.published_at
    ? new Date(service.published_at).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      <div className="relative overflow-hidden">
        {/* ─── Background decoration ─────────────────────────────── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-32 right-0 size-125 rounded-full bg-[#0ab8fb]/3 blur-3xl" />
          <div className="absolute top-1/4 -left-40 size-100 rounded-full bg-[#324b9d]/3 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 size-87.5 rounded-full bg-[#13a89e]/3 blur-3xl" />
        </div>

        {/* Full-width hero carousel */}
        {hasHeroImages && (
          <HeroCarousel images={heroImages} service={service} />
        )}

        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
          {/* ═══════════════════════════════════════════════════════════
            HERO — static fallback when no images
           ═══════════════════════════════════════════════════════════ */}
          {!hasHeroImages && (
            <section className="mb-16 sm:mb-24">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
                {/* Left: text */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {service.category && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf]">
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

                  {/* CTA */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      asChild
                      size="lg"
                      className="bg-brand-gradient shadow-brand"
                    >
                      <Link
                        href={
                          {
                            pathname: ctaUrl,
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
                      className="border-brand-gradient"
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

                {/* Right: hero image */}
                <div className="lg:col-span-2">
                  {coverImage?.image?.url ? (
                    <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getMediaUrl(coverImage.image.url)}
                        alt={coverImage.caption || service.name}
                        className="h-64 sm:h-80 w-full object-cover"
                      />
                      {coverImage.caption && (
                        <p className="absolute bottom-3 left-3 right-3 text-[12px] text-white/80 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5">
                          {coverImage.caption}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 sm:h-80 rounded-2xl border border-border/50 bg-gradient-to-br from-[#0ab8fb]/10 to-[#324b9d]/10">
                      <div className="text-center">
                        <div className="text-5xl mb-3">
                          {service.icon
                            ? iconFor(service.icon.replace(/^lucide:/, ""))
                            : "💻"}
                        </div>
                        <p className="text-[13px] text-muted-foreground">
                          {service.name}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Additional hero images (thumbnails) */}
                  {heroImages.length > 1 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                      {heroImages.slice(1, 5).map((img) => (
                        <div
                          key={img.id}
                          className="shrink-0 size-16 rounded-lg border border-border/50 overflow-hidden"
                        >
                          {img.image?.url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={getMediaUrl(img.image.url)}
                              alt={img.caption || ""}
                              className="size-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Quick info bar — shown below both carousel and static hero */}
          <div className="flex flex-wrap gap-4 text-[13px] mb-16 sm:mb-20">
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

          {/* ═══════════════════════════════════════════════════════════
            KEY METRICS
           ═══════════════════════════════════════════════════════════ */}
          {Object.keys(keyMetrics).length > 0 && (
            <section className="mb-16 sm:mb-20">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(keyMetrics).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-xl border border-border/50 bg-card/70 backdrop-blur-sm p-5 text-center"
                  >
                    <span className="text-2xl sm:text-3xl font-bold text-brand-gradient">
                      {typeof value === "number"
                        ? value.toLocaleString()
                        : value}
                    </span>
                    <p className="text-[12px] text-muted-foreground mt-1 capitalize">
                      {key.replace(/_/g, " ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════
            OVERVIEW
           ═══════════════════════════════════════════════════════════ */}
          {service.overview && (
            <section className="mb-16 sm:mb-20">
              <div className="max-w-3xl">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                  {t("overview")}
                </h2>
                <div className="prose text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed space-y-3">
                  {service.overview.split("\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════
            PROBLEMS WE SOLVE
           ═══════════════════════════════════════════════════════════ */}
          {service.problems_we_solve && (
            <SectionCard
              title={t("problemsWeSolve")}
              className="mb-16 sm:mb-20"
            >
              <div className="prose text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed space-y-3">
                {service.problems_we_solve.split("\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </SectionCard>
          )}

          {/* ═══════════════════════════════════════════════════════════
            FEATURES
           ═══════════════════════════════════════════════════════════ */}
          {service.features && (
            <section className="mb-16 sm:mb-20">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                {t("keyFeatures")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.features
                  .split(/\n- |\n• |\n/)
                  .filter(Boolean)
                  .map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4"
                    >
                      <CheckCircle2
                        className="size-5 text-[#13a89e] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-[14px] text-foreground/90">
                        {feat.replace(/^-\s*|^•\s*/, "")}
                      </span>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════
            BENEFITS
           ═══════════════════════════════════════════════════════════ */}
          {service.benefits && (
            <SectionCard title={t("benefits")} className="mb-16 sm:mb-20">
              <div className="prose text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed space-y-3">
                {service.benefits.split("\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </SectionCard>
          )}

          {/* ═══════════════════════════════════════════════════════════
            TECH STACK
           ═══════════════════════════════════════════════════════════ */}
          {service.technologies.length > 0 &&
            (() => {
              // Group technologies by category
              const grouped: Record<string, typeof service.technologies> = {};
              for (const t of service.technologies) {
                const cat = t.category || "other";
                (grouped[cat] ??= []).push(t);
              }
              return (
                <section className="mb-16 sm:mb-20">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                    {t("technologyStack")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Object.entries(grouped).map(([cat, techs]) => {
                      const CatIcon = techLucideIcon(cat, cat);
                      return (
                        <div
                          key={cat}
                          className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5"
                        >
                          <h3 className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <CatIcon className="size-4" />
                            {cat}
                          </h3>
                          <div className="flex flex-wrap gap-1.5">
                            {techs.map((t) => renderTechnology(t))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })()}

          {/* ═══════════════════════════════════════════════════════════
            INDUSTRIES
           ═══════════════════════════════════════════════════════════ */}
          {service.industries.length > 0 && (
            <section className="mb-16 sm:mb-20">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                {t("industriesServed")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {service.industries.map((ind) => (
                  <div
                    key={ind.id}
                    className="group rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/5 hover:border-primary/30"
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
                    {/* Decorative gradient bar */}
                    <div className="mt-3 h-0.5 w-0 group-hover:w-full rounded-full bg-gradient-to-r from-[#0ab8fb] to-[#324b9d] transition-all duration-500" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════
            PROCESS STEPS
           ═══════════════════════════════════════════════════════════ */}
          {processSteps.length > 0 && (
            <section className="mb-16 sm:mb-20">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-8">
                {t("ourProcess")}
              </h2>
              <div className="relative">
                {/* Connecting line */}
                <div
                  aria-hidden="true"
                  className="absolute top-8 left-4 right-4 hidden sm:block"
                >
                  <div className="h-0.5 bg-gradient-to-r from-[#0ab8fb]/20 via-[#324b9d]/30 to-[#0ab8fb]/20" />
                </div>

                <ScrollCarousel>
                  {processSteps.map((step, i) => (
                    <li
                      key={step.id}
                      className="relative flex flex-col items-center text-center rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 snap-start shrink-0 w-[220px] sm:w-[240px] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30"
                    >
                      <span className="flex size-9 items-center justify-center rounded-full bg-brand-gradient text-[13px] font-bold text-white shadow-brand mb-3">
                        {i + 1}
                      </span>
                      <h3 className="text-[14px] font-semibold text-foreground mb-1.5">
                        {step.title}
                      </h3>
                      {step.description && (
                        <p className="text-[12px] text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ScrollCarousel>
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════
            DELIVERABLES
           ═══════════════════════════════════════════════════════════ */}
          {deliverables.length > 0 && (
            <section className="mb-16 sm:mb-20">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                {t("deliverables")}
              </h2>
              <ScrollCarousel>
                {deliverables.map((d) => (
                  <div
                    key={d.id}
                    className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 snap-start shrink-0 w-[260px] sm:w-[280px]"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-primary">{iconFor(d.icon)}</span>
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

          {/* ═══════════════════════════════════════════════════════════
            SERVICE COMPARISON TABLE
           ═══════════════════════════════════════════════════════════ */}
          {comparisonRows.length > 0 && (
            <section className="mb-16 sm:mb-20">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                {t("planComparison")}
              </h2>
              <div className="overflow-x-auto rounded-xl border border-border/50">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="text-left px-4 py-3 font-semibold text-foreground">
                        {t("feature")}
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">
                        {t("standard")}
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-[#13a89e]">
                        {t("premium")}
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-[#324b9d]">
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
                          row.is_highlighted && "bg-[#0ab8fb]/3",
                        )}
                      >
                        <td className="px-4 py-2.5 font-medium text-foreground">
                          {row.feature_name}
                          {row.is_highlighted && (
                            <span className="ml-2 text-[10px] text-[#0a9fdf] font-semibold uppercase">
                              {t("popular")}
                            </span>
                          )}
                        </td>
                        <td className="text-center px-4 py-2.5 text-muted-foreground">
                          {row.standard_value}
                        </td>
                        <td className="text-center px-4 py-2.5 text-[#13a89e] font-medium">
                          {row.premium_value}
                        </td>
                        <td className="text-center px-4 py-2.5 text-[#324b9d] font-medium">
                          {row.enterprise_value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════
            ENTERPRISE FEATURES
           ═══════════════════════════════════════════════════════════ */}
          {enterpriseFeatures.length > 0 && (
            <section className="mb-16 sm:mb-20">
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
                    <div key={i} className="flex items-start gap-2.5">
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

          {/* ═══════════════════════════════════════════════════════════
            ADD-ONS
           ═══════════════════════════════════════════════════════════ */}
          {addOns.length > 0 && (
            <section className="mb-16 sm:mb-20">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                {t("availableAddOns")}
              </h2>
              <ScrollCarousel>
                {addOns.map((addon) => (
                  <div
                    key={addon.id}
                    className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 snap-start shrink-0 w-65 sm:w-70"
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
                      <span className="inline-block mt-2 text-[11px] font-medium text-[#324b9d] bg-[#324b9d]/5 rounded-full px-2.5 py-0.5">
                        {t("includedInEnterprise")}
                      </span>
                    )}
                  </div>
                ))}
              </ScrollCarousel>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════
            CLIENT LOGOS
           ═══════════════════════════════════════════════════════════ */}
          {clientLogos.length > 0 && (
            <section className="mb-16 sm:mb-20">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                {t("trustedBy")}
              </h2>
              <div className="flex flex-wrap gap-4">
                {clientLogos.map((logo) => {
                  const logoContent = logo.logo?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getMediaUrl(logo.logo.url)}
                      alt={logo.client_name}
                      className="max-h-10 max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <span className="text-[13px] font-semibold text-muted-foreground">
                      {logo.client_name}
                    </span>
                  );

                  const cardClasses =
                    "flex items-center justify-center rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-5 h-20 min-w-[140px] transition-colors";

                  return logo.client_url ? (
                    <a
                      key={logo.id}
                      href={logo.client_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        cardClasses,
                        "hover:border-primary/40 hover:bg-card/80",
                      )}
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

          {/* ═══════════════════════════════════════════════════════════
            TESTIMONIALS
           ═══════════════════════════════════════════════════════════ */}
          {testimonials.length > 0 && (
            <section className="mb-16 sm:mb-20">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                {t("clientTestimonials")}
              </h2>
              <ScrollCarousel>
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 snap-start shrink-0 w-[320px] sm:w-[380px]"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "size-3.5",
                            i < t.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-muted-foreground/30",
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <blockquote className="text-[14px] text-foreground/80 italic mb-4 leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-3">
                      {t.client_avatar?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getMediaUrl(t.client_avatar.url)}
                          alt={t.client_name}
                          className="size-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary text-[13px] font-bold">
                          {t.client_name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-[13px] font-semibold text-foreground">
                          {t.client_name}
                        </p>
                        <p className="text-[12px] text-muted-foreground">
                          {t.client_role}
                          {t.client_company ? `, ${t.client_company}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollCarousel>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════
            SLAs
           ═══════════════════════════════════════════════════════════ */}
          {slas.length > 0 && (
            <section className="mb-16 sm:mb-20">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                {t("serviceGuarantees")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {slas.map((sla) => (
                  <div
                    key={sla.id}
                    className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-primary">{iconFor(sla.icon)}</span>
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

          {/* ═══════════════════════════════════════════════════════════
            DOCUMENTS
           ═══════════════════════════════════════════════════════════ */}
          {documents.length > 0 && (
            <section className="mb-16 sm:mb-20">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                {t("resourcesDocuments")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 group hover:border-primary/40 transition-colors"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
                      {doc.document_type_display && (
                        <span className="text-[11px] text-muted-foreground/70">
                          {doc.document_type_display}
                        </span>
                      )}
                    </div>
                    {doc.file?.url && (
                      <a
                        href={getMediaUrl(doc.file.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                      >
                        <Download className="size-4" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════
            FAQs
           ═══════════════════════════════════════════════════════════ */}
          {faqs.length > 0 && (
            <section className="mb-16 sm:mb-20">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                {t("frequentlyAskedQuestions")}
              </h2>
              <div className="space-y-2">
                {faqs.map((faq) => (
                  <FAQItem
                    key={faq.id}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════
            PRICING CTA
           ═══════════════════════════════════════════════════════════ */}
          {(service.starting_price || service.pricing_model_display) && (
            <section className="mb-16 sm:mb-20">
              <div className="rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-6 sm:p-8 text-center">
                <h2 className="text-lg font-bold text-foreground mb-2">
                  {t("pricing")}
                </h2>
                <div className="flex items-center justify-center gap-4 mb-4">
                  {service.starting_price && (
                    <div className="text-center">
                      <p className="text-[12px] text-muted-foreground uppercase tracking-wider">
                        {t("startingAt")}
                      </p>
                      <p className="text-3xl font-bold text-brand-gradient">
                        ${Number(service.starting_price).toLocaleString()}
                        <span className="text-sm text-muted-foreground font-normal">
                          {" "}
                          {service.currency || "USD"}
                        </span>
                      </p>
                    </div>
                  )}
                  {service.pricing_model_display && (
                    <div className="text-center border-l border-border/30 pl-4">
                      <p className="text-[12px] text-muted-foreground uppercase tracking-wider">
                        {t("model")}
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {service.pricing_model_display}
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  asChild
                  size="lg"
                  className="bg-brand-gradient shadow-brand"
                >
                  <Link
                    href={
                      {
                        pathname: ctaUrl,
                        query: { service: service.id },
                      } as any
                    }
                  >
                    {t("getCustomQuote")}
                    <ArrowRight
                      className="size-4 ml-1.5 rtl:rotate-180"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════
            RELATED SERVICES
           ═══════════════════════════════════════════════════════════ */}
          {(relatedServices.length > 0 || relatedSvcs.length > 0) && (
            <section className="mb-16 sm:mb-20">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                {t("relatedServices")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(relatedServices.length > 0
                  ? relatedServices
                  : relatedSvcs.slice(0, 3)
                ).map((s) => {
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

                  return (
                    <Link
                      key={slug}
                      href={`/services/${slug}` as any}
                      className="group flex flex-col rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden hover:border-primary/40 transition-colors hover:-translate-y-0.5"
                    >
                      {img?.url ? (
                        <div className="h-32 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getMediaUrl(img.url)}
                            alt={img.alt_text || name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="h-32 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center" />
                      )}
                      <div className="p-4">
                        <h3 className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors">
                          {name}
                        </h3>
                        {desc && (
                          <p className="text-[12px] text-muted-foreground mt-1 line-clamp-2">
                            {desc}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════
            BOTTOM CTA
           ═══════════════════════════════════════════════════════════ */}
          <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-8 sm:p-12 text-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-[#0ab8fb]/5 via-transparent to-[#324b9d]/5"
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
                className="bg-brand-gradient shadow-brand"
              >
                <Link
                  href={
                    {
                      pathname: ctaUrl,
                      query: { service: service.id },
                    } as any
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
                className="border-brand-gradient"
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

          {/* ═══════════════════════════════════════════════════════════
            ADDITIONAL RESOURCES (thumbnail / video / brochure)
           ═══════════════════════════════════════════════════════════ */}
          {(service.thumbnail_image ||
            service.video_presentation ||
            service.brochure) && (
            <section className="mb-16 sm:mb-20">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                {t("additionalResources")}
              </h2>
              <div className="flex flex-wrap gap-4">
                {service.thumbnail_image?.url && (
                  <a
                    href={getMediaUrl(service.thumbnail_image.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 hover:border-primary/40 transition-colors"
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
                    <ExternalLink className="size-3.5 text-muted-foreground ml-auto" />
                  </a>
                )}
                {service.video_presentation?.url && (
                  <a
                    href={service.video_presentation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#0ab8fb]/10 text-[#0ab8fb]">
                      <Play className="size-5" />
                    </div>
                    <span className="text-[13px] font-medium text-foreground">
                      {t("videoPresentation")}
                    </span>
                    <ExternalLink className="size-3.5 text-muted-foreground ml-auto" />
                  </a>
                )}
                {service.brochure?.url && (
                  <a
                    href={getMediaUrl(service.brochure.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#13a89e]/10 text-[#13a89e]">
                      <FileText className="size-5" />
                    </div>
                    <span className="text-[13px] font-medium text-foreground">
                      {t("serviceBrochure")}
                    </span>
                    <Download className="size-4 text-muted-foreground ml-auto" />
                  </a>
                )}
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════
            PUBLISHED DATE
           ═══════════════════════════════════════════════════════════ */}
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
      <FooterSection />
    </>
  );
}

// ─── Section card wrapper ────────────────────────────────────────────

function SectionCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 sm:p-8",
        className,
      )}
    >
      <h2 className="text-lg font-bold text-foreground mb-4">{title}</h2>
      {children}
    </section>
  );
}

// ─── FAQ accordion item ──────────────────────────────────────────────

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-[14px] font-medium text-foreground hover:bg-muted/20 transition-colors"
      >
        <span>{question}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-[13px] text-muted-foreground leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}
