"use server";

// app/actions/crm.ts

import { submitContactLead } from "@/lib/automex/crm";
import { AutomexApiError } from "@/lib/automex/client";
import type { ContactLeadInput, LeadAck } from "@/lib/automex/types";
import type { SupportedLocale } from "@/lib/locale";
import type { ActionResult } from "@/lib/automex/action-result";

export async function submitContactLeadAction(
  input: Omit<ContactLeadInput, "language">,
  locale: SupportedLocale
): Promise<ActionResult<LeadAck>> {
  try {
    const data = await submitContactLead(input, locale);
    return { success: true, data };
  } catch (err) {
    if (err instanceof AutomexApiError && err.kind === "validation") {
      return {
        success: false,
        message: "Please check the highlighted fields.",
        fieldErrors: (err.body as Record<string, string[]>) ?? undefined,
      };
    }
    if (err instanceof AutomexApiError && err.kind === "rate_limited") {
      return { success: false, message: "Too many requests — please wait a moment and try again." };
    }
    console.error("[submitContactLeadAction]", err);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}