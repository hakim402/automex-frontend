"use client";

// app/[locale]/_components/Header/SearchCommandPalette.tsx
//
// Lightweight CMD+K / CTRL+K command palette. Searches over whatever
// grouped items the header already has in memory (services, blog
// categories, static nav sections) — no new network calls, so it stays
// in sync with the existing data-fetching architecture automatically.

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, ArrowRight, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";

export interface CommandItem {
  name: string;
  href: string;
  group: string;
}

interface SearchCommandPaletteProps {
  items: CommandItem[];
  placeholder: string;
  emptyLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchCommandPalette({
  items,
  placeholder,
  emptyLabel,
  open,
  onOpenChange,
}: SearchCommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q.length === 0 ? items : items.filter((i) => i.name.toLowerCase().includes(q));
    return pool.slice(0, 40);
  }, [items, query]);

  // Global shortcut: Cmd/Ctrl + K toggles the palette from anywhere.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const navigate = (href: string) => {
    onOpenChange(false);
    router.push(href as never);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      onOpenChange(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      e.preventDefault();
      navigate(results[activeIndex].href);
    }
  };

  if (!open) return null;

  // Group results in display order while preserving each group's items.
  const grouped = results.reduce<Record<string, CommandItem[]>>((acc, item) => {
    (acc[item.group] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 sm:pt-32">
      <div
        className="fixed inset-0 bg-background/70 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={placeholder}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">{emptyLabel}</p>
          ) : (
            Object.entries(grouped).map(([group, groupItems]) => (
              <div key={group} className="mb-1">
                <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
                  {group}
                </p>
                {groupItems.map((item) => {
                  const index = results.indexOf(item);
                  const active = index === activeIndex;
                  return (
                    <button
                      key={`${item.group}-${item.href}`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => navigate(item.href)}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        active ? "bg-accent text-accent-foreground" : "text-popover-foreground"
                      )}
                    >
                      <span className="truncate">{item.name}</span>
                      {active ? (
                        <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" />
                      ) : (
                        <ArrowRight className="size-3.5 shrink-0 text-muted-foreground/0" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}