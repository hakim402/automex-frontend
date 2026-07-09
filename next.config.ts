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
    ],
  },
};

export default withNextIntl(nextConfig);