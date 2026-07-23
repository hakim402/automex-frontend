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
import {
  Loader2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  PhoneCall,
  Calendar,
  Clock,
  Mail,
  User,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { SupportedLocale } from "@/lib/locale";
import type { AvailableSlot } from "@/lib/automex/types";

import { CrmFormField } from "../../_components/crm-shared/CrmFormField";
import { DatePicker } from "../../_components/crm-shared/booking/DatePicker";
import { SlotPicker } from "../../_components/crm-shared/booking/SlotPicker";
import { leadContactFields, MEETING_TYPE_VALUES } from "../../_components/crm-shared/schemas";

import { fetchAvailabilityAction, submitConsultationBookingAction } from "../../actions";

const detailsSchema = z.object({
  ...leadContactFields,
  industry: z.string().optional(),
  message: z.string().optional(),
  meeting_type: z.enum(MEETING_TYPE_VALUES),
  notes: z.string().optional(),
});
type DetailsValues = z.infer<typeof detailsSchema>;

interface BookCallClientPageProps {
  defaultServiceInterest?: string;
  industryOptions?: { id: string; name: string }[];
}

export function BookCallClientPage({ defaultServiceInterest, industryOptions = [] }: BookCallClientPageProps) {
  const t = useTranslations("CrmForms.booking");
  const tShared = useTranslations("CrmForms.shared");
  const tPage = useTranslations("CrmPages.bookCall");
  const locale = useLocale() as SupportedLocale;

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [isLoadingSlots, startAvailabilityTransition] = useTransition();
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [step, setStep] = useState<"slot" | "details" | "done">("slot");

  function loadSlots(forDate: string) {
    startAvailabilityTransition(async () => {
      const result = await fetchAvailabilityAction(forDate, locale);
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
          industry: values.industry || null,
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
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-[#13a89e]/4 blur-3xl" />
        <div className="absolute top-1/3 -right-40 size-[350px] rounded-full bg-[#0ab8fb]/4 blur-3xl" />
      </div>

      <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
        {/* ─── Header ──────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#13a89e]/20 bg-[#13a89e]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#13a89e] mb-5">
            <PhoneCall className="size-3" aria-hidden="true" />
            {tPage("hero.eyebrow")}
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {tPage("hero.title")}
          </h1>
          <p className="text-[14px] text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {tPage("hero.description")}
          </p>
        </div>

        {/* ─── Step indicator ──────────────────────────────────── */}
        {step !== "done" && (
          <div className="mb-8 flex items-center justify-center gap-3">
            {[
              { num: 1, label: t("stepSlot"), active: step === "slot", done: step === "details" },
              { num: 2, label: t("stepDetails"), active: step === "details" },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full text-[12px] font-bold transition-all",
                      s.active && "bg-brand-gradient text-white shadow-brand",
                      s.done && "bg-emerald-500 text-white",
                      !s.active && !s.done && "bg-muted text-muted-foreground"
                    )}
                  >
                    {s.num}
                  </span>
                  <span
                    className={cn(
                      "text-[13px] font-semibold hidden sm:inline",
                      s.active && "text-foreground",
                      s.done && "text-emerald-600 dark:text-emerald-400",
                      !s.active && !s.done && "text-muted-foreground"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i === 0 && (
                  <div className={cn("h-px w-10 sm:w-16", step === "details" ? "bg-emerald-500/40" : "bg-border")} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* ─── Done ────────────────────────────────────────────── */}
        {step === "done" && (
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-8 sm:p-10 text-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/5 via-transparent to-[#13a89e]/5"
            />

            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/10 mb-5">
              <CheckCircle2 className="size-7 text-emerald-500" aria-hidden="true" />
            </div>

            <h2 className="text-xl font-bold text-foreground mb-2">
              {t("successTitle")}
            </h2>
            <p className="text-[14px] text-muted-foreground max-w-sm mx-auto mb-2 leading-relaxed">
              {t("successBody")}
            </p>
          </div>
        )}

        {/* ─── Step 1: Pick a slot ─────────────────────────────── */}
        {step === "slot" && (
          <div className="rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Calendar className="size-4 text-primary" aria-hidden="true" />
              <h2 className="text-[14px] font-semibold text-foreground">{t("stepSlotTitle")}</h2>
            </div>

            <DatePicker value={date} onChange={setDate} label={t("dateLabel")} />

            {isLoadingSlots ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
              </div>
            ) : (
              <div className="mt-4">
                <SlotPicker
                  slots={slots}
                  selectedSlotId={selectedSlot?.id}
                  onSelect={setSelectedSlot}
                  emptyLabel={t("noSlots")}
                  spotsLabel={t("spotsLeft")}
                />
              </div>
            )}

            <div className="mt-6 border-t border-border/40 pt-5">
              <Button
                type="button"
                disabled={!selectedSlot}
                onClick={() => setStep("details")}
                size="lg"
                className="w-full bg-brand-gradient shadow-brand"
              >
                {t("continue")}
                <ArrowRight className="size-4 ml-1.5 rtl:rotate-180" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}

        {/* ─── Step 2: Your details ────────────────────────────── */}
        {step === "details" && (
          <div className="rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleSubmit(onSubmitDetails)} className="flex flex-col gap-5" noValidate>
              <div className="flex items-center gap-2">
                <User className="size-4 text-primary" aria-hidden="true" />
                <h2 className="text-[14px] font-semibold text-foreground">{t("stepDetailsTitle")}</h2>
              </div>

              {/* Back button */}
              <button
                type="button"
                onClick={() => setStep("slot")}
                className="flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground self-start transition-colors"
              >
                <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden="true" />
                {t("backToSlots")}
              </button>

              {/* Selected slot info */}
              {selectedSlot && (
                <div className="flex items-center gap-3 rounded-xl border border-[#13a89e]/20 bg-[#13a89e]/5 px-4 py-3">
                  <Clock className="size-4 text-[#13a89e] shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">
                      {date}{" "}
                      <span className="text-primary">
                        {selectedSlot.start_time.slice(0, 5)} – {selectedSlot.end_time.slice(0, 5)}
                      </span>
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{t("selectedSlotLabel")}</p>
                  </div>
                </div>
              )}

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <CrmFormField id="full_name" label={t("fullNameLabel")} required error={errors.full_name?.message}>
                  <Input id="full_name" placeholder={t("fullNamePlaceholder")} {...register("full_name")} />
                </CrmFormField>
                <CrmFormField id="email" label={t("emailLabel")} required error={errors.email?.message}>
                  <Input id="email" type="email" placeholder={t("emailPlaceholder")} {...register("email")} />
                </CrmFormField>
              </div>

              {/* Phone & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <CrmFormField id="phone" label={t("phoneLabel")} error={errors.phone?.message}>
                  <Input id="phone" type="tel" {...register("phone")} />
                </CrmFormField>
                <CrmFormField id="company" label={t("companyLabel")} error={errors.company?.message}>
                  <Input id="company" {...register("company")} />
                </CrmFormField>
              </div>

              {/* Job Title & Industry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <CrmFormField id="job_title" label={t("jobTitleLabel")} error={errors.job_title?.message}>
                  <Input id="job_title" placeholder={t("jobTitlePlaceholder")} {...register("job_title")} />
                </CrmFormField>

                {industryOptions.length > 0 && (
                  <CrmFormField id="industry" label={t("industryLabel")} error={errors.industry?.message}>
                    <Controller
                      name="industry"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="industry" className="w-full">
                            <SelectValue placeholder={tShared("industryPlaceholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            {industryOptions.map((i) => (
                              <SelectItem key={i.id} value={i.id}>
                                {i.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </CrmFormField>
                )}
              </div>

              {/* Meeting Type */}
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

              {/* Message */}
              <CrmFormField id="message" label={t("messageLabel")} error={errors.message?.message}>
                <Textarea id="message" rows={3} placeholder={t("messagePlaceholder")} {...register("message")} />
              </CrmFormField>

              {/* Notes */}
              <CrmFormField id="notes" label={t("notesLabel")} error={errors.notes?.message}>
                <Textarea id="notes" rows={2} placeholder={t("notesPlaceholder")} {...register("notes")} />
              </CrmFormField>

              {/* Divider + Submit */}
              <div className="border-t border-border/40 pt-5">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full bg-brand-gradient shadow-brand"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> {t("submitting")}
                    </>
                  ) : (
                    <>
                      <Send className="size-4" aria-hidden="true" />
                      {t("submit")}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}