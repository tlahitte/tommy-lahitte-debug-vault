---
phase: 03-projects-section
plan: 02
subsystem: ui
tags: [next.js, react, tailwind, vitest, testing-library, url-state, category-filter]

# Dependency graph
requires:
  - phase: 03-projects-section
    plan: 01
    provides: BlogPost type with category/status fields, getAllPosts fetching posts from Notion
provides:
  - BlogCategoryFilter: pill row UI reading/writing ?category= URL param
  - BlogList: client component filtering posts by category with differentiated card rendering
  - Unit tests validating filter pill rendering, URL param filtering, and empty state (PROJ-05)
affects: [03-03-projects-section, future-blog-features]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - useSearchParams + useRouter pattern for client-side URL state (established by tips/CategoryFilter.tsx, now applied to blog)
    - Server component fetches data, passes as props to client component in Suspense boundary
    - TDD with vitest + @testing-library/react mocking next/navigation hooks

key-files:
  created:
    - src/components/blog/BlogCategoryFilter.tsx
    - src/components/blog/BlogList.tsx
    - src/components/blog/BlogCategoryFilter.test.tsx
  modified:
    - src/app/blog/page.tsx

key-decisions:
  - "BlogList uses useSearchParams directly instead of receiving categoryParam as prop — consistent with filter source of truth in URL"
  - "Suspense boundary required around BlogList because useSearchParams suspends during SSR — wrapping in server page Suspense is the correct Next.js pattern"
  - "Project cards get aspect-[16/9] cover images (taller), articles/recommendations get aspect-[16/6] — visual hierarchy signals content type at a glance"

patterns-established:
  - "Blog filter pattern: pill row (BlogCategoryFilter) + list (BlogList) as separate client components, both reading useSearchParams"
  - "Server page pattern: fetch data server-side, wrap client components in Suspense fallback={null}"

requirements-completed: [PROJ-01, PROJ-05]

# Metrics
duration: 2min
completed: 2026-03-16
---

# Phase 3 Plan 02: Blog Category Filter and Differentiated Listing Cards Summary

**Pill-row category filter with URL param state and differentiated Project/Article/Recommendation cards, backed by 6 unit tests for PROJ-05**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-16T16:04:47Z
- **Completed:** 2026-03-16T16:06:23Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments
- BlogCategoryFilter component with All/Projects/Articles/Recommendations pills, URL state via useSearchParams + useRouter, aria-pressed accessibility
- BlogList client wrapper filtering posts by ?category= URL param with differentiated card rendering (aspect-[16/9] for projects, aspect-[16/6] for articles)
- Blog page refactored from inline server rendering to BlogList client component inside Suspense boundary, title renamed to "Journal"
- 6 unit tests covering all PROJ-05 behavior: pill rendering, default selected state, URL param filtering, empty state

## Task Commits

Each task was committed atomically:

1. **Task 1: Create BlogCategoryFilter and BlogList client components** - `075e0c3` (feat)
2. **Task 2: Rewire blog listing page to use BlogList with Suspense** - `af822e9` (feat)
3. **Task 3: Add unit tests for BlogCategoryFilter and BlogList filtering (PROJ-05)** - `6a21dee` (test)

## Files Created/Modified
- `src/components/blog/BlogCategoryFilter.tsx` - Pill filter row reading/writing ?category= URL param with aria-pressed accessibility
- `src/components/blog/BlogList.tsx` - Client wrapper filtering posts by category, differentiated card rendering by category type
- `src/components/blog/BlogCategoryFilter.test.tsx` - 6 unit tests covering PROJ-05 filter pill rendering and filtering logic
- `src/app/blog/page.tsx` - Server page delegating to BlogList in Suspense, title updated to "Journal"

## Decisions Made
- BlogList uses useSearchParams directly rather than receiving categoryParam as prop — URL is the single source of truth, both components read it independently
- Suspense boundary required around BlogList in server page because useSearchParams suspends during SSR — this is the correct Next.js App Router pattern
- Project cards use aspect-[16/9] (wider cinematic ratio) vs aspect-[16/6] (compact banner) for articles and recommendations — visual hierarchy signals content type

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Blog listing with category filtering is complete and tested
- BlogPost cards with differentiated rendering are ready
- Plan 03-03 (project detail page with StatusBadge, gallery) is already committed per git log, so phase 03 is progressing well
- No blockers

---
*Phase: 03-projects-section*
*Completed: 2026-03-16*
