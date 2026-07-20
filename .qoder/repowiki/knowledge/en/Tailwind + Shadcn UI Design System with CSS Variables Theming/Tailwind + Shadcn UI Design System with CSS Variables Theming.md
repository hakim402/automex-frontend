---
kind: frontend_style
name: Tailwind + Shadcn UI Design System with CSS Variables Theming
category: frontend_style
scope:
    - '**'
source_files:
    - app/globals.css
    - tailwind.config.ts
    - components.json
    - providers/theme-provider.tsx
    - components/ui/button.tsx
    - postcss.config.mjs
---

The AUTOMEX frontend uses a modern, token-driven styling stack built on Tailwind CSS v4 (via @tailwindcss/postcss), the shadcn/ui component library (Radix Nova style), and CSS custom properties for theming. The system is organized around three layers: design tokens in CSS variables, utility-first composition via Tailwind classes, and composable React primitives from shadcn/ui.

Core stack
- Tailwind CSS v4 configured through postcss.config.mjs using @tailwindcss/postcss. All styles are imported in app/globals.css via @import "tailwindcss", @import "tw-animate-css", and @import "shadcn/tailwind.css".
- shadcn/ui initialized with components.json (style: radix-nova, rsc: true, tsx: true, cssVariables: true). Components live under components/ui/ and are generated with Radix primitives plus class-variance-authority variants.
- next-themes provides runtime theme toggling by adding/removing a .dark class on the <html> element; the root provider wraps the app at providers/theme-provider.tsx.

Design tokens and theming
All visual tokens are defined as CSS custom properties in app/globals.css:
- A unified radius scale (--radius-sm ... --radius-4xl) derived from a single --radius base.
- Brand palette centered on a 90-degree cyan-to-blue gradient (--brand-start: #0ab8fb, --brand-end: #324b9d) with semantic aliases (--primary, --secondary, --accent, --destructive, --muted, --card, --popover, --border, --input, --ring, chart colors, sidebar tokens).
- Separate :root (light) and .dark blocks swap token values while keeping brand endpoints consistent.
- Tailwind's theme.extend.colors maps each semantic color to its HSL variable (e.g., primary.DEFAULT: hsl(var(--primary))), so every Tailwind color utility automatically follows the active theme.
- An @theme inline block re-exports these variables as Tailwind-native tokens (--color-brand, --color-primary, etc.) for direct use in @apply and arbitrary values.

Typography and RTL
- Font routing is locale-aware: html[lang="en"] body { font-family: var(--font-en) }, html[lang="ar"] body { font-family: var(--font-ar) }, html[lang="zh"] body { font-family: var(--font-zh) }, and Arabic/Pashto share --font-fa-ps.
- html[dir="rtl"] switches --font-sans to the Arabic typeface and flips the brand gradient direction (90° → 270°) so gradients flow with writing direction.
- A comprehensive prose layer under @layer components styles rich text (headings, lists, code, tables, blockquotes) with explicit RTL overrides (.prose-rtl).

Component styling conventions
- shadcn/ui components are variant-driven via cva (see components/ui/button.tsx): variant (default, outline, secondary, ghost, destructive, link) × size (default, xs, sm, lg, icon variants). Variants compose with data-* attributes (data-variant, data-size, data-slot) consumed by selectors like [_[data-variant=...]].
- All components use the shared cn() utility from @/lib/utils to merge Tailwind classes deterministically.
- Global brand utilities in globals.css provide ready-made patterns: .bg-color / .bg-brand-gradient (gradient backgrounds), .text-color / .text-brand-gradient (gradient text), .border-brand-gradient (gradient borders), .shadow-brand (glow shadows).

Animation and motion
- Keyframes for accordion open/close and caret blink are registered in tailwind.config.ts and exposed as animate-accordion-down, animate-accordion-up, animate-caret-blink.
- The tailwindcss-animate plugin supplies additional transitions used by shadcn/ui primitives.

Responsive strategy
- No custom breakpoints are declared; the project relies on Tailwind's default responsive prefixes (sm:, md:, lg:, xl:) throughout page sections and components.
- Layouts are built with Flexbox/Grid utilities rather than fixed pixel widths.

Rules developers should follow
1. Use semantic tokens, not raw colors. Reference var(--primary), var(--background), etc. — never hard-code hex values in components.
2. Prefer shadcn/ui primitives. Import from @/components/ui/* instead of building buttons, dialogs, inputs from scratch.
3. Variant-driven styling. When creating new components, define variants with cva and expose data-variant / data-size attributes.
4. Compose with Tailwind utilities. Keep logic out of CSS files; use @apply only for global base/component layers.
5. Respect RTL. Use logical properties (start/end over left/right) and rely on dir="rtl" overrides already present in globals.
6. Theme toggle goes through next-themes. Add/remove the .dark class via the provided ThemeProvider; do not manipulate document.documentElement.classList directly.