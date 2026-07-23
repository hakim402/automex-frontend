"use client";

import { cn } from "@/lib/utils";

interface CrmFormFieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export function CrmFormField({ id, label, error, required, hint, className, children }: CrmFormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[13px] font-semibold text-foreground/90">
        {label}
        {required && (
          <span className="text-[11px] text-primary ms-1 font-normal" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[11px] text-muted-foreground/70">{hint}</p>
      )}
      {error && (
        <p role="alert" className="text-[12px] text-destructive flex items-center gap-1.5">
          <svg className="size-3 shrink-0" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M6 3.5v3M6 8v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}