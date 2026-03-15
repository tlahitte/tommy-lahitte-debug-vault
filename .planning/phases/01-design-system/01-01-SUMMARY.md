---
phase: 01-design-system
plan: 01
subsystem: ui
tags: [tailwind, css-custom-properties, design-tokens, kraft-palette]

# Dependency graph
requires: []
provides:
  - 9-token semantic color system in tailwind.config.ts (surface, surface-raised, text-primary, text-muted, accent, accent-hover, border, background, foreground)
  - CSS custom properties in globals.css :root with kraft/industrial palette values
  - layout.tsx body using bg-surface (#FAFAF7) and text-text-primary (#1A1816)
affects: [02-design-system, 03-design-system, 04-design-system, all component migration plans]

# Tech tracking
tech-stack:
  added: []
  patterns: [css-custom-properties-bridged-to-tailwind, semantic-token-naming]

key-files:
  created: []
  modified:
    - tailwind.config.ts
    - src/app/globals.css
    - src/app/layout.tsx

key-decisions:
  - "Keep background and foreground as legacy aliases pointing to kraft values — backwards compatibility for any existing classes using bg-background/text-foreground"
  - "9 tokens via CSS custom properties in :root, bridged to Tailwind via var(--token) references — single source of truth in CSS"
  - "Kraft/industrial palette: warm white #FAFAF7 surface, terracotta #C85A3A accent, replacing zinc-950 dark and violet-500 accent"

patterns-established:
  - "Token pattern: define in globals.css :root, reference in tailwind.config.ts as var(--token), use as Tailwind utility class in components"
  - "Never use raw hex or zinc/violet Tailwind classes in component files — always use semantic class names"

requirements-completed: [DSGN-01]

# Metrics
duration: 2min
completed: 2026-03-15
---

# Phase 1 Plan 01: Semantic Token Foundation Summary

**9-token kraft/industrial CSS custom property system bridged to Tailwind, replacing zinc-dark and violet theme with #FAFAF7 warm white surface and #C85A3A terracotta accent**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-15T22:23:55Z
- **Completed:** 2026-03-15T22:25:11Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Replaced old dark :root vars (#09090b, #f4f4f5, #8b5cf6) with full 9-token kraft palette in globals.css
- Extended tailwind.config.ts with 7 new semantic color keys, all bridged via var(--token) CSS references
- Migrated layout.tsx body from bg-zinc-950/text-zinc-100 to bg-surface/text-text-primary — page now renders warm white instead of near-black
- Build passes cleanly after all changes

## Task Commits

Each task was committed atomically:

1. **Task 1: Define semantic tokens in tailwind.config.ts and globals.css** - `5e4e2d1` (feat)
2. **Task 2: Migrate layout.tsx body class to semantic tokens** - `84d866d` (feat)

## Files Created/Modified

- `tailwind.config.ts` - Added 7 new color keys: surface, surface-raised, text-primary, text-muted, accent, accent-hover, border (plus existing background/foreground retained)
- `src/app/globals.css` - Replaced :root block with full kraft palette; body rule unchanged (already uses var(--background)/var(--foreground))
- `src/app/layout.tsx` - Single line change: body className from bg-zinc-950 text-zinc-100 to bg-surface text-text-primary

## Decisions Made

- Kept background and foreground as legacy aliases in both globals.css and tailwind.config.ts, updated to kraft values — preserves backwards compat for any existing code using bg-background or text-foreground
- Single source of truth is globals.css :root; tailwind.config.ts only references, never duplicates hex values
- ESLint not yet configured (pre-existing gap, out of scope for this plan) — build verified clean, lint skipped

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

`npm run lint` triggered interactive ESLint setup (no .eslintrc config exists in repo). This is a pre-existing gap predating this plan — not caused by any change made here. Logged to deferred items. Build (`npm run build`) passes cleanly and was used as the primary verification.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Semantic token foundation complete — all 9 tokens available as Tailwind utility classes
- Wave 2 component migration plans can now begin: Header, Footer, and all components can migrate to bg-surface, text-text-primary, text-muted, accent, etc.
- No hardcoded dark values remain in the three foundational files

---
*Phase: 01-design-system*
*Completed: 2026-03-15*
