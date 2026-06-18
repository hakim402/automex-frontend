/**
 * ProfileHeader.tsx — Avatar display + name + role chip
 *
 * Shows:
 *   • Large avatar circle — Google picture URL if OAuth user, else initials
 *   • Full name + email + role badge
 *   • Email verified indicator
 *   • Member since date
 *
 * Read-only display — editing happens in the form cards below.
 */
"use client";

import { motion }          from "framer-motion";
import { CheckCircle, AlertCircle, Calendar, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import Image               from "next/image";
import { type User }       from "@/lib/auth";
import { cn }              from "@/lib/utils";

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const t       = useTranslations("Profile");
  const initial = user.full_name?.charAt(0).toUpperCase() ?? "U";

  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-border/60
                 bg-card/80 backdrop-blur-sm p-6 sm:p-8"
    >
      {/* Background brand glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none
                   bg-[radial-gradient(ellipse_60%_80%_at_0%_0%,rgb(10_184_251/6%),transparent)]"
      />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">

        {/* Avatar */}
        <div className="relative shrink-0">
          {user.google_picture_url ? (
            <Image
              src={user.google_picture_url}
              alt={user.full_name}
              width={80}
              height={80}
              className="size-20 rounded-2xl object-cover ring-2 ring-border/40"
            />
          ) : (
            <div className="size-20 rounded-2xl bg-color shadow-brand
                            flex items-center justify-center
                            text-white text-3xl font-bold">
              {initial}
            </div>
          )}

          {/* Verified dot */}
          <div className={cn(
            "absolute -bottom-1.5 -inset-e-1. flex size-6 items-center justify-center",
            "rounded-full border-2 border-card",
            user.is_email_verified ? "bg-emerald-500" : "bg-amber-500",
          )}>
            {user.is_email_verified
              ? <CheckCircle className="size-3 text-white" />
              : <AlertCircle className="size-3 text-white" />}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-foreground truncate">
              {user.full_name}
            </h1>

            {/* Role badge */}
            <span className="inline-flex items-center gap-1 rounded-full
                             border border-primary/20 bg-primary/8
                             px-2.5 py-0.5 text-[11px] font-bold
                             text-primary uppercase tracking-wide">
              <Shield className="size-2.5" />
              {user.role}
            </span>
          </div>

          <p className="text-[14px] text-muted-foreground">{user.email}</p>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            {/* Email status */}
            <div className="flex items-center gap-1.5">
              {user.is_email_verified
                ? <CheckCircle className="size-3.5 text-emerald-500" />
                : <AlertCircle className="size-3.5 text-amber-500" />}
              <span className="text-[12px] text-muted-foreground">
                {user.is_email_verified ? t("emailVerified") : t("emailNotVerified")}
              </span>
            </div>

            {/* Member since */}
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-muted-foreground/60" />
              <span className="text-[12px] text-muted-foreground">
                {t("memberSince")} {memberSince}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}