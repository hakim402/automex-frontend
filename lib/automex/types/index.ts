/**
 * index.ts — Stable re-export surface for AUTOMEX types.
 *
 * Domain fetchers (content.ts, crm.ts, assistant.ts — built in later steps)
 * import from HERE, never directly from ./generated. Keeps import paths
 * stable if the generated file's internal shape ever changes.
 *
 * Fully generated as of the @extend_schema fix — no hand-typed fallbacks
 * needed anymore. If a future endpoint comes back missing a schema again,
 * check the view for a missing @extend_schema(responses=...) first.
 */
import type { components } from "./generated";

type Schemas = components["schemas"];

// ─── Content domain ────────────────────────────────────────────────────

export type ServiceListItem = Schemas["ServiceList"];
export type ServiceDetail = Schemas["ServiceDetail"];
export type ServiceCategory = Schemas["ServiceCategory"];
export type Technology = Schemas["Technology"];
export type Industry = Schemas["Industry"];
export type ProcessStep = Schemas["ProcessStep"];
export type FAQ = Schemas["FAQ"];
export type CaseStudyListItem = Schemas["CaseStudyList"];
export type CaseStudyDetail = Schemas["CaseStudyDetail"];
export type CaseStudyGalleryImage = Schemas["CaseStudyGalleryImage"];
export type BlogCategory = Schemas["BlogCategory"];
export type BlogTag = Schemas["BlogTag"];
export type BlogAuthor = Schemas["BlogAuthor"];
export type BlogPostListItem = Schemas["BlogPostList"];
export type BlogPostDetail = Schemas["BlogPostDetail"];
export type TeamMember = Schemas["TeamMember"];
export type Testimonial = Schemas["Testimonial"];
export type MediaAsset = Schemas["MediaAsset"];

// ─── CRM domain — inputs (request bodies) ─────────────────────────────

export type ContactLeadInput = Schemas["ContactLeadCreateRequest"];
export type QuoteRequestInput = Schemas["QuoteRequestCreateRequest"];
export type ConsultationBookingInput = Schemas["ConsultationBookingCreateRequest"];
export type NewsletterSubscribeInput = Schemas["NewsletterSubscribeRequest"];

// ─── CRM domain — responses ────────────────────────────────────────────

export type LeadAck = Schemas["LeadAck"];
export type ConsultationBookingAck = Schemas["ConsultationBookingAck"];
export type NewsletterSubscriberAck = Schemas["NewsletterSubscriberAck"];
export type AvailableSlot = Schemas["AvailableSlot"];

// ─── Assistant domain ───────────────────────────────────────────────────

export type ChatRequestInput = Schemas["ChatRequestRequest"];
export type ChatResponse = Schemas["ChatResponse"];

// ─── SEO domain ─────────────────────────────────────────────────────────

export type SEOSettingsResponse = Schemas["SEOSettingsResponse"];
export type Organization = Schemas["Organization"];
export type SitemapEntry = Schemas["SitemapEntry"];

// ─── Shared enums — useful directly in form dropdowns / status badges ───

export type BudgetRange = Schemas["BudgetRangeEnum"];
export type Timeline = Schemas["TimelineEnum"];
export type MeetingType = Schemas["MeetingTypeEnum"];
export type LeadType = Schemas["LeadTypeEnum"];
export type LeadStatus = Schemas["LeadAckStatusEnum"];
export type ConsultationBookingStatus = Schemas["ConsultationBookingAckStatusEnum"];
export type FAQCategory = Schemas["FAQCategoryEnum"];
export type TechnologyCategory = Schemas["TechnologyCategoryEnum"];
export type TeamDepartment = Schemas["DepartmentEnum"];
export type TestimonialSource = Schemas["SourceEnum"];
export type MediaFileType = Schemas["FileTypeEnum"];