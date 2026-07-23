/**
 * notifications.ts — JWT-authenticated fetchers for user notifications.
 *
 * These endpoints require a valid user session (Bearer token), so they
 * use authRequest() from lib/api.ts rather than automexFetch() which
 * uses the X-API-Key server-side auth path.
 *
 * All functions are client-safe: they read tokens from localStorage
 * and support the automatic token-refresh flow in authRequest.
 */
import { authRequest } from "@/lib/api";
import type {
  NotificationList,
  NotificationUnreadCount,
  NotificationPreference,
  NotificationPreferenceUpdate,
} from "./types";

// ─── List ──────────────────────────────────────────────────────────────

/** GET /notifications/ — returns the user's notification list. */
export function fetchNotifications(): Promise<NotificationList[]> {
  return authRequest<NotificationList[]>("/notifications/");
}

// ─── Unread count ──────────────────────────────────────────────────────

/** GET /notifications/unread-count/ — returns { unread_count: number }. */
export function fetchUnreadCount(): Promise<NotificationUnreadCount> {
  return authRequest<NotificationUnreadCount>("/notifications/unread-count/");
}

// ─── Mark read ─────────────────────────────────────────────────────────

/** POST /notifications/{id}/mark-read/ — mark a single notification as read. */
export function markNotificationRead(id: string): Promise<void> {
  return authRequest<void>(`/notifications/${id}/mark-read/`, {
    method: "POST",
  });
}

/** POST /notifications/mark-all-read/ — mark all notifications as read. */
export function markAllNotificationsRead(): Promise<void> {
  return authRequest<void>("/notifications/mark-all-read/", {
    method: "POST",
  });
}

// ─── Preferences ───────────────────────────────────────────────────────

/** GET /notifications/preferences/ — get user's notification preferences. */
export function fetchNotificationPreferences(): Promise<NotificationPreference[]> {
  return authRequest<NotificationPreference[]>("/notifications/preferences/");
}

/** PUT /notifications/preferences/ — update notification preferences in bulk. */
export function updateNotificationPreferences(
  data: NotificationPreferenceUpdate
): Promise<NotificationPreference[]> {
  return authRequest<NotificationPreference[]>("/notifications/preferences/", {
    method: "PUT",
    body: data,
  });
}
