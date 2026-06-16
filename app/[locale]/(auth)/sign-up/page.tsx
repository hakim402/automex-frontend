/**
 * sign-up/page.tsx — New account registration
 *
 * Features:
 *   • Full name, email, password, confirm password
 *   • Password strength indicator
 *   • Terms + privacy checkbox (required)
 *   • Google OAuth as alternative
 *   • On success → shows "check your email" confirmation state
 *   • Inline field errors + sonner toast for API errors
 */
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@/i18n/routing";

import { register as registerUser, getErrorMessage } from "@/lib/auth";

import { AuthCard } from "../_components/AuthCard";
import { AuthHeader } from "../_components/AuthHeader";
import { AuthFormField } from "../_components/AuthFormField";
import { PasswordInput } from "../_components/PasswordInput";
import { AuthDivider } from "../_components/AuthDivider";
import { GoogleButton } from "../_components/GoogleButton";
import { AuthFooterLink } from "../_components/AuthFooterLink";
import { BackToHome } from "../_components/BackToHome";

// ─── Validation schema ────────────────────────────────────────────────────────

const signUpSchema = z
  .object({
    full_name: z
      .string()
      .min(2, "Full name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    password_confirm: z.string().min(1, "Please confirm your password"),
    terms_accepted: z
      .boolean()
      .refine((v) => v === true, "You must accept the terms to continue"),
  })
  .refine((d) => d.password === d.password_confirm, {
    message: "Passwords do not match",
    path: ["password_confirm"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

// ─── Password strength helper ─────────────────────────────────────────────────

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-destructive" };
  if (score === 2) return { score, label: "Fair", color: "bg-amber-500" };
  if (score === 3) return { score, label: "Good", color: "bg-primary" };
  return { score, label: "Strong", color: "bg-emerald-500" };
}

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessState({ email }: { email: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full rounded-2xl border border-border/60
                 bg-card/80 backdrop-blur-sm shadow-sm p-8
                 flex flex-col items-center text-center gap-5"
    >
      {/* Icon */}
      <div className="flex size-16 items-center justify-center
                      rounded-2xl bg-color shadow-brand">
        <MailCheck className="size-8 text-white" aria-hidden="true" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Check your inbox
        </h2>
        <p className="text-[14px] leading-6 text-muted-foreground">
          We sent a verification link to{" "}
          <span className="font-semibold text-foreground">{email}</span>.
          Click it to activate your account.
        </p>
      </div>

      <p className="text-[12px] text-muted-foreground">
        Didn&apos;t receive it? Check your spam folder or{" "}
        <Link href="/sign-up" className="text-primary hover:underline underline-offset-4">
          try again
        </Link>
        .
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function SignUpPage() {
  const t = useTranslations("Auth");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const {
    register,
    control, // 👈 added for Controller
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      password_confirm: "",
      terms_accepted: false,
    },
  });

  // Live password value for strength meter
  const watchedPassword = watch("password", "");
  const strength = getPasswordStrength(watchedPassword);

  // ── Submit ──────────────────────────────────────────────────────────────
  async function onSubmit(values: SignUpValues) {
    setLoading(true);
    try {
      await registerUser({
        full_name: values.full_name,
        email: values.email,
        password: values.password,
        password_confirm: values.password_confirm,
        terms_accepted: values.terms_accepted,
      });
      setSubmittedEmail(values.email);
      setSubmitted(true);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  // Show success state after registration
  if (submitted) {
    return (
      <>
        <BackToHome />
        <SuccessState email={submittedEmail} />
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <BackToHome />

      <AuthHeader
        title={t("signup.title")}
        description={t("signup.description")}
      />

      <AuthCard>
        {/* ── Google OAuth ── */}
        <GoogleButton />

        <AuthDivider />

        {/* ── Registration form ── */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

          {/* Full name */}
          <AuthFormField
            id="full_name"
            label={t("common.fullName")}
            error={errors.full_name?.message}
            required
          >
            <Input
              id="full_name"
              type="text"
              autoComplete="name"
              placeholder={t("common.fullNamePlaceholder")}
              aria-invalid={!!errors.full_name}
              {...register("full_name")}
            />
          </AuthFormField>

          {/* Email */}
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

          {/* Password + strength */}
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

            {/* Strength bar — only shown when user starts typing */}
            {watchedPassword.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1" aria-hidden="true">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${n <= strength.score ? strength.color : "bg-border"
                        }`}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {t("signup.passwordHint")} &middot;{" "}
                  <span className={`font-semibold ${strength.score <= 1 ? "text-destructive" :
                      strength.score === 2 ? "text-amber-500" :
                        strength.score === 3 ? "text-primary" : "text-emerald-500"
                    }`}>
                    {strength.label}
                  </span>
                </p>
              </div>
            )}
          </AuthFormField>

          {/* Confirm password */}
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

          {/* ─── Terms checkbox (FIXED with Controller) ─── */}
          <div className="space-y-1.5">
            <label className="flex items-start gap-3 cursor-pointer">
              <Controller
                name="terms_accepted"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="terms_accepted"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5 shrink-0"
                  />
                )}
              />
              <span className="text-[13px] text-muted-foreground leading-5">
                {t("signup.termsPrefix")}{" "}
                <a href="/terms" className="text-primary hover:underline underline-offset-4 font-medium">
                  {t("signup.terms")}
                </a>{" "}
                {t("signup.and")}{" "}
                <a href="/privacy" className="text-primary hover:underline underline-offset-4 font-medium">
                  {t("signup.privacy")}
                </a>
              </span>
            </label>

            {errors.terms_accepted && (
              <p role="alert" className="text-[12px] text-destructive ms-7">
                {errors.terms_accepted.message}
              </p>
            )}
          </div>

          {/* Submit */}
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
                Creating account…
              </>
            ) : (
              t("signup.submit")
            )}
          </Button>
        </form>
      </AuthCard>

      <AuthFooterLink
        text={t("signup.haveAccount")}
        linkLabel={t("signup.loginLink")}
        href="/sign-in"
      />
    </>
  );
}