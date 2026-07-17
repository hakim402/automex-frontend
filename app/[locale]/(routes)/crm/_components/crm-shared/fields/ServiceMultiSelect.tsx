"use client";

// components/crm-shared/fields/ServiceMultiSelect.tsx
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { CrmFormField } from "../CrmFormField";

interface ServiceOption {
  id: string;
  name: string;
}

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: ServiceOption[];
  error?: string;
}

export function ServiceMultiSelect<T extends FieldValues>({ control, name, label, options, error }: Props<T>) {
  return (
    <CrmFormField id={name} label={label} error={error}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selected: string[] = field.value ?? [];
          function toggle(id: string) {
            field.onChange(selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id]);
          }
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-lg border border-border/60 p-3 max-h-56 overflow-y-auto">
              {options.map((opt) => (
                <label key={opt.id} className="flex items-center gap-2 text-[13px] text-foreground cursor-pointer">
                  <Checkbox checked={selected.includes(opt.id)} onCheckedChange={() => toggle(opt.id)} />
                  {opt.name}
                </label>
              ))}
            </div>
          );
        }}
      />
    </CrmFormField>
  );
}