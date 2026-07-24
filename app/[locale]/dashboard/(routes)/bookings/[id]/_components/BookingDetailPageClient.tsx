"use client";

// app/[locale]/dashboard/(routes)/bookings/[id]/_components/BookingDetailPageClient.tsx

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  RefreshCw,
  Calendar,
  Video,
  Phone,
  MapPin,
  ExternalLink,
  CalendarClock,
  XCircle,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  fetchDashboardBookingDetail,
  rescheduleDashboardBooking,
  cancelDashboardBooking,
} from "@/lib/automex/dashboard";
import type { DashboardBooking } from "@/lib/automex/types";

// ─── Animation variants ─────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease, delay },
});

// ─── Status badge colors ────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500",
  confirmed: "bg-emerald-500/10 text-emerald-500",
  rescheduled: "bg-blue-500/10 text-blue-500",
  completed: "bg-gray-500/10 text-gray-500",
  cancelled: "bg-red-500/10 text-red-500",
  no_show: "bg-orange-500/10 text-orange-500",
};

// ─── Meeting type icons ─────────────────────────────────────────────────────

const MEETING_ICONS: Record<string, React.ElementType> = {
  video: Video,
  phone: Phone,
  in_person: MapPin,
};

// ─── Skeleton Component ─────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-lg bg-muted-foreground/10 animate-pulse" />
        <div className="h-5 w-32 bg-muted-foreground/10 rounded animate-pulse" />
      </div>
      <div className="rounded-2xl border border-border/50 p-6 space-y-4">
        <div className="h-6 w-48 bg-muted-foreground/10 rounded animate-pulse" />
        <div className="h-4 w-32 bg-muted-foreground/10 rounded animate-pulse" />
        <div className="h-20 w-full bg-muted-foreground/10 rounded animate-pulse" />
      </div>
    </div>
  );
}

// ─── Main Page Client ───────────────────────────────────────────────────────

export function BookingDetailPageClient() {
  const t = useTranslations("BookingDetail");
  const locale = useLocale();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [booking, setBooking] = useState<DashboardBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reschedule dialog
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [rescheduling, setRescheduling] = useState(false);

  // Cancel dialog
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Load data
  const loadBooking = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardBookingDetail(id);
      setBooking(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [id]);

  // Handle reschedule
  const handleReschedule = async () => {
    if (!newDate || !newTime || rescheduling) return;

    setRescheduling(true);
    try {
      const updated = await rescheduleDashboardBooking(id, {
        new_date: newDate,
        new_time: newTime,
        reason: rescheduleReason || undefined,
      });
      setBooking(updated);
      setRescheduleOpen(false);
      setNewDate("");
      setNewTime("");
      setRescheduleReason("");
    } catch (err) {
      console.error("Failed to reschedule:", err);
    } finally {
      setRescheduling(false);
    }
  };

  // Handle cancel
  const handleCancel = async () => {
    if (cancelling) return;

    setCancelling(true);
    try {
      const updated = await cancelDashboardBooking(id);
      setBooking(updated);
      setCancelOpen(false);
    } catch (err) {
      console.error("Failed to cancel:", err);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <AlertCircle className="size-8 text-red-400" />
          <p className="text-[14px] text-red-400">{error || "Booking not found"}</p>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              {t("goBack")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadBooking}
              className="gap-2"
            >
              <RefreshCw className="size-3.5" />
              {t("retry")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusColor = STATUS_COLORS[booking.status] || "bg-gray-500/10 text-gray-500";
  const MeetingIcon = MEETING_ICONS[booking.meeting_type] || Video;
  const scheduledDate = new Date(`${booking.scheduled_date}T${booking.scheduled_time}`);
  const canReschedule =
    booking.status === "pending" ||
    booking.status === "confirmed" ||
    booking.status === "rescheduled";
  const canCancel =
    booking.status === "pending" ||
    booking.status === "confirmed" ||
    booking.status === "rescheduled";

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Back button + header */}
      <motion.div {...fadeUp(0)} className="flex items-center gap-3">
        <Link href="/dashboard/bookings">
          <Button variant="ghost" size="icon" className="size-8">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">{t("pageTitle")}</h1>
          <p className="text-[12px] text-muted-foreground">
            {t("bookingId")}: {id.slice(0, 8)}...
          </p>
        </div>
      </motion.div>

      {/* Booking details card */}
      <motion.div
        {...fadeUp(0.1)}
        className="rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-6 space-y-6"
      >
        {/* Status + Meeting type */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium",
              statusColor
            )}
          >
            {booking.status_display}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-[12px] text-muted-foreground">
            <MeetingIcon className="size-3" />
            {booking.meeting_type_display}
          </span>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted/50 shrink-0">
              <Calendar className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">{t("labelDate")}</p>
              <p className="text-[13px] font-medium text-foreground">
                {scheduledDate.toLocaleDateString(locale, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted/50 shrink-0">
              <Clock className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">{t("labelTime")}</p>
              <p className="text-[13px] font-medium text-foreground">
                {scheduledDate.toLocaleTimeString(locale, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                ({booking.timezone})
              </p>
            </div>
          </div>
        </div>

        {/* Meeting link */}
        {booking.meeting_link && (
          <div className="pt-4 border-t border-border/30">
            <p className="text-[11px] text-muted-foreground mb-2">
              {t("labelMeetingLink")}
            </p>
            <a
              href={booking.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[13px] text-primary hover:underline"
            >
              <ExternalLink className="size-3.5" />
              {t("joinMeeting")}
            </a>
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <div className="pt-4 border-t border-border/30">
            <p className="text-[11px] text-muted-foreground mb-2">{t("labelNotes")}</p>
            <p className="text-[13px] text-foreground whitespace-pre-wrap">
              {booking.notes}
            </p>
          </div>
        )}

        {/* Metadata */}
        <div className="pt-4 border-t border-border/30 grid grid-cols-2 gap-4 text-[12px]">
          {booking.confirmed_at && (
            <div>
              <p className="text-muted-foreground">{t("labelConfirmed")}</p>
              <p className="font-medium text-foreground">
                {new Date(booking.confirmed_at).toLocaleDateString(locale)}
              </p>
            </div>
          )}
          {booking.cancelled_at && (
            <div>
              <p className="text-muted-foreground">{t("labelCancelled")}</p>
              <p className="font-medium text-red-500">
                {new Date(booking.cancelled_at).toLocaleDateString(locale)}
              </p>
            </div>
          )}
          {booking.reschedule_count > 0 && (
            <div>
              <p className="text-muted-foreground">{t("labelRescheduleCount")}</p>
              <p className="font-medium text-foreground">{booking.reschedule_count}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Actions */}
      {canReschedule || canCancel ? (
        <motion.div {...fadeUp(0.2)} className="flex flex-wrap gap-3">
          {canReschedule && (
            <Button
              variant="outline"
              onClick={() => setRescheduleOpen(true)}
              className="gap-2"
            >
              <CalendarClock className="size-4" />
              {t("reschedule")}
            </Button>
          )}
          {canCancel && (
            <Button
              variant="outline"
              onClick={() => setCancelOpen(true)}
              className="gap-2 text-red-500 hover:text-red-500 hover:bg-red-500/10"
            >
              <XCircle className="size-4" />
              {t("cancel")}
            </Button>
          )}
        </motion.div>
      ) : null}

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("rescheduleTitle")}</DialogTitle>
            <DialogDescription>{t("rescheduleDescription")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] font-medium text-foreground mb-1.5 block">
                  {t("labelNewDate")}
                </label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-foreground mb-1.5 block">
                  {t("labelNewTime")}
                </label>
                <Input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium text-foreground mb-1.5 block">
                {t("labelReason")} ({t("optional")})
              </label>
              <Textarea
                value={rescheduleReason}
                onChange={(e) => setRescheduleReason(e.target.value)}
                placeholder={t("reasonPlaceholder")}
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleOpen(false)}>
              {t("dialogCancel")}
            </Button>
            <Button
              onClick={handleReschedule}
              disabled={!newDate || !newTime || rescheduling}
            >
              {rescheduling ? t("rescheduling") : t("confirmReschedule")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("cancelTitle")}</DialogTitle>
            <DialogDescription>{t("cancelDescription")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              {t("dialogCancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? t("cancelling") : t("confirmCancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
