"use client";

// app/[locale]/(routes)/crm/book-a-call/_components/BookCallClientPage.tsx
//
// Submit is handled by hand, not via useCrmFormSubmit — a slot-taken race
// condition surfaces as a DRF error on "slot", which isn't a registered
// field on the step-2 details form. Intercepting it explicitly and
// bouncing back to step 1 is the correct UX for that specific case.

import { useState, useEffect, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SupportedLocale } from "@/lib/locale";
import type { AvailableSlot } from "@/lib/automex/types";

import { CrmFormField } from "../../_components/crm-shared/CrmFormField";
import { DatePicker } from "../../_components/crm-shared/booking/DatePicker";
import { SlotPicker } from "../../_components/crm-shared/booking/SlotPicker";
import { leadContactFields, MEETING_TYPE_VALUES } from "../../_components/crm-shared/schemas";

import { fetchAvailabilityAction, submitConsultationBookingAction } from "../../actions";

const detailsSchema = z.object({
  ...leadContactFields,
  job_title: z.string().optional(),
  message: z.string().optional(),
  meeting_type: z.enum(MEETING_TYPE_VALUES),
  notes: z.string().optional(),
});
type DetailsValues = z.infer<typeof detailsSchema>;

interface BookCallClientPageProps {
  defaultServiceInterest?: string;
}

export function BookCallClientPage({ defaultServiceInterest }: BookCallClientPageProps) {
  const t = useTranslations("CrmForms.booking");
  const tShared = useTranslations("CrmForms.shared");
  const tPage = useTranslations("CrmPages.booking");
  const locale = useLocale() as SupportedLocale;

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [isLoadingSlots, startAvailabilityTransition] = useTransition();
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [step, setStep] = useState<"slot" | "details" | "done">("slot");

  function loadSlots(forDate: string) {
    startAvailabilityTransition(async () => {
      const result = await fetchAvailabilityAction(forDate);
      if (result.success) {
        setSlots(result.data);
      } else {
        setSlots([]);
        toast.error(result.message);
      }
    });
  }

  useEffect(() => {
    setSelectedSlot(null);
    loadSlots(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<DetailsValues>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { meeting_type: "video" },
  });

  function onSubmitDetails(values: DetailsValues) {
    if (!selectedSlot) return;

    startSubmitTransition(async () => {
      const result = await submitConsultationBookingAction(
        {
          full_name: values.full_name,
          email: values.email,
          phone: values.phone || undefined,
          company: values.company || undefined,
          job_title: values.job_title || undefined,
          message: values.message || undefined,
          service_interest: defaultServiceInterest || null,
          budget_range: "not_specified",
          slot: selectedSlot.id,
          scheduled_date: date,
          scheduled_time: selectedSlot.start_time,
          meeting_type: values.meeting_type,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          notes: values.notes || undefined,
        },
        locale
      );

      if (result.success) {
        setStep("done");
        return;
      }
      if (result.fieldErrors?.slot) {
        toast.error(t("slotTaken"));
        setSelectedSlot(null);
        setStep("slot");
        loadSlots(date);
        return;
      }
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (field in detailsSchema.shape) {
            setError(field as keyof DetailsValues, { message: messages[0] });
          }
        }
      }
      toast.error(result.message);
    });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24">

      <div className="text-center mb-10">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-primary mb-2">{tPage("hero.eyebrow")}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{tPage("hero.title")}</h1>
        <p className="text-[14px] text-muted-foreground max-w-xl mx-auto">{tPage("hero.description")}</p>
      </div>

      {step === "done" && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card/80 p-8 text-center">
          <CheckCircle2 className="size-10 text-emerald-500" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground">{t("successTitle")}</h2>
          <p className="text-[14px] text-muted-foreground">{t("successBody")}</p>
        </div>
      )}

      {step === "slot" && (
        <div className="flex flex-col gap-4">
          <DatePicker value={date} onChange={setDate} label={t("dateLabel")} />
          {isLoadingSlots ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : (
            <SlotPicker slots={slots} selectedSlotId={selectedSlot?.id} onSelect={setSelectedSlot} emptyLabel={t("noSlots")} />
          )}
          <Button type="button" disabled={!selectedSlot} onClick={() => setStep("details")} className="w-full sm:w-auto">
            {t("continue")}
          </Button>
        </div>
      )}

      {step === "details" && (
        <form onSubmit={handleSubmit(onSubmitDetails)} className="flex flex-col gap-4" noValidate>
          <button
            type="button"
            onClick={() => setStep("slot")}
            className="flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground self-start"
          >
            <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden="true" />
            {t("backToSlots")}
          </button>

          {selectedSlot && (
            <p className="text-[13px] text-foreground bg-muted/50 rounded-lg px-3 py-2">
              {t("selectedSlotLabel")}: <strong>{date} · {selectedSlot.start_time.slice(0, 5)}–{selectedSlot.end_time.slice(0, 5)}</strong>
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CrmFormField id="full_name" label={t("fullNameLabel")} required error={errors.full_name?.message}>
              <Input id="full_name" {...register("full_name")} />
            </CrmFormField>
            <CrmFormField id="email" label={t("emailLabel")} required error={errors.email?.message}>
              <Input id="email" type="email" {...register("email")} />
            </CrmFormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CrmFormField id="phone" label={t("phoneLabel")} error={errors.phone?.message}>
              <Input id="phone" type="tel" {...register("phone")} />
            </CrmFormField>
            <CrmFormField id="company" label={t("companyLabel")} error={errors.company?.message}>
              <Input id="company" {...register("company")} />
            </CrmFormField>
          </div>

          <CrmFormField id="meeting_type" label={t("meetingTypeLabel")} required error={errors.meeting_type?.message}>
            <Controller
              name="meeting_type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="meeting_type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEETING_TYPE_VALUES.map((v) => (
                      <SelectItem key={v} value={v}>
                        {tShared(`meetingTypeOptions.${v}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </CrmFormField>

          <CrmFormField id="notes" label={t("notesLabel")} error={errors.notes?.message}>
            <Textarea id="notes" rows={3} {...register("notes")} />
          </CrmFormField>

          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> {t("submitting")}
              </>
            ) : (
              t("submit")
            )}
          </Button>
        </form>
      )}
    </div>
  );
}