---
kind: external_dependency
name: Groq LLM Provider
slug: groq
category: external_dependency
category_hints:
    - vendor_identity
scope:
    - '**'
---

### Groq-backed AI assistant
- The backend's `apps/assistant/` app is documented as using Groq (`openai/gpt-oss-120b`) for the AI Sales Assistant chat endpoint (`POST /api/v1/assistant/chat/`).
- The frontend has a typed client wrapper (`lib/automex/assistant.ts`) ready to call this endpoint; the widget UI itself is listed as a planned Phase 4 feature.
- This is a backend-only dependency from the frontend's perspective — no direct SDK import in this repo.