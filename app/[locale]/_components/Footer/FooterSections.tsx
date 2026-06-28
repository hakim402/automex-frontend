"use client";

// app/[locale]/_components/footer.tsx

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  MapPin,
  ArrowUpRight,
  Shield,
  Zap,
  ChevronRight,
  ExternalLink,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Social SVG icons
// ─────────────────────────────────────────────────────────────────────────────

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface FooterLink {
  labelKey: string;
  href: string;
  external?: boolean;
  badgeKey?: string;
}

interface FooterColumn {
  titleKey: string;
  icon: React.ElementType;
  links: FooterLink[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Column data
// ─────────────────────────────────────────────────────────────────────────────

const COLUMNS: FooterColumn[] = [
  {
    titleKey: "columns.services.title",
    icon: Zap,
    links: [
      {
        labelKey: "columns.services.ai_solutions",
        href: "/services",
        badgeKey: "badges.popular",
      },
      { labelKey: "columns.services.ai_bots", href: "/services" },
      { labelKey: "columns.services.software_dev", href: "/services" },
      { labelKey: "columns.services.web_dev", href: "/services" },
      { labelKey: "columns.services.mobile_dev", href: "/services" },
      { labelKey: "columns.services.cybersecurity", href: "/services" },
    ],
  },
  {
    titleKey: "columns.technology.title",
    icon: Cpu,
    links: [
      {
        labelKey: "columns.technology.claude_ai",
        href: "/services",
        badgeKey: "badges.new",
      },
      { labelKey: "columns.technology.api_integration", href: "/services" },
      { labelKey: "columns.technology.database", href: "/services" },
      { labelKey: "columns.technology.cloud", href: "/services" },
      {
        labelKey: "columns.technology.security_compliance",
        href: "/services",
        badgeKey: "badges.enterprise",
      },
      { labelKey: "columns.technology.digital_transform", href: "/services" },
    ],
  },
  {
    titleKey: "columns.company.title",
    icon: Shield,
    links: [
      { labelKey: "columns.company.about", href: "/about" },
      { labelKey: "columns.company.services", href: "/services" },
      { labelKey: "columns.company.blogs", href: "/blogs" },
      { labelKey: "columns.company.contact", href: "/contact" },
      { labelKey: "columns.company.privacy", href: "/privacy" },
      { labelKey: "columns.company.terms", href: "/terms" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Badge chip
// ─────────────────────────────────────────────────────────────────────────────

function BadgeChip({ label }: { label: string }) {
  return (
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary leading-none">
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Link column
// ─────────────────────────────────────────────────────────────────────────────

function LinkColumn({
  column,
  locale,
  isRtl,
  t,
}: {
  column: FooterColumn;
  locale: string;
  isRtl: boolean;
  t: ReturnType<typeof useTranslations<"footer">>;
}) {
  const Icon = column.icon;

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      {/* Column heading */}
      <div
        className={cn(
          "flex items-center gap-2 mb-5",
          isRtl && "flex-row-reverse",
        )}
      >
        <div className="size-6 rounded-lg bg-accent flex items-center justify-center shrink-0">
          <Icon className="size-3.5 text-primary" aria-hidden="true" />
        </div>
        <h4 className="text-sm font-semibold text-foreground">
          {t(column.titleKey as Parameters<typeof t>[0])}
        </h4>
      </div>

      {/* Links */}
      <ul className="space-y-2.5">
        {column.links.map((link) => (
          <li key={link.labelKey}>
            <Link
              href={link.external ? link.href : `/${locale}${link.href}`}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className={cn(
                "group flex items-center gap-1.5 text-sm text-muted-foreground",
                "hover:text-primary transition-colors duration-150",
                isRtl && "flex-row-reverse",
              )}
            >
              <ChevronRight
                className={cn(
                  "size-3 shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-150",
                  isRtl ? "rotate-180" : "group-hover:translate-x-0.5",
                )}
                aria-hidden="true"
              />
              <span>{t(link.labelKey as Parameters<typeof t>[0])}</span>

              {link.badgeKey && (
                <BadgeChip
                  label={t(link.badgeKey as Parameters<typeof t>[0])}
                />
              )}

              {link.external && (
                <ExternalLink
                  className="size-2.5 opacity-40 shrink-0"
                  aria-hidden="true"
                />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Contact row
// ─────────────────────────────────────────────────────────────────────────────

function ContactRow({
  isRtl,
  t,
}: {
  isRtl: boolean;
  t: ReturnType<typeof useTranslations<"footer">>;
}) {
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+1234567890";
  const whatsappMsg = encodeURIComponent(
    t("contact.whatsapp" as Parameters<typeof t>[0]),
  );

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3",
        isRtl && "flex-row-reverse",
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* WhatsApp CTA */}
      <a
        href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${whatsappMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full",
          "bg-emerald-500 hover:bg-emerald-600 text-white",
          "text-xs font-semibold shadow-md shadow-emerald-500/20",
          "transition-all duration-200 hover:-translate-y-0.5",
          isRtl && "flex-row-reverse",
        )}
      >
        <WhatsAppIcon className="size-3.5" />
        {t("contact.whatsapp" as Parameters<typeof t>[0])}
      </a>

      {/* Email CTA */}
      <a
        href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "hello@infinity-solutions.pro"}`}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full",
          "border border-border bg-background/80 backdrop-blur",
          "text-xs font-semibold text-muted-foreground",
          "hover:text-primary hover:border-primary/40",
          "transition-all duration-200 hover:-translate-y-0.5",
          isRtl && "flex-row-reverse",
        )}
      >
        <Mail className="size-3.5" aria-hidden="true" />
        {t("contact.email" as Parameters<typeof t>[0])}
      </a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CTA banner — uses brand gradient from global.css
// ─────────────────────────────────────────────────────────────────────────────

function CtaBanner({
  isRtl,
  locale,
  t,
}: {
  isRtl: boolean;
  locale: string;
  t: ReturnType<typeof useTranslations<"footer">>;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl px-6 py-5",
        "border border-primary/20 bg-brand-soft",
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Decorative glow blob */}
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 size-36 rounded-full bg-primary/15 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -left-6 -bottom-6 size-24 rounded-full bg-brand-end/10 blur-2xl pointer-events-none"
      />

      <div
        className={cn(
          "relative flex flex-col sm:flex-row items-start sm:items-center gap-4",
          isRtl && "sm:flex-row-reverse",
        )}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground mb-0.5">
            {t("cta.heading" as Parameters<typeof t>[0])}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("cta.subheading" as Parameters<typeof t>[0])}
          </p>
        </div>

        <Link
          href={`/${locale}/contact`}
          className={cn(
            "group flex items-center gap-1.5 px-5 py-2.5 rounded-full shrink-0 whitespace-nowrap",
            "bg-color text-brand-foreground text-xs font-bold",
            "shadow-brand transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            isRtl && "flex-row-reverse",
          )}
        >
          {t("cta.button" as Parameters<typeof t>[0])}
          <ArrowUpRight
            className={cn(
              "size-3.5 transition-transform",
              isRtl
                ? "group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
                : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
            )}
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Social row
// ─────────────────────────────────────────────────────────────────────────────

const SOCIALS = [
  {
    Icon: FacebookIcon,
    href: "https://facebook.com/infinity.enterprise.solutions",
    labelKey: "social.facebook",
    hoverClass: "hover:text-[#1877f2]",
  },
  {
    Icon: InstagramIcon,
    href: "https://instagram.com/infinity_e_s",
    labelKey: "social.instagram",
    hoverClass: "hover:text-[#e4405f]",
  },
  {
    Icon: XIcon,
    href: "https://x.com/infinity_es",
    labelKey: "social.twitter",
    hoverClass: "hover:text-foreground",
  },
  {
    Icon: LinkedInIcon,
    href: "https://linkedin.com/company/infinity-enterprise-solutions",
    labelKey: "social.linkedin",
    hoverClass: "hover:text-[#0a66c2]",
  },
] as const;

function SocialRow({
  isRtl,
  t,
}: {
  isRtl: boolean;
  t: ReturnType<typeof useTranslations<"footer">>;
}) {
  return (
    <div className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
      {SOCIALS.map(({ Icon, href, labelKey, hoverClass }) => (
        <a
          key={labelKey}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t(labelKey as Parameters<typeof t>[0])}
          className={cn(
            "text-muted-foreground/50 transition-colors duration-150",
            hoverClass,
          )}
        >
          <Icon className="size-4" />
        </a>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Brand mark — top-left logo + wordmark
// ─────────────────────────────────────────────────────────────────────────────

function BrandMark({ isRtl }: { isRtl: boolean }) {
  return (
    <div className={cn("flex items-center gap-4", isRtl && "flex-row-reverse")}>
  {/* Logo container – always light background */}
  <div className="relative size-12 rounded-2xl overflow-hidden border border-border/60 bg-white shadow-sm shrink-0">
    <Image
      src="/logo/icon.png"
      alt="Infinity Solutions logo"
      fill
      className="object-contain"
      sizes="(max-width: 768px) 64px, (max-width: 1024px) 80px, 96px"
      priority
    />
  </div>
  <div className={isRtl ? "text-right" : undefined}>
    <p className="text-sm font-bold text-foreground leading-none tracking-tight">
      AUTOMEX
    </p>
    <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
      AI &amp; Automation Solutions
    </p>
  </div>
</div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Footer
// ─────────────────────────────────────────────────────────────────────────────

const RTL_LOCALES = new Set(["ar", "fa", "ps"]);

const BOTTOM_LINKS = [
  ["bottom.privacy", "/privacy"],
  ["bottom.terms", "/terms"],
  ["bottom.sitemap", "/sitemap"],
] as const;

export function FooterSection() {
  const locale = useLocale();
  const t = useTranslations("footer");
  const isRtl = RTL_LOCALES.has(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-background border-t border-border/50 overflow-hidden">
      {/* Ambient gradient — matches hero background language */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgb(10_184_251/5%),transparent)] dark:bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgb(10_184_251/4%),transparent)]"
      />

      {/* ── Main content ── */}
      <div className="relative max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8"
        >
          {/* ── Brand column (4/12) ── */}
          <div
            className="lg:col-span-4 flex flex-col gap-5"
            dir={isRtl ? "rtl" : "ltr"}
          >
            <BrandMark isRtl={isRtl} />

            {/* Tagline */}
            <p
              className={cn(
                "text-sm text-muted-foreground leading-relaxed max-w-xs",
                isRtl && "text-right",
              )}
            >
              {t("tagline" as Parameters<typeof t>[0])}
            </p>

            {/* Contact buttons */}
            <ContactRow isRtl={isRtl} t={t} />

            {/* Location */}
            <div
              className={cn(
                "flex items-start gap-2 text-xs text-muted-foreground/60",
                isRtl && "flex-row-reverse text-right",
              )}
            >
              <MapPin className="size-3.5 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{t("location" as Parameters<typeof t>[0])}</span>
            </div>
          </div>

          {/* ── Link columns (8/12) ── */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {COLUMNS.map((col) => (
              <LinkColumn
                key={col.titleKey}
                column={col}
                locale={locale}
                isRtl={isRtl}
                t={t}
              />
            ))}
          </div>
        </motion.div>

        {/* ── CTA banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-10"
        >
          <CtaBanner isRtl={isRtl} locale={locale} t={t} />
        </motion.div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative border-t border-border/40">
        <div
          className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3"
          dir={isRtl ? "rtl" : "ltr"}
        >
          {/* Copyright */}
          <p className="text-xs text-muted-foreground/60 text-center sm:text-start">
            {t("bottom.copyright" as Parameters<typeof t>[0], { year })}
          </p>

          {/* Legal links */}
          <nav
            aria-label="Legal"
            className={cn(
              "flex items-center gap-4",
              isRtl && "flex-row-reverse",
            )}
          >
            {BOTTOM_LINKS.map(([key, href]) => (
              <Link
                key={key}
                href={`/${locale}${href}`}
                className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-150"
              >
                {t(key as Parameters<typeof t>[0])}
              </Link>
            ))}
          </nav>

          {/* Social icons */}
          <SocialRow isRtl={isRtl} t={t} />
        </div>
      </div>
    </footer>
  );
}
