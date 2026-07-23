/**
 * dashboard.ts — JWT-authenticated fetchers for the AUTOMEX CRM dashboard.
 *
 * Covers all endpoints under /crm/dashboard/:
 *   - Summary stats
 *   - Requests / Leads (list, detail, send message)
 *   - Bookings (list, detail, reschedule, cancel)
 *   - Support Tickets (list, detail, create, send message)
 *   - Calculator Estimates (list, convert)
 *
 * All functions use authRequest (Bearer token) from lib/api.ts.
 */
import { authRequest } from "@/lib/api";
import type {
  DashboardSummary,
  DashboardLead,
  DashboardLeadMessageRequest,
  DashboardBooking,
  DashboardRescheduleRequest,
  DashboardCalculation,
  DashboardTicket,
  DashboardTicketList,
  CreateTicketRequest,
  SupportTicketMessage,
} from "./types";

// ─── Summary ───────────────────────────────────────────────────────────

/** GET /crm/dashboard/ — overview stats (total requests, bookings, tickets, etc.) */
export function fetchDashboardSummary(): Promise<DashboardSummary> {
  return authRequest<DashboardSummary>("/crm/dashboard/");
}

// ─── Requests / Leads ──────────────────────────────────────────────────

/** GET /crm/dashboard/requests/ — paginated list of user's leads. */
export function fetchDashboardLeads(page = 1): Promise<DashboardLead[]> {
  return authRequest<DashboardLead[]>(`/crm/dashboard/requests/?page=${page}`);
}

/** GET /crm/dashboard/requests/{id}/ — lead detail with activities timeline. */
export function fetchDashboardLeadDetail(id: string): Promise<DashboardLead> {
  return authRequest<DashboardLead>(`/crm/dashboard/requests/${id}/`);
}

/** POST /crm/dashboard/requests/{id}/message/ — send a message to staff about this lead. */
export function sendDashboardLeadMessage(
  id: string,
  message: string
): Promise<void> {
  return authRequest<void>(`/crm/dashboard/requests/${id}/message/`, {
    method: "POST",
    body: { message } satisfies DashboardLeadMessageRequest,
  });
}

// ─── Bookings ──────────────────────────────────────────────────────────

/** GET /crm/dashboard/bookings/ — paginated list of user's bookings. */
export function fetchDashboardBookings(page = 1): Promise<DashboardBooking[]> {
  return authRequest<DashboardBooking[]>(`/crm/dashboard/bookings/?page=${page}`);
}

/** GET /crm/dashboard/bookings/{id}/ — full booking detail. */
export function fetchDashboardBookingDetail(id: string): Promise<DashboardBooking> {
  return authRequest<DashboardBooking>(`/crm/dashboard/bookings/${id}/`);
}

/** POST /crm/dashboard/bookings/{id}/reschedule/ — request a new date/time. */
export function rescheduleDashboardBooking(
  id: string,
  data: DashboardRescheduleRequest
): Promise<DashboardBooking> {
  return authRequest<DashboardBooking>(`/crm/dashboard/bookings/${id}/reschedule/`, {
    method: "POST",
    body: data,
  });
}

/** POST /crm/dashboard/bookings/{id}/cancel/ — cancel a booking. */
export function cancelDashboardBooking(id: string): Promise<DashboardBooking> {
  return authRequest<DashboardBooking>(`/crm/dashboard/bookings/${id}/cancel/`, {
    method: "POST",
  });
}

// ─── Support Tickets ───────────────────────────────────────────────────

/** GET /crm/dashboard/tickets/ — paginated ticket list (no messages). */
export function fetchDashboardTickets(page = 1): Promise<DashboardTicketList[]> {
  return authRequest<DashboardTicketList[]>(`/crm/dashboard/tickets/?page=${page}`);
}

/** GET /crm/dashboard/tickets/{id}/ — ticket detail with messages + unread count. */
export function fetchDashboardTicketDetail(id: string): Promise<DashboardTicket> {
  return authRequest<DashboardTicket>(`/crm/dashboard/tickets/${id}/`);
}

/** POST /crm/dashboard/tickets/ — create a new support ticket. */
export function createDashboardTicket(
  data: CreateTicketRequest
): Promise<DashboardTicket> {
  return authRequest<DashboardTicket>("/crm/dashboard/tickets/", {
    method: "POST",
    body: data,
  });
}

/** POST /crm/dashboard/tickets/{id}/messages/ — reply to a ticket. */
export function sendDashboardTicketMessage(
  id: string,
  body: string
): Promise<SupportTicketMessage> {
  return authRequest<SupportTicketMessage>(`/crm/dashboard/tickets/${id}/messages/`, {
    method: "POST",
    body: { body },
  });
}

// ─── Calculator Estimates ──────────────────────────────────────────────

/** GET /crm/dashboard/calculations/ — past cost estimates, paginated. */
export function fetchDashboardCalculations(page = 1): Promise<DashboardCalculation[]> {
  return authRequest<DashboardCalculation[]>(`/crm/dashboard/calculations/?page=${page}`);
}

/** POST /crm/dashboard/calculations/{id}/convert/ — convert estimate to a lead. */
export function convertDashboardCalculation(id: string): Promise<DashboardCalculation> {
  return authRequest<DashboardCalculation>(`/crm/dashboard/calculations/${id}/convert/`, {
    method: "POST",
  });
}
