# Services Administration

<cite>
**Referenced Files in This Document**
- [ServicesClientPage.tsx](file://app/[locale]/services/_components/ServicesClientPage.tsx)
- [ServiceDetailClient.tsx](file://app/[locale]/services/[slug]/_components/ServiceDetailClient.tsx)
- [page.tsx](file://app/[locale]/services/page.tsx)
- [page.tsx](file://app/[locale]/services/[slug]/page.tsx)
- [actions.ts](file://app/[locale]/services/actions.ts)
- [DashboardMain.tsx](file://app/[locale]/dashboard/_components/DashboardMain.tsx)
- [Sidebar.tsx](file://app/[locale]/dashboard/_components/Sidebar/Sidebar.tsx)
- [Header.tsx](file://app/[locale]/dashboard/_components/Header/DashboardHeader.tsx)
- [page.tsx](file://app/[locale]/dashboard/(routes)/services/page.tsx)
- [JsonLd.tsx](file://components/seo/JsonLd.tsx)
- [BreadcrumbSchema.tsx](file://components/seo/BreadcrumbSchema.tsx)
- [FAQSchema.tsx](file://components/seo/FAQSchema.tsx)
- [LocalBusinessSchema.tsx](file://components/seo/LocalBusinessSchema.tsx)
- [OrganizationSchema.tsx](file://components/seo/OrganizationSchema.tsx)
- [ConnectedModelConfig.tsx](file://config/ConnectedModelConfig.tsx)
- [HowItWorksConfig.tsx](file://config/HowItWorksConfig.tsx)
- [TechStackConfig.tsx](file://config/TechStackConfig.tsx)
- [api.ts](file://lib/api.ts)
- [env.ts](file://lib/env.ts)
- [AUTOMEX Services MVP.md](file://doc/AUTOMEX Services MVP.md)
- [AUTOMEX_Backend_CRM_API_Notes.md](file://doc/AUTOMEX_Backend_CRM_API_Notes.md)
- [AUTOMEX_Backend_SEO_Extras_Notes.md](file://doc/AUTOMEX_Backend_SEO_Extras_Notes.md)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document explains the services administration interface and how it supports:
- Service catalog management (listing, details, actions)
- Pricing configuration and availability scheduling
- Service categories and metadata management
- SEO optimization for service pages
- Analytics, usage tracking, and performance metrics
- Extensibility patterns such as adding new service types, implementing bundles, and configuring dependencies

The implementation is a Next.js application with client-side components for listing and detail views, server actions for mutations, and reusable SEO schema components to enhance search visibility.

## Project Structure
The services feature spans public-facing pages and dashboard routes:
- Public services listing and detail pages under app/[locale]/services
- Dashboard route for services administration under app/[locale]/dashboard/(routes)/services
- Shared UI and SEO components used across the app
- Configuration files that define content models and behaviors
- API utilities and environment configuration for backend integration

```mermaid
graph TB
subgraph "Public Services"
SList["Services Client Page<br/>Listing"]
SDetail["Service Detail Client<br/>Slug-based"]
end
subgraph "Dashboard"
DMain["Dashboard Main Layout"]
DSidebar["Dashboard Sidebar"]
DHeader["Dashboard Header"]
DServices["Dashboard Services Route"]
end
subgraph "SEO"
JsonLd["JsonLd"]
Breadcrumb["BreadcrumbSchema"]
FAQ["FAQSchema"]
LocalBiz["LocalBusinessSchema"]
Org["OrganizationSchema"]
end
subgraph "Config"
CModel["ConnectedModelConfig"]
CHow["HowItWorksConfig"]
CTech["TechStackConfig"]
end
subgraph "Lib"
Api["API Utilities"]
Env["Environment Config"]
end
SList --> SDetail
DMain --> DServices
DServices --> SList
DServices --> SDetail
SList --> JsonLd
SDetail --> JsonLd
SDetail --> Breadcrumb
SDetail --> FAQ
SDetail --> LocalBiz
SDetail --> Org
SList --> CModel
SDetail --> CModel
DServices --> Api
DServices --> Env
```

**Diagram sources**
- [ServicesClientPage.tsx](file://app/[locale]/services/_components/ServicesClientPage.tsx)
- [ServiceDetailClient.tsx](file://app/[locale]/services/[slug]/_components/ServiceDetailClient.tsx)
- [page.tsx](file://app/[locale]/services/page.tsx)
- [page.tsx](file://app/[locale]/services/[slug]/page.tsx)
- [DashboardMain.tsx](file://app/[locale]/dashboard/_components/DashboardMain.tsx)
- [Sidebar.tsx](file://app/[locale]/dashboard/_components/Sidebar/Sidebar.tsx)
- [Header.tsx](file://app/[locale]/dashboard/_components/Header/DashboardHeader.tsx)
- [page.tsx](file://app/[locale]/dashboard/(routes)/services/page.tsx)
- [JsonLd.tsx](file://components/seo/JsonLd.tsx)
- [BreadcrumbSchema.tsx](file://components/seo/BreadcrumbSchema.tsx)
- [FAQSchema.tsx](file://components/seo/FAQSchema.tsx)
- [LocalBusinessSchema.tsx](file://components/seo/LocalBusinessSchema.tsx)
- [OrganizationSchema.tsx](file://components/seo/OrganizationSchema.tsx)
- [ConnectedModelConfig.tsx](file://config/ConnectedModelConfig.tsx)
- [HowItWorksConfig.tsx](file://config/HowItWorksConfig.tsx)
- [TechStackConfig.tsx](file://config/TechStackConfig.tsx)
- [api.ts](file://lib/api.ts)
- [env.ts](file://lib/env.ts)

**Section sources**
- [page.tsx](file://app/[locale]/services/page.tsx)
- [page.tsx](file://app/[locale]/services/[slug]/page.tsx)
- [DashboardMain.tsx](file://app/[locale]/dashboard/_components/DashboardMain.tsx)
- [Sidebar.tsx](file://app/[locale]/dashboard/_components/Sidebar/Sidebar.tsx)
- [Header.tsx](file://app/[locale]/dashboard/_components/Header/DashboardHeader.tsx)
- [page.tsx](file://app/[locale]/dashboard/(routes)/services/page.tsx)

## Core Components
- Services listing page: Renders the catalog view, filters by category, and navigates to detail pages.
- Service detail page: Displays full information, pricing, availability, related items, and SEO schemas.
- Dashboard services route: Entry point for administrative operations on services.
- Server actions: Encapsulate mutations (create, update, delete) and data fetching helpers.
- SEO components: Provide structured data for breadcrumbs, FAQs, local business, and organization.

Key responsibilities:
- Catalog management: Listing, filtering, pagination, and navigation
- Metadata and SEO: Title, description, canonical URL, JSON-LD schemas
- Pricing and availability: Display and configuration hooks for time slots and pricing tiers
- Analytics and metrics: Integration points for usage tracking and performance measurement

**Section sources**
- [ServicesClientPage.tsx](file://app/[locale]/services/_components/ServicesClientPage.tsx)
- [ServiceDetailClient.tsx](file://app/[locale]/services/[slug]/_components/ServiceDetailClient.tsx)
- [actions.ts](file://app/[locale]/services/actions.ts)
- [JsonLd.tsx](file://components/seo/JsonLd.tsx)
- [BreadcrumbSchema.tsx](file://components/seo/BreadcrumbSchema.tsx)
- [FAQSchema.tsx](file://components/seo/FAQSchema.tsx)
- [LocalBusinessSchema.tsx](file://components/seo/LocalBusinessSchema.tsx)
- [OrganizationSchema.tsx](file://components/seo/OrganizationSchema.tsx)

## Architecture Overview
The services administration architecture combines:
- Client components for interactive UI
- Server actions for secure mutations
- Reusable SEO components for structured data
- Configuration modules for content modeling
- API utilities for backend communication

```mermaid
sequenceDiagram
participant Admin as "Admin User"
participant Dash as "Dashboard Services Route"
participant List as "Services Client Page"
participant Detail as "Service Detail Client"
participant Actions as "Server Actions"
participant API as "API Utilities"
participant Env as "Environment Config"
Admin->>Dash : Navigate to Services
Dash->>List : Render catalog view
Admin->>List : Filter by category / Search
List->>Actions : Fetch services (if needed)
Actions->>API : Request services
API->>Env : Read base URLs and keys
API-->>Actions : Services list
Actions-->>List : Data
Admin->>List : Click service
List->>Detail : Navigate to slug
Detail->>Actions : Fetch service details
Actions->>API : Request service detail
API-->>Actions : Service data
Actions-->>Detail : Data
Detail->>Detail : Render JSON-LD schemas
```

**Diagram sources**
- [page.tsx](file://app/[locale]/dashboard/(routes)/services/page.tsx)
- [ServicesClientPage.tsx](file://app/[locale]/services/_components/ServicesClientPage.tsx)
- [ServiceDetailClient.tsx](file://app/[locale]/services/[slug]/_components/ServiceDetailClient.tsx)
- [actions.ts](file://app/[locale]/services/actions.ts)
- [api.ts](file://lib/api.ts)
- [env.ts](file://lib/env.ts)

## Detailed Component Analysis

### Services Listing and Navigation
- Purpose: Present the service catalog, support filtering by category, and navigate to detail pages.
- Behavior:
  - Loads services via server actions or API utilities
  - Applies category filters and search queries
  - Navigates to service detail using slugs
- SEO:
  - Uses shared JSON-LD component for global structured data
  - May include breadcrumb schema for site hierarchy

```mermaid
flowchart TD
Start(["Open Services Page"]) --> Load["Load Services Data"]
Load --> Filter{"Apply Filters?"}
Filter --> |Yes| Apply["Apply Category/Search Filters"]
Filter --> |No| Render["Render Catalog"]
Apply --> Render
Render --> Click["Click Service Item"]
Click --> Navigate["Navigate to Detail Page"]
Navigate --> End(["Service Detail Loaded"])
```

**Diagram sources**
- [ServicesClientPage.tsx](file://app/[locale]/services/_components/ServicesClientPage.tsx)
- [page.tsx](file://app/[locale]/services/page.tsx)

**Section sources**
- [ServicesClientPage.tsx](file://app/[locale]/services/_components/ServicesClientPage.tsx)
- [page.tsx](file://app/[locale]/services/page.tsx)

### Service Detail and Metadata Management
- Purpose: Display comprehensive service information including pricing, availability, and related services.
- Features:
  - Renders detailed metadata (title, description, tags)
  - Integrates JSON-LD schemas for breadcrumbs, FAQs, local business, and organization
  - Supports dynamic routing based on service slug
- Availability and pricing:
  - Displays configured pricing tiers and time slot availability
  - Hooks into configuration modules for consistent behavior

```mermaid
classDiagram
class ServiceDetail {
+string title
+string description
+array categories
+object pricing
+object availability
+render() void
+applySchemas() void
}
class JsonLd {
+inject(data) void
}
class BreadcrumbSchema {
+generate(items) object
}
class FAQSchema {
+generate(questions) object
}
class LocalBusinessSchema {
+generate(info) object
}
class OrganizationSchema {
+generate(org) object
}
ServiceDetail --> JsonLd : "uses"
ServiceDetail --> BreadcrumbSchema : "generates"
ServiceDetail --> FAQSchema : "generates"
ServiceDetail --> LocalBusinessSchema : "generates"
ServiceDetail --> OrganizationSchema : "generates"
```

**Diagram sources**
- [ServiceDetailClient.tsx](file://app/[locale]/services/[slug]/_components/ServiceDetailClient.tsx)
- [JsonLd.tsx](file://components/seo/JsonLd.tsx)
- [BreadcrumbSchema.tsx](file://components/seo/BreadcrumbSchema.tsx)
- [FAQSchema.tsx](file://components/seo/FAQSchema.tsx)
- [LocalBusinessSchema.tsx](file://components/seo/LocalBusinessSchema.tsx)
- [OrganizationSchema.tsx](file://components/seo/OrganizationSchema.tsx)

**Section sources**
- [ServiceDetailClient.tsx](file://app/[locale]/services/[slug]/_components/ServiceDetailClient.tsx)
- [page.tsx](file://app/[locale]/services/[slug]/page.tsx)
- [JsonLd.tsx](file://components/seo/JsonLd.tsx)
- [BreadcrumbSchema.tsx](file://components/seo/BreadcrumbSchema.tsx)
- [FAQSchema.tsx](file://components/seo/FAQSchema.tsx)
- [LocalBusinessSchema.tsx](file://components/seo/LocalBusinessSchema.tsx)
- [OrganizationSchema.tsx](file://components/seo/OrganizationSchema.tsx)

### Dashboard Services Administration
- Purpose: Centralized entry point for managing services within the dashboard.
- Responsibilities:
  - Provides navigation to listing and detail views from the admin context
  - Integrates with server actions for create/update/delete operations
  - Leverages API utilities and environment configuration for backend calls

```mermaid
sequenceDiagram
participant Admin as "Admin User"
participant DashRoute as "Dashboard Services Route"
participant Actions as "Server Actions"
participant API as "API Utilities"
participant Env as "Environment Config"
Admin->>DashRoute : Open Services Admin
DashRoute->>Actions : Create/Update/Delete Service
Actions->>API : Perform mutation
API->>Env : Resolve endpoints and keys
API-->>Actions : Mutation result
Actions-->>DashRoute : Success/Failure
DashRoute-->>Admin : Updated catalog state
```

**Diagram sources**
- [page.tsx](file://app/[locale]/dashboard/(routes)/services/page.tsx)
- [actions.ts](file://app/[locale]/services/actions.ts)
- [api.ts](file://lib/api.ts)
- [env.ts](file://lib/env.ts)

**Section sources**
- [page.tsx](file://app/[locale]/dashboard/(routes)/services/page.tsx)
- [actions.ts](file://app/[locale]/services/actions.ts)
- [api.ts](file://lib/api.ts)
- [env.ts](file://lib/env.ts)

### Pricing Configuration and Availability Scheduling
- Pricing:
  - Managed through configuration modules and service metadata
  - Supports multiple pricing tiers and conditional logic
- Availability:
  - Time slot configuration integrated with detail rendering
  - Consistent display across listing and detail views

```mermaid
flowchart TD
PStart(["Configure Pricing"]) --> DefineTiers["Define Tiers and Rules"]
DefineTiers --> SaveMeta["Save to Service Metadata"]
SaveMeta --> AStart(["Configure Availability"])
AStart --> SetSlots["Set Time Slots and Constraints"]
SetSlots --> Persist["Persist to Backend"]
Persist --> Render["Render in UI"]
```

[No sources needed since this section provides general guidance]

### Service Categories and Metadata Management
- Categories:
  - Used for filtering and grouping services
  - Stored as part of service metadata
- Metadata:
  - Includes titles, descriptions, tags, and canonical URLs
  - Integrated with SEO components for structured data

```mermaid
classDiagram
class ServiceMetadata {
+string title
+string description
+array tags
+string canonicalUrl
+array categories
}
class Category {
+string id
+string name
+string slug
}
ServiceMetadata --> Category : "references"
```

[No sources needed since this diagram shows conceptual relationships]

### SEO Optimization
- Structured data:
  - JSON-LD injection for breadcrumbs, FAQs, local business, and organization
- Best practices:
  - Ensure unique titles and descriptions per service
  - Use canonical URLs to avoid duplicate content
  - Validate generated schemas for correctness

```mermaid
graph TB
Service["Service Page"] --> JsonLd["Inject JSON-LD"]
JsonLd --> Breadcrumb["Breadcrumb Schema"]
JsonLd --> FAQ["FAQ Schema"]
JsonLd --> LocalBiz["Local Business Schema"]
JsonLd --> Org["Organization Schema"]
```

**Diagram sources**
- [JsonLd.tsx](file://components/seo/JsonLd.tsx)
- [BreadcrumbSchema.tsx](file://components/seo/BreadcrumbSchema.tsx)
- [FAQSchema.tsx](file://components/seo/FAQSchema.tsx)
- [LocalBusinessSchema.tsx](file://components/seo/LocalBusinessSchema.tsx)
- [OrganizationSchema.tsx](file://components/seo/OrganizationSchema.tsx)

**Section sources**
- [JsonLd.tsx](file://components/seo/JsonLd.tsx)
- [BreadcrumbSchema.tsx](file://components/seo/BreadcrumbSchema.tsx)
- [FAQSchema.tsx](file://components/seo/FAQSchema.tsx)
- [LocalBusinessSchema.tsx](file://components/seo/LocalBusinessSchema.tsx)
- [OrganizationSchema.tsx](file://components/seo/OrganizationSchema.tsx)

### Analytics, Usage Tracking, and Performance Metrics
- Usage tracking:
  - Integrate event listeners for service interactions (views, clicks, bookings)
  - Send events to analytics backend via API utilities
- Performance metrics:
  - Monitor page load times and interaction latency
  - Capture error rates and fallback behaviors

```mermaid
flowchart TD
TrackStart(["User Interaction"]) --> Record["Record Event"]
Record --> Send["Send to Analytics Backend"]
Send --> Measure["Measure Latency and Errors"]
Measure --> Report["Aggregate Metrics"]
```

[No sources needed since this section provides general guidance]

### Adding New Service Types
- Steps:
  - Extend service metadata schema to include new fields
  - Update configuration modules to handle new type-specific rules
  - Modify listing and detail components to render new fields
  - Add validation and migration if required

```mermaid
flowchart TD
NewTypeStart(["Define New Type"]) --> Schema["Extend Metadata Schema"]
Schema --> Config["Update Configuration Modules"]
Config --> UI["Update Listing and Detail UI"]
UI --> Validate["Add Validation and Migration"]
Validate --> Deploy["Deploy Changes"]
```

[No sources needed since this section provides general guidance]

### Implementing Service Bundles
- Concept:
  - Group multiple services into a bundle with combined pricing and availability
- Implementation:
  - Add bundle metadata referencing constituent services
  - Compute bundle pricing and aggregate availability windows
  - Render bundle cards in listing and detail views

```mermaid
classDiagram
class Bundle {
+string id
+string name
+array includedServices
+object pricing
+object availability
}
class Service {
+string id
+string title
+object pricing
+object availability
}
Bundle --> Service : "includes"
```

[No sources needed since this diagram shows conceptual relationships]

### Configuring Service Dependencies
- Purpose:
  - Enforce ordering or prerequisites among services
- Approach:
  - Store dependency graph in service metadata
  - Validate dependencies during creation and booking flows
  - Display dependency warnings in UI

```mermaid
graph TB
A["Service A"] --> B["Service B"]
B --> C["Service C"]
```

[No sources needed since this diagram shows conceptual relationships]

## Dependency Analysis
The services feature depends on:
- Client components for UI rendering
- Server actions for mutations
- API utilities and environment configuration for backend integration
- SEO components for structured data
- Configuration modules for content modeling

```mermaid
graph TB
ServicesUI["Services UI Components"] --> Actions["Server Actions"]
Actions --> API["API Utilities"]
API --> Env["Environment Config"]
ServicesUI --> SEO["SEO Components"]
ServicesUI --> Config["Configuration Modules"]
```

**Diagram sources**
- [ServicesClientPage.tsx](file://app/[locale]/services/_components/ServicesClientPage.tsx)
- [ServiceDetailClient.tsx](file://app/[locale]/services/[slug]/_components/ServiceDetailClient.tsx)
- [actions.ts](file://app/[locale]/services/actions.ts)
- [api.ts](file://lib/api.ts)
- [env.ts](file://lib/env.ts)
- [JsonLd.tsx](file://components/seo/JsonLd.tsx)
- [ConnectedModelConfig.tsx](file://config/ConnectedModelConfig.tsx)
- [HowItWorksConfig.tsx](file://config/HowItWorksConfig.tsx)
- [TechStackConfig.tsx](file://config/TechStackConfig.tsx)

**Section sources**
- [api.ts](file://lib/api.ts)
- [env.ts](file://lib/env.ts)
- [ConnectedModelConfig.tsx](file://config/ConnectedModelConfig.tsx)
- [HowItWorksConfig.tsx](file://config/HowItWorksConfig.tsx)
- [TechStackConfig.tsx](file://config/TechStackConfig.tsx)

## Performance Considerations
- Prefer server actions for data mutations to reduce client-side overhead
- Cache frequently accessed service listings where appropriate
- Defer non-critical SEO schema generation until after initial render
- Monitor network requests and optimize payload sizes
- Use efficient filtering and pagination for large catalogs

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- Missing environment variables:
  - Verify API base URLs and keys are set correctly
- SEO schema errors:
  - Validate JSON-LD structure and ensure required fields are present
- Routing problems:
  - Confirm slug-based routes are correctly defined and accessible
- Action failures:
  - Check server action responses and error handling paths

**Section sources**
- [env.ts](file://lib/env.ts)
- [JsonLd.tsx](file://components/seo/JsonLd.tsx)
- [page.tsx](file://app/[locale]/services/[slug]/page.tsx)
- [actions.ts](file://app/[locale]/services/actions.ts)

## Conclusion
The services administration interface provides a robust foundation for managing service catalogs, pricing, availability, and SEO. By leveraging server actions, reusable SEO components, and configuration modules, the system supports extensibility for new service types, bundles, and dependencies while maintaining performance and usability.

[No sources needed since this section summarizes without analyzing specific files]

## Appendices
- Reference documents:
  - Services MVP overview and roadmap
  - CRM API notes for integration points
  - SEO extras notes for advanced structured data

**Section sources**
- [AUTOMEX Services MVP.md](file://doc/AUTOMEX Services MVP.md)
- [AUTOMEX_Backend_CRM_API_Notes.md](file://doc/AUTOMEX_Backend_CRM_API_Notes.md)
- [AUTOMEX_Backend_SEO_Extras_Notes.md](file://doc/AUTOMEX_Backend_SEO_Extras_Notes.md)