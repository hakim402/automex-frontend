"use client";

// app/[locale]/_components/TechStackSection.tsx
//
// Thin wrapper around <TechStack />.
// This is the pattern to repeat for every reusable section on the Home page:
//
//   1. The "dumb" component (TechStack.tsx) lives in components/shared/
//      and only knows about props — no i18n, no business data.
//   2. The "wrapper" component (this file) lives next to the page that
//      uses it, pulls translations + static data via the config hook,
//      and renders the dumb component with isRtl wired in.
//   3. page.tsx just imports the wrapper and drops it in — one line,
//      zero config noise in the page itself.
//
// Why split it this way?
//   - TechStack.tsx stays 100% reusable (Services page, About page, anywhere)
//   - Swapping copy/data later only touches this file, never the page
//   - Adding a second instance with different tools is just a second wrapper

import { TechStack } from "@/components/shared/TechStack";
import { useTechStackConfig } from "@/config/TechStackConfig"; // adjust path if needed
import type { Technology } from "@/lib/automex/types";

interface TechStackSectionProps {
  isRtl: boolean;
  liveTechnologies?: Technology[];
}

export function TechStackSection({ isRtl, liveTechnologies }: TechStackSectionProps) {
  const config = useTechStackConfig();

  // Merge live data into config when available: group by category
  const mergedConfig = liveTechnologies?.length
    ? {
        ...config,
        groups: (() => {
          const grouped: Record<string, Technology[]> = {};
          for (const tech of liveTechnologies) {
            const cat = tech.category || "other";
            (grouped[cat] ??= []).push(tech);
          }
          return Object.entries(grouped).map(([category, techs]) => ({
            category,
            techs: techs.map((t) => ({ name: t.name, icon: t.icon ?? undefined, slug: t.slug })),
          }));
        })(),
      }
    : config;

  return <TechStack {...mergedConfig} isRtl={isRtl} />;
}