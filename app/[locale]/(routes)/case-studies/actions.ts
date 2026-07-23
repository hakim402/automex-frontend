"use server";

import { fetchCaseStudies } from "@/lib/automex/content";
import type { CaseStudyListItem } from "@/lib/automex/types";
import type { SupportedLocale } from "@/lib/locale";
import type { ActionResult } from "@/lib/automex/action-result";

export async function loadMoreCaseStudiesAction(
  industry: string | undefined,
  service: string | undefined,
  technology: string | undefined,
  page: number,
  locale: SupportedLocale
): Promise<ActionResult<{ items: CaseStudyListItem[]; hasMore: boolean }>> {
  try {
    const result = await fetchCaseStudies({ industry, service, technology, page }, locale);
    return { success: true, data: { items: result.results, hasMore: result.next !== null } };
  } catch (err) {
    console.error("[loadMoreCaseStudiesAction]", err);
    return { success: false, message: "Failed to load more case studies" };
  }
}
