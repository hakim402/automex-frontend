"use client";

// app/[locale]/dashboard/_components/Sidebar/Sidebar.tsx

import {
  LayoutDashboard,
  PackageSearch,
  Video,
  BriefcaseBusiness,
  BotMessageSquare,
  Bell,
  UserCircle,
  ShieldCheck,
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
import { motion, AnimatePresence } from "framer-motion";

// ─── Nav item type ────────────────────────────────────────────────────────────

interface NavItem {
  icon: React.ElementType;
  labelKey: string;
  href: string;
  badge?: number;
}

// ─── Nav items — matches i18n/routing.ts pathnames ────────────────────────────

const MAIN_NAV: NavItem[] = [
  { icon: LayoutDashboard, labelKey: "dashboard", href: "/dashboard" },
  { icon: PackageSearch, labelKey: "projects", href: "/dashboard/projects" },
  { icon: Video, labelKey: "services", href: "/dashboard/services" },
  {
    icon: BriefcaseBusiness,
    labelKey: "consulting",
    href: "/dashboard/consulting",
  },
  { icon: BotMessageSquare, labelKey: "support", href: "/dashboard/support" },
];

const BOTTOM_NAV: NavItem[] = [
  { icon: Bell, labelKey: "notifications", href: "/dashboard/notifications" },
  { icon: UserCircle, labelKey: "profile", href: "/dashboard/profile" },
  { icon: ShieldCheck, labelKey: "security", href: "/dashboard/security" },
];

// ─────────────────────────────────────────────────────────────────────────────

interface SidebarProps {
  isRtl: boolean;
}

export function Sidebar({ isRtl }: SidebarProps) {
  const t = useTranslations("Sidebar");
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen, sidebarWidth } =
    useSidebar();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const close = () => setMobileOpen(false);

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  const initial = user?.full_name?.charAt(0).toUpperCase() ?? "U";

  return (
    <>
      {/* ── Mobile backdrop ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar panel ───────────────────────────────────────────── */}
      <aside
        style={{ width: sidebarWidth }}
        className={cn(
          "fixed top-0 z-50 flex h-screen flex-col",
          // Theme-aware surface — driven entirely by CSS vars, swaps automatically with .dark
          "bg-sidebar border-sidebar-border/15",
          isRtl ? "border-l right-0" : "border-r left-0",
          "transition-[width,transform] duration-300 ease-in-out",
          "lg:translate-x-0",
          !mobileOpen && (isRtl ? "translate-x-full" : "-translate-x-full"),
          mobileOpen && "translate-x-0",
          "lg:translate-x-0!",
        )}
      >
        {/* ── Header ──────────────────────────────────────────────── */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-sidebar-border/15 px-3",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          <Link
            href="/"
            onClick={close}
            className="flex min-w-0 items-center gap-2.5 overflow-hidden"
          >
            <Image
              src="/logo/icon.png"
              alt="Automex"
              width={32}
              height={32}
              className="size-8 shrink-0 rounded-lg object-contain"
              priority
            />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  key="logo-text"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap text-[15px]
                             font-bold tracking-tight text-sidebar-foreground mt-2"
                >
                  Automex
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Desktop collapse toggle */}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(true)}
              className="hidden lg:flex size-7 shrink-0 text-sidebar-foreground/50
                         hover:bg-sidebar-accent/15 hover:text-sidebar-foreground"
              aria-label="Collapse sidebar"
            >
              <span
                className={cn("transition-transform", isRtl && "rotate-180")}
              >
                <ChevronLeft className="size-4" />
              </span>
            </Button>
          )}

          {/* Mobile close */}
          <Button
            variant="ghost"
            size="icon"
            onClick={close}
            className="lg:hidden size-7 text-sidebar-foreground/50
                       hover:bg-sidebar-accent/15 hover:text-sidebar-foreground"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Expand button when collapsed (desktop only) */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
            className="mx-auto mt-2 hidden size-8 items-center justify-center
                       rounded-lg text-sidebar-foreground/40 transition-colors
                       hover:bg-sidebar-accent/15 hover:text-sidebar-foreground
                       lg:flex"
          >
            <span className={cn("transition-transform", isRtl && "rotate-180")}>
              <ChevronRight className="size-4" />
            </span>
          </button>
        )}

        {/* ── Navigation ──────────────────────────────────────────── */}
        <nav
          className="flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden
                     px-2 py-3 scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex flex-col gap-0.5">
            {!collapsed && (
              <p
                className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.14em]
                            text-sidebar-foreground/35"
              >
                {t("menuLabel")}
              </p>
            )}
            {MAIN_NAV.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={isActive(item.href)}
                collapsed={collapsed}
                label={t(item.labelKey as Parameters<typeof t>[0])}
                onClick={close}
              />
            ))}
          </div>

          <div className="flex-1" />

          <div className="flex flex-col gap-0.5 border-t border-sidebar-border/15 pt-2">
            {!collapsed && (
              <p
                className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.14em]
                            text-sidebar-foreground/35"
              >
                {t("accountLabel")}
              </p>
            )}
            {BOTTOM_NAV.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={isActive(item.href)}
                collapsed={collapsed}
                label={t(item.labelKey as Parameters<typeof t>[0])}
                onClick={close}
              />
            ))}
          </div>
        </nav>

        {/* ── User chip ────────────────────────────────────────────── */}
        <div className="shrink-0 border-t border-sidebar-border/15 p-2">
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-xl
                           bg-color text-[13px] font-bold text-white shadow-brand"
                title={user?.full_name ?? "User"}
              >
                {initial}
              </div>
              <button
                onClick={logout}
                aria-label="Sign out"
                className="flex size-9 items-center justify-center rounded-xl
                           text-sidebar-foreground/50 transition-colors
                           hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          ) : (
            <div
              className="group flex items-center gap-3 rounded-xl p-2.5
                            transition-colors hover:bg-sidebar-accent/10"
            >
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-xl
                              bg-color text-[13px] font-bold text-white shadow-brand"
              >
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-sidebar-foreground">
                  {user?.full_name ?? "User"}
                </p>
                <p className="truncate text-[11px] text-sidebar-foreground/50">
                  {user?.email ?? ""}
                </p>
              </div>
              <button
                onClick={logout}
                aria-label="Sign out"
                className="flex size-7 shrink-0 items-center justify-center rounded-lg
                           text-sidebar-foreground/40
                           hover:bg-destructive/10 hover:text-destructive cursor-pointer"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// ─── NavLink ──────────────────────────────────────────────────────────────────

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
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5",
        "text-[13px] font-medium transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        collapsed && "justify-center px-0",
        active
          ? "bg-color text-white shadow-brand"
          : "text-sidebar-foreground/65 hover:bg-sidebar-accent/12 hover:text-sidebar-foreground",
      )}
    >
      <Icon className="size-4.5 shrink-0" aria-hidden="true" />

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            key="label"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.18 }}
            className="flex-1 overflow-hidden whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {!collapsed && item.badge != null && item.badge > 0 && (
        <span
          className={cn(
            "ms-auto inline-flex h-5 min-w-5 items-center justify-center",
            "rounded-full px-1.5 text-[10px] font-bold",
            active ? "bg-white/20 text-white" : "bg-primary/15 text-primary",
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}
