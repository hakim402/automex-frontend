// components/crm-shared/schemas.ts
import { z } from "zod";

export const BUDGET_VALUES = ["not_specified", "under_10k", "10k_50k", "50k_150k", "150k_plus"] as const;
export const TIMELINE_VALUES = ["asap", "within_1_month", "within_3_months", "within_6_months", "flexible"] as const;
export const MEETING_TYPE_VALUES = ["video", "phone", "in_person"] as const;

export const leadContactFields = {
  full_name: z.string().min(2, "Please enter your full name"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  job_title: z.string().optional(),
};

export const budgetTimelineFields = {
  budget_range: z.enum(BUDGET_VALUES).optional(),
  timeline: z.enum(TIMELINE_VALUES).optional(),
};