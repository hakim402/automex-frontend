"use client";

// components/shared/HowItWorks.tsx
//
// Layout (top → bottom):
//   1. Section header
//   2. FlowStepsRow  — 4 steps with working connector lines
//   3. PipelineVisualizer — full-width SVG node graph
//   4. InteractiveSandbox — full-width agent demo

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Brain,
  CheckCircle2,
  Loader2,
  Play,
  RotateCcw,
  ChevronRight,
  Database,
  Mail,
  Calendar,
  Bell,
  Tag,
  FileText,
  Sparkles,
  Terminal,
  CircleDot,
  GitBranch,
  MessageSquare,
  ArrowDown,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Motion helpers
// ─────────────────────────────────────────────────────────────────────────────

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

export interface FlowStep {
  icon: React.ElementType;
  color: string;
  title: string;
  description: string;
}

export interface PipelineAction {
  icon: React.ElementType;
  system: string;
  action: string;
  detail: string;
  color: string;
  durationMs: number;
}

export interface AgentTask {
  label: string;
  icon: React.ElementType;
  thoughts: string[];
  actions: PipelineAction[];
  result: {
    summary: string;
    metrics: { label: string; value: string }[];
  };
}

export interface HowItWorksProps {
  eyebrow?: string;
  title: string;
  accentWord?: string;
  description?: string;
  flowSteps: FlowStep[];
  tasks: AgentTask[];
  sandboxTitle: string;
  sandboxDescription: string;
  runLabel: string;
  resetLabel: string;
  thinkingLabel: string;
  doneLabel: string;
  isRtl?: boolean;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1 — Flow Steps Row
// FIX: connector is now a ::after-style absolute div that spans
//      from the END of the current icon to the START of the next icon.
//      We use a wrapping grid so each cell is equal width, then draw
//      the line in the top-center area between cells.
// ─────────────────────────────────────────────────────────────────────────────

function FlowStepsRow({ steps, isRtl }: { steps: FlowStep[]; isRtl: boolean }) {
  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="relative">
      {/* ── Desktop: horizontal row ── */}
      <div className="hidden sm:grid sm:grid-cols-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isLast = i === steps.length - 1;

          return (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center px-4"
            >
              {/* ── Connector line (RTL aware) ── */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  className="absolute top-7 h-px"
                  style={
                    isRtl
                      ? {
                          // In RTL, start from right side of icon and go leftwards
                          right: "calc(50% + 28px)",
                          left: "calc(-50% + 28px)",
                          background: `linear-gradient(to left, ${step.color}80, ${steps[i + 1].color}80)`,
                        }
                      : {
                          left: "calc(50% + 28px)",
                          right: "calc(-50% + 28px)",
                          background: `linear-gradient(to right, ${step.color}80, ${steps[i + 1].color}80)`,
                        }
                  }
                >
                  {/* Traveling dot – direction RTL aware */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 size-2 rounded-full shadow-md"
                    style={{
                      backgroundColor: step.color,
                      boxShadow: `0 0 6px ${step.color}`,
                    }}
                    animate={
                      isRtl
                        ? { right: ["0%", "100%"] }
                        : { left: ["0%", "100%"] }
                    }
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.45,
                    }}
                  />
                </div>
              )}

              {/* Icon badge – number positioning: always at top‑right in LTR, top‑left in RTL */}
              <div className="relative mb-4 z-10">
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{ backgroundColor: `${step.color}20` }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                />
                <div
                  className="relative flex size-14 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: `${step.color}12`,
                    color: step.color,
                    boxShadow: `0 0 0 1px ${step.color}30, 0 8px 24px ${step.color}20`,
                  }}
                >
                  <Icon className="size-6" aria-hidden="true" />
                </div>
                {/* Step number – RTL: move to top‑left */}
                <div
                  className={`absolute -top-2 flex size-5 items-center justify-center rounded-full text-[9px] font-bold text-white ring-2 ring-background ${
                    isRtl ? "-inset-s-2" : "-inset-e-2"
                  }`}
                  style={{ backgroundColor: step.color }}
                >
                  {i + 1}
                </div>
              </div>

              <h3 className="text-sm font-bold text-foreground">
                {step.title}
              </h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground max-w-35">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Mobile: vertical stack (RTL aware) ── */}
      <div className="flex flex-col gap-0 sm:hidden">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isLast = i === steps.length - 1;

          return (
            <div
              key={step.title}
              className={`relative flex items-start gap-4 ${isRtl ? "pe-2" : "ps-2"}`}
            >
              {/* Vertical spine – positioned on the side appropriate for RTL */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  className={`absolute top-14 bottom-0 w-px ${
                    isRtl ? "inset-e-6.75" : "inset-s-6.75"
                  }`}
                  style={{
                    background: `linear-gradient(to bottom, ${step.color}60, ${steps[i + 1].color}40)`,
                  }}
                >
                  <motion.div
                    className="absolute size-1.5 rounded-full -translate-x-1/2 left-1/2"
                    style={{ backgroundColor: step.color }}
                    animate={{ top: ["0%", "100%"] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.4,
                    }}
                  />
                </div>
              )}

              {/* Icon – order is the same (left in LTR, right in RTL) */}
              <div className="relative shrink-0 z-10 mb-8">
                <div
                  className="flex size-11 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: `${step.color}12`,
                    color: step.color,
                  }}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                {/* Step number – adjust edge */}
                <div
                  className={`absolute -top-1.5 flex size-4 items-center justify-center rounded-full text-[8px] font-bold text-white ${
                    isRtl ? "-inset-s-1.5" : "-inset-e-1.5"
                  }`}
                  style={{ backgroundColor: step.color }}
                >
                  {i + 1}
                </div>
              </div>

              {/* Text – automatically aligned by parent dir */}
              <div className="pt-1.5 pb-8">
                <h3 className="text-sm font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2 — Pipeline Visualizer (full-width)
// ─────────────────────────────────────────────────────────────────────────────

const PIPELINE_NODES = [
  {
    id: "trigger",
    label: "New Lead",
    sublabel: "HubSpot CRM",
    icon: Database,
    x: 50,
    y: 15,
    color: "#0ab8fb",
  },
  {
    id: "agent",
    label: "AI Agent",
    sublabel: "Processing",
    icon: Brain,
    x: 50,
    y: 42,
    color: "#7c3aed",
  },
  {
    id: "asana",
    label: "Asana",
    sublabel: "Task created",
    icon: CheckCircle2,
    x: 18,
    y: 78,
    color: "#13a89e",
  },
  {
    id: "slack",
    label: "Slack",
    sublabel: "Notified",
    icon: MessageSquare,
    x: 50,
    y: 78,
    color: "#f59e0b",
  },
  {
    id: "cal",
    label: "Calendar",
    sublabel: "Scheduled",
    icon: Calendar,
    x: 82,
    y: 78,
    color: "#324b9d",
  },
];

const PIPELINE_EDGES = [
  { from: "trigger", to: "agent", color: "#0ab8fb" },
  { from: "agent", to: "asana", color: "#13a89e" },
  { from: "agent", to: "slack", color: "#f59e0b" },
  { from: "agent", to: "cal", color: "#324b9d" },
];

function PipelineVisualizer({
  activeActionIndex,
}: {
  activeActionIndex: number;
}) {
  const W = 600;
  const H = 280;

  const pos = (id: string) => {
    const n = PIPELINE_NODES.find((n) => n.id === id)!;
    return { x: (n.x / 100) * W, y: (n.y / 100) * H };
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
      {/* Grid bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(148_198_233/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_198_233/0.05)_1px,transparent_1px)] bg-size-[32px_32px]"
      />
      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgb(10_184_251/4%),transparent)]"
      />

      {/* Label */}
      <div className="absolute top-3 inset-s-4 flex items-center gap-2 z-10">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Live Pipeline
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        aria-label="AI pipeline visualization"
        style={{ height: 280 }}
      >
        <defs>
          <filter id="nodeGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter
            id="particleGlow"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {PIPELINE_NODES.map((n) => (
            <radialGradient
              key={`grad-${n.id}`}
              id={`grad-${n.id}`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset="0%" stopColor={n.color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={n.color} stopOpacity="0.06" />
            </radialGradient>
          ))}
        </defs>

        {/* Edges */}
        {PIPELINE_EDGES.map((edge, ei) => {
          const f = pos(edge.from);
          const t = pos(edge.to);
          const isActive = activeActionIndex >= ei;
          // curved path
          const mx = (f.x + t.x) / 2;
          const my = (f.y + t.y) / 2;
          const d = `M ${f.x} ${f.y} Q ${mx} ${my} ${t.x} ${t.y}`;

          return (
            <g key={`${edge.from}-${edge.to}`}>
              {/* Ghost */}
              <path
                d={d}
                fill="none"
                stroke={edge.color}
                strokeWidth="1"
                strokeOpacity="0.12"
                strokeDasharray="5 5"
              />
              {/* Active fill */}
              {isActive && (
                <motion.path
                  d={d}
                  fill="none"
                  stroke={edge.color}
                  strokeWidth="1.5"
                  strokeOpacity="0.7"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              )}
              {/* Traveling particle */}
              {isActive && (
                <motion.circle
                  r="4"
                  fill={edge.color}
                  filter="url(#particleGlow)"
                  style={{ offsetPath: `path("${d}")` } as React.CSSProperties}
                  animate={{ offsetDistance: ["0%", "100%"] } as never}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: ei * 0.25,
                  }}
                />
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {PIPELINE_NODES.map((node, ni) => {
          const Icon = node.icon;
          const isActive = ni === 0 || activeActionIndex >= ni - 1;
          const { x: cx, y: cy } = pos(node.id);
          const R = 22;

          return (
            <g key={node.id} filter={isActive ? "url(#nodeGlow)" : undefined}>
              {/* Ambient halo */}
              {isActive && (
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r={R + 8}
                  fill={`url(#grad-${node.id})`}
                  animate={{
                    r: [R + 6, R + 18, R + 6],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    delay: ni * 0.3,
                  }}
                />
              )}
              {/* Main circle */}
              <circle
                cx={cx}
                cy={cy}
                r={R}
                fill={isActive ? `url(#grad-${node.id})` : "transparent"}
                stroke={node.color}
                strokeWidth={isActive ? 1.5 : 0.8}
                strokeOpacity={isActive ? 0.8 : 0.25}
              />
              {/* Icon via foreignObject */}
              <foreignObject x={cx - 10} y={cy - 10} width={20} height={20}>
                <div
                  className="flex size-full items-center justify-center"
                  style={{ color: isActive ? node.color : `${node.color}50` }}
                >
                  <Icon size={14} />
                </div>
              </foreignObject>
              {/* Label */}
              <text
                x={cx}
                y={cy + R + 14}
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="600"
                fill="currentColor"
                className="fill-foreground"
              >
                {node.label}
              </text>
              <text
                x={cx}
                y={cy + R + 24}
                textAnchor="middle"
                fontSize="7"
                fill="currentColor"
                className="fill-muted-foreground"
                opacity="0.65"
              >
                {node.sublabel}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3 — Interactive Sandbox (full-width)
// ─────────────────────────────────────────────────────────────────────────────

type SandboxState = "idle" | "thinking" | "running" | "done";

function ThoughtBubble({ thought, delay }: { thought: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35, ease: EASE }}
      className="flex items-start gap-2 text-xs text-muted-foreground"
    >
      <CircleDot className="mt-0.5 size-3 shrink-0 text-violet-500/70" />
      <span>{thought}</span>
    </motion.div>
  );
}

function ActionRow({
  action,
  delay,
  isComplete,
}: {
  action: PipelineAction;
  delay: number;
  isComplete: boolean;
}) {
  const Icon = action.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: EASE }}
      className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/60 px-4 py-3 backdrop-blur-sm"
    >
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${action.color}15`, color: action.color }}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-foreground">
            {action.system}
          </span>
          <ChevronRight className="size-3 text-muted-foreground/40 shrink-0" />
          <span className="text-xs text-muted-foreground truncate">
            {action.action}
          </span>
        </div>
        <p className="mt-0.5 text-[10px] text-muted-foreground/60 truncate">
          {action.detail}
        </p>
      </div>
      <div className="shrink-0">
        {isComplete ? (
          <CheckCircle2 className="size-4 text-emerald-500" />
        ) : (
          <Loader2 className="size-4 animate-spin text-primary" />
        )}
      </div>
    </motion.div>
  );
}

function InteractiveSandbox({
  tasks,
  sandboxTitle,
  sandboxDescription,
  runLabel,
  resetLabel,
  thinkingLabel,
  doneLabel,
  isRtl,
  onActionChange,
}: {
  tasks: AgentTask[];
  sandboxTitle: string;
  sandboxDescription: string;
  runLabel: string;
  resetLabel: string;
  thinkingLabel: string;
  doneLabel: string;
  isRtl: boolean;
  onActionChange: (index: number) => void;
}) {
  const [selected, setSelected] = useState<AgentTask>(tasks[0]);
  const [state, setState] = useState<SandboxState>("idle");
  const [thoughtIndex, setThoughtIndex] = useState(0);
  const [actionIndex, setActionIndex] = useState(-1);
  const [completedActions, setCompletedActions] = useState<number[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const reset = useCallback(() => {
    clearAll();
    setState("idle");
    setThoughtIndex(0);
    setActionIndex(-1);
    setCompletedActions([]);
    onActionChange(-1);
  }, [clearAll, onActionChange]);

  const handleSelect = useCallback(
    (task: AgentTask) => {
      reset();
      setSelected(task);
    },
    [reset],
  );

  const addTimer = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timers.current.push(id);
    return id;
  }, []);

  const run = useCallback(() => {
    if (state !== "idle") return;
    setState("thinking");
    setThoughtIndex(0);
    setActionIndex(-1);
    setCompletedActions([]);
    onActionChange(-1);

    const THOUGHT_GAP = 650;

    // Reveal thoughts
    selected.thoughts.forEach((_, ti) => {
      addTimer(() => setThoughtIndex(ti + 1), THOUGHT_GAP * (ti + 1));
    });

    // Start actions after all thoughts
    const actionStart = THOUGHT_GAP * (selected.thoughts.length + 1);
    addTimer(() => {
      setState("running");
      let elapsed = 0;
      selected.actions.forEach((action, ai) => {
        addTimer(() => {
          setActionIndex(ai);
          onActionChange(ai);
          addTimer(() => {
            setCompletedActions((prev) => [...prev, ai]);
            if (ai === selected.actions.length - 1) {
              addTimer(() => setState("done"), 350);
            }
          }, action.durationMs);
        }, elapsed);
        elapsed += action.durationMs + 220;
      });
    }, actionStart);
  }, [state, selected, onActionChange, addTimer]);

  useEffect(() => () => clearAll(), [clearAll]);

  const isRunning = state === "thinking" || state === "running";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden"
    >
      {/* Card header */}
      <div className="relative border-b border-border/60 px-6 py-4">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-color" />
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Terminal className="size-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {sandboxTitle}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {sandboxDescription}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <AnimatePresence mode="wait">
            {state === "idle" && (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden sm:flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1 text-[10px] font-medium text-muted-foreground"
              >
                <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                Ready
              </motion.span>
            )}
            {state === "thinking" && (
              <motion.span
                key="thinking"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-semibold text-violet-600 dark:text-violet-400"
              >
                <Brain className="size-3 animate-pulse" />
                Reasoning…
              </motion.span>
            )}
            {state === "running" && (
              <motion.span
                key="running"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary"
              >
                <Zap className="size-3 animate-pulse" />
                Executing…
              </motion.span>
            )}
            {state === "done" && (
              <motion.span
                key="done"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 className="size-3" />
                {doneLabel}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Body — two columns on md+ */}
      <div className="grid md:grid-cols-[auto_1fr] divide-y md:divide-y-0 md:divide-x divide-border/50">
        {/* Left: task selector + run button */}
        <div className="flex flex-col gap-5 p-5 md:w-56 lg:w-64">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Scenario
            </p>
            <div className="flex flex-col gap-2">
              {tasks.map((task) => {
                const Icon = task.icon;
                const active = selected.label === task.label;
                return (
                  <button
                    key={task.label}
                    onClick={() => handleSelect(task)}
                    className={[
                      "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium text-start transition-all duration-200",
                      active
                        ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    ].join(" ")}
                  >
                    <Icon className="size-3.5 shrink-0" />
                    {task.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={state === "idle" ? run : reset}
            disabled={isRunning}
            className={[
              "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 w-full",
              state === "idle"
                ? "bg-color text-white shadow-brand hover:-translate-y-0.5 hover:shadow-lg"
                : state === "done"
                  ? "border border-border/60 bg-background text-foreground hover:border-primary/40"
                  : "cursor-not-allowed border border-border/60 bg-muted text-muted-foreground opacity-60",
            ].join(" ")}
          >
            {state === "idle" && (
              <>
                <Play className="size-3.5" />
                {runLabel}
              </>
            )}
            {isRunning && (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                {thinkingLabel}
              </>
            )}
            {state === "done" && (
              <>
                <RotateCcw className="size-3.5" />
                {resetLabel}
              </>
            )}
          </button>
        </div>

        {/* Right: output feed */}
        <div className="min-h-80 p-5 overflow-y-auto">
          <AnimatePresence mode="wait">
            {state === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full min-h-70 flex-col items-center justify-center gap-3 text-center"
              >
                <div className="flex size-14 items-center justify-center rounded-2xl bg-accent">
                  <GitBranch className="size-7 text-primary/50" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Agent is standing by
                </p>
                <p className="text-xs text-muted-foreground max-w-60">
                  Select a scenario on the left and press{" "}
                  <strong>Run agent</strong> to watch it work in real time.
                </p>
              </motion.div>
            )}

            {state !== "idle" && (
              <motion.div
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-5"
              >
                {/* Thoughts */}
                {thoughtIndex > 0 && (
                  <div className="space-y-2">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                      <Brain className="size-3" />
                      Agent reasoning
                    </p>
                    <div className="space-y-2 rounded-xl border border-violet-500/15 bg-violet-500/4 px-4 py-3">
                      {selected.thoughts
                        .slice(0, thoughtIndex)
                        .map((thought, ti) => (
                          <ThoughtBubble
                            key={ti}
                            thought={thought}
                            delay={ti * 0.08}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {actionIndex >= 0 && (
                  <div className="space-y-2">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                      <Zap className="size-3" />
                      Actions
                    </p>
                    <div className="space-y-2">
                      {selected.actions
                        .slice(0, actionIndex + 1)
                        .map((action, ai) => (
                          <ActionRow
                            key={ai}
                            action={action}
                            delay={ai * 0.06}
                            isComplete={completedActions.includes(ai)}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {/* Result */}
                <AnimatePresence>
                  {state === "done" && (
                    <motion.div
                      initial={{ opacity: 0, y: 14, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="rounded-xl border border-emerald-500/25 bg-emerald-500/4 p-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="size-4 text-emerald-500" />
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {selected.result.summary}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {selected.result.metrics.map((m) => (
                          <div
                            key={m.label}
                            className="rounded-lg border border-emerald-500/15 bg-background/70 p-2 text-center"
                          >
                            <p className="text-sm font-bold text-foreground">
                              {m.value}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {m.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root export
// ─────────────────────────────────────────────────────────────────────────────

export function HowItWorks({
  eyebrow,
  title,
  accentWord,
  description,
  flowSteps,
  tasks,
  sandboxTitle,
  sandboxDescription,
  runLabel,
  resetLabel,
  thinkingLabel,
  doneLabel,
  isRtl = false,
  className = "",
}: HowItWorksProps) {
  const [activeActionIndex, setActiveActionIndex] = useState(-1);

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
      aria-labelledby="how-it-works-heading"
      className={`relative isolate px-4 py-20 sm:px-6 lg:px-8 lg:py-28 ${className}`}
    >
      {/* Backgrounds */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgb(10_184_251/6%),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(148_198_233/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_198_233/0.04)_1px,transparent_1px)] bg-size-[48px_48px]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="text-center">
          {eyebrow && (
            <motion.p
              {...fadeUpInView(0)}
              className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary"
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h2
            id="how-it-works-heading"
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

        {/* ── Row 1: Flow steps ── */}
        <motion.div {...fadeUpInView(0.1)}>
          <FlowStepsRow steps={flowSteps} isRtl={isRtl} />
        </motion.div>

        {/* ── Divider arrow ── */}
        <motion.div {...fadeUpInView(0.12)} className="flex justify-center">
          <div className="flex size-8 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground shadow-sm">
            <ArrowDown className="size-4" />
          </div>
        </motion.div>

        {/* ── Row 2: Pipeline visualizer (full width) ── */}
        <motion.div {...fadeUpInView(0.14)}>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Live Pipeline
          </p>
          <PipelineVisualizer activeActionIndex={activeActionIndex} />
        </motion.div>

        {/* ── Divider arrow ── */}
        <motion.div {...fadeUpInView(0.15)} className="flex justify-center">
          <div className="flex size-8 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground shadow-sm">
            <ArrowDown className="size-4" />
          </div>
        </motion.div>

        {/* ── Row 3: Interactive sandbox (full width) ── */}
        <motion.div {...fadeUpInView(0.17)}>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Interactive Demo
          </p>
          <InteractiveSandbox
            tasks={tasks}
            sandboxTitle={sandboxTitle}
            sandboxDescription={sandboxDescription}
            runLabel={runLabel}
            resetLabel={resetLabel}
            thinkingLabel={thinkingLabel}
            doneLabel={doneLabel}
            isRtl={isRtl}
            onActionChange={setActiveActionIndex}
          />
        </motion.div>
      </div>
    </section>
  );
}
