"use client";

// app/[locale]/dashboard/(routes)/requests/[id]/_components/RequestDetailPageClient.tsx

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Mail,
  Building2,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  Send,
  FileText,
  Calendar,
  History,
  Ticket,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  fetchDashboardLeadDetail,
  sendDashboardLeadMessage,
} from "@/lib/automex/dashboard";
import type { DashboardLeadWithActivities, LeadActivity } from "@/lib/automex/types";

// ─── Animation variants ─────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease, delay },
});

// ─── Status badge colors ────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-500",
  contacted: "bg-cyan-500/10 text-cyan-500",
  qualified: "bg-indigo-500/10 text-indigo-500",
  proposal_sent: "bg-purple-500/10 text-purple-500",
  negotiation: "bg-amber-500/10 text-amber-500",
  won: "bg-emerald-500/10 text-emerald-500",
  lost: "bg-red-500/10 text-red-500",
  spam: "bg-gray-500/10 text-gray-500",
};

// ─── Info Row Component ─────────────────────────────────────────────────────

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string | null;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 items-center justify-center rounded-lg bg-muted/50 shrink-0">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-[13px] font-medium text-foreground truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

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

export function RequestDetailPageClient() {
  const t = useTranslations("RequestDetail");
  const locale = useLocale();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [lead, setLead] = useState<DashboardLeadWithActivities | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Message form
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  // Load data
  const loadLead = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardLeadDetail(id);
      setLead(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load request");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLead();
  }, [id]);

  // Send message
  const handleSendMessage = async () => {
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      await sendDashboardLeadMessage(id, message.trim());
      setMessage("");
      setMessageSent(true);
      setTimeout(() => setMessageSent(false), 3000);
      // Reload to see updated messages
      await loadLead();
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <AlertCircle className="size-8 text-red-400" />
          <p className="text-[14px] text-red-400">{error || "Request not found"}</p>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              {t("goBack")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadLead}
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

  const statusColor = STATUS_COLORS[lead.status] || "bg-gray-500/10 text-gray-500";

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Back button + header */}
      <motion.div {...fadeUp(0)} className="flex items-center gap-3">
        <Link href="/dashboard/requests">
          <Button variant="ghost" size="icon" className="size-8">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">{t("pageTitle")}</h1>
          <p className="text-[12px] text-muted-foreground">
            {new Date(lead.created_at).toLocaleDateString(locale, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </motion.div>

      {/* Request details card */}
      <motion.div
        {...fadeUp(0.1)}
        className="rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-6 space-y-6"
      >
        {/* Status + Type */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium",
              statusColor
            )}
          >
            {lead.status_display}
          </span>
          <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-[12px] text-muted-foreground">
            {lead.lead_type_display}
          </span>
          {lead.priority && (
            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-[12px] text-amber-500">
              {lead.priority_display}
            </span>
          )}
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow icon={Mail} label={t("labelEmail")} value={lead.email} />
          <InfoRow
            icon={Building2}
            label={t("labelCompany")}
            value={lead.company}
          />
          <InfoRow
            icon={Calendar}
            label={t("labelExpectedClose")}
            value={lead.expected_close_date}
          />
        </div>

        {/* Message */}
        {lead.message && (
          <div className="pt-4 border-t border-border/30">
            <p className="text-[11px] text-muted-foreground mb-2">
              {t("labelMessage")}
            </p>
            <p className="text-[14px] text-foreground whitespace-pre-wrap">
              {lead.message}
            </p>
          </div>
        )}

        {/* Activities timeline */}
        {lead.activities && lead.activities.length > 0 && (
          <div className="pt-4 border-t border-border/30">
            <p className="text-[11px] text-muted-foreground mb-3 flex items-center gap-2">
              <History className="size-3.5" />
              {t("activityTimeline")}
            </p>
            <div className="space-y-3">
              {lead.activities.map((activity: LeadActivity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex size-6 items-center justify-center rounded-full bg-muted/50 shrink-0 mt-0.5">
                    <Clock className="size-3 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-foreground">
                        {activity.action}
                      </span>
                      {activity.actor && (
                        <span className="text-[10px] text-muted-foreground">
                          {t("by")} {activity.actor}
                        </span>
                      )}
                    </div>
                    {activity.description && (
                      <p className="text-[12px] text-muted-foreground mt-0.5">
                        {activity.description}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                      {new Date(activity.created_at).toLocaleString(locale, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quote details if available */}
        {lead.quote_detail && (
          <div className="pt-4 border-t border-border/30">
            <p className="text-[11px] text-muted-foreground mb-3">
              {t("labelQuoteDetails")}
            </p>
            <div className="rounded-xl bg-muted/30 p-4 space-y-2 text-[13px]">
              {lead.quote_detail.project_description && (
                <p>
                  <span className="text-muted-foreground">{t("labelProject")}:</span>{" "}
                  {lead.quote_detail.project_description}
                </p>
              )}
              {lead.quote_detail.estimated_budget_min && (
                <p>
                  <span className="text-muted-foreground">{t("labelBudget")}:</span>{" "}
                  {lead.quote_detail.currency || "USD"}{" "}
                  {lead.quote_detail.estimated_budget_min}
                  {lead.quote_detail.estimated_budget_max &&
                    ` - ${lead.quote_detail.estimated_budget_max}`}
                </p>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Action bar — Create Ticket for this Request */}
      <motion.div {...fadeUp(0.15)}>
        <Link href={`/dashboard/support` as any}>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={(e) => {
              // Store the lead ID for linking — the support page will read it
              if (typeof window !== "undefined") {
                sessionStorage.setItem("ticket_related_lead", lead.id);
              }
            }}
          >
            <Ticket className="size-3.5" />
            {t("createTicketForRequest")}
          </Button>
        </Link>
      </motion.div>

      {/* Message form */}
      <motion.div {...fadeUp(0.2)} className="space-y-3">
        <h2 className="text-[14px] font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="size-4" />
          {t("sendMessage")}
        </h2>

        {messageSent && (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-[13px] text-emerald-500">
            {t("messageSent")}
          </div>
        )}

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("messagePlaceholder")}
          className="min-h-[100px] resize-none"
          disabled={sending}
        />

        <div className="flex justify-end">
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || sending}
            className="gap-2"
          >
            {sending ? (
              <>
                <Clock className="size-3.5 animate-spin" />
                {t("sending")}
              </>
            ) : (
              <>
                <Send className="size-3.5" />
                {t("send")}
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
