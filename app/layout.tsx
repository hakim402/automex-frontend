// app/layout.tsx

import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  IBM_Plex_Sans_Arabic,
  Noto_Sans_SC,
  Noto_Sans_Arabic,
} from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";
import "./content-blocks.css";

import { Toaster } from "@/components/ui/sonner";
import { validateEnv } from "@/lib/env";
import { GoogleOauthProvider } from "@/providers/GoogleOauthProvider";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import OrganizationSchema from "@/components/seo/OrganizationSchema";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";

// Validate environment variables
validateEnv();

// ─────────────────────────────────────────────
// Fonts
// ─────────────────────────────────────────────

// English + European Languages
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-en",
  display: "swap",
});

// Optional: Monospace font for code blocks, stats, etc.
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Arabic
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-ar",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Chinese
const chinese = Noto_Sans_SC({
  subsets: ["latin"], // Use the Chinese subset if supported by your Next.js version
  variable: "--font-zh",
  display: "swap",
  weight: ["400", "500", "700"],
});

// Persian & Pashto
const persian = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-fa-ps",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// ─────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL("https://automex.tech"),

  title: {
    default: "AUTOMEX | AI Solutions & Enterprise Software",
    template: "%s | AUTOMEX",
  },

  description:
    "AUTOMEX delivers enterprise AI solutions, custom software development, intelligent automation, cloud engineering, and digital transformation services that help businesses innovate, streamline operations, and scale with confidence.",

  keywords: [
    "AI Solutions",
    "Enterprise Software",
    "Custom Software Development",
    "AI Automation",
    "Digital Transformation",
    "Cloud Solutions",
    "Web Development",
    "Mobile App Development",
    "AI Agents",
    "Business Automation",
  ],

  openGraph: {
    type: "website",
    url: "https://automex.tech",
    title: "AUTOMEX | AI Solutions & Enterprise Software",
    description:
      "Build intelligent software, AI-powered automation, and enterprise solutions designed for growth.",
    siteName: "AUTOMEX",
  },

  twitter: {
    card: "summary_large_image",
    title: "AUTOMEX | AI Solutions & Enterprise Software",
    description:
      "Enterprise AI, intelligent automation, and custom software built for modern businesses.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

// ─────────────────────────────────────────────
// Root Layout
// ─────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`
        ${geist.variable}
        ${geistMono.variable}
        ${arabic.variable}
        ${chinese.variable}
        ${persian.variable}
      `}
    >
      <body suppressHydrationWarning>
        {/* Structured Data */}
        <OrganizationSchema />
        <LocalBusinessSchema />

        {/* Providers */}
        <GoogleOauthProvider>
          {children}
          <Toaster />
          <WhatsAppButton />
        </GoogleOauthProvider>

        {/* Google Analytics */}
        <GoogleAnalytics gaId="G-523K1GWNYF" />
      </body>
    </html>
  );
}