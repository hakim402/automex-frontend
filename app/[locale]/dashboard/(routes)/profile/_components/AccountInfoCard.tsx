/**
 * AccountInfoCard.tsx — Read-only account metadata display
 *
 * Shows: Account ID, sign-in method, role, terms accepted date.
 * None of these are editable by the user — purely informational.
 */
"use client";

import { useTranslations }  from "next-intl";
import { Info, Copy, Check } from "lucide-react";
import { useState }          from "react";
import { toast }             from "sonner";
import { type User }         from "@/lib/auth";
import { SectionCard }       from "./SectionCard";
import { cn }                from "@/lib/utils";

interface AccountInfoCardProps {
  user: User;
}

// ─── Read-only row ────────────────────────────────────────────────────────────

function InfoRow({
  label,
  value,
  copyable = false,
  mono     = false,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center justify-between py-3
                    border-b border-border/30 last:border-0">
      <span className="text-[13px] text-muted-foreground shrink-0 me-4">
        {label}
      </span>
      <div className="flex items-center gap-2 min-w-0">
        <span className={cn(
          "text-[13px] font-medium text-foreground truncate",
          mono && "font-mono text-[12px]",
        )}>
          {value}
        </span>
        {copyable && (
          <button
            onClick={handleCopy}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Copy to clipboard"
          >
            {copied
              ? <Check className="size-3.5 text-emerald-500" />
              : <Copy className="size-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function AccountInfoCard({ user }: AccountInfoCardProps) {
  const t = useTranslations("Profile");

  const createdAt = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const termsAt = user.terms_accepted_at
    ? new Date(user.terms_accepted_at).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "—";

  return (
    <SectionCard
      icon={Info}
      title={t("sectionAccount")}
      description={t("sectionAccountDesc")}
      delay={0.1}
    >
      <div className="divide-y divide-border/30">
        <InfoRow label={t("fieldAccountId")} value={user.id}       copyable mono />
        <InfoRow label={t("fieldEmail")}     value={user.email}    copyable />
        <InfoRow label={t("fieldRole")}      value={user.role} />
        <InfoRow
          label={t("fieldSignInMethod")}
          value={user.is_oauth_user ? "Google OAuth" : t("fieldEmailPassword")}
        />
        <InfoRow label={t("fieldMemberSince")}   value={createdAt} />
        <InfoRow label={t("fieldTermsAccepted")} value={termsAt}   />
      </div>
    </SectionCard>
  );
}