// app/[locale]/_components/HowItWorksWrapper.tsx
"use client";

import { HowItWorks } from "@/components/shared/HowItWorks";
import { useHowItWorksConfig } from "@/config/HowItWorksConfig"; // adjust path if needed
import { useLocale } from "next-intl";
import { Sparkles, Cog, Wrench } from "lucide-react";
import type { ProcessStep } from "@/lib/automex/types";

const ICON_COLOR_CYCLE = [
  { icon: Sparkles, color: "#0ab8fb" },
  { icon: Cog, color: "#324b9d" },
  { icon: Wrench, color: "#13a89e" },
];

export function HowItWorksWrapper({ liveProcessSteps }: { liveProcessSteps?: ProcessStep[] }) {
  const config = useHowItWorksConfig();
  const locale = useLocale();
  const isRtl = ["ar", "fa", "ps"].includes(locale); // match your RTL list

  // When live data is available, replace static flowSteps with API process steps
  const mergedConfig = liveProcessSteps?.length
    ? {
        ...config,
        flowSteps: liveProcessSteps.map((step, i) => {
          const { icon: IconComponent, color } = ICON_COLOR_CYCLE[i % ICON_COLOR_CYCLE.length];
          return {
            icon: IconComponent,
            color,
            title: step.title,
            description: step.description,
          };
        }),
      }
    : config;

  return <HowItWorks {...mergedConfig} isRtl={isRtl} />;
}