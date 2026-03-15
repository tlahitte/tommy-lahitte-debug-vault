---
phase: 01-design-system
plan: 05
subsystem: ui
tags: [tailwind, css-custom-properties, kraft-tokens, homepage, header]

# Dependency graph
requires:
  - phase: 01-design-system-04
    provides: semantic token foundation and BlogCard migration established in plan 04
provides:
  - Badge buttons with warm rust/terracotta kraft-token glow and resting surface colors
  - Hero section with radial vignette and linear gradient atmospheric depth
  - Content sections (Latest Posts/Tips) with generous top padding
  - Header always visible on page load (no transparent fade-in)
affects: [phase-02, phase-03, any future homepage or header work]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - CSS custom property rgba values as badge glow/border/text for thematic consistency
    - Inline style + Tailwind className layering for compound backgrounds (vignette over gradient)

key-files:
  created: []
  modified:
    - src/components/home/AboutCard.tsx
    - src/app/page.tsx
    - src/components/layout/Header.tsx

key-decisions:
  - "Badge resting state uses bg-surface-raised / border-border (kraft light) instead of dark zinc — consistent with site's warm palette"
  - "Hero inline style overrides Tailwind bg-gradient-to-b intentionally — compound background (radial vignette + linear gradient) requires inline style; Tailwind class kept as fallback"
  - "Header scrolled initialized to true — always-visible behavior preferred over conditional fade; scroll listener still updates state correctly"

patterns-established:
  - "Compound background pattern: Tailwind fallback class + inline style override for multi-layer backgrounds"
  - "Badge glow CSS hooks: --badge-glow / --badge-border / --badge-text via style prop, read by .badge-glow:hover in globals.css"

requirements-completed: [DSGN-01, DSGN-02, DSGN-03]

# Metrics
duration: 2min
completed: 2026-03-15
---

# Phase 1 Plan 05: Design System Gap Closure Summary

**Warm kraft badge tokens, hero gradient vignette, breathing-room section spacing, and always-visible header — four UAT gaps closed in three targeted file edits**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-15T23:11:37Z
- **Completed:** 2026-03-15T23:13:47Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- Replaced all six skill badge rgba values from violet/indigo/blue/sky/cyan/teal to rust/terracotta kraft palette (#C85A3A / #A8432A), matching the site accent system
- Added compound hero background: radial rust vignette (6% opacity) layered over a linear gradient from `--surface-raised` to `--surface`, giving atmospheric depth without overpowering content
- Added `pt-12 sm:pt-16` to both Latest Posts and Latest Tips sections — content no longer crowds the hero border
- Initialized Header `scrolled` state to `true` — `bg-surface border-b` applied on first paint, no transparent flash on page load

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate AboutCard badge colors to kraft tokens** - `7e226a9` (feat)
2. **Task 2: Add hero gradient, vignette, and section spacing** - `78f907e` (feat)
3. **Task 3: Initialize Header scrolled state to true** - `0ae4953` (fix)

## Files Created/Modified

- `src/components/home/AboutCard.tsx` - Badge rgba values replaced; button resting classes updated to bg-surface-raised / border-border
- `src/app/page.tsx` - Hero section gets inline compound background; Latest Posts and Tips sections get top padding
- `src/components/layout/Header.tsx` - useState initial value changed from false to true

## Decisions Made

- Badge resting state uses light kraft surface (`bg-surface-raised`) instead of dark zinc — aligns with the warm palette and avoids the dark-chip-on-light-background mismatch
- Hero inline `style` intentionally overrides the Tailwind `bg-gradient-to-b` class — a single inline style prop is the correct tool for compound multi-layer CSS backgrounds
- Header always-visible: initialized to `true` rather than adding a `useLayoutEffect` or SSR trick — simpler, achieves the same outcome, no flash possible

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 1 design system is visually complete — all UAT issues resolved
- Three token-migration files (AboutCard, page.tsx, Header) are clean and use semantic tokens throughout
- Phase 2 (Notion integration) can begin; confirm Notion plan tier before kickoff to choose webhook vs. GitHub Actions cron approach

---
*Phase: 01-design-system*
*Completed: 2026-03-15*
