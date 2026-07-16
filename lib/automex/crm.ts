/**
 * crm.ts — Write-heavy fetchers for the AUTOMEX CRM domain: contact form,
 * quote requests, consultation booking (+ availability), newsletter.
 *
 * Every submit function takes `locale` as its own required argument —
 * NOT as part of the input object — and stamps it onto the request body's
 * `language` field itself. This guarantees the lead's recorded language
 * always matches the visitor's actual route locale; it can't be
 * forgotten or set to something stale by whichever form component calls in.
 *
 * Nothing here is cached (POST requests aren't cached by fetch/Next
 * regardless, and availability is explicitly "always fetch fresh" per
 * the roadmap's caching table) — no `revalidate`/`tags` passed anywhere.
 */
import { automexFetch } from "./client";
import type { SupportedLocale } from "@/lib/locale";
import type {
  ContactLeadInput,
  QuoteRequestInput,
  ConsultationBookingInput,
  NewsletterSubscribeInput,
  LeadAck,
  ConsultationBookingAck,
  NewsletterSubscriberAck,
  AvailableSlot,
} from "./types";

// ─── Contact form ───────────────────────────────────────────────────────

export function submitContactLead(
  input: Omit<ContactLeadInput, "language">,
  locale: SupportedLocale
): Promise<LeadAck> {
  return automexFetch<LeadAck>("/crm/leads/contact/", {
    method: "POST",
    body: JSON.stringify({ ...input, language: locale }),
  });
}

// ─── Quote request ──────────────────────────────────────────────────────

export function submitQuoteRequest(
  input: Omit<QuoteRequestInput, "language">,
  locale: SupportedLocale
): Promise<LeadAck> {
  return automexFetch<LeadAck>("/crm/leads/quote/", {
    method: "POST",
    body: JSON.stringify({ ...input, language: locale }),
  });
}

// ─── Consultation booking ───────────────────────────────────────────────

/**
 * GET /crm/bookings/availability/?date=YYYY-MM-DD
 * Returns open slots + remaining capacity for that date.
 * Always fetched fresh — never cached, per §12 of the roadmap: this is
 * the one read endpoint where staleness would actively cause double-booking.
 */
export async function fetchAvailability(date: string): Promise<AvailableSlot[]> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`[automex] fetchAvailability expects YYYY-MM-DD, got: "${date}"`);
  }
  return automexFetch<AvailableSlot[]>(`/crm/bookings/availability/?date=${date}`);
}

/**
 * Submits a booking for a specific slot returned by fetchAvailability().
 * `input.slot` is that slot's `id` (uuid) — NOT a weekday number or time string.
 * A 400 here most often means the slot filled up between the availability
 * check and this submit (race condition, expected under real traffic) —
 * check err.kind === "validation" and prompt the user to pick another slot
 * rather than treating it as a generic error.
 */
export function submitConsultationBooking(
  input: Omit<ConsultationBookingInput, "language">,
  locale: SupportedLocale
): Promise<ConsultationBookingAck> {
  return automexFetch<ConsultationBookingAck>("/crm/bookings/consultations/", {
    method: "POST",
    body: JSON.stringify({ ...input, language: locale }),
  });
}

// ─── Newsletter ───────────────────────────────────────────────────────

export function subscribeNewsletter(
  input: Omit<NewsletterSubscribeInput, "language">,
  locale: SupportedLocale
): Promise<NewsletterSubscriberAck> {
  return automexFetch<NewsletterSubscriberAck>("/crm/newsletter/subscribe/", {
    method: "POST",
    body: JSON.stringify({ ...input, language: locale }),
  });
}