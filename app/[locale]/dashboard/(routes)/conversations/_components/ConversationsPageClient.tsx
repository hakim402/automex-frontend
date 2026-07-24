"use client";

// app/[locale]/dashboard/(routes)/conversations/_components/ConversationsPageClient.tsx

import { useEffect, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Clock,
  AlertCircle,
  Inbox,
  ArrowLeft,
  RefreshCw,
  MessageSquare,
  Globe,
  User,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  fetchConversations,
  fetchConversationDetail,
} from "@/lib/automex/dashboard";
import type { ConversationList, ConversationHistory, AIMessageHistory } from "@/lib/automex/types";

// ─── Animation variants ─────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease, delay },
});

// ─── Channel icon map ───────────────────────────────────────────────────────

const CHANNEL_COLORS: Record<string, string> = {
  website_widget: "bg-blue-500/10 text-blue-500",
  whatsapp: "bg-emerald-500/10 text-emerald-500",
  facebook: "bg-indigo-500/10 text-indigo-500",
};

// ─── Skeleton ───────────────────────────────────────────────────────────────

function ConversationsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/70 p-4"
        >
          <div className="size-10 rounded-xl bg-muted-foreground/10 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 bg-muted-foreground/10 rounded animate-pulse" />
            <div className="h-3 w-full bg-muted-foreground/10 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Message Bubble ─────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: AIMessageHistory;
  locale: string;
}

function MessageBubble({ message, locale }: MessageBubbleProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={cn("flex gap-3", isAssistant ? "flex-row" : "flex-row-reverse")}>
      <div
        className={cn(
          "flex size-8 items-center justify-center rounded-full shrink-0",
          isAssistant ? "bg-primary/10" : "bg-muted",
        )}
      >
        {isAssistant ? (
          <Bot className="size-4 text-primary" />
        ) : (
          <User className="size-4 text-muted-foreground" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3",
          isAssistant ? "bg-muted/50 rounded-tl-sm" : "bg-primary/10 rounded-tr-sm",
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-medium text-foreground">
            {isAssistant ? "AUTOMEX AI" : "You"}
          </span>
          {isAssistant && (
            <span className="text-[10px] text-primary font-medium">
              AI
            </span>
          )}
        </div>
        <p className="text-[13px] text-foreground whitespace-pre-wrap">
          {message.content}
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

// ─── Conversation Card (list item) ──────────────────────────────────────────

interface ConversationCardProps {
  conversation: ConversationList;
  locale: string;
  onClick: () => void;
}

function ConversationCard({ conversation, locale, onClick }: ConversationCardProps) {
  const channelColor =
    CHANNEL_COLORS[conversation.channel] || "bg-gray-500/10 text-gray-500";

  return (
    <motion.div {...fadeUp(0)}>
      <button
        onClick={onClick}
        className="group w-full text-left flex items-center gap-4 rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-4 transition-all duration-200 hover:border-border hover:shadow-sm"
      >
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-xl shrink-0",
            channelColor,
          )}
        >
          <Bot className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-[14px] font-medium text-foreground truncate">
              {conversation.channel.replace(/_/g, " ")}
            </p>
            {conversation.lead_captured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
                Lead captured
              </span>
            )}
          </div>
          <p className="text-[12px] text-muted-foreground truncate">
            {conversation.last_message || "—"}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-muted-foreground hidden sm:block">
            {new Date(conversation.started_at).toLocaleDateString(locale, {
              month: "short",
              day: "numeric",
            })}
          </span>
          <ChevronRight className="size-4 text-muted-foreground/30 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
        </div>
      </button>
    </motion.div>
  );
}

// ─── Main Page Client ───────────────────────────────────────────────────────

export function ConversationsPageClient() {
  const t = useTranslations("Conversations");
  const locale = useLocale();

  const [conversations, setConversations] = useState<ConversationList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail view
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ConversationHistory | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Load conversations list
  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchConversations();
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load conversation detail
  const loadDetail = async (id: string) => {
    setSelectedId(id);
    setDetailLoading(true);
    try {
      const data = await fetchConversationDetail(id);
      setDetail(data);
    } catch (err) {
      console.error("Failed to load conversation detail:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedId(null);
    setDetail(null);
  };

  // ─── Detail View ────────────────────────────────────────────────────────

  if (selectedId) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Back button */}
        <motion.div {...fadeUp(0)} className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="size-8" onClick={handleBack}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t("detailTitle")}</h1>
            {detail && (
              <p className="text-[12px] text-muted-foreground">
                {detail.channel.replace(/_/g, " ")} · {detail.language}
              </p>
            )}
          </div>
        </motion.div>

        {detailLoading && (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="size-8 rounded-full bg-muted-foreground/10 animate-pulse" />
                <div className="flex-1 max-w-[75%] rounded-2xl bg-muted/30 p-4">
                  <div className="h-3 w-20 bg-muted-foreground/10 rounded animate-pulse mb-2" />
                  <div className="h-4 w-full bg-muted-foreground/10 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {detail && !detailLoading && (
          <>
            {/* Meta info */}
            <motion.div
              {...fadeUp(0.1)}
              className="rounded-2xl border border-border/50 bg-card/70 p-4"
            >
              <div className="flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Globe className="size-3" />
                  {detail.language}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="size-3" />
                  {detail.messages?.length || 0} {t("messages")}
                </span>
                {detail.lead_captured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
                    {t("leadCaptured")}
                  </span>
                )}
                <span>
                  {new Date(detail.started_at).toLocaleString(locale, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {detail.page_url && (
                <p className="text-[11px] text-muted-foreground/60 mt-1 truncate">
                  {detail.page_url}
                </p>
              )}
            </motion.div>

            {/* Messages */}
            <motion.div {...fadeUp(0.2)} className="space-y-4">
              {detail.messages && detail.messages.length > 0 ? (
                detail.messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} locale={locale} />
                ))
              ) : (
                <p className="text-[13px] text-muted-foreground text-center py-8">
                  {t("noMessages")}
                </p>
              )}
            </motion.div>
          </>
        )}
      </div>
    );
  }

  // ─── List View ──────────────────────────────────────────────────────────

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
          onClick={loadConversations}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
          {t("refresh")}
        </Button>
      </div>

      {/* Loading state */}
      {loading && <ConversationsSkeleton />}

      {/* Error state */}
      {error && !loading && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <AlertCircle className="size-8 text-red-400" />
          <p className="text-[14px] text-red-400">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={loadConversations}
            className="gap-2"
          >
            <RefreshCw className="size-3.5" />
            {t("retry")}
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && conversations.length === 0 && (
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
        </div>
      )}

      {/* Results */}
      {!loading && !error && conversations.length > 0 && (
        <div className="space-y-3">
          {conversations.map((conv) => (
            <ConversationCard
              key={conv.id}
              conversation={conv}
              locale={locale}
              onClick={() => loadDetail(conv.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
