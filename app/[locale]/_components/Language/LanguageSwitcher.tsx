"use client";

// app/[locale]/_components/Language/LanguageSwitcher.tsx

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

import { cn } from "@/lib/utils";

// Existing flags
import US from "country-flag-icons/react/3x2/US";
import SA from "country-flag-icons/react/3x2/SA";
import IR from "country-flag-icons/react/3x2/IR";
import AF from "country-flag-icons/react/3x2/AF";
import CN from "country-flag-icons/react/3x2/CN";

// New flags for European languages
import ES from "country-flag-icons/react/3x2/ES"; // Spain
import DE from "country-flag-icons/react/3x2/DE"; // Germany
import FR from "country-flag-icons/react/3x2/FR"; // France
import IT from "country-flag-icons/react/3x2/IT"; // Italy
import NL from "country-flag-icons/react/3x2/NL"; // Netherlands

const LOCALES = [
  {
    value: "en",
    label: "English",
    flag: US,
    short: "EN",
  },
  {
    value: "es",
    label: "Español",
    flag: ES,
    short: "ES",
  },
  {
    value: "de",
    label: "Deutsch",
    flag: DE,
    short: "DE",
  },
  {
    value: "fr",
    label: "Français",
    flag: FR,
    short: "FR",
  },
  {
    value: "it",
    label: "Italiano",
    flag: IT,
    short: "IT",
  },
  {
    value: "nl",
    label: "Nederlands",
    flag: NL,
    short: "NL",
  },
  {
    value: "zh",
    label: "中文",
    flag: CN,
    short: "ZH",
  },
  {
    value: "ar",
    label: "العربية",
    flag: SA,
    short: "AR",
  },
  {
    value: "ps",
    label: "پښتو",
    flag: AF,
    short: "PS",
  },
  {
    value: "fa",
    label: "فارسی",
    flag: IR,
    short: "FA",
  },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const active = LOCALES.find((l) => l.value === locale) ?? LOCALES[0];
  const FlagComponent = active.flag;

  const handleChange = (newLocale: string) => {
    router.push(pathname as any, { locale: newLocale });
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-xs font-semibold",
          "text-muted-foreground hover:text-foreground",
          "border border-transparent hover:border-border/15",
          "hover:bg-muted/20 transition-all duration-150",
          open && "bg-muted/20 border-border/15 text-foreground",
        )}
      >
        <FlagComponent className="w-4 h-4 shrink-0 rounded-[2px]" />
        <span className="hidden sm:block tracking-wide">{active.short}</span>
        <ChevronDown
          size={12}
          className={cn(
            "transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.13 }}
            className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-border/15 bg-card/95 backdrop-blur-xl shadow-2xl p-1 z-50"
          >
            {LOCALES.map((l) => {
              const isActive = l.value === locale;
              const ItemFlag = l.flag;
              return (
                <button
                  key={l.value}
                  onClick={() => handleChange(l.value)}
                  className={cn(
                    "flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left",
                    isActive
                      ? "bg-color/10 text-color"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                  )}
                >
                  <ItemFlag className="w-4 h-4 shrink-0 rounded-[2px]" />
                  <span className="flex-1">{l.label}</span>
                  {isActive && (
                    <Check size={11} className="text-color shrink-0" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
