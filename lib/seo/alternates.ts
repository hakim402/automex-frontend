// lib/seo/alternates.ts
import { SUPPORTED_LOCALES, SupportedLocale } from "@/lib/locale";

const BASE_URL = "https://automex.tech";

interface AlternatesOptions {
  locale: SupportedLocale;
  pathSegment?: string;
}

export function getAlternates({ locale, pathSegment }: AlternatesOptions) {
  const path = pathSegment ? `/${pathSegment}` : "";
  const canonical = `${BASE_URL}/${locale}${path}`;

  const languages: Record<string, string> = {};
  for (const l of SUPPORTED_LOCALES) {
    languages[l] = `${BASE_URL}/${l}${path}`;
  }

  return {
    canonical,
    languages,
  };
}