"use client";

// app/[locale]/(routes)/crm/quote/_components/QuoteClientPage.tsx
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { Loader2, CheckCircle2, FileText, Send, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { SupportedLocale } from "@/lib/locale";

import { CrmFormField } from "../../_components/crm-shared/CrmFormField";
import { BudgetTimelineFields } from "../../_components/crm-shared/fields/BudgetTimelineFields";
import { ServiceMultiSelect } from "../../_components/crm-shared/fields/ServiceMultiSelect";
import { useCrmFormSubmit } from "../../_components/hooks/useCrmFormSubmit";
import { leadContactFields, budgetTimelineFields } from "../../_components/crm-shared/schemas";

import { submitQuoteRequestAction } from "../../actions";

const quoteSchema = z.object({
  ...leadContactFields,
  industry: z.string().optional(),
  requested_services: z.array(z.string()).min(1, "Select at least one service"),
  ...budgetTimelineFields,
  project_description: z.string().min(10, "Please add a few more details (at least 10 characters)"),
  estimated_budget_min: z.string().optional(),
  estimated_budget_max: z.string().optional(),
});
type QuoteFormValues = z.infer<typeof quoteSchema>;

interface QuoteClientPageProps {
  serviceOptions: { id: string; name: string }[];
  industryOptions: { id: string; name: string }[];
  defaultServiceId?: string;
}

export function QuoteClientPage({ serviceOptions, industryOptions, defaultServiceId }: QuoteClientPageProps) {
  const t = useTranslations("CrmForms.quote");
  const tPage = useTranslations("CrmPages.quote");
  const locale = useLocale() as SupportedLocale;
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      budget_range: "not_specified",
      requested_services: defaultServiceId ? [defaultServiceId] : [],
    },
  });

  const { submit, isPending } = useCrmFormSubmit(
    (values: QuoteFormValues) =>
      submitQuoteRequestAction(
        {
          full_name: values.full_name,
          email: values.email,
          phone: values.phone || undefined,
          company: values.company || undefined,
          job_title: values.job_title || undefined,
          industry: values.industry || null,
          requested_services: values.requested_services,
          budget_range: values.budget_range ?? "not_specified",
          timeline: values.timeline,
          project_description: values.project_description,
          estimated_budget_min: values.estimated_budget_min || null,
          estimated_budget_max: values.estimated_budget_max || null,
          currency: "USD",
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
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-[#0ab8fb]/4 blur-3xl" />
        <div className="absolute top-1/2 -left-40 size-[350px] rounded-full bg-[#324b9d]/4 blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        {/* ─── Header ──────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-5">
            <FileText className="size-3" aria-hidden="true" />
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

              {/* Job Title & Industry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <CrmFormField id="job_title" label={t("jobTitleLabel")} error={errors.job_title?.message}>
                  <Input id="job_title" placeholder={t("jobTitlePlaceholder")} {...register("job_title")} />
                </CrmFormField>

                {industryOptions.length > 0 && (
                  <CrmFormField id="industry" label={t("industryLabel")} error={errors.industry?.message}>
                    <Controller
                      name="industry"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="industry" className="w-full">
                            <SelectValue placeholder={t("industryPlaceholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            {industryOptions.map((i) => (
                              <SelectItem key={i.id} value={i.id}>
                                {i.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </CrmFormField>
                )}
              </div>

              {/* Services */}
              <ServiceMultiSelect
                control={control}
                name="requested_services"
                label={t("servicesLabel")}
                options={serviceOptions}
                error={errors.requested_services?.message as string | undefined}
              />

              {/* Budget & Timeline */}
              <BudgetTimelineFields control={control} errors={errors} />

              {/* Budget Range (min/max) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <CrmFormField id="estimated_budget_min" label={t("budgetMinLabel")} hint="USD" error={errors.estimated_budget_min?.message}>
                  <Input id="estimated_budget_min" type="number" min={0} step={1000} placeholder="5,000" {...register("estimated_budget_min")} />
                </CrmFormField>
                <CrmFormField id="estimated_budget_max" label={t("budgetMaxLabel")} hint="USD" error={errors.estimated_budget_max?.message}>
                  <Input id="estimated_budget_max" type="number" min={0} step={1000} placeholder="50,000" {...register("estimated_budget_max")} />
                </CrmFormField>
              </div>

              {/* Project Description */}
              <CrmFormField id="project_description" label={t("descriptionLabel")} required error={errors.project_description?.message}>
                <Textarea id="project_description" rows={5} placeholder={t("descriptionPlaceholder")} {...register("project_description")} />
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