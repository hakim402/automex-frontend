"use client";

// config/TechStackConfig.tsx  (or wherever you put it)
//
// Pre-configured data for <TechStack /> on the Home page.
// All SVG logos are inline React components — zero external CDN required.
// Brand colors are accurate to each tool's official palette.
//
// Usage:
//   const config = useTechStackConfig();
//   <TechStack {...config} isRtl={isRtl} />

import { useTranslations } from "next-intl";
import { Bot, BarChart3, GitBranch, Cloud, MessageSquare } from "lucide-react";
import type { TechStackProps, TechTool, TechCategory } from "@/components/shared/TechStack";

// ─────────────────────────────────────────────────────────────────────────────
// Inline SVG logos
// ─────────────────────────────────────────────────────────────────────────────

function OpenAILogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.374L15.115 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
    </svg>
  );
}

function AnthropicLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017L3.674 20H0L6.569 3.52zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z"/>
    </svg>
  );
}

function HubSpotLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.973 12.012c0-.898-.199-1.793-.577-2.622a7.006 7.006 0 0 0-1.645-2.232l.03-.04V4.32a1.33 1.33 0 0 0 .77-1.195V3.1c0-.733-.595-1.327-1.329-1.327h-.025c-.733 0-1.328.594-1.328 1.327v.025c0 .545.33 1.015.81 1.22v2.765a6.888 6.888 0 0 0-2.9-.288l-7.754-6.01a1.593 1.593 0 0 0 .056-.406C8.081.727 7.354 0 6.46 0c-.894 0-1.62.727-1.62 1.62 0 .895.726 1.621 1.62 1.621.28 0 .543-.073.772-.202l7.58 5.878a6.985 6.985 0 0 0-2.94 3.132 6.928 6.928 0 0 0-.488 3.642 6.961 6.961 0 0 0 1.416 3.35 6.99 6.99 0 0 0 2.888 2.178 7.009 7.009 0 0 0 7.636-1.553 6.95 6.95 0 0 0 1.538-2.254 6.905 6.905 0 0 0 .51-2.4zM18.38 15.9a3.946 3.946 0 0 1-2.26.705 3.912 3.912 0 0 1-2.764-1.145 3.892 3.892 0 0 1-1.14-2.761c0-1.039.408-2.034 1.14-2.768a3.912 3.912 0 0 1 2.764-1.145c1.038 0 2.035.409 2.77 1.145a3.893 3.893 0 0 1 1.142 2.768c0 .92-.33 1.812-.93 2.51a3.916 3.916 0 0 1-.722.691z"/>
    </svg>
  );
}

function SalesforceLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M10.012 4.309a4.62 4.62 0 0 1 3.318-1.403 4.657 4.657 0 0 1 4.107 2.477 5.786 5.786 0 0 1 2.12-.403 5.83 5.83 0 0 1 5.83 5.83 5.83 5.83 0 0 1-5.83 5.829 5.782 5.782 0 0 1-.978-.084 4.106 4.106 0 0 1-3.738 2.394 4.09 4.09 0 0 1-1.82-.425 4.872 4.872 0 0 1-4.562 3.164 4.875 4.875 0 0 1-4.648-3.434 4.387 4.387 0 0 1-.69.056A4.39 4.39 0 0 1 3.121 9.96a4.375 4.375 0 0 1-.33-2.11A4.617 4.617 0 0 1 10.012 4.31z"/>
    </svg>
  );
}

function SlackLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
    </svg>
  );
}

function AsanaLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.996 16.272a4.27 4.27 0 1 0 0-8.543 4.27 4.27 0 0 0 0 8.543zm-7.727.001a4.27 4.27 0 1 0 0-8.542 4.27 4.27 0 0 0 0 8.542zm15.454 0a4.27 4.27 0 1 0 0-8.542 4.27 4.27 0 0 0 0 8.542z"/>
    </svg>
  );
}

function NotionLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
    </svg>
  );
}

function JiraLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.757a5.215 5.215 0 0 0 5.214 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.021-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24.019 12.49V1.005A1.001 1.001 0 0 0 23.013 0z"/>
    </svg>
  );
}

function MakeComLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M10.937 3.143C5.82 3.25 1.5 7.393 1.5 12.5S5.82 21.75 10.937 21.857V3.143zm2.126 0v18.714C18.18 21.75 22.5 17.607 22.5 12.5S18.18 3.25 13.063 3.143zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/>
    </svg>
  );
}

function ZapierLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12c0 6.628-5.372 12-12 12-6.629 0-12-5.372-12-12C0 5.371 5.371 0 12 0c6.628 0 12 5.371 12 12zm-7.07-3.73l-2.95.428-.002.001-1.982-2.498-.008-.009-.006.011-1.974 2.498-2.951-.43-.012-.002.003.013.858 2.84-2.223 1.894-.01.009.013.002 2.931.426.004.001 1.982 2.498.007.009.007-.009 1.982-2.498 2.931-.426.013-.002-.011-.009-2.221-1.892.855-2.841.003-.013z"/>
    </svg>
  );
}

function AWSLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .41-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 0-.4-1.158c0-.335.073-.63.216-.886.144-.255.336-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z"/>
    </svg>
  );
}

function GCPLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.19 2.38a9.344 9.344 0 0 0-9.234 6.893L.59 12.33l2.37 3.07a9.344 9.344 0 0 0 9.23 6.22h5.7c3.007 0 5.7-1.56 7.22-4.05L23 12.33l-1.89-5.17a9.33 9.33 0 0 0-7.17-4.78h-1.75zm-1.3 5.56l1.3-.66 1.3.66v4.01l-1.3.66-1.3-.66V7.94zm-5.12 3.43 1.3-.66 1.3.66v4.01l-1.3.66-1.3-.66v-4.01zm10.23 0 1.3-.66 1.3.66v4.01l-1.3.66-1.3-.66v-4.01z"/>
    </svg>
  );
}

function AzureLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.05 4.24L6.56 18.05l-2.34-3.85 6.4-2.93L6.5 5.2l6.55-.96zM6.56 18.64l8.96-.98L24 18.6l-7.13-1.23 3.34-12.15-3.58 3.06-10.07 8.36z"/>
    </svg>
  );
}

function VercelLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 22.525H0l12-21.05 12 21.05z"/>
    </svg>
  );
}

function SupabaseLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 13.05c-.542.683-.04 1.68.825 1.68h7.376l.463 8.234c.015.986 1.26 1.41 1.874.637l9.262-12.152c.542-.683.04-1.68-.825-1.68h-7.37L11.9 1.036z"/>
    </svg>
  );
}

function PostgreSQLLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 12c0 .453-.023.902-.068 1.34-.058.55-.476.97-1.01 1.04a9.63 9.63 0 0 1-1.256.05c-.41 0-.824-.016-1.237-.05v2.62c0 .543-.44.983-.984.983H5.055a.983.983 0 0 1-.984-.983v-2.62c-.413.034-.827.05-1.237.05-.424 0-.845-.017-1.256-.05a1.059 1.059 0 0 1-1.01-1.04A11.57 11.57 0 0 1 .5 12C.5 5.649 5.649.5 12 .5S23.5 5.649 23.5 12z"/>
    </svg>
  );
}

function WhatsAppLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  );
}

function TelegramLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

function ZoomLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-6.253-3.077c-.213-.108-.416-.044-.545.032l-2.349 1.368V8.937a.726.726 0 0 0-.726-.726H6.337a.726.726 0 0 0-.726.726v6.126c0 .401.325.726.726.726h8.79a.726.726 0 0 0 .726-.726v-1.386l2.349 1.368c.13.077.332.14.545.032.205-.104.326-.312.326-.54V9.462c0-.228-.121-.437-.326-.54z"/>
    </svg>
  );
}

function LinearLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M0 14.448L9.552 24l-1.03-5.127L0 14.448zm0-1.871l8.525 8.525-.764-3.807L0 12.577zm13.756 10.11L2.808 11.99 1.42 10.6 13.756 22.934zm-2.78-13.573L2.144 9.843.424 8.122 10.976 18.673l1-.999zm5.89 10.285L5.415 7.098 3.68 5.363l13.187 13.188zm-4.636-14.57L8.23 4.203 22.42 18.394l-1.817-8.143zm3.54-5.8L24 8.229l-3.447-8.23h-3.783zm-3.03 0L23.993 12.25l-.243-4.02L16.547 0h-3.807zM0 21.27l3.384 3.384 1.001-1.001L0 21.27zm0-7.646l7.22 7.22L6.218 15.08 0 13.624z"/>
    </svg>
  );
}

function FigmaLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.39 4.49zm-.098-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019 3.019-1.355 3.019-3.019-1.355-3.019-3.019-3.019z"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES: TechCategory[] = [
  { id: "AI",            label: "AI & LLMs",      icon: Bot           },
  { id: "CRM",           label: "CRM & Sales",    icon: BarChart3     },
  { id: "Productivity",  label: "Productivity",   icon: GitBranch     },
  { id: "Cloud",         label: "Cloud & Infra",  icon: Cloud         },
  { id: "Communication", label: "Communication",  icon: MessageSquare },
];

// ─────────────────────────────────────────────────────────────────────────────
// Tools
// ─────────────────────────────────────────────────────────────────────────────

const TOOLS: TechTool[] = [
  // AI & LLMs
  { name: "OpenAI",     category: "AI",            color: "#10a37f", logo: OpenAILogo,     description: "GPT-4o, Assistants API, embeddings"     },
  { name: "Anthropic",  category: "AI",            color: "#c96442", logo: AnthropicLogo,  description: "Claude 3.5 for reasoning & analysis"    },
  { name: "Make.com",   category: "AI",            color: "#6d00cc", logo: MakeComLogo,    description: "Visual automation workflows"             },
  { name: "Zapier",     category: "AI",            color: "#ff4a00", logo: ZapierLogo,     description: "No-code AI task automation"              },

  // CRM & Sales
  { name: "HubSpot",    category: "CRM",           color: "#ff7a59", logo: HubSpotLogo,    description: "CRM, marketing & sales automation"      },
  { name: "Salesforce", category: "CRM",           color: "#00a1e0", logo: SalesforceLogo, description: "Enterprise CRM & cloud platform"         },

  // Productivity
  { name: "Asana",      category: "Productivity",  color: "#f06a6a", logo: AsanaLogo,      description: "Task & project management"               },
  { name: "Notion",     category: "Productivity",  color: "#000000", logo: NotionLogo,     description: "Docs, wikis & databases"                 },
  { name: "Jira",       category: "Productivity",  color: "#0052cc", logo: JiraLogo,       description: "Issue tracking & agile sprints"          },
  { name: "Linear",     category: "Productivity",  color: "#5e6ad2", logo: LinearLogo,     description: "Modern issue & project tracker"          },
  { name: "Figma",      category: "Productivity",  color: "#f24e1e", logo: FigmaLogo,      description: "Design & prototyping"                   },

  // Cloud & Infra
  { name: "AWS",        category: "Cloud",         color: "#ff9900", logo: AWSLogo,        description: "Compute, S3, Lambda, RDS"                },
  { name: "Google Cloud", category: "Cloud",       color: "#4285f4", logo: GCPLogo,        description: "GKE, BigQuery, Vertex AI"                },
  { name: "Azure",      category: "Cloud",         color: "#0078d4", logo: AzureLogo,      description: "Microsoft cloud & AI services"           },
  { name: "Vercel",     category: "Cloud",         color: "#000000", logo: VercelLogo,     description: "Frontend deployment & edge"              },
  { name: "Supabase",   category: "Cloud",         color: "#3ecf8e", logo: SupabaseLogo,   description: "Open-source Firebase alternative"        },
  { name: "PostgreSQL", category: "Cloud",         color: "#4169e1", logo: PostgreSQLLogo, description: "Production relational database"           },

  // Communication
  { name: "Slack",      category: "Communication", color: "#4a154b", logo: SlackLogo,      description: "Team messaging & bot integration"        },
  { name: "WhatsApp",   category: "Communication", color: "#25d366", logo: WhatsAppLogo,   description: "Business messaging API"                  },
  { name: "Telegram",   category: "Communication", color: "#2ca5e0", logo: TelegramLogo,   description: "Bot API & channel automation"            },
  { name: "Zoom",       category: "Communication", color: "#2d8cff", logo: ZoomLogo,       description: "Video meetings & webinars"               },
];

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useTechStackConfig(): Omit<TechStackProps, "isRtl"> {
  const t = useTranslations("TechStack");

  return {
    eyebrow:     t("eyebrow"),
    title:       t("title"),
    accentWord:  t("accentWord"),
    description: t("description"),
    allLabel:    t("allLabel"),
    categories:  CATEGORIES,
    tools:       TOOLS,
  };
}