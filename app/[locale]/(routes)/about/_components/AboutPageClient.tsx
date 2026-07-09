"use client";

// app/[locale]/about/_components/AboutPageClient.tsx


import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import {
  MapPin,
  Calendar,
  Rocket,
  Globe,
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  HeartHandshake,
  Star,
  Code2,
  Zap,
  Users,
  ArrowRight,
} from "lucide-react";

// ── Shared reusable components ──────────────────────────────────────────────
import { StatsRow, type StatItem } from "@/components/shared/StatsRow";
import {
  ValuesSection,
  type ValueItem,
} from "@/components/shared/ValuesSection";
import { Timeline, type TimelineItem } from "@/components/shared/Timeline";
import { TeamSection, type TeamMember } from "@/components/shared/TeamSection";
import { PageCTA } from "@/components/shared/PageCTA";
import { Header } from "@/app/[locale]/_components/Header/Header";
import { FooterSection } from "@/app/[locale]/_components/Footer/FooterSections";

// ─────────────────────────────────────────────────────────────────────────────
// Motion helpers
// ─────────────────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.7, ease: EASE },
});

const fadeUpInView = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.65, ease: EASE },
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 1 — Hero (simplified, matches ContactHero exactly)
// ─────────────────────────────────────────────────────────────────────────────

function AboutHero({
  isRtl,
  t,
}: {
  isRtl: boolean;
  t: ReturnType<typeof useTranslations<"About">>;
}) {
  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="mx-auto max-w-3xl text-center">
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

      {/* CTA — Story link */}
      <motion.div
        {...fadeUp(0.22)}
        className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <Link
          href="#story"
          className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-color px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-color/25 transition duration-300 hover:-translate-y-0.5 hover:bg-color/90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t("hero.ctaStory")}
          <ArrowRight
            className={`size-4 transition-transform ${isRtl ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
            aria-hidden="true"
          />
        </Link>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 2 — Story (editorial two-column)
// ─────────────────────────────────────────────────────────────────────────────

function StorySection({
  isRtl,
  t,
}: {
  isRtl: boolean;
  t: ReturnType<typeof useTranslations<"About">>;
}) {
  return (
    <section
      id="story"
      dir={isRtl ? "rtl" : "ltr"}
      aria-labelledby="story-heading"
      className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          {/* Left: image stack */}
          <motion.div
            {...fadeUpInView(0)}
            className={`relative ${isRtl ? "lg:order-2" : ""}`}
          >
            {/* Main image */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80&auto=format&fit=crop"
                alt="IDWE team collaborating"
                width={900}
                height={600}
                className="w-full object-cover"
              />
              {/* Gradient vignette */}
              <div className="absolute inset-0 bg-linear-to-t from-background/30 to-transparent" />
            </div>

            {/* Floating stat chip */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.3,
                duration: 0.5,
                type: "spring",
                bounce: 0.35,
              }}
              className="absolute -bottom-5 -inset-e-5 flex items-center gap-3 rounded-2xl border border-border/60 bg-card/90 p-4 shadow-xl backdrop-blur-md"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">50+</p>
                <p className="text-[11px] text-muted-foreground">
                  {t("story.chip")}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: editorial text */}
          <motion.div
            {...fadeUpInView(0.1)}
            className={`flex flex-col gap-6 ${isRtl ? "lg:order-1" : ""}`}
          >
            <div>
              <motion.p
                {...fadeUpInView(0.1)}
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary"
              >
                {t("story.eyebrow")}
              </motion.p>
              <motion.h2
                id="story-heading"
                {...fadeUpInView(0.17)}
                className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                {t("story.title")}
              </motion.h2>
            </div>

            {/* Pull quote */}
            <motion.blockquote
              {...fadeUpInView(0.22)}
              className="border-s-4 border-primary ps-5 text-lg font-medium italic text-foreground/80"
            >
              {t("story.pullQuote")}
            </motion.blockquote>

            <motion.div
              {...fadeUpInView(0.27)}
              className="space-y-4 text-base leading-7 text-muted-foreground"
            >
              <p>{t("story.body1")}</p>
              <p>{t("story.body2")}</p>
            </motion.div>

            {/* Inline trust badges */}
            <motion.div
              {...fadeUpInView(0.32)}
              className="flex flex-wrap gap-2 pt-2"
            >
              {[t("story.badge1"), t("story.badge2"), t("story.badge3")].map(
                (badge) => (
                  <span
                    key={badge}
                    className="flex items-center gap-1.5 rounded-full border border-border/60 bg-accent px-4 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    <span className="size-1.5 rounded-full bg-primary" />
                    {badge}
                  </span>
                ),
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 3 — Mission / Vision
// ─────────────────────────────────────────────────────────────────────────────

function MissionVision({
  isRtl,
  t,
}: {
  isRtl: boolean;
  t: ReturnType<typeof useTranslations<"About">>;
}) {
  const cards = [
    {
      gradient: "bg-color",
      accentLine: "from-[#0ab8fb] to-[#324b9d]",
      icon: Rocket,
      titleKey: "mission.missionTitle" as const,
      bodyKey: "mission.missionBody" as const,
      dark: true,
    },
    {
      gradient: null,
      accentLine: "from-[#324b9d] to-[#6685dc]",
      icon: Globe,
      titleKey: "mission.visionTitle" as const,
      bodyKey: "mission.visionBody" as const,
      dark: false,
    },
  ];

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      aria-labelledby="mission-heading"
      className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      {/* Narrow background stripe */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -z-10 h-96 bg-linear-to-b from-transparent via-primary/3 to-transparent"
      />

      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUpInView(0)} className="mb-12 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            {t("mission.eyebrow")}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {cards.map(
            (
              { gradient, accentLine, icon: Icon, titleKey, bodyKey, dark },
              i,
            ) => (
              <motion.div
                key={titleKey}
                {...fadeUpInView(0.06 + i * 0.1)}
                className={[
                  "group relative overflow-hidden rounded-3xl p-8 shadow-lg transition-shadow duration-300 hover:shadow-2xl sm:p-10",
                  dark
                    ? "bg-color text-white"
                    : "border border-border/60 bg-card",
                ].join(" ")}
              >
                {/* Decorative orb */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-e-16 -top-16 size-56 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
                  style={{
                    background: `linear-gradient(135deg, #0ab8fb, #324b9d)`,
                  }}
                />
                {/* Top accent line */}
                <div
                  className={`absolute inset-x-0 top-0 h-0.5 bg-linear-to-r ${accentLine}`}
                />

                <div className="relative">
                  <div
                    className={[
                      "mb-6 flex size-14 items-center justify-center rounded-2xl",
                      dark
                        ? "bg-white/15 text-white"
                        : "bg-primary/10 text-primary",
                    ].join(" ")}
                  >
                    <Icon className="size-7" aria-hidden="true" />
                  </div>
                  <h2
                    className={[
                      "text-xl font-bold tracking-tight sm:text-2xl",
                      dark ? "text-white" : "text-foreground",
                    ].join(" ")}
                  >
                    {t(titleKey)}
                  </h2>
                  <p
                    className={[
                      "mt-4 text-base leading-7",
                      dark ? "text-white/80" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {t(bodyKey)}
                  </p>
                </div>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root export — assembles the full page
// ─────────────────────────────────────────────────────────────────────────────

export default function AboutPageClient({
  isRtl,
  locale,
}: {
  isRtl: boolean;
  locale: string;
}) {
  const t = useTranslations("About");

  // ── Stats data ────────────────────────────────────────────────────────────
  const stats: StatItem[] = [
    { icon: Users, to: 50, suffix: "+", label: t("stats.clients") },
    { icon: Calendar, to: 5, suffix: "+", label: t("stats.years") },
    { icon: Star, to: 98, suffix: "%", label: t("stats.satisfaction") },
    { icon: Globe, to: 12, suffix: "+", label: t("stats.countries") },
  ];

  // ── Values data ───────────────────────────────────────────────────────────
  const values: ValueItem[] = [
    {
      icon: Lightbulb,
      color: "#0ab8fb",
      title: t("values.v1Title"),
      body: t("values.v1Body"),
    },
    {
      icon: ShieldCheck,
      color: "#324b9d",
      title: t("values.v2Title"),
      body: t("values.v2Body"),
    },
    {
      icon: TrendingUp,
      color: "#13a89e",
      title: t("values.v3Title"),
      body: t("values.v3Body"),
    },
    {
      icon: HeartHandshake,
      color: "#f59e0b",
      title: t("values.v4Title"),
      body: t("values.v4Body"),
    },
    {
      icon: Star,
      color: "#7c3aed",
      title: t("values.v5Title"),
      body: t("values.v5Body"),
    },
    {
      icon: Globe,
      color: "#0ab8fb",
      title: t("values.v6Title"),
      body: t("values.v6Body"),
    },
  ];

  // ── Timeline data ─────────────────────────────────────────────────────────
  const milestones: TimelineItem[] = [
    {
      year: "2020",
      title: t("timeline.m1Title"),
      body: t("timeline.m1Body"),
      icon: Rocket,
      tag: t("timeline.m1Tag"),
      image:
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=700&q=75&auto=format&fit=crop",
    },
    {
      year: "2021",
      title: t("timeline.m2Title"),
      body: t("timeline.m2Body"),
      icon: Code2,
      tag: t("timeline.m2Tag"),
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=700&q=75&auto=format&fit=crop",
    },
    {
      year: "2022",
      title: t("timeline.m3Title"),
      body: t("timeline.m3Body"),
      icon: Zap,
      tag: t("timeline.m3Tag"),
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=700&q=75&auto=format&fit=crop",
    },
    {
      year: "2023",
      title: t("timeline.m4Title"),
      body: t("timeline.m4Body"),
      icon: Globe,
      tag: t("timeline.m4Tag"),
      image:
        "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=700&q=75&auto=format&fit=crop",
    },
    {
      year: "2024",
      title: t("timeline.m5Title"),
      body: t("timeline.m5Body"),
      icon: TrendingUp,
      tag: t("timeline.m5Tag"),
      image:
        "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=700&q=75&auto=format&fit=crop",
    },
    {
      year: "2026",
      title: t("timeline.m6Title"),
      body: t("timeline.m6Body"),
      icon: Star,
      tag: t("timeline.m6Tag"),
      image:
        "https://images.unsplash.com/photo-1660644808219-1f103401bc85?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDZ8fHxlbnwwfHx8fHw%3D",
    },
  ];

  // ── Team data ─────────────────────────────────────────────────────────────
  const team: TeamMember[] = [
    {
      name: t("team.m1Name"),
      role: t("team.m1Role"),
      bio: t("team.m1Bio"),
      photo: "/teams/miraj-hejran.png",
      initials: "HI",
      color: "#0ab8fb",
      skills: [t("team.skill1"), t("team.skill2"), t("team.skill3")],
      social: {
        linkedin: "https://linkedin.com/in/miraj-hejran",
      },
    },
    {
      name: t("team.m2Name"),
      role: t("team.m2Role"),
      bio: t("team.m2Bio"),
      photo: "/teams/hakim-rahimi-safi.jpg",
      initials: "HR",
      color: "#324b9d",
      skills: [t("team.skill4"), t("team.skill5"), t("team.skill6")],
      social: {
        linkedin: "https://linkedin.com/in/hakim-rahimi-safi",
        twitter: "https://twitter.com/hakimrs",
      },
    },
    {
      name: t("team.m3Name"),
      role: t("team.m3Role"),
      bio: t("team.m3Bio"),
      photo: "",
      initials: "AS",
      color: "#f59e0b",
      skills: [t("team.skill7"), t("team.skill8"), t("team.skill9")],
      social: {
        linkedin: "https://linkedin.com/in/abdullah-stanikzai",
      },
    },
  ];

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="relative isolate min-h-screen overflow-x-hidden bg-background text-foreground"
    >
      {/* Global background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-50 bg-[linear-gradient(to_right,rgb(148_198_233/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_198_233/0.03)_1px,transparent_1px)] bg-size-[64px_64px]"
      />

      <Header />

      {/* ── 1. Hero ── */}
      <div className="px-4 pt-32 pb-10 sm:px-6 lg:px-8 lg:pt-52 lg:pb-24">
        <AboutHero isRtl={isRtl} t={t} />
      </div>

      {/* ── 2. Story ── */}
      <StorySection isRtl={isRtl} t={t} />

      {/* ── 3. Mission / Vision ── */}
      <MissionVision isRtl={isRtl} t={t} />

      {/* ── 4. Stats (shared) ── */}
      <StatsRow
        items={stats}
        eyebrow={t("stats.eyebrow")}
        title={t("stats.title")}
        isRtl={isRtl}
        withBackground
      />

      {/* ── 5. Values (shared) ── */}
      <ValuesSection
        items={values}
        eyebrow={t("values.eyebrow")}
        title={t("values.title")}
        description={t("values.description")}
        isRtl={isRtl}
      />

      {/* ── 6. Timeline (shared) ── */}
      <Timeline
        items={milestones}
        eyebrow={t("timeline.eyebrow")}
        title={t("timeline.title")}
        description={t("timeline.description")}
        isRtl={isRtl}
      />

      {/* ── 7. Team (shared) ── */}
      <TeamSection
        members={team}
        eyebrow={t("team.eyebrow")}
        title={t("team.title")}
        description={t("team.description")}
        isRtl={isRtl}
      />

      {/* ── 8. CTA (shared) ── */}
      <PageCTA
        title={t("cta.title")}
        description={t("cta.description")}
        primaryLabel={t("cta.primary")}
        primaryHref={`/${locale}/contact`}
        secondaryLabel={t("cta.secondary")}
        secondaryHref={`/${locale}/services`}
        isRtl={isRtl}
      />
      <FooterSection />
    </main>
  );
}
