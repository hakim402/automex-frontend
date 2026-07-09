"use client";

// app/[locale]/dashboard/_components/GreetingBanner.tsx

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease, delay },
});

export function GreetingBanner() {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const isRtl = ["ar", "fa", "ps"].includes(locale);
  const { user } = useAuth();

  const firstName = user?.full_name?.split(" ")[0] ?? t("defaultName");

  const hour = new Date().getHours();
  const greetKey =
    hour < 12 ? "greetMorning" : hour < 17 ? "greetAfternoon" : "greetEvening";

  return (
    <motion.div {...fadeUp(0)}>
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 sm:p-8">
        {/* Background decorations */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_0%_50%,rgb(10_184_251/6%),transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle,#94c6e9 1px,transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            {/* Eyebrow */}
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1">
              <Sparkles className="size-3 text-primary" aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                {t("welcomeEyebrow")}
              </span>
            </div>

            <h2 className="mb-1.5 text-2xl font-bold text-foreground sm:text-3xl">
              {t(greetKey as Parameters<typeof t>[0])},{" "}
              <span className="text-color">{firstName}</span>
            </h2>
            <p className="max-w-lg text-[14px] leading-6 text-muted-foreground">
              {t("welcomeDescription")}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button
              asChild
              className="rounded-full bg-color shadow-brand hover:-translate-y-0.5 transition-transform duration-200 font-semibold gap-2"
            >
              <Link href="/dashboard/requests">
                {t("ctaNewRequest")}
                <ArrowRight
                  className={cn("size-4", isRtl && "rotate-180")}
                  aria-hidden="true"
                />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="rounded-full hover:border-primary/40 hover:text-primary transition-colors gap-2"
            >
              <Link href="/dashboard/bookings">
                <CalendarDays className="size-4" aria-hidden="true" />
                {t("ctaBookSession")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
