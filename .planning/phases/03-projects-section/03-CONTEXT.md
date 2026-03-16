# Phase 3: Projects Section - Context

**Gathered:** 2026-03-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Unify projects and blog into a single content hub under `/blog` (renamed "Journal" in nav). Add a Category property to the existing Notion blog database to distinguish content types (Project, Article, Recommendation). Add category filter badges to the listing page. Enhance project detail pages with a status badge and photo gallery. No separate `/projects` route — everything lives under `/blog`.

This is a reinterpretation of PROJ-01 through PROJ-05: instead of building a new content type from scratch, we extend the proven blog infrastructure with categories, richer metadata, and gallery support.

</domain>

<decisions>
## Implementation Decisions

### Content unification
- Projects, articles, and recommendations all live in the **same Notion database** as blog posts
- A new **Category** select property in Notion with values: `Project`, `Article`, `Recommendation`
- No separate `/projects` route — remove from nav, no redirect needed
- Nav link renamed from "Blog" to **"Journal"** — more personal/maker feel, fits the journal de bord vision

### Category filtering on listing page
- **Horizontal pill row** at the top of `/blog` — reuse the pattern from Tips `CategoryFilter` component
- "All" selected by default, showing every content type
- Pills: All | Projects | Articles | Recommendations
- Filter via URL search params (same pattern as `/tips?category=...`)
- Client-side filtering — the listing page already fetches all posts at build time

### Listing card differentiation
- **Projects get bigger cover images** — wider/taller image treatment to emphasize the visual nature of projects
- Articles and recommendations keep the current compact single-column layout (date, title, excerpt)
- Category badge visible on each card to indicate content type

### Project detail page enhancements
- **Status badge** visible on project detail pages — values: `In Progress`, `Complete`, `Archived`
- Status managed via a **Status** select property in the Notion database
- Status badge only renders for items in the `Project` category (articles/recommendations don't show status)
- **Photo gallery** section on project detail pages — dedicated visual showcase separate from inline body images
- Gallery images sourced from a **dedicated "Gallery" Files & media property** in Notion (not inline body images)
- Gallery placement: between the header/metadata section and the body content

### Claude's Discretion
- Gallery UX implementation — grid with lightbox, inline grid, or carousel (pick what fits the kraft identity best)
- Gallery thumbnail sizing and responsive behavior
- Status badge visual design (color coding, pill shape, positioning)
- How the Category pill filter handles URL state and transitions
- Whether recommendations need a visually distinct card style (shorter content, potentially)
- CategoryFilter component reuse strategy — adapt Tips version or create shared component

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements — Phase 3
- `.planning/REQUIREMENTS.md` §Projets — PROJ-01 through PROJ-05 (reinterpreted through unified blog approach)
- `.planning/ROADMAP.md` §Phase 3 — Success Criteria (4 criteria, adapted to unified model)

### Prior phase context
- `.planning/phases/02-notion-foundation-blog/02-CONTEXT.md` — Blog data layer decisions, Notion property mapping, blog list layout
- `.planning/phases/01-design-system/01-CONTEXT.md` — Kraft visual identity, semantic tokens, page header pattern

### Existing codebase to extend
- `src/lib/blog.ts` — Current DAL (`getAllPosts`, `getPostBySlug`) — extend with category/status/gallery property mapping
- `src/lib/blog-types.ts` — Current `BlogPost` type — extend with `category`, `status`, `gallery` fields
- `src/app/blog/page.tsx` — Blog listing page — add category filter and differentiated card layouts
- `src/app/blog/[slug]/page.tsx` — Article detail page — add status badge and gallery section for projects
- `src/components/tips/CategoryFilter.tsx` — Existing filter component pattern to reuse/adapt

### Notion database schema changes
- Add `Category` select property: `Project` | `Article` | `Recommendation`
- Add `Status` select property: `In Progress` | `Complete` | `Archived`
- Add `Gallery` files & media property for project photos

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/blog.ts`: Full Notion DAL with pagination, image download, property mapping — extend `mapNotionPageToBlogPost` with new properties
- `src/lib/blog-types.ts`: `BlogPost` interface and `BlogBlock` union type — add `category`, `status`, `gallery` fields
- `src/lib/notion.ts`: Shared Notion client — already configured
- `src/scripts/download-notion-images.ts`: Image download utility — reuse for gallery images
- `src/components/tips/CategoryFilter.tsx`: Client component with pill-style category filtering — adapt for blog categories
- `src/app/blog/page.tsx`: Blog listing with kraft page header, single-column layout — add filter bar and card differentiation
- `src/app/blog/[slug]/page.tsx`: Article detail with `generateStaticParams`, `generateMetadata`, Schema.org — add gallery + status

### Established Patterns
- Notion property mapping: `props['PropertyName']?.type === 'select'` pattern in `blog.ts`
- Image download at build time via `downloadNotionImage(url, id)` — handles Notion URL expiry
- `output: 'export'` static build — all data fetching at build time, no server-side
- Semantic tokens: `bg-surface`, `text-text-primary`, `accent`, `border` — all new components must use these
- Page header: `bg-surface-raised border-b border-border -mt-14` with rust radial vignette
- Client/server split: filter is `'use client'`, page and data fetching are server components

### Integration Points
- `src/app/blog/page.tsx` is the single entry point for the listing — add filter UI here
- `src/lib/blog.ts` `mapNotionPageToBlogPost` — add category, status, gallery property extraction
- Nav header (`src/components/layout/Header.tsx`) — rename "Blog" to "Journal", remove "Projects" link
- Notion database — schema changes needed (Category, Status, Gallery properties)

</code_context>

<specifics>
## Specific Ideas

- "The project page and the blog page are basically the same thing" — user wants one unified content hub, not two separate sections
- Nav says "Journal" — personal/maker journal feel, all content types under one roof
- Projects are more visual — bigger cover images on the listing to differentiate from articles
- Gallery is separate from body content — dedicated Notion property, displayed between header and body
- Status badges only for projects — articles and recommendations don't need a progress indicator
- Pill filter should feel like the Tips page — familiar pattern, already proven in the codebase

</specifics>

<deferred>
## Deferred Ideas

- **Tips migration to Notion** — v2 (TIPS-V2-01). Tips stay TypeScript-static for now. When migrated, Tips could become a fourth category in the unified database.
- **Cross-linking projects ↔ articles** — v2 (PROJ-V2-01). Not in scope for Phase 3.
- **RSS feed** — v2 (PROJ-V2-02). Not in scope.
- **Process documentation sections** (Ce qui a foiré / Ce que j'ai appris) — v2 (PROC-01). Projects in Phase 3 use free-form Notion body content.

</deferred>

---

*Phase: 03-projects-section*
*Context gathered: 2026-03-16*
