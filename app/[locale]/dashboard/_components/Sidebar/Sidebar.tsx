/**
 * Sidebar.tsx — Dashboard sidebar navigation
 *
 * Features:
 *   • Collapsible on desktop (icon-only mode)
 *   • Mobile drawer with backdrop
 *   • Active route highlighting with brand gradient
 *   • RTL support via useSidebar + dir attribute
 *   • i18n via useTranslations("Sidebar")
 *   • User profile chip at bottom
 *   • Logout via useAuth()
 */
"use client";

import {
  LayoutDashboard,
  PackageSearch,
  Video,
  BriefcaseBusiness,
  BotMessageSquare,
  Bell,
  UserCircle,
  ShieldCheck,
  Settings2,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, Link } from "@/i18n/routing";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/sidebar-context";
import { useAuth } from "@/contexts/AuthContext";

// ─── Nav item type ────────────────────────────────────────────────────────────

interface NavItem {
  icon: React.ElementType;
  labelKey: string;
  href: string;
  badge?: number;
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const MAIN_NAV: NavItem[] = [
  { icon: LayoutDashboard,   labelKey: "dashboard",      href: "/dashboard" },
  { icon: PackageSearch,     labelKey: "myRequests",     href: "/dashboard/requests" },
  { icon: Video,             labelKey: "videoBookings",  href: "/dashboard/bookings" },
  { icon: BriefcaseBusiness, labelKey: "consulting",     href: "/dashboard/consulting" },
  { icon: BotMessageSquare,  labelKey: "support",        href: "/dashboard/support" },
];

const BOTTOM_NAV: NavItem[] = [
  { icon: Bell,        labelKey: "notifications", href: "/dashboard/notifications" },
  { icon: UserCircle,  labelKey: "profile",       href: "/profile" },
  { icon: ShieldCheck, labelKey: "security",      href: "/security" },
];

// ─────────────────────────────────────────────────────────────────────────────

export function Sidebar() {
  const t                                         = useTranslations("Sidebar");
  const { collapsed, setCollapsed,
          mobileOpen, setMobileOpen }             = useSidebar();
  const { user, logout }                          = useAuth();
  const pathname                                  = usePathname();

  const close = () => setMobileOpen(false);

  /** True when the given route is the current page. */
  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  /** First letter of the user's name for the avatar chip. */
  const initial = user?.full_name?.charAt(0).toUpperCase() ?? "U";

  return (
    <>
      {/* ── Mobile backdrop ─────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={close}
        />
      )}

      {/* ── Sidebar panel ───────────────────────────────────────────────── */}
      <aside
        className={cn(
          // Base
          "fixed top-0 z-50 h-screen flex flex-col",
          "bg-sidebar border-sidebar-border/10",
          "transition-all duration-300 ease-in-out",
          // LTR/RTL border side
          "ltr:border-r rtl:border-l",
          // Desktop: always visible, width toggles
          "lg:translate-x-0",
          collapsed ? "lg:w-18" : "lg:w-64",
          // Mobile: full width drawer, slides in/out
          "w-64",
          mobileOpen
            ? "translate-x-0"
            : "ltr:-translate-x-full rtl:translate-x-full lg:translate-x-0",
        )}
      >
        {/* ── Header row ──────────────────────────────────────────────── */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-sidebar-border/10 px-4 shrink-0",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={close}
            className="flex items-center gap-2.5 overflow-hidden"
          >
            <Image
              src="/logo/idwe.png"
              alt="IDWE"
              width={32}
              height={32}
              className="size-8 shrink-0 object-contain"
              priority
            />
            {!collapsed && (
              <span className="font-bold text-[15px] text-sidebar-foreground
                               truncate tracking-tight">
                IDWE
              </span>
            )}
          </Link>

          {/* Collapse toggle — desktop only */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex size-7 text-sidebar-foreground/50
                       hover:text-sidebar-foreground hover:bg-sidebar-accent/15"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="inline-block rtl:rotate-180">
              {collapsed
                ? <ChevronRight className="size-4" />
                : <ChevronLeft  className="size-4" />}
            </span>
          </Button>

          {/* Close button — mobile only */}
          <Button
            variant="ghost"
            size="icon"
            onClick={close}
            className="lg:hidden size-7 text-sidebar-foreground/50
                       hover:text-sidebar-foreground hover:bg-sidebar-accent/15"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* ── Navigation ──────────────────────────────────────────────── */}
        <nav className="flex flex-col flex-1 overflow-y-auto py-4 px-3 gap-0.5">

          {/* Main nav */}
          <div className="flex flex-col gap-0.5">
            {MAIN_NAV.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={isActive(item.href)}
                collapsed={collapsed}
                label={t(item.labelKey)}
                onClick={close}
              />
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1 min-h-4" />

          {/* Bottom nav */}
          <div className="flex flex-col gap-0.5 border-t border-sidebar-border/10 pt-3">
            {BOTTOM_NAV.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={isActive(item.href)}
                collapsed={collapsed}
                label={t(item.labelKey)}
                onClick={close}
              />
            ))}
          </div>
        </nav>

        {/* ── User profile chip ────────────────────────────────────────── */}
        <div className="shrink-0 border-t border-sidebar-border/10 p-3">
          {collapsed ? (
            /* Collapsed: just avatar + logout stacked */
            <div className="flex flex-col items-center gap-2">
              <div className="size-8 rounded-lg bg-color flex items-center justify-center
                              text-white text-[13px] font-bold shadow-brand shrink-0">
                {initial}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                aria-label="Sign out"
                className="size-8 text-sidebar-foreground/50 hover:text-destructive
                           hover:bg-destructive/10"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          ) : (
            /* Expanded: avatar + name + logout */
            <div className="flex items-center gap-3 rounded-xl p-2
                            hover:bg-sidebar-accent/10 transition-colors group">
              <div className="size-8 rounded-lg bg-color flex items-center justify-center
                              text-white text-[13px] font-bold shadow-brand shrink-0">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-sidebar-foreground truncate">
                  {user?.full_name ?? "User"}
                </p>
                <p className="text-[11px] text-sidebar-foreground/50 truncate">
                  {user?.email ?? ""}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                aria-label="Sign out"
                className="size-7 shrink-0 opacity-0 group-hover:opacity-100
                           text-sidebar-foreground/50 hover:text-destructive
                           hover:bg-destructive/10 transition-all"
              >
                <LogOut className="size-3.5" />
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// ─── NavLink sub-component ────────────────────────────────────────────────────

interface NavLinkProps {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  label: string;
  onClick: () => void;
}

function NavLink({ item, active, collapsed, label, onClick }: NavLinkProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href as any}
      onClick={onClick}
      title={collapsed ? label : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5",
        "text-[13px] font-medium transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        collapsed && "justify-center px-2",
        active
          ? "bg-color text-white shadow-brand"
          : "text-sidebar-foreground/65 hover:text-sidebar-foreground hover:bg-sidebar-accent/12",
      )}
    >
      <Icon className="size-4.5 shrink-0" aria-hidden="true" />

      {!collapsed && (
        <span className="flex-1 truncate">{label}</span>
      )}

      {/* Badge — only shown when expanded */}
      {!collapsed && item.badge != null && item.badge > 0 && (
        <span className="ms-auto inline-flex items-center justify-center
                         h-4.5 min-w-4.5 px-1.5 rounded-full
                         bg-primary/15 text-primary text-[10px] font-bold">
          {item.badge}
        </span>
      )}
    </Link>
  );
}