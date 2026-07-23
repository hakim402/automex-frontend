/**
 * index.ts — Stable re-export surface for AUTOMEX types.
 *
 * Domain fetchers import from HERE, never directly from ./generated.
 * Keeps import paths stable if the generated file's internal shape
 * ever changes.
 *
 * Regenerated from the latest backend OpenAPI schema (July 2026).
 * Custom hand-written types for ServiceDetail sub-models live in
 * ./content.ts (generated schema types those fields as `string`).
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

// ─── Content — partners, certifications, AI, tech expertise, portfolio ─

export type Partner = Schemas["Partner"];
export type Certification = Schemas["Certification"];
export type AICapability = Schemas["AICapability"];
export type TechExpertiseArea = Schemas["TechExpertiseArea"];
export type PortfolioProjectList = Schemas["PortfolioProjectList"];
export type PortfolioProjectDetail = Schemas["PortfolioProjectDetail"];

// ─── Content — hand-written ServiceDetail with typed sub-models ────────

export type {
  ServiceDetailFull,
  ServiceHeroImage,
  ServiceProcessStep,
  ServiceDeliverable,
  ServiceAddOn,
  ServiceComparisonRow,
  ServiceClientLogo,
  ServiceTestimonial as ServiceTestimonialSub,
  ServiceDocument,
  ServiceSLA,
  ServiceFAQ as ServiceFAQSub,
  ServiceListItemRef,
  TechStackGrouped,
  PaginatedResponse,
} from "./content";

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

// ─── CRM Dashboard domain (JWT) ───────────────────────────────────────

export type DashboardSummary = Schemas["DashboardSummary"];
export type DashboardLead = Schemas["DashboardLead"];
export type DashboardLeadMessageRequest = Schemas["DashboardLeadMessageRequest"];
export type DashboardBooking = Schemas["DashboardBooking"];
export type DashboardRescheduleRequest = Schemas["DashboardRescheduleRequest"];
export type DashboardCalculation = Schemas["DashboardCalculation"];
export type DashboardTicket = Schemas["DashboardTicket"];
export type DashboardTicketList = Schemas["DashboardTicketList"];
export type CreateTicketRequest = Schemas["CreateTicketRequest"];
export type SupportTicketMessage = Schemas["SupportTicketMessage"];

// ─── CRM Guest domain (API key + guest_token) ─────────────────────────

export type GuestLead = Schemas["GuestLead"];
export type GuestLeadDetail = Schemas["GuestLeadDetail"];
export type GuestTicket = Schemas["GuestTicket"];
export type GuestCreateTicketRequest = Schemas["GuestCreateTicketRequest"];
export type GuestTicketMessage = Schemas["GuestTicketMessage"];
export type GuestTicketMessageCreateRequest = Schemas["GuestTicketMessageCreateRequest"];

// ─── Notifications domain (JWT) ───────────────────────────────────────

export type NotificationList = Schemas["NotificationList"];
export type NotificationUnreadCount = Schemas["NotificationUnreadCount"];
export type NotificationPreference = Schemas["NotificationPreference"];
export type NotificationPreferenceUpdate = Schemas["NotificationPreferenceUpdateRequest"];

// ─── Assistant domain ───────────────────────────────────────────────────

export type ChatRequestInput = Schemas["ChatRequestRequest"];
export type ChatResponse = Schemas["ChatResponse"];
export type AIMessageHistory = Schemas["AIMessageHistory"];
export type ConversationList = Schemas["ConversationList"];
export type ConversationHistory = Schemas["ConversationHistory"];

// ─── SEO domain ─────────────────────────────────────────────────────────

export type SEOSettingsResponse = Schemas["SEOSettingsResponse"];
export type Organization = Schemas["Organization"];
export type SitemapEntry = Schemas["SitemapEntry"];

// ─── Shared enums ──────────────────────────────────────────────────────

export type BudgetRange = Schemas["BudgetRangeEnum"];
export type Timeline = Schemas["TimelineEnum"];
export type MeetingType = Schemas["MeetingTypeEnum"];
export type LeadType = Schemas["LeadTypeEnum"];

// Status enums (regenerated — DRF auto-names these)
/** Lead status: new | contacted | qualified | proposal_sent | negotiation | won | lost | spam */
export type LeadStatus = Schemas["Status021Enum"];
/** Booking status: pending | confirmed | rescheduled | completed | cancelled | no_show */
export type ConsultationBookingStatus = Schemas["Status32aEnum"];
/** Ticket status: open | in_progress | waiting_customer | waiting_admin | resolved | closed */
export type TicketStatus = Schemas["StatusAd7Enum"];

export type FAQCategory = Schemas["FAQCategoryEnum"];
export type TechnologyCategory = Schemas["TechnologyCategoryEnum"];
export type TeamDepartment = Schemas["DepartmentEnum"];
export type TestimonialSource = Schemas["SourceEnum"];
export type MediaFileType = Schemas["FileTypeEnum"];
export type ServiceLevelEnum = Schemas["ServiceLevelEnum"];
export type PricingModelEnum = Schemas["PricingModelEnum"];
export type TicketTypeEnum = Schemas["TicketTypeEnum"];
export type PriorityEnum = Schemas["PriorityEnum"];
export type AICapabilityCategory = Schemas["AICapabilityCategoryEnum"];
export type MaturityLevel = Schemas["MaturityLevelEnum"];
export type TechExpertiseCategory = Schemas["TechExpertiseAreaCategoryEnum"];
export type ChannelEnum = Schemas["ChannelEnum"];
export type EventTypeEnum = Schemas["EventTypeEnum"];
export type ComplexityTierEnum = Schemas["ComplexityTierEnum"];
export type DigestFrequencyEnum = Schemas["DigestFrequencyEnum"];
