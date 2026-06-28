"use client";

// components/shared/TechStack.tsx
//
// Reusable "Tech Stack" section — tabbed by category with animated tool cards.
//
// Layout:
//   Header → Category tab bar → Animated tool grid → Counter strip
//
// Design:
//   • Tab bar with Framer Motion layoutId sliding pill
//   • Cards: SVG logo + name + category badge + description on hover
//   • Staggered card entrance per tab switch (AnimatePresence mode="popLayout")
//   • Hover: lift + colored glow ring + ambient logo blur
//   • Decorative background: 3-row blurred marquee of tool names
//   • Left/right edge fade masks on marquee
//   • Fully RTL-safe — dir attribute + logical properties
//   • Fully props-driven
//
// Usage:
//   import { TechStack } from "@/components/shared/TechStack";
//   <TechStack {...config} isRtl={isRtl} />

import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUpInView = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: EASE },
});

// ─────────────────────────────────────────────────────────────────────────────
// Public types (exported so config files can use them)
// ─────────────────────────────────────────────────────────────────────────────

export interface TechTool {
  /** Display name */
  name: string;
  /** Must match a TechCategory.id */
  category: string;
  /** Brand hex — used for glow, badge bg, icon tint */
  color: string;
  /** Inline SVG React component */
  logo: React.ElementType;
  /** One-line description shown on hover */
  description?: string;
}

export interface TechCategory {
  id: string;
  label: string;
  icon: React.ElementType;
}

export interface TechStackProps {
  eyebrow?: string;
  title: string;
  /** Word/phrase inside title that receives brand gradient */
  accentWord?: string;
  description?: string;
  categories: TechCategory[];
  tools: TechTool[];
  /** If provided, an "All" tab is prepended */
  allLabel?: string;
  isRtl?: boolean;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Decorative marquee background
// Three rows at different speeds, blurred + very low opacity
// ─────────────────────────────────────────────────────────────────────────────

function MarqueeBackground({ tools }: { tools: TechTool[] }) {
  const names = tools.map((t) => t.name);
  // Triple for seamless loop
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
        {/* Row 1 — left → right */}
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
        {/* Row 2 — right → left */}
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
        {/* Row 3 — left → right, slower */}
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

      {/* Logo wrapper */}
      <motion.div
        className="relative flex size-14 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${tool.color}14` }}
        animate={hovered ? { scale: 1.1 } : { scale: 1 }}
        transition={{ duration: 0.22, ease: EASE }}
      >
        {/* Ambient blur glow */}
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

      {/* Tool name */}
      <p className="text-[13px] font-bold leading-tight text-foreground">
        {tool.name}
      </p>

      {/* Category badge */}
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

      {/* Description — slides in on hover */}
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
// Tab bar — sliding pill with Framer Motion layoutId
// ─────────────────────────────────────────────────────────────────────────────

function TabBar({
  categories,
  allLabel,
  active,
  onChange,
  isRtl,
}: {
  categories: TechCategory[];
  allLabel?: string;
  active: string;
  onChange: (id: string) => void;
  isRtl: boolean;
}) {
  const layoutId = useId();

  type Tab = { id: string; label: string; icon: React.ElementType | null };

  const tabs: Tab[] = [
    ...(allLabel ? [{ id: "all", label: allLabel, icon: null }] : []),
    ...categories.map((c) => ({ id: c.id, label: c.label, icon: c.icon })),
  ];

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      role="tablist"
      aria-label="Tool categories"
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
            {/* Animated background pill */}
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
// Tool grid with AnimatePresence
// ─────────────────────────────────────────────────────────────────────────────

function ToolGrid({
  tools,
  activeCategory,
}: {
  tools: TechTool[];
  activeCategory: string;
}) {
  const visible =
    activeCategory === "all"
      ? tools
      : tools.filter((t) => t.category === activeCategory);

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
}

// ─────────────────────────────────────────────────────────────────────────────
// Counter strip
// ─────────────────────────────────────────────────────────────────────────────

function CounterStrip({
  tools,
  categories,
  isRtl,
}: {
  tools: TechTool[];
  categories: TechCategory[];
  isRtl: boolean;
}) {
  const items = [
    { value: `${tools.length}+`, label: "Integrations" },
    { value: `${categories.length}`, label: "Categories" },
    { value: "REST", label: "API standard" },
    { value: "OAuth 2.0", label: "Auth protocol" },
  ];

  return (
    <motion.div
      {...fadeUpInView(0.28)}
      dir={isRtl ? "rtl" : "ltr"}
      className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.28 + i * 0.07, duration: 0.5, ease: EASE }}
          className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/50
                     bg-card/60 px-4 py-5 text-center backdrop-blur-sm
                     transition-colors hover:border-primary/25"
        >
          <span className="text-xl font-bold tabular-nums text-foreground sm:text-2xl">
            {item.value}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {item.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root export
// ─────────────────────────────────────────────────────────────────────────────

export function TechStack({
  eyebrow,
  title,
  accentWord,
  description,
  categories,
  tools,
  allLabel,
  isRtl = false,
  className = "",
}: TechStackProps) {
  const firstTab = allLabel ? "all" : (categories[0]?.id ?? "all");
  const [activeCategory, setActiveCategory] = useState(firstTab);

  const renderTitle = () => {
    if (!accentWord || !title.includes(accentWord)) return title;
    const [before, after] = title.split(accentWord);
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

      {/* Decorative marquee */}
      <MarqueeBackground tools={tools} />

      {/* Top + bottom masks to blend marquee into page bg */}
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
        {/* ── Header ── */}
        <div className="mb-10 text-center">
          {eyebrow && (
            <motion.p
              {...fadeUpInView(0)}
              className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary"
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h2
            id="techstack-heading"
            {...fadeUpInView(0.07)}
            className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {renderTitle()}
          </motion.h2>
          {description && (
            <motion.p
              {...fadeUpInView(0.14)}
              className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground"
            >
              {description}
            </motion.p>
          )}
        </div>

        {/* ── Tab bar ── */}
        <motion.div {...fadeUpInView(0.18)} className="mb-8">
          <TabBar
            categories={categories}
            allLabel={allLabel}
            active={activeCategory}
            onChange={setActiveCategory}
            isRtl={isRtl}
          />
        </motion.div>

        {/* ── Tool grid ── */}
        <motion.div {...fadeUpInView(0.22)}>
          <ToolGrid tools={tools} activeCategory={activeCategory} />
        </motion.div>

        {/* ── Counter strip ── */}
        <CounterStrip tools={tools} categories={categories} isRtl={isRtl} />
      </div>

      {/* Marquee keyframes */}
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
