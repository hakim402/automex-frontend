"use server";

import { fetchAICapabilities } from "@/lib/automex/content";
import type { AICapability } from "@/lib/automex/types";
import type { SupportedLocale } from "@/lib/locale";
import type { ActionResult } from "@/lib/automex/action-result";

export async function loadMoreAICapabilitiesAction(
  page: number,
  category: string | undefined,
  locale: SupportedLocale
): Promise<ActionResult<{ items: AICapability[]; hasMore: boolean }>> {
  try {
    const result = await fetchAICapabilities({ category, page }, locale);
    return { success: true, data: { items: result.results, hasMore: result.next !== null } };
  } catch (err) {
    console.error("[loadMoreAICapabilitiesAction]", err);
    return { success: false, message: "Failed to load more AI capabilities" };
  }
}
