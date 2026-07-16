"use client";

// components/crm/ContactForm.tsx
//
// Drop this anywhere: the dedicated contact page, a footer CTA, a service
// page's "interested?" block, or inside a Dialog. It has no data-fetching
// of its own (keeps it lightweight and reusable) — if you want the
// service dropdown in "full" variant, fetch the list server-side wherever
// you render this and pass it via `serviceOptions`.

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { SupportedLocale } from "@/lib/locale";

import { submitContactLeadAction } from "@/app/actions/crm";
import { CrmFormField } from "./CrmFormField";

const BUDGET_VALUES = ["not_specified", "under_10k", "10k_50k", "50k_150k", "150k_plus"] as const;
const TIMELINE_VALUES = ["asap", "within_1_month", "within_3_months", "within_6_months", "flexible"] as const;

const contactSchema = z.object({
  full_name: z.string().min(2, "Please enter your full name"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service_interest: z.string().optional(),
  budget_range: z.enum(BUDGET_VALUES).optional(),
  timeline: z.enum(TIMELINE_VALUES).optional(),
  message: z.string().min(10, "Please add a few more details (at least 10 characters)"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export interface ContactFormProps {
  /** "compact" shows only name/email/message — good for footers and modals. "full" adds phone/company/service/budget/timeline. */
  variant?: "compact" | "full";
  /** Pre-fills the hidden service_interest field — pass a Service's id when embedding on that service's page. */
  defaultServiceInterest?: string;
  /** Only used in "full" variant. Fetch server-side (fetchServices) and pass down — this component doesn't fetch its own data. */
  serviceOptions?: { id: string; name: string }[];
  className?: string;
  onSuccess?: () => void;
}

export function ContactForm({
  variant = "full",
  defaultServiceInterest,
  serviceOptions = [],
  className,
  onSuccess,
}: ContactFormProps) {
  const t = useTranslations("CrmForms.contact");
  const locale = useLocale() as SupportedLocale;
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      budget_range: "not_specified",
      service_interest: defaultServiceInterest,
    },
  });

  function onSubmit(values: ContactFormValues) {
    startTransition(async () => {
      const result = await submitContactLeadAction(
        {
          full_name: values.full_name,
          email: values.email,
          phone: values.phone || undefined,
          company: values.company || undefined,
          service_interest: values.service_interest || null,
          budget_range: values.budget_range ?? "not_specified",
          timeline: values.timeline,
          message: values.message,
        },
        locale
      );

      if (result.success) {
        setSubmitted(true);
        onSuccess?.();
        return;
      }

      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (field in contactSchema.shape) {
            setError(field as keyof ContactFormValues, { message: messages[0] });
          }
        }
        toast.error(t("validationError"));
        return;
      }

      toast.error(result.message);
    });
  }

  if (submitted) {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card/80 p-8 text-center",
          className
        )}
      >
        <CheckCircle2 className="size-10 text-emerald-500" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-foreground">{t("successTitle")}</h3>
        <p className="text-[14px] text-muted-foreground">{t("successBody")}</p>
        <Button
          variant="outline"
          onClick={() => {
            setSubmitted(false);
            reset();
          }}
        >
          {t("sendAnother")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-4", className)} noValidate>
      <CrmFormField id="full_name" label={t("fullNameLabel")} required error={errors.full_name?.message}>
        <Input id="full_name" placeholder={t("fullNamePlaceholder")} {...register("full_name")} />
      </CrmFormField>

      <CrmFormField id="email" label={t("emailLabel")} required error={errors.email?.message}>
        <Input id="email" type="email" placeholder={t("emailPlaceholder")} {...register("email")} />
      </CrmFormField>

      {variant === "full" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CrmFormField id="phone" label={t("phoneLabel")} error={errors.phone?.message}>
              <Input id="phone" type="tel" placeholder={t("phonePlaceholder")} {...register("phone")} />
            </CrmFormField>

            <CrmFormField id="company" label={t("companyLabel")} error={errors.company?.message}>
              <Input id="company" placeholder={t("companyPlaceholder")} {...register("company")} />
            </CrmFormField>
          </div>

          {serviceOptions.length > 0 && (
            <CrmFormField id="service_interest" label={t("serviceLabel")} error={errors.service_interest?.message}>
              <Controller
                name="service_interest"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="service_interest" className="w-full">
                      <SelectValue placeholder={t("servicePlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceOptions.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </CrmFormField>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CrmFormField id="budget_range" label={t("budgetLabel")} error={errors.budget_range?.message}>
              <Controller
                name="budget_range"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="budget_range" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGET_VALUES.map((v) => (
                        <SelectItem key={v} value={v}>
                          {t(`budgetOptions.${v}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </CrmFormField>

            <CrmFormField id="timeline" label={t("timelineLabel")} error={errors.timeline?.message}>
              <Controller
                name="timeline"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="timeline" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMELINE_VALUES.map((v) => (
                        <SelectItem key={v} value={v}>
                          {t(`timelineOptions.${v}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </CrmFormField>
          </div>
        </>
      )}

      <CrmFormField id="message" label={t("messageLabel")} required error={errors.message?.message}>
        <Textarea id="message" rows={5} placeholder={t("messagePlaceholder")} {...register("message")} />
      </CrmFormField>

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" /> {t("submitting")}
          </>
        ) : (
          t("submit")
        )}
      </Button>
    </form>
  );
}