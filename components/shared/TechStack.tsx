"use client";
// components/shared/TechStack.tsx
//
// Reusable "Tech Stack" section — tabbed by category with animated tool cards.
// All textual content is internationalized via next-intl (namespace "TechStack").
//
// Usage:
//   import { TechStack } from "@/components/shared/TechStack";
//   <TechStack categories={...} tools={...} isRtl={isRtl} />

import { useState, useId, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUpInView = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: EASE },
});

// ─────────────────────────────────────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────────────────────────────────────

export interface TechTool {
  name: string;
  category: string;
  color: string;
  logo: React.ElementType;
  description?: string;
}

export interface TechCategory {
  id: string;
  label: string;
  icon: React.ElementType;
}

export interface TechStackProps {
  categories: TechCategory[];
  tools: TechTool[];
  isRtl?: boolean;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Decorative marquee background
// ─────────────────────────────────────────────────────────────────────────────

function MarqueeBackground({ tools }: { tools: TechTool[] }) {
  const names = tools.map((t) => t.name);
  const row = [...names, ...names, ...names];
  const rowR = [...names]
    .reverse()
    .concat([...names].reverse(), [...names].reverse());

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 select-none overflow-hidden"
    >
      {/* Left + right fade masks */}
      <div className="absolute inset-y-0 start-s-0 z-10 w-32 bg-linear-to-r from-background to-transparent" />
      <div className="absolute inset-y-0 end-e-0 z-10 w-32 bg-linear-to-l from-background to-transparent" />

      <div className="flex flex-col gap-3 pt-8 opacity-[0.032] dark:opacity-[0.022]">
        <div
          className="flex whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.32em] text-foreground"
          style={{ animation: "ts-marquee 42s linear infinite" }}
        >
          {row.map((name, i) => (
            <span key={i} className="mx-8">
              {name}
            </span>
          ))}
        </div>
        <div
          className="flex whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.32em] text-foreground"
          style={{ animation: "ts-marquee-rev 36s linear infinite" }}
        >
          {rowR.map((name, i) => (
            <span key={i} className="mx-8">
              {name}
            </span>
          ))}
        </div>
        <div
          className="flex whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.32em] text-foreground"
          style={{ animation: "ts-marquee 58s linear infinite" }}
        >
          {row.map((name, i) => (
            <span key={i} className="mx-8">
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool card
// ─────────────────────────────────────────────────────────────────────────────

function ToolCard({ tool, index }: { tool: TechTool; index: number }) {
  const [hovered, setHovered] = useState(false);
  const Logo = tool.logo;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ delay: index * 0.04, duration: 0.38, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex cursor-default flex-col items-center
                 gap-3 overflow-hidden rounded-2xl border border-border/60
                 bg-card p-5 text-center shadow-sm
                 transition-[transform,box-shadow,border-color] duration-300
                 hover:-translate-y-1.5 hover:border-transparent hover:shadow-xl"
    >
      {/* Hover glow ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl
                   opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: `inset 0 0 0 1px ${tool.color}45`,
          background: `radial-gradient(ellipse 80% 55% at 50% 0%, ${tool.color}12, transparent)`,
        }}
      />

      <motion.div
        className="relative flex size-14 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${tool.color}14` }}
        animate={hovered ? { scale: 1.1 } : { scale: 1 }}
        transition={{ duration: 0.22, ease: EASE }}
      >
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl blur-md"
          style={{ backgroundColor: tool.color }}
          animate={hovered ? { opacity: 0.22 } : { opacity: 0 }}
          transition={{ duration: 0.25 }}
        />
        <Logo
          className="relative size-7"
          style={{ color: tool.color }}
          aria-hidden="true"
        />
      </motion.div>

      <p className="text-[13px] font-bold leading-tight text-foreground">
        {tool.name}
      </p>

      <span
        className="inline-flex items-center rounded-full px-2.5 py-0.5
                   text-[10px] font-semibold uppercase tracking-wider"
        style={{
          backgroundColor: `${tool.color}14`,
          color: tool.color,
        }}
      >
        {tool.category}
      </span>

      <AnimatePresence>
        {hovered && tool.description && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="overflow-hidden text-[11px] leading-5 text-muted-foreground"
          >
            {tool.description}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab bar
// ─────────────────────────────────────────────────────────────────────────────

function TabBar({
  categories,
  active,
  onChange,
  isRtl,
}: {
  categories: TechCategory[];
  active: string;
  onChange: (id: string) => void;
  isRtl: boolean;
}) {
  const layoutId = useId();
  const t = useTranslations("TechStack");
  const allLabel = t("allLabel");

  type Tab = { id: string; label: string; icon: React.ElementType | null };

  const tabs: Tab[] = [
    { id: "all", label: allLabel, icon: null },
    ...categories.map((c) => ({ id: c.id, label: c.label, icon: c.icon })),
  ];

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      role="tablist"
      aria-label={t("tabListLabel")}
      className="flex flex-wrap items-center justify-center gap-2"
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={[
              "relative inline-flex items-center gap-2 rounded-full px-4 py-2",
              "text-sm font-medium transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "text-white"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
            ].join(" ")}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-color shadow-brand"
                transition={{ type: "spring", bounce: 0.18, duration: 0.42 }}
              />
            )}
            {Icon && (
              <Icon className="relative size-3.5 shrink-0" aria-hidden="true" />
            )}
            <span className="relative">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool grid – memoized to avoid re‑filtering on every render
// ─────────────────────────────────────────────────────────────────────────────

const ToolGrid = memo(function ToolGrid({
  tools,
  activeCategory,
}: {
  tools: TechTool[];
  activeCategory: string;
}) {
  const visible = useMemo(() => {
    return activeCategory === "all"
      ? tools
      : tools.filter((t) => t.category === activeCategory);
  }, [tools, activeCategory]);

  return (
    <div
      role="tabpanel"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {visible.map((tool, i) => (
          <ToolCard key={tool.name} tool={tool} index={i} />
        ))}
      </AnimatePresence>
    </div>
  );
});


// ─────────────────────────────────────────────────────────────────────────────
// Root export
// ─────────────────────────────────────────────────────────────────────────────

export function TechStack({
  categories,
  tools,
  isRtl = false,
  className = "",
}: TechStackProps) {
  const t = useTranslations("TechStack");
  const firstTab = "all";
  const [activeCategory, setActiveCategory] = useState(firstTab);

  // Build title with accent word
  const rawTitle = t("title");
  const accentWord = t("accentWord");
  const renderTitle = () => {
    if (!accentWord || !rawTitle.includes(accentWord)) return rawTitle;
    const [before, after] = rawTitle.split(accentWord);
    return (
      <>
        {before}
        <span className="text-color">{accentWord}</span>
        {after}
      </>
    );
  };

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      aria-labelledby="techstack-heading"
      className={`relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28 ${className}`}
    >
      {/* Page-level backgrounds */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20
                   bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgb(50_75_157/8%),transparent)]
                   dark:bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgb(50_75_157/5%),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20
                   bg-[linear-gradient(to_right,rgb(148_198_233/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_198_233/0.04)_1px,transparent_1px)]
                   bg-size-[48px_48px]"
      />

      <MarqueeBackground tools={tools} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[-5] h-24
                   bg-linear-to-b from-background to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[-5] h-24
                   bg-linear-to-t from-background to-transparent"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <motion.p
            {...fadeUpInView(0)}
            className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary"
          >
            {t("eyebrow")}
          </motion.p>
          <motion.h2
            id="techstack-heading"
            {...fadeUpInView(0.07)}
            className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {renderTitle()}
          </motion.h2>
          <motion.p
            {...fadeUpInView(0.14)}
            className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground"
          >
            {t("description")}
          </motion.p>
        </div>

        {/* Tab bar */}
        <motion.div {...fadeUpInView(0.18)} className="mb-8">
          <TabBar
            categories={categories}
            active={activeCategory}
            onChange={setActiveCategory}
            isRtl={isRtl}
          />
        </motion.div>

        {/* Tool grid */}
        <motion.div {...fadeUpInView(0.22)}>
          <ToolGrid tools={tools} activeCategory={activeCategory} />
        </motion.div>
      </div>

      <style>{`
        @keyframes ts-marquee {
          from { transform: translateX(0%); }
          to   { transform: translateX(-33.333%); }
        }
        @keyframes ts-marquee-rev {
          from { transform: translateX(-33.333%); }
          to   { transform: translateX(0%); }
        }
      `}</style>
    </section>
  );
}
