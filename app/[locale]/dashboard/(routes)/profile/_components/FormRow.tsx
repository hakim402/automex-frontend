/**
 * FormRow.tsx — Labelled field wrapper with inline error
 * Shared between profile and security forms.
 */
"use client";

import { cn } from "@/lib/utils";

interface FormRowProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FormRow({
  id,
  label,
  error,
  required,
  className,
  children,
}: FormRowProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={id}
        className="text-[13px] font-medium text-foreground"
      >
        {label}
        {required && (
          <span className="text-destructive ms-0.5" aria-hidden="true">*</span>
        )}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-[12px] text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}