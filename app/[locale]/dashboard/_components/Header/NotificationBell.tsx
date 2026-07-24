"use client";

// app/[locale]/dashboard/_components/Header/NotificationBell.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchUnreadCount } from "@/lib/automex/notifications";

export function NotificationBell() {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count
  const loadUnreadCount = async () => {
    try {
      const data = await fetchUnreadCount();
      setUnreadCount(data.unread_count);
    } catch {
      // Silently fail - bell will just show 0
    }
  };

  useEffect(() => {
    loadUnreadCount();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle click
  const handleClick = () => {
    router.push("/dashboard/notifications");
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      className="relative flex size-9 items-center justify-center rounded-xl
                 text-muted-foreground hover:text-foreground
                 hover:bg-accent/40 transition-colors"
    >
      <Bell className="size-4.25" />
      {unreadCount > 0 && (
        <span
          className={cn(
            "absolute -top-0.5 -right-0.5 flex items-center justify-center",
            "min-w-4 h-4 px-1 rounded-full",
            "bg-primary text-primary-foreground text-[10px] font-bold",
            "animate-pulse"
          )}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
