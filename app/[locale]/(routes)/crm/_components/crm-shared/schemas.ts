// components/crm-shared/schemas.ts
import { z } from "zod";

export const BUDGET_VALUES = [
  "not_specified",
  "under_10k",
  "10k_50k",
  "50k_150k",
  "150k_plus",
] as const;
export const TIMELINE_VALUES = [
  "asap",
  "within_1_month",
  "within_3_months",
  "within_6_months",
  "flexible",
] as const;
export const MEETING_TYPE_VALUES = ["video", "phone", "in_person"] as const;

/**
 * Returns Zod field definitions for lead-contact forms.
 *
 * - Authenticated users: email is pre-filled & locked (still in schema
 *   so react-hook-form tracks it, but the UI disables the input).
 * - Guest users: email required, phone required.
 */
export function getLeadContactFields(isAuthenticated: boolean) {
  if (isAuthenticated) {
    return {
      full_name: z.string().min(2, "Please enter your full name"),
      email: z
        .string()
        .min(1, "Email is required")
        .email("Enter a valid email address"),
      phone: z.string().optional(),
      company: z.string().optional(),
    };
  }
  return {
    full_name: z.string().min(2, "Please enter your full name"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    phone: z.string().min(1, "Phone number is required"),
    company: z.string().optional(),
  };
}

// Legacy export — prefer the factory function in new code.
export const leadContactFields = getLeadContactFields(false);

export const budgetTimelineFields = {
  budget_range: z.enum(BUDGET_VALUES).optional(),
  timeline: z.enum(TIMELINE_VALUES).optional(),
};
