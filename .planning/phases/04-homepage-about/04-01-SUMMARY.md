---
phase: 04-homepage-about
plan: 01
subsystem: ui
tags: [next.js, react, tailwind, notion, homepage, hero, maker-identity]

# Dependency graph
requires:
  - phase: 03-projects-section
    provides: getAllPosts() with category field, BlogCard component, AboutCard component
  - phase: 01-design-system
    provides: kraft design tokens, Hero component with TextShimmer and motion
  - phase: 02-notion-foundation-blog
    provides: getAllPosts() DAL, blog-types.ts BlogPost interface with category field
provides:
  - Maker-identity hero copy in Hero.tsx (Maker & Tinkerer tagline, updated CTAs)
  - Category-filtered homepage with 4 sections (hero, projects, articles, about)
  - Updated metadata title/description reflecting maker identity (not QA Engineer)
  - Featured Projects section filtering Notion posts by category=Project
  - Recent Articles section filtering Notion posts by category=Article
  - AboutCard embedded inline as homepage section 4 (HOME-04)
affects: [04-02-about-page, any future homepage composition]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - getAllPosts() called once per page, filtered in memory by category — never call per-category
    - Category-guarded sections with .length > 0 for graceful degradation when no categorized content
    - Hero maker identity pattern — Epic Games as credibility signal in body, not as headline

key-files:
  created: []
  modified:
    - src/components/home/Hero.tsx
    - src/app/page.tsx

key-decisions:
  - "Hero tagline uses 'Maker & Tinkerer · Art meets Technology' — Epic Games appears only in body as credibility context, not headline"
  - "getAllPosts() called once in page.tsx, filtered in-memory for Project and Article — no additional Notion queries"
  - "BlogCard reused for both project and article cards on homepage — FeaturedProjectCard not needed"
  - "Tips section removed from homepage entirely — nav link preserved as discovery path"
  - "Both project and article sections guarded with .length > 0 — homepage degrades gracefully if no categorized Notion content"

patterns-established:
  - "Pattern: Homepage category filtering — call getAllPosts() once, .filter(p => p.category === 'X').slice(0, N)"
  - "Pattern: Section guard — always wrap category-filtered sections in {items.length > 0 && (...)}"
  - "Pattern: Maker identity — foreground maker/builder role, use job title as supporting credibility signal"

requirements-completed: [HOME-01, HOME-02, HOME-03, HOME-04]

# Metrics
duration: 3min
completed: 2026-03-16
---

# Phase 04 Plan 01: Homepage Rewrite Summary

**Maker-identity homepage with 4-section layout: hero (Maker & Tinkerer), category-filtered Projects and Articles from Notion, and inline AboutCard — Tips section removed entirely**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-16T20:07:37Z
- **Completed:** 2026-03-16T20:09:53Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Rewrote Hero.tsx copy to foreground maker identity — "Maker & Tinkerer · Art meets Technology" as tagline, Epic Games as credibility signal in body text only
- Updated primary CTA from "Unreal Tips" (/tips) to "See Projects" (/blog?category=Project) to align navigation with maker-first identity
- Rewrote page.tsx with 4-section layout: hero, featured projects (category=Project), recent articles (category=Article), and inline AboutCard
- Updated metadata title and description to "Tommy Lahitte | Maker & Tinkerer" with maker-focused description
- Removed getAllTips/TipCard/Latest Tips section entirely — all 47 Vitest tests pass, pnpm build succeeds (30 static pages generated)

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite Hero.tsx — maker identity copy and updated CTAs** - `e5ab235` (feat)
2. **Task 2: Rewrite page.tsx — category-filtered sections, metadata, remove tips** - `3082f5b` (feat)

## Files Created/Modified

- `src/components/home/Hero.tsx` - Tagline changed to "Maker & Tinkerer · Art meets Technology", body copy updated, primary CTA changed to "See Projects" linking to /blog?category=Project
- `src/app/page.tsx` - Complete rewrite: maker metadata, getAllPosts() once with category filtering, 4 sections (hero/projects/articles/about), tips removed, AboutCard embedded

## Decisions Made

- BlogCard reused for both project and article cards — FeaturedProjectCard not needed, existing card handles image/hover/excerpt correctly
- Tips section removed from homepage (not from nav) — discovery path preserved through navigation, homepage narrative focuses on maker identity
- Both data sections guarded with `.length > 0` — graceful degradation when Notion has no categorized posts at build time

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Homepage fully reflects maker identity with Notion-sourced projects and articles
- AboutCard embedded inline satisfies HOME-04
- Ready for Phase 04-02: About page copy rewrite (ABOU-01)
- No blockers

---
*Phase: 04-homepage-about*
*Completed: 2026-03-16*

## Self-Check: PASSED

- `src/components/home/Hero.tsx` — FOUND
- `src/app/page.tsx` — FOUND
- `.planning/phases/04-homepage-about/04-01-SUMMARY.md` — FOUND
- Commit `e5ab235` — FOUND
- Commit `3082f5b` — FOUND
