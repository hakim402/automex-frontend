"use client";

// app/config/HowItWorksConfig.tsx
//
// Pre-configured HowItWorks data for the Home page.
// Import this file and pass the result as props to <HowItWorks />.
//
// Every string is sourced from next-intl so all locales just work.
// Icons and colors are hardcoded here — they don't need translation.
//
// Usage:
//   import { useHowItWorksConfig } from "./_components/HowItWorksConfig";
//   const config = useHowItWorksConfig();
//   <HowItWorks {...config} isRtl={isRtl} />

import { useTranslations } from "next-intl";
import {
  Webhook,
  Brain,
  Zap,
  CheckCircle2,
  Database,
  Mail,
  Calendar,
  MessageSquare,
  User,
  Tag,
  FileText,
  Bell,
  GitBranch,
  Clock,
  TrendingUp,
  RefreshCcw,
} from "lucide-react";
import type { HowItWorksProps, FlowStep, AgentTask } from "@/components/shared/HowItWorks";

export function useHowItWorksConfig(): HowItWorksProps {
  const t = useTranslations("HowItWorks");

  // ── 4-step flow ──────────────────────────────────────────────────────────
  const flowSteps: FlowStep[] = [
    {
      icon: Webhook,
      color: "#0ab8fb",
      title: t("step1Title"),
      description: t("step1Desc"),
    },
    {
      icon: Brain,
      color: "#7c3aed",
      title: t("step2Title"),
      description: t("step2Desc"),
    },
    {
      icon: Zap,
      color: "#f59e0b",
      title: t("step3Title"),
      description: t("step3Desc"),
    },
    {
      icon: CheckCircle2,
      color: "#13a89e",
      title: t("step4Title"),
      description: t("step4Desc"),
    },
  ];

  // ── Sandbox tasks ─────────────────────────────────────────────────────────
  const tasks: AgentTask[] = [
    // ── Task 1: CRM → Asana → Slack → Calendar ───────────────────────────
    {
      label: t("task1Label"),
      icon: Database,
      thoughts: [
        t("task1Thought1"),
        t("task1Thought2"),
        t("task1Thought3"),
        t("task1Thought4"),
      ],
      actions: [
        {
          icon: Database,
          system: "HubSpot CRM",
          action: t("task1Action1"),
          detail: "Sarah Chen · Acme Corp · $48k ARR potential",
          color: "#0ab8fb",
          durationMs: 1000,
        },
        {
          icon: Tag,
          system: "AI Enrichment",
          action: t("task1Action2"),
          detail: "Enterprise › SaaS › High-intent › Demo requested",
          color: "#7c3aed",
          durationMs: 900,
        },
        {
          icon: FileText,
          system: "Asana",
          action: t("task1Action3"),
          detail: "Assign: Sales Team · Due: 2h · Priority: Urgent",
          color: "#13a89e",
          durationMs: 800,
        },
        {
          icon: MessageSquare,
          system: "Slack",
          action: t("task1Action4"),
          detail: "#sales-alerts · @sales-team · Full lead profile",
          color: "#f59e0b",
          durationMs: 700,
        },
        {
          icon: Calendar,
          system: "Google Calendar",
          action: t("task1Action5"),
          detail: "Demo call · Tomorrow 10 AM PST · Auto-invite sent",
          color: "#324b9d",
          durationMs: 800,
        },
      ],
      result: {
        summary: t("task1Result"),
        metrics: [
          { label: t("metricTime"),    value: "4.2s" },
          { label: t("metricSteps"),   value: "5" },
          { label: t("metricSaved"),   value: "38 min" },
        ],
      },
    },

    // ── Task 2: Support ticket → AI response → escalation ────────────────
    {
      label: t("task2Label"),
      icon: Mail,
      thoughts: [
        t("task2Thought1"),
        t("task2Thought2"),
        t("task2Thought3"),
      ],
      actions: [
        {
          icon: Mail,
          system: "Email / Helpdesk",
          action: t("task2Action1"),
          detail: "Subject: API rate limit · Priority: High · #3841",
          color: "#0ab8fb",
          durationMs: 800,
        },
        {
          icon: Brain,
          system: "AI Classifier",
          action: t("task2Action2"),
          detail: "Category: Technical · Sentiment: Frustrated · Tier: Pro",
          color: "#7c3aed",
          durationMs: 1000,
        },
        {
          icon: FileText,
          system: "Knowledge Base",
          action: t("task2Action3"),
          detail: "Matched 3 docs · Confidence: 94% · Draft generated",
          color: "#13a89e",
          durationMs: 900,
        },
        {
          icon: Bell,
          system: "Escalation Engine",
          action: t("task2Action4"),
          detail: "Assigned: Senior Engineer · SLA: 2h · Slack notified",
          color: "#f59e0b",
          durationMs: 700,
        },
      ],
      result: {
        summary: t("task2Result"),
        metrics: [
          { label: t("metricTime"),       value: "3.1s" },
          { label: t("metricResolution"), value: "94%" },
          { label: t("metricSaved"),      value: "22 min" },
        ],
      },
    },

    // ── Task 3: Report generation ─────────────────────────────────────────
    {
      label: t("task3Label"),
      icon: TrendingUp,
      thoughts: [
        t("task3Thought1"),
        t("task3Thought2"),
        t("task3Thought3"),
      ],
      actions: [
        {
          icon: Database,
          system: "Data Warehouse",
          action: t("task3Action1"),
          detail: "Postgres · 14 tables · Last 30 days · 2.3M rows",
          color: "#0ab8fb",
          durationMs: 1100,
        },
        {
          icon: Brain,
          system: "AI Analyst",
          action: t("task3Action2"),
          detail: "Revenue ↑12% · Churn ↓3% · Top segment: Enterprise",
          color: "#7c3aed",
          durationMs: 1200,
        },
        {
          icon: FileText,
          system: "Report Builder",
          action: t("task3Action3"),
          detail: "PDF + Notion page · Charts generated · Executive summary",
          color: "#13a89e",
          durationMs: 900,
        },
        {
          icon: Mail,
          system: "Distribution",
          action: t("task3Action4"),
          detail: "CEO, CMO, CTO · Scheduled: Every Monday 8 AM",
          color: "#324b9d",
          durationMs: 600,
        },
      ],
      result: {
        summary: t("task3Result"),
        metrics: [
          { label: t("metricTime"),   value: "6.8s" },
          { label: t("metricRows"),   value: "2.3M" },
          { label: t("metricSaved"),  value: "4 hrs" },
        ],
      },
    },
  ];

  return {
    eyebrow:            t("eyebrow"),
    title:              t("title"),
    accentWord:         t("accentWord"),
    description:        t("description"),
    flowSteps,
    tasks,
    sandboxTitle:       t("sandboxTitle"),
    sandboxDescription: t("sandboxDescription"),
    runLabel:           t("runLabel"),
    resetLabel:         t("resetLabel"),
    thinkingLabel:      t("thinkingLabel"),
    doneLabel:          t("doneLabel"),
  };
}