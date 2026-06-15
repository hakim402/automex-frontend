// app/[locale]/_components/HowItWorksWrapper.tsx
"use client";

import { HowItWorks } from "@/components/shared/HowItWorks";
import { useHowItWorksConfig } from "@/config/HowItWorksConfig"; // adjust path if needed
import { useLocale } from "next-intl";

export function HowItWorksWrapper() {
  const config = useHowItWorksConfig();
  const locale = useLocale();
  const isRtl = ["ar", "fa", "ps"].includes(locale); // match your RTL list

  return <HowItWorks {...config} isRtl={isRtl} />;
}