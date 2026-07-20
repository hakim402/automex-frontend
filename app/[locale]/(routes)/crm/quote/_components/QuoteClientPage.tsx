"use client";

import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { Loader2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import type { SupportedLocale } from "@/lib/locale";

import { CrmFormField } from "../../_components/crm-shared/CrmFormField";
import { AuthEmailField } from "../../_components/crm-shared/AuthEmailField";
import { BudgetTimelineFields } from "../../_components/crm-shared/fields/BudgetTimelineFields";
import { ServiceMultiSelect } from "../../_components/crm-shared/fields/ServiceMultiSelect";
import { useCrmFormSubmit } from "../../_components/hooks/useCrmFormSubmit";
import { budgetTimelineFields } from "../../_components/crm-shared/schemas";

import { submitQuoteRequestAction } from "../../actions";

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
  const { user, loading } = useAuth();
  const isAuthenticated = !!user && !loading;

  const schema = useMemo(
    () =>
      z.object({
        full_name: z.string().min(2, "Please enter your full name"),
        email: z.string().min(1, "Email is required").email("Enter a valid email address"),
        phone: isAuthenticated ? z.string().optional() : z.string().min(1, "Phone number is required"),
        company: z.string().optional(),
        industry: z.string().optional(),
        requested_services: z.array(z.string()).min(1, "Select at least one service"),
        ...budgetTimelineFields,
        project_description: z.string().min(10, "Please add a few more details (at least 10 characters)"),
        estimated_budget_min: z.string().optional(),
        estimated_budget_max: z.string().optional(),
      }),
    [isAuthenticated]
  );
  type QuoteFormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      budget_range: "not_specified",
      requested_services: defaultServiceId ? [defaultServiceId] : [],
      email: isAuthenticated ? user?.email ?? "" : "",
    },
  });

  const { submit, isPending } = useCrmFormSubmit(
    (values) =>
      submitQuoteRequestAction(
        {
          full_name: values.full_name,
          email: values.email,
          phone: values.phone || undefined,
          company: values.company || undefined,
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
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CrmFormField id="full_name" label={t("fullNameLabel")} required error={errors.full_name?.message}>
              <Input id="full_name" placeholder={t("fullNamePlaceholder")} {...register("full_name")} />
            </CrmFormField>
            <AuthEmailField
              id="email"
              label={t("emailLabel")}
              placeholder={t("emailPlaceholder")}
              registration={register("email")}
              error={errors.email}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CrmFormField id="phone" label={t("phoneLabel")} required={!isAuthenticated} error={errors.phone?.message}>
              <Input id="phone" type="tel" placeholder={t("phonePlaceholder")} {...register("phone")} />
            </CrmFormField>
            <CrmFormField id="company" label={t("companyLabel")} error={errors.company?.message}>
              <Input id="company" placeholder={t("companyPlaceholder")} {...register("company")} />
            </CrmFormField>
          </div>

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

          <ServiceMultiSelect
            control={control}
            name="requested_services"
            label={t("servicesLabel")}
            options={serviceOptions}
            error={errors.requested_services?.message as string | undefined}
          />

          <BudgetTimelineFields control={control} errors={errors} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CrmFormField id="estimated_budget_min" label={t("budgetMinLabel")} error={errors.estimated_budget_min?.message}>
              <Input id="estimated_budget_min" type="number" min={0} step={1000} {...register("estimated_budget_min")} />
            </CrmFormField>
            <CrmFormField id="estimated_budget_max" label={t("budgetMaxLabel")} error={errors.estimated_budget_max?.message}>
              <Input id="estimated_budget_max" type="number" min={0} step={1000} {...register("estimated_budget_max")} />
            </CrmFormField>
          </div>

          <CrmFormField id="project_description" label={t("descriptionLabel")} required error={errors.project_description?.message}>
            <Textarea id="project_description" rows={5} placeholder={t("descriptionPlaceholder")} {...register("project_description")} />
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
