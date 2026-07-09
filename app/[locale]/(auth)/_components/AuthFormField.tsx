"use client";

// app/[locale]/(auth)/_components/AuthFormField.tsx

import { cn } from "@/lib/utils";

interface AuthFormFieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function AuthFormField({
  id,
  label,
  error,
  required,
  className,
  children,
}: AuthFormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[13px] font-medium text-foreground">
        {label}
        {required && (
          <span className="text-destructive ms-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p
          role="alert"
          className="text-[12px] text-destructive flex items-center gap-1"
        >
          {error}
        </p>
      )}
    </div>
  );
}
