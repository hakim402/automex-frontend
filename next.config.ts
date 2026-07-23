// next.config.ts

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ── Unsplash (placeholder / editorial images) ──────────────────────────
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "cdn.automex.tech",  // Your CDN
        pathname: "/**",
      },

      // ── Django backend (development) ────────────────────────────────
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8001",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);