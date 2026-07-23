"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, ArrowRight, AlertCircle, Inbox } from "lucide-react";
import { Link } from "@/i18n/routing";
import { fetchDashboardBookings } from "@/lib/automex/dashboard";
import type { DashboardBooking } from "@/lib/automex/types";

export default function DashboardBookingsPage() {
  const [bookings, setBookings] = useState<DashboardBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardBookings()
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Manage your consultation bookings.
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-[14px] text-muted-foreground py-12 justify-center">
          <Clock className="size-4 animate-spin" /> Loading bookings...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-[14px] text-red-400">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Inbox className="size-12 text-muted-foreground/30" />
          <p className="text-[14px] text-muted-foreground">No bookings yet.</p>
          <Link
            href="/crm/book-a-call"
            className="text-[13px] font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            Book a call <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl border border-border/50 bg-card/70 backdrop-blur-sm p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Calendar className="size-5 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-foreground truncate">
                    {booking.meeting_type_display || "Consultation"}
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    {booking.scheduled_date
                      ? `${new Date(booking.scheduled_date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })} ${booking.scheduled_time || ""}`
                      : ""}
                    {" · "}
                    {booking.status_display}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
