---
kind: external_dependency
name: next-intl Internationalization
slug: next-intl
category: external_dependency
category_hints:
    - framework_behavior
scope:
    - '**'
---

### next-intl routing + middleware
- Supported locales are declared in `i18n/routing.ts` and message bundles live in `messages/{ar,de,en,es,fa,fr,it,nl,ps,zh}.json`.
- Route protection logic strips the locale prefix before matching protected/auth/public route lists.