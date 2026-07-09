"use client";

// app/[locale]/dashboard/_components/DashboardMain.tsx

import { useState, useEffect } from "react";
import { useSidebar } from "@/contexts/sidebar-context";
import { usePathname } from "next/navigation";
import { DashboardHeader } from "./Header/DashboardHeader";
import { cn } from "@/lib/utils";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export function DashboardMain({ children }: { children: React.ReactNode }) {
  const { sidebarWidth } = useSidebar();
  const pathname = usePathname();
  const isRtl = pathname.startsWith("/ar") || pathname.startsWith("/fa") || pathname.startsWith("/ps");
  const isLarge = useMediaQuery("(min-width: 1024px)"); // matches Tailwind `lg:`

  // Only apply margin on desktop; on mobile the sidebar is a drawer overlay,
  // so the main column stays full-width (margin = 0).
  const marginStyle: React.CSSProperties = isLarge
    ? isRtl
      ? { marginRight: sidebarWidth, marginLeft: 0 }
      : { marginLeft: sidebarWidth, marginRight: 0 }
    : { marginLeft: 0, marginRight: 0 };

  return (
    <div
      className={cn(
        "flex min-h-screen min-w-0 flex-1 flex-col",
        "transition-[margin] duration-300 ease-in-out",
      )}
      style={marginStyle}
    >
      <DashboardHeader />
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  );
}