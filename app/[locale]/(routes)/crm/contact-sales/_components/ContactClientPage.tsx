"use client";

// app/[locale]/(routes)/crm/contact/_components/ContactClientPage.tsx
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { Loader2, CheckCircle2, MessageSquare, Send, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { SupportedLocale } from "@/lib/locale";

import { CrmFormField } from "../../_components/crm-shared/CrmFormField";
import { BudgetTimelineFields } from "../../_components/crm-shared/fields/BudgetTimelineFields";
import { useCrmFormSubmit } from "../../_components/hooks/useCrmFormSubmit";
import { leadContactFields, budgetTimelineFields } from "../../_components/crm-shared/schemas";

import { submitContactLeadAction } from "../../actions";

const contactSchema = z.object({
  ...leadContactFields,
  service_interest: z.string().optional(),
  ...budgetTimelineFields,
  message: z.string().min(10, "Please add a few more details (at least 10 characters)"),
});
type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactClientPageProps {
  serviceOptions: { id: string; name: string }[];
  defaultServiceInterest?: string;
}

export function ContactClientPage({ serviceOptions, defaultServiceInterest }: ContactClientPageProps) {
  const t = useTranslations("CrmForms.contact");
  const tPage = useTranslations("CrmPages.contact");
  const locale = useLocale() as SupportedLocale;
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
    defaultValues: { budget_range: "not_specified", service_interest: defaultServiceInterest },
  });

  const { submit, isPending } = useCrmFormSubmit(
    (values: ContactFormValues) =>
      submitContactLeadAction(
        {
          full_name: values.full_name,
          email: values.email,
          phone: values.phone || undefined,
          company: values.company || undefined,
          job_title: values.job_title || undefined,
          service_interest: values.service_interest || null,
          budget_range: values.budget_range ?? "not_specified",
          timeline: values.timeline,
          message: values.message,
        },
        locale
      ),
    setError,
    () => setSubmitted(true)
  );

  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-[#324b9d]/4 blur-3xl" />
        <div className="absolute top-1/3 -right-40 size-[350px] rounded-full bg-[#0ab8fb]/4 blur-3xl" />
      </div>

      <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
        {/* ─── Header ──────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#324b9d]/20 bg-[#324b9d]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#324b9d] mb-5">
            <MessageSquare className="size-3" aria-hidden="true" />
            {tPage("hero.eyebrow")}
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {tPage("hero.title")}
          </h1>
          <p className="text-[14px] text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {tPage("hero.description")}
          </p>
        </div>

        {submitted ? (
          /* ─── Success ───────────────────────────────────────── */
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-8 sm:p-10 text-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/5 via-transparent to-[#0ab8fb]/5"
            />

            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/10 mb-5">
              <CheckCircle2 className="size-7 text-emerald-500" aria-hidden="true" />
            </div>

            <h2 className="text-xl font-bold text-foreground mb-2">
              {t("successTitle")}
            </h2>
            <p className="text-[14px] text-muted-foreground max-w-sm mx-auto mb-6 leading-relaxed">
              {t("successBody")}
            </p>

            <Button
              variant="outline"
              className="border-brand-gradient text-[13px]"
              onClick={() => { setSubmitted(false); reset(); }}
            >
              <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden="true" />
              {t("sendAnother")}
            </Button>
          </div>
        ) : (
          /* ─── Form card ─────────────────────────────────────── */
          <div className="rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleSubmit((v) => submit(v))} className="flex flex-col gap-5" noValidate>
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <CrmFormField id="full_name" label={t("fullNameLabel")} required error={errors.full_name?.message}>
                  <Input id="full_name" placeholder={t("fullNamePlaceholder")} {...register("full_name")} />
                </CrmFormField>

                <CrmFormField id="email" label={t("emailLabel")} required error={errors.email?.message}>
                  <Input id="email" type="email" placeholder={t("emailPlaceholder")} {...register("email")} />
                </CrmFormField>
              </div>

              {/* Phone & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <CrmFormField id="phone" label={t("phoneLabel")} error={errors.phone?.message}>
                  <Input id="phone" type="tel" placeholder={t("phonePlaceholder")} {...register("phone")} />
                </CrmFormField>
                <CrmFormField id="company" label={t("companyLabel")} error={errors.company?.message}>
                  <Input id="company" placeholder={t("companyPlaceholder")} {...register("company")} />
                </CrmFormField>
              </div>

              {/* Job Title */}
              <CrmFormField id="job_title" label={t("jobTitleLabel")} error={errors.job_title?.message}>
                <Input id="job_title" placeholder={t("jobTitlePlaceholder")} {...register("job_title")} />
              </CrmFormField>

              {/* Service Interest */}
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

              {/* Budget & Timeline */}
              <BudgetTimelineFields control={control} errors={errors} />

              {/* Message */}
              <CrmFormField id="message" label={t("messageLabel")} required error={errors.message?.message}>
                <Textarea id="message" rows={5} placeholder={t("messagePlaceholder")} {...register("message")} />
              </CrmFormField>

              {/* Divider + Submit */}
              <div className="border-t border-border/40 pt-5">
                <Button
                  type="submit"
                  disabled={isPending}
                  size="lg"
                  className="w-full bg-brand-gradient shadow-brand"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> {t("submitting")}
                    </>
                  ) : (
                    <>
                      <Send className="size-4" aria-hidden="true" />
                      {t("submit")}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}