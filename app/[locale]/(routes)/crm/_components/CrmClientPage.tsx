"use client";

// app/[locale]/(routes)/crm/_components/CrmClientPage.tsx
import { useTranslations } from "next-intl";
import { FileText, PhoneCall, MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "./crm-shared/NewsletterForm";
import type { ProcessStep } from "@/lib/automex/types";

interface CrmClientPageProps {
  processSteps: ProcessStep[];
}

export function CrmClientPage({ processSteps }: CrmClientPageProps) {
  const t = useTranslations("CrmPages.hub");

  const paths = [
    { key: "quote", icon: FileText, href: "/crm/quote" as const },
    { key: "booking", icon: PhoneCall, href: "/crm/book-a-call" as const },
    { key: "contact", icon: MessageSquare, href: "/crm/contact-sales" as const },
  ] as const;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
      {/* Hero */}
      <section className="text-center mb-16">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-primary mb-3">{t("hero.eyebrow")}</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          {t("hero.headlineLead")} <span className="text-primary">{t("hero.headlineAccent")}</span>
        </h1>
        <p className="text-[15px] text-muted-foreground max-w-xl mx-auto mb-8">{t("hero.description")}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/crm/quote">{t("hero.ctaQuote")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/crm/book-a-call">{t("hero.ctaBooking")}</Link>
          </Button>
        </div>
      </section>

      {/* Three paths */}
      <section className="mb-16">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-primary mb-2 text-center">{t("paths.eyebrow")}</p>
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">{t("paths.title")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {paths.map(({ key, icon: Icon, href }) => (
            <Link
              key={key}
              href={href}
              className="group flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="text-[15px] font-semibold text-foreground">{t(`paths.${key}.title`)}</h3>
              <p className="text-[13px] text-muted-foreground flex-1">{t(`paths.${key}.description`)}</p>
              <span className="flex items-center gap-1 text-[13px] font-medium text-primary">
                {t(`paths.${key}.cta`)}
                <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works — real ProcessStep data from the backend */}
      {processSteps.length > 0 && (
        <section className="mb-16">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-primary mb-2 text-center">{t("howItWorks.eyebrow")}</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 text-center">{t("howItWorks.title")}</h2>
          <p className="text-[14px] text-muted-foreground text-center mb-8">{t("howItWorks.description")}</p>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {processSteps.map((step, i) => (
              <li key={step.id} className="rounded-2xl border border-border/60 bg-card/80 p-5">
                <span className="text-[13px] font-semibold text-primary">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-[14px] font-semibold text-foreground mt-1 mb-1">{step.title}</h3>
                <p className="text-[13px] text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Newsletter */}
      <section className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm p-8 text-center">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-primary mb-2">{t("newsletter.eyebrow")}</p>
        <h2 className="text-lg font-semibold text-foreground mb-1">{t("newsletter.title")}</h2>
        <p className="text-[13px] text-muted-foreground mb-4">{t("newsletter.description")}</p>
        <NewsletterForm source="crm_hub" className="max-w-sm mx-auto" />
      </section>
    </div>
  );
}