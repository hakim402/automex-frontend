import { FileText, Zap, Bot, RefreshCw, CloudCog } from "lucide-react";

export type HeroStat = { metric: string; label: string };

export type HeroVisualContent = {
  inputGhostTop: string;
  inputActiveLead: string;
  inputActiveBold: string;
  inputGhostBottom: string;
  coreTitle: string;
  coreSubtitle: string;
  stats: HeroStat[];
};

const STAT_ICONS = [Bot, RefreshCw, CloudCog];

function HeroVisual({ content }: { content: HeroVisualContent }) {
  const stats = content.stats.slice(0, 3);

  return (
    <div
      className="relative mx-auto flex h-65 w-full max-w-235 scale-[0.56] items-center justify-center sm:h-75 sm:scale-[0.78] lg:h-82.5 lg:scale-100"
      aria-hidden="true"
    >
      {/* straight animated flow line — sits behind the circle (z-[1] vs circle's z-[3]) so it reads as passing through */}
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 940 330"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="automex-flow-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0ab8fb" stopOpacity="0" />
            <stop offset="15%" stopColor="#0ab8fb" stopOpacity="0.6" />
            <stop offset="85%" stopColor="#324b9d" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#324b9d" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M 130 165 L 810 165"
          fill="none"
          stroke="url(#automex-flow-grad)"
          strokeWidth={1.6}
          strokeLinecap="round"
        />
        <path
          d="M 130 165 L 810 165"
          fill="none"
          stroke="#0ab8fb"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeDasharray="6 14"
          opacity={0.9}
          className="animate-[automex-flow_1.8s_linear_infinite] motion-reduce:animate-none"
        />
      </svg>

      {/* left: input suggestion mock */}
      <div className="absolute left-[-6%] top-1/2 z-2 flex w-62.5 -translate-y-1/2 flex-col items-start gap-2.5">
        <p className="truncate pl-5 text-xs text-muted-foreground/70">
          {content.inputGhostTop}
        </p>
        <div className="flex w-full items-center gap-2.5 rounded-full border border-border bg-card px-3.5 py-2 shadow-[0_16px_30px_-16px_rgba(12,27,51,0.24)]">
          <span className="flex size-5.5 shrink-0 items-center justify-center rounded-full bg-color">
            <Zap
              className="size-2.5 text-white"
              fill="currentColor"
              strokeWidth={0}
            />
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {content.inputActiveLead}{" "}
            <b className="font-semibold text-foreground">
              {content.inputActiveBold}
            </b>
          </span>
        </div>
        <p className="truncate pl-5 text-xs text-muted-foreground/70">
          {content.inputGhostBottom}
        </p>
      </div>

      {/* center: flat bordered circle, light center, wave pulses, document icon */}
      <div className="relative z-3 h-62.5 w-62.5">
        <div className="absolute -inset-2.5 rounded-full border border-border" />

        {/* wave rings */}
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{ animationDelay: `${i * 0.9}s` }}
            className="absolute inset-0 rounded-full border border-primary/25 animate-[automex-wave_2.7s_ease-out_infinite] motion-reduce:animate-none"
          />
        ))}

        <div
          className="absolute inset-0 rounded-full border-2 border-primary shadow-[0_20px_44px_-20px_rgba(36,94,169,0.28)]"
          style={{
            background:
              "radial-gradient(circle at 50% 42%, #ffffff 0%, var(--accent) 78%, var(--secondary) 100%)",
          }}
        />
        <div className="absolute inset-5.5 rounded-full border border-primary/20" />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 text-center">
          <div className="flex size-13 items-center justify-center rounded-2xl border border-border bg-background shadow-[0_10px_22px_-10px_rgba(36,94,169,0.35)]">
            <FileText className="size-6 text-primary" strokeWidth={2} />
          </div>
          <div className="text-sm font-bold text-foreground">
            {content.coreTitle}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {content.coreSubtitle}
          </div>
        </div>
      </div>

      {/* right: staggered proof cards */}
      <div className="absolute right-[-8%] top-1/2 z-2 h-52.5 w-62.5 -translate-y-1/2">
        {stats.map((stat, i) => {
          const Icon = STAT_ICONS[i % STAT_ICONS.length];
          const isFocal = i === 1;
          return (
            <div
              key={i}
              className={`absolute right-0 flex flex-col gap-1 rounded-2xl border border-border bg-card px-3.5 py-2.5 shadow-[0_16px_32px_-16px_rgba(12,27,51,0.22)] ${
                isFocal ? "z-4 w-49.5 opacity-100" : "w-43 scale-90 opacity-50"
              }`}
              style={{
                top: `${i * 78 - (isFocal ? 6 : 0)}px`,
                right: isFocal ? "-6px" : "34px",
              }}
            >
              <div className="text-[13px] font-bold text-foreground">
                {stat.metric}
              </div>
              <div className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
                <span className="flex size-3.5 items-center justify-center rounded-lg bg-accent">
                  <Icon className="size-2 text-primary" strokeWidth={3} />
                </span>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes automex-flow {
          to {
            stroke-dashoffset: -40;
          }
        }
        @keyframes automex-wave {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1.7);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default HeroVisual;
