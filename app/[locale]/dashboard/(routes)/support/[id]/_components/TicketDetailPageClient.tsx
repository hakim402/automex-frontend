"use client";

// app/[locale]/dashboard/(routes)/support/[id]/_components/TicketDetailPageClient.tsx

import { useEffect, useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  RefreshCw,
  Send,
  CircleDot,
  User,
  ShieldCheck,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  fetchDashboardTicketDetail,
  sendDashboardTicketMessage,
} from "@/lib/automex/dashboard";
import type { DashboardTicket, SupportTicketMessage } from "@/lib/automex/types";

// ─── Animation variants ─────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease, delay },
});

// ─── Status badge colors ────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-500/10 text-blue-500",
  in_progress: "bg-cyan-500/10 text-cyan-500",
  waiting_customer: "bg-amber-500/10 text-amber-500",
  waiting_admin: "bg-purple-500/10 text-purple-500",
  resolved: "bg-emerald-500/10 text-emerald-500",
  closed: "bg-gray-500/10 text-gray-500",
};

// ─── Message Bubble Component ───────────────────────────────────────────────

interface MessageBubbleProps {
  message: SupportTicketMessage;
  locale: string;
}

function MessageBubble({ message, locale }: MessageBubbleProps) {
  const isStaff = message.author_is_staff;

  return (
    <div
      className={cn(
        "flex gap-3",
        isStaff ? "flex-row" : "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex size-8 items-center justify-center rounded-full shrink-0",
          isStaff ? "bg-primary/10" : "bg-muted"
        )}
      >
        {isStaff ? (
          <ShieldCheck className="size-4 text-primary" />
        ) : (
          <User className="size-4 text-muted-foreground" />
        )}
      </div>

      {/* Message content */}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3",
          isStaff
            ? "bg-muted/50 rounded-tl-sm"
            : "bg-primary/10 rounded-tr-sm"
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-medium text-foreground">
            {message.author_display || message.author_name}
          </span>
          {isStaff && (
            <span className="text-[10px] text-primary font-medium">
              Staff
            </span>
          )}
        </div>
        <p className="text-[13px] text-foreground whitespace-pre-wrap">
          {message.body}
        </p>
        <p className="text-[10px] text-muted-foreground mt-1.5">
          {new Date(message.created_at).toLocaleString(locale, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
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
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="size-8 rounded-full bg-muted-foreground/10 animate-pulse" />
            <div className="flex-1 max-w-[75%] rounded-2xl bg-muted/30 p-4 space-y-2">
              <div className="h-3 w-20 bg-muted-foreground/10 rounded animate-pulse" />
              <div className="h-4 w-full bg-muted-foreground/10 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page Client ───────────────────────────────────────────────────────

export function TicketDetailPageClient() {
  const t = useTranslations("TicketDetail");
  const locale = useLocale();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [ticket, setTicket] = useState<DashboardTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reply form
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load data
  const loadTicket = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardTicketDetail(id);
      setTicket(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ticket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (ticket?.messages) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [ticket?.messages]);

  // Send reply
  const handleSendReply = async () => {
    if (!reply.trim() || sending) return;

    setSending(true);
    try {
      await sendDashboardTicketMessage(id, reply.trim());
      setReply("");
      // Reload to see new message
      await loadTicket();
    } catch (err) {
      console.error("Failed to send reply:", err);
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

  if (error || !ticket) {
    return (
      <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <AlertCircle className="size-8 text-red-400" />
          <p className="text-[14px] text-red-400">{error || "Ticket not found"}</p>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              {t("goBack")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadTicket}
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

  const statusColor = STATUS_COLORS[ticket.status] || "bg-gray-500/10 text-gray-500";
  const isClosed = ticket.status === "closed" || ticket.status === "resolved";

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Back button + header */}
      <motion.div {...fadeUp(0)} className="flex items-center gap-3">
        <Link href="/dashboard/support">
          <Button variant="ghost" size="icon" className="size-8">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">{ticket.title}</h1>
          <p className="text-[12px] text-muted-foreground">
            {t("ticketId")}: {ticket.id.slice(0, 8)}...
          </p>
        </div>
      </motion.div>

      {/* Ticket info card */}
      <motion.div
        {...fadeUp(0.1)}
        className="rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-4"
      >
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium",
              statusColor
            )}
          >
            {ticket.status_display}
          </span>
          <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-[12px] text-muted-foreground">
            {ticket.ticket_type_display}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-[12px] text-muted-foreground">
            <CircleDot className="size-3" />
            {ticket.priority_display}
          </span>
        </div>

        {ticket.description && (
          <p className="text-[13px] text-foreground whitespace-pre-wrap">
            {ticket.description}
          </p>
        )}

        {ticket.resolution_summary && (
          <div className="mt-3 pt-3 border-t border-border/30">
            <p className="text-[11px] text-muted-foreground mb-1">
              {t("resolutionSummary")}
            </p>
            <p className="text-[13px] text-foreground">
              {ticket.resolution_summary}
            </p>
          </div>
        )}
      </motion.div>

      {/* Messages thread */}
      <motion.div {...fadeUp(0.2)} className="space-y-4">
        <h2 className="text-[14px] font-semibold text-foreground">
          {t("conversation")} ({ticket.messages?.length || 0})
        </h2>

        {ticket.messages && ticket.messages.length > 0 ? (
          <div className="space-y-4">
            {ticket.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} locale={locale} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <p className="text-[13px] text-muted-foreground text-center py-8">
            {t("noMessages")}
          </p>
        )}
      </motion.div>

      {/* Reply form */}
      {!isClosed ? (
        <motion.div {...fadeUp(0.3)} className="space-y-3">
          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder={t("replyPlaceholder")}
            className="min-h-[100px] resize-none"
            disabled={sending}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSendReply}
              disabled={!reply.trim() || sending}
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
                  {t("sendReply")}
                </>
              )}
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="rounded-xl bg-muted/30 border border-border/30 p-4 text-center">
          <p className="text-[13px] text-muted-foreground">
            {t("ticketClosed")}
          </p>
        </div>
      )}
    </div>
  );
}
