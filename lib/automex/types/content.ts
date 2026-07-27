/**
 * content.ts — Hand-written types for Service detail sub-models.
 *
 * The auto-generated OpenAPI schema types ServiceDetail sub-models
 * (hero_images, process_steps, deliverables, etc.) as plain `string`
 * because DRF's @extend_schema doesn't deeply type nested serializers.
 * This file provides the correct typed shapes so the frontend can
 * safely destructure these arrays.
 */
// lib/automex/types/content.ts

import type { components } from "./generated";

type Schemas = components["schemas"];

type MediaAsset = Schemas["MediaAsset"];
type ServiceCategory = Schemas["ServiceCategory"];
type Technology = Schemas["Technology"];
type Industry = Schemas["Industry"];
type ServiceLevel = Schemas["ServiceLevelEnum"];
type PricingModel = Schemas["PricingModelEnum"];

/** Full SEO object returned by service detail endpoint. */
export interface ServiceSEO {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string | null;
  og_type: string;
  twitter_card: string;
  robots_meta_content: string;
  sitemap_priority: string;
  sitemap_changefreq: string;
  structured_data_type: string;
}

// ─── Industry (full typed override — generated has compliance_standards as `unknown`) ──

export interface IndustryFull {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  icon_image: MediaAsset | null;
  /** Compliance frameworks relevant to this industry, e.g. ["HIPAA", "SOC2", "PCI-DSS"]. */
  compliance_standards: string[];
  order?: number;
}

// ─── Paginated wrapper ─────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ─── Service sub-models (typed correctly — generated has them as `string`) ──

export interface ServiceHeroImage {
  id: string;
  image: MediaAsset;
  title: string;
  caption: string;
  is_cover: boolean;
  order: number;
}

export interface ServiceProcessStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface ServiceDeliverable {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface ServiceAddOn {
  id: string;
  name: string;
  description: string;
  price: string;
  is_included_in_enterprise: boolean;
  order: number;
}

export interface ServiceComparisonRow {
  id: string;
  feature_name: string;
  standard_value: string;
  premium_value: string;
  enterprise_value: string;
  is_highlighted: boolean;
  order: number;
}

export interface ServiceClientLogo {
  id: string;
  logo: MediaAsset;
  client_name: string;
  client_url: string;
  order: number;
}

export interface ServiceTestimonial {
  id: string;
  testimonial_id: string;
  client_name: string;
  client_role: string;
  client_company: string;
  client_avatar: MediaAsset | null;
  quote: string;
  rating: number;
  is_featured: boolean;
  order: number;
}

export interface ServiceDocument {
  id: string;
  title: string;
  description: string;
  file: MediaAsset;
  document_type: string;
  document_type_display: string;
  is_public: boolean;
  order: number;
}

export interface ServiceSLA {
  id: string;
  guarantee_name: string;
  value: string;
  description: string;
  icon: string;
  order: number;
}

export interface ServiceFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  service: string;
  order: number;
}

export interface TechStackGrouped {
  [category: string]: string[];
}

// ─── Blog sub-models (typed correctly — generated has them as `string`) ───

export interface BlogHeroImage {
  id: string;
  image: MediaAsset;
  caption: string;
  is_cover?: boolean;
  order: number;
}

export interface BlogRelatedService {
  id: string;
  slug: string;
  name: string;
  short_description: string;
}

export interface BlogRelatedCaseStudy {
  id: string;
  slug: string;
  title: string;
  overview: string;
}

/**
 * Full blog post detail with properly typed sub-model arrays.
 * Use for /blog/posts/{slug}/ page. The generated BlogPostDetail
 * has hero_images, related_services, related_case_studies typed
 * as `string` — use this instead. Also makes cover_image /
 * thumbnail_image nullable since runtime may return null.
 */
export interface BlogPostDetailFull {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: Schemas["BlogCategory"];
  tags: Schemas["BlogTag"][];
  cover_image: MediaAsset | null;
  thumbnail_image: MediaAsset | null;
  author: Schemas["BlogAuthor"];
  content_type?: Schemas["ContentTypeEnum"];
  content_type_display: string;
  reading_time_minutes?: number | null;
  views_count?: number;
  is_featured?: boolean;
  is_premium?: boolean;
  video_embed_url?: string;
  external_url?: string;
  hero_images: BlogHeroImage[];
  related_services: BlogRelatedService[];
  related_case_studies: BlogRelatedCaseStudy[];
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  seo: BlogPostSEO;
}

/** Full SEO object shape returned by blog post detail endpoint. */
export interface BlogPostSEO {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string | null;
  og_type: string;
  twitter_card: string;
  robots_meta_content: string;
  sitemap_priority: string;
  sitemap_changefreq: string;
  structured_data_type: string;
}

/** Lightweight ref used in related_services. */
export interface ServiceListItemRef {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  icon: string;
  hero_image: MediaAsset | null;
  category: ServiceCategory | null;
  is_featured: boolean;
  order: number;
}

/**
 * Full service detail with properly typed sub-model arrays.
 * Use for /services/{slug}/ page. The generated ServiceDetail
 * has these fields typed as `string` — use this instead.
 */
export interface ServiceDetailFull {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  overview: string;
  problems_we_solve: string;
  features: string;
  benefits: string;
  icon: string;
  hero_image: MediaAsset | null;
  thumbnail_image: MediaAsset | null;
  video_presentation: MediaAsset | null;
  brochure: MediaAsset | null;
  category: ServiceCategory | null;
  service_level: ServiceLevel;
  service_level_display: string;
  is_enterprise: boolean;
  is_featured: boolean;
  order: number;
  technologies: Technology[];
  tech_stack_grouped: TechStackGrouped;
  industries: Industry[];
  pricing_model: PricingModel;
  pricing_model_display: string;
  starting_price: string | null;
  currency: string;
  delivery_time_estimate: string;
  team_size_range: string;
  cta_text: string;
  cta_url: string;
  key_metrics: Record<string, number>;
  enterprise_features: string[];
  hero_images: ServiceHeroImage[];
  process_steps: ServiceProcessStep[];
  deliverables: ServiceDeliverable[];
  add_ons: ServiceAddOn[];
  comparison_rows: ServiceComparisonRow[];
  client_logos: ServiceClientLogo[];
  service_testimonials: ServiceTestimonial[];
  documents: ServiceDocument[];
  slas: ServiceSLA[];
  faqs: ServiceFAQ[];
  related_services: ServiceListItemRef[];
  published_at: string;
  seo: ServiceSEO;
}

// ─── Case Studies (full typed override — generated has related_services as `string`) ──

/** Service reference returned by case study detail endpoint. */
export interface CaseStudyServiceRef {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  icon?: string;
  hero_image: MediaAsset | null;
}

/**
 * Full case study detail with properly typed related_services array.
 * The generated CaseStudyDetail has `related_services: string` because
 * the OpenAPI schema doesn't deeply type nested serializers.
 */
export interface CaseStudyDetailFull {
  id: string;
  slug: string;
  title: string;
  overview: string;
  challenge: string;
  solution: string;
  results: string;
  client_name?: string;
  client_industry: IndustryFull | null;
  client_logo: MediaAsset | null;
  client_website?: string;
  thumbnail: MediaAsset | null;
  project_type?: string;
  project_type_display?: string;
  team_size?: number | null;
  project_year?: number | null;
  project_duration_display?: string;
  key_metrics?: Record<string, unknown>;
  is_ai_project?: boolean;
  ai_models_used?: string[];
  technologies: Technology[];
  gallery: Schemas["CaseStudyGalleryImage"][];
  related_services: CaseStudyServiceRef[];
  testimonial: Schemas["Testimonial"] | null;
  project_url?: string;
  project_duration_weeks?: number | null;
  is_featured?: boolean;
  published_at?: string | null;
  seo: Record<string, unknown>;
}

/** Portfolio service reference returned by detail endpoint. */
export interface PortfolioServiceRef {
  id: string;
  slug: string;
  name: string;
}

/**
 * Full portfolio project detail with properly typed services array.
 * The generated PortfolioProjectDetail has `services: string` because
 * the OpenAPI schema doesn't deeply type nested serializers.
 */
export interface PortfolioProjectDetailFull {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  cover_image: MediaAsset | null;
  services: PortfolioServiceRef[];
  technologies: Technology[];
  industry: IndustryFull | null;
  project_url?: string;
  client_name: string;
  completion_year?: number | null;
  gallery: Schemas["PortfolioGalleryImage"][];
  is_featured?: boolean;
  is_published?: boolean;
  order?: number;
  created_at: string;
}
