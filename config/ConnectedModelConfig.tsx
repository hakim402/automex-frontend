"use client";

// app/[locale]/_components/ConnectedModelConfig.tsx
//
// Pre-configured data for <ConnectedModel /> on the Home page.
// Mixes marketing/data-source icons (Meta, Google Ads, Shopify, etc.)
// with IDWE's own integration set (Slack, HubSpot, OpenAI) for the
// "Every Signal" grid — 20 tiles, 5 columns x 4 rows.
//
// Usage:
//   const config = useConnectedModelConfig();
//   <ConnectedModel {...config} isRtl={isRtl} />

import { useTranslations } from "next-intl";
import {
  Globe,
  ShoppingBag,
  Mail,
  FileSpreadsheet,
  Database,
  Code2,
  BarChart3,
  Megaphone,
  Search,
  MessageSquare,
  Bot,
  Sparkles,
  Boxes,
  Warehouse,
  Layers,
  Workflow,
  LayoutDashboard,
} from "lucide-react";
import type {
  ConnectedModelProps,
  SignalSource,
  OutputCard,
} from "@/components/shared/ConnectedModel";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

// ─────────────────────────────────────────────────────────────────────────────
// Signal sources — 20 tiles
// ─────────────────────────────────────────────────────────────────────────────

const SIGNALS: SignalSource[] = [
  { name: "Google Analytics", icon: BarChart3, color: "#f59e0b" },
  { name: "Google Ads", icon: Search, color: "#4285f4" },
  { name: "Bing Ads", icon: Globe, color: "#00897b" },
  { name: "Custom API", icon: Code2, color: "#7c3aed" },
  { name: "Webhooks", icon: Workflow, color: "#0ab8fb" },

  { name: "Facebook Ads", icon: FaFacebook, color: "#1877f2" },
  { name: "Meta", icon: Megaphone, color: "#0668e1" },
  { name: "Pinterest", icon: Layers, color: "#e60023" },
  { name: "TikTok Ads", icon: Sparkles, color: "#000000" },
  { name: "Analytics Suite", icon: BarChart3, color: "#324b9d" },

  { name: "Sheets", icon: FileSpreadsheet, color: "#13a89e" },
  { name: "Instagram", icon: FaInstagram, color: "#e1306c" },
  { name: "Snapchat", icon: MessageSquare, color: "#fffc00" },
  { name: "LinkedIn", icon: FaLinkedin, color: "#0a66c2" },
  { name: "Shopify", icon: ShoppingBag, color: "#95bf47" },

  { name: "YouTube", icon: FaYoutube, color: "#ff0000" },
  { name: "Email", icon: Mail, color: "#0ab8fb" },
  { name: "HubSpot CRM", icon: Boxes, color: "#ff7a59" },
  { name: "ERP", icon: Database, color: "#324b9d" },
  { name: "Warehouse", icon: Warehouse, color: "#13a89e" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Output cards — Dashboard + AI Agent
// ─────────────────────────────────────────────────────────────────────────────

const OUTPUTS: [OutputCard, OutputCard] = [
  {
    title: "Dashboard",
    description:
      "KPIs, exploration, and reporting, always in sync with the same model.",
    icon: LayoutDashboard,
    chartType: "bars",
    chartData: [38, 52, 41, 67, 59, 74, 88, 65, 92, 81, 96, 102],
    metrics: [
      { label: "Revenue", value: 462521, prefix: "$" },
      { label: "Sessions", value: 18.4, suffix: "k" },
      { label: "Conv. rate", value: 3.8, suffix: "%" },
    ],
  },
  {
    title: "AI Agent",
    description:
      "Ask in plain language, grounded in the same connected data, not a silo.",
    icon: Bot,
    chartType: "line",
    chartData: [12, 19, 15, 27, 24, 35, 31, 42, 38, 51, 47, 58],
    metrics: [
      { label: "Queries today", value: 214 },
      { label: "Avg. response", value: 1.2, suffix: "s" },
      { label: "Accuracy", value: 97, suffix: "%" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useConnectedModelConfig(): Omit<ConnectedModelProps, "isRtl"> {
  const t = useTranslations("ConnectedModel");

  return {
    eyebrow: t("eyebrow"),
    headlineLead: t("headlineLead"),
    headlineAccent: t("headlineAccent"),
    description: t("description"),
    signalsLabel: t("signalsLabel"),
    outputsLabel: t("outputsLabel"),
    hubLabel: t("hubLabel"),
    signals: SIGNALS,
    outputs: OUTPUTS,
    primaryLabel: t("primaryLabel"),
    primaryHref: "/contact",
    secondaryLabel: t("secondaryLabel"),
    secondaryHref: "/contact",
  };
}