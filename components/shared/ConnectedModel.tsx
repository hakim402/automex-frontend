"use client";

// components/shared/ConnectedModel.tsx
//
// "One connected model" showcase — hub-and-spoke diagram.
//
// v2 changes:
//   1. Mobile now gets REAL animated connector lines too — a vertical
//      SVG overlay draws curves from each signal tile down to the hub,
//      then from the hub down to each output card. Same flowing-dash
//      technique as desktop, just a different path shape (vertical
//      instead of horizontal).
//   2. Output cards get an actual mini chart (animated SVG bar chart
//      for Dashboard, animated line/sparkline for AI Agent) instead of
//      bare counters — reads as a real product screenshot, not a stat strip.
//   3. Middle column gets explicit breathing room: a min-width gutter on
//      desktop (px-8 / lg:px-12) and generous vertical padding on mobile
//      (py-10) so the hub never feels cramped between the two sides.
//
// Usage unchanged:
//   <ConnectedModel {...config} isRtl={isRtl} />

import { useRef, useState, useEffect, useId } from "react";
import { motion, useInView, animate } from "framer-motion";
import Link from "next/link";
import { Power, ArrowRight } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUpInView = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: EASE },
});

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SignalSource {
  name: string;
  icon: React.ElementType;
  color: string;
}

export interface OutputCardMetric {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}

export interface OutputCard {
  title: string;
  description: string;
  icon: React.ElementType;
  metrics: OutputCardMetric[];
  /** Which mini-chart to render in the card preview */
  chartType: "bars" | "line";
  /** Raw data points driving the chart shape (relative values, any scale) */
  chartData: number[];
}

export interface ConnectedModelProps {
  eyebrow: string;
  headlineLead: string;
  headlineAccent: string;
  description: string;
  signalsLabel: string;
  outputsLabel: string;
  signals: SignalSource[];
  outputs: [OutputCard, OutputCard];
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  isRtl?: boolean;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated metric counter
// ─────────────────────────────────────────────────────────────────────────────

function MetricCounter({
  metric,
  delay,
}: {
  metric: OutputCardMetric;
  delay: number;
}) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      const controls = animate(0, metric.value, {
        duration: 1.6,
        ease: "easeOut",
        onUpdate(v) {
          const rounded =
            metric.value % 1 !== 0
              ? v.toFixed(1)
              : Math.round(v).toLocaleString();
          setDisplay(`${metric.prefix ?? ""}${rounded}${metric.suffix ?? ""}`);
        },
      });
      return () => controls.stop();
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [inView, metric, delay]);

  return <span className="tabular-nums">{display}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mini chart — animated bar chart (Dashboard card)
// ─────────────────────────────────────────────────────────────────────────────

function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const max = Math.max(...data, 1);
  const W = 240;
  const H = 64;
  const gap = 4;
  const barW = (W - gap * (data.length - 1)) / data.length;

  return (
    <div ref={ref} className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="none"
        style={{ height: 64 }}
      >
        <defs>
          <linearGradient id="bar-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor={color} stopOpacity="0.55" />
          </linearGradient>
        </defs>
        {data.map((v, i) => {
          const h = (v / max) * (H - 4);
          const x = i * (barW + gap);
          return (
            <motion.rect
              key={i}
              x={x}
              width={barW}
              rx={2}
              fill="url(#bar-grad)"
              initial={{ height: 0, y: H }}
              animate={inView ? { height: h, y: H - h } : { height: 0, y: H }}
              transition={{
                delay: 0.15 + i * 0.05,
                duration: 0.55,
                ease: EASE,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mini chart — animated sparkline (AI Agent card)
// ─────────────────────────────────────────────────────────────────────────────

function MiniLineChart({ data, color }: { data: number[]; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const W = 240;
  const H = 64;
  const pad = 4;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (W - pad * 2) + pad;
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return { x, y };
  });

  const linePath = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${H} L ${points[0].x} ${H} Z`;

  return (
    <div ref={ref} className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="none"
        style={{ height: 64 }}
      >
        <defs>
          <linearGradient id="line-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.path
          d={areaPath}
          fill="url(#line-grad)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ delay: 0.15, duration: 0.9, ease: EASE }}
        />
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === points.length - 1 ? 3 : 0}
            fill={color}
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : { scale: 0 }}
            transition={{
              delay: 1.1,
              duration: 0.3,
              type: "spring",
              bounce: 0.5,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Signal tile
// ─────────────────────────────────────────────────────────────────────────────

function SignalTile({
  signal,
  index,
  tileRef,
}: {
  signal: SignalSource;
  index: number;
  tileRef: (el: HTMLDivElement | null) => void;
}) {
  const Icon = signal.icon;

  return (
    <motion.div
      ref={tileRef}
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.03 * index, duration: 0.4, ease: EASE }}
      className="group relative flex size-12 shrink-0 items-center justify-center
                 rounded-xl border border-border/50 bg-card shadow-sm
                 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md
                 sm:size-14"
      title={signal.name}
    >
      <Icon
        className="size-5 transition-transform duration-300 group-hover:scale-110 sm:size-6"
        style={{ color: signal.color }}
        aria-hidden="true"
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Center hub node
// ─────────────────────────────────────────────────────────────────────────────

function HubNode({
  hubRef,
  label,
}: {
  hubRef: (el: HTMLDivElement | null) => void;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <motion.div
        ref={hubRef}
        initial={{ opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
        className="relative flex size-16 items-center justify-center rounded-2xl
                   bg-color shadow-brand sm:size-20"
      >
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl bg-primary/30"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <Power
          className="relative size-7 text-white sm:size-9"
          strokeWidth={2.25}
          aria-hidden="true"
        />
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Output card with real chart preview
// ─────────────────────────────────────────────────────────────────────────────

function OutputCardView({
  card,
  index,
  cardRef,
  accentColor,
}: {
  card: OutputCard;
  index: number;
  cardRef: (el: HTMLDivElement | null) => void;
  accentColor: string;
}) {
  const Icon = card.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.15 + index * 0.12, duration: 0.6, ease: EASE }}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl
                 border border-border/60 bg-card p-6 shadow-sm
                 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-e-12 -top-12 size-40 rounded-full
                   bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500
                   group-hover:opacity-100"
      />

      <div className="relative flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-foreground">{card.title}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {card.description}
          </p>
        </div>
      </div>

      {/* Chart preview */}
      <div className="relative overflow-hidden rounded-xl border border-border/40 bg-background/50 p-3">
        {card.chartType === "bars" ? (
          <MiniBarChart data={card.chartData} color={accentColor} />
        ) : (
          <MiniLineChart data={card.chartData} color={accentColor} />
        )}
      </div>

      {/* Live metrics strip */}
      <div className="relative grid grid-cols-3 gap-2 rounded-xl border border-border/40 bg-background/50 p-3">
        {card.metrics.map((m, i) => (
          <div key={m.label} className="flex flex-col items-center text-center">
            <span className="text-base font-bold text-foreground sm:text-lg">
              <MetricCounter metric={m} delay={0.3 + i * 0.1} />
            </span>
            <span className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Connector path measurement (shared by desktop horizontal + mobile vertical)
// ─────────────────────────────────────────────────────────────────────────────

interface Point {
  x: number;
  y: number;
}

function useConnectorPaths(
  containerRef: React.RefObject<HTMLDivElement | null>,
  signalRefs: React.RefObject<(HTMLDivElement | null)[]>,
  hubRef: React.RefObject<HTMLDivElement | null>,
  outputRefs: React.RefObject<(HTMLDivElement | null)[]>,
  mode: "horizontal" | "vertical",
) {
  const [inPaths, setInPaths] = useState<string[]>([]);
  const [outPaths, setOutPaths] = useState<string[]>([]);
  const [viewBox, setViewBox] = useState("0 0 1000 600");

  useEffect(() => {
    function measure() {
      const container = containerRef.current;
      const hub = hubRef.current;
      if (!container || !hub) return;

      const cRect = container.getBoundingClientRect();
      // Skip measuring if container has zero size (e.g. display:none on this breakpoint)
      if (cRect.width === 0 || cRect.height === 0) return;

      setViewBox(`0 0 ${cRect.width} ${cRect.height}`);

      const toLocal = (rect: DOMRect): Point => ({
        x: rect.left - cRect.left + rect.width / 2,
        y: rect.top - cRect.top + rect.height / 2,
      });

      const hubPt = toLocal(hub.getBoundingClientRect());

      const newIn: string[] = [];
      signalRefs.current.forEach((el) => {
        if (!el) return;
        const p = toLocal(el.getBoundingClientRect());
        if (mode === "horizontal") {
          const mx = (p.x + hubPt.x) / 2;
          newIn.push(`M ${p.x} ${p.y} Q ${mx} ${p.y} ${hubPt.x} ${hubPt.y}`);
        } else {
          const my = (p.y + hubPt.y) / 2;
          newIn.push(`M ${p.x} ${p.y} Q ${p.x} ${my} ${hubPt.x} ${hubPt.y}`);
        }
      });
      setInPaths(newIn);

      const newOut: string[] = [];
      outputRefs.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const p = toLocal(r);
        if (mode === "horizontal") {
          const mx = (hubPt.x + p.x) / 2;
          newOut.push(`M ${hubPt.x} ${hubPt.y} Q ${mx} ${p.y} ${p.x} ${p.y}`);
        } else {
          const my = (hubPt.y + p.y) / 2;
          newOut.push(
            `M ${hubPt.x} ${hubPt.y} Q ${hubPt.x} ${my} ${p.x} ${p.y}`,
          );
        }
      });
      setOutPaths(newOut);
    }

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);
    // Re-measure after fonts/layout settle
    const t = setTimeout(measure, 300);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return { inPaths, outPaths, viewBox };
}

function ConnectorSVG({
  inPaths,
  outPaths,
  viewBox,
  gradId,
  className = "",
}: {
  inPaths: string[];
  outPaths: string[];
  viewBox: string;
  gradId: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox={viewBox}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`${gradId}-in`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0ab8fb" stopOpacity="0" />
          <stop offset="50%" stopColor="#0ab8fb" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#324b9d" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${gradId}-out`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#324b9d" stopOpacity="0" />
          <stop offset="50%" stopColor="#0ab8fb" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0ab8fb" stopOpacity="0" />
        </linearGradient>
        <filter
          id={`${gradId}-glow`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {inPaths.map((d, i) => (
        <path
          key={`in-ghost-${i}`}
          d={d}
          fill="none"
          stroke="currentColor"
          className="text-border"
          strokeWidth="1"
          strokeOpacity="0.4"
        />
      ))}
      {outPaths.map((d, i) => (
        <path
          key={`out-ghost-${i}`}
          d={d}
          fill="none"
          stroke="currentColor"
          className="text-border"
          strokeWidth="1"
          strokeOpacity="0.4"
        />
      ))}

      {inPaths.map((d, i) => (
        <path
          key={`in-flow-${i}`}
          d={d}
          fill="none"
          stroke={`url(#${gradId}-in)`}
          strokeWidth="1.5"
          strokeDasharray="6 14"
          filter={`url(#${gradId}-glow)`}
          style={{
            animation: `connector-flow 2.4s linear infinite`,
            animationDelay: `${(i % 8) * 0.18}s`,
          }}
        />
      ))}

      {outPaths.map((d, i) => (
        <path
          key={`out-flow-${i}`}
          d={d}
          fill="none"
          stroke={`url(#${gradId}-out)`}
          strokeWidth="2"
          strokeDasharray="8 18"
          filter={`url(#${gradId}-glow)`}
          style={{
            animation: `connector-flow-rev 2s linear infinite`,
            animationDelay: `${i * 0.25}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes connector-flow {
          from { stroke-dashoffset: 40; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes connector-flow-rev {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -52; }
        }
      `}</style>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root export
// ─────────────────────────────────────────────────────────────────────────────

export function ConnectedModel({
  eyebrow,
  headlineLead,
  headlineAccent,
  description,
  signalsLabel,
  outputsLabel,
  signals,
  outputs,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  isRtl = false,
  className = "",
}: ConnectedModelProps) {
  const gradId = useId().replace(/:/g, "");

  // ── Desktop (horizontal) refs + measurement ──
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const desktopHubRef = useRef<HTMLDivElement | null>(null);
  const desktopSignalRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopOutputRefs = useRef<(HTMLDivElement | null)[]>([]);

  const desktopPaths = useConnectorPaths(
    desktopContainerRef,
    desktopSignalRefs,
    desktopHubRef,
    desktopOutputRefs,
    "horizontal",
  );

  // ── Mobile (vertical) refs + measurement — separate DOM subtree ──
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const mobileHubRef = useRef<HTMLDivElement | null>(null);
  const mobileSignalRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileOutputRefs = useRef<(HTMLDivElement | null)[]>([]);

  const mobilePaths = useConnectorPaths(
    mobileContainerRef,
    mobileSignalRefs,
    mobileHubRef,
    mobileOutputRefs,
    "vertical",
  );

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      aria-labelledby="connected-model-heading"
      className={`relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28 ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10
                   bg-[linear-gradient(to_right,rgb(148_198_233/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_198_233/0.05)_1px,transparent_1px)]
                   bg-size-[40px_40px]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.p
            {...fadeUpInView(0)}
            className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary"
          >
            {eyebrow}
          </motion.p>
          <motion.h2
            id="connected-model-heading"
            {...fadeUpInView(0.07)}
            className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl"
          >
            {headlineLead}
            <br />
            <span className="text-color">{headlineAccent}</span>
          </motion.h2>
          <motion.p
            {...fadeUpInView(0.14)}
            className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg"
          >
            {description}
          </motion.p>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            DESKTOP layout (lg+) — horizontal flow with side-by-side columns
            ════════════════════════════════════════════════════════════════ */}
        <div ref={desktopContainerRef} className="relative hidden lg:block">
          <ConnectorSVG
            inPaths={desktopPaths.inPaths}
            outPaths={desktopPaths.outPaths}
            viewBox={desktopPaths.viewBox}
            gradId={`${gradId}-d`}
          />

          {/* grid-cols with explicit middle gutter for breathing room */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-10 xl:gap-x-16">
            {/* Left: signal grid */}
            <div className="relative z-10">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {signalsLabel}
              </p>
              <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
                {signals.map((signal, i) => (
                  <SignalTile
                    key={signal.name}
                    signal={signal}
                    index={i}
                    tileRef={(el) => {
                      desktopSignalRefs.current[i] = el;
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Middle: hub, with its own horizontal padding so lines never touch the columns */}
            <div className="relative z-10 flex justify-center px-6 xl:px-10">
              <HubNode
                hubRef={(el) => {
                  desktopHubRef.current = el;
                }}
                label="One model"
              />
            </div>

            {/* Right: output cards */}
            <div className="relative z-10">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {outputsLabel}
              </p>
              <div className="flex flex-col gap-4">
                {outputs.map((card, i) => (
                  <OutputCardView
                    key={card.title}
                    card={card}
                    index={i}
                    accentColor={i === 0 ? "#0ab8fb" : "#7c3aed"}
                    cardRef={(el) => {
                      desktopOutputRefs.current[i] = el;
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            MOBILE / TABLET layout (<lg) — vertical flow, top to bottom,
            with real animated connector lines drawn down the column
            ════════════════════════════════════════════════════════════════ */}
        <div
          ref={mobileContainerRef}
          className="relative flex flex-col items-center lg:hidden"
        >
          <ConnectorSVG
            inPaths={mobilePaths.inPaths}
            outPaths={mobilePaths.outPaths}
            viewBox={mobilePaths.viewBox}
            gradId={`${gradId}-m`}
          />

          {/* Signal grid */}
          <div className="relative z-10 w-full">
            <p className="mb-4 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {signalsLabel}
            </p>
            <div className="mx-auto grid max-w-sm grid-cols-5 gap-2.5">
              {signals.map((signal, i) => (
                <SignalTile
                  key={signal.name}
                  signal={signal}
                  index={i}
                  tileRef={(el) => {
                    mobileSignalRefs.current[i] = el;
                  }}
                />
              ))}
            </div>
          </div>

          {/* Hub — generous vertical breathing room above + below */}
          <div className="relative z-10 py-10 sm:py-12">
            <HubNode
              hubRef={(el) => {
                mobileHubRef.current = el;
              }}
              label="One model"
            />
          </div>

          {/* Output cards */}
          <div className="relative z-10 w-full">
            <p className="mb-4 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {outputsLabel}
            </p>
            <div className="flex flex-col gap-4">
              {outputs.map((card, i) => (
                <OutputCardView
                  key={card.title}
                  card={card}
                  index={i}
                  accentColor={i === 0 ? "#0ab8fb" : "#7c3aed"}
                  cardRef={(el) => {
                    mobileOutputRefs.current[i] = el;
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA row ── */}
        <motion.div
          {...fadeUpInView(0.3)}
          className="mt-14 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href={secondaryHref}
            className="inline-flex items-center justify-center rounded-full border
                       border-border bg-background px-6 py-3 text-sm font-semibold
                       text-foreground transition-all duration-200 hover:-translate-y-0.5
                       hover:border-primary/40 hover:text-primary"
          >
            {secondaryLabel}
          </Link>
          <Link
            href={primaryHref}
            className="group inline-flex items-center justify-center gap-2 rounded-full
                       bg-color px-6 py-3 text-sm font-semibold text-white shadow-brand
                       transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            {primaryLabel}
            <ArrowRight
              className={`size-4 transition-transform ${isRtl ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
