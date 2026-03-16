---
phase: 03-projects-section
verified: 2026-03-16T16:09:00Z
status: passed
score: 11/11 must-haves verified
re_verification: false
---

# Phase 3: Projects Section — Verification Report

**Phase Goal:** Unified content hub under /blog (renamed "Journal") with category filtering, project status badges, and photo galleries — extending the proven Notion blog infrastructure
**Verified:** 2026-03-16T16:09:00Z
**Status:** passed
**Re-verification:** No — initial verification

---

## Architectural Context

Before verification, an important design decision must be noted.

REQUIREMENTS.md PROJ-01 states: "Une page liste `/projects` affiche tous les projets publiés depuis Notion" — implying a dedicated `/projects` route. No such route exists in the codebase. However, this is a **documented, deliberate architectural reinterpretation** recorded in `03-CONTEXT.md` before any planning began:

> "No separate `/projects` route — everything lives under `/blog`. This is a reinterpretation of PROJ-01 through PROJ-05: instead of building a new content type from scratch, we extend the proven blog infrastructure with categories, richer metadata, and gallery support."

The ROADMAP.md Success Criteria for Phase 3 reflect this decision — they describe a filterable `/blog` listing, not a `/projects` route. The REQUIREMENTS.md markers are checked [x] Complete. The requirement spirit (browse and discover projects) is satisfied. This is not a gap — it is an intended scope change captured in the planning record.

---

## Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visiting `/blog` shows a filterable listing with pill row: All / Projects / Articles / Recommendations | VERIFIED | `BlogCategoryFilter.tsx` renders 4 pills; `BlogList.tsx` filters by `?category=` param; wired in `blog/page.tsx` inside Suspense |
| 2 | Clicking a category pill filters the listing to that category via URL param | VERIFIED | `handleSelect` pushes `?category={value}` via `router.push`; `BlogList` reads same param and applies `posts.filter((p) => p.category === categoryParam)` |
| 3 | "All" is selected by default showing every content type | VERIFIED | `searchParams.get('category') ?? 'all'`; no filter applied when `categoryParam` is null |
| 4 | Project cards get bigger cover images (aspect-[16/9]) vs articles (aspect-[16/6]) | VERIFIED | `post.category === 'Project' ? 'aspect-[16/9]' : 'aspect-[16/6]'` in `BlogList.tsx` line 38-41 |
| 5 | Each listing card shows a category badge | VERIFIED | `{post.category && <span>...{post.category}...</span>}` in `BlogList.tsx` lines 46-50 |
| 6 | BlogPost type includes category, status, and gallery fields | VERIFIED | `src/lib/blog-types.ts` lines 26-27 (type aliases) and lines 41-43 (interface fields) |
| 7 | mapNotionPageToBlogPost extracts Category, ProjectStatus, Gallery from Notion | VERIFIED | `blog.ts` lines 150-173: all three property extractions present and substantive |
| 8 | Gallery images are downloaded at build time via downloadNotionImage (not raw Notion URLs) | VERIFIED | `blog.ts` line 169: `await downloadNotionImage(file.file.url, \`${page.id}-gallery-${i}\`)` |
| 9 | A project detail page shows a status badge only for Project category | VERIFIED | `[slug]/page.tsx` line 123: `{post.category === 'Project' && post.status && <StatusBadge ... />}` |
| 10 | A project detail page shows a photo gallery between header and body content | VERIFIED | `[slug]/page.tsx` line 133: `{post.category === 'Project' && post.gallery && post.gallery.length > 0 && <ProjectGallery ... />}` — placed after `</header>`, before `<div className="space-y-4">` |
| 11 | Nav says "Journal" instead of "Blog" with no Projects link (3 entries only) | VERIFIED | `Header.tsx` lines 16-18: array has exactly `Journal`, `Unreal Tips`, `About` — no Projects entry |

**Score: 11/11 truths verified**

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/lib/blog-types.ts` | PostCategory, ProjectStatus types + extended BlogPost | VERIFIED | Lines 26-27: type aliases; lines 41-43: category/status/gallery on BlogPost |
| `src/lib/blog.ts` | Extended property mapping for category, status, gallery | VERIFIED | Lines 149-175: full extraction + downloadNotionImage for gallery |
| `src/lib/blog.test.ts` | Unit tests for new property mappings | VERIFIED | 3 new `describe` blocks (PROJ-01, PROJ-04, PROJ-03); 7 tests; all pass |
| `src/components/layout/Header.tsx` | Updated nav with Journal label, no Projects link | VERIFIED | 3-entry nav array, "Journal" label at `/blog` |
| `src/components/blog/BlogCategoryFilter.tsx` | Client-side pill filter with URL param state | VERIFIED | `'use client'`, `useSearchParams`, `useRouter`, `aria-pressed`, `role="group"` |
| `src/components/blog/BlogCategoryFilter.test.tsx` | Unit tests for filter + filtering logic | VERIFIED | 6 tests (3 filter pills + 3 BlogList filtering); all pass |
| `src/components/blog/BlogList.tsx` | Client wrapper for filter state + differentiated cards | VERIFIED | `'use client'`, imports `BlogCategoryFilter`, renders differentiated aspect ratios and category badges |
| `src/app/blog/page.tsx` | Server page passing posts to BlogList in Suspense | VERIFIED | `<Suspense fallback={null}><BlogList posts={posts} /></Suspense>`, h1 "Journal" |
| `src/components/blog/StatusBadge.tsx` | Status pill with color coding per status value | VERIFIED | `STATUS_STYLES` Record with amber/emerald/zinc; `rounded-full border`; no `'use client'` (server component) |
| `src/components/blog/ProjectGallery.tsx` | Responsive CSS grid of gallery images | VERIFIED | `grid grid-cols-2 sm:grid-cols-3 gap-3`; `aspect-square object-cover`; `aria-label="Project gallery"` |
| `src/app/blog/[slug]/page.tsx` | Detail page with conditional StatusBadge and ProjectGallery | VERIFIED | Both imports present; conditionals gated on `post.category === 'Project'`; back link "Back to Journal" |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/lib/blog.ts` | `src/lib/blog-types.ts` | `import PostCategory, ProjectStatus` | WIRED | Line 4: `import type { BlogPost, BlogBlock, RichTextItem, PostCategory, ProjectStatus } from './blog-types'` |
| `src/lib/blog.ts` | `downloadNotionImage` | `downloadNotionImage` for gallery files | WIRED | Line 169: `await downloadNotionImage(file.file.url, \`${page.id}-gallery-${i}\`)` |
| `src/app/blog/page.tsx` | `src/components/blog/BlogList.tsx` | posts prop inside Suspense | WIRED | Line 4 import + line 41: `<BlogList posts={posts} />` inside `<Suspense>` |
| `src/components/blog/BlogList.tsx` | `src/components/blog/BlogCategoryFilter.tsx` | renders filter above filtered cards | WIRED | Line 5 import + line 21: `<BlogCategoryFilter />` rendered |
| `src/components/blog/BlogCategoryFilter.tsx` | `next/navigation` | `useSearchParams` + `useRouter` | WIRED | Line 3: import; line 14: `useSearchParams()`; line 13: `useRouter()` |
| `src/app/blog/[slug]/page.tsx` | `src/components/blog/StatusBadge.tsx` | conditional on `category === 'Project'` | WIRED | Line 7 import + line 123-128: conditional render with `post.category === 'Project' && post.status` |
| `src/app/blog/[slug]/page.tsx` | `src/components/blog/ProjectGallery.tsx` | conditional on gallery non-empty | WIRED | Line 8 import + line 133-135: conditional render with `post.category === 'Project' && post.gallery && post.gallery.length > 0` |

---

## Requirements Coverage

| Requirement | Source Plans | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| PROJ-01 | 03-01, 03-02 | "Une page liste affiche tous les projets" — reinterpreted as filterable `/blog` listing | SATISFIED (reinterpreted) | `BlogCategoryFilter` + `BlogList` on `/blog`; deliberate architectural decision documented in `03-CONTEXT.md` |
| PROJ-02 | 03-01, 03-03 | Project detail page with title, description, rich body content from Notion | SATISFIED | `[slug]/page.tsx` renders Notion blocks via `renderBlock`; `getPostBySlug` fetches full content |
| PROJ-03 | 03-01, 03-03 | Project pages show a photo gallery | SATISFIED | `ProjectGallery.tsx` renders responsive grid; gallery downloaded at build time in `blog.ts`; conditional render in detail page |
| PROJ-04 | 03-01, 03-03 | Each project has a visible status (In Progress / Complete / Archived) from Notion | SATISFIED | `ProjectStatus` type, `props['ProjectStatus']` extraction in `blog.ts`, `StatusBadge.tsx` renders amber/emerald/zinc pills, conditional in detail page |
| PROJ-05 | 03-02 | Projects tagged by category, filterable on listing | SATISFIED | `PostCategory` type, Category extraction, `BlogCategoryFilter` pills, `BlogList` URL-param filtering with 6 passing tests |

No orphaned requirements — all 5 IDs (PROJ-01 through PROJ-05) are claimed by at least one plan.

---

## Test Suite Results

```
Test Files: 2 passed (2)
Tests:      21 passed (21)
```

- `src/lib/blog.test.ts` — 14 tests: 7 existing (NOTI-04, BLOG-02) + 7 new (PROJ-01 x2, PROJ-04 x2, PROJ-03 x3)
- `src/components/blog/BlogCategoryFilter.test.tsx` — 6 tests: 3 filter pill + 3 BlogList filtering

TypeScript: `pnpm tsc --noEmit` exits 0 — no errors.

---

## Anti-Patterns Found

None. No TODOs, FIXMEs, placeholder comments, empty implementations, or stub handlers found in any modified file.

---

## Human Verification Required

### 1. Gallery visual rendering on a real project post

**Test:** Publish a Project post in Notion with 3+ Gallery images and a ProjectStatus. Trigger Netlify rebuild. Navigate to the post's detail page.
**Expected:** Gallery images appear in a responsive 2-col (mobile) / 3-col (desktop) square-cropped grid between the header and body content. Status badge appears inline with date and reading time (amber/emerald/zinc pill).
**Why human:** Requires a live Notion database with actual gallery images; cannot be verified statically.

### 2. Category filter interaction on /blog

**Test:** Visit `/blog`, click "Projects" pill. Click "Articles" pill. Click "All" pill.
**Expected:** Listing updates on each click without full page reload; URL updates to `?category=Project`, `?category=Article`, and back to no param; `aria-pressed` toggles correctly.
**Why human:** URL state transitions and scroll behavior (`scroll: false`) require a running browser.

### 3. Article detail page unchanged appearance

**Test:** Navigate to an existing Article-category blog post detail page.
**Expected:** No status badge, no gallery section visible — page looks identical to Phase 2 output.
**Why human:** Requires visual inspection against known baseline.

---

## Summary

Phase 3 goal is fully achieved. All 11 observable truths are verified against actual code. All 10 artifacts exist and are substantive. All 7 key links are wired. Both test files run clean (21/21). TypeScript compiles without errors. No anti-patterns or stubs detected.

The sole design deviation from the original REQUIREMENTS.md literal spec (no `/projects` route, content unified under `/blog`) is a deliberate, pre-planning architectural decision documented in `03-CONTEXT.md` and reflected in the ROADMAP.md Success Criteria. It does not constitute a gap.

---

_Verified: 2026-03-16T16:09:00Z_
_Verifier: Claude (gsd-verifier)_
