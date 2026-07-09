"use client";

// app/[locale]/_components/Language/LocaleSync.tsx

import { useEffect } from "react";

const RTL_LOCALES = ["ar", "fa", "ps"] as const;

interface LocaleSyncProps {
  locale: string;
}

export function LocaleSync({ locale }: LocaleSyncProps) {
  useEffect(() => {
    const isRtl = RTL_LOCALES.includes(locale as (typeof RTL_LOCALES)[number]);
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    localStorage.setItem("locale", locale);
  }, [locale]);

  return null;
}
