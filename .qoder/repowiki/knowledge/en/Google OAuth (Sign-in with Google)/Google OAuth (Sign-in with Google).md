---
kind: external_dependency
name: Google OAuth (Sign-in with Google)
slug: google-oauth
category: external_dependency
category_hints:
    - vendor_identity
    - auth_protocol
scope:
    - '**'
---

### Google OAuth integration
- Frontend uses `@react-oauth/google` to obtain a Google ID token, then exchanges it server-side via `POST /auth/google/` (`lib/auth.ts` `googleLogin`).
- The backend returns a standard `{ access, refresh, access_expires_at }` token pair that the frontend stores in `localStorage` and syncs to a session cookie via `/api/auth/session`.