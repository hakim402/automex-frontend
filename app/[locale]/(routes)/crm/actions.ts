"use server";

// app/[locale]/(routes)/crm/actions/actions.ts
//
// Single Server Actions file for the whole CRM route family:
// /crm (newsletter), /crm/quote, /crm/book-a-call, /crm/contact, /crm/guest.
// Every ClientPage under app/[locale]/(routes)/crm/** imports from here.

import {
  submitContactLead,
  submitQuoteRequest,
  subscribeNewsletter,
  submitConsultationBooking,
  fetchAvailability,
} from "@/lib/automex/crm";
import {
  fetchGuestRequests,
  fetchGuestRequestDetail,
  fetchGuestTicketDetail,
  createGuestTicket,
  sendGuestTicketMessage,
} from "@/lib/automex/guest";
import { AutomexApiError } from "@/lib/automex/client";
import { getTranslations } from "next-intl/server";
import type {
  ContactLeadInput,
  QuoteRequestInput,
  NewsletterSubscribeInput,
  ConsultationBookingInput,
  LeadAck,
  ConsultationBookingAck,
  NewsletterSubscriberAck,
  AvailableSlot,
  GuestLead,
  GuestLeadDetail,
  GuestTicket,
  GuestCreateTicketRequest,
  GuestTicketMessage,
  GuestTicketMessageCreateRequest,
} from "@/lib/automex/types";
import type { SupportedLocale } from "@/lib/locale";
import type { ActionResult } from "@/lib/automex/action-result";

/** Shared error → ActionResult mapping for every action below. */
async function handleAutomexError<T>(err: unknown, locale: SupportedLocale): Promise<ActionResult<T>> {
  const t = await getTranslations({ locale, namespace: "CrmForms.shared" });
  if (err instanceof AutomexApiError && err.kind === "validation") {
    return {
      success: false,
      message: t("validationError"),
      fieldErrors: (err.body as Record<string, string[]>) ?? undefined,
    };
  }
  if (err instanceof AutomexApiError && err.kind === "rate_limited") {
    return { success: false, message: t("rateLimitError") };
  }
  return { success: false, message: t("genericError") };
}

// ─── /crm — newsletter strip ─────────────────────────────────────────

export async function subscribeNewsletterAction(
  input: Omit<NewsletterSubscribeInput, "language">,
  locale: SupportedLocale
): Promise<ActionResult<NewsletterSubscriberAck>> {
  try {
    return { success: true, data: await subscribeNewsletter(input, locale) };
  } catch (err) {
    return handleAutomexError<NewsletterSubscriberAck>(err, locale);
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
    return handleAutomexError<LeadAck>(err, locale);
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
    return handleAutomexError<LeadAck>(err, locale);
  }
}

// ─── /crm/book-a-call ───────────────────────────────────────────────

/** GET availability for a date — called fresh every time the date picker changes, never cached. */
export async function fetchAvailabilityAction(date: string, locale: SupportedLocale): Promise<ActionResult<AvailableSlot[]>> {
  try {
    return { success: true, data: await fetchAvailability(date) };
  } catch (err) {
    return handleAutomexError<AvailableSlot[]>(err, locale);
  }
}

export async function submitConsultationBookingAction(
  input: Omit<ConsultationBookingInput, "language">,
  locale: SupportedLocale
): Promise<ActionResult<ConsultationBookingAck>> {
  try {
    return { success: true, data: await submitConsultationBooking(input, locale) };
  } catch (err) {
    return handleAutomexError<ConsultationBookingAck>(err, locale);
  }
}

// ─── /crm/guest — guest tracking portal ─────────────────────────────

/** Look up all requests submitted under a guest_token. */
export async function fetchGuestRequestsAction(
  token: string,
  locale: SupportedLocale
): Promise<ActionResult<GuestLead[]>> {
  try {
    return { success: true, data: await fetchGuestRequests(token) };
  } catch (err) {
    return handleAutomexError<GuestLead[]>(err, locale);
  }
}

/** Fetch detail + activity timeline for a single guest request. */
export async function fetchGuestRequestDetailAction(
  id: string,
  token: string,
  locale: SupportedLocale
): Promise<ActionResult<GuestLeadDetail>> {
  try {
    return { success: true, data: await fetchGuestRequestDetail(id, token) };
  } catch (err) {
    return handleAutomexError<GuestLeadDetail>(err, locale);
  }
}

/** Fetch a guest ticket with full message thread. */
export async function fetchGuestTicketDetailAction(
  id: string,
  token: string,
  locale: SupportedLocale
): Promise<ActionResult<GuestTicket>> {
  try {
    return { success: true, data: await fetchGuestTicketDetail(id, token) };
  } catch (err) {
    return handleAutomexError<GuestTicket>(err, locale);
  }
}

/** Create a new support ticket as a guest. */
export async function createGuestTicketAction(
  data: GuestCreateTicketRequest,
  locale: SupportedLocale
): Promise<ActionResult<GuestTicket>> {
  try {
    return { success: true, data: await createGuestTicket(data) };
  } catch (err) {
    return handleAutomexError<GuestTicket>(err, locale);
  }
}

/** Guest replies to an existing ticket. */
export async function sendGuestTicketMessageAction(
  id: string,
  token: string,
  data: GuestTicketMessageCreateRequest,
  locale: SupportedLocale
): Promise<ActionResult<GuestTicketMessage>> {
  try {
    return { success: true, data: await sendGuestTicketMessage(id, token, data) };
  } catch (err) {
    return handleAutomexError<GuestTicketMessage>(err, locale);
  }
}