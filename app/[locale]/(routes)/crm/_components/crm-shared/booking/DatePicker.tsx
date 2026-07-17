"use client";

// components/crm-shared/booking/DatePicker.tsx
// Native <input type="date"> deliberately — no react-day-picker dependency needed.
import { Input } from "@/components/ui/input";
import { CrmFormField } from "../CrmFormField";

interface Props {
  value: string;
  onChange: (date: string) => void;
  label: string;
}

export function DatePicker({ value, onChange, label }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <CrmFormField id="booking-date" label={label}>
      <Input id="booking-date" type="date" min={today} value={value} onChange={(e) => onChange(e.target.value)} />
    </CrmFormField>
  );
}