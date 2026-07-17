"use client";

// components/crm-shared/fields/BudgetTimelineFields.tsx
import { Controller, type Control, type FieldErrors, type FieldValues, type Path } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CrmFormField } from "./crm-shared/CrmFormField";
import { BUDGET_VALUES, TIMELINE_VALUES } from "./crm-shared/schemas";

interface Props<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
}

export function BudgetTimelineFields<T extends FieldValues>({ control, errors }: Props<T>) {
  const t = useTranslations("CrmForms.shared");
  const budgetName = "budget_range" as Path<T>;
  const timelineName = "timeline" as Path<T>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <CrmFormField id="budget_range" label={t("budgetLabel")} error={errors[budgetName]?.message as string | undefined}>
        <Controller
          name={budgetName}
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="budget_range" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_VALUES.map((v) => (
                  <SelectItem key={v} value={v}>
                    {t(`budgetOptions.${v}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </CrmFormField>

      <CrmFormField id="timeline" label={t("timelineLabel")} error={errors[timelineName]?.message as string | undefined}>
        <Controller
          name={timelineName}
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="timeline" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMELINE_VALUES.map((v) => (
                  <SelectItem key={v} value={v}>
                    {t(`timelineOptions.${v}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </CrmFormField>
    </div>
  );
}