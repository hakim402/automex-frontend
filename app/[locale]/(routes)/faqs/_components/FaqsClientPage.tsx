"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
  ArrowRight,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import type { FAQ, FAQCategory } from "@/lib/automex/types";

// ─── Types ─────────────────────────────────────────────────────────────

interface FaqsClientPageProps {
  faqs: FAQ[];
}

/** Map category value to i18n key segment */
const CATEGORY_LABELS: Record<string, string> = {
  general: "categoryGeneral",
  pricing: "categoryPricing",
  process: "categoryProcess",
  service: "categoryService",
};

const ALL_CATEGORIES: (FAQCategory | "all")[] = [
  "all",
  "general",
  "pricing",
  "process",
  "service",
];

// ─── FAQ accordion item ────────────────────────────────────────────────

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left text-[14px] font-medium text-foreground hover:bg-muted/20 transition-colors cursor-pointer"
      >
        <HelpCircle className="size-4 shrink-0 text-primary/60" aria-hidden="true" />
        <span className="flex-1">{question}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="px-5 pb-4 pt-0 text-[13px] text-muted-foreground leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

// ─── Main page component ───────────────────────────────────────────────

export function FaqsClientPage({ faqs }: FaqsClientPageProps) {
  const t = useTranslations("FaqsPage");
  const [activeCategory, setActiveCategory] = useState<FAQCategory | "all">("all");

  const filteredFaqs = useMemo(() => {
    if (activeCategory === "all") return faqs;
    return faqs.filter((f) => f.category === activeCategory);
  }, [faqs, activeCategory]);

  // Count FAQs per category for tab badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: faqs.length };
    for (const f of faqs) {
      const cat = f.category || "general";
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, [faqs]);

  return (
    <div className="relative overflow-hidden">
      {/* Background blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-0 size-[450px] rounded-full bg-[#0ab8fb]/3 blur-3xl" />
        <div className="absolute top-1/2 -left-32 size-[350px] rounded-full bg-[#324b9d]/3 blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        {/* Hero */}
        <section className="text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
            <HelpCircle className="size-3" aria-hidden="true" />
            {t("hero.eyebrow")}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            <span className="text-brand-gradient">{t("hero.headline")}</span>
          </h1>
          <p className="text-[15px] sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t("hero.description")}
          </p>
        </section>

        {/* Category filter tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-10">
          {ALL_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] || 0;
            if (count === 0 && cat !== "all") return null;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-200 cursor-pointer",
                  activeCategory === cat
                    ? "border-primary/30 bg-primary/5 text-primary shadow-sm"
                    : "border-border/60 bg-card/50 text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                <Tag className="size-3" aria-hidden="true" />
                {cat === "all"
                  ? t("categoryAll")
                  : t(CATEGORY_LABELS[cat] || cat)}
                <span
                  className={cn(
                    "ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    activeCategory === cat
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* FAQ accordion */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16">
            <MessageCircle className="size-12 mx-auto text-muted-foreground/30 mb-4" aria-hidden="true" />
            <p className="text-[14px] text-muted-foreground">{t("noResults")}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredFaqs.map((faq) => (
              <FAQItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <section className="mt-14 relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-8 sm:p-10 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#0ab8fb]/5 via-transparent to-[#324b9d]/5"
          />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
            <MessageCircle className="size-3" aria-hidden="true" />
            {t("cta.eyebrow")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {t("cta.title")}
          </h2>
          <p className="text-[14px] text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            {t("cta.description")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-brand-gradient shadow-brand"
            >
              <Link href="/contact">
                {t("cta.button")}
                <ArrowRight
                  className="size-4 ml-1.5 rtl:rotate-180"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
