"use client";

// app/[locale]/dashboard/(routes)/support/_components/SupportTicketsPageClient.tsx

import { useEffect, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Clock,
  Filter,
  AlertCircle,
  Inbox,
  ArrowRight,
  ChevronDown,
  RefreshCw,
  Plus,
  CircleDot,
  FileText,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  fetchDashboardTickets,
  createDashboardTicket,
} from "@/lib/automex/dashboard";
import type { TicketFilters } from "@/lib/automex/dashboard";
import type { DashboardTicketList, CreateTicketRequest, TicketStatus, TicketTypeEnum } from "@/lib/automex/types";

// ─── Animation variants ─────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease, delay },
});

// ─── Types ──────────────────────────────────────────────────────────────────

type TicketStatusType = TicketStatus;
type TicketType = TicketTypeEnum;
type TicketPriority = "low" | "normal" | "high" | "urgent";

// ─── Filter options ─────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: TicketStatusType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "waiting_customer", label: "Waiting on You" },
  { value: "waiting_admin", label: "Waiting on Admin" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-500/10 text-blue-500",
  in_progress: "bg-cyan-500/10 text-cyan-500",
  waiting_customer: "bg-amber-500/10 text-amber-500",
  waiting_admin: "bg-purple-500/10 text-purple-500",
  resolved: "bg-emerald-500/10 text-emerald-500",
  closed: "bg-gray-500/10 text-gray-500",
};

// ─── Ticket Card Component ──────────────────────────────────────────────────

interface TicketCardProps {
  ticket: DashboardTicketList;
  locale: string;
}

function TicketCard({ ticket, locale }: TicketCardProps) {
  const statusColor =
    STATUS_COLORS[ticket.status] || "bg-gray-500/10 text-gray-500";
  const unread = parseInt(ticket.unread_message_count) || 0;

  return (
    <motion.div {...fadeUp(0)}>
      <Link
        href={`/dashboard/support/${ticket.id}` as any}
        className="group flex items-center justify-between rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-4 transition-all duration-200 hover:border-border hover:shadow-sm"
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Icon */}
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 shrink-0">
            <MessageSquare className="size-5 text-primary" />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-[14px] font-medium text-foreground truncate">
                {ticket.title}
              </p>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                  statusColor
                )}
              >
                {ticket.status_display}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
              <span>{ticket.ticket_type_display}</span>
              <span className="flex items-center gap-1">
                <CircleDot className="size-3" />
                {ticket.priority_display}
              </span>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          {unread > 0 && (
            <span className="flex items-center justify-center size-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
              {unread}
            </span>
          )}
          <span className="text-[11px] text-muted-foreground hidden sm:block">
            {new Date(ticket.updated_at).toLocaleDateString(locale, {
              month: "short",
              day: "numeric",
            })}
          </span>
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
  statusFilter: TicketStatusType | "all";
  onStatusChange: (value: TicketStatusType | "all") => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

function TicketFilters({
  statusFilter,
  onStatusChange,
  showFilters,
  onToggleFilters,
}: FiltersProps) {
  const t = useTranslations("Support");

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

function TicketsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/70 p-4"
        >
          <div className="size-10 rounded-xl bg-muted-foreground/10 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 bg-muted-foreground/10 rounded animate-pulse" />
            <div className="h-3 w-24 bg-muted-foreground/10 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page Client ───────────────────────────────────────────────────────

export function SupportTicketsPageClient() {
  const t = useTranslations("Support");
  const locale = useLocale();

  const [tickets, setTickets] = useState<DashboardTicketList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<TicketStatusType | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  // Create ticket dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [newTicket, setNewTicket] = useState<CreateTicketRequest>({
    title: "",
    description: "",
    ticket_type: "general_inquiry" as TicketType,
    priority: "normal" as TicketPriority,
    related_lead: null,
    related_service: null,
  });
  const [creating, setCreating] = useState(false);

  // Check for related_lead from sessionStorage (set by request detail page)
  useEffect(() => {
    const storedLeadId = sessionStorage.getItem("ticket_related_lead");
    if (storedLeadId) {
      sessionStorage.removeItem("ticket_related_lead");
      setCreateOpen(true);
      setNewTicket((prev) => ({ ...prev, related_lead: storedLeadId }));
    }
  }, []);

  // Build current filters for server-side filtering
  const currentFilters: TicketFilters = { status: statusFilter };

  // Load data
  const loadTickets = useCallback(async (pageNum: number, filters: TicketFilters, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
    }

    try {
      const data = await fetchDashboardTickets(pageNum, filters);
      if (append) {
        setTickets((prev) => [...prev, ...data.results]);
      } else {
        setTickets(data.results);
      }
      setHasMore(data.hasNext);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tickets");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadTickets(1, currentFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset page and reload when filter changes
  useEffect(() => {
    setPage(1);
    loadTickets(1, currentFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadTickets(nextPage, currentFilters, true);
  };

  // Handle create ticket
  const handleCreateTicket = async () => {
    if (!newTicket.title.trim() || !newTicket.description.trim() || creating) return;

    setCreating(true);
    try {
      await createDashboardTicket(newTicket);
      setCreateOpen(false);
      setNewTicket({
        title: "",
        description: "",
        ticket_type: "general_inquiry" as TicketType,
        priority: "normal" as TicketPriority,
        related_lead: null,
        related_service: null,
      });
      // Reload tickets
      await loadTickets(1, currentFilters);
    } catch (err) {
      console.error("Failed to create ticket:", err);
    } finally {
      setCreating(false);
    }
  };

  // No client-side filtering — server handles it
  const filteredTickets = tickets;

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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadTickets(1, currentFilters)}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
            {t("refresh")}
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="size-3.5" />
            {t("newTicket")}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <TicketFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {/* Loading state */}
      {loading && <TicketsSkeleton />}

      {/* Error state */}
      {error && !loading && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <AlertCircle className="size-8 text-red-400" />
          <p className="text-[14px] text-red-400">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadTickets(1, currentFilters)}
            className="gap-2"
          >
            <RefreshCw className="size-3.5" />
            {t("retry")}
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredTickets.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <Inbox className="size-12 text-muted-foreground/30" />
          <div>
            <p className="text-[14px] font-medium text-foreground">
              {t("emptyTitle")}
            </p>
            <p className="text-[13px] text-muted-foreground mt-1">
              {t("emptyDescription")}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="mt-2 gap-2"
          >
            <Plus className="size-3.5" />
            {t("emptyCta")}
          </Button>
        </div>
      )}

      {/* Results */}
      {!loading && !error && filteredTickets.length > 0 && (
        <div className="space-y-3">
          {filteredTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} locale={locale} />
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

      {/* Create Ticket Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("createTitle")}</DialogTitle>
            <DialogDescription>{t("createDescription")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-[12px] font-medium text-foreground mb-1.5 block">
                {t("labelTitle")}
              </label>
              <Input
                value={newTicket.title}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, title: e.target.value })
                }
                placeholder={t("titlePlaceholder")}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] font-medium text-foreground mb-1.5 block">
                  {t("labelType")}
                </label>
                <Select
                  value={newTicket.ticket_type}
                  onValueChange={(v) =>
                    setNewTicket({
                      ...newTicket,
                      ticket_type: v as TicketType,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general_inquiry">
                      {t("typeGeneralInquiry")}
                    </SelectItem>
                    <SelectItem value="technical_support">
                      {t("typeTechnicalSupport")}
                    </SelectItem>
                    <SelectItem value="project_request">
                      {t("typeProjectRequest")}
                    </SelectItem>
                    <SelectItem value="bug_report">{t("typeBugReport")}</SelectItem>
                    <SelectItem value="feedback">{t("typeFeedback")}</SelectItem>
                    <SelectItem value="partnership">{t("typePartnership")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[12px] font-medium text-foreground mb-1.5 block">
                  {t("labelPriority")}
                </label>
                <Select
                  value={newTicket.priority}
                  onValueChange={(v) =>
                    setNewTicket({
                      ...newTicket,
                      priority: v as TicketPriority,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t("priorityLow")}</SelectItem>
                    <SelectItem value="normal">{t("priorityNormal")}</SelectItem>
                    <SelectItem value="high">{t("priorityHigh")}</SelectItem>
                    <SelectItem value="urgent">{t("priorityUrgent")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium text-foreground mb-1.5 block">
                {t("labelDescription")}
              </label>
              <Textarea
                value={newTicket.description}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, description: e.target.value })
                }
                placeholder={t("descriptionPlaceholder")}
                className="min-h-[120px] resize-none"
              />
            </div>
            {/* Related lead (pre-filled from request detail page) */}
            {newTicket.related_lead && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="size-3.5 text-primary" />
                    <span className="text-[12px] text-foreground">
                      {t("linkedRequest")}: <span className="font-mono text-[11px]">{newTicket.related_lead.slice(0, 8)}...</span>
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[11px]"
                    onClick={() => setNewTicket({ ...newTicket, related_lead: null })}
                  >
                    {t("unlink")}
                  </Button>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              {t("dialogCancel")}
            </Button>
            <Button
              onClick={handleCreateTicket}
              disabled={
                !newTicket.title.trim() ||
                !newTicket.description.trim() ||
                creating
              }
            >
              {creating ? t("creating") : t("submitTicket")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
