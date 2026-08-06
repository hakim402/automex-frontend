"use client";
// app/[locale]/_components/Header/Header.tsx

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LogOut,
  Search,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
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
import type {
  ServiceCategory,
  ServiceListItem,
  Industry,
  AICapability,
  PortfolioProjectList,
  BlogPostListItem,
  CaseStudyListItem,
  TechExpertiseArea,
  Partner,
} from "@/lib/automex/types";

interface HeaderProps {
  serviceCategories?: ServiceCategory[];
  services?: ServiceListItem[];
  industries?: Industry[];
  aiCapabilities?: AICapability[];
  portfolioProjects?: PortfolioProjectList[];
  latestBlogs?: BlogPostListItem[];
  latestCaseStudies?: CaseStudyListItem[];
  techExpertiseAreas?: TechExpertiseArea[];
  partners?: Partner[];
}

/** Resolve any lucide:icon-name string to a Lucide component, with fallback. */
function resolveLucideIcon(iconName: string | undefined): LucideIcon {
  if (!iconName) return Sparkles;
  const name = iconName.startsWith("lucide:") ? iconName.slice(7) : iconName;
  const pascal = name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
  const map = LucideIcons as unknown as Record<string, LucideIcon>;
  return map[pascal] || Sparkles;
}

export const Header = ({
  serviceCategories,
  services,
  industries,
  aiCapabilities,
  portfolioProjects,
  latestBlogs,
  latestCaseStudies,
  techExpertiseAreas,
  partners,
}: HeaderProps = {}) => {
  const t = useTranslations("Header");
  const locale = useLocale();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isRtl = ["ar"].includes(locale);
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

  // ── Services menu: grouped by category ──────────────────────────────
  const serviceColumns: MegaMenuColumn[] = useMemo(() => {
    if (!services || services.length === 0) {
      if (!serviceCategories || serviceCategories.length === 0) return [];
      const links = serviceCategories.map((cat) => ({
        name: cat.name,
        href: { pathname: "/services" as const, query: { category: cat.slug } },
        icon: resolveLucideIcon(cat.icon),
      }));
      return [{ heading: t("services"), links }];
    }

    const grouped = new Map<string, MegaMenuItem[]>();
    for (const svc of services) {
      const catName = svc.category?.name || t("other");
      if (!grouped.has(catName)) grouped.set(catName, []);
      grouped.get(catName)!.push({
        name: svc.name,
        href: `/services/${svc.slug}` as any,
        icon: resolveLucideIcon(svc.icon),
      });
    }
    return Array.from(grouped.entries()).map(([heading, links]) => ({
      heading,
      links,
    }));
  }, [services, serviceCategories, t]);

  // ── All other menus use `simple` (icon + name, no descriptions) ─────

  const industriesItems: MegaMenuItem[] = useMemo(() => {
    if (!industries || industries.length === 0) return [];
    return industries.map((ind) => ({
      name: ind.name,
      href: `/industries/${ind.slug}` as any,
      icon: resolveLucideIcon(ind.icon),
    }));
  }, [industries]);

  const aiSolutionsItems: MegaMenuItem[] = useMemo(() => {
    if (!aiCapabilities || aiCapabilities.length === 0) return [];
    return aiCapabilities.map((cap) => ({
      name: cap.name,
      href: {
        pathname: "/solutions/ai-capabilities/[slug]" as const,
        params: { slug: cap.slug },
      },
      icon: resolveLucideIcon(cap.icon),
    }));
  }, [aiCapabilities]);

  const expertiseItems: MegaMenuItem[] = useMemo(() => {
    if (!techExpertiseAreas || techExpertiseAreas.length === 0) return [];
    return techExpertiseAreas.map((area) => ({
      name: area.name,
      href: `/tech-expertise/${area.slug}` as any,
      icon: resolveLucideIcon(area.icon),
    }));
  }, [techExpertiseAreas]);

  const portfolioItems: MegaMenuItem[] = useMemo(() => {
    if (!portfolioProjects || portfolioProjects.length === 0) return [];
    return portfolioProjects.map((p) => ({
      name: p.title,
      href: `/portfolio/${p.slug}` as any,
      icon: resolveLucideIcon((p as any).icon || undefined),
    }));
  }, [portfolioProjects]);

  const caseStudiesItems: MegaMenuItem[] = useMemo(() => {
    if (!latestCaseStudies || latestCaseStudies.length === 0) return [];
    return latestCaseStudies.map((cs) => ({
      name: cs.title,
      href: `/case-studies/${cs.slug}` as any,
      icon: resolveLucideIcon((cs as any).icon || undefined),
    }));
  }, [latestCaseStudies]);

  const partnersItems: MegaMenuItem[] = useMemo(() => {
    if (!partners || partners.length === 0) return [];
    return partners.map((p) => ({
      name: p.name,
      href: `/partners/${p.slug}` as any,
      imageUrl: p.logo?.url || undefined,
      imageAlt: p.logo?.alt_text || p.name,
    }));
  }, [partners]);

  // ── Blog menu ──────────────────────────────────────────────────────
  const blogItems: MegaMenuItem[] = useMemo(() => {
    if (!latestBlogs || latestBlogs.length === 0) {
      // Fallback: just a link to /blog
      return [
        {
          name: t("blog"),
          href: "/blog" as const,
          icon: resolveLucideIcon("newspaper"),
        },
      ];
    }
    return latestBlogs.slice(0, 8).map((b) => ({
      name: b.title,
      href: `/blog/${b.slug}` as any,
      icon: resolveLucideIcon("newspaper"), // or maybe custom icon per post? keep consistent
    }));
  }, [latestBlogs, t]);

  // ── Company menu ─────────────────────────────────────────────────────
  const companyItems: MegaMenuItem[] = useMemo(
    () => [
      {
        name: t("aboutUs"),
        href: "/about" as const,
        icon: resolveLucideIcon("users"),
      },
      {
        name: t("contact"),
        href: "/contact" as const,
        icon: resolveLucideIcon("message-square"),
      },
      {
        name: t("faqs"),
        href: "/faqs" as const,
        icon: resolveLucideIcon("help-circle"),
      },
    ],
    [t],
  );

  // ── CRM menu ─────────────────────────────────────────────────────────
  const crmLinks: MegaMenuItem[] = useMemo(
    () => [
      {
        name: t("crmOverview"),
        href: "/crm" as const,
        icon: resolveLucideIcon("layout-dashboard"),
      },
      {
        name: t("bookCall"),
        href: "/crm/book-a-call" as const,
        icon: resolveLucideIcon("calendar-clock"),
      },
      {
        name: t("requestQuote"),
        href: "/crm/quote" as const,
        icon: resolveLucideIcon("receipt"),
      },
      {
        name: t("contactSales"),
        href: "/crm/contact-sales" as const,
        icon: resolveLucideIcon("headset"),
      },
    ],
    [t],
  );

  // ── Command Palette items ────────────────────────────────────────────
  const commandItems: CommandItem[] = useMemo(() => {
    const toHref = (item: MegaMenuItem): string => {
      const h = item.href;
      if (typeof h === "string") return h;
      const obj = h as { pathname: string; params?: Record<string, string> };
      let pathname = obj.pathname;
      if (obj.params) {
        for (const [key, value] of Object.entries(obj.params)) {
          pathname = pathname.replace(`[${key}]`, value);
        }
      }
      return pathname;
    };

    const allItems: CommandItem[] = [
      { name: t("home"), href: "/", group: t("navigation") },
      ...serviceColumns.flatMap((c) =>
        c.links.map((l) => ({
          name: l.name,
          href: toHref(l),
          group: t("services"),
        })),
      ),
      ...aiSolutionsItems.map((l) => ({
        name: l.name,
        href: toHref(l),
        group: t("solutions"),
      })),
      ...industriesItems.map((l) => ({
        name: l.name,
        href: toHref(l),
        group: t("industries"),
      })),
      ...expertiseItems.map((l) => ({
        name: l.name,
        href: toHref(l),
        group: t("expertise"),
      })),
      ...portfolioItems.map((l) => ({
        name: l.name,
        href: toHref(l),
        group: t("portfolio"),
      })),
      ...caseStudiesItems.map((l) => ({
        name: l.name,
        href: toHref(l),
        group: t("caseStudies"),
      })),
      ...partnersItems.map((l) => ({
        name: l.name,
        href: toHref(l),
        group: t("partners"),
      })),
      ...blogItems.map((l) => ({
        name: l.name,
        href: toHref(l),
        group: t("blog"),
      })),
      ...companyItems.map((l) => ({
        name: l.name,
        href: toHref(l),
        group: t("company"),
      })),
      ...crmLinks.map((l) => ({
        name: l.name,
        href: toHref(l),
        group: t("crm"),
      })),
    ];
    return allItems;
  }, [
    t,
    serviceColumns,
    aiSolutionsItems,
    industriesItems,
    expertiseItems,
    portfolioItems,
    caseStudiesItems,
    partnersItems,
    blogItems,
    companyItems,
    crmLinks,
  ]);

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <header>
      <nav
        dir={isRtl ? "rtl" : "ltr"}
        className={cn(
          "fixed top-0 z-50 w-full border-b transition-all duration-300",
          scrolled
            ? "border-border/60 bg-background/80 shadow-sm shadow-black/3 backdrop-blur-xl"
            : "border-transparent bg-transparent backdrop-blur-0",
        )}
      >
        {/* Row 1: logo · search · account/theme/language */}
        <div className="mx-auto grid h-20 max-w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-20">
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

        {/* Row 2: primary nav / mega menus (desktop only) */}
        <div className="hidden border-t border-border/60 lg:block">
          <div className="mx-auto flex h-12 max-w-7xl items-center justify-center gap-0.5 px-4 sm:px-6 lg:px-8">
            <NavLink href="/" label={t("home")} active={isActive("/")} />

            {/* ── Services: uses `columns` with featured, already wide ── */}
            {serviceColumns.length > 0 && (
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
            )}

            {/* ── All other menus use `simple` + `wide={true}` to match width ── */}
            {aiSolutionsItems.length > 0 && (
              <MegaMenu
                label={t("solutions")}
                description={t("solutionsDescription")}
                simple={aiSolutionsItems}
                viewAllHref="/solutions/ai-capabilities"
                viewAllLabel={t("viewAllSolutions")}
                wide={true}
                isRtl={isRtl}
              />
            )}

            {industriesItems.length > 0 && (
              <MegaMenu
                label={t("industries")}
                description={t("industriesDescription")}
                simple={industriesItems}
                viewAllHref="/industries"
                viewAllLabel={t("viewAllIndustries")}
                wide={true}
                isRtl={isRtl}
              />
            )}

            {expertiseItems.length > 0 && (
              <MegaMenu
                label={t("expertise")}
                description={t("expertiseDescription")}
                simple={expertiseItems}
                viewAllHref="/tech-expertise"
                viewAllLabel={t("viewAllExpertise")}
                wide={true}
                isRtl={isRtl}
              />
            )}

            {portfolioItems.length > 0 && (
              <MegaMenu
                label={t("portfolio")}
                description={t("portfolioDesc")}
                simple={portfolioItems}
                viewAllHref="/portfolio"
                viewAllLabel={t("viewAllPortfolio")}
                wide={true}
                isRtl={isRtl}
              />
            )}

            {caseStudiesItems.length > 0 && (
              <MegaMenu
                label={t("caseStudies")}
                description={t("caseStudiesDescription")}
                simple={caseStudiesItems}
                viewAllHref="/case-studies"
                viewAllLabel={t("viewAllCaseStudies")}
                wide={true}
                isRtl={isRtl}
              />
            )}

            {partnersItems.length > 0 && (
              <MegaMenu
                label={t("partners")}
                description={t("partnersDescription")}
                simple={partnersItems}
                viewAllHref="/partners"
                viewAllLabel={t("viewAllPartners")}
                wide={true}
                align="end"
                isRtl={isRtl}
              />
            )}

            {/* ── Blog: top-level, uses `simple` with recent posts ── */}
            {blogItems.length > 0 && (
              <MegaMenu
                label={t("blog")}
                description={t("blogDescription")}
                simple={blogItems}
                viewAllHref="/blog"
                viewAllLabel={t("viewAllBlog")}
                wide={true}
                align="end"
                isRtl={isRtl}
              />
            )}

            {/* ── Company ── */}
            <MegaMenu
              label={t("company")}
              simple={companyItems}
              wide={false}
              align="end"
              isRtl={isRtl}
            />

            {/* ── CRM ── */}
            <MegaMenu
              label={t("crm")}
              simple={crmLinks}
              wide={false}
              align="end"
              isRtl={isRtl}
            />
          </div>
        </div>
      </nav>

      {/* Mobile drawer – unchanged */}
      <div
        className={cn(
          "fixed inset-0 z-90 lg:hidden",
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
              {serviceColumns.length > 0 && (
                <MobileAccordion
                  label={t("services")}
                  links={serviceColumns.flatMap((c) => c.links)}
                />
              )}
              {aiSolutionsItems.length > 0 && (
                <MobileAccordion
                  label={t("solutions")}
                  links={aiSolutionsItems}
                />
              )}
              {industriesItems.length > 0 && (
                <MobileAccordion
                  label={t("industries")}
                  links={industriesItems}
                />
              )}
              {expertiseItems.length > 0 && (
                <MobileAccordion
                  label={t("expertise")}
                  links={expertiseItems}
                />
              )}
              {portfolioItems.length > 0 && (
                <MobileAccordion
                  label={t("portfolio")}
                  links={portfolioItems}
                />
              )}
              {caseStudiesItems.length > 0 && (
                <MobileAccordion
                  label={t("caseStudies")}
                  links={caseStudiesItems}
                />
              )}
              {partnersItems.length > 0 && (
                <MobileAccordion label={t("partners")} links={partnersItems} />
              )}
              {blogItems.length > 0 && (
                <MobileAccordion label={t("blog")} links={blogItems} />
              )}
              <MobileAccordion label={t("company")} links={companyItems} />
              <MobileAccordion label={t("crm")} links={crmLinks} />
            </div>
          </div>

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

// ─── Subcomponents ──────────────────────────────────────────────────────

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
        <span className="absolute inset-x-2.5 -bottom-px h-0.5 rounded-full bg-brand-gradient" />
      )}
    </Link>
  );
}

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
          {links.map((link, index) => {
            const Icon = link.icon;
            const key = link.name ? `${link.name}-${index}` : `link-${index}`;
            return (
              <Link
                key={key}
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
