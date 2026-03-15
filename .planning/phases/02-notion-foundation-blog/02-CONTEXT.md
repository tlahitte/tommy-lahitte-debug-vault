# Phase 2: Notion Foundation + Blog - Context

**Gathered:** 2026-03-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the static TypeScript blog data layer with Notion API calls at build time. Migrate all existing blog posts to a Notion database. Wire the rebuild trigger (Notion webhook or GitHub Actions cron). Blog routes stay identical (`/blog`, `/blog/[slug]`). The `/tips` section is untouched — it stays TypeScript-static until v2. Visual improvements to the blog list page and article detail page are in scope since we're touching the blog anyway.

</domain>

<decisions>
## Implementation Decisions

### Blog + Tips separation

- `/tips` stays as its own static TypeScript section — untouched in Phase 2
- Phase 2 only wires Notion for `/blog`
- Tips migration is deferred to v2 (TIPS-V2-01)
- No cross-linking or merging of content types in Phase 2

### Blog list page layout

- Switch from the current 2-column card grid to a **single-column reading list**
- One article per row, editorial feel — like a maker's journal
- Cover image visible but not dominant — title and excerpt lead
- Keeps the kraft/industrial identity established in Phase 1

### Blog article detail page

- **Reading progress indicator**: thin bar at the top of the page that tracks scroll position through the article
- **Improved article header**: bigger title treatment, cleaner metadata (date, reading time estimate), better cover image display if present
- Block types expanded beyond the current 3 (paragraph, heading, list) to the full NOTI-02 set: heading h1-h3, code, callout, bulleted_list, numbered_list, image, toggle, divider
- Unsupported blocks render silently (no build error, invisible fallback — NOTI-03)

### Claude's Discretion

- Notion database structure: property names, database ID sourcing (env vars), slug property type (Text vs. Title)
- Rebuild trigger: check Notion plan tier — if Plus or above, use Notion webhook to Netlify Build Hook; if free plan, implement GitHub Actions cron as fallback (no architectural difference, different trigger only)
- Image handling: build-time download strategy, destination folder (`/public/notion-images/` or similar), URL mapping in data layer
- TypeScript types for Notion blocks (NOTI-04): structure and mapping from Notion API response
- Reading time calculation algorithm (words per minute)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements — Phase 2
- `.planning/REQUIREMENTS.md` §Notion CMS — Fondation — NOTI-01 through NOTI-05 with acceptance criteria
- `.planning/REQUIREMENTS.md` §Blog — BLOG-01, BLOG-02 with acceptance criteria
- `.planning/ROADMAP.md` §Phase 2 — Success Criteria (5 criteria, including image URL expiry + block rendering + webhook trigger)

### Existing codebase to preserve/replace
- `src/lib/blog.ts` — Current thin DAL (getAllPosts / getPostBySlug) — to be replaced with Notion-backed implementation keeping the same function signatures
- `src/lib/blog-types.ts` — Current BlogPost type — to be extended with richer Notion block types
- `src/content/blog/index.ts` — Current static content index — to be removed once Notion migration is complete
- `src/app/blog/page.tsx` — Blog list page — to be refreshed to single-column layout
- `src/app/blog/[slug]/page.tsx` — Article detail page — to be enhanced (progress bar + header)

### SEO constraints (BLOG-02)
- Existing slugs that MUST be preserved exactly:
  - `elevenapps-immersive-show-swift`
  - `technical-director-people-person-show`
- `generateStaticParams` must continue to return all published Notion posts
- `generateMetadata` must continue to produce canonical URLs, OG tags, Schema.org

### Out-of-scope (REQUIREMENTS.md)
- ISR / on-demand revalidation — explicitly Out of Scope (incompatible with `output: 'export'` on Netlify)
- Full rebuild is the only content update mechanism

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/blog.ts`: Thin DAL with `getAllPosts()` / `getPostBySlug(slug)` — keep these function signatures, swap the implementation to hit Notion API
- `src/app/blog/page.tsx`: BlogPage component with kraft page header pattern — reuse the `bg-surface-raised border-b border-border -mt-14` page header, replace the grid with a list
- `src/app/blog/[slug]/page.tsx`: Full article page with `generateStaticParams`, `generateMetadata`, Schema.org — the scaffolding stays, only the renderBlock function and header section change
- `src/components/blog/BlogCard.tsx`: Existing card component — will likely be replaced or repurposed for the new list layout

### Established Patterns
- `output: 'export'` in Next.js config — static export, no server-side features. All Notion API calls happen at build time only.
- SSG via `generateStaticParams` — must remain for all blog routes
- Semantic tokens: `bg-surface`, `text-text-primary`, `text-text-muted`, `accent`, `border` — all new components must use these, never raw hex or zinc/violet classes
- Page header pattern: `bg-surface-raised border-b border-border -mt-14` with rust radial vignette — apply to blog pages
- Framer Motion `AnimatePresence` for page transitions — already wired in template.tsx

### Integration Points
- `src/lib/blog.ts` is the single entry point for all blog data — replacing its implementation is enough to switch the data source
- `src/app/blog/` routes import from `@/lib/blog` — no changes needed to route files beyond render improvements
- Notion API key + database ID must be in `.env.local` / Netlify env vars
- Image downloads at build time land in `/public/` and are served as static assets

</code_context>

<specifics>
## Specific Ideas

- Blog list: single-column editorial list, feels like a maker's journal — not a news feed, not a magazine grid
- Article header: reading time estimate shown near the date, larger H1 title, cover image with better proportions if present
- Reading progress: thin bar (1-2px) at the very top of the viewport, accent color (`#C85A3A`), appears as soon as the user starts scrolling
- The existing article page already has `space-y-4` between blocks — the new block renderer should maintain this rhythm

</specifics>

<deferred>
## Deferred Ideas

- **Tips migration to Notion** — v2 (TIPS-V2-01). Tips section stays TypeScript-static for now.
- **Blog tags / category filtering** — v2 (BLOG-V2-02). Phase 2 has no filter UI.
- **RSS feed** — v2 (PROJ-V2-02). Not in scope for Phase 2.

</deferred>

---

*Phase: 02-notion-foundation-blog*
*Context gathered: 2026-03-15*
