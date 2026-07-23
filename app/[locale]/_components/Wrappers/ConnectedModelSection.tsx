"use client";
// app/[locale]/_components/ConnectedModelSection.tsx

import { ConnectedModel } from "@/components/shared/ConnectedModel";
import { useConnectedModelConfig } from "@/config/ConnectedModelConfig";
import type { Testimonial } from "@/lib/automex/types";

export function ConnectedModelSection({
  isRtl,
  liveTestimonials,
}: {
  isRtl: boolean;
  liveTestimonials?: Testimonial[];
}) {
  const config = useConnectedModelConfig();

  // Merge live testimonials into config when available
  const mergedConfig = liveTestimonials?.length
    ? {
        ...config,
        testimonials: liveTestimonials.map((t) => ({
          quote: `"${t.quote}"`,
          author: t.client_name,
          role: t.client_role || "",
          company: t.client_company || "",
          avatar: t.client_avatar?.url || undefined,
          rating: t.rating,
        })),
      }
    : config;

  return <ConnectedModel {...mergedConfig} isRtl={isRtl} />;
}