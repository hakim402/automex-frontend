"use client";

// app/[locale]/dashboard/_components/Header/DashboardHeader.tsx

import { useLocale } from "next-intl";
import { Menu } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/app/[locale]/_components/Theme/theme-toggle";
import { LanguageSwitcher } from "@/app/[locale]/_components/Language/LanguageSwitcher";
import { NotificationBell } from "./NotificationBell";
import { useSidebar } from "@/contexts/sidebar-context";
import { useAuth } from "@/contexts/AuthContext";
import { getMediaUrl } from "@/lib/env";

interface DashboardHeaderProps {
  /** Optional page title shown in the header */
  title?: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const { toggleMobile } = useSidebar();
  const { user } = useAuth();
  const locale = useLocale();

  // RTL support for Arabic, Persian, Pashto
  const isRtl = ["ar", "fa", "ps"].includes(locale);

  const initial = user?.full_name?.charAt(0).toUpperCase() ?? "U";

  // Avatar source: profile_picture > google_picture_url > initials
  const avatarUrl =
    getMediaUrl(user?.profile?.profile_picture) ||
    user?.google_picture_url ||
    null;

  return (
    <header
      className="sticky top-0 z-30 h-14 bg-sidebar/90 backdrop-blur-md
                 border-b border-border/10 shrink-0"
    >
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="flex items-center justify-between h-full px-4 lg:px-6 max-w-full"
      >
        {/* Left: hamburger + page title */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobile}
            className="lg:hidden size-8 text-muted-foreground
                       hover:text-foreground hover:bg-accent/40"
            aria-label="Open navigation"
          >
            <Menu className="size-4.5" />
          </Button>

          {title && (
            <h1 className="text-[15px] font-semibold text-foreground hidden sm:block">
              {title}
            </h1>
          )}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          {/* <LanguageSwitcher /> */}
          <ThemeToggle />

          <div className="h-5 w-px bg-border/20 mx-1" aria-hidden="true" />

          {/* Notification bell icon with unread count */}
          <NotificationBell />

          <div className="h-5 w-px bg-border/20 mx-1" aria-hidden="true" />

          {/* Avatar chip → dashboard/profile */}
          <a
            href="/dashboard/profile"
            aria-label={`Profile — ${user?.full_name ?? "User"}`}
            className="flex size-8 items-center justify-center rounded-xl overflow-hidden
                       hover:opacity-90 transition-opacity"
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={user?.full_name ?? "User"}
                width={32}
                height={32}
                className="size-8 object-cover"
                unoptimized
              />
            ) : (
              <span className="flex size-8 items-center justify-center rounded-xl
                               bg-color text-white text-[13px] font-bold shadow-brand">
                {initial}
              </span>
            )}
          </a>
        </div>
      </div>
    </header>
  );
}
