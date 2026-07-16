// app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AUTOMEX - AI Solutions & Technology Services",
    short_name: "AUTOMEX",
    description: "AI solutions, software development, and digital transformation services.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    icons: [
      {
        src: "/logo/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}