---
kind: dependency_management
name: NPM/Node Dependency Management (Next.js App)
category: dependency_management
scope:
    - '**'
source_files:
    - package.json
    - .gitignore
    - tsconfig.json
---

This repository uses the standard Node.js dependency management approach centered on a single `package.json` at the project root. There is no monorepo workspace, no vendoring, and no private registry configuration — all third-party packages are resolved from the public npm registry.

**Package manager & lockfile**
- The package manifest declares both runtime (`dependencies`) and development (`devDependencies`) packages using caret ranges (e.g. `^5.4.0`, `^16.2.10`).
- No lockfile (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, or `bun.lock`) is present in the repository; `.next/` and `node_modules/` are gitignored via `.gitignore`. This means each developer installs dependencies independently, which can lead to divergent transitive resolutions across machines.
- The README documents four equivalent install/run commands (`npm run dev`, `yarn dev`, `pnpm dev`, `bun dev`), indicating the team accepts any of these managers interchangeably without enforcing one through tooling.

**Key files**
- `package.json` — sole source of truth for declared versions and scripts.
- `.gitignore` — excludes `node_modules/` and `.next/`, confirming a non-vendored setup.
- `tsconfig.json` — uses `"moduleResolution": "bundler"`, aligning with Next.js's bundler-based resolution rather than classic Node resolution.

**Versioning strategy**
- All versions use caret (`^`) ranges, allowing minor/patch upgrades automatically during install. Major versions are pinned explicitly where required by framework compatibility (e.g. `next: 16.2.6`, `react: 19.2.4`, `eslint-config-next: 16.2.6`).
- A custom script `generate-types` calls `openapi-typescript` against an external OpenAPI schema URL to regenerate TypeScript types into `lib/automex/types/generated.ts`, tying API contract changes to a deterministic codegen step.

**Conventions & constraints**
- No `.npmrc`, `.yarnrc`, or `bunfig.toml` exists, so there is no private registry, auth token, or alias mapping configured at the repo level.
- No `overrides` or `resolutions` field is used to force transitive dependency versions.
- Because no lockfile is committed, CI or local builds should be expected to re-resolve transitive dependencies on every install.