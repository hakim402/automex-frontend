"use server";

// app/[locale]/(routes)/crm/actions/actions.ts
//
// Single Server Actions file for the whole CRM route family:
// /crm (newsletter), /crm/quote, /crm/book-a-call, /crm/contact.
// Every ClientPage under app/[locale]/(routes)/crm/** imports from here.

import {
  submitContactLead,
  submitQuoteRequest,
  subscribeNewsletter,
  submitConsultationBooking,
  fetchAvailability,
} from "@/lib/automex/crm";
import { AutomexApiError } from "@/lib/automex/client";
import type {
  ContactLeadInput,
  QuoteRequestInput,
  NewsletterSubscribeInput,
  ConsultationBookingInput,
  LeadAck,
  ConsultationBookingAck,
  NewsletterSubscriberAck,
  AvailableSlot,
} from "@/lib/automex/types";
import type { SupportedLocale } from "@/lib/locale";
import type { ActionResult } from "@/lib/automex/action-result";

/** Shared error → ActionResult mapping for every action below. */
function handleAutomexError<T>(err: unknown, context: string): ActionResult<T> {
  if (err instanceof AutomexApiError && err.kind === "validation") {
    return {
      success: false,
      message: "Please check the highlighted fields.",
      fieldErrors: (err.body as Record<string, string[]>) ?? undefined,
    };
  }
  if (err instanceof AutomexApiError && err.kind === "rate_limited") {
    return { success: false, message: "Too many requests — please wait a moment and try again." };
  }
  console.error(`[${context}]`, err);
  return { success: false, message: "Something went wrong. Please try again." };
}

// ─── /crm — newsletter strip ─────────────────────────────────────────

export async function subscribeNewsletterAction(
  input: Omit<NewsletterSubscribeInput, "language">,
  locale: SupportedLocale
): Promise<ActionResult<NewsletterSubscriberAck>> {
  try {
    return { success: true, data: await subscribeNewsletter(input, locale) };
  } catch (err) {
    return handleAutomexError<NewsletterSubscriberAck>(err, "subscribeNewsletterAction");
  }
}

// ─── /crm/contact ─────────────────────────────────────────────────────

export async function submitContactLeadAction(
  input: Omit<ContactLeadInput, "language">,
  locale: SupportedLocale
): Promise<ActionResult<LeadAck>> {
  try {
    return { success: true, data: await submitContactLead(input, locale) };
  } catch (err) {
    return handleAutomexError<LeadAck>(err, "submitContactLeadAction");
  }
}

// ─── /crm/quote ───────────────────────────────────────────────────────

export async function submitQuoteRequestAction(
  input: Omit<QuoteRequestInput, "language">,
  locale: SupportedLocale
): Promise<ActionResult<LeadAck>> {
  try {
    return { success: true, data: await submitQuoteRequest(input, locale) };
  } catch (err) {
    return handleAutomexError<LeadAck>(err, "submitQuoteRequestAction");
  }
}

// ─── /crm/book-a-call ───────────────────────────────────────────────

/** GET availability for a date — called fresh every time the date picker changes, never cached. */
export async function fetchAvailabilityAction(date: string): Promise<ActionResult<AvailableSlot[]>> {
  try {
    return { success: true, data: await fetchAvailability(date) };
  } catch (err) {
    return handleAutomexError<AvailableSlot[]>(err, "fetchAvailabilityAction");
  }
}

export async function submitConsultationBookingAction(
  input: Omit<ConsultationBookingInput, "language">,
  locale: SupportedLocale
): Promise<ActionResult<ConsultationBookingAck>> {
  try {
    return { success: true, data: await submitConsultationBooking(input, locale) };
  } catch (err) {
    return handleAutomexError<ConsultationBookingAck>(err, "submitConsultationBookingAction");
  }
}