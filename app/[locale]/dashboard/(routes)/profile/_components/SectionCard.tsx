/**
 * SectionCard.tsx — Animated card wrapper for profile/security sections
 *
 * Consistent card surface with:
 *   • Icon chip + title + description in the header
 *   • Framer Motion entrance animation
 *   • Brand design tokens throughout
 */
"use client";

import { motion }   from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn }       from "@/lib/utils";

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  /** Delay the entrance animation (seconds) */
  delay?: number;
}

export function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  className,
  delay = 0,
}: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      className={cn(
        "rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm overflow-hidden",
        className,
      )}
    >
      {/* Card header */}
      <div className="flex items-start gap-4 px-6 py-5 border-b border-border/40">
        <div className="flex size-9 shrink-0 items-center justify-center
                        rounded-xl bg-primary/10 mt-0.5">
          <Icon className="size-4 text-primary" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="text-[13px] text-muted-foreground mt-0.5 leading-5">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="px-6 py-6">{children}</div>
    </motion.div>
  );
}