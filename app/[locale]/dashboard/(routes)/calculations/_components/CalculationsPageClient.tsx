"use client";

// app/[locale]/dashboard/(routes)/calculations/_components/CalculationsPageClient.tsx

import { useEffect, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Clock,
  Filter,
  AlertCircle,
  Inbox,
  ArrowRight,
  ChevronDown,
  RefreshCw,
  CheckCircle2,
  DollarSign,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  fetchDashboardCalculations,
  convertDashboardCalculation,
} from "@/lib/automex/dashboard";
import type { DashboardCalculation, ComplexityTierEnum } from "@/lib/automex/types";

// ─── Animation variants ─────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease, delay },
});

// ─── Tier badge colors ──────────────────────────────────────────────────────

const TIER_COLORS: Record<string, string> = {
  basic: "bg-sky-500/10 text-sky-500",
  standard: "bg-indigo-500/10 text-indigo-500",
  advanced: "bg-purple-500/10 text-purple-500",
  enterprise: "bg-amber-500/10 text-amber-500",
};

// ─── Filter options ─────────────────────────────────────────────────────────

const TIER_OPTIONS: { value: ComplexityTierEnum | "all"; label: string }[] = [
  { value: "all", label: "All Tiers" },
  { value: "basic", label: "Basic" },
  { value: "standard", label: "Standard" },
  { value: "advanced", label: "Advanced" },
  { value: "enterprise", label: "Enterprise" },
];

const CONVERTED_OPTIONS: { value: "all" | "yes" | "no"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "yes", label: "Converted" },
  { value: "no", label: "Pending" },
];

// ─── Calculation Card Component ─────────────────────────────────────────────

interface CalculationCardProps {
  calc: DashboardCalculation;
  locale: string;
  onConvert: (id: string) => void;
  convertingId: string | null;
}

function CalculationCard({
  calc,
  locale,
  onConvert,
  convertingId,
}: CalculationCardProps) {
  const t = useTranslations("Calculations");
  const tierColor =
    TIER_COLORS[calc.complexity_tier] || "bg-gray-500/10 text-gray-500";

  const priceMin = calc.estimated_price_min
    ? parseFloat(calc.estimated_price_min).toLocaleString(locale, {
        maximumFractionDigits: 0,
      })
    : null;
  const priceMax = calc.estimated_price_max
    ? parseFloat(calc.estimated_price_max).toLocaleString(locale, {
        maximumFractionDigits: 0,
      })
    : null;

  const priceDisplay =
    priceMin && priceMax
      ? `${calc.currency} ${priceMin} – ${priceMax}`
      : priceMin
        ? `${calc.currency} ${priceMin}+`
        : null;

  return (
    <motion.div {...fadeUp(0)}>
      <div className="group rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-4 transition-all duration-200 hover:border-border hover:shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {/* Icon */}
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 shrink-0">
              <Calculator className="size-5 text-purple-500" />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <p className="text-[14px] font-medium text-foreground truncate">
                  {calc.service_name}
                </p>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                    tierColor
                  )}
                >
                  {calc.complexity_tier}
                </span>
                {calc.converted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
                    <CheckCircle2 className="size-2.5" />
                    {t("converted")}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[12px] text-muted-foreground flex-wrap">
                {priceDisplay && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="size-3" />
                    {priceDisplay}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Zap className="size-3" />
                  {calc.complexity_tier}
                </span>
                <span>
                  {new Date(calc.created_at).toLocaleDateString(locale, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Right side — Convert action */}
          <div className="flex items-center gap-2 shrink-0">
            {!calc.converted && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onConvert(calc.id)}
                disabled={convertingId === calc.id}
                className="gap-1.5 text-[11px]"
              >
                {convertingId === calc.id ? (
                  <>
                    <Clock className="size-3 animate-spin" />
                    {t("converting")}
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="size-3" />
                    {t("convertToRequest")}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Skeleton Component ─────────────────────────────────────────────────────

function CalculationsSkeleton() {
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

export function CalculationsPageClient() {
  const t = useTranslations("Calculations");
  const locale = useLocale();

  const [calculations, setCalculations] = useState<DashboardCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [convertingId, setConvertingId] = useState<string | null>(null);

  // Filters
  const [tierFilter, setTierFilter] = useState<ComplexityTierEnum | "all">(
    "all"
  );
  const [convertedFilter, setConvertedFilter] = useState<
    "all" | "yes" | "no"
  >("all");
  const [showFilters, setShowFilters] = useState(false);

  // Load data
  const loadCalculations = useCallback(
    async (pageNum: number, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      try {
        const data = await fetchDashboardCalculations(pageNum);
        if (append) {
          setCalculations((prev) => [...prev, ...data.results]);
        } else {
          setCalculations(data.results);
        }
        setHasMore(data.hasNext);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load calculations"
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    loadCalculations(1);
  }, [loadCalculations]);

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadCalculations(nextPage, true);
  };

  // Convert to request
  const handleConvert = async (id: string) => {
    setConvertingId(id);
    try {
      await convertDashboardCalculation(id);
      // Refresh the list to reflect the converted state
      loadCalculations(1);
    } catch (err) {
      console.error("Failed to convert calculation:", err);
    } finally {
      setConvertingId(null);
    }
  };

  // Filter calculations
  const filteredCalculations = calculations.filter((calc) => {
    if (tierFilter !== "all" && calc.complexity_tier !== tierFilter)
      return false;
    if (convertedFilter === "yes" && !calc.converted) return false;
    if (convertedFilter === "no" && calc.converted) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("pageTitle")}
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            {t("pageDescription")}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadCalculations(1)}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
          {t("refresh")}
        </Button>
      </div>

      {/* Filters */}
      <div>
        <button
          onClick={() => setShowFilters(!showFilters)}
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
                {/* Tier filter */}
                <div className="flex flex-wrap gap-1.5">
                  {TIER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setTierFilter(opt.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors",
                        tierFilter === opt.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Converted filter */}
                <div className="flex gap-1.5 border-l border-border/50 pl-3">
                  {CONVERTED_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setConvertedFilter(opt.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors",
                        convertedFilter === opt.value
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

      {/* Loading state */}
      {loading && <CalculationsSkeleton />}

      {/* Error state */}
      {error && !loading && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <AlertCircle className="size-8 text-red-400" />
          <p className="text-[14px] text-red-400">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadCalculations(1)}
            className="gap-2"
          >
            <RefreshCw className="size-3.5" />
            {t("retry")}
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredCalculations.length === 0 && (
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
      {!loading && !error && filteredCalculations.length > 0 && (
        <div className="space-y-3">
          {filteredCalculations.map((calc) => (
            <CalculationCard
              key={calc.id}
              calc={calc}
              locale={locale}
              onConvert={handleConvert}
              convertingId={convertingId}
            />
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
