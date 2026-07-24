"use client";

// app/[locale]/dashboard/(routes)/requests/_components/RequestsPageClient.tsx

import { useEffect, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Clock,
  Filter,
  AlertCircle,
  Inbox,
  ArrowRight,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  fetchDashboardLeads,
} from "@/lib/automex/dashboard";
import type { LeadFilters } from "@/lib/automex/dashboard";
import type { DashboardLead, LeadStatus, LeadType } from "@/lib/automex/types";

// ─── Animation variants ─────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease, delay },
});

// ─── Filter options ─────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal_sent", label: "Proposal Sent" },
  { value: "negotiation", label: "Negotiation" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

const TYPE_OPTIONS: { value: LeadType | "all"; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "contact", label: "Contact" },
  { value: "quote", label: "Quote" },
];

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

// ─── Request Card Component ─────────────────────────────────────────────────

interface RequestCardProps {
  lead: DashboardLead;
  locale: string;
}

function RequestCard({ lead, locale }: RequestCardProps) {
  const statusColor = STATUS_COLORS[lead.status] || "bg-gray-500/10 text-gray-500";

  return (
    <motion.div {...fadeUp(0)}>
      <Link
        href={`/dashboard/requests/${lead.id}` as any}
        className="group flex items-center justify-between rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-4 transition-all duration-200 hover:border-border hover:shadow-sm"
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Icon */}
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 shrink-0">
            <FileText className="size-5 text-primary" />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-[14px] font-medium text-foreground truncate">
                {lead.full_name || lead.company || "Request"}
              </p>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                  statusColor
                )}
              >
                {lead.status_display}
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground truncate">
              {lead.message?.slice(0, 80) || lead.lead_type_display}
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] text-muted-foreground">
              {new Date(lead.created_at).toLocaleDateString(locale, {
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-[10px] text-muted-foreground/60">
              {lead.lead_type_display}
            </p>
          </div>
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
  statusFilter: LeadStatus | "all";
  typeFilter: LeadType | "all";
  onStatusChange: (value: LeadStatus | "all") => void;
  onTypeChange: (value: LeadType | "all") => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

function RequestFilters({
  statusFilter,
  typeFilter,
  onStatusChange,
  onTypeChange,
  showFilters,
  onToggleFilters,
}: FiltersProps) {
  const t = useTranslations("Requests");

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
            <div className="flex flex-wrap gap-3 pt-3">
              {/* Status filter */}
              <div className="flex flex-wrap gap-1.5">
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

              {/* Type filter */}
              <div className="flex gap-1.5 border-l border-border/50 pl-3">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onTypeChange(opt.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors",
                      typeFilter === opt.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Skeleton Component ─────────────────────────────────────────────────────

function RequestsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/70 p-4"
        >
          <div className="size-10 rounded-xl bg-muted-foreground/10 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-muted-foreground/10 rounded animate-pulse" />
            <div className="h-3 w-48 bg-muted-foreground/10 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page Client ───────────────────────────────────────────────────────

export function RequestsPageClient() {
  const t = useTranslations("Requests");
  const locale = useLocale();

  const [leads, setLeads] = useState<DashboardLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<LeadType | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  // Build current filters object for server-side filtering
  const currentFilters: LeadFilters = {
    status: statusFilter,
    lead_type: typeFilter,
  };

  // Load data
  const loadLeads = useCallback(async (pageNum: number, filters: LeadFilters, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
    }

    try {
      const data = await fetchDashboardLeads(pageNum, filters);
      if (append) {
        setLeads((prev) => [...prev, ...data.results]);
      } else {
        setLeads(data.results);
      }
      setHasMore(data.hasNext);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadLeads(1, currentFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset page and reload when filters change
  useEffect(() => {
    setPage(1);
    loadLeads(1, currentFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, typeFilter]);

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadLeads(nextPage, currentFilters, true);
  };

  // No client-side filtering needed — server handles it
  const filteredLeads = leads;

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
          onClick={() => loadLeads(1, currentFilters)}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
          {t("refresh")}
        </Button>
      </div>

      {/* Filters */}
      <RequestFilters
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        onStatusChange={setStatusFilter}
        onTypeChange={setTypeFilter}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {/* Loading state */}
      {loading && <RequestsSkeleton />}

      {/* Error state */}
      {error && !loading && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <AlertCircle className="size-8 text-red-400" />
          <p className="text-[14px] text-red-400">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadLeads(1, currentFilters)}
            className="gap-2"
          >
            <RefreshCw className="size-3.5" />
            {t("retry")}
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredLeads.length === 0 && (
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
          <Link href="/crm/quote" className="mt-2">
            <Button variant="outline" size="sm" className="gap-2">
              {t("emptyCta")}
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Results */}
      {!loading && !error && filteredLeads.length > 0 && (
        <div className="space-y-3">
          {filteredLeads.map((lead) => (
            <RequestCard key={lead.id} lead={lead} locale={locale} />
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
