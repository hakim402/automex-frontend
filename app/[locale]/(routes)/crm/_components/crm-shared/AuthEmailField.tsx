"use client";

import { Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { CrmFormField } from "./CrmFormField";
import type { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface AuthEmailFieldProps {
  id: string;
  label: string;
  placeholder: string;
  /** react-hook-form register result */
  registration: UseFormRegisterReturn;
  error?: FieldError;
  /** When true, also marks the field as required (guest mode label) */
  required?: boolean;
}

/**
 * Email input that auto-fills and locks for authenticated users.
 *
 * Authenticated: email pre-filled from user.email, input disabled + readOnly,
 *   shows a Lock icon. The value is still registered in react-hook-form
 *   so it submits normally.
 * Guest: normal email input, always required.
 */
export function AuthEmailField({
  id,
  label,
  placeholder,
  registration,
  error,
  required = true,
}: AuthEmailFieldProps) {
  const { user, loading } = useAuth();
  const isAuthenticated = !!user && !loading;

  return (
    <CrmFormField id={id} label={label} required={required && !isAuthenticated} error={error?.message}>
      <div className="relative">
        <Input
          id={id}
          type="email"
          placeholder={placeholder}
          disabled={isAuthenticated}
          readOnly={isAuthenticated}
          className={isAuthenticated ? "pr-9 bg-muted/40 text-muted-foreground cursor-not-allowed" : ""}
          {...registration}
          // Auto-fill for authenticated users
          value={isAuthenticated ? user.email : undefined}
        />
        {isAuthenticated && (
          <Lock
            className="absolute nset-e-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            aria-hidden="true"
          />
        )}
      </div>
    </CrmFormField>
  );
}
