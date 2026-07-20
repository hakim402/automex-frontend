---
kind: logging_system
name: No Centralized Logging System — Ad-hoc console.error Usage
category: logging_system
scope:
    - '**'
source_files:
    - lib/automex/client.ts
    - app/api/contact/route.ts
    - app/[locale]/(routes)/crm/actions.ts
    - app/[locale]/(auth)/forgot-password/page.tsx
    - components/WhatsAppButton.tsx
---

This repository does not implement a centralized logging system. There is no dedicated logger library (e.g., pino, winston, bunyan, signale), no shared logger module, and no log-level configuration or structured-log formatting convention.

Error output is scattered across the codebase as bare `console.error()` / `console.warn()` calls with ad-hoc string prefixes:
- `lib/automex/client.ts` — logs `[automex] 403 from ${path} — AUTOMEX_API_KEY is missing...`
- `app/api/contact/route.ts` — logs `[contact] Missing GMAIL_USER...` and `[contact] Failed to send email:`
- `app/[locale]/(routes)/crm/actions.ts` — logs `[${context}]`, err
- `app/[locale]/(auth)/forgot-password/page.tsx` — logs `[forgot-password]`, err
- `components/WhatsAppButton.tsx` — warns about missing `NEXT_PUBLIC_WHATSAPP_SUPPORT`
- `i18n/request.ts` — contains commented-out `console.log` debug lines

There is no central place to configure sinks, rotation, or aggregation; all output goes to the Node.js process stdout/stderr via the built-in console API. No environment-based log-level toggling exists, and there are no structured fields beyond simple bracketed context tags.