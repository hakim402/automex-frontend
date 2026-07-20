"use server";

import { fetchBlogPosts } from "@/lib/automex/content";
import type { BlogPostListItem } from "@/lib/automex/types";
import type { SupportedLocale } from "@/lib/locale";
import type { ActionResult } from "@/lib/automex/action-result";

export async function loadMoreBlogPostsAction(
  category: string | undefined,
  tag: string | undefined,
  page: number,
  locale: SupportedLocale
): Promise<ActionResult<{ items: BlogPostListItem[]; hasMore: boolean }>> {
  try {
    const result = await fetchBlogPosts({ category, tag, page }, locale);
    return { success: true, data: { items: result.results, hasMore: result.next !== null } };
  } catch (err) {
    console.error("[loadMoreBlogPostsAction]", err);
    return { success: false, message: "Something went wrong loading more posts. Please try again." };
  }
}
