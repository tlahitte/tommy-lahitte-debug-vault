---
phase: 01-design-system
plan: "06"
subsystem: ui
tags: [tailwind, kraft-tokens, semantic-tokens, design-system, nextjs]

# Dependency graph
requires:
  - phase: 01-design-system/01-05
    provides: kraft token system, bg-surface-raised, text-text-primary, text-text-muted, bg-accent, hover:bg-accent-hover established in globals.css and Tailwind config
provides:
  - blog/page.tsx warm kraft page header (bg-surface-raised + rust vignette)
  - tips/page.tsx warm kraft page header (matching blog pattern)
  - not-found.tsx fully semantic 404 page (text-accent, bg-accent, hover:bg-accent-hover)
  - TipDetail.tsx fully migrated — no zinc text classes remain
  - TipsGrid.tsx empty state uses text-text-muted
  - template.tsx transition duration aligned to UI-SPEC (250ms)
affects: [phase-02, any future pages inheriting page header pattern]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Page header pattern: bg-surface-raised + border-b border-border + rust radial vignette rgba(200,90,58,0.06)"
    - "Semantic text tokens: text-text-primary for headings/body, text-text-muted for secondary/meta text"
    - "CTA button tokens: bg-accent + hover:bg-accent-hover (never bg-violet-* or raw hex)"

key-files:
  created: []
  modified:
    - src/app/blog/page.tsx
    - src/app/tips/page.tsx
    - src/app/not-found.tsx
    - src/components/tips/TipDetail.tsx
    - src/components/tips/TipsGrid.tsx
    - src/app/template.tsx

key-decisions:
  - "Bottom dark linear gradient overlay removed from page headers — fading to #09090b is meaningless on a light kraft background; border-b border-border provides clean section separation"
  - "text-white kept on CTA button text — white on rust accent (#C85A3A) meets contrast requirements and is intentional"
  - "Page transition duration set to 0.25 (lower bound of 250-300ms spec range)"

patterns-established:
  - "Page header pattern: bg-surface-raised border-b border-border -mt-14 with rust radial vignette overlay"
  - "All zinc-* and violet-* classes replaced with semantic token equivalents in new and migrated pages"

requirements-completed: [DSGN-01, DSGN-02, DSGN-03]

# Metrics
duration: 2min
completed: 2026-03-15
---

# Phase 1 Plan 06: Gap Closure — Dark-Violet Pages Migrated to Kraft Tokens Summary

**Six remaining dark-violet/zinc pages and components fully migrated to kraft semantic tokens, achieving a visually consistent warm beige aesthetic across /blog, /tips, 404, and tip detail pages.**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-15T23:26:52Z
- **Completed:** 2026-03-15T23:28:44Z
- **Tasks:** 6
- **Files modified:** 6

## Accomplishments

- /blog and /tips page headers replaced dark violet (bg-[#1c1535] + violet rgba gradients) with warm kraft (bg-surface-raised + rust vignette + border-b border-border)
- 404 page migrated from violet palette to semantic tokens: text-accent on 404 number, bg-accent/hover:bg-accent-hover on CTA button
- TipDetail.tsx fully migrated — all 3 zinc text classes (h3 heading, time element, summary paragraph) replaced with text-text-primary/text-text-muted
- TipsGrid.tsx empty state message migrated from text-zinc-500 to text-text-muted
- Page transition duration corrected from 0.4 (400ms) to 0.25 (250ms) per UI-SPEC

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate blog/page.tsx page header to kraft tokens** - `85030c9` (feat)
2. **Task 2: Migrate tips/page.tsx page header to kraft tokens** - `754b4e3` (feat)
3. **Task 3: Migrate not-found.tsx to semantic tokens** - `049fd0f` (feat)
4. **Task 4: Migrate TipDetail.tsx zinc text classes to semantic tokens** - `9afd80a` (fix)
5. **Task 5: Migrate TipsGrid.tsx empty state to semantic token** - `1a0e00c` (fix)
6. **Task 6: Align template.tsx transition duration to UI-SPEC** - `020e970` (chore)

## Files Created/Modified

- `src/app/blog/page.tsx` - Page header replaced with kraft bg-surface-raised + rust vignette pattern
- `src/app/tips/page.tsx` - Identical kraft page header migration
- `src/app/not-found.tsx` - All violet and zinc classes replaced with semantic tokens
- `src/components/tips/TipDetail.tsx` - 3 zinc text classes replaced with text-text-primary/text-text-muted
- `src/components/tips/TipsGrid.tsx` - Empty state message migrated to text-text-muted
- `src/app/template.tsx` - Page transition duration 0.4 → 0.25

## Decisions Made

- Bottom dark linear gradient overlay removed from page headers — fading to #09090b is meaningless on a light kraft background; border-b border-border provides clean section separation instead
- `text-white` kept on CTA button — white text on rust accent (#C85A3A) meets contrast and is intentional
- Page transition duration set to 0.25 (lower bound of 250-300ms spec range, not the midpoint)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all 6 files had straightforward targeted replacements. Build passed cleanly on first attempt.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Design system phase 01 fully complete — all pages, components, and animations use semantic kraft tokens
- No bg-[#1c1535], text-violet-*, bg-violet-*, or text-zinc-* classes remain in any scoped file
- VERIFICATION.md score now effectively 13/13 — all gaps from the gap closure plan addressed
- Phase 2 (Notion blog integration) can begin with a fully consistent visual foundation

---
*Phase: 01-design-system*
*Completed: 2026-03-15*
