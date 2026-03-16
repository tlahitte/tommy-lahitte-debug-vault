---
phase: 02-notion-foundation-blog
plan: "05"
subsystem: ui
tags: [react, next.js, notion, blog, reading-progress, scroll-listener]

# Dependency graph
requires:
  - phase: 02-notion-foundation-blog
    plan: "04"
    provides: "renderBlock function from NotionBlock.tsx (11-type renderer)"
  - phase: 02-notion-foundation-blog
    plan: "02"
    provides: "BlogBlock/RichTextItem types from blog-types.ts"
provides:
  - ReadingProgressBar isolated leaf client component (scroll-tracked fixed accent bar)
  - Article detail page wired to 11-type NotionBlock renderer
  - Improved article header with text-4xl title, formatted date, reading time estimate, proportioned cover image
affects:
  - 02-notion-foundation-blog
  - any future blog UI work

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Leaf client component pattern: isolated 'use client' component used inside server page"
    - "Reading time estimate: wordCount / 200, min 1 min"
    - "Plain img for Notion images in static export (consistent with NotionBlock.tsx)"

key-files:
  created:
    - src/components/blog/ReadingProgressBar.tsx
  modified:
    - src/app/blog/[slug]/page.tsx

key-decisions:
  - "Plain img used for cover image (consistent with NotionBlock image treatment, static export compatibility)"
  - "ReadingProgressBar as isolated leaf client component — server page remains fully server-rendered"
  - "Reading time floor is 1 min (Math.max(1, Math.ceil(wordCount/200)))"

patterns-established:
  - "Leaf client component pattern: 'use client' scoped to the smallest unit needing browser APIs"
  - "Article header order: cover image → h1 title → date + reading time"

requirements-completed:
  - NOTI-02

# Metrics
duration: 3min
completed: 2026-03-16
---

# Phase 02 Plan 05: ReadingProgressBar and Article Detail Page Wiring Summary

**Isolated 'use client' ReadingProgressBar and 11-type NotionBlock renderer wired into article detail page with improved header (text-4xl title, reading time, proportioned cover image)**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-16T16:16:28Z
- **Completed:** 2026-03-16T16:19:Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Created ReadingProgressBar as an isolated leaf client component with passive scroll listener and zero-division guard
- Wired the 11-type NotionBlock renderer into the article detail page — old inline 3-type switch removed
- Improved article header: text-4xl bold title, formatted date as `<time>` element, reading time estimate, full-width cover image with 16/7 aspect ratio
- Page remains a server component — ReadingProgressBar is the only client boundary

## Task Commits

Each task was committed atomically:

1. **Task 1: Create ReadingProgressBar client component** - `61e5079` (feat)
2. **Task 2: Wire NotionBlock renderer and improved header into article detail page** - `81de0d8` (feat)

## Files Created/Modified

- `src/components/blog/ReadingProgressBar.tsx` - New leaf client component: fixed 2px accent bar tracking scroll percentage with passive listener and cleanup
- `src/app/blog/[slug]/page.tsx` - Article detail page: imports renderBlock from NotionBlock, renders ReadingProgressBar, improved header with reading time, plain img cover

## Decisions Made

- Plain `<img>` used for the cover image for consistency with NotionBlock image treatment and static export compatibility (dimensions unknown at build time)
- ReadingProgressBar scoped as a leaf client component — server page has no `use client` directive, no risk of server-only module leaking to client
- Reading time floor of 1 minute ensures short posts still show a useful estimate

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Article detail page is fully wired: 11-type renderer active, reading progress visible, header improved
- All locked UX decisions for the article page are now implemented (reading progress bar, improved header)
- Phase 02 foundation is complete — ready for Phase 03 (dynamic Notion content integration or further UI work)

---
*Phase: 02-notion-foundation-blog*
*Completed: 2026-03-16*
