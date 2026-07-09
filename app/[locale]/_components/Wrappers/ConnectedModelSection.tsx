"use client";
// app/[locale]/_components/ConnectedModelSection.tsx

import { ConnectedModel } from "@/components/shared/ConnectedModel";
import { useConnectedModelConfig } from "@/config/ConnectedModelConfig";

export function ConnectedModelSection({ isRtl }: { isRtl: boolean }) {
  const config = useConnectedModelConfig();
  return <ConnectedModel {...config} isRtl={isRtl} />;
}