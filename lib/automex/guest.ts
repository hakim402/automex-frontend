/**
 * guest.ts — Guest CRM fetchers (API key + guest_token).
 *
 * Guests submit forms without creating an account. They receive a
 * `guest_token` in the response, which they can use to check status,
 * reply to tickets, etc.
 *
 * All functions use automexFetch (X-API-Key server-side auth) and
 * pass the guest_token as a query parameter or header.
 */
import { automexFetch } from "./client";
import type {
  GuestLead,
  GuestLeadDetail,
  GuestTicket,
  GuestCreateTicketRequest,
  GuestTicketMessage,
  GuestTicketMessageCreateRequest,
} from "./types";

// ─── Guest Requests / Leads ────────────────────────────────────────────

/** GET /crm/guest/requests/?token=xxx — list guest's submitted requests. */
export function fetchGuestRequests(token: string): Promise<GuestLead[]> {
  return automexFetch<GuestLead[]>(`/crm/guest/requests/?token=${encodeURIComponent(token)}`);
}

/** GET /crm/guest/requests/{id}/?token=xxx — single request detail. */
export function fetchGuestRequestDetail(id: string, token: string): Promise<GuestLeadDetail> {
  return automexFetch<GuestLeadDetail>(
    `/crm/guest/requests/${id}/?token=${encodeURIComponent(token)}`
  );
}

// ─── Guest Tickets ─────────────────────────────────────────────────────

/** GET /crm/guest/tickets/{id}/?token=xxx — ticket detail with messages. */
export function fetchGuestTicketDetail(id: string, token: string): Promise<GuestTicket> {
  return automexFetch<GuestTicket>(
    `/crm/guest/tickets/${id}/?token=${encodeURIComponent(token)}`
  );
}

/** POST /crm/guest/tickets/ — guest creates a new support ticket. */
export function createGuestTicket(
  data: GuestCreateTicketRequest
): Promise<GuestTicket> {
  return automexFetch<GuestTicket>("/crm/guest/tickets/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─── Guest Ticket Messages ─────────────────────────────────────────────

/** POST /crm/guest/tickets/{id}/messages/?token=xxx — guest replies to a ticket. */
export function sendGuestTicketMessage(
  id: string,
  token: string,
  data: GuestTicketMessageCreateRequest
): Promise<GuestTicketMessage> {
  return automexFetch<GuestTicketMessage>(
    `/crm/guest/tickets/${id}/messages/?token=${encodeURIComponent(token)}`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}
