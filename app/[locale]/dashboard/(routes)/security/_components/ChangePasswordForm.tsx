/**
 * ChangePasswordForm.tsx — Change current password
 *
 * Calls POST /auth/me/change-password/
 * On success: logs user out (backend invalidates all sessions) + redirects to /sign-in
 *
 * Not shown for OAuth-only users (they have no password to change).
 */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { Loader2, Lock, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { changePassword, logout, getErrorMessage } from "@/lib/auth";
import { SectionCard } from "../../profile/_components/SectionCard";
import { FormRow } from "../../profile/_components/FormRow";
import { PasswordInput } from "@/app/[locale]/(auth)/_components/PasswordInput";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    new_password_confirm: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.new_password === d.new_password_confirm, {
    message: "Passwords do not match",
    path: ["new_password_confirm"],
  })
  .refine((d) => d.current_password !== d.new_password, {
    message: "New password must be different from current password",
    path: ["new_password"],
  });

type FormValues = z.infer<typeof schema>;

// ─────────────────────────────────────────────────────────────────────────────

interface ChangePasswordFormProps {
  isOAuthUser: boolean;
}

export function ChangePasswordForm({ isOAuthUser }: ChangePasswordFormProps) {
  const t = useTranslations("Security");
  const router = useRouter();
  const locale = useLocale();
  const [confirming, setConfirming] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirm: "",
    },
  });

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function onSubmit(values: FormValues) {
    try {
      await changePassword({
        current_password: values.current_password,
        new_password: values.new_password,
        new_password_confirm: values.new_password_confirm,
      });

      toast.success(t("passwordChanged"));
      reset();

      // Backend invalidates all sessions — must sign in again
      await logout();
      router.replace(`/${locale}/sign-in`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  // ── OAuth users have no password ───────────────────────────────────────────
  if (isOAuthUser) {
    return (
      <SectionCard
        icon={Lock}
        title={t("sectionPassword")}
        description={t("sectionPasswordDesc")}
        delay={0.1}
      >
        <div
          className="flex items-start gap-3 rounded-xl border border-border/60
                        bg-muted/20 px-4 py-4"
        >
          <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-semibold text-foreground">
              {t("oauthNoPassword")}
            </p>
            <p className="text-[12px] text-muted-foreground mt-1">
              {t("oauthNoPasswordDesc")}
            </p>
          </div>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      icon={Lock}
      title={t("sectionPassword")}
      description={t("sectionPasswordDesc")}
      delay={0.1}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormRow
          id="current_password"
          label={t("fieldCurrentPassword")}
          error={errors.current_password?.message}
          required
        >
          <PasswordInput
            id="current_password"
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.current_password}
            {...register("current_password")}
          />
        </FormRow>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormRow
            id="new_password"
            label={t("fieldNewPassword")}
            error={errors.new_password?.message}
            required
          >
            <PasswordInput
              id="new_password"
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!errors.new_password}
              {...register("new_password")}
            />
          </FormRow>

          <FormRow
            id="new_password_confirm"
            label={t("fieldConfirmPassword")}
            error={errors.new_password_confirm?.message}
            required
          >
            <PasswordInput
              id="new_password_confirm"
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!errors.new_password_confirm}
              {...register("new_password_confirm")}
            />
          </FormRow>
        </div>

        {/* Warning: signs out all devices */}
        <div
          className="flex items-start gap-3 rounded-xl border border-amber-500/20
                        bg-amber-500/5 px-4 py-3"
        >
          <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[12px] text-amber-600 dark:text-amber-400 leading-5">
            {t("passwordWarning")}
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-color shadow-brand
                       hover:-translate-y-0.5 transition-transform duration-200
                       gap-2 font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t("updating")}
              </>
            ) : (
              <>
                <Lock className="size-4" />
                {t("updatePassword")}
              </>
            )}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
