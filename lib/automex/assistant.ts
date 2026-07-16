/**
 * assistant.ts — Single fetcher for the AI Assistant chat endpoint.
 *
 * Session handling (per apps/assistant/services.py):
 *   - First message of a conversation: omit `sessionId` entirely.
 *   - The response's `session_id` is then the real, server-assigned id —
 *     the CALLER (a Client Component holding chat UI state, most likely)
 *     must store it and pass it as `sessionId` on every subsequent message
 *     in the same conversation. Passing a stale/unknown session_id is
 *     harmless — the backend just starts a fresh conversation instead of
 *     erroring — but it silently loses history, so don't drop it.
 *
 * No caching: this is always a live, stateful POST — never pass
 * revalidate/tags (and automexFetch wouldn't use them for a POST anyway).
 *
 * Throttled server-side at the "ai_assistant" scope (20/min, stricter than
 * ordinary writes) — a 429 here should back off the UI (disable send,
 * show "please wait a moment") rather than retry immediately.
 */
import { automexFetch } from "./client";
import type { SupportedLocale } from "@/lib/locale";
import type { ChatResponse } from "./types";

export interface SendChatMessageParams {
  message: string;
  /** Omit on the first message of a new conversation. */
  sessionId?: string;
  language: SupportedLocale;
  /** Current page path, for the assistant's own context — e.g. "/services/custom-software". Optional. */
  pageUrl?: string;
}

export function sendChatMessage({
  message,
  sessionId,
  language,
  pageUrl,
}: SendChatMessageParams): Promise<ChatResponse> {
  return automexFetch<ChatResponse>("/assistant/chat/", {
    method: "POST",
    body: JSON.stringify({
      message,
      session_id: sessionId,
      language,
      page_url: pageUrl,
    }),
  });
}