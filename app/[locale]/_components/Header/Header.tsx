"use client";
// app/(routes)/_components/Header/Header.tsx

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LogOut,
  Search,
  Bot,
  Building2,
  Landmark,
  GraduationCap,
  Factory,
  Truck,
  ShoppingBag,
  HardHat,
  Hotel,
  ShieldCheck,
  Sparkles,
  Layers,
  Cpu,
  Mic,
  ScanText,
  Users,
  Award,
  Handshake,
  Briefcase,
  MessageSquare,
  BookOpen,
  FileText,
  HelpCircle,
  Download,
  Newspaper,
  LayoutDashboard,
  CalendarClock,
  Receipt,
  Headset,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ThemeToggle } from "../Theme/theme-toggle";
import { LanguageSwitcher } from "../Language/LanguageSwitcher";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useAuth } from "@/contexts/AuthContext";
import { MegaMenu, type MegaMenuColumn, type MegaMenuItem } from "./MegaMenu";
import { SearchCommandPalette, type CommandItem } from "./SearchCommandPalette";
import type { ServiceCategory, BlogCategory, Industry, AICapability, PortfolioProjectList, BlogPostListItem, CaseStudyListItem } from "@/lib/automex/types";

interface HeaderProps {
  serviceCategories?: ServiceCategory[];
  blogCategories?: BlogCategory[];
  industries?: Industry[];
  aiCapabilities?: AICapability[];
  portfolioProjects?: PortfolioProjectList[];
  latestBlogs?: BlogPostListItem[];
  latestCaseStudies?: CaseStudyListItem[];
}

export const Header = ({
  serviceCategories,
  blogCategories,
  industries,
  aiCapabilities,
  portfolioProjects,
  latestBlogs,
  latestCaseStudies,
}: HeaderProps = {}) => {
  const t = useTranslations("Header");
  const locale = useLocale();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isRtl = ["ar", "fa", "ps"].includes(locale);
  const isAuthenticated = !!user && !loading;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock the top-level route so the mobile drawer + search close on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  // ── Static nav data ──────────────────────────────────────────────────
  // Services stays fully dynamic (fed by the CMS via `serviceCategories`).
  // Industries / AI Solutions / Company are static, i18n-keyed link sets —
  // the same pattern already used for `crmLinks` — until/unless a real
  // fetchIndustries()/fetchAICapabilities() endpoint exists to swap in.

  const serviceColumns: MegaMenuColumn[] = useMemo(() => {
    const links: MegaMenuItem[] = (serviceCategories ?? []).map((cat) => ({
      name: cat.name,
      href: { pathname: "/services" as const, query: { category: cat.slug } },
    }));
    if (links.length === 0) return [];
    // Split a long flat list into two even columns without inventing groups
    // that aren't in the data.
    const mid = Math.ceil(links.length / 2);
    return links.length > 6
      ? [
          { heading: t("services"), links: links.slice(0, mid) },
          { heading: t("moreServices"), links: links.slice(mid) },
        ]
      : [{ heading: t("services"), links }];
  }, [serviceCategories, t]);

  // ── Icon map for dynamic industries ──────────────────────────────────
  const INDUSTRY_ICON_MAP: Record<string, typeof Landmark> = {
    "lucide:code-2": Cpu,
    "lucide:heart-pulse": Landmark,
    "lucide:graduation-cap": GraduationCap,
    "lucide:landmark": Landmark,
    "lucide:factory": Factory,
    "lucide:truck": Truck,
    "lucide:shopping-bag": ShoppingBag,
    "lucide:hard-hat": HardHat,
    "lucide:utensils": Hotel,
    "lucide:building-2": Building2,
    "lucide:shield-check": ShieldCheck,
  };

  function getIndustryIcon(iconName?: string): typeof Landmark | undefined {
    if (iconName && INDUSTRY_ICON_MAP[iconName]) return INDUSTRY_ICON_MAP[iconName];
    return undefined;
  }

  // Hardcoded fallback — mirrors the old static list so the header still
  // works even when the API is unreachable.  Only used when industries is
  // empty or undefined.
  const fallbackIndustries: MegaMenuItem[] = useMemo(
    () => [
      {
        name: t("industryHealthcare"),
        description: t("industryHealthcareDesc"),
        href: "/industries/healthcare" as const,
        icon: Landmark,
      },
      {
        name: t("industryFinance"),
        description: t("industryFinanceDesc"),
        href: "/industries/finance" as const,
        icon: Building2,
      },
      {
        name: t("industryEducation"),
        description: t("industryEducationDesc"),
        href: "/industries/education" as const,
        icon: GraduationCap,
      },
      {
        name: t("industryGovernment"),
        description: t("industryGovernmentDesc"),
        href: "/industries/government" as const,
        icon: ShieldCheck,
      },
      {
        name: t("industryManufacturing"),
        description: t("industryManufacturingDesc"),
        href: "/industries/manufacturing" as const,
        icon: Factory,
      },
      {
        name: t("industryLogistics"),
        description: t("industryLogisticsDesc"),
        href: "/industries/logistics" as const,
        icon: Truck,
      },
      {
        name: t("industryRetail"),
        description: t("industryRetailDesc"),
        href: "/industries/retail" as const,
        icon: ShoppingBag,
      },
      {
        name: t("industryConstruction"),
        description: t("industryConstructionDesc"),
        href: "/industries/construction" as const,
        icon: HardHat,
      },
      {
        name: t("industryHospitality"),
        description: t("industryHospitalityDesc"),
        href: "/industries/hospitality" as const,
        icon: Hotel,
      },
    ],
    [t],
  );

  const industriesItems: MegaMenuItem[] = useMemo(() => {
    if (industries && industries.length > 0) {
      return industries.map((ind) => ({
        name: ind.name,
        description: ind.description,
        href: `/industries/${ind.slug}` as any,
        icon: getIndustryIcon(ind.icon),
      }));
    }
    return fallbackIndustries;
  }, [industries, fallbackIndustries]);

  // ── Icon map for dynamic AI capabilities ────────────────────────────
  const AI_ICON_MAP: Record<string, typeof Sparkles> = {
    "lucide:sparkles": Sparkles,
    "lucide:bot": Bot,
    "lucide:layers": Layers,
    "lucide:message-square": MessageSquare,
    "lucide:scan-text": ScanText,
    "lucide:mic": Mic,
    "lucide:cpu": Cpu,
    "lucide:file-text": FileText,
    "lucide:brain": Cpu,
    "lucide:wand-sparkles": Sparkles,
  };

  function getAIIcon(iconName?: string): typeof Sparkles | undefined {
    if (iconName && AI_ICON_MAP[iconName]) return AI_ICON_MAP[iconName];
    return undefined;
  }

  // Hardcoded fallback — only used when AI capabilities are not available
  const fallbackAISolutions: MegaMenuItem[] = useMemo(
    () => [
      {
        name: t("aiGenerative"),
        description: t("aiGenerativeDesc"),
        href: {
          pathname: "/solutions/ai-capabilities/[slug]" as const,
          params: { slug: "generative-ai" },
        },
        icon: Sparkles,
      },
      {
        name: t("aiAgents"),
        description: t("aiAgentsDesc"),
        href: {
          pathname: "/solutions/ai-capabilities/[slug]" as const,
          params: { slug: "ai-agents" },
        },
        icon: Bot,
      },
      {
        name: t("aiRag"),
        description: t("aiRagDesc"),
        href: {
          pathname: "/solutions/ai-capabilities/[slug]" as const,
          params: { slug: "rag-systems" },
        },
        icon: Layers,
      },
      {
        name: t("aiNlp"),
        description: t("aiNlpDesc"),
        href: {
          pathname: "/solutions/ai-capabilities/[slug]" as const,
          params: { slug: "nlp" },
        },
        icon: MessageSquare,
      },
      {
        name: t("aiComputerVision"),
        description: t("aiComputerVisionDesc"),
        href: {
          pathname: "/solutions/ai-capabilities/[slug]" as const,
          params: { slug: "computer-vision" },
        },
        icon: ScanText,
      },
      {
        name: t("aiVoice"),
        description: t("aiVoiceDesc"),
        href: {
          pathname: "/solutions/ai-capabilities/[slug]" as const,
          params: { slug: "voice-ai" },
        },
        icon: Mic,
      },
      {
        name: t("aiAutomation"),
        description: t("aiAutomationDesc"),
        href: {
          pathname: "/solutions/ai-capabilities/[slug]" as const,
          params: { slug: "business-automation" },
        },
        icon: Cpu,
      },
    ],
    [t],
  );

  const aiSolutionsItems: MegaMenuItem[] = useMemo(() => {
    if (aiCapabilities && aiCapabilities.length > 0) {
      return aiCapabilities.map((cap) => ({
        name: cap.name,
        description: cap.description,
        href: {
          pathname: "/solutions/ai-capabilities/[slug]" as const,
          params: { slug: cap.slug },
        },
        icon: getAIIcon(cap.icon),
      }));
    }
    return fallbackAISolutions;
  }, [aiCapabilities, fallbackAISolutions]);

  // ── Portfolio items (dynamic from API, fallback to simple link) ──────
  const portfolioItems: MegaMenuItem[] = useMemo(() => {
    if (portfolioProjects && portfolioProjects.length > 0) {
      return portfolioProjects.map((p) => ({
        name: p.title,
        description: p.short_description?.slice(0, 100),
        href: `/portfolio/${p.slug}` as any,
        icon: Briefcase,
      }));
    }
    // Fallback: single card linking to /portfolio
    return [
      {
        name: t("portfolio"),
        description: t("portfolioDesc") || "",
        href: "/portfolio" as const,
        icon: Briefcase,
      },
    ];
  }, [portfolioProjects, t]);

  // ── Resources right-panel toggle state ───────────────────────────────
  type ResourceSection = "blog" | "case-studies" | "tech-expertise" | null;
  const [activeResourceSection, setActiveResourceSection] =
    useState<ResourceSection>(null);

  const toggleResourceSection = useCallback(
    (section: ResourceSection) => {
      setActiveResourceSection((prev) =>
        prev === section ? null : section,
      );
    },
    [],
  );

  const resourcesColumns: MegaMenuColumn[] = useMemo(() => {
    const staticLinks: MegaMenuItem[] = [
      {
        name: t("blog"),
        href: "/blog" as const,
        icon: Newspaper,
        onClick: () => toggleResourceSection("blog"),
      },
      {
        name: t("caseStudies"),
        href: "/case-studies" as const,
        icon: BookOpen,
        onClick: () => toggleResourceSection("case-studies"),
      },
      {
        name: t("techExpertise"),
        href: "/tech-expertise" as const,
        icon: FileText,
        onClick: () => toggleResourceSection("tech-expertise"),
      },
      { name: t("faqs"), href: "/faqs" as const, icon: HelpCircle },
      { name: t("downloads"), href: "/downloads" as const, icon: Download },
    ];
    const columns: MegaMenuColumn[] = [
      { heading: t("resources"), links: staticLinks },
    ];
    return columns;
  }, [t, toggleResourceSection]);

  // ── Dynamic right panel for Resources mega menu ─────────────────────
  const resourcesRightPanel = useMemo(() => {
    if (!activeResourceSection) return null;

    switch (activeResourceSection) {
      case "blog": {
        if (!latestBlogs || latestBlogs.length === 0) return null;
        return {
          heading: t("latestBlogs"),
          items: latestBlogs.map((b) => ({
            name: b.title,
            description: b.excerpt?.slice(0, 80),
            href: `/blog/${b.slug}` as any,
          })),
          viewAllHref: "/blog" as const,
          viewAllLabel: t("viewAllBlog"),
        };
      }
      case "case-studies": {
        if (!latestCaseStudies || latestCaseStudies.length === 0) return null;
        return {
          heading: t("latestCaseStudies"),
          items: latestCaseStudies.map((cs) => ({
            name: cs.title,
            description: cs.client_name,
            href: `/case-studies/${cs.slug}` as any,
          })),
          viewAllHref: "/case-studies" as const,
          viewAllLabel: t("viewAllCaseStudies"),
        };
      }
      case "tech-expertise": {
        if (!aiCapabilities || aiCapabilities.length === 0) return null;
        return {
          heading: t("latestTechExpertise"),
          items: aiCapabilities.slice(0, 5).map((tc) => ({
            name: tc.name,
            description: tc.description?.slice(0, 80),
            href: `/solutions/ai-capabilities/${tc.slug}` as any,
          })),
          viewAllHref: "/solutions/ai-capabilities" as const,
          viewAllLabel: t("viewAllAiSolutions"),
        };
      }
      default:
        return null;
    }
  }, [activeResourceSection, latestBlogs, latestCaseStudies, aiCapabilities, t]);

  const companyItems: MegaMenuItem[] = useMemo(
    () => [
      { name: t("aboutUs"), href: "/about" as const, icon: Users },
      {
        name: t("leadership"),
        href: "/about/leadership" as const,
        icon: Award,
      },
      { name: t("careers"), href: "/careers" as const, icon: Briefcase },
      { name: t("partners"), href: "/partners" as const, icon: Handshake },
      { name: t("contact"), href: "/contact" as const, icon: MessageSquare },
    ],
    [t],
  );

  const crmLinks: MegaMenuItem[] = useMemo(
    () => [
      {
        name: t("crmOverview"),
        description: t("crmOverviewDesc"),
        href: "/crm" as const,
        icon: LayoutDashboard,
      },
      {
        name: t("bookCall"),
        description: t("bookCallDesc"),
        href: "/crm/book-a-call" as const,
        icon: CalendarClock,
      },
      {
        name: t("requestQuote"),
        description: t("requestQuoteDesc"),
        href: "/crm/quote" as const,
        icon: Receipt,
      },
      {
        name: t("contactSales"),
        description: t("contactSalesDesc"),
        href: "/crm/contact-sales" as const,
        icon: Headset,
      },
    ],
    [t],
  );

  // ── Flat, groupable dataset for the command palette ─────────────────
  const commandItems: CommandItem[] = useMemo(() => {
    const toHref = (item: MegaMenuItem): string => {
      const h = item.href;
      if (typeof h === "string") return h;
      // Resolve dynamic route params (e.g. [slug] → "digital-transformation")
      const obj = h as {
        pathname: string;
        params?: Record<string, string>;
        query?: Record<string, string>;
      };
      let pathname = obj.pathname;
      if (obj.params) {
        for (const [key, value] of Object.entries(obj.params)) {
          pathname = pathname.replace(`[${key}]`, value);
        }
      }
      return pathname;
    };
    const items: CommandItem[] = [
      { name: t("home"), href: "/", group: t("navigation") },
      { name: t("contact"), href: "/contact", group: t("navigation") },
      ...portfolioItems.map((l) => ({
        name: l.name,
        href: toHref(l),
        group: t("portfolio"),
      })),
      ...serviceColumns
        .flatMap((c) => c.links)
        .map((l) => ({ name: l.name, href: toHref(l), group: t("services") })),
      ...industriesItems.map((l) => ({
        name: l.name,
        href: toHref(l),
        group: t("industries"),
      })),
      ...aiSolutionsItems.map((l) => ({
        name: l.name,
        href: toHref(l),
        group: t("aiSolutions"),
      })),
      ...resourcesColumns
        .flatMap((c) => c.links)
        .map((l) => ({ name: l.name, href: toHref(l), group: t("resources") })),
      ...companyItems.map((l) => ({
        name: l.name,
        href: toHref(l),
        group: t("company"),
      })),
    ];
    return items;
  }, [
    t,
    serviceColumns,
    industriesItems,
    aiSolutionsItems,
    portfolioItems,
    resourcesColumns,
    companyItems,
  ]);

  return (
    <header>
      <nav
        dir={isRtl ? "rtl" : "ltr"}
        className={cn(
          "fixed top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-300",
          scrolled
            ? "border-border/60 bg-background/80 shadow-sm shadow-black/3"
            : "border-border/30 bg-background/55",
        )}
      >
        {/* ── Row 1: logo · search · account/theme/language ─────────── */}
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/logo/automex-dark.png"
              alt="Automex Logo"
              width={150}
              height={150}
              className="block h-11 w-auto object-contain dark:hidden lg:h-12"
              priority
            />
            <Image
              src="/logo/automex-light.png"
              alt="Automex Logo"
              width={150}
              height={60}
              className="hidden h-11 w-auto object-contain dark:block lg:h-12"
              priority
            />
          </Link>

          {/* Centered search bar — opens the command palette */}
          <div className="flex justify-center">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden w-full max-w-md items-center gap-2.5 rounded-full border border-input bg-muted/40 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-ring/50 hover:bg-muted/70 md:flex"
              aria-label={t("search")}
            >
              <Search className="size-4 shrink-0" />
              <span className="truncate">{t("searchPlaceholder")}</span>
              <kbd className="ms-auto hidden shrink-0 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium lg:inline-block">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Account / theme / language */}
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
              aria-label={t("search")}
            >
              <Search className="size-4" />
            </button>

            <ThemeToggle />
            <LanguageSwitcher />

            {!loading && (
              <>
                {!isAuthenticated ? (
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="hidden border border-input hover:bg-accent hover:text-accent-foreground sm:inline-flex"
                    >
                      <Link href="/sign-in">{t("login")}</Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="hidden bg-color text-white shadow-brand hover:opacity-90 sm:inline-flex"
                    >
                      <Link href="/sign-up">{t("signUp")}</Link>
                    </Button>
                  </>
                ) : (
                  <Button
                    asChild
                    size="sm"
                    className="hidden bg-color text-white shadow-brand hover:opacity-90 sm:inline-flex"
                  >
                    <Link href="/dashboard">{t("dashboard")}</Link>
                  </Button>
                )}
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden"
              aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* ── Row 2: primary nav / mega menus (desktop only) ─────────── */}
        <div className="hidden border-t border-border/60 lg:block">
          <div className="mx-auto flex h-12 max-w-7xl items-center justify-center gap-0.5 px-4 sm:px-6 lg:px-8">
            <NavLink href="/" label={t("home")} active={isActive("/")} />

            <MegaMenu
              label={t("services")}
              description={t("servicesDescription")}
              columns={serviceColumns}
              viewAllHref="/services"
              viewAllLabel={t("viewAllServices")}
              featured={{
                title: t("featuredTitle"),
                description: t("featuredDescription"),
                href: {
                  pathname: "/services/[slug]" as const,
                  params: { slug: "digital-transformation" },
                },
                ctaLabel: t("learnMore"),
              }}
              isRtl={isRtl}
            />

            <MegaMenu
              label={t("industries")}
              description={t("industriesDescription")}
              cards={industriesItems}
              viewAllHref="/industries"
              viewAllLabel={t("viewAllIndustries")}
              isRtl={isRtl}
            />

            <MegaMenu
              label={t("aiSolutions")}
              description={t("aiSolutionsDescription")}
              cards={aiSolutionsItems}
              viewAllHref="/solutions/ai-capabilities"
              viewAllLabel={t("viewAllAiSolutions")}
              isRtl={isRtl}
            />

            <MegaMenu
              label={t("portfolio")}
              description={t("portfolioDesc")}
              cards={portfolioItems}
              viewAllHref="/portfolio"
              viewAllLabel={t("viewAllPortfolio")}
              isRtl={isRtl}
            />

            <MegaMenu
              label={t("resources")}
              columns={resourcesColumns}
              rightPanel={resourcesRightPanel}
              isRtl={isRtl}
            />

            <MegaMenu
              label={t("company")}
              simple={companyItems}
              isRtl={isRtl}
            />

            <MegaMenu label={t("crm")} cards={crmLinks} isRtl={isRtl} />
          </div>
        </div>
      </nav>

      {/* Mobile drawer — full height, slide-in from the trailing edge */}
      <div
        className={cn(
          "fixed inset-0 z-[90] lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!menuOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMenuOpen(false)}
        />
        <div
          dir={isRtl ? "rtl" : "ltr"}
          className={cn(
            "absolute top-0 flex h-full w-[85%] max-w-sm flex-col bg-background shadow-2xl transition-transform duration-300 ease-out",
            isRtl ? "left-0" : "right-0",
            menuOpen
              ? "translate-x-0"
              : isRtl
                ? "-translate-x-full"
                : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-4">
            <span className="text-sm font-semibold text-foreground">
              {t("menu")}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(false)}
              aria-label={t("closeMenu")}
            >
              <X size={18} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <div className="flex flex-col gap-1">
              <MobileLink
                href="/"
                label={t("home")}
                active={isActive("/")}
                onClick={() => setMenuOpen(false)}
              />
              <MobileAccordion
                label={t("services")}
                links={serviceColumns.flatMap((c) => c.links)}
              />
              <MobileAccordion
                label={t("industries")}
                links={industriesItems}
              />
              <MobileAccordion
                label={t("aiSolutions")}
                links={aiSolutionsItems}
              />
              <MobileAccordion
                label={t("portfolio")}
                links={portfolioItems}
              />
              <MobileAccordion
                label={t("resources")}
                links={resourcesColumns.flatMap((c) => c.links)}
              />
              <MobileAccordion label={t("company")} links={companyItems} />
              <MobileAccordion label={t("crm")} links={crmLinks} />
            </div>
          </div>

          {/* Fixed footer: search + auth CTAs stay reachable without scrolling */}
          <div className="border-t border-border p-4">
            <button
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              className="mb-3 flex w-full items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm text-muted-foreground"
            >
              <Search className="size-4" />
              {t("search")}
            </button>

            {!loading && (
              <div className="flex flex-col gap-2">
                {!isAuthenticated ? (
                  <>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/sign-in" onClick={() => setMenuOpen(false)}>
                        {t("login")}
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-color text-white shadow-brand hover:opacity-90"
                    >
                      <Link href="/sign-up" onClick={() => setMenuOpen(false)}>
                        {t("signUp")}
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      className="w-full bg-color text-white shadow-brand hover:opacity-90"
                    >
                      <Link
                        href="/dashboard"
                        onClick={() => setMenuOpen(false)}
                      >
                        {t("dashboard")}
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-destructive hover:bg-destructive/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="size-4 me-2" />
                      {t("logout")}
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <SearchCommandPalette
        items={commandItems}
        placeholder={t("searchPlaceholder")}
        emptyLabel={t("searchEmpty")}
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />
    </header>
  );
};

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href as never}
      className={cn(
        "relative rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {label}
      {active && (
        <span className="absolute inset-x-2.5 -bottom-[1px] h-0.5 rounded-full bg-brand-gradient" />
      )}
    </Link>
  );
}

// Mobile Accordion — generic dropdown for mega-menu groups
function MobileAccordion({
  label,
  links,
}: {
  label: string;
  links: MegaMenuItem[];
}) {
  const [open, setOpen] = useState(false);
  if (links.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        aria-expanded={open}
      >
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="py-1 pl-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {Icon && <Icon className="size-4 shrink-0" />}
                <span className="truncate">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MobileLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href as never}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {label}
      <ChevronRight className="size-4 text-muted-foreground/50 rtl:rotate-180" />
    </Link>
  );
}
