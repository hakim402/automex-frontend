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

// lib/automex/dashboard.ts

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
  DashboardLeadWithActivities,
  ConversationList,
  ConversationHistory,
  LeadStatus,
  LeadType,
  ConsultationBookingStatus,
  TicketStatus,
  TicketTypeEnum,
} from "./types";

/** Standard DRF paginated response wrapper. */
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/** Return type for paginated list fetchers. */
export interface PaginatedResult<T> {
  results: T[];
  hasNext: boolean;
  count: number;
}

// ─── Summary ───────────────────────────────────────────────────────────

/** GET /crm/dashboard/ — overview stats (total requests, bookings, tickets, etc.) */
export function fetchDashboardSummary(): Promise<DashboardSummary> {
  return authRequest<DashboardSummary>("/crm/dashboard/");
}

// ─── Requests / Leads ──────────────────────────────────────────────────

/** Filters for GET /crm/dashboard/requests/ */
export interface LeadFilters {
  status?: LeadStatus | "all";
  lead_type?: LeadType | "all";
}

/** GET /crm/dashboard/requests/ — paginated list of user's leads with optional server-side filters. */
export async function fetchDashboardLeads(
  page = 1,
  filters?: LeadFilters
): Promise<PaginatedResult<DashboardLead>> {
  const params = new URLSearchParams({ page: String(page) });
  if (filters?.status && filters.status !== "all") params.set("status", filters.status);
  if (filters?.lead_type && filters.lead_type !== "all") params.set("lead_type", filters.lead_type);
  const res = await authRequest<PaginatedResponse<DashboardLead>>(`/crm/dashboard/requests/?${params}`);
  return { results: res.results ?? [], hasNext: !!res.next, count: res.count };
}

/** GET /crm/dashboard/requests/{id}/ — lead detail with activities timeline. */
export function fetchDashboardLeadDetail(id: string): Promise<DashboardLeadWithActivities> {
  return authRequest<DashboardLeadWithActivities>(`/crm/dashboard/requests/${id}/`);
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

/** Filters for GET /crm/dashboard/bookings/ */
export interface BookingFilters {
  status?: ConsultationBookingStatus | "all";
}

/** GET /crm/dashboard/bookings/ — paginated list of user's bookings with optional server-side filters. */
export async function fetchDashboardBookings(
  page = 1,
  filters?: BookingFilters
): Promise<PaginatedResult<DashboardBooking>> {
  const params = new URLSearchParams({ page: String(page) });
  if (filters?.status && filters.status !== "all") params.set("status", filters.status);
  const res = await authRequest<PaginatedResponse<DashboardBooking>>(`/crm/dashboard/bookings/?${params}`);
  return { results: res.results ?? [], hasNext: !!res.next, count: res.count };
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

/** Filters for GET /crm/dashboard/tickets/ */
export interface TicketFilters {
  status?: TicketStatus | "all";
  ticket_type?: TicketTypeEnum | "all";
}

/** GET /crm/dashboard/tickets/ — paginated ticket list with optional server-side filters. */
export async function fetchDashboardTickets(
  page = 1,
  filters?: TicketFilters
): Promise<PaginatedResult<DashboardTicketList>> {
  const params = new URLSearchParams({ page: String(page) });
  if (filters?.status && filters.status !== "all") params.set("status", filters.status);
  if (filters?.ticket_type && filters.ticket_type !== "all") params.set("ticket_type", filters.ticket_type);
  const res = await authRequest<PaginatedResponse<DashboardTicketList>>(`/crm/dashboard/tickets/?${params}`);
  return { results: res.results ?? [], hasNext: !!res.next, count: res.count };
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
export async function fetchDashboardCalculations(page = 1): Promise<PaginatedResult<DashboardCalculation>> {
  const res = await authRequest<PaginatedResponse<DashboardCalculation>>(`/crm/dashboard/calculations/?page=${page}`);
  return { results: res.results ?? [], hasNext: !!res.next, count: res.count };
}

/** POST /crm/dashboard/calculations/{id}/convert/ — convert estimate to a lead. */
export function convertDashboardCalculation(id: string): Promise<DashboardCalculation> {
  return authRequest<DashboardCalculation>(`/crm/dashboard/calculations/${id}/convert/`, {
    method: "POST",
  });
}

// ─── AI Conversation History (JWT) ───────────────────────────────────────

/** GET /assistant/conversations/ — list user's past conversations (max 50). */
export function fetchConversations(): Promise<ConversationList[]> {
  return authRequest<ConversationList[]>("/assistant/conversations/");
}

/** GET /assistant/conversations/{id}/ — full conversation with all messages. */
export function fetchConversationDetail(id: string): Promise<ConversationHistory> {
  return authRequest<ConversationHistory>(`/assistant/conversations/${id}/`);
}
