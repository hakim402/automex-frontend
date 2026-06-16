/**
 * auth/reset-password/page.tsx — Set a new password using a reset token
 *
 * Flow:
 *   1. Backend sends email → link to /[locale]/auth/reset-password?token=XXX
 *   2. User enters new password + confirm
 *   3. Calls POST /auth/password-reset/confirm/
 *   4. On success → redirect to sign-in with a toast
 *
 * PUBLIC_ROUTE — accessible without auth.
 */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

import { confirmPasswordReset, getErrorMessage } from "@/lib/auth";

import { AuthCard }      from "../../_components/AuthCard";
import { AuthHeader }    from "../../_components/AuthHeader";
import { AuthFormField } from "../../_components/AuthFormField";
import { PasswordInput } from "../../_components/PasswordInput";
import { BackToHome }    from "../../_components/BackToHome";

// ─── Validation schema ────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────

export default function ResetPasswordPage() {
  const t            = useTranslations("Auth");
  const searchParams = useSearchParams();
  const router       = useRouter();

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

  // Guard: show error if no token in URL
  if (!token) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-5 py-12">
        <BackToHome />
        <div className="w-full max-w-md rounded-2xl border border-border/60
                        bg-card/80 backdrop-blur-sm shadow-sm p-8 text-center space-y-4">
          <h1 className="text-xl font-bold text-foreground">Invalid reset link</h1>
          <p className="text-[14px] text-muted-foreground">
            This link is missing a reset token. Please use the link from your email,
            or request a new one.
          </p>
          <a
            href="/auth/forgot-password"
            className="inline-block text-[13px] font-semibold text-primary
                       hover:underline underline-offset-4"
          >
            Request a new reset link
          </a>
        </div>
      </div>
    );
  }

  // ── Submit ──────────────────────────────────────────────────────────────
  async function onSubmit(values: ResetValues) {
    setLoading(true);
    try {
      await confirmPasswordReset({
        token,
        password:         values.password,
        password_confirm: values.password_confirm,
      });

      toast.success("Password updated. Please sign in with your new password.");
      router.push("/sign-in");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <BackToHome />

      <AuthHeader
        title="Set new password"
        description="Choose a strong password for your IDWE account."
      />

      <AuthCard>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

          {/* New password */}
          <AuthFormField
            id="password"
            label={t("common.password")}
            error={errors.password?.message}
            required
          >
            <PasswordInput
              id="password"
              autoComplete="new-password"
              placeholder="New password"
              aria-invalid={!!errors.password}
              showLabel={t("common.showPassword")}
              hideLabel={t("common.hidePassword")}
              {...register("password")}
            />
          </AuthFormField>

          {/* Confirm new password */}
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
            className="w-full rounded-full bg-color shadow-brand
                       hover:-translate-y-0.5 transition-transform duration-200
                       font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 me-2 animate-spin" aria-hidden="true" />
                Updating password…
              </>
            ) : (
              "Update password"
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/sign-in"
              className="text-[13px] font-medium text-muted-foreground
                         hover:text-foreground transition-colors hover:underline underline-offset-4"
            >
              Back to sign in
            </Link>
          </div>
        </form>
      </AuthCard>
    </>
  );
}