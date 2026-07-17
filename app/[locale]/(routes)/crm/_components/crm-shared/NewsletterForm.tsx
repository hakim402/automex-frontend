"use client";

// components/crm-shared/NewsletterForm.tsx
// Used sitewide: footer, blog sidebar, the /crm hub. Its Server Action
// lives in app/[locale]/(routes)/crm/actions/actions.ts (the hub owns it).
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { Loader2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SupportedLocale } from "@/lib/locale";

import { subscribeNewsletterAction } from "../../actions";
import { useCrmFormSubmit } from "../hooks/useCrmFormSubmit";

const newsletterSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});
type NewsletterValues = z.infer<typeof newsletterSchema>;

export interface NewsletterFormProps {
  source: string;
  className?: string;
}

export function NewsletterForm({ source, className }: NewsletterFormProps) {
  const t = useTranslations("CrmForms.newsletter");
  const locale = useLocale() as SupportedLocale;
  const [submitted, setSubmitted] = useState(false);
  const fieldId = `newsletter-email-${source}`;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<NewsletterValues>({ resolver: zodResolver(newsletterSchema) });

  const { submit, isPending } = useCrmFormSubmit(
    (values: NewsletterValues) => subscribeNewsletterAction({ email: values.email, source }, locale),
    setError,
    () => setSubmitted(true)
  );

  if (submitted) {
    return (
      <div className={cn("flex items-center gap-2 text-[13px] text-emerald-600", className)}>
        <CheckCircle2 className="size-4" aria-hidden="true" />
        {t("successMessage")}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit((v) => submit(v))} className={cn("flex flex-col sm:flex-row gap-2", className)} noValidate>
      <div className="flex-1">
        <label htmlFor={fieldId} className="sr-only">
          {t("emailLabel")}
        </label>
        <Input id={fieldId} type="email" placeholder={t("emailPlaceholder")} {...register("email")} />
        {errors.email && (
          <p role="alert" className="mt-1 text-[12px] text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isPending} className="shrink-0">
        {isPending ? <Loader2 className="size-4 animate-spin" /> : t("submit")}
      </Button>
    </form>
  );
}