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
  const { collapsed } = useSidebar();
  const pathname = usePathname();
  const isRtl = pathname.startsWith("/ar") || pathname.startsWith("/fa") || pathname.startsWith("/ps");
  const isLarge = useMediaQuery("(min-width: 1024px)"); // matches `lg:` breakpoint

  const expandedWidth = 256;   // w-64
  const collapsedWidth = 72;   // w-18
  const currentWidth = collapsed ? collapsedWidth : expandedWidth;

  // Only apply margin on desktop; on mobile, sidebar is overlay → margin=0
  const marginStyle = isLarge
    ? isRtl
      ? { marginRight: `${currentWidth}px`, marginLeft: "0px" }
      : { marginLeft: `${currentWidth}px`, marginRight: "0px" }
    : {};

  return (
    <div
      className={cn(
        "flex flex-col flex-1 min-h-screen min-w-0",
        "transition-[margin] duration-300 ease-in-out",
      )}
      style={marginStyle}
    >
      <DashboardHeader />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}