"use client";

// app/[locale]/_components/Header/MegaMenu.tsx
//
// Enterprise mega-menu dropdown for the header navigation.
// Supports three shapes, driven by the props you pass in:
//   1. `columns`  — grouped links with a heading each (e.g. Services)
//   2. `simple`   — a single flat grid of links, no headings (e.g. Company)
//   3. `featured` — an optional highlighted card docked to the right/end
//
// Hover-to-open on desktop (with a close delay so moving the mouse across
// the gap doesn't dismiss it), click/Enter toggles on any input type,
// Escape and click-away both close it.

import { useState, useEffect, useRef, useId } from "react";
import { ChevronDown, ArrowRight, Sparkles, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";

type LinkHref = React.ComponentProps<typeof Link>["href"];

export interface MegaMenuItem {
  name: string;
  href: LinkHref;
  icon?: LucideIcon;
  description?: string;
  /** Fires on click — when present, the default navigate+close behaviour is skipped. */
  onClick?: () => void;
}

export interface MegaMenuColumn {
  heading: string;
  links: MegaMenuItem[];
}

export interface MegaMenuFeatured {
  title: string;
  description: string;
  href: LinkHref;
  ctaLabel: string;
}

export interface MegaMenuRightPanel {
  heading: string;
  items: MegaMenuItem[];
  viewAllHref?: LinkHref;
  viewAllLabel?: string;
}

interface MegaMenuProps {
  label: string;
  /** Short line under the menu title, top-left of the panel. */
  description?: string;
  /** Grouped columns, each with its own heading. Use this OR `simple`. */
  columns?: MegaMenuColumn[];
  /** Flat list of links with no group headings. Use this OR `columns`. */
  simple?: MegaMenuItem[];
  /** Flat list rendered as bordered, icon-badge cards with descriptions — for icon-rich menus like AI Solutions. Use instead of `simple`. */
  cards?: MegaMenuItem[];
  viewAllHref?: LinkHref;
  viewAllLabel?: string;
  featured?: MegaMenuFeatured;
  /** Dynamic right-side panel that shows contextual cards (e.g. latest blogs when hovering Blog). */
  rightPanel?: MegaMenuRightPanel | null;
  isRtl?: boolean;
  /** Force a fixed-width, multi-column panel even for a single group. */
  wide?: boolean;
}

export function MegaMenu({
  label,
  description,
  columns,
  simple,
  cards,
  viewAllHref,
  viewAllLabel,
  featured,
  rightPanel,
  isRtl = false,
  wide = false,
}: MegaMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelId = useId();

  const hasContent =
    (columns && columns.length > 0) || (simple && simple.length > 0) || (cards && cards.length > 0);
  // Icon-only accent used before each column heading — purely decorative.
  const HeadingDot = () => (
    <span className="mr-1.5 inline-block size-1.5 rounded-full bg-brand-gradient align-middle" />
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const handleClickAway = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClickAway);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClickAway);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  if (!hasContent) return null;

  const isMultiColumn = !!columns && columns.length > 1;
  // A featured card sits alongside the content and needs its own room, so it
  // forces the wide layout even when there's only a single link column.
  const forceWide = wide || isMultiColumn || !!featured || !!cards || !!rightPanel;
  const panelWidthClass = forceWide
    ? "w-[calc(100vw-2rem)] max-w-[38rem] lg:max-w-[46rem]"
    : "w-64";

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
      >
        {label}
        <ChevronDown className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>

      <div
        id={panelId}
        dir={isRtl ? "rtl" : "ltr"}
        role="menu"
        className={cn(
          "absolute top-full z-50 mt-2 origin-top overflow-hidden rounded-2xl border border-border bg-popover/95 shadow-2xl shadow-black/5 backdrop-blur-xl transition-all duration-150",
          isRtl ? "right-0" : "left-0",
          panelWidthClass,
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        )}
      >
        <div className="h-[3px] w-full bg-brand-gradient" aria-hidden="true" />
        <div className="flex">
          {/* Main content */}
          <div className="flex flex-1 flex-col p-6">
            {description && (
              <div className="mb-5 flex items-start justify-between gap-4 border-b border-border/60 pb-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
                </div>
                {viewAllHref && viewAllLabel && (
                  <Link
                    href={viewAllHref}
                    onClick={() => setOpen(false)}
                    className="hidden shrink-0 items-center gap-1 whitespace-nowrap text-sm font-medium text-primary hover:underline sm:inline-flex"
                  >
                    {viewAllLabel}
                    <ArrowRight className="size-3.5 rtl:rotate-180" />
                  </Link>
                )}
              </div>
            )}

            {/* Scrollable list region — keeps the panel at a standard height
                no matter how many links a menu ends up with. */}
            <div className="max-h-[22rem] overflow-y-auto pe-1 -me-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent">
              {columns && (
                <div
                  className={cn(
                    "grid gap-x-8 gap-y-6",
                    columns.length > 1 ? "grid-cols-2" : "grid-cols-1"
                  )}
                >
                  {columns.map((col, i) => (
                    <div key={col.heading} className={cn(i > 0 && "border-s border-border/60 ps-8")}>
                      <p className="mb-2.5 flex items-center text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                        <HeadingDot />
                        {col.heading}
                      </p>
                      <ul className="space-y-0.5">
                        {col.links.map((item) => (
                          <MenuLink key={item.name} item={item} onNavigate={() => setOpen(false)} />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {simple && (
                <ul
                  className={cn(
                    "grid gap-x-8 gap-y-0.5",
                    simple.length > 6 && "grid-cols-2"
                  )}
                >
                  {simple.map((item) => (
                    <MenuLink key={item.name} item={item} onNavigate={() => setOpen(false)} />
                  ))}
                </ul>
              )}

              {cards && (
                <div className={cn("grid gap-1.5", cards.length > 4 && "grid-cols-2")}>
                  {cards.map((item) => (
                    <CardLink key={item.name} item={item} onNavigate={() => setOpen(false)} />
                  ))}
                </div>
              )}
            </div>

            {viewAllHref && viewAllLabel && !description && (
              <div className="mt-3 border-t border-border/60 pt-3">
                <Link
                  href={viewAllHref}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent"
                >
                  {viewAllLabel}
                  <ArrowRight className="size-3.5 rtl:rotate-180" />
                </Link>
              </div>
            )}
          </div>

          {/* Right-side dynamic panel (e.g. latest blog posts on hover) */}
          {rightPanel && rightPanel.items.length > 0 && (
            <div className="hidden w-60 shrink-0 flex-col overflow-hidden border-s border-border/60 bg-brand-soft/40 p-5 sm:flex">
              <p className="mb-3 flex items-center text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                <span className="mr-1.5 inline-block size-1.5 rounded-full bg-brand-gradient align-middle" />
                {rightPanel.heading}
              </p>
              <div className="flex-1 space-y-1 overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent">
                {rightPanel.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-2.5 py-2 text-sm font-medium text-popover-foreground transition-colors hover:bg-background/80"
                  >
                    <span className="block truncate">{item.name}</span>
                    {item.description && (
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
              {rightPanel.viewAllHref && rightPanel.viewAllLabel && (
                <Link
                  href={rightPanel.viewAllHref}
                  onClick={() => setOpen(false)}
                  className="mt-3 flex items-center justify-center gap-1 rounded-lg border border-border/50 bg-background/50 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-background hover:border-border"
                >
                  {rightPanel.viewAllLabel}
                  <ArrowRight className="size-3 rtl:rotate-180" />
                </Link>
              )}
            </div>
          )}

          {/* Featured card */}
          {featured && (
            <Link
              href={featured.href}
              onClick={() => setOpen(false)}
              className="group relative hidden w-64 shrink-0 flex-col justify-between overflow-hidden border-s border-border/60 bg-brand-soft p-6 transition-all duration-200 hover:brightness-[1.03] sm:flex"
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-brand-gradient opacity-[0.12] transition-transform duration-300 group-hover:scale-110"
                aria-hidden="true"
              />
              <div className="relative">
                <span className="mb-3 inline-flex size-9 items-center justify-center rounded-xl bg-color text-white shadow-brand">
                  <Sparkles className="size-4" />
                </span>
                <p className="text-sm font-semibold text-foreground">{featured.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {featured.description}
                </p>
              </div>
              <span className="relative mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                {featured.ctaLabel}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function CardLink({ item, onNavigate }: { item: MegaMenuItem; onNavigate: () => void }) {
  const Icon = item.icon;
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.onClick) {
      e.preventDefault();
      item.onClick();
    } else {
      onNavigate();
    }
  };
  return (
    <Link
      href={item.href}
      role="menuitem"
      onClick={handleClick}
      className="group/card relative flex items-start gap-3 rounded-xl border border-transparent p-3 transition-all duration-150 hover:border-border hover:bg-accent hover:shadow-sm"
    >
      {Icon && (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-primary transition-transform duration-150 group-hover/card:scale-105">
          <Icon className="size-4.5" />
        </span>
      )}
      <span className="min-w-0 pt-0.5">
        <span className="block truncate text-sm font-medium text-popover-foreground">{item.name}</span>
        {item.description && (
          <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
            {item.description}
          </span>
        )}
      </span>
    </Link>
  );
}

function MenuLink({ item, onNavigate }: { item: MegaMenuItem; onNavigate: () => void }) {
  const Icon = item.icon;
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.onClick) {
      e.preventDefault();
      item.onClick();
    } else {
      onNavigate();
    }
  };
  return (
    <li>
      <Link
        href={item.href}
        role="menuitem"
        onClick={handleClick}
        className="group/link relative flex items-start gap-2.5 rounded-lg px-2 py-1.5 text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <span className="absolute inset-y-1.5 start-0 w-0.5 scale-y-0 rounded-full bg-brand-gradient transition-transform duration-150 group-hover/link:scale-y-100" />
        {Icon && <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />}
        <span className="min-w-0">
          <span className="block truncate">{item.name}</span>
          {item.description && (
            <span className="block truncate text-xs text-muted-foreground">
              {item.description}
            </span>
          )}
        </span>
      </Link>
    </li>
  );
}