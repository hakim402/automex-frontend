"use client";

// app/[locale]/_components/Language/SetHtmlLangDir.tsx

import { useLocale } from "next-intl";
import { useEffect } from "react";

const RTL_LOCALES = ["ar", "fa", "ps"];

export function SetHtmlLangDir() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
