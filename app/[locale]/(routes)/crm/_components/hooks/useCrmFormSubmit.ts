"use client";

// components/crm-shared/hooks/useCrmFormSubmit.ts
import { useTransition } from "react";
import { toast } from "sonner";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { ActionResult } from "@/lib/automex/action-result";

export function useCrmFormSubmit<TValues extends FieldValues, TData>(
  action: (values: TValues) => Promise<ActionResult<TData>>,
  setError: UseFormSetError<TValues>,
  onSuccess?: (data: TData) => void
) {
  const [isPending, startTransition] = useTransition();

  function submit(values: TValues) {
    startTransition(async () => {
      const result = await action(values);
      if (result.success) {
        onSuccess?.(result.data);
        return;
      }
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          setError(field as Path<TValues>, { message: messages[0] });
        }
      }
      toast.error(result.message);
    });
  }

  return { submit, isPending };
}