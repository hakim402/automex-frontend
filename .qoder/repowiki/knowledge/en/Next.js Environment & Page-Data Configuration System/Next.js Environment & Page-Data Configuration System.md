---
kind: configuration_system
name: Next.js Environment & Page-Data Configuration System
category: configuration_system
scope:
    - '**'
source_files:
    - lib/env.ts
    - lib/automex/env.server.ts
    - config/ConnectedModelConfig.tsx
    - config/HowItWorksConfig.tsx
    - config/TechStackConfig.tsx
    - next.config.ts
---

The AUTOMEX frontend uses a two-layer configuration approach: runtime environment variables for secrets and endpoints, plus client-side data configuration files for page content.

Runtime Environment Variables
All env access is centralized through lib/env.ts, which exports lazy getters (getApiBaseUrl, getGoogleClientId, getAppUrl) rather than module-level reads. This avoids Next.js static-inlining pitfalls where process.env appears undefined during SSR hydration before the build-time replacement runs. A validateEnv() function performs server-only startup validation of required keys (NEXT_PUBLIC_API_BASE_URL, NEXT_PUBLIC_GOOGLE_CLIENT_ID) and throws a descriptive error listing missing vars. The file also exposes backwards-compatible constants (API_BASE_URL, GOOGLE_CLIENT_ID, APP_URL) computed via IIFE getters so existing imports keep working.
Server-only secrets live in lib/automex/env.server.ts, which imports server-only to make the build fail if any client component transitively imports it. It provides getAutomexApiKey() and validateAutomexEnv() for the backend API key used by CRM/content APIs.
Environment variable categories found across the codebase:
- NEXT_PUBLIC_API_BASE_URL — base URL for all API calls (must not have trailing slash)
- NEXT_PUBLIC_GOOGLE_CLIENT_ID — Google OAuth client ID
- NEXT_PUBLIC_APP_URL / NEXT_PUBLIC_SITE_URL — application base URL (alias for SEO)
- AUTOMEX_API_KEY — server-only backend API key
- GMAIL_USER / GMAIL_APP_PASSWORD — SMTP credentials for contact route handler
- NEXT_PUBLIC_WHATSAPP_SUPPORT / NEXT_PUBLIC_CONTACT_EMAIL / NEXT_PUBLIC_SUPPORT_EMAIL — contact defaults with hardcoded fallbacks
.env* files are gitignored; no .env.example exists in the repo.

Page Data Configuration Files
Static marketing content is configured via React hooks in config/:
- config/ConnectedModelConfig.tsx — defines signal sources, output cards, and copy for the ConnectedModel section
- config/HowItWorksConfig.tsx — defines flow steps, pipeline nodes/edges, and agent task scenarios
- config/TechStackConfig.tsx — defines tool categories, tools with inline SVG logos, and descriptions
Each config file exports a useXxxConfig() hook that returns typed props consumed by shared components under components/shared/. All user-facing strings inside these configs go through next-intl's useTranslations("SectionName"), keeping them translatable despite being defined in JS.

Build-Time Configuration
next.config.ts configures image remote patterns (Unsplash, CDN) and wraps the config with the next-intl plugin. No other build-time config files (e.g., .env.*, YAML, TOML) exist at the root.

Conventions developers should follow
1. Never read process.env directly in components — use the getters from lib/env.ts or lib/automex/env.server.ts.
2. Server-only secrets must be accessed only from lib/automex/env.server.ts; importing it in a "use client" file will cause a build failure.
3. New page sections should add a new file under config/ exporting a useXxxConfig() hook returning typed props, and reference translation keys via useTranslations("SectionName").
4. Required env vars should be added to REQUIRED_KEYS in lib/env.ts and validated via validateEnv() called once from a server component layout.
5. Contact-related defaults (WhatsApp number, email) may be read directly as fallbacks but should ideally be migrated into the env getter pattern.