# Debugging and Performance Profiling

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [package.json](file://package.json)
- [next.config.ts](file://next.config.ts)
- [proxy.ts](file://proxy.ts)
- [app/layout.tsx](file://app/layout.tsx)
- [app/[locale]/layout.tsx](file://app/[locale]/layout.tsx)
- [app/[locale]/dashboard/layout.tsx](file://app/[locale]/dashboard/layout.tsx)
- [app/api/auth/session/route.ts](file://app/api/auth/session/route.ts)
- [app/api/contact/route.ts](file://app/api/contact/route.ts)
- [lib/api.ts](file://lib/api.ts)
- [lib/auth.ts](file://lib/auth.ts)
- [contexts/AuthContext.tsx](file://contexts/AuthContext.tsx)
- [providers/theme-provider.tsx](file://providers/theme-provider.tsx)
- [app/[locale]/_components/Theme/theme-toggle.tsx](file://app/[locale]/_components/Theme/theme-toggle.tsx)
- [i18n/request.ts](file://i18n/request.ts)
- [i18n/routing.ts](file://i18n/routing.ts)
- [messages/en.json](file://messages/en.json)
- [app/[locale]/(auth)/layout.tsx](file://app/[locale]/(auth)/layout.tsx)
- [app/[locale]/(auth)/sign-in/page.tsx](file://app/[locale]/(auth)/sign-in/page.tsx)
- [app/[locale]/(auth)/sign-up/page.tsx](file://app/[locale]/(auth)/sign-up/page.tsx)
- [app/[locale]/(auth)/forgot-password/page.tsx](file://app/[locale]/(auth)/forgot-password/page.tsx)
- [app/[locale]/(auth)/auth/magic-link/page.tsx](file://app/[locale]/(auth)/auth/magic-link/page.tsx)
- [app/[locale]/(auth)/auth/reset-password/page.tsx](file://app/[locale]/(auth)/auth/reset-password/page.tsx)
- [app/[locale]/(auth)/auth/verify-email/page.tsx](file://app/[locale]/(auth)/auth/verify-email/page.tsx)
- [app/[locale]/(routes)/crm/actions.ts](file://app/[locale]/(routes)/crm/actions.ts)
- [app/[locale]/(routes)/services/actions.ts](file://app/[locale]/(routes)/services/actions.ts)
- [app/[locale]/(routes)/crm/_components/crm-shared/hooks/useCrmFormSubmit.ts](file://app/[locale]/(routes)/crm/_components/crm-shared/hooks/useCrmFormSubmit.ts)
- [app/[locale]/(routes)/crm/_components/crm-shared/fields/schemas.ts](file://app/[locale]/(routes)/crm/_components/crm-shared/fields/schemas.ts)
- [app/[locale]/dashboard/(routes)/profile/page.tsx](file://app/[locale]/dashboard/(routes)/profile/page.tsx)
- [app/[locale]/dashboard/(routes)/security/page.tsx](file://app/[locale]/dashboard/(routes)/security/page.tsx)
- [app/[locale]/dashboard/_components/DashboardMain.tsx](file://app/[locale]/dashboard/_components/DashboardMain.tsx)
</cite>

## Table of Contents
1. Introduction
2. Project Structure
3. Core Components
4. Architecture Overview
5. Detailed Component Analysis
6. Dependency Analysis
7. Performance Considerations
8. Troubleshooting Guide
9. Conclusion
10. Appendices

## Introduction
This guide provides a comprehensive approach to debugging and performance profiling the Automex frontend application built with Next.js. It covers browser developer tools usage, React DevTools integration, Next.js-specific debugging techniques, API request debugging, authentication flow troubleshooting, form validation debugging, performance profiling, bundle analysis, memory leak detection, internationalization (i18n) debugging, theme switching issues, dashboard functionality debugging, logging strategies, error tracking integration, and production debugging techniques.

## Project Structure
The project follows a Next.js App Router structure with:
- Internationalized routes under app/[locale]
- Authentication pages under (auth) route group
- Public routes under (routes) route group
- Dashboard routes under app/[locale]/dashboard
- API routes under app/api
- Shared UI components under components/ui
- Contexts for auth and sidebar state
- Providers for theme and Google OAuth
- i18n configuration and messages
- Centralized API client and auth utilities

```mermaid
graph TB
subgraph "App Router"
L1["app/layout.tsx"]
L2["app/[locale]/layout.tsx"]
DLayout["app/[locale]/dashboard/layout.tsx"]
end
subgraph "Auth Pages"
A1["(auth)/layout.tsx"]
A2["(auth)/sign-in/page.tsx"]
A3["(auth)/sign-up/page.tsx"]
A4["(auth)/forgot-password/page.tsx"]
A5["(auth)/auth/magic-link/page.tsx"]
A6["(auth)/auth/reset-password/page.tsx"]
A7["(auth)/auth/verify-email/page.tsx"]
end
subgraph "Public Routes"
R1["(routes)/crm/actions.ts"]
R2["(routes)/services/actions.ts"]
R3["(routes)/crm/_components/crm-shared/hooks/useCrmFormSubmit.ts"]
R4["(routes)/crm/_components/crm-shared/fields/schemas.ts"]
end
subgraph "Dashboard"
DM["dashboard/_components/DashboardMain.tsx"]
DP["dashboard/(routes)/profile/page.tsx"]
DS["dashboard/(routes)/security/page.tsx"]
end
subgraph "API"
API1["api/auth/session/route.ts"]
API2["api/contact/route.ts"]
end
subgraph "Shared"
Ctx["contexts/AuthContext.tsx"]
Prov["providers/theme-provider.tsx"]
ThemeToggle["app/[locale]/_components/Theme/theme-toggle.tsx"]
I18NReq["i18n/request.ts"]
I18NRout["i18n/routing.ts"]
LibApi["lib/api.ts"]
LibAuth["lib/auth.ts"]
end
L1 --> L2
L2 --> A1
A1 --> A2
A1 --> A3
A1 --> A4
A1 --> A5
A1 --> A6
A1 --> A7
L2 --> R1
L2 --> R2
R1 --> R3
R1 --> R4
L2 --> DLayout
DLayout --> DM
DM --> DP
DM --> DS
A2 --> API1
A3 --> API1
R3 --> API2
R3 --> R4
L2 --> Ctx
L2 --> Prov
Prov --> ThemeToggle
L2 --> I18NReq
L2 --> I18NRout
R3 --> LibApi
A2 --> LibAuth
```

**Diagram sources**
- [app/layout.tsx](file://app/layout.tsx)
- [app/[locale]/layout.tsx](file://app/[locale]/layout.tsx)
- [app/[locale]/dashboard/layout.tsx](file://app/[locale]/dashboard/layout.tsx)
- [app/[locale]/(auth)/layout.tsx](file://app/[locale]/(auth)/layout.tsx)
- [app/[locale]/(auth)/sign-in/page.tsx](file://app/[locale]/(auth)/sign-in/page.tsx)
- [app/[locale]/(auth)/sign-up/page.tsx](file://app/[locale]/(auth)/sign-up/page.tsx)
- [app/[locale]/(auth)/forgot-password/page.tsx](file://app/[locale]/(auth)/forgot-password/page.tsx)
- [app/[locale]/(auth)/auth/magic-link/page.tsx](file://app/[locale]/(auth)/auth/magic-link/page.tsx)
- [app/[locale]/(auth)/auth/reset-password/page.tsx](file://app/[locale]/(auth)/auth/reset-password/page.tsx)
- [app/[locale]/(auth)/auth/verify-email/page.tsx](file://app/[locale]/(auth)/auth/verify-email/page.tsx)
- [app/[locale]/(routes)/crm/actions.ts](file://app/[locale]/(routes)/crm/actions.ts)
- [app/[locale]/(routes)/services/actions.ts](file://app/[locale]/(routes)/services/actions.ts)
- [app/[locale]/(routes)/crm/_components/crm-shared/hooks/useCrmFormSubmit.ts](file://app/[locale]/(routes)/crm/_components/crm-shared/hooks/useCrmFormSubmit.ts)
- [app/[locale]/(routes)/crm/_components/crm-shared/fields/schemas.ts](file://app/[locale]/(routes)/crm/_components/crm-shared/fields/schemas.ts)
- [app/[locale]/dashboard/_components/DashboardMain.tsx](file://app/[locale]/dashboard/_components/DashboardMain.tsx)
- [app/[locale]/dashboard/(routes)/profile/page.tsx](file://app/[locale]/dashboard/(routes)/profile/page.tsx)
- [app/[locale]/dashboard/(routes)/security/page.tsx](file://app/[locale]/dashboard/(routes)/security/page.tsx)
- [app/api/auth/session/route.ts](file://app/api/auth/session/route.ts)
- [app/api/contact/route.ts](file://app/api/contact/route.ts)
- [contexts/AuthContext.tsx](file://contexts/AuthContext.tsx)
- [providers/theme-provider.tsx](file://providers/theme-provider.tsx)
- [app/[locale]/_components/Theme/theme-toggle.tsx](file://app/[locale]/_components/Theme/theme-toggle.tsx)
- [i18n/request.ts](file://i18n/request.ts)
- [i18n/routing.ts](file://i18n/routing.ts)
- [lib/api.ts](file://lib/api.ts)
- [lib/auth.ts](file://lib/auth.ts)

**Section sources**
- [README.md](file://README.md)
- [package.json](file://package.json)
- [next.config.ts](file://next.config.ts)

## Core Components
Key areas relevant to debugging and profiling:
- Authentication context and providers
- API client and server routes
- Form submission hooks and schemas
- Theme provider and toggle
- i18n request and routing

These components are central to diagnosing runtime behavior, network requests, state changes, and rendering performance.

**Section sources**
- [contexts/AuthContext.tsx](file://contexts/AuthContext.tsx)
- [lib/api.ts](file://lib/api.ts)
- [lib/auth.ts](file://lib/auth.ts)
- [app/api/auth/session/route.ts](file://app/api/auth/session/route.ts)
- [app/api/contact/route.ts](file://app/api/contact/route.ts)
- [app/[locale]/(routes)/crm/_components/crm-shared/hooks/useCrmFormSubmit.ts](file://app/[locale]/(routes)/crm/_components/crm-shared/hooks/useCrmFormSubmit.ts)
- [app/[locale]/(routes)/crm/_components/crm-shared/fields/schemas.ts](file://app/[locale]/(routes)/crm/_components/crm-shared/fields/schemas.ts)
- [providers/theme-provider.tsx](file://providers/theme-provider.tsx)
- [app/[locale]/_components/Theme/theme-toggle.tsx](file://app/[locale]/_components/Theme/theme-toggle.tsx)
- [i18n/request.ts](file://i18n/request.ts)
- [i18n/routing.ts](file://i18n/routing.ts)

## Architecture Overview
The application uses Next.js App Router with internationalized routes and an internal API layer. Authentication flows interact with session endpoints, while CRM and contact forms submit via server actions or API routes. The theme provider manages global theme state, and i18n is configured per-request.

```mermaid
sequenceDiagram
participant Dev as "Developer"
participant Browser as "Browser DevTools"
participant Next as "Next.js App Router"
participant AuthCtx as "AuthContext"
participant API as "lib/api.ts"
participant Route as "app/api/*"
participant Server as "Backend API"
Dev->>Browser : Open Network tab
Dev->>Next : Navigate to sign-in page
Next->>AuthCtx : Initialize auth state
AuthCtx->>API : Request session
API->>Route : GET /api/auth/session
Route-->>API : Session payload
API-->>AuthCtx : Update user state
Dev->>Browser : Inspect XHR/fetch calls
Dev->>Next : Submit CRM form
Next->>API : POST /api/contact
API->>Server : Forward request
Server-->>API : Response
API-->>Next : Handle success/error
Next-->>Dev : UI updates
```

**Diagram sources**
- [app/[locale]/(auth)/sign-in/page.tsx](file://app/[locale]/(auth)/sign-in/page.tsx)
- [contexts/AuthContext.tsx](file://contexts/AuthContext.tsx)
- [lib/api.ts](file://lib/api.ts)
- [app/api/auth/session/route.ts](file://app/api/auth/session/route.ts)
- [app/api/contact/route.ts](file://app/api/contact/route.ts)
- [app/[locale]/(routes)/crm/_components/crm-shared/hooks/useCrmFormSubmit.ts](file://app/[locale]/(routes)/crm/_components/crm-shared/hooks/useCrmFormSubmit.ts)

## Detailed Component Analysis

### Authentication Flow Debugging
Focus on session retrieval, login/signup flows, and password reset/magic link verification. Use React DevTools to inspect AuthContext state transitions and verify API responses from session endpoints.

```mermaid
sequenceDiagram
participant User as "User"
participant SignIn as "Sign-In Page"
participant AuthCtx as "AuthContext"
participant API as "lib/api.ts"
participant SessionRoute as "GET /api/auth/session"
participant Backend as "Backend API"
User->>SignIn : Enter credentials
SignIn->>AuthCtx : Dispatch login action
AuthCtx->>API : Call login endpoint
API->>SessionRoute : Request session
SessionRoute->>Backend : Validate credentials
Backend-->>SessionRoute : Token/user info
SessionRoute-->>API : Session data
API-->>AuthCtx : Persist token/state
AuthCtx-->>SignIn : Redirect/dashboard access
```

**Diagram sources**
- [app/[locale]/(auth)/sign-in/page.tsx](file://app/[locale]/(auth)/sign-in/page.tsx)
- [contexts/AuthContext.tsx](file://contexts/AuthContext.tsx)
- [lib/api.ts](file://lib/api.ts)
- [app/api/auth/session/route.ts](file://app/api/auth/session/route.ts)

**Section sources**
- [app/[locale]/(auth)/layout.tsx](file://app/[locale]/(auth)/layout.tsx)
- [app/[locale]/(auth)/sign-in/page.tsx](file://app/[locale]/(auth)/sign-in/page.tsx)
- [app/[locale]/(auth)/sign-up/page.tsx](file://app/[locale]/(auth)/sign-up/page.tsx)
- [app/[locale]/(auth)/forgot-password/page.tsx](file://app/[locale]/(auth)/forgot-password/page.tsx)
- [app/[locale]/(auth)/auth/magic-link/page.tsx](file://app/[locale]/(auth)/auth/magic-link/page.tsx)
- [app/[locale]/(auth)/auth/reset-password/page.tsx](file://app/[locale]/(auth)/auth/reset-password/page.tsx)
- [app/[locale]/(auth)/auth/verify-email/page.tsx](file://app/[locale]/(auth)/auth/verify-email/page.tsx)
- [app/api/auth/session/route.ts](file://app/api/auth/session/route.ts)
- [lib/auth.ts](file://lib/auth.ts)

### API Request Debugging
Use the Network tab to inspect all fetch/XHR calls. For CRM and contact submissions, validate payloads and responses at both client and server sides. Add console logs around API calls to trace timing and errors.

```mermaid
flowchart TD
Start(["Start Request"]) --> BuildPayload["Build Payload<br/>useCrmFormSubmit.ts"]
BuildPayload --> ValidateSchema["Validate Schema<br/>schemas.ts"]
ValidateSchema --> Valid{"Valid?"}
Valid --> |No| ShowErrors["Show Validation Errors"]
Valid --> |Yes| SendRequest["Send Request<br/>lib/api.ts -> /api/contact"]
SendRequest --> Response{"Response OK?"}
Response --> |No| HandleError["Handle Error<br/>UI feedback"]
Response --> |Yes| UpdateState["Update State<br/>Success feedback"]
ShowErrors --> End(["End"])
HandleError --> End
UpdateState --> End
```

**Diagram sources**
- [app/[locale]/(routes)/crm/_components/crm-shared/hooks/useCrmFormSubmit.ts](file://app/[locale]/(routes)/crm/_components/crm-shared/hooks/useCrmFormSubmit.ts)
- [app/[locale]/(routes)/crm/_components/crm-shared/fields/schemas.ts](file://app/[locale]/(routes)/crm/_components/crm-shared/fields/schemas.ts)
- [lib/api.ts](file://lib/api.ts)
- [app/api/contact/route.ts](file://app/api/contact/route.ts)

**Section sources**
- [app/[locale]/(routes)/crm/actions.ts](file://app/[locale]/(routes)/crm/actions.ts)
- [app/[locale]/(routes)/services/actions.ts](file://app/[locale]/(routes)/services/actions.ts)
- [app/[locale]/(routes)/crm/_components/crm-shared/hooks/useCrmFormSubmit.ts](file://app/[locale]/(routes)/crm/_components/crm-shared/hooks/useCrmFormSubmit.ts)
- [app/[locale]/(routes)/crm/_components/crm-shared/fields/schemas.ts](file://app/[locale]/(routes)/crm/_components/crm-shared/fields/schemas.ts)
- [app/api/contact/route.ts](file://app/api/contact/route.ts)

### Form Validation Debugging
Inspect schema definitions and hook logic to ensure correct field rules and error propagation. Use React DevTools to observe component re-renders triggered by validation state changes.

**Section sources**
- [app/[locale]/(routes)/crm/_components/crm-shared/fields/schemas.ts](file://app/[locale]/(routes)/crm/_components/crm-shared/fields/schemas.ts)
- [app/[locale]/(routes)/crm/_components/crm-shared/hooks/useCrmFormSubmit.ts](file://app/[locale]/(routes)/crm/_components/crm-shared/hooks/useCrmFormSubmit.ts)

### Theme Switching Debugging
Verify that the theme provider initializes correctly and toggles propagate across components. Check local storage persistence and CSS class application.

**Section sources**
- [providers/theme-provider.tsx](file://providers/theme-provider.tsx)
- [app/[locale]/_components/Theme/theme-toggle.tsx](file://app/[locale]/_components/Theme/theme-toggle.tsx)

### Internationalization (i18n) Debugging
Ensure locale selection persists and messages load correctly. Confirm HTML lang/direction attributes update and routing respects locale prefixes.

**Section sources**
- [i18n/request.ts](file://i18n/request.ts)
- [i18n/routing.ts](file://i18n/routing.ts)
- [messages/en.json](file://messages/en.json)

### Dashboard Functionality Debugging
Monitor layout and main container renders. Verify navigation between profile and security sections without unnecessary re-renders.

**Section sources**
- [app/[locale]/dashboard/layout.tsx](file://app/[locale]/dashboard/layout.tsx)
- [app/[locale]/dashboard/_components/DashboardMain.tsx](file://app/[locale]/dashboard/_components/DashboardMain.tsx)
- [app/[locale]/dashboard/(routes)/profile/page.tsx](file://app/[locale]/dashboard/(routes)/profile/page.tsx)
- [app/[locale]/dashboard/(routes)/security/page.tsx](file://app/[locale]/dashboard/(routes)/security/page.tsx)

## Dependency Analysis
Core dependencies include Next.js, React, Tailwind CSS, and UI primitives. Proxy configuration may be used during development to forward API calls.

```mermaid
graph TB
Pkg["package.json"]
NextCfg["next.config.ts"]
Proxy["proxy.ts"]
RootLayout["app/layout.tsx"]
LocaleLayout["app/[locale]/layout.tsx"]
Pkg --> NextCfg
NextCfg --> RootLayout
NextCfg --> LocaleLayout
Proxy --> RootLayout
```

**Diagram sources**
- [package.json](file://package.json)
- [next.config.ts](file://next.config.ts)
- [proxy.ts](file://proxy.ts)
- [app/layout.tsx](file://app/layout.tsx)
- [app/[locale]/layout.tsx](file://app/[locale]/layout.tsx)

**Section sources**
- [package.json](file://package.json)
- [next.config.ts](file://next.config.ts)
- [proxy.ts](file://proxy.ts)

## Performance Considerations
- Use React DevTools Profiler to identify expensive re-renders and measure commit times.
- Enable Next.js performance insights and analyze server/client bundles.
- Monitor long tasks and memory snapshots to detect leaks.
- Prefer memoization and code splitting where appropriate.
- Profile network waterfall to optimize critical requests.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide

### Common Development Issues
- API connectivity problems: Verify proxy settings and environment variables; check CORS and route handlers.
- Authentication failures: Inspect session endpoint responses and token handling in the auth context.
- Form submission errors: Validate schema constraints and confirm server-side processing.
- Theme not applying: Ensure provider initialization and CSS class toggling.
- i18n keys missing: Confirm message files exist and locale routing is correct.

**Section sources**
- [proxy.ts](file://proxy.ts)
- [app/api/auth/session/route.ts](file://app/api/auth/session/route.ts)
- [contexts/AuthContext.tsx](file://contexts/AuthContext.tsx)
- [app/[locale]/(routes)/crm/_components/crm-shared/hooks/useCrmFormSubmit.ts](file://app/[locale]/(routes)/crm/_components/crm-shared/hooks/useCrmFormSubmit.ts)
- [providers/theme-provider.tsx](file://providers/theme-provider.tsx)
- [i18n/routing.ts](file://i18n/routing.ts)
- [messages/en.json](file://messages/en.json)

### Logging Strategies
- Add structured logs around API calls and state transitions using console methods.
- Capture request/response metadata (URL, method, status, duration).
- Avoid sensitive data in logs; sanitize tokens and personal information.

**Section sources**
- [lib/api.ts](file://lib/api.ts)
- [contexts/AuthContext.tsx](file://contexts/AuthContext.tsx)

### Error Tracking Integration
- Integrate a monitoring service to capture unhandled exceptions and promise rejections.
- Instrument custom error boundaries for graceful degradation.
- Correlate frontend errors with backend logs using request IDs.

[No sources needed since this section provides general guidance]

### Production Debugging Techniques
- Enable source maps carefully and restrict access to sensitive environments.
- Use performance APIs to collect real-user metrics.
- Monitor network latency and error rates through dashboards.

[No sources needed since this section provides general guidance]

## Conclusion
By leveraging browser developer tools, React DevTools, and Next.js-specific features, you can effectively debug authentication flows, API interactions, form validations, theme switching, and i18n behavior. Combine these with performance profiling, bundle analysis, and memory diagnostics to maintain a responsive and reliable application. Establish robust logging and error tracking to streamline issue resolution in both development and production.

## Appendices

### Browser Developer Tools Usage
- Network: Filter by domain, inspect headers/payloads, replay requests.
- Console: Log statements, stack traces, and custom assertions.
- Sources: Set breakpoints, step through code, evaluate expressions.
- Performance: Record timelines, analyze frames, identify bottlenecks.
- Memory: Take heap snapshots, compare allocations, find leaks.

[No sources needed since this section provides general guidance]

### React DevTools Integration
- Install the extension and enable Profiler mode.
- Use the Components tab to inspect props/state and highlight updates.
- Use the Profiler tab to record interactions and analyze render costs.

[No sources needed since this section provides general guidance]

### Next.js Specific Debugging
- Review next.config.ts for build/runtime flags affecting debugging.
- Use server-side logs for route handlers and middleware.
- Analyze generated bundles and static assets for optimization opportunities.

**Section sources**
- [next.config.ts](file://next.config.ts)