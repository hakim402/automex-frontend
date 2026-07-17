"use server";

// app/[locale]/(routes)/services/actions.ts
//
// One action: "Load more" pagination for the services grid. Category
// filtering itself is URL-driven (searchParams, real crawlable links —
// see ServicesClientPage's filter pills), so this only ever appends
// subsequent pages of the CURRENTLY selected filter, client-side,
// without a full page navigation.

import { fetchServices } from "@/lib/automex/content";
import type { ServiceListItem } from "@/lib/automex/types";
import type { SupportedLocale } from "@/lib/locale";
import type { ActionResult } from "@/lib/automex/action-result";

export async function loadMoreServicesAction(
  category: string | undefined,
  page: number,
  locale: SupportedLocale
): Promise<ActionResult<{ items: ServiceListItem[]; hasMore: boolean }>> {
  try {
    const result = await fetchServices({ category, page }, locale);
    return { success: true, data: { items: result.results, hasMore: result.next !== null } };
  } catch (err) {
    console.error("[loadMoreServicesAction]", err);
    return { success: false, kind: "generic" };
  }
}