"use client";

// app/[locale]/contact/_components/ContactPageClient.tsx

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Clock,
  MessageSquare,
  Zap,
  Send,
  Loader2,
  CheckCircle2,
  User,
  Building2,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// country-flag-icons for map office dots
// ─────────────────────────────────────────────────────────────────────────────
import US from "country-flag-icons/react/3x2/US";
import AF from "country-flag-icons/react/3x2/AF";
// Add more flags as you expand offices
// import DE from "country-flag-icons/react/3x2/DE";
// import FR from "country-flag-icons/react/3x2/FR";
// import CN from "country-flag-icons/react/3x2/CN";
// import GB from "country-flag-icons/react/3x2/GB";
// import ES from "country-flag-icons/react/3x2/ES";
// import IT from "country-flag-icons/react/3x2/IT";
// import NL from "country-flag-icons/react/3x2/NL";

// Helper: map country name to flag component
function getFlagComponent(country: string): React.ComponentType<{ className?: string }> {
  const flagMap: Record<string, React.ComponentType<{ className?: string }>> = {
    "USA": US,
    "Afghanistan": AF,
    // add others when needed
  };
  return flagMap[country] ?? US; // fallback to USA flag
}

// ─────────────────────────────────────────────────────────────────────────────
// Motion helpers
// ─────────────────────────────────────────────────────────────────────────────

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease },
});

const fadeUpInView = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease },
});

const fieldVariants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 + i * 0.07, duration: 0.55, ease },
  }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Environment constants (NEXT_PUBLIC_ vars available client-side)
// ─────────────────────────────────────────────────────────────────────────────

const WHATSAPP_NUMBER = (
  process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT ?? "+93776320765"
).replace(/\D/g, "");

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@idwe.tech";

// ─────────────────────────────────────────────────────────────────────────────
// Form state machine
// ─────────────────────────────────────────────────────────────────────────────

type FormState = "idle" | "submitting" | "success" | "error";

// ─────────────────────────────────────────────────────────────────────────────
// Shared input class
// ─────────────────────────────────────────────────────────────────────────────

const inputCls =
  "h-12 w-full rounded-xl border border-input bg-background/80 ps-11 pe-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/60 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50";

// ─────────────────────────────────────────────────────────────────────────────
// Section 1 — Hero
// ─────────────────────────────────────────────────────────────────────────────

function ContactHero({
  isRtl,
  t,
}: {
  isRtl: boolean;
  t: ReturnType<typeof useTranslations<"Contact">>;
}) {
  const whatsappMsg = encodeURIComponent(t("info.whatsappMessage"));

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="mx-auto max-w-3xl text-center"
    >
      {/* Headline */}
      <motion.h1
        {...fadeUp(0)}
        className="text-balance text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl leading-tight"
      >
        {t("hero.headlineLead")}{" "}
        <span className="text-color">{t("hero.headlineAccent")}</span>
      </motion.h1>

      {/* Description */}
      <motion.p
        {...fadeUp(0.12)}
        className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg"
      >
        {t("hero.description")}
      </motion.p>

      {/* CTA buttons — WhatsApp + Email */}
      <motion.div
        {...fadeUp(0.22)}
        className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        {/* WhatsApp */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-emerald-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {/* WhatsApp SVG */}
          <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {t("hero.ctaWhatsapp")}
          <ArrowRight
            className={`size-4 transition-transform ${isRtl ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
            aria-hidden="true"
          />
        </a>

        {/* Email */}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-border bg-background/75 px-7 py-3 text-sm font-semibold text-foreground shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Mail className="size-4 shrink-0" aria-hidden="true" />
          {t("hero.ctaEmail")}
        </a>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 2a — Contact info cards (left column)
// ─────────────────────────────────────────────────────────────────────────────

type Channel = {
  Icon: React.ElementType;
  labelKey: string;
  valueKey: string;
  href: string;
  color: string;
  floatDelay: number;
};

const CHANNELS: Channel[] = [
  { Icon: Mail, labelKey: "info.emailLabel", valueKey: "info.email", href: `mailto:${CONTACT_EMAIL}`, color: "#0ab8fb", floatDelay: 0 },
  { Icon: Phone, labelKey: "info.phoneAfLabel", valueKey: "info.phoneAf", href: "tel:+93776320765", color: "#324b9d", floatDelay: 0.5 },
  { Icon: Phone, labelKey: "info.phoneUsLabel", valueKey: "info.phoneUs", href: "tel:+12064709284", color: "#13a89e", floatDelay: 1.0 },
  { Icon: Globe, labelKey: "info.websiteLabel", valueKey: "info.website", href: "https://idwe.tech", color: "#7c3aed", floatDelay: 1.5 },
];

function ContactInfo({
  isRtl,
  t,
}: {
  isRtl: boolean;
  t: ReturnType<typeof useTranslations<"Contact">>;
}) {
  const whatsappMsg = encodeURIComponent(t("info.whatsappMessage"));

  return (
    <address
      dir={isRtl ? "rtl" : "ltr"}
      className="not-italic flex flex-col gap-4"
    >
      {/* Section title */}
      <motion.div {...fadeUpInView(0)}>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {t("info.title")}
        </h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          {t("info.description")}
        </p>
      </motion.div>

      {/* Channel cards */}
      {CHANNELS.map((ch, i) => (
        <motion.div key={ch.href} {...fadeUpInView(0.08 + i * 0.09)}>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 5 + i * 0.6, ease: "easeInOut", repeat: Infinity, delay: ch.floatDelay }}
          >
            <a
              href={ch.href}
              target={ch.href.startsWith("http") ? "_blank" : undefined}
              rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${ch.color}15`, color: ch.color }}
              >
                <ch.Icon className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {t(ch.labelKey as Parameters<typeof t>[0])}
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                  {t(ch.valueKey as Parameters<typeof t>[0])}
                </p>
              </div>
              <svg className="size-4 shrink-0 text-muted-foreground/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      ))}

      {/* WhatsApp CTA strip */}
      <motion.a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        {...fadeUpInView(0.45)}
        className="group flex items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:shadow-md"
      >
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
          <MessageSquare className="size-5" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{t("info.whatsappTitle")}</p>
          <p className="text-xs text-muted-foreground">{t("info.whatsappSubtitle")}</p>
        </div>
        <svg className="size-4 shrink-0 text-emerald-500/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </motion.a>

      {/* Status badges */}
      <motion.div {...fadeUpInView(0.55)} className="grid grid-cols-2 gap-3">
        {/* Response time */}
        <div className="flex flex-col gap-1.5 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {t("info.responseTimeLabel")}
            </span>
          </div>
          <p className="text-lg font-bold tracking-tight text-foreground">
            {t("info.responseTime")}
          </p>
          <p className="text-xs text-muted-foreground">{t("info.responseNote")}</p>
        </div>

        {/* Availability */}
        <div className="flex flex-col gap-1.5 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {t("info.availabilityLabel")}
            </span>
          </div>
          <p className="text-lg font-bold tracking-tight text-foreground">
            {t("info.availability")}
          </p>
          <p className="text-xs text-muted-foreground">{t("info.availabilityNote")}</p>
        </div>
      </motion.div>
    </address>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 2b — Contact form (right column)
// ─────────────────────────────────────────────────────────────────────────────

function SuccessState({
  t,
  onReset,
}: {
  t: ReturnType<typeof useTranslations<"Contact">>;
  onReset: () => void;
}) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease }}
      className="flex flex-col items-center gap-5 py-12 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: "spring", bounce: 0.5 }}
        className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10"
      >
        <CheckCircle2 className="size-8 text-emerald-500" aria-hidden="true" />
      </motion.div>
      <div>
        <h3 className="text-xl font-bold text-foreground">{t("form.successTitle")}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{t("form.successBody")}</p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="text-sm font-medium text-primary transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
      >
        {t("form.successReset")}
      </button>
    </motion.div>
  );
}

function ContactForm({
  isRtl,
  t,
}: {
  isRtl: boolean;
  t: ReturnType<typeof useTranslations<"Contact">>;
}) {
  const [formState, setFormState] = useState<FormState>("idle");
  const subjects = t.raw("form.subjects") as string[];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");

    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Server error");
      setFormState("success");
    } catch {
      setFormState("error");
    }
  }

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="overflow-hidden rounded-[1.5rem] border border-border/60 bg-card shadow-sm"
    >
      {/* Card header */}
      <div className="relative overflow-hidden border-b border-border/60 px-6 py-5 sm:px-8">
        {/* Top brand stripe */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-color" />
        {/* Subtle bg glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgb(10_184_251/6%),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgb(10_184_251/8%),transparent)]"
        />
        <div className="relative">
          <h2 className="text-lg font-bold text-foreground">{t("form.heading")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("form.subheading")}</p>
        </div>
      </div>

      {/* Form body */}
      <div className="p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {formState === "success" ? (
            <SuccessState key="success" t={t} onReset={() => setFormState("idle")} />
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-5"
            >
              {/* Name + Company */}
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Name */}
                <motion.div custom={0} variants={fieldVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    {t("form.nameLabel")} <span className="text-destructive ms-0.5" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute inset-s-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" aria-hidden="true" />
                    <input name="name" type="text" placeholder={t("form.namePlaceholder")} autoComplete="name" required disabled={formState === "submitting"} className={inputCls} />
                  </div>
                </motion.div>

                {/* Company */}
                <motion.div custom={1} variants={fieldVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-1.5">
                  <label className="text-sm font-medium text-foreground">{t("form.companyLabel")}</label>
                  <div className="relative">
                    <Building2 className="pointer-events-none absolute inset-s-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" aria-hidden="true" />
                    <input name="company" type="text" placeholder={t("form.companyPlaceholder")} autoComplete="organization" disabled={formState === "submitting"} className={inputCls} />
                  </div>
                </motion.div>
              </div>

              {/* Email */}
              <motion.div custom={2} variants={fieldVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  {t("form.emailLabel")} <span className="text-destructive ms-0.5" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute inset-s-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" aria-hidden="true" />
                  <input name="email" type="email" placeholder={t("form.emailPlaceholder")} autoComplete="email" required disabled={formState === "submitting"} className={inputCls} />
                </div>
              </motion.div>

              {/* Subject */}
              <motion.div custom={3} variants={fieldVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  {t("form.subjectLabel")} <span className="text-destructive ms-0.5" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <ChevronDown className="pointer-events-none absolute inset-e-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" aria-hidden="true" />
                  <select name="subject" required defaultValue="" disabled={formState === "submitting"} className={`${inputCls} cursor-pointer appearance-none ps-4 pe-10`}>
                    <option value="" disabled>{t("form.subjectPlaceholder")}</option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </motion.div>

              {/* Message */}
              <motion.div custom={4} variants={fieldVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  {t("form.messageLabel")} <span className="text-destructive ms-0.5" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="pointer-events-none absolute inset-s-3.5 top-3.5 size-4 text-muted-foreground/70" aria-hidden="true" />
                  <textarea
                    name="message"
                    rows={5}
                    placeholder={t("form.messagePlaceholder")}
                    required
                    disabled={formState === "submitting"}
                    className="w-full resize-none rounded-xl border border-input bg-background/80 ps-11 pe-4 pt-3 pb-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/60 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </motion.div>

              {/* Error banner */}
              <AnimatePresence>
                {formState === "error" && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    role="alert"
                    className="rounded-xl border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive"
                  >
                    {t("form.errorMessage")}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.div custom={5} variants={fieldVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-color text-sm font-semibold text-white shadow-brand transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {formState === "submitting" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      {t("form.submitting")}
                    </>
                  ) : (
                    <>
                      {t("form.submit")}
                      <Send
                        className={`size-4 transition-transform duration-200 ${isRtl ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
                        aria-hidden="true"
                      />
                    </>
                  )}
                </button>
              </motion.div>

              {/* Privacy note */}
              <motion.p custom={6} variants={fieldVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center text-[11px] text-muted-foreground/60">
                {t("form.privacyNote")}
              </motion.p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 3 — Location / Map strip (bottom)
// ─────────────────────────────────────────────────────────────────────────────

function LocationStrip({
  isRtl,
  t,
}: {
  isRtl: boolean;
  t: ReturnType<typeof useTranslations<"Contact">>;
}) {
  const offices = t.raw("map.offices") as { city: string; country: string; flag: string; tz: string }[];

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      aria-label="Office locations"
      className="px-4 pb-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          {...fadeUpInView(0)}
          className="mb-8 flex flex-col items-center gap-2 text-center"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-accent">
            <MapPin className="size-4 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold tracking-tighter text-foreground sm:text-3xl">
            {t("map.title")}
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">{t("map.description")}</p>
        </motion.div>

        {/* Visual map panel */}
        <motion.div
          {...fadeUpInView(0.1)}
          className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm"
        >
          {/* Decorative grid map background */}
          <div
            aria-hidden="true"
            className="relative h-52 sm:h-64 bg-[linear-gradient(145deg,rgb(10_184_251/8%),rgb(50_75_157/12%))] dark:bg-[linear-gradient(145deg,rgb(10_184_251/6%),rgb(50_75_157/10%))]"
          >
            {/* Grid lines */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(to_right,rgb(148_198_233/0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_198_233/0.1)_1px,transparent_1px)] bg-size-[40px_40px]"
            />
            {/* Horizontal latitude lines */}
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_30%,rgb(148_198_233/0.06)_50%,transparent_70%)]" />

            {/* Afghanistan dot */}
            <motion.div
              className="absolute"
              style={{ left: "62%", top: "30%" }}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
            >
              <motion.div
                animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                className="absolute -inset-3 rounded-full bg-primary/25"
              />
              <div className="relative flex size-7 items-center justify-center rounded-full bg-color shadow-brand">
                <AF className="size-5 rounded-full object-cover" />
              </div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border/60 bg-background/90 px-2 py-0.5 text-[9px] font-semibold text-foreground backdrop-blur-sm">
                Kabul, AF
              </div>
            </motion.div>

            {/* USA dot */}
            <motion.div
              className="absolute"
              style={{ left: "18%", top: "35%" }}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
            >
              <motion.div
                animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
                className="absolute -inset-3 rounded-full bg-[#324b9d]/25"
              />
              <div className="relative flex size-7 items-center justify-center rounded-full bg-[#324b9d] shadow-md">
                <US className="size-5 rounded-full object-cover" />
              </div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border/60 bg-background/90 px-2 py-0.5 text-[9px] font-semibold text-foreground backdrop-blur-sm">
                Seattle, WA
              </div>
            </motion.div>

            {/* Connection arc line (SVG) */}
            <svg
              className="pointer-events-none absolute inset-0 size-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <motion.path
                d="M 18 35 Q 40 10 62 30"
                fill="none"
                stroke="url(#arcGrad)"
                strokeWidth="0.4"
                strokeDasharray="2 2"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 1.2, ease }}
              />
              <defs>
                <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#324b9d" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0ab8fb" stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>

            {/* "Remote-first" badge centered */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9, duration: 0.5, ease }}
            >
              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 backdrop-blur-sm shadow-sm">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[10px] font-semibold text-foreground">{t("map.remoteBadge")}</span>
              </div>
            </motion.div>
          </div>

          {/* Office cards row */}
          <div className="grid divide-y divide-border/40 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {offices.map((office, i) => {
              const FlagComponent = getFlagComponent(office.country);
              return (
                <motion.div
                  key={office.city}
                  {...fadeUpInView(0.2 + i * 0.1)}
                  className="flex items-center gap-4 p-5"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                    <FlagComponent className="size-6 rounded-md object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {office.city}, {office.country}
                    </p>
                    <p className="text-xs text-muted-foreground">{office.tz}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root export — single client component that page.tsx renders
// ─────────────────────────────────────────────────────────────────────────────

export default function ContactPageClient({ isRtl }: { isRtl: boolean }) {
  const t = useTranslations("Contact");

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="relative isolate min-h-screen overflow-x-hidden bg-background text-foreground"
    >
      {/* ── Page background decorations ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgb(10_184_251/10%),transparent)] dark:bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgb(10_184_251/7%),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(148_198_233/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_198_233/0.05)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)]"
      />

      {/* ── 1. Hero ── */}
      <section
        aria-labelledby="contact-heading"
        className="px-4 pt-32 pb-16 sm:px-6 lg:px-8 lg:pt-52 lg:pb-52"
      >
        <ContactHero isRtl={isRtl} t={t} />
      </section>

      {/* ── 2. Two-column: info + form ── */}
      <section
        aria-label="Contact details and message form"
        className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20"
      >
        <div className="mx-auto max-w-6xl">
          <div
            className={[
              "grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-12",
              isRtl ? "lg:[direction:rtl]" : "",
            ].join(" ")}
          >
            <ContactInfo isRtl={isRtl} t={t} />
            <ContactForm isRtl={isRtl} t={t} />
          </div>
        </div>
      </section>

      {/* ── 3. Location map strip ── */}
      <LocationStrip isRtl={isRtl} t={t} />
    </main>
  );
}