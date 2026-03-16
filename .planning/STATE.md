---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: planning
stopped_at: "Checkpoint in 02-03-PLAN.md — awaiting human: Notion content migration + secrets setup"
last_updated: "2026-03-16T11:57:43.478Z"
last_activity: 2026-03-15 — Roadmap created, 4 phases defined, 20/20 requirements mapped
progress:
  total_phases: 4
  completed_phases: 1
  total_plans: 11
  completed_plans: 9
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-15)

**Core value:** Un visiteur doit repartir en ayant compris la démarche de Tommy — ce qu'il construit, comment il pense, et pourquoi le processus compte autant que le résultat.
**Current focus:** Phase 1 — Design System

## Current Position

Phase: 1 of 4 (Design System)
Plan: 0 of ? in current phase
Status: Ready to plan
Last activity: 2026-03-15 — Roadmap created, 4 phases defined, 20/20 requirements mapped

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: —
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**
- Last 5 plans: —
- Trend: —

*Updated after each plan completion*
| Phase 01-design-system P01 | 2 | 2 tasks | 3 files |
| Phase 01-design-system P03 | 2 | 2 tasks | 5 files |
| Phase 01-design-system P04 | 4 | 2 tasks | 5 files |
| Phase 01-design-system P05 | 2 | 3 tasks | 3 files |
| Phase 01-design-system P06 | 2 | 6 tasks | 6 files |
| Phase 02-notion-foundation-blog P01 | 2 | 2 tasks | 4 files |
| Phase 02-notion-foundation-blog P02 | 8 | 4 tasks | 14 files |
| Phase 02-notion-foundation-blog P03 | 2 | 1 tasks | 1 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Roadmap: DSGN-01 locked as first task of Phase 1 — semantic tokens must exist before any component is written
- Roadmap: NOTI-05 (webhook) assigned to Phase 2 — Notion plan tier must be confirmed before Phase 2 kickoff (free plan requires GitHub Actions cron fallback)
- Roadmap: Tips section stays TypeScript-static — not migrated in v1, deferred to v2 as TIPS-V2-01
- [Phase 01-design-system]: background/foreground kept as legacy aliases updated to kraft values — backwards compat for existing classes
- [Phase 01-design-system]: Kraft palette as single source of truth: CSS custom properties in globals.css :root, bridged to Tailwind via var(--token)
- [Phase 01-design-system]: Semantic token naming convention: components must use bg-surface/text-text-primary/etc., never raw hex or zinc/violet Tailwind classes
- [Phase 01-design-system]: CodeBlock dark interior (bg-zinc-900/text-zinc-200) intentionally preserved — dark code blocks on light pages are industry convention, only outer border and language tab migrated
- [Phase 01-design-system]: CategoryBadge warm palette: blue/red/green Tailwind category colors replaced with accent-adjacent kraft palette (accent/10, accent/15, surface-raised)
- [Phase 01-design-system]: Hero conic-gradient halo: violet/cyan rgba swapped to rust rgba(200,90,58)/rgba(168,67,42) matching accent #C85A3A and accent-hover #A8432A
- [Phase 01-design-system]: motion installed via public npm registry flag (corporate Artifactory proxy not reachable from home network)
- [Phase 01-design-system]: eslint.config.mjs created with next/core-web-vitals + next/typescript (pre-existing gap, needed for npm run lint)
- [Phase 01-design-system]: Badge resting state uses bg-surface-raised/border-border (kraft light) instead of dark zinc — consistent with warm palette
- [Phase 01-design-system]: Hero inline style overrides Tailwind bg-gradient-to-b intentionally for compound radial vignette + linear gradient background
- [Phase 01-design-system]: Header scrolled initialized to true — always-visible on first paint, no SSR trick needed
- [Phase 01-design-system]: Bottom dark linear gradient removed from page headers — meaningless on light kraft background; border-b border-border provides section separation
- [Phase 01-design-system]: Page header pattern established: bg-surface-raised border-b border-border -mt-14 with rust radial vignette rgba(200,90,58,0.06)
- [Phase 01-design-system]: Page transition duration set to 0.25 (250ms) — lower bound of UI-SPEC 250-300ms range
- [Phase 02-notion-foundation-blog]: vitest chosen over Jest for zero-config Next.js/Vite, native ESM, faster HMR
- [Phase 02-notion-foundation-blog]: it.todo() stubs ensure vitest exits 0 throughout Wave 1/2, enabling health-check after each commit
- [Phase 02-notion-foundation-blog]: describe blocks named by requirement ID (NOTI-01, NOTI-02 etc.) for traceability between tests and requirements
- [Phase 02-notion-foundation-blog]: @notionhq/client pinned to v2.x — v5.x broke databases.query, no benefit for single-source blog
- [Phase 02-notion-foundation-blog]: server-only resolved via vitest.config.ts alias to empty stub — preserves Next.js build guard while allowing test execution
- [Phase 02-notion-foundation-blog]: vi.hoisted() required for mock variables used inside vi.mock() factory functions — avoids temporal dead zone errors
- [Phase 02-notion-foundation-blog]: static content files marked @ts-nocheck — deleted in plan 02-03, not worth migrating to new BlogBlock types
- [Phase 02-notion-foundation-blog]: Store only alphanumeric token portion of Netlify Build Hook URL as NETLIFY_BUILD_HOOK_TOKEN GitHub Secret — not full URL

### Pending Todos

None yet.

### Blockers/Concerns

- Confirm Notion plan tier before Phase 2: webhook automation requires Notion Plus or above. If on free plan, fallback is a GitHub Actions daily cron posting to the Netlify Build Hook — no architectural change, different trigger.
- Slug strategy for existing blog posts must be decided in Phase 2: Notion property vs. page ID, must match current slugs exactly to preserve SEO.

## Session Continuity

Last session: 2026-03-16T11:57:35.075Z
Stopped at: Checkpoint in 02-03-PLAN.md — awaiting human: Notion content migration + secrets setup
Resume file: None
