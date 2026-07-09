"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Brain,
  Bot,
  Workflow,
  MessageSquare,
  Globe,
  Smartphone,
  Code2,
  Plug,
  Database,
  Cloud,
  ShieldCheck,
  BarChart3,
  Cpu,
  Sparkles,
} from "lucide-react";

type OrbitalNode = {
  Icon: React.ElementType;
  label: string;
  color: string;
  offset: number;
};

type OrbitalRing = {
  radius: number;
  duration: number;
  clockwise: boolean;
  nodes: OrbitalNode[];
};

const ORBITAL_RINGS: OrbitalRing[] = [
  {
    radius: 88,
    duration: 22,
    clockwise: true,
    nodes: [
      { Icon: Brain, label: "AI", color: "#0ab8fb", offset: 0 },
      { Icon: Bot, label: "Agents", color: "#324b9d", offset: 90 },
      { Icon: Workflow, label: "Automation", color: "#0ab8fb", offset: 180 },
      { Icon: MessageSquare, label: "Chatbots", color: "#13a89e", offset: 270 },
    ],
  },
  {
    radius: 154,
    duration: 36,
    clockwise: false,
    nodes: [
      { Icon: Globe, label: "Web", color: "#0ab8fb", offset: 30 },
      { Icon: Smartphone, label: "Mobile", color: "#7c3aed", offset: 102 },
      { Icon: Code2, label: "SaaS", color: "#324b9d", offset: 174 },
      { Icon: Plug, label: "APIs", color: "#f59e0b", offset: 246 },
      { Icon: Database, label: "DB", color: "#13a89e", offset: 318 },
    ],
  },
  {
    radius: 222,
    duration: 52,
    clockwise: true,
    nodes: [
      { Icon: Cloud, label: "Cloud", color: "#0ab8fb", offset: 15 },
      { Icon: ShieldCheck, label: "Security", color: "#324b9d", offset: 75 },
      { Icon: BarChart3, label: "Analytics", color: "#13a89e", offset: 135 },
      { Icon: Zap, label: "Speed", color: "#f59e0b", offset: 195 },
      { Icon: Cpu, label: "AI Infra", color: "#7c3aed", offset: 255 },
      { Icon: Sparkles, label: "GPT", color: "#0ab8fb", offset: 315 },
    ],
  },
];

const FLOAT_LABELS_DEFAULT = ["AI Agents", "Web & Mobile", "Cloud & APIs"];

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

function OrbitalRingLayer({
  ring,
  ringIndex,
}: {
  ring: OrbitalRing;
  ringIndex: number;
}) {
  const size = ring.radius * 2;
  const nodeSize = [40, 44, 48][ringIndex] ?? 44;

  return (
    <motion.div
      className="absolute"
      style={{
        width: size,
        height: size,
        top: "50%",
        left: "50%",
        marginTop: -ring.radius,
        marginLeft: -ring.radius,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.35 + ringIndex * 0.18, duration: 0.7, ease: smoothEase }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: ring.clockwise ? 360 : -360 }}
        transition={{ duration: ring.duration, ease: "linear", repeat: Infinity }}
      >
        {ring.nodes.map((node, ni) => {
          const angleRad = ((node.offset - 90) * Math.PI) / 180;
          const x = ring.radius + ring.radius * Math.cos(angleRad) - nodeSize / 2;
          const y = ring.radius + ring.radius * Math.sin(angleRad) - nodeSize / 2;

          return (
            <div
              key={`${node.label}-${ni}`}
              className="absolute"
              style={{ left: x, top: y, width: nodeSize, height: nodeSize }}
            >
              <motion.div
                className="size-full"
                animate={{ rotate: ring.clockwise ? -360 : 360 }}
                transition={{ duration: ring.duration, ease: "linear", repeat: Infinity }}
              >
                <div
                  className="flex size-full items-center justify-center rounded-full border border-border/60 bg-card shadow-sm transition-transform duration-300 hover:scale-125"
                  style={{
                    boxShadow: `0 0 14px ${node.color}28, 0 2px 8px rgb(0 0 0 / 0.12)`,
                  }}
                >
                  <node.Icon className="size-[44%]" style={{ color: node.color }} />
                </div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

// Memoized to avoid re-renders on parent updates
const OrbitalSystem = memo(function OrbitalSystem({
  floatingLabels = FLOAT_LABELS_DEFAULT,
}: {
  floatingLabels?: string[];
}) {
  const outerRadius = ORBITAL_RINGS[ORBITAL_RINGS.length - 1].radius;
  const pad = 60;
  const containerSize = outerRadius * 2 + pad;
  const cx = containerSize / 2;
  const cy = containerSize / 2;

  // Use provided labels or fallback
  const labels = floatingLabels.length >= 3 ? floatingLabels : FLOAT_LABELS_DEFAULT;

  const floatPositions = [
    { left: "71%", top: "8%", delay: 1.3 },
    { left: "66%", top: "82%", delay: 1.6 },
    { left: "-2%", top: "58%", delay: 1.9 },
  ];

  return (
    <div
      className="relative shrink-0 select-none"
      style={{ width: containerSize, height: containerSize }}
      aria-hidden="true"
    >
      <svg
        className="pointer-events-none absolute inset-0"
        width={containerSize}
        height={containerSize}
        viewBox={`0 0 ${containerSize} ${containerSize}`}
      >
        <defs>
          <radialGradient id="orbitCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0ab8fb" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0ab8fb" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ringStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ab8fb" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#324b9d" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0ab8fb" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        <circle cx={cx} cy={cy} r={100} fill="url(#orbitCenterGlow)" />

        {ORBITAL_RINGS.map((ring, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={ring.radius}
            fill="none"
            stroke="url(#ringStroke)"
            strokeWidth={i === 1 ? "1" : "0.75"}
            strokeDasharray={i === 1 ? "none" : i === 0 ? "3 7" : "5 10"}
            opacity={i === 1 ? 0.4 : 0.28}
          />
        ))}
      </svg>

      {ORBITAL_RINGS.map((ring, i) => (
        <OrbitalRingLayer key={i} ring={ring} ringIndex={i} />
      ))}

      <motion.div
        className="absolute flex items-center justify-center rounded-full bg-color shadow-brand"
        style={{
          width: 72,
          height: 72,
          top: "50%",
          left: "50%",
          marginTop: -36,
          marginLeft: -36,
        }}
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.15, duration: 0.7, type: "spring", bounce: 0.5 }}
      >
        <Zap className="size-8 text-white" />
      </motion.div>

      {labels.map((text, i) => (
        <motion.div
          key={text}
          className="absolute whitespace-nowrap rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-[9px] font-semibold text-muted-foreground shadow-sm backdrop-blur-sm"
          style={{ left: floatPositions[i].left, top: floatPositions[i].top }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: floatPositions[i].delay, duration: 0.4 }}
        >
          {text}
        </motion.div>
      ))}
    </div>
  );
});

export default OrbitalSystem;