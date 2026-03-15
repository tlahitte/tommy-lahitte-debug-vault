---
phase: 01-design-system
plan: 03
subsystem: ui
tags: [tailwind, semantic-tokens, design-system, token-migration, kraft-palette]

# Dependency graph
requires:
  - phase: 01-design-system plan 01
    provides: Semantic token CSS variables in globals.css and Tailwind config mappings (bg-surface, text-text-muted, border-border, bg-accent, ring-accent, etc.)
provides:
  - Footer.tsx migrated to semantic tokens — no zinc/violet residue
  - Tag.tsx migrated to semantic tokens — bg-surface-raised, text-text-muted, border-border
  - CodeBlock.tsx outer border migrated to border-border; dark pre/code interior preserved
  - CategoryBadge.tsx using warm accent-adjacent palette (accent, accent-hover, surface-raised)
  - Hero.tsx fully migrated — kraft tokens throughout, conic-gradient halo in rust rgba(200,90,58)
affects:
  - 01-design-system plan 04 (BlogCard migration — completes full palette migration)
  - Any future components referencing these 5 files as examples

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Semantic token substitution: direct one-to-one class replacement, zero structural JSX changes"
    - "CodeBlock dark interior convention: outer border/tab use semantic tokens; pre/code interior stays dark (industry convention)"
    - "CategoryBadge warm palette: editor=bg-accent/10, debugging=bg-accent/15, qa-workflow=bg-surface-raised"
    - "Conic-gradient halo: replace violet/cyan rgba with accent rgba(200,90,58) and accent-hover rgba(168,67,42)"

key-files:
  created: []
  modified:
    - src/components/layout/Footer.tsx
    - src/components/ui/Tag.tsx
    - src/components/ui/CodeBlock.tsx
    - src/components/tips/CategoryBadge.tsx
    - src/components/home/Hero.tsx

key-decisions:
  - "CodeBlock dark pre/code interior (bg-zinc-900, text-zinc-200) intentionally kept — dark code blocks on light pages are industry convention; only outer border and language tab migrated"
  - "CategoryBadge: blue/red/green Tailwind category colors replaced with warm accent-adjacent palette to align with kraft design system"
  - "Hero conic-gradient: violet/cyan rgba swapped to rust (200,90,58)/(168,67,42) matching accent/#C85A3A and accent-hover/#A8432A"
  - "Secondary CTA hover:bg-violet-950/50 replaced with hover:bg-surface-raised (no opacity trick needed — surface-raised is the correct raised surface token)"

patterns-established:
  - "Token migration pattern: read file, substitute class names exactly as specified in UI-SPEC contract, no structural changes"
  - "Inline style migration: replace rgba() values with semantic color equivalents from globals.css :root"

requirements-completed: [DSGN-02]

# Metrics
duration: 2min
completed: 2026-03-15
---

# Phase 1 Plan 03: Token Migration (Footer, Tag, CodeBlock, CategoryBadge, Hero) Summary

**Five-component kraft palette migration replacing all zinc/violet Tailwind classes with semantic tokens; Hero conic-gradient halo converted to warm rust rgba(200,90,58); CategoryBadge updated to accent-adjacent warm palette**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-15T22:27:03Z
- **Completed:** 2026-03-15T22:29:07Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Zero zinc/violet residue across Footer, Tag, CategoryBadge, and Hero (full semantic token adoption)
- CodeBlock migrated with outer border/language tab using semantic tokens while preserving dark pre/code interior (industry convention)
- Hero conic-gradient halo now uses warm rust colors (rgba(200,90,58)/rgba(168,67,42)) matching the accent/#C85A3A palette
- CategoryBadge warm palette aligned with kraft design system (accent, accent-hover, surface-raised)
- Next.js build passes (exit 0) after all migrations

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate Footer, Tag, and CodeBlock to semantic tokens** - `d0a60af` (feat)
2. **Task 2: Migrate CategoryBadge and Hero to kraft palette** - `71023c8` (feat)

**Plan metadata:** _(docs commit follows)_

## Files Created/Modified
- `src/components/layout/Footer.tsx` - bg-zinc-950→bg-surface, text-zinc-500→text-text-muted, hover:text-violet-400→hover:text-accent, border-zinc-800→border-border
- `src/components/ui/Tag.tsx` - bg-zinc-800→bg-surface-raised, text-zinc-300→text-text-muted, border-zinc-700→border-border
- `src/components/ui/CodeBlock.tsx` - outer border and language tab migrated to semantic tokens; dark pre/code interior preserved
- `src/components/tips/CategoryBadge.tsx` - blue/red/green category colors replaced with warm accent-adjacent palette
- `src/components/home/Hero.tsx` - full token migration including conic-gradient halo, ring, primary/secondary CTAs

## Decisions Made
- CodeBlock dark interior kept intentionally: `bg-zinc-900` on `<pre>` and `text-zinc-200` on `<code>` are preserved — this is an explicit design decision (dark code blocks on light pages) documented in the UI-SPEC contract.
- CategoryBadge colors updated from framework-specific (blue/red/green) to kraft-aligned (accent/accent-hover/surface-raised) per RESEARCH.md §Pitfall 5.
- Secondary CTA hover background: `hover:bg-violet-950/50` replaced with `hover:bg-surface-raised` — the raised surface token correctly expresses the "subtle lift" interaction without requiring opacity hacks.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- `npm run lint` prompted for interactive ESLint configuration (no `.eslintrc` file in project). This is a pre-existing project configuration gap unrelated to these changes. Build (`npm run build`) passes exit 0 and all 5 files contain zero zinc/violet residue as verified by grep audit.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Plans 01, 02 (Header), and 03 (this plan) have migrated 8+ components to semantic tokens
- After Plan 04 (BlogCard), the full palette migration across all components will be complete
- grep audit of the full src/ directory for zinc/violet will return zero results (except CodeBlock interior — intentional)
- Ready to proceed to Plan 04 (BlogCard token migration)

---
*Phase: 01-design-system*
*Completed: 2026-03-15*
