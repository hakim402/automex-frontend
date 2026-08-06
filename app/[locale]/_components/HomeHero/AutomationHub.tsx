import { memo } from "react";
import { Zap, Workflow } from "lucide-react";

type AutomationHubProps = {
  /** Short status label under the hub — reuse a translated string so no new key is required */
  label: string;
};

function AutomationHub({ label }: AutomationHubProps) {
  return (
    <div className="relative z-2 mx-auto mt-14 flex flex-col items-center">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-color shadow-brand">
        <span
          aria-hidden="true"
          className="absolute -inset-2.5 rounded-full border border-primary/25 animate-[automex-pulse_2.8s_ease-out_infinite] motion-reduce:animate-none"
        />
        <Zap
          className="size-6 text-white"
          fill="currentColor"
          strokeWidth={0}
        />
      </div>

      <div className="h-5.5 w-px bg-border" aria-hidden="true" />

      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3.5 py-2.5 shadow-[0_12px_26px_-12px_rgba(12,27,51,0.2)]">
        <Workflow className="size-4 text-primary" strokeWidth={2} />
        <span className="text-xs font-medium text-foreground">{label}</span>
      </div>

      <style jsx>{`
        @keyframes automex-pulse {
          0% {
            transform: scale(1);
            opacity: 0.9;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default memo(AutomationHub);
