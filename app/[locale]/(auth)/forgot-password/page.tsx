"use client";

// app/[locale]/(auth)/forgot-password/page.tsx

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";
import { motion } from "framer-motion";
import Head from "next/head";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";

import { requestPasswordReset, getErrorMessage } from "@/lib/auth";

import { AuthCard } from "../_components/AuthCard";
import { AuthHeader } from "../_components/AuthHeader";
import { AuthFormField } from "../_components/AuthFormField";
import { BackToHome } from "../_components/BackToHome";

const forgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

type ForgotValues = z.infer<typeof forgotSchema>;

function SuccessState({ email }: { email: string }) {
  const t = useTranslations("Auth");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm p-8 flex flex-col items-center text-center gap-5"
    >
      <div className="flex size-16 items-center justify-center rounded-2xl bg-color shadow-brand">
        <MailCheck className="size-8 text-white" aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground mb-2">{t("forgotPassword.successTitle")}</h2>
        <p className="text-[14px] leading-6 text-muted-foreground">
          {t("forgotPassword.successDescription")}{" "}
          <span className="font-semibold text-foreground">{email}</span>{" "}
          {t("forgotPassword.successAction")}
        </p>
      </div>
      <Link
        href="/sign-in"
        className="text-[13px] font-semibold text-primary hover:underline underline-offset-4"
      >
        {t("forgotPassword.backToLogin")}
      </Link>
    </motion.div>
  );
}

export default function ForgotPasswordPage() {
  const t = useTranslations("Auth");

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotValues) {
    setLoading(true);
    try {
      await requestPasswordReset(values.email);
      setSentEmail(values.email);
      setSent(true);
    } catch (err) {
      // Always show success to prevent email enumeration
      setSentEmail(values.email);
      setSent(true);
      console.error("[forgot-password]", err);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <>
        <Head>
          <title>{t("forgotPassword.metaTitle")}</title>
          <meta name="description" content={t("forgotPassword.metaDescription")} />
        </Head>
        <BackToHome />
        <SuccessState email={sentEmail} />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{t("forgotPassword.metaTitle")}</title>
        <meta name="description" content={t("forgotPassword.metaDescription")} />
      </Head>

      <BackToHome />
      <AuthHeader title={t("forgotPassword.title")} description={t("forgotPassword.description")} />

      <AuthCard>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <AuthFormField
            id="email"
            label={t("common.email")}
            error={errors.email?.message}
            required
          >
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t("common.emailPlaceholder")}
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </AuthFormField>

          <p className="text-[12px] text-muted-foreground -mt-1">{t("forgotPassword.emailHint")}</p>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-color shadow-brand hover:-translate-y-0.5 transition-transform duration-200 font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 me-2 animate-spin" aria-hidden="true" />
                {t("forgotPassword.sending")}
              </>
            ) : (
              t("forgotPassword.submit")
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/sign-in"
              className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              {t("forgotPassword.backToLogin")}
            </Link>
          </div>
        </form>
      </AuthCard>
    </>
  );
}