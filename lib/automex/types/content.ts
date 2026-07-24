/**
 * content.ts — Hand-written types for Service detail sub-models.
 *
 * The auto-generated OpenAPI schema types ServiceDetail sub-models
 * (hero_images, process_steps, deliverables, etc.) as plain `string`
 * because DRF's @extend_schema doesn't deeply type nested serializers.
 * This file provides the correct typed shapes so the frontend can
 * safely destructure these arrays.
 */

import type { components } from "./generated";

type Schemas = components["schemas"];

type MediaAsset = Schemas["MediaAsset"];
type ServiceCategory = Schemas["ServiceCategory"];
type Technology = Schemas["Technology"];
type Industry = Schemas["Industry"];
type SEOObject = Schemas["ServiceDetail"]["seo"];
type ServiceLevel = Schemas["ServiceLevelEnum"];
type PricingModel = Schemas["PricingModelEnum"];

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
  seo: Schemas["BlogPostDetail"]["seo"];
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
  seo: SEOObject;
}
