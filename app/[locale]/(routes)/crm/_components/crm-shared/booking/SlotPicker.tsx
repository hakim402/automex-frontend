"use client";

// components/crm-shared/booking/SlotPicker.tsx
import { cn } from "@/lib/utils";
import type { AvailableSlot } from "@/lib/automex/types";

interface Props {
  slots: AvailableSlot[];
  selectedSlotId?: string;
  onSelect: (slot: AvailableSlot) => void;
  emptyLabel: string;
}

export function SlotPicker({ slots, selectedSlotId, onSelect, emptyLabel }: Props) {
  if (slots.length === 0) {
    return <p className="text-[13px] text-muted-foreground py-4 text-center">{emptyLabel}</p>;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {slots.map((slot) => {
        const full = slot.remaining_capacity <= 0;
        const selected = slot.id === selectedSlotId;
        return (
          <button
            key={slot.id}
            type="button"
            disabled={full}
            onClick={() => onSelect(slot)}
            className={cn(
              "rounded-lg border px-3 py-2 text-[13px] font-medium transition-colors",
              full && "cursor-not-allowed border-border/40 text-muted-foreground/50 line-through",
              !full && selected && "border-primary bg-primary/10 text-primary",
              !full && !selected && "border-border/60 hover:border-primary/50"
            )}
          >
            {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
          </button>
        );
      })}
    </div>
  );
}