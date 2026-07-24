"use client";

// app/[locale]/dashboard/(routes)/bookings/_components/BookingsPageClient.tsx

import { useEffect, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Filter,
  AlertCircle,
  Inbox,
  ArrowRight,
  ChevronDown,
  RefreshCw,
  Video,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchDashboardBookings } from "@/lib/automex/dashboard";
import type { BookingFilters } from "@/lib/automex/dashboard";
import type { DashboardBooking, ConsultationBookingStatus } from "@/lib/automex/types";

// ─── Animation variants ─────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease, delay },
});

// ─── Types ──────────────────────────────────────────────────────────────────

type BookingStatus = ConsultationBookingStatus;

// ─── Filter options ─────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: BookingStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "rescheduled", label: "Rescheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

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

// ─── Booking Card Component ─────────────────────────────────────────────────

interface BookingCardProps {
  booking: DashboardBooking;
  locale: string;
}

function BookingCard({ booking, locale }: BookingCardProps) {
  const statusColor =
    STATUS_COLORS[booking.status] || "bg-gray-500/10 text-gray-500";
  const MeetingIcon = MEETING_ICONS[booking.meeting_type] || Video;

  const scheduledDate = new Date(
    `${booking.scheduled_date}T${booking.scheduled_time}`
  );

  return (
    <motion.div {...fadeUp(0)}>
      <Link
        href={`/dashboard/bookings/${booking.id}` as any}
        className="group flex items-center justify-between rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-4 transition-all duration-200 hover:border-border hover:shadow-sm"
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Date badge */}
          <div className="flex flex-col items-center justify-center size-14 rounded-xl bg-primary/10 shrink-0">
            <span className="text-[10px] font-medium text-primary/70 uppercase">
              {scheduledDate.toLocaleDateString(locale, { month: "short" })}
            </span>
            <span className="text-[18px] font-bold text-primary leading-none">
              {scheduledDate.getDate()}
            </span>
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-[14px] font-medium text-foreground truncate">
                {booking.meeting_type_display}
              </p>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                  statusColor
                )}
              >
                {booking.status_display}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {scheduledDate.toLocaleTimeString(locale, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="flex items-center gap-1">
                <MeetingIcon className="size-3" />
                {booking.meeting_type_display}
              </span>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          {booking.reschedule_count > 0 && (
            <span className="text-[10px] text-muted-foreground/60 hidden sm:block">
              Rescheduled {booking.reschedule_count}x
            </span>
          )}
          <ArrowRight
            className="size-4 text-muted-foreground/30 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0"
            aria-hidden="true"
          />
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Filters Component ──────────────────────────────────────────────────────

interface FiltersProps {
  statusFilter: BookingStatus | "all";
  onStatusChange: (value: BookingStatus | "all") => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

function BookingFilters({
  statusFilter,
  onStatusChange,
  showFilters,
  onToggleFilters,
}: FiltersProps) {
  const t = useTranslations("Bookings");

  return (
    <div>
      <button
        onClick={onToggleFilters}
        className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <Filter className="size-3.5" />
        {t("filters")}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform",
            showFilters && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-1.5 pt-3">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onStatusChange(opt.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors",
                    statusFilter === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Skeleton Component ─────────────────────────────────────────────────────

function BookingsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/70 p-4"
        >
          <div className="size-14 rounded-xl bg-muted-foreground/10 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-muted-foreground/10 rounded animate-pulse" />
            <div className="h-3 w-24 bg-muted-foreground/10 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page Client ───────────────────────────────────────────────────────

export function BookingsPageClient() {
  const t = useTranslations("Bookings");
  const locale = useLocale();

  const [bookings, setBookings] = useState<DashboardBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  // Build current filters for server-side filtering
  const currentFilters: BookingFilters = { status: statusFilter };

  // Load data
  const loadBookings = useCallback(async (pageNum: number, filters: BookingFilters, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
    }

    try {
      const data = await fetchDashboardBookings(pageNum, filters);
      if (append) {
        setBookings((prev) => [...prev, ...data.results]);
      } else {
        setBookings(data.results);
      }
      setHasMore(data.hasNext);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadBookings(1, currentFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset page and reload when filter changes
  useEffect(() => {
    setPage(1);
    loadBookings(1, currentFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadBookings(nextPage, currentFilters, true);
  };

  // No client-side filtering — server handles it
  const filteredBookings = bookings;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("pageTitle")}</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            {t("pageDescription")}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadBookings(1, currentFilters)}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
          {t("refresh")}
        </Button>
      </div>

      {/* Filters */}
      <BookingFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {/* Loading state */}
      {loading && <BookingsSkeleton />}

      {/* Error state */}
      {error && !loading && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <AlertCircle className="size-8 text-red-400" />
          <p className="text-[14px] text-red-400">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadBookings(1, currentFilters)}
            className="gap-2"
          >
            <RefreshCw className="size-3.5" />
            {t("retry")}
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredBookings.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <Calendar className="size-12 text-muted-foreground/30" />
          <div>
            <p className="text-[14px] font-medium text-foreground">
              {t("emptyTitle")}
            </p>
            <p className="text-[13px] text-muted-foreground mt-1">
              {t("emptyDescription")}
            </p>
          </div>
          <Link href="/crm/book-a-call" className="mt-2">
            <Button variant="outline" size="sm" className="gap-2">
              {t("emptyCta")}
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Results */}
      {!loading && !error && filteredBookings.length > 0 && (
        <div className="space-y-3">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} locale={locale} />
          ))}
        </div>
      )}

      {/* Load more button */}
      {hasMore && !loading && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="gap-2"
          >
            {loadingMore ? (
              <>
                <Clock className="size-3.5 animate-spin" />
                {t("loading")}
              </>
            ) : (
              <>
                <ChevronDown className="size-3.5" />
                {t("loadMore")}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
