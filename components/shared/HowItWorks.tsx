"use client";

// components/shared/HowItWorks.tsx
//
// Reusable "How AI Automation Works" showcase.
// Combines a 4-step visual flow guide + an interactive sandbox
// where users pick a task and watch a simulated AI agent run it step-by-step.
//
// Architecture:
//   ┌─────────────────────────────────────────────────────┐
//   │  Section header (eyebrow + title + description)     │
//   │                                                     │
//   │  Flow Steps (1→2→3→4) with animated connectors     │
//   │                                                     │
//   │  Pipeline Visualizer  │  Interactive Sandbox        │
//   │  (node graph, live    │  (pick task → watch agent   │
//   │   data stream SVG)    │   think → see result)       │
//   └─────────────────────────────────────────────────────┘
//
// Props:
//   - All copy is passed as props (fully i18n-compatible)
//   - Scenarios are passed as data (fully customizable)
//   - isRtl flips all logical layout
//
// Usage:
//   import { HowItWorks } from "@/components/shared/HowItWorks";
//   <HowItWorks {...howItWorksConfig} isRtl={isRtl} />

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Zap,
  Brain,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Play,
  RotateCcw,
  ChevronRight,
  Database,
  Mail,
  Calendar,
  Bell,
  User,
  Building2,
  Tag,
  Clock,
  Sparkles,
  Terminal,
  CircleDot,
  GitBranch,
  MessageSquare,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Constants & animation helpers
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

export interface AgentTask {
  label: string;
  icon: React.ElementType;
  /** Each thought the AI "reasons" through before acting */
  thoughts: string[];
  /** Pipeline actions the agent executes */
  actions: PipelineAction[];
  /** Final result card shown after completion */
  result: {
    summary: string;
    metrics: { label: string; value: string }[];
  };
}

export interface PipelineAction {
  icon: React.ElementType;
  system: string;
  action: string;
  detail: string;
  color: string;
  durationMs: number;
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
// Section 1 — Horizontal flow steps
// ─────────────────────────────────────────────────────────────────────────────

function FlowStepsRow({
  steps,
  isRtl,
}: {
  steps: FlowStep[];
  isRtl: boolean;
}) {
  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="relative grid grid-cols-2 gap-y-8 gap-x-4 sm:grid-cols-4 sm:gap-x-0"
    >
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isLast = i === steps.length - 1;

        return (
          <motion.div
            key={step.title}
            {...fadeUpInView(0.05 + i * 0.1)}
            className="relative flex flex-col items-center text-center px-2"
          >
            {/* Connector line between steps (hidden on last) */}
            {!isLast && (
              <div
                aria-hidden="true"
                className="absolute top-6 start-[calc(50%+2rem)] end-0 hidden h-px sm:block"
                style={{
                  background: `linear-gradient(to ${isRtl ? "left" : "right"}, ${step.color}60, ${steps[i + 1].color}60)`,
                }}
              >
                {/* Animated travel dot */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 size-1.5 rounded-full"
                  style={{ backgroundColor: step.color }}
                  animate={{ left: ["0%", "100%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.5,
                  }}
                />
              </div>
            )}

            {/* Step number badge */}
            <div className="relative mb-4">
              {/* Outer ring pulse */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: `${step.color}20` }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
              />
              <div
                className="relative flex size-14 items-center justify-center rounded-2xl shadow-md"
                style={{
                  backgroundColor: `${step.color}15`,
                  color: step.color,
                  boxShadow: `0 4px 20px ${step.color}25`,
                }}
              >
                <Icon className="size-6" aria-hidden="true" />
              </div>
              {/* Step number */}
              <div
                className="absolute -top-2 -end-2 flex size-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: step.color }}
              >
                {i + 1}
              </div>
            </div>

            <h3 className="text-sm font-bold text-foreground">{step.title}</h3>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {step.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 2 — Pipeline visualizer (left panel)
// SVG node graph with animated data-stream edges
// ─────────────────────────────────────────────────────────────────────────────

const PIPELINE_NODES = [
  { id: "trigger", label: "New Lead", sublabel: "HubSpot CRM", icon: Database, x: 50, y: 30, color: "#0ab8fb" },
  { id: "agent",   label: "AI Agent",  sublabel: "Processing",   icon: Brain,    x: 50, y: 50, color: "#7c3aed" },
  { id: "asana",   label: "Asana",     sublabel: "Task created", icon: CheckCircle2, x: 20, y: 70, color: "#13a89e" },
  { id: "slack",   label: "Slack",     sublabel: "Notified",     icon: MessageSquare, x: 50, y: 70, color: "#f59e0b" },
  { id: "cal",     label: "Calendar",  sublabel: "Scheduled",    icon: Calendar,  x: 80, y: 70, color: "#324b9d" },
];

const PIPELINE_EDGES = [
  { from: "trigger", to: "agent",  color: "#0ab8fb" },
  { from: "agent",   to: "asana",  color: "#13a89e" },
  { from: "agent",   to: "slack",  color: "#f59e0b" },
  { from: "agent",   to: "cal",    color: "#324b9d" },
];

function getNodePos(id: string, w: number, h: number) {
  const n = PIPELINE_NODES.find((n) => n.id === id)!;
  return { x: (n.x / 100) * w, y: (n.y / 100) * h };
}

function PipelineVisualizer({ activeActionIndex }: { activeActionIndex: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const W = 320;
  const H = 260;

  return (
    <div className="relative flex items-center justify-center rounded-2xl border border-border/60 bg-card p-4 shadow-sm overflow-hidden">
      {/* Subtle grid bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(148_198_233/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_198_233/0.05)_1px,transparent_1px)] bg-[size:24px_24px]"
      />

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-xs"
        aria-label="AI pipeline visualization"
      >
        {/* Edge lines */}
        {PIPELINE_EDGES.map((edge, ei) => {
          const from = getNodePos(edge.from, W, H);
          const to = getNodePos(edge.to, W, H);
          const isActive = activeActionIndex >= ei;

          return (
            <g key={`${edge.from}-${edge.to}`}>
              {/* Static ghost */}
              <line
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={edge.color}
                strokeWidth="1"
                strokeOpacity="0.15"
                strokeDasharray="4 4"
              />
              {/* Animated fill */}
              <motion.line
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={edge.color}
                strokeWidth="1.5"
                strokeOpacity={isActive ? 0.8 : 0}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isActive ? 1 : 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              />
              {/* Travel particle */}
              {isActive && (
                <motion.circle
                  r="3"
                  fill={edge.color}
                  filter="url(#glow)"
                  animate={{
                    cx: [from.x, to.x],
                    cy: [from.y, to.y],
                    opacity: [1, 0.2, 1],
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: ei * 0.3 }}
                />
              )}
            </g>
          );
        })}

        {/* Glow filter */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Nodes */}
        {PIPELINE_NODES.map((node, ni) => {
          const Icon = node.icon;
          const isActive = ni === 0 || activeActionIndex >= ni - 1;
          const cx = (node.x / 100) * W;
          const cy = (node.y / 100) * H;

          return (
            <g key={node.id}>
              {/* Outer ring */}
              {isActive && (
                <motion.circle
                  cx={cx} cy={cy} r={22}
                  fill={node.color}
                  fillOpacity={0.1}
                  animate={{ r: [20, 28, 20], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: ni * 0.3 }}
                />
              )}
              {/* Node circle */}
              <motion.circle
                cx={cx} cy={cy} r={18}
                fill={isActive ? node.color : "transparent"}
                stroke={node.color}
                strokeWidth={isActive ? 0 : 1}
                fillOpacity={isActive ? 0.15 : 0.05}
                animate={{ scale: isActive ? [1, 1.05, 1] : 1 } as never}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Label below */}
              <text
                x={cx} y={cy + 30}
                textAnchor="middle"
                className="fill-foreground"
                fontSize="8"
                fontWeight="600"
              >
                {node.label}
              </text>
              <text
                x={cx} y={cy + 39}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize="7"
                opacity="0.7"
              >
                {node.sublabel}
              </text>

              {/* Foreign object for Lucide icon */}
              <foreignObject
                x={cx - 9} y={cy - 9}
                width={18} height={18}
              >
                <div
                  style={{ color: isActive ? node.color : `${node.color}60` }}
                  className="flex size-full items-center justify-center"
                >
                  <Icon size={12} />
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 3 — Interactive sandbox (right panel)
// ─────────────────────────────────────────────────────────────────────────────

type SandboxState = "idle" | "thinking" | "running" | "done";

interface SandboxProps {
  tasks: AgentTask[];
  sandboxTitle: string;
  sandboxDescription: string;
  runLabel: string;
  resetLabel: string;
  thinkingLabel: string;
  doneLabel: string;
  isRtl: boolean;
  onActionChange: (index: number) => void;
}

function ThoughtBubble({ thought, delay }: { thought: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: EASE }}
      className="flex items-start gap-2 text-xs text-muted-foreground"
    >
      <CircleDot className="mt-0.5 size-3 shrink-0 text-primary/60" />
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
      transition={{ delay, duration: 0.4, ease: EASE }}
      className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/60 p-3"
    >
      <div
        className="flex size-8 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${action.color}18`, color: action.color }}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-foreground truncate">{action.system}</p>
          <ChevronRight className="size-3 text-muted-foreground/40 shrink-0" />
          <p className="text-xs text-muted-foreground truncate">{action.action}</p>
        </div>
        <p className="mt-0.5 text-[10px] text-muted-foreground/70 truncate">{action.detail}</p>
      </div>
      {isComplete ? (
        <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
      ) : (
        <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
      )}
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
}: SandboxProps) {
  const [selectedTask, setSelectedTask] = useState<AgentTask>(tasks[0]);
  const [state, setState] = useState<SandboxState>("idle");
  const [thoughtIndex, setThoughtIndex] = useState(0);
  const [actionIndex, setActionIndex] = useState(-1);
  const [completedActions, setCompletedActions] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setState("idle");
    setThoughtIndex(0);
    setActionIndex(-1);
    setCompletedActions([]);
    onActionChange(-1);
  }, [clearTimers, onActionChange]);

  // Switch task resets everything
  const handleTaskChange = useCallback(
    (task: AgentTask) => {
      reset();
      setSelectedTask(task);
    },
    [reset]
  );

  const run = useCallback(() => {
    if (state !== "idle") return;
    setState("thinking");
    setThoughtIndex(0);
    setActionIndex(-1);
    setCompletedActions([]);
    onActionChange(-1);

    // Reveal thoughts one by one
    const thoughtDelay = 600;
    selectedTask.thoughts.forEach((_, ti) => {
      timerRef.current = setTimeout(() => {
        setThoughtIndex(ti + 1);
      }, thoughtDelay * (ti + 1));
    });

    // After all thoughts, start pipeline actions
    const actionsStart = thoughtDelay * (selectedTask.thoughts.length + 1);
    setState("thinking");

    timerRef.current = setTimeout(() => {
      setState("running");
      let elapsed = 0;

      selectedTask.actions.forEach((action, ai) => {
        timerRef.current = setTimeout(() => {
          setActionIndex(ai);
          onActionChange(ai);

          timerRef.current = setTimeout(() => {
            setCompletedActions((prev) => [...prev, ai]);
            if (ai === selectedTask.actions.length - 1) {
              timerRef.current = setTimeout(() => setState("done"), 300);
            }
          }, action.durationMs);
        }, elapsed);

        elapsed += action.durationMs + 200;
      });
    }, actionsStart);
  }, [state, selectedTask, onActionChange]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="flex h-full flex-col gap-4 rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="relative border-b border-border/60 px-5 py-4">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-color" />
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Terminal className="size-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{sandboxTitle}</p>
            <p className="text-[11px] text-muted-foreground">{sandboxDescription}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-5 pb-5 flex-1">
        {/* Task selector */}
        <div className="flex flex-wrap gap-2">
          {tasks.map((task) => {
            const Icon = task.icon;
            const active = selectedTask.label === task.label;
            return (
              <button
                key={task.label}
                onClick={() => handleTaskChange(task)}
                className={[
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
                  active
                    ? "bg-color text-white shadow-brand"
                    : "border border-border/60 bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                ].join(" ")}
              >
                <Icon className="size-3.5" />
                {task.label}
              </button>
            );
          })}
        </div>

        {/* Run / Reset button */}
        <div className="flex items-center gap-3">
          <button
            onClick={state === "idle" ? run : reset}
            disabled={state === "thinking" || state === "running"}
            className={[
              "group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200",
              state === "idle"
                ? "bg-color text-white shadow-brand hover:-translate-y-0.5 hover:shadow-lg"
                : state === "done"
                ? "border border-border/60 bg-background text-foreground hover:border-primary/40"
                : "cursor-not-allowed border border-border/60 bg-background text-muted-foreground opacity-60",
            ].join(" ")}
          >
            {state === "idle" && <><Play className="size-3.5" />{runLabel}</>}
            {(state === "thinking" || state === "running") && (
              <><Loader2 className="size-3.5 animate-spin" />{thinkingLabel}</>
            )}
            {state === "done" && <><RotateCcw className="size-3.5" />{resetLabel}</>}
          </button>

          {/* Status badge */}
          <AnimatePresence mode="wait">
            {state === "thinking" && (
              <motion.span
                key="thinking"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-semibold text-violet-600 dark:text-violet-400"
              >
                <Brain className="size-3 animate-pulse" />
                Reasoning…
              </motion.span>
            )}
            {state === "running" && (
              <motion.span
                key="running"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary"
              >
                <Zap className="size-3 animate-pulse" />
                Executing…
              </motion.span>
            )}
            {state === "done" && (
              <motion.span
                key="done"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 className="size-3" />
                {doneLabel}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Output panel */}
        <div className="flex-1 min-h-0 rounded-xl border border-border/50 bg-background/50 p-4 overflow-y-auto">
          <AnimatePresence mode="wait">
            {state === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-3 py-8 text-center"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-accent">
                  <GitBranch className="size-6 text-primary/60" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Select a scenario and press <strong>Run</strong> to watch the agent work.
                </p>
              </motion.div>
            )}

            {(state === "thinking" || state === "running" || state === "done") && (
              <motion.div
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-4"
              >
                {/* AI thoughts */}
                {thoughtIndex > 0 && (
                  <div className="space-y-2">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                      <Brain className="size-3" /> Agent reasoning
                    </p>
                    <div className="space-y-1.5 rounded-lg border border-violet-500/15 bg-violet-500/5 p-3">
                      {selectedTask.thoughts.slice(0, thoughtIndex).map((thought, ti) => (
                        <ThoughtBubble
                          key={ti}
                          thought={thought}
                          delay={ti * 0.1}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Pipeline actions */}
                {actionIndex >= 0 && (
                  <div className="space-y-2">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                      <Zap className="size-3" /> Actions
                    </p>
                    <div className="space-y-2">
                      {selectedTask.actions.slice(0, actionIndex + 1).map((action, ai) => (
                        <ActionRow
                          key={ai}
                          action={action}
                          delay={ai * 0.08}
                          isComplete={completedActions.includes(ai)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Result card */}
                <AnimatePresence>
                  {state === "done" && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="size-4 text-emerald-500" />
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {selectedTask.result.summary}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {selectedTask.result.metrics.map((m) => (
                          <div
                            key={m.label}
                            className="rounded-lg border border-emerald-500/15 bg-background/60 p-2 text-center"
                          >
                            <p className="text-base font-bold text-foreground">{m.value}</p>
                            <p className="text-[10px] text-muted-foreground">{m.label}</p>
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
// Root exported component
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
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgb(10_184_251/6%),transparent)] dark:bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgb(10_184_251/4%),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(148_198_233/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_198_233/0.04)_1px,transparent_1px)] bg-[size:48px_48px]"
      />

      <div className="mx-auto max-w-6xl">
        {/* ── Header ── */}
        <div className="mb-16 text-center">
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

        {/* ── Flow steps row ── */}
        <motion.div {...fadeUpInView(0.1)} className="mb-16">
          <FlowStepsRow steps={flowSteps} isRtl={isRtl} />
        </motion.div>

        {/* ── Pipeline + Sandbox ── */}
        <motion.div
          {...fadeUpInView(0.15)}
          className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-stretch"
        >
          {/* Left: Pipeline visualizer */}
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Live Pipeline
            </p>
            <PipelineVisualizer activeActionIndex={activeActionIndex} />
          </div>

          {/* Right: Interactive sandbox */}
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}