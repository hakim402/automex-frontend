"use server";

import { fetchPortfolioProjects } from "@/lib/automex/content";
import type { PortfolioListParams } from "@/lib/automex/content";
import type { PortfolioProjectList } from "@/lib/automex/types";
import type { SupportedLocale } from "@/lib/locale";
import type { ActionResult } from "@/lib/automex/action-result";

export async function loadMorePortfolioAction(
  page: number,
  params: Omit<PortfolioListParams, "page">,
  locale: SupportedLocale
): Promise<ActionResult<{ items: PortfolioProjectList[]; hasMore: boolean }>> {
  try {
    const result = await fetchPortfolioProjects({ ...params, page }, locale);
    return { success: true, data: { items: result.results, hasMore: result.next !== null } };
  } catch (err) {
    console.error("[loadMorePortfolioAction]", err);
    return { success: false, message: "Failed to load more portfolio projects" };
  }
}
