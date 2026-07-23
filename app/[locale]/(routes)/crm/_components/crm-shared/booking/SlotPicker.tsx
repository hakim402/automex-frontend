"use client";

import { Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AvailableSlot } from "@/lib/automex/types";

interface Props {
  slots: AvailableSlot[];
  selectedSlotId?: string;
  onSelect: (slot: AvailableSlot) => void;
  emptyLabel: string;
  spotsLabel?: string;
}

export function SlotPicker({ slots, selectedSlotId, onSelect, emptyLabel, spotsLabel = "spots left" }: Props) {
  if (slots.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 py-10 px-4 text-center">
        <Clock className="size-8 text-muted-foreground/40 mx-auto mb-3" aria-hidden="true" />
        <p className="text-[13px] text-muted-foreground">{emptyLabel}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {slots.map((slot) => {
        const full = slot.remaining_capacity <= 0;
        const selected = slot.id === selectedSlotId;
        const lowAvailability = !full && slot.remaining_capacity <= 2;
        return (
          <button
            key={slot.id}
            type="button"
            disabled={full}
            onClick={() => onSelect(slot)}
            className={cn(
              "group relative flex flex-col items-center rounded-xl border px-3 py-3 text-[13px] font-semibold transition-all duration-200",
              full && "cursor-not-allowed border-border/30 text-muted-foreground/40 bg-muted/20",
              !full && selected && "border-primary bg-primary/10 text-primary shadow-[0_0_0_1px_var(--primary)]",
              !full && !selected && "border-border/60 bg-card hover:border-primary/40 hover:shadow-sm hover:-translate-y-0.5"
            )}
          >
            <span className={cn(full && "line-through")}>
              {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
            </span>
            {lowAvailability && (
              <span className="mt-1 flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                <Users className="size-2.5" aria-hidden="true" />
                {slot.remaining_capacity} {spotsLabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}