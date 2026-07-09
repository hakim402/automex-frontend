"use client";

// app/[locale]/(auth)/_components/AuthDivider.tsx

import { useTranslations } from "next-intl";

export function AuthDivider() {
  const t = useTranslations("Auth");

  return (
    <div className="relative my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" aria-hidden="true" />
      <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground shrink-0">
        {t("common.orContinueWith")}
      </span>
      <div className="h-px flex-1 bg-border" aria-hidden="true" />
    </div>
  );
}