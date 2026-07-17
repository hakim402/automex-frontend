// lib/seo/types.ts
import { SupportedLocale } from "@/lib/locale";

export type Locale = SupportedLocale;

export type PageType = 
  | "home"
  | "about"
  | "contact"
  | "crm"            // CRM overview
  | "bookCall"       // book a call
  | "contactSales"   // contact sales
  | "quote";         // request a quote
  
export interface SeoMetadataOptions {
  pageType: PageType;
  locale: Locale;
  pathSegment?: string;
  customTitle?: string | null;
  customDescription?: string | null;
  ogImageUrl?: string | null;
  ogImageAlt?: string | null;
  noIndex?: boolean;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}