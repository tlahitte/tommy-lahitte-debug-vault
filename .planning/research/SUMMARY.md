# Project Research Summary

**Project:** debug-vault — Tommy Lahitte maker/tinkerer portfolio
**Domain:** Notion-as-CMS headless portfolio (projects + blog) on Next.js 15 / Netlify
**Researched:** 2026-03-15
**Confidence:** HIGH

## Executive Summary

debug-vault is a maker/tinkerer personal portfolio built on Next.js 15 with full SSG output on Netlify. The core evolution is replacing static TypeScript content files with Notion as the editing CMS for two content types — blog posts and a new projects section — while simultaneously rebranding the visual identity toward a kraft/industrial aesthetic inspired by Teenage Engineering. Research across all four domains converges on a clear, low-complexity pattern: `@notionhq/client` + `notion-to-md` + `react-markdown` at build time, with a Netlify Build Hook triggered by a Notion database automation on "Status = Published". No serverless functions, no ISR, no runtime infrastructure.

The recommended approach is a phased migration: establish the design system first (before any component work to avoid rework), then build the Notion data layer starting with the blog migration (lower risk, familiar content type), then layer in the new projects section on top of the verified Notion foundation. The design system and Notion integration are the two critical-path dependencies — everything else (project gallery, process documentation pages, homepage rework) follows once these are solid.

The top risk is the interplay of three Notion-specific traps that must all be handled in the data fetching layer before any real content is deployed: expiring S3 image URLs (images break within 1 hour post-deploy unless downloaded at build time), API rate limits at build scale (3 req/sec; parallel Next.js build workers can burst past this with 30+ pages), and recursive child block fetching (toggle/column blocks silently drop content without a recursive fetch implementation). All three are solvable at the architecture level and must be treated as build requirements, not cleanup items.

---

## Key Findings

### Recommended Stack

The Notion integration is fully covered by the official SDK ecosystem. `@notionhq/client` v5.13.0 is the only correct SDK to use — unofficial alternatives (`notion-client`, `react-notion-x`) are reverse-engineered and unstable. The block-to-markdown pipeline via `notion-to-md` v3.1.9 (stable) feeding into `react-markdown` v10 + `remark-gfm` v4 is a proven pattern with well-documented community usage. All packages are ESM-compatible with Next.js 15 App Router without wrappers.

The rebuild trigger is handled entirely without infrastructure: Netlify generates a Build Hook URL; Notion Database Automation fires a POST to it when a page is set to "Published". The only constraint is that the Notion automation webhook action requires a paid Notion plan (Plus or above). If Tommy is on the free plan, a daily GitHub Actions cron job posting to the Netlify hook is the fallback.

**Core technologies:**
- `@notionhq/client` v5.13.0: official Notion API SDK — the only correct client
- `notion-to-md` v3.1.9: converts Notion block tree to Markdown; v4 alpha not production-ready
- `react-markdown` v10 + `remark-gfm` v4: renders markdown to React Server Components safely
- `rehype-highlight` v7 (optional): syntax highlighting for code blocks in blog articles
- Netlify Build Hook: rebuild trigger endpoint; POSTed to by Notion automation on publish

**Stack decisions to lock in early:**
- `force-static` on all content routes — do not allow accidental fallback to SSR
- `NOTION_API_KEY` and `NOTION_BLOG_DATABASE_ID` / `NOTION_PROJECTS_DATABASE_ID` as Netlify env vars, never committed
- Two separate Notion databases (blog, projects) — not one unified "Content" database

### Expected Features

Notion CMS integration is the critical path — projects, process docs, cross-linking, and the filter system all depend on it landing first. The design system must be established before any content page template is built, or all component work gets done in the wrong visual context.

**Must have — v1 launch:**
- Notion CMS integration (projects + blog) — foundation for all content features
- Project gallery page — visual grid with cover image, title, one-liner
- Per-project page — gallery, motivation, process narrative, "what I learned", tools used
- Design system — kraft/beige palette, Teenage Engineering-inspired type and spacing
- Blog index + article pages — redesigned for the new visual identity
- About page — maker identity, not resume; must communicate "why I build"
- Homepage — opinionated hero statement + featured projects as proof
- Responsive layout + existing SEO preserved through the redesign

**Should have — v1.x (after validation):**
- Category/filter on projects — add when project count reaches 8+
- Cross-linking projects to articles — once both types have several published items
- RSS feed for blog — low effort, high return for returning readers
- Estimated complexity/time badge per project

**Defer — v2+:**
- Build log / chronological process entries — requires content discipline habit to form first
- Full-text search — only warranted at 100+ items across both content types

**Confirmed anti-features (do not build):**
- Comment system, dark mode toggle, real-time analytics, newsletter, user auth/saved state, CMS admin interface on the site

### Architecture Approach

The architecture is a four-layer SSG pipeline: Notion workspace (source of truth) → data access layer in `src/lib/` → Next.js App Router page layer with `generateStaticParams()` → presentation components. The Notion API is called exclusively at build time; no runtime calls are made after the static files are written. Images are downloaded during the build to `public/notion-images/` with block IDs as filenames, eliminating all post-deploy S3 URL expiry issues. The migration from static TypeScript files to Notion is parallel-build: the Notion layer is built and verified before any existing content files are deleted.

**Major components:**
1. `src/lib/notion.ts` — Notion client singleton with `React.cache()` wrapper; build-time image download helper
2. `src/lib/projects.ts` + `src/lib/blog.ts` — Notion DB queries; raw API responses mapped to typed `Project` / `BlogPost` interfaces before any component sees them
3. `src/lib/blocks.ts` — single shared Notion block → React structure transformer for both content types
4. `src/app/projects/[slug]/page.tsx` + `src/app/blog/[slug]/page.tsx` — static route generation via `generateStaticParams()`
5. `src/components/projects/` — `ProjectCard`, `ProjectGrid`, `ImageGallery` (new)
6. Notion Database Automation → Netlify Build Hook URL — zero-infrastructure rebuild trigger

### Critical Pitfalls

1. **Notion image URLs expire after 1 hour** — download all Notion-hosted images to `public/notion-images/` at build time using the block ID as the filename; never pass S3 signed URLs to rendered HTML. This must be in the data fetching layer from day one, not added later.

2. **API rate limit burst at build scale** — implement a 300ms minimum gap between Notion API calls in `src/lib/notion.ts` before the data layer is used at full content scale. With 20+ tips + blog + projects, unthrottled parallel build workers will hit HTTP 429 and fail non-deterministically.

3. **Incomplete block type coverage causes silent content loss** — build the block renderer exhaustively from the start with TypeScript exhaustive-switch and dev-mode visual warnings for unsupported types. Priority types: `callout`, `toggle`, `image`, `code`, `table`, `column_list`, `divider`, `quote`, `bulleted_list_item`, `numbered_list_item`. This project already has a documented bug for this pattern in CONCERNS.md.

4. **Recursive child block fetching required** — blocks with `has_children: true` (toggles, columns) need separate API calls. A project page with 10 toggle blocks requires 11+ API calls minimum. Implement recursive fetch with batched `Promise.all` and rate-limit awareness; never assume one API call returns a complete page.

5. **Schema.org XSS via unsanitized JSON-LD** — this is an existing documented bug in CONCERNS.md that escalates significantly when Notion (user-editable) becomes the content source. Fix the sanitization before Notion integration goes live.

6. **Tailwind design tokens must be extracted before any component work** — hardcoding `bg-zinc-900` or `bg-gray-100` in components makes the rebrand a full-site surgery. Define semantic tokens (`surface`, `text-primary`, `accent`) in `tailwind.config.ts` as the first step of the visual phase, before touching any component.

---

## Implications for Roadmap

Based on the dependency graph and pitfall timing requirements, four phases emerge. The design system and Notion data layer are both critical-path prerequisites that must land before any content page work begins.

### Phase 1: Design System and Visual Identity
**Rationale:** Design system is a prerequisite for all component work. Building project page templates or blog redesigns in the wrong visual context means rework. Establish the kraft/industrial token layer first, then every component built afterward is correct by default. This phase has no external dependencies.
**Delivers:** Tailwind semantic token layer (palette, type scale, spacing), global layout and navigation components redesigned for the maker identity, component inventory for visual audit.
**Addresses:** Design system / visual identity (P1 feature), identity-coherent navigation, typography redesign.
**Avoids:** Tailwind hardcoded color tech debt (fix before any new components are written); dark mode removal (remove `darkMode` config key in this phase).
**Research flag:** Standard patterns — Tailwind configuration and token extraction are well-documented. No additional research needed.

### Phase 2: Notion CMS Foundation (Blog Migration)
**Rationale:** Notion integration is the critical-path dependency for all content features. Blog migration is the lower-risk entry point — it replaces existing content with a verified equivalent, rather than introducing a new content type. If the Notion layer breaks, it breaks on familiar content with a safe rollback (TypeScript files still exist until verified). All critical pitfalls (image expiry, rate limits, block coverage, recursive fetch) must be solved in this phase.
**Delivers:** `src/lib/notion.ts` (client, image download, rate-limit throttle), `src/lib/blog.ts` (replaces static imports), `src/lib/blocks.ts` (exhaustive block renderer with dev warnings), blog pages rebuilt with new design system styling, Netlify Build Hook configured, Notion database automation set up.
**Uses:** `@notionhq/client` v5.13.0, `notion-to-md` v3.1.9, `react-markdown` v10, `remark-gfm` v4.
**Implements:** Data access layer, block transformer, webhook pipeline.
**Avoids:** Image URL expiry (download at build), rate limit burst (throttle wrapper), block type coverage gaps (exhaustive renderer), Schema.org XSS (fix sanitization before Notion content goes live), build hook URL exposure (Netlify env vars only).
**Research flag:** Well-documented patterns for the SDK integration. The image download build script and rate-limit throttle implementation are the custom elements — straightforward but require careful implementation. No additional research needed.

### Phase 3: Projects Section (New Content Type)
**Rationale:** Projects are the primary differentiator and the reason for the full redesign. They build directly on the verified Notion foundation from Phase 2 — same data layer patterns, same block renderer, same design tokens. The new elements are the project-specific components (ProjectCard, ProjectGrid, ImageGallery) and the structured process documentation page layout.
**Delivers:** Notion Projects database schema, `src/lib/projects.ts`, `/projects` listing page, `/projects/[slug]` detail page with structured sections (motivation, process, what I learned, tools/materials), `ProjectCard`, `ProjectGrid`, `ImageGallery` components, projects section on homepage with featured projects, per-project SEO metadata from Notion properties.
**Addresses:** Project gallery (P1), per-project process documentation (P1 — the key differentiator), "what I learned / failures" section (P1), materials/tools callout (P2), homepage featured projects (P1).
**Avoids:** Passing raw Notion API responses to components (always map to typed interfaces first), one monolithic Notion database for all content (separate Projects DB from Blog DB).
**Research flag:** Standard patterns — same Notion SDK patterns as Phase 2, standard Next.js dynamic routes. No additional research needed.

### Phase 4: About Page, Homepage, and Content Polish
**Rationale:** With the design system, CMS pipeline, and both content types operational, the remaining work is the high-level narrative pages (About, homepage) and the v1.x enhancements that require actual published content to be meaningful (category filter, cross-linking).
**Delivers:** About page (maker identity, not resume), homepage redesign (opinionated hero + featured projects), category/filter on projects list, cross-linking between projects and related articles, RSS feed for blog.
**Addresses:** About page (P1), homepage maker identity (P1), category filter (P2), cross-linking (P2), RSS (P2).
**Avoids:** Building category filter before there are enough projects to filter (add at 8+ items); building cross-linking before both content types have published items.
**Research flag:** Standard patterns. Category filter follows the existing Tips page pattern. RSS is a well-documented Next.js static route. No research needed.

### Phase Ordering Rationale

- Phase 1 before Phase 2: Design tokens must be established before any component is built. Doing it after means finding and replacing hardcoded values across every component.
- Phase 2 before Phase 3: The Notion data layer (image download, throttle, recursive fetch, block renderer) must be proven correct on the lower-risk blog content before it is trusted for the new projects section.
- Phase 3 before Phase 4: The homepage and About page reference real project content; building them before projects exist means working with placeholder data.
- Blog migration (Phase 2) uses parallel-build safety: existing TypeScript content files stay untouched until Notion layer is verified. Rollback is always one git revert away.

### Research Flags

Phases needing deeper research during planning:
- None identified. All four phases use well-documented patterns with official SDK support and verified community implementations. The custom elements (image download script, rate-limit throttle, recursive block fetch) are implementation tasks, not research questions.

Phases with standard patterns (skip research-phase):
- **All four phases** — high-confidence research with official documentation backing. The roadmapper can define tasks directly from this summary and the four research files.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All packages verified against npm registry and official docs; version compatibility confirmed; community validation of the notion-to-md + react-markdown pattern |
| Features | HIGH | Multiple converging sources (Hackaday, portfolio design research, maker community standards); feature prioritization consistent with existing PROJECT.md constraints |
| Architecture | HIGH | Patterns verified via official Next.js App Router docs, official Notion API docs, Netlify build hooks docs; migration path is safe with parallel-build approach |
| Pitfalls | HIGH | Notion image expiry documented in official file object reference; rate limits from official rate-limit docs; block type coverage gap confirmed by existing CONCERNS.md bug |

**Overall confidence:** HIGH

### Gaps to Address

- **Notion plan tier:** The webhook automation trigger (Notion → Netlify) requires Notion Plus or above. Confirm Tommy's plan before the Phase 2 kickoff. If on free plan, the GitHub Actions daily cron is the fallback — no architectural change needed, just a different trigger.
- **Slug strategy for existing blog posts:** The current blog uses TypeScript slugs. The Notion migration must produce the same URL slugs to preserve SEO (existing indexed URLs). Confirm whether to use the Notion page ID or a dedicated Slug property, and verify existing slugs are preserved.
- **Image caching strategy for CI:** Build-time image downloads must be cached between Netlify builds to avoid re-downloading the same images on every rebuild. Netlify's build cache (`netlify.toml` `[build.processing]` cache paths) or a skip-if-exists check in the download script should be implemented in Phase 2.
- **Tips section CMS parity:** Tips are currently TypeScript-only and are out of scope for the initial milestone per PROJECT.md. This gap will need a decision point after Phase 4 — leave as TypeScript indefinitely or migrate to a third Notion database.

---

## Sources

### Primary (HIGH confidence)
- github.com/makenotion/notion-sdk-js — `@notionhq/client` v5.13.0 verified latest stable
- npmjs.com/package/notion-to-md — v3.1.9 stable, v4 alpha not production-ready
- npmjs.com/package/react-markdown — v10.1.0 latest, ESM-compatible
- developers.notion.com/reference/request-limits — 3 req/sec rate limit confirmed
- developers.notion.com/reference/file-object — image URL expiry documented
- notion.com/help/webhook-actions — paid plan requirement for automation webhook confirmed
- docs.netlify.com/build/configure-builds/build-hooks/ — build hook POST trigger confirmed
- nextjs.org/docs/app/api-reference/functions/generate-static-params — SSG pattern in App Router

### Secondary (MEDIUM confidence)
- ppaanngggg.medium.com — Notion as Headless CMS for Next.js 15 — community validation of stack pattern
- snugl.dev/archive/fixing-notions-1-hour-expiring-image-problem — image expiry analysis and solution
- bejamas.com/hub/guides/how-to-create-next-js-blog-using-notion-as-a-cms — migration pattern validation
- Hackaday.com / Hackaday.io — maker portfolio documentation philosophy (features research)
- Speckyboy, Design Shack, Dribbble Design Blog — portfolio storytelling and UX references (features research)
- hookdeck.com — Notion webhook security and HMAC signature verification

### Tertiary (LOW confidence)
- .planning/codebase/CONCERNS.md — existing tech debt items (internal, not a research source but directly relevant to pitfalls)

---
*Research completed: 2026-03-15*
*Ready for roadmap: yes*
