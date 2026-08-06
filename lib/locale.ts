// lib/locale.ts
export const RTL_LOCALES = ["ar"] as const;

export const SUPPORTED_LOCALES = [
  "en",
  "es",
  "de",
  "fr",
  "zh",
  "ar",
] as const;

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export function isRtlLocale(locale: string): boolean {
  return RTL_LOCALES.includes(locale as any);
}

export function getOgLocale(locale: string): string {
  const map: Record<string, string> = {
    en: "en_US",
    es: "es_ES",
    de: "de_DE",
    fr: "fr_FR",
    zh: "zh_CN",
    ar: "ar_SA",
  };
  return map[locale] || "en_US";
}