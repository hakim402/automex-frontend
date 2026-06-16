/**
 * sidebar-context.tsx — Sidebar collapse + mobile open state
 *
 * Provides:
 *   collapsed    — desktop sidebar is in icon-only mode
 *   setCollapsed — toggle collapse
 *   mobileOpen   — mobile drawer is visible
 *   setMobileOpen
 *   toggleMobile — flip mobileOpen
 *
 * Wrap the dashboard layout with <SidebarProvider>.
 * Consume with useSidebar() in Sidebar and ClientHeader.
 */
"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// ─── Context shape ────────────────────────────────────────────────────────────

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  toggleMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = useCallback(
    () => setMobileOpen((prev) => !prev),
    []
  );

  return (
    <SidebarContext.Provider
      value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen, toggleMobile }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("[useSidebar] must be used inside <SidebarProvider>");
  }
  return ctx;
}