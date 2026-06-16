/**
 * app/[locale]/(auth)/_components/AuthShowcase.tsx
 *
 * Left panel of the auth split layout.
 * AuthShowcase.tsx — Left panel of the auth split layout
 *
 * Renders on lg+ screens only (controlled by the layout).
 * Contains:
 *   • Brand header with logo wordmark
 *   • Hero headline + description (from i18n)
 *   • Three feature cards with icons
 *   • Bottom trust badge strip
 *   • Ambient grid + gradient background
 *
 * Design language:
 *   Dark navy surface (--background in dark, a deep override in light)
 *   so the showcase always reads as the "brand" side regardless of theme.
 *   Brand gradient accent on headline, .bg-color on icon chips.
 */

"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Bot, Rocket, ShieldCheck, Sparkles, CheckCircle } from "lucide-react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthShowcaseProps {
  locale: string;
}

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      // ✅ Cast array to any to satisfy Framer Motion's type checker
      ease: [0.22, 1, 0.36, 1] as any,
    },
  },
};

// ─── Feature card data ────────────────────────────────────────────────────────

const FEATURE_ICONS = [Bot, Rocket, ShieldCheck] as const;

// ─────────────────────────────────────────────────────────────────────────────

export function AuthShowcase({ locale }: AuthShowcaseProps) {
  const t = useTranslations("Auth");

  const points = t.raw("showcase.points") as Array<{
    title: string;
    description: string;
  }>;

  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden
                 bg-[#07111f] dark:bg-[#07111f]"
    >
      {/* Background layers */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -left-32 w-150 h-150 rounded-full
                   bg-[radial-gradient(circle,rgb(10_184_251/14%)_0%,transparent_70%)]
                   pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -right-20 w-125 h-125 rounded-full
                   bg-[radial-gradient(circle,rgb(50_75_157/20%)_0%,transparent_70%)]
                   pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #94c6e9 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col h-full px-10 py-12 xl:px-14 xl:py-14"
      >
        {/* Brand logo */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex items-center gap-3">
            <Image
              src="/logo/idwe.png"
              alt="IDWE"
              width={110}
              height={44}
              className="h-10 w-auto object-contain brightness-[2] contrast-[0.85]"
              priority
            />
          </div>
        </motion.div>

        {/* Hero headline */}
        <motion.div variants={itemVariants} className="mb-10">
          <div className="inline-flex items-center gap-2 mb-5
                          rounded-full border border-[rgb(10_184_251/25%)]
                          bg-[rgb(10_184_251/8%)] px-3.5 py-1.5">
            <Sparkles className="size-3.5 text-[#0ab8fb]" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#0ab8fb]">
              {t("showcase.eyebrow")}
            </span>
          </div>
          <h2 className="text-3xl xl:text-4xl font-bold leading-tight text-white mb-4">
            {t("showcase.title")}
          </h2>
          <p className="text-[15px] leading-7 text-[#9eb0c4]">
            {t("showcase.description")}
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="flex flex-col gap-4 flex-1">
          {points.map((point, i) => {
            const Icon = FEATURE_ICONS[i] ?? Bot;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group flex gap-4 rounded-2xl
                           border border-[rgb(148_198_233/10%)]
                           bg-[rgb(13_26_45/60%)] backdrop-blur-sm
                           p-5 transition-all duration-300
                           hover:border-[rgb(10_184_251/25%)]
                           hover:bg-[rgb(13_26_45/80%)]"
              >
                <div
                  className="flex size-10 shrink-0 items-center justify-center
                              rounded-xl bg-color shadow-brand
                              group-hover:scale-105 transition-transform duration-300"
                >
                  <Icon className="size-5 text-white" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-white mb-1">
                    {point.title}
                  </p>
                  <p className="text-[13px] leading-6 text-[#9eb0c4]">
                    {point.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust strip */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          {[
            "256-bit encrypted",
            "SOC 2 compliant",
            "Data never sold",
          ].map((label) => (
            <div
              key={label}
              className="flex items-center gap-1.5 rounded-full
                         border border-[rgb(148_198_233/12%)]
                         bg-[rgb(13_26_45/50%)] px-3 py-1.5"
            >
              <CheckCircle
                className="size-3 text-[#0ab8fb] shrink-0"
                aria-hidden="true"
              />
              <span className="text-[11px] font-medium text-[#9eb0c4]">
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mt-6 text-[11px] text-[#56697f]"
        >
          {t("common.footer")}
        </motion.p>
      </motion.div>
    </div>
  );
}