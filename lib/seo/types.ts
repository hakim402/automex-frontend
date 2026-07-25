// lib/seo/types.ts
import { SupportedLocale } from "@/lib/locale";

export type Locale = SupportedLocale;

export type PageType = 
  | "home"
  | "about"
  | "contact"
  | "services"          // services listing
  | "serviceDetail"     // individual service
  | "techExpertise"     // tech expertise listing
  | "techExpertiseDetail" // individual tech expertise area
  | "industries"     // industries listing
  | "industryDetail" // individual industry
  | "aiCapabilities"     // AI capabilities listing
  | "aiCapabilityDetail" // individual AI capability
  | "portfolio"      // portfolio listing
  | "portfolioDetail" // individual portfolio project
  | "blog"           // blog listing
  | "blogDetail"     // individual blog post
  | "crm"            // CRM overview
  | "bookCall"       // book a call
  | "contactSales"   // contact sales
  | "caseStudies"      // case studies listing
  | "caseStudyDetail" // individual case study
  | "quote";          // request a quote
  
export interface SeoMetadataOptions {
  pageType: PageType;
  locale: Locale;
  pathSegment?: string;
  customTitle?: string | null;
  customDescription?: string | null;
  ogImageUrl?: string | null;
  ogImageAlt?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}