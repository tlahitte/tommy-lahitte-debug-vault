---
phase: 02-notion-foundation-blog
plan: "02"
subsystem: api
tags: [notion, blog, typescript, vitest, next.js, data-access-layer]

# Dependency graph
requires:
  - phase: 02-notion-foundation-blog
    provides: 02-01 vitest config and test infrastructure scaffolding
provides:
  - Notion Client singleton (server-only) at src/lib/notion.ts
  - Extended BlogBlock union (11 types) and RichTextItem at src/lib/blog-types.ts
  - Async Notion-backed getAllPosts() and getPostBySlug() at src/lib/blog.ts
  - Build-time image downloader at src/scripts/download-notion-images.ts
  - Single-column editorial blog list page at src/app/blog/page.tsx
affects:
  - 02-03 (Notion content migration — depends on this DAL)
  - 02-04 (Blog article detail enhancements — depends on BlogBlock types and getPostBySlug)
  - 02-05 (NotionBlock renderer component — depends on BlogBlock union)

# Tech tracking
tech-stack:
  added:
    - "@notionhq/client@^2.3.0 (pinned to v2.x API surface, away from v5 breaking change)"
  patterns:
    - "Notion Client singleton with server-only guard — import 'server-only' prevents client bundle inclusion"
    - "Cursor-loop pagination for Notion databases.query (has_more / next_cursor)"
    - "Build-time image download: file-type Notion URLs downloaded to /public/notion-images/{blockId}.{ext} — never stored as raw Notion URLs"
    - "Async server component pattern — all blog routes now async, await getAllPosts()/getPostBySlug()"
    - "vi.hoisted() for vitest mock variables used inside vi.mock() factory functions"
    - "server-only resolved via vitest.config.ts alias to empty stub module"

key-files:
  created:
    - src/lib/notion.ts
    - src/scripts/download-notion-images.ts
    - src/__mocks__/server-only.ts
  modified:
    - src/lib/blog-types.ts
    - src/lib/blog.ts
    - src/lib/notion.test.ts
    - src/lib/blog.test.ts
    - src/app/blog/page.tsx
    - src/app/blog/[slug]/page.tsx
    - src/app/page.tsx
    - src/app/sitemap.ts
    - src/content/blog/elevenlabs-elevenpapps-immersive-show.ts
    - src/content/blog/people-person-show.ts
    - vitest.config.ts

key-decisions:
  - "Pin @notionhq/client to v2.x (^2.3.0) — v5.x broke databases.query with no benefit for single-source blog"
  - "server-only resolved via vitest alias to empty stub — avoids test environment build failure while preserving the guard in Next.js production builds"
  - "Static content files (src/content/blog/*.ts) marked @ts-nocheck — to be deleted in plan 02-03, not worth migrating to new types"
  - "vi.hoisted() pattern for vitest mocks — required when mock variables are referenced inside vi.mock() factory to avoid temporal dead zone errors"
  - "renderBlock in slug page updated to full 11-type BlogBlock union — old paragraph/heading/list cases replaced"

patterns-established:
  - "Notion Client singleton pattern: import 'server-only' + new Client({ auth: process.env.NOTION_TOKEN })"
  - "Image download pattern: detect file.type === 'file' vs 'external', download file-type to /public/notion-images/, return local path"
  - "Silent block fallback: mapNotionBlock() returns null for unknown types, filter(b => b !== null) removes them"
  - "Vitest mock hoisting: use vi.hoisted() to create mock variables before vi.mock() factory runs"

requirements-completed: [NOTI-01, NOTI-03, NOTI-04]

# Metrics
duration: 8min
completed: 2026-03-16
---

# Phase 2 Plan 02: Notion Data Layer Summary

**Notion-backed blog DAL with @notionhq/client v2.x, cursor pagination, build-time image download, extended 11-type BlogBlock union, and single-column editorial blog list page**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-16T11:43:40Z
- **Completed:** 2026-03-16T11:51:18Z
- **Tasks:** 4
- **Files modified:** 11 modified, 3 created

## Accomplishments

- Notion Client singleton created with `import 'server-only'` guard preventing accidental client-side bundle inclusion
- Complete async blog DAL: getAllPosts() with cursor pagination + Published filter + Date sort, getPostBySlug() with recursive block children fetch
- Build-time image downloader: detects file vs external Notion URLs, downloads expiring file-type images to /public/notion-images/{blockId}.{ext}, idempotent on repeat
- Extended BlogBlock union with 11 types (paragraph, heading_1-3, code, callout, bulleted_list_item, numbered_list_item, image, toggle, divider) + RichTextItem type
- Blog list page rewritten to single-column editorial layout with divide-y article rows — no card grid remains
- 16 mock-based unit tests passing for getAllPosts(), getPostBySlug(), pagination, image download, slug extraction, and block recursion

## Task Commits

1. **Task 1: Notion client singleton and extended BlogBlock types** - `456982c` (feat)
2. **Task 2: Build-time image downloader** - `77d16be` (feat)
3. **Task 3: Notion-backed blog DAL and tests** - `c2327a6` (feat)
4. **Task 4: Rewrite blog list to single-column editorial layout** - `ce11203` (feat)

**Plan metadata:** (created after this summary)

## Files Created/Modified

- `src/lib/notion.ts` — Notion Client singleton with server-only guard
- `src/lib/blog-types.ts` — RichTextItem + 11-variant BlogBlock union + BlogPost interface
- `src/lib/blog.ts` — Async Notion-backed DAL (getAllPosts, getPostBySlug, getBlocksWithChildren, mapNotionBlock)
- `src/scripts/download-notion-images.ts` — Build-time image downloader, idempotent, returns /notion-images/ local paths
- `src/app/blog/page.tsx` — Single-column editorial list, async server component
- `src/app/blog/[slug]/page.tsx` — Updated renderBlock for 11-type union, await on getAllPosts/getPostBySlug
- `src/app/page.tsx` — Converted to async server component, awaits getAllPosts()
- `src/app/sitemap.ts` — Async function returning Promise<MetadataRoute.Sitemap>, awaits getAllPosts()
- `src/lib/notion.test.ts` — 8 mock-based tests for getAllPosts/getPostBySlug/getBlocksWithChildren
- `src/lib/blog.test.ts` — 8 mock-based tests for property mapping and slug preservation
- `src/__mocks__/server-only.ts` — Empty stub for test environment
- `vitest.config.ts` — Added server-only alias for test environment
- `src/content/blog/*.ts` — Added @ts-nocheck (pending deletion in plan 02-03)

## Decisions Made

- Pinned `@notionhq/client` to v2.x (`^2.3.0`) — v5.x released in September 2025 broke `databases.query` with no benefit for this single-source blog
- Used `vi.hoisted()` pattern for vitest mock variables — required to avoid temporal dead zone when mock variables are referenced inside `vi.mock()` factory functions
- Added `server-only` alias in vitest.config.ts pointing to an empty stub file — Next.js's `server-only` package doesn't resolve in Vitest's jsdom environment; the alias preserves the build-time guard while allowing tests to run
- Added `@ts-nocheck` to static content files instead of migrating them to the new BlogBlock types — these files are deleted in plan 02-03, migration would be pointless

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated renderBlock in [slug]/page.tsx to use new 11-type BlogBlock union**
- **Found during:** Task 3 (blog.ts rewrite — ran tsc)
- **Issue:** Existing renderBlock function referenced `block.text`, `block.items`, and `case 'heading'`/`case 'list'` — all removed from the new BlogBlock union
- **Fix:** Replaced renderBlock with full switch over all 11 new block types, added renderRichText helper for RichTextItem arrays
- **Files modified:** src/app/blog/[slug]/page.tsx
- **Verification:** npx tsc --noEmit exits 0
- **Committed in:** c2327a6 (Task 3 commit)

**2. [Rule 1 - Bug] Updated app/page.tsx and sitemap.ts to await async getAllPosts()**
- **Found during:** Task 3 (blog.ts rewrite — tsc reported Promise.map error)
- **Issue:** app/page.tsx used `getAllPosts().slice()` and sitemap.ts used synchronous `getAllPosts()` — both now return Promise
- **Fix:** Made HomePage and sitemap async functions, added await to getAllPosts() call
- **Files modified:** src/app/page.tsx, src/app/sitemap.ts
- **Verification:** npx tsc --noEmit exits 0
- **Committed in:** c2327a6 (Task 3 commit)

**3. [Rule 3 - Blocking] Fixed vitest failing to resolve server-only**
- **Found during:** Task 3 (npx vitest run — module resolution error)
- **Issue:** `import 'server-only'` in notion.ts fails in Vitest's jsdom environment — package is Next.js specific
- **Fix:** Added `'server-only'` alias in vitest.config.ts pointing to `src/__mocks__/server-only.ts` (empty stub), created that file
- **Files modified:** vitest.config.ts, src/__mocks__/server-only.ts
- **Verification:** npx vitest run exits 0, 16 tests pass
- **Committed in:** c2327a6 (Task 3 commit)

---

**Total deviations:** 3 auto-fixed (2 bug fixes, 1 blocking)
**Impact on plan:** All auto-fixes necessary for TypeScript correctness and test execution. No scope creep — all changes directly caused by the blog.ts async rewrite.

## Issues Encountered

- Vitest vi.mock() factory with inner vi.fn() calls caused "not a constructor" error when used with `new Client()`. Solution: use vi.hoisted() to create mock functions before the mock factory runs — this is the documented Vitest pattern for this scenario.

## User Setup Required

External services require manual configuration before this plan's output can be used at build time:

- `NOTION_TOKEN` — Notion Settings → My connections → Develop or manage integrations → New integration → copy the Internal Integration Secret
- `NOTION_DATABASE_ID` — Open your Notion Blog database → Share → Copy link → extract the 32-char ID from the URL
- Create the Blog database in Notion with: Title (title), Slug (rich_text), Status (select: Draft|Published), Date (date), Excerpt (rich_text), Cover (files), ExternalLink (url), ExternalLinkLabel (rich_text)
- Share the database with your integration: database top-right '...' → Connections → add your integration
- Add both env vars to `.env.local` (local dev) and Netlify environment variables (Site settings → Environment variables)

## Next Phase Readiness

- Notion DAL is complete — plan 02-03 (content migration) can populate the database and verify slug resolution
- BlogBlock union types are ready for the NotionBlock renderer component (plan 02-05)
- getPostBySlug() returns full block content — article detail enhancements (plan 02-04) can build on this
- TypeScript clean, 16 unit tests passing

## Self-Check: PASSED

| Item | Status |
|------|--------|
| src/lib/notion.ts | FOUND |
| src/lib/blog-types.ts | FOUND |
| src/lib/blog.ts | FOUND |
| src/scripts/download-notion-images.ts | FOUND |
| src/app/blog/page.tsx | FOUND |
| src/__mocks__/server-only.ts | FOUND |
| src/lib/notion.test.ts | FOUND |
| src/lib/blog.test.ts | FOUND |
| Commit 456982c | FOUND |
| Commit 77d16be | FOUND |
| Commit c2327a6 | FOUND |
| Commit ce11203 | FOUND |

---
*Phase: 02-notion-foundation-blog*
*Completed: 2026-03-16*
