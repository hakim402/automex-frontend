"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import {
  Key,
  Search,
  Loader2,
  ArrowLeft,
  Mail,
  Building2,
  Clock,
  MessageSquare,
  FileText,
  PhoneCall,
  Ticket,
  Send,
  Plus,
  Zap,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { SupportedLocale } from "@/lib/locale";
import type {
  GuestLead,
  GuestLeadDetail,
  GuestTicket,
  GuestTicketMessage,
} from "@/lib/automex/types";

import {
  fetchGuestRequestsAction,
  fetchGuestRequestDetailAction,
  fetchGuestTicketDetailAction,
  createGuestTicketAction,
  sendGuestTicketMessageAction,
} from "../../actions";

// ─── Types ────────────────────────────────────────────────────────────────

type View = "token" | "requests" | "requestDetail" | "ticketDetail" | "createTicket";

interface ActivityItem {
  action?: string;
  description?: string;
  timestamp?: string;
  by?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function parseActivities(raw: string): ActivityItem[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatDateShort(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

const LEAD_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  contact: Mail,
  quote: FileText,
  booking: PhoneCall,
  newsletter: Sparkles,
};

const STATUS_COLORS: Record<string, string> = {
  open: "bg-[#0ab8fb]/10 text-[#0ab8fb] border-[#0ab8fb]/20",
  in_progress: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20",
  closed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  resolved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  pending: "bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/20",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  normal: "bg-[#0ab8fb]/10 text-[#0ab8fb]",
  high: "bg-[#f59e0b]/10 text-[#f59e0b]",
  urgent: "bg-red-500/10 text-red-500",
};

const TICKET_TYPES: { value: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "general_inquiry", icon: MessageSquare },
  { value: "technical_support", icon: Zap },
  { value: "project_request", icon: FileText },
  { value: "bug_report", icon: AlertCircle },
  { value: "feedback", icon: Sparkles },
  { value: "partnership", icon: User },
];

const PRIORITIES = ["low", "normal", "high", "urgent"] as const;

// ─── Component ────────────────────────────────────────────────────────────

interface GuestClientPageProps {
  locale: SupportedLocale;
}

export function GuestClientPage({ locale }: GuestClientPageProps) {
  const t = useTranslations("CrmPages.guest");
  const searchParams = useSearchParams();
  const urlToken = searchParams.get("token") ?? "";

  // ── View state ────────────────────────────────────────────────────────
  const [view, setView] = useState<View>(urlToken ? "requests" : "token");
  const [token, setToken] = useState(urlToken);

  // ── Data state ────────────────────────────────────────────────────────
  const [requests, setRequests] = useState<GuestLead[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<GuestLeadDetail | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<GuestTicket | null>(null);
  const [replyBody, setReplyBody] = useState("");

  // ── Form state ────────────────────────────────────────────────────────
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketType, setTicketType] = useState("general_inquiry");
  const [ticketPriority, setTicketPriority] = useState("normal");
  const [ticketEmail, setTicketEmail] = useState("");

  // ── UI state ──────────────────────────────────────────────────────────
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isPending, startTransition] = useTransition();
  const [tokenLoading, setTokenLoading] = useState(false);

  // ── Auto-load requests if token came from URL ─────────────────────────
  useEffect(() => {
    if (urlToken) {
      loadRequests(urlToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────

  const loadRequests = useCallback(
    async (tkn: string) => {
      if (!tkn.trim()) {
        setError(t("errors.tokenRequired"));
        return;
      }
      setError("");
      setTokenLoading(true);
      const result = await fetchGuestRequestsAction(tkn.trim(), locale);
      setTokenLoading(false);
      if (result.success) {
        setRequests(result.data);
        setToken(tkn.trim());
        setView("requests");
      } else {
        setError(result.message ?? t("errors.invalidToken"));
      }
    },
    [locale, t]
  );

  function handleTokenSubmit(e: React.FormEvent) {
    e.preventDefault();
    loadRequests(token);
  }

  function openRequestDetail(id: string) {
    setError("");
    startTransition(async () => {
      const result = await fetchGuestRequestDetailAction(id, token, locale);
      if (result.success) {
        setSelectedRequest(result.data);
        setView("requestDetail");
      } else {
        setError(result.message ?? t("errors.generic"));
      }
    });
  }

  function openTicketDetail(id: string) {
    setError("");
    startTransition(async () => {
      const result = await fetchGuestTicketDetailAction(id, token, locale);
      if (result.success) {
        setSelectedTicket(result.data);
        setView("ticketDetail");
      } else {
        setError(result.message ?? t("errors.generic"));
      }
    });
  }

  function handleCreateTicket(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    startTransition(async () => {
      const result = await createGuestTicketAction(
        {
          title: ticketTitle,
          description: ticketDescription,
          ticket_type: ticketType as "general_inquiry",
          guest_email: ticketEmail,
          priority: ticketPriority as "normal",
        },
        locale
      );
      if (result.success) {
        setSuccessMsg(t("createTicket.success"));
        setTicketTitle("");
        setTicketDescription("");
        setTicketEmail("");
        setTicketType("general_inquiry");
        setTicketPriority("normal");
        // Open the newly created ticket
        setSelectedTicket(result.data);
        setView("ticketDetail");
      } else {
        setError(result.message ?? t("errors.generic"));
      }
    });
  }

  function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTicket || !replyBody.trim()) return;
    setError("");
    startTransition(async () => {
      const result = await sendGuestTicketMessageAction(
        selectedTicket.id,
        token,
        { body: replyBody.trim() },
        locale
      );
      if (result.success) {
        setReplyBody("");
        // Refresh ticket to show new message
        const refreshed = await fetchGuestTicketDetailAction(
          selectedTicket.id,
          token,
          locale
        );
        if (refreshed.success) {
          setSelectedTicket(refreshed.data);
        }
      } else {
        setError(result.message ?? t("errors.generic"));
      }
    });
  }

  function goBack() {
    setError("");
    setSelectedRequest(null);
    setSelectedTicket(null);
    setView("requests");
  }

  function goToToken() {
    setError("");
    setSelectedRequest(null);
    setSelectedTicket(null);
    setRequests([]);
    setView("token");
  }

  // ── Render helpers ────────────────────────────────────────────────────

  function statusBadge(status: string) {
    const color = STATUS_COLORS[status] ?? STATUS_COLORS.open;
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
          color
        )}
      >
        {t(`statusLabels.${status}`) || status}
      </span>
    );
  }

  function priorityBadge(priority: string) {
    const color = PRIORITY_COLORS[priority] ?? PRIORITY_COLORS.normal;
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
          color
        )}
      >
        {t(`priorityLabels.${priority}`) || priority}
      </span>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <>
      {/* ═══ Hero ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-[#0ab8fb]/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 size-[400px] rounded-full bg-[#324b9d]/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl px-4 pt-20 pb-8 sm:pt-28 sm:pb-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-6">
            <Zap className="size-3" aria-hidden="true" />
            {t("hero.eyebrow")}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            {t("hero.headlineLead")}{" "}
            <span className="text-brand-gradient">{t("hero.headlineAccent")}</span>
          </h1>

          <p className="text-[15px] sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t("hero.description")}
          </p>
        </div>
      </section>

      {/* ═══ Content area ─══════════════════════════════════════════════ */}
      <section className="mx-auto max-w-4xl px-4 pb-24">
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-[13px] text-red-600 dark:text-red-400">
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-[13px] text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
            {successMsg}
          </div>
        )}

        {/* ── Token Input View ─────────────────────────────────────── */}
        {view === "token" && (
          <div className="mx-auto max-w-md">
            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 sm:p-10">
              <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-[#0ab8fb]/10">
                <Key className="size-6 text-[#0ab8fb]" aria-hidden="true" />
              </div>

              <h2 className="text-lg font-bold text-foreground text-center mb-2">
                {t("token.title")}
              </h2>
              <p className="text-[13px] text-muted-foreground text-center mb-6 leading-relaxed">
                {t("token.description")}
              </p>

              <form onSubmit={handleTokenSubmit} className="flex flex-col gap-3">
                <Input
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder={t("token.placeholder")}
                  disabled={tokenLoading}
                  className="h-11 text-sm"
                />
                <Button
                  type="submit"
                  disabled={tokenLoading || !token.trim()}
                  className="bg-brand-gradient shadow-brand"
                >
                  {tokenLoading ? (
                    <Loader2 className="size-4 animate-spin mr-1.5" aria-hidden="true" />
                  ) : (
                    <Search className="size-4 mr-1.5" aria-hidden="true" />
                  )}
                  {t("token.submit")}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* ── Request List View ────────────────────────────────────── */}
        {view === "requests" && (
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToToken}
                  className="text-muted-foreground hover:text-foreground -ml-2"
                >
                  <ArrowLeft className="size-4 mr-1 rtl:rotate-180" aria-hidden="true" />
                  {t("back.toToken")}
                </Button>
              </div>
              <Button
                size="sm"
                onClick={() => setView("createTicket")}
                className="bg-brand-gradient shadow-brand text-xs"
              >
                <Plus className="size-3.5 mr-1.5" aria-hidden="true" />
                {t("createTicket.cta")}
              </Button>
            </div>

            {/* Request list */}
            {tokenLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
              </div>
            ) : requests.length === 0 ? (
              <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-12 text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-muted">
                  <FileText className="size-5 text-muted-foreground" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {t("requests.empty")}
                </h3>
                <p className="text-[13px] text-muted-foreground">
                  {t("requests.emptyHint")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests.map((req) => {
                  const Icon = LEAD_TYPE_ICONS[req.lead_type] ?? FileText;
                  return (
                    <button
                      key={req.id}
                      onClick={() => openRequestDetail(req.id)}
                      className={cn(
                        "group relative flex flex-col gap-3 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-5 text-left transition-all duration-300",
                        "hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-start/5 hover:border-primary/30"
                      )}
                    >
                      {/* Gradient wash on hover */}
                      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0ab8fb]/5 to-[#324b9d]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      <div className="relative z-10 flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-9 items-center justify-center rounded-lg bg-[#0ab8fb]/10">
                            <Icon className="size-4 text-[#0ab8fb]" aria-hidden="true" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground leading-tight">
                              {req.full_name || req.email}
                            </p>
                            {req.company && (
                              <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                                <Building2 className="size-3" aria-hidden="true" />
                                {req.company}
                              </p>
                            )}
                          </div>
                        </div>
                        {statusBadge(req.status)}
                      </div>

                      <div className="relative z-10 flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Clock className="size-3" aria-hidden="true" />
                          {formatDateShort(req.created_at)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary transition-colors group-hover:text-[#0ab8fb]">
                          {t("requests.viewDetail")}
                          <ChevronRight className="size-3.5 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Request Detail View ──────────────────────────────────── */}
        {view === "requestDetail" && selectedRequest && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className="text-muted-foreground hover:text-foreground -ml-2 mb-5"
            >
              <ArrowLeft className="size-4 mr-1 rtl:rotate-180" aria-hidden="true" />
              {t("back.toRequests")}
            </Button>

            {/* Detail card */}
            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 sm:p-8 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  {statusBadge(selectedRequest.status)}
                  <span className="rounded-full border border-border/50 bg-muted/50 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground uppercase">
                    {selectedRequest.lead_type_display}
                  </span>
                </div>
                <span className="text-[12px] text-muted-foreground">
                  {t("request.submitted")}: {formatDate(selectedRequest.created_at)}
                </span>
              </div>

              <h2 className="text-xl font-bold text-foreground mb-1">
                {selectedRequest.full_name}
              </h2>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted-foreground mb-4">
                {selectedRequest.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="size-3.5" aria-hidden="true" />
                    {selectedRequest.email}
                  </span>
                )}
                {selectedRequest.company && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="size-3.5" aria-hidden="true" />
                    {selectedRequest.company}
                  </span>
                )}
              </div>

              {selectedRequest.message && (
                <div className="rounded-xl border border-border/40 bg-muted/30 p-4">
                  <p className="text-[13px] text-foreground/80 whitespace-pre-wrap leading-relaxed">
                    {selectedRequest.message}
                  </p>
                </div>
              )}
            </div>

            {/* Activity timeline */}
            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 sm:p-8">
              <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock className="size-4 text-primary" aria-hidden="true" />
                {t("request.activities")}
              </h3>

              {(() => {
                const activities = parseActivities(selectedRequest.activities);
                if (activities.length === 0) {
                  return (
                    <p className="text-[13px] text-muted-foreground text-center py-6">
                      {t("request.noActivities")}
                    </p>
                  );
                }
                return (
                  <div className="relative pl-6">
                    {/* Timeline line */}
                    <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border/60" />
                    <ul className="space-y-4">
                      {activities.map((act, i) => (
                        <li key={i} className="relative">
                          {/* Dot */}
                          <div className="absolute -left-[22px] top-1.5 size-[9px] rounded-full border-2 border-[#0ab8fb] bg-card" />
                          <p className="text-[13px] text-foreground leading-snug">
                            {act.description || act.action || "—"}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            {act.timestamp && (
                              <span className="text-[11px] text-muted-foreground">
                                {formatDate(act.timestamp)}
                              </span>
                            )}
                            {act.by && (
                              <span className="text-[11px] text-muted-foreground/70">
                                — {act.by}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ── Create Ticket View ───────────────────────────────────── */}
        {view === "createTicket" && (
          <div className="mx-auto max-w-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className="text-muted-foreground hover:text-foreground -ml-2 mb-5"
            >
              <ArrowLeft className="size-4 mr-1 rtl:rotate-180" aria-hidden="true" />
              {t("back.toRequests")}
            </Button>

            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 sm:p-8">
              <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-xl bg-[#13a89e]/10">
                <Plus className="size-5 text-[#13a89e]" aria-hidden="true" />
              </div>

              <h2 className="text-lg font-bold text-foreground text-center mb-1">
                {t("createTicket.formTitle")}
              </h2>
              <p className="text-[13px] text-muted-foreground text-center mb-6">
                {t("createTicket.formDescription")}
              </p>

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-1.5">
                    {t("createTicket.titleLabel")}
                  </label>
                  <Input
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                    placeholder={t("createTicket.titlePlaceholder")}
                    required
                    className="h-10 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-1.5">
                    {t("createTicket.typeLabel")}
                  </label>
                  <Select value={ticketType} onValueChange={setTicketType}>
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TICKET_TYPES.map((type) => {
                        const TI = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <span className="flex items-center gap-2">
                              <TI className="size-3.5" aria-hidden="true" />
                              {t(`ticketTypes.${type.value}`)}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-1.5">
                    {t("createTicket.priorityLabel")}
                  </label>
                  <Select value={ticketPriority} onValueChange={setTicketPriority}>
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {t(`priorityLabels.${p}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-1.5">
                    {t("createTicket.emailLabel")}
                  </label>
                  <Input
                    type="email"
                    value={ticketEmail}
                    onChange={(e) => setTicketEmail(e.target.value)}
                    placeholder={t("createTicket.emailPlaceholder")}
                    required
                    className="h-10 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-1.5">
                    {t("createTicket.descriptionLabel")}
                  </label>
                  <Textarea
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    placeholder={t("createTicket.descriptionPlaceholder")}
                    required
                    className="min-h-[120px] text-sm resize-y"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isPending || !ticketTitle.trim() || !ticketDescription.trim() || !ticketEmail.trim()}
                  className="w-full bg-brand-gradient shadow-brand"
                >
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin mr-1.5" aria-hidden="true" />
                  ) : (
                    <Send className="size-4 mr-1.5" aria-hidden="true" />
                  )}
                  {t("createTicket.submit")}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* ── Ticket Detail View ────────────────────────────────────── */}
        {view === "ticketDetail" && selectedTicket && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className="text-muted-foreground hover:text-foreground -ml-2 mb-5"
            >
              <ArrowLeft className="size-4 mr-1 rtl:rotate-180" aria-hidden="true" />
              {t("back.toRequests")}
            </Button>

            {/* Ticket header */}
            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 sm:p-8 mb-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  {statusBadge(selectedTicket.status)}
                  {priorityBadge(selectedTicket.priority)}
                  <span className="rounded-full border border-border/50 bg-muted/50 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground uppercase">
                    {selectedTicket.ticket_type_display}
                  </span>
                </div>
                <span className="text-[12px] text-muted-foreground">
                  {formatDate(selectedTicket.created_at)}
                </span>
              </div>

              <h2 className="text-xl font-bold text-foreground mb-2">
                {selectedTicket.title}
              </h2>
              {selectedTicket.description && (
                <div className="rounded-xl border border-border/40 bg-muted/30 p-4">
                  <p className="text-[13px] text-foreground/80 whitespace-pre-wrap leading-relaxed">
                    {selectedTicket.description}
                  </p>
                </div>
              )}
            </div>

            {/* Messages thread */}
            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 sm:p-8 mb-4">
              <h3 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
                <MessageSquare className="size-4 text-primary" aria-hidden="true" />
                {t("ticket.messages")}
                {selectedTicket.messages.length > 0 && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                    {selectedTicket.messages.length}
                  </span>
                )}
              </h3>

              {selectedTicket.messages.length === 0 ? (
                <p className="text-[13px] text-muted-foreground text-center py-8">
                  {t("ticket.noMessages")}
                </p>
              ) : (
                <div className="space-y-4">
                  {selectedTicket.messages.map((msg: GuestTicketMessage) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex gap-3",
                        msg.author_is_staff ? "justify-start" : "justify-end"
                      )}
                    >
                      {msg.author_is_staff && (
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0ab8fb]/10 mt-0.5">
                          <Zap className="size-3.5 text-[#0ab8fb]" aria-hidden="true" />
                        </div>
                      )}

                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-4 py-3",
                          msg.author_is_staff
                            ? "bg-muted/60 rounded-tl-sm"
                            : "bg-[#0ab8fb]/10 rounded-tr-sm"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-semibold text-foreground">
                            {msg.author_display || msg.author_name || "—"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatDate(msg.created_at)}
                          </span>
                        </div>
                        <p className="text-[13px] text-foreground/85 whitespace-pre-wrap leading-relaxed">
                          {msg.body}
                        </p>
                      </div>

                      {!msg.author_is_staff && (
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted mt-0.5">
                          <User className="size-3.5 text-muted-foreground" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reply form */}
            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 sm:p-8">
              <h3 className="text-sm font-bold text-foreground mb-3">
                {t("ticket.reply")}
              </h3>
              <form onSubmit={handleSendReply} className="flex flex-col gap-3">
                <Textarea
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  placeholder={t("ticket.replyPlaceholder")}
                  required
                  className="min-h-[80px] text-sm resize-y"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isPending || !replyBody.trim()}
                    size="sm"
                    className="bg-brand-gradient shadow-brand"
                  >
                    {isPending ? (
                      <Loader2 className="size-4 animate-spin mr-1.5" aria-hidden="true" />
                    ) : (
                      <Send className="size-3.5 mr-1.5" aria-hidden="true" />
                    )}
                    {t("ticket.sendReply")}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
