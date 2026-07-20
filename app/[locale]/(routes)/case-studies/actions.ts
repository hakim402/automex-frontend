"use server";

import { fetchCaseStudies } from "@/lib/automex/content";
import type { CaseStudyListItem } from "@/lib/automex/types";
import type { SupportedLocale } from "@/lib/locale";
import type { ActionResult } from "@/lib/automex/action-result";

export async function loadMoreCaseStudiesAction(
  industry: string | undefined,
  service: string | undefined,
  technology: string | undefined,
  isFeatured: boolean | undefined,
  page: number,
  locale: SupportedLocale
): Promise<ActionResult<{ items: CaseStudyListItem[]; hasMore: boolean }>> {
  try {
    const result = await fetchCaseStudies(
      { industry, service, technology, is_featured: isFeatured, page },
      locale
    );
    return { success: true, data: { items: result.results, hasMore: result.next !== null } };
  } catch (err) {
    console.error("[loadMoreCaseStudiesAction]", err);
    return { success: false, message: "Something went wrong loading more case studies. Please try again." };
  }
}
