"use client";

import { memo } from "react";

// ─── Lucide fallback icons ──────────────────────────────────────────
import {
  Smartphone,
  ShieldCheck,
  BarChart3,
  Cpu,
} from "lucide-react";

// ─── Real technology logos from your config ──────────────────────
// Make sure these are exported from "@/config/TechStackConfig"
import {
  OpenAILogo,
  AnthropicLogo,
  MakeComLogo,
  ZapierLogo,
  SlackLogo,
  VercelLogo,
  SalesforceLogo,
  PostgreSQLLogo,
  AWSLogo,
} from "@/config/TechStackConfig";

type OrbitalNode = {
  Logo: React.ElementType;
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

// ─── Orbital rings data ────────────────────────────────────────────
const ORBITAL_RINGS: OrbitalRing[] = [
  {
    radius: 88,
    duration: 22,
    clockwise: true,
    nodes: [
      { Logo: OpenAILogo, label: "AI", color: "#10a37f", offset: 0 },
      { Logo: AnthropicLogo, label: "Agents", color: "#c96442", offset: 90 },
      { Logo: MakeComLogo, label: "Automation", color: "#6d00cc", offset: 180 },
      { Logo: SlackLogo, label: "Chatbots", color: "#4a154b", offset: 270 },
    ],
  },
  {
    radius: 154,
    duration: 36,
    clockwise: false,
    nodes: [
      { Logo: VercelLogo, label: "Web", color: "#000000", offset: 30 },
      { Logo: Smartphone, label: "Mobile", color: "#7c3aed", offset: 102 }, // fallback
      { Logo: SalesforceLogo, label: "SaaS", color: "#00a1e0", offset: 174 },
      { Logo: ZapierLogo, label: "APIs", color: "#ff4a00", offset: 246 },
      { Logo: PostgreSQLLogo, label: "DB", color: "#4169e1", offset: 318 },
    ],
  },
  {
    radius: 222,
    duration: 52,
    clockwise: true,
    nodes: [
      { Logo: AWSLogo, label: "Cloud", color: "#ff9900", offset: 15 },
      { Logo: ShieldCheck, label: "Security", color: "#324b9d", offset: 75 }, // fallback
      { Logo: BarChart3, label: "Analytics", color: "#13a89e", offset: 135 }, // fallback
      { Logo: OpenAILogo, label: "GPT", color: "#10a37f", offset: 195 },
      { Logo: Cpu, label: "AI Infra", color: "#7c3aed", offset: 255 }, // fallback
    ],
  },
];

const FLOAT_LABELS_DEFAULT = ["AI Agents", "Web & Mobile", "Cloud & APIs"];

// ─── Ring layer component ──────────────────────────────────────────
function OrbitalRingLayer({ ring, ringIndex }: { ring: OrbitalRing; ringIndex: number }) {
  const size = ring.radius * 2;
  const nodeSize = [40, 44, 48][ringIndex] ?? 44;

  return (
    <div
      className="absolute"
      style={{
        width: size,
        height: size,
        top: "50%",
        left: "50%",
        marginTop: -ring.radius,
        marginLeft: -ring.radius,
        opacity: 0,
        animation: `orbital-fade-in 0.7s ease ${0.35 + ringIndex * 0.18}s forwards`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          animation: `orbital-spin ${ring.duration}s linear infinite`,
          animationDirection: ring.clockwise ? "normal" : "reverse",
        }}
      >
        {ring.nodes.map((node, ni) => {
          const angleRad = ((node.offset - 90) * Math.PI) / 180;
          const x = ring.radius + ring.radius * Math.cos(angleRad) - nodeSize / 2;
          const y = ring.radius + ring.radius * Math.sin(angleRad) - nodeSize / 2;
          const Logo = node.Logo;

          return (
            <div
              key={`${node.label}-${ni}`}
              className="absolute"
              style={{ left: x, top: y, width: nodeSize, height: nodeSize }}
            >
              <div
                className="size-full"
                style={{
                  animation: `orbital-spin ${ring.duration}s linear infinite`,
                  animationDirection: ring.clockwise ? "reverse" : "normal",
                }}
              >
                <div
                  className="flex size-full items-center justify-center rounded-full border shadow-sm transition-transform duration-300 hover:scale-125"
                  style={{
                    borderColor: node.color,
                    background: `radial-gradient(circle at 30% 30%, ${node.color}60, ${node.color}15)`,
                    boxShadow: `0 0 14px ${node.color}28, 0 2px 8px rgb(0 0 0 / 0.12)`,
                  }}
                >
                  <Logo
                    className="size-[44%]"
                    style={{ color: node.color }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────
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
      {/* SVG background layers */}
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

      {/* Orbital ring layers */}
      {ORBITAL_RINGS.map((ring, i) => (
        <OrbitalRingLayer key={i} ring={ring} ringIndex={i} />
      ))}

      {/* Center hub – using your custom logo image */}
      <div
        className="absolute flex items-center justify-center rounded-full bg-muted shadow-brand"
        style={{
          width: 72,
          height: 72,
          top: "50%",
          left: "50%",
          marginTop: -36,
          marginLeft: -36,
          opacity: 0,
          transform: "scale(0) rotate(-180deg)",
          animation: `orbital-center-in 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s forwards`,
        }}
      >
        <img
          src="/logo/icon.png"
          alt="Automex Logo"
          className="size-10 object-contain"
        />
      </div>

      {/* Floating labels */}
      {labels.map((text, i) => (
        <div
          key={text}
          className="absolute whitespace-nowrap rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-[9px] font-semibold text-muted-foreground shadow-sm backdrop-blur-sm"
          style={{
            left: floatPositions[i].left,
            top: floatPositions[i].top,
            opacity: 0,
            transform: "translateY(6px)",
            animation: `orbital-float-in 0.4s ease ${floatPositions[i].delay}s forwards`,
          }}
        >
          {text}
        </div>
      ))}

      {/* CSS keyframes */}
      <style>{`
        @keyframes orbital-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orbital-fade-in {
          0%   { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes orbital-center-in {
          0%   { opacity: 0; transform: scale(0) rotate(-180deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes orbital-float-in {
          0%   { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
});

export default OrbitalSystem;