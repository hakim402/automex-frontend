"use client";

// app/[locale]/(routes)/crm/contact/_components/ContactClientPage.tsx
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { Loader2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24">

      <div className="text-center mb-10">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-primary mb-2">{tPage("hero.eyebrow")}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{tPage("hero.title")}</h1>
        <p className="text-[14px] text-muted-foreground max-w-xl mx-auto">{tPage("hero.description")}</p>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card/80 p-8 text-center">
          <CheckCircle2 className="size-10 text-emerald-500" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground">{t("successTitle")}</h2>
          <p className="text-[14px] text-muted-foreground">{t("successBody")}</p>
          <Button variant="outline" onClick={() => { setSubmitted(false); reset(); }}>
            {t("sendAnother")}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit((v) => submit(v))} className="flex flex-col gap-4" noValidate>
          <CrmFormField id="full_name" label={t("fullNameLabel")} required error={errors.full_name?.message}>
            <Input id="full_name" placeholder={t("fullNamePlaceholder")} {...register("full_name")} />
          </CrmFormField>

          <CrmFormField id="email" label={t("emailLabel")} required error={errors.email?.message}>
            <Input id="email" type="email" placeholder={t("emailPlaceholder")} {...register("email")} />
          </CrmFormField>

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

          <BudgetTimelineFields control={control} errors={errors} />

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
      )}
    </div>
  );
}