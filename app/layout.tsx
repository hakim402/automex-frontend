// app/layout.tsx
import type { Metadata } from "next";
import {
  Cairo,
  Poppins,
  Noto_Sans_SC,
  Noto_Naskh_Arabic,
} from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { validateEnv } from "@/lib/env";
import { GoogleOauthProvider } from "@/providers/GoogleOauthProvider";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import OrganizationSchema from "@/components/seo/OrganizationSchema";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";

// Validate env at startup
validateEnv();

// ─── Fonts ──────────────────────────────────────

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-en",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-ar",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-zh",
  weight: ["400", "500", "700"],
  display: "swap",
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-fa-ps",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// ─── Metadata ─────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL("https://automex.tech"),
  title: {
    template: "%s | AUTOMEX",
    default: "AUTOMEX - AI Solutions & Technology Services",
  },
  description:
    "AUTOMEX delivers AI solutions, custom software development, web & mobile apps, and digital transformation services to help businesses scale and innovate.",
};

// ─── Root Layout ─────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`
        ${poppins.variable}
        ${cairo.variable}
        ${notoSansSC.variable}
        ${notoNaskhArabic.variable}
      `}
    >
      <body suppressHydrationWarning>
        {/* Global Schemas */}
        <OrganizationSchema />
        <LocalBusinessSchema />

        <GoogleOauthProvider>
          {children}
          <Toaster />
          <WhatsAppButton />
        </GoogleOauthProvider>

        {/* ─── Google Analytics ────────────────────────── */}
        <GoogleAnalytics gaId="G-523K1GWNYF" />
      </body>
    </html>
  );
}