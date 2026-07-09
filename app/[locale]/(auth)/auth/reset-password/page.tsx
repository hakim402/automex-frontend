"use client";

// app/[locale]/(auth)/reset-password/page.tsx

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Head from "next/head";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

import { confirmPasswordReset, getErrorMessage } from "@/lib/auth";

import { AuthCard } from "../../_components/AuthCard";
import { AuthHeader } from "../../_components/AuthHeader";
import { AuthFormField } from "../../_components/AuthFormField";
import { PasswordInput } from "../../_components/PasswordInput";
import { BackToHome } from "../../_components/BackToHome";

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    password_confirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.password_confirm, {
    message: "Passwords do not match",
    path: ["password_confirm"],
  });

type ResetValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const t = useTranslations("Auth");
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const token = searchParams.get("token") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", password_confirm: "" },
  });

  if (!token) {
    return (
      <>
        <Head>
          <title>{t("resetPassword.invalidTitle")}</title>
          <meta name="description" content={t("resetPassword.invalidDescription")} />
        </Head>
        <div className="flex flex-col min-h-screen items-center justify-center px-5 py-12">
          <BackToHome />
          <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm p-8 text-center space-y-4">
            <h1 className="text-xl font-bold text-foreground">{t("resetPassword.invalidTitle")}</h1>
            <p className="text-[14px] text-muted-foreground">{t("resetPassword.invalidDescription")}</p>
            <a
              href="/forgot-password"
              className="inline-block text-[13px] font-semibold text-primary hover:underline underline-offset-4"
            >
              {t("resetPassword.requestNew")}
            </a>
          </div>
        </div>
      </>
    );
  }

  async function onSubmit(values: ResetValues) {
    setLoading(true);
    try {
      await confirmPasswordReset({
        token,
        password: values.password,
        password_confirm: values.password_confirm,
      });
      toast.success(t("resetPassword.success"));
      router.push("/sign-in");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>{t("resetPassword.metaTitle")}</title>
        <meta name="description" content={t("resetPassword.metaDescription")} />
      </Head>

      <BackToHome />
      <AuthHeader title={t("resetPassword.title")} description={t("resetPassword.description")} />

      <AuthCard>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <AuthFormField
            id="password"
            label={t("common.password")}
            error={errors.password?.message}
            required
          >
            <PasswordInput
              id="password"
              autoComplete="new-password"
              placeholder={t("common.passwordPlaceholder")}
              aria-invalid={!!errors.password}
              showLabel={t("common.showPassword")}
              hideLabel={t("common.hidePassword")}
              {...register("password")}
            />
          </AuthFormField>

          <AuthFormField
            id="password_confirm"
            label={t("common.confirmPassword")}
            error={errors.password_confirm?.message}
            required
          >
            <PasswordInput
              id="password_confirm"
              autoComplete="new-password"
              placeholder={t("common.confirmPasswordPlaceholder")}
              aria-invalid={!!errors.password_confirm}
              showLabel={t("common.showPassword")}
              hideLabel={t("common.hidePassword")}
              {...register("password_confirm")}
            />
          </AuthFormField>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-color shadow-brand hover:-translate-y-0.5 transition-transform duration-200 font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 me-2 animate-spin" aria-hidden="true" />
                {t("resetPassword.updating")}
              </>
            ) : (
              t("resetPassword.submit")
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/sign-in"
              className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4"
            >
              {t("resetPassword.backToLogin")}
            </Link>
          </div>
        </form>
      </AuthCard>
    </>
  );
}