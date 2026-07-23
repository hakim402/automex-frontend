---
kind: business_term
name: Business Glossary
category: business_term
scope:
    - '**'
---

### AutomexApiError
- Definition：The frontend's domain-specific error class thrown by `lib/automex/client.ts` when calling the AUTOMEX Django API. It carries a `kind` discriminator (`validation` | `not_found` | `rate_limited` | `auth_config` | `unknown`) so callers can distinguish user-facing validation failures from configuration errors (missing/invalid API key) without inspecting HTTP status codes.

### AUTOMEX_API_KEY
- Definition：Server-only environment variable holding the Django `X-API-Key` value used to authenticate all public read/write calls through `lib/automex/client.ts`. Must be created on the backend via `python manage.py create_api_key --name "automex-frontend-web"`; missing it causes every automex fetch to throw an `auth_config` error.

### X-API-Key
- Definition：HTTP header required by the AUTOMEX Django backend's `/api/v1/` endpoints. The frontend injects it automatically via `automexFetch` in `lib/automex/client.ts`; it is distinct from the JWT `Authorization: Bearer <token>` header used by the `/auth/*` user-account endpoints.

### access_expires_at
- Definition：Timestamp returned by the backend's token endpoints indicating when the current JWT access token will expire. The frontend stores it alongside `access` and `refresh` in `localStorage` and proactively refreshes the token pair when the remaining lifetime drops below 30 seconds.

### auth_status
- Definition：A lightweight cookie set to `1` after a successful login (`POST /api/auth/session`) and cleared on logout (`DELETE /api/auth/session`). The Next.js middleware reads this cookie to decide whether to protect routes or redirect logged-in users away from sign-in pages.

### revalidate window
- Definition：Next.js ISR revalidation intervals applied per content category: `content` (5–15 min, middle value 600 s) for Services/Case Studies/Blog posts, `taxonomy` (1 h) for Technologies/Industries/Process Steps/Categories, and `people` (15–30 min, middle value 1200 s) for Team/Testimonials. Defined centrally in `lib/automex/content.ts`.

### slot id
- Definition：UUID of a specific consultation time slot returned by `GET /crm/bookings/availability/?date=YYYY-MM-DD`. When submitting a booking, the frontend must pass this UUID as `input.slot` — not a weekday number or time string — because the slot may have been filled between the availability check and the submit call.
