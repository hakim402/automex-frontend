"use client";

import { useEffect, useState } from "react";
import { FileText, Clock, ArrowRight, AlertCircle, Inbox } from "lucide-react";
import { Link } from "@/i18n/routing";
import { fetchDashboardLeads } from "@/lib/automex/dashboard";
import type { DashboardLead } from "@/lib/automex/types";

export default function DashboardRequestsPage() {
  const [leads, setLeads] = useState<DashboardLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardLeads()
      .then(setLeads)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Requests</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Track your service requests and quote inquiries.
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-[14px] text-muted-foreground py-12 justify-center">
          <Clock className="size-4 animate-spin" /> Loading requests...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-[14px] text-red-400">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {!loading && !error && leads.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Inbox className="size-12 text-muted-foreground/30" />
          <p className="text-[14px] text-muted-foreground">No requests yet.</p>
          <Link
            href="/crm/quote"
            className="text-[13px] font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            Submit a request <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}

      {!loading && leads.length > 0 && (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-xl border border-border/50 bg-card/70 backdrop-blur-sm p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="size-5 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-foreground truncate">
                    {lead.lead_type_display || lead.message?.slice(0, 60) || "Request"}
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : ""}
                    {" · "}
                    {lead.status_display}
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-muted-foreground shrink-0">
                {lead.lead_type_display}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
