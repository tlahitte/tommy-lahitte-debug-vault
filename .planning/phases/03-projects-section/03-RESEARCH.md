# Phase 3: Projects Section - Research

**Researched:** 2026-03-16
**Domain:** Notion CMS extension, content unification, client-side filtering, photo gallery UI
**Confidence:** HIGH — based entirely on existing codebase inspection and proven Phase 2 patterns

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- Projects, articles, and recommendations all live in the **same Notion database** as blog posts
- A new **Category** select property in Notion with values: `Project`, `Article`, `Recommendation`
- No separate `/projects` route — remove from nav, no redirect needed
- Nav link renamed from "Blog" to **"Journal"**
- **Horizontal pill row** at the top of `/blog` — reuse the pattern from Tips `CategoryFilter` component
- "All" selected by default, showing every content type
- Pills: All | Projects | Articles | Recommendations
- Filter via URL search params (same pattern as `/tips?category=...`)
- Client-side filtering — the listing page already fetches all posts at build time
- **Projects get bigger cover images** — wider/taller image treatment
- Articles and recommendations keep the current compact single-column layout
- Category badge visible on each card
- **Status badge** visible on project detail pages — values: `In Progress`, `Complete`, `Archived`
- Status managed via a **Status** select property in the Notion database
- Status badge only renders for items in the `Project` category
- **Photo gallery** section on project detail pages — dedicated visual showcase separate from inline body images
- Gallery images sourced from a **dedicated "Gallery" Files & media property** in Notion
- Gallery placement: between the header/metadata section and the body content

### Claude's Discretion

- Gallery UX implementation — grid with lightbox, inline grid, or carousel (pick what fits the kraft identity best)
- Gallery thumbnail sizing and responsive behavior
- Status badge visual design (color coding, pill shape, positioning)
- How the Category pill filter handles URL state and transitions
- Whether recommendations need a visually distinct card style
- CategoryFilter component reuse strategy — adapt Tips version or create shared component

### Deferred Ideas (OUT OF SCOPE)

- **Tips migration to Notion** — v2 (TIPS-V2-01)
- **Cross-linking projects ↔ articles** — v2 (PROJ-V2-01)
- **RSS feed** — v2 (PROJ-V2-02)
- **Process documentation sections** (Ce qui a foiré / Ce que j'ai appris) — v2 (PROC-01)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PROJ-01 | Une page liste `/projects` affiche tous les projets publiés depuis Notion | Reinterpreted: `/blog` with Category filter shows all content including projects. Listing page already exists — add filter bar and differentiated card layouts. |
| PROJ-02 | Chaque projet a une page détail avec titre, description, corps de contenu riche depuis Notion | Already fully implemented by blog detail page. Only additions needed: status badge rendering (conditional on category), category metadata in BlogPost type. |
| PROJ-03 | Les pages projets affichent une galerie d'images (photos process + résultat final) | New Gallery property in Notion (files & media), mapped at build time via existing `downloadNotionImage`, rendered as inline grid between header and body. |
| PROJ-04 | Chaque projet a un statut visible (En cours / Terminé / Archivé) géré depuis Notion | New Status select property in Notion, mapped in `mapNotionPageToBlogPost`, rendered as pill badge only when `category === 'Project'`. |
| PROJ-05 | Les projets sont taggués par catégorie (hardware, software, art, mixte) filtrables sur la page liste | Reinterpreted: Category select in Notion (`Project`/`Article`/`Recommendation`), filtered via URL search param on `/blog`. Sub-category tagging (hardware/software/art/mixte) is absorbed into the Project category for v1. |
</phase_requirements>

---

## Summary

Phase 3 is entirely an extension of existing infrastructure — no new routes, no new data sources, no new architectural patterns. The blog DAL (`src/lib/blog.ts`), the blog listing page (`src/app/blog/page.tsx`), and the article detail page (`src/app/blog/[slug]/page.tsx`) are all extended with three new Notion properties: `Category` (select), `Status` (select), and `Gallery` (files & media).

The category filter reuses the exact pill-row pattern already proven on the Tips page (`src/components/tips/CategoryFilter.tsx`). It reads a `?category=` URL search param, client-side filters the pre-fetched post list, and updates the URL without a page reload. The listing page keeps its server component structure — the filter UI is an isolated `'use client'` leaf component exactly like `CategoryFilter` and `ReadingProgressBar`.

The photo gallery is the only genuinely new UI concern. The Notion `Gallery` property holds multiple file references. Each is downloaded at build time using the existing `downloadNotionImage` utility. The rendered gallery sits between the post header and the body content. A CSS grid (2-3 columns, responsive) with no JavaScript lightbox dependency fits the static-export constraint and the kraft identity — simple, direct, no animation library needed.

**Primary recommendation:** Extend `BlogPost` type and `mapNotionPageToBlogPost` first (Wave 0), then add category filter + differentiated listing cards (Wave 1), then add gallery and status badge on detail page (Wave 2). Rename nav "Journal" and remove `/projects` link in the same wave as listing changes.

---

## Standard Stack

### Core (unchanged from Phase 2)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@notionhq/client` | ^2.3.0 | Notion API queries | Pinned in Phase 2, v5 broke databases.query |
| Next.js | ^15.5.12 | App Router, static export | Project foundation |
| TypeScript | ^5 | Type safety | Established codebase convention |
| Tailwind CSS | ^3.4.17 | Utility styling | All tokens already defined |
| `motion/react` | ^12.36.0 | Micro-animations on cards | Already installed, used in BlogCard |
| Vitest | ^4.1.0 | Unit tests | Chosen in Phase 2 |

### No New Dependencies Required

This phase adds no new packages. The gallery uses CSS grid (Tailwind). No lightbox library is needed — a simple responsive grid satisfies the requirement and keeps the static export clean.

**Installation:**
```bash
# No new packages needed
```

---

## Architecture Patterns

### Recommended Project Structure (additions only)

```
src/
├── lib/
│   ├── blog-types.ts        # ADD: category, status, gallery fields to BlogPost
│   └── blog.ts              # EXTEND: mapNotionPageToBlogPost, getAllPosts filter support
├── components/
│   ├── blog/
│   │   ├── BlogCategoryFilter.tsx   # NEW: adapted from tips/CategoryFilter.tsx
│   │   ├── ProjectGallery.tsx       # NEW: gallery grid component
│   │   └── StatusBadge.tsx          # NEW: status pill for project detail pages
│   └── tips/
│       └── CategoryFilter.tsx       # UNCHANGED (tips-specific version stays)
└── app/
    └── blog/
        ├── page.tsx          # EXTEND: add BlogCategoryFilter + card differentiation
        └── [slug]/page.tsx   # EXTEND: add StatusBadge + ProjectGallery
```

### Pattern 1: Extending BlogPost Type

**What:** Add three optional fields to the existing `BlogPost` interface and map them from Notion properties in `mapNotionPageToBlogPost`.

**When to use:** All new Notion properties follow this same pattern.

**Example:**
```typescript
// src/lib/blog-types.ts — extend existing interface
export type PostCategory = 'Project' | 'Article' | 'Recommendation'
export type ProjectStatus = 'In Progress' | 'Complete' | 'Archived'

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  image?: string
  imageAlt?: string
  content: BlogBlock[]
  link?: { label: string; url: string }
  // Phase 3 additions
  category?: PostCategory
  status?: ProjectStatus
  gallery?: string[]   // array of local /notion-images/ paths
}
```

### Pattern 2: Mapping New Notion Properties

**What:** Extend `mapNotionPageToBlogPost` in `src/lib/blog.ts` with select and files property extraction.

**When to use:** Same pattern already used for `Cover` (files) and `ExternalLink` (url).

**Example:**
```typescript
// In mapNotionPageToBlogPost — add after existing property mappings

// Category select
const category =
  props['Category']?.type === 'select'
    ? (props['Category'].select?.name as PostCategory | undefined)
    : undefined

// Status select (only meaningful for Project category)
const status =
  props['Status']?.type === 'select' && props['Status'].select?.name !== 'Published'
    ? (props['Status'].select.name as ProjectStatus | undefined)
    : undefined
// Note: existing 'Status' property currently holds 'Published' for visibility filtering.
// The new project Status (In Progress / Complete / Archived) needs a different property name
// to avoid collision — recommend naming it 'ProjectStatus' in Notion.

// Gallery files — download each at build time
const gallery: string[] = []
if (props['Gallery']?.type === 'files') {
  for (const file of props['Gallery'].files) {
    if (file.type === 'external') {
      gallery.push(file.external.url)
    } else if (file.type === 'file') {
      const localPath = await downloadNotionImage(file.file.url, `${page.id}-gallery-${gallery.length}`)
      gallery.push(localPath)
    }
  }
}

return { slug, title, date, excerpt, image, link, category, status, gallery }
```

### Pattern 3: Client-Side Category Filter (URL search params)

**What:** Isolated `'use client'` leaf component that reads/writes `?category=` URL param. Parent listing page remains a server component.

**When to use:** Same split used for `ReadingProgressBar` and existing `CategoryFilter`.

**Example (adapted from `src/components/tips/CategoryFilter.tsx`):**
```typescript
// src/components/blog/BlogCategoryFilter.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const BLOG_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'Project', label: 'Projects' },
  { value: 'Article', label: 'Articles' },
  { value: 'Recommendation', label: 'Recommendations' },
]

export default function BlogCategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get('category') ?? 'all'

  function handleSelect(value: string) {
    const params = new URLSearchParams()
    if (value !== 'all') params.set('category', value)
    const query = params.toString()
    router.push(`/blog${query ? `?${query}` : ''}`, { scroll: false })
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter journal by category">
      {BLOG_CATEGORIES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleSelect(value)}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold border transition-colors ${
            current === value
              ? 'bg-accent/10 border-accent/30 text-accent'
              : 'bg-transparent border-border text-text-muted hover:bg-accent/10 hover:border-accent/30 hover:text-accent'
          }`}
          aria-pressed={current === value}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
```

### Pattern 4: Listing Page with Client Filter + Server Data

**What:** The listing page is a server component that fetches all posts. It passes posts as props to a client wrapper that handles filtering. The filter component reads search params — in App Router, this requires `Suspense` boundary.

**Critical detail:** `useSearchParams()` in a client component requires the page to wrap it in `<Suspense>`. Next.js 15 enforces this — missing Suspense causes a build warning/error.

**Example:**
```typescript
// src/app/blog/page.tsx — server component
import { Suspense } from 'react'
import { getAllPosts } from '@/lib/blog'
import BlogList from '@/components/blog/BlogList'  // 'use client' wrapper

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <>
      {/* page header — unchanged */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-32 pt-8">
        <Suspense fallback={null}>
          <BlogList posts={posts} />
        </Suspense>
      </div>
    </>
  )
}
```

```typescript
// src/components/blog/BlogList.tsx — 'use client'
// Receives all posts, handles filter UI + filtered rendering
```

### Pattern 5: Photo Gallery Component

**What:** A CSS grid of downloaded images, rendered server-side (no JS required). Placed between the article header and body content when `post.gallery` is non-empty and `post.category === 'Project'`.

**Example:**
```typescript
// src/components/blog/ProjectGallery.tsx — server component (no 'use client')
interface ProjectGalleryProps {
  images: string[]
}

export default function ProjectGallery({ images }: ProjectGalleryProps) {
  if (images.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-8">
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={src}
          alt={`Gallery image ${i + 1}`}
          className="w-full rounded-lg aspect-square object-cover"
        />
      ))}
    </div>
  )
}
```

Note: Plain `<img>` (not `next/image`) for consistency with Phase 2 decision — static export with unknown image dimensions.

### Anti-Patterns to Avoid

- **Filtering on the server / re-querying Notion per category:** The static export model means all data is fetched at build time. Filter client-side from the already-fetched list.
- **Separate `/projects` route:** Decision locked — do not create `src/app/projects/`. Everything extends `/blog`.
- **Using `next/image` for Notion-downloaded images:** Phase 2 decision — plain `<img>` for static export compatibility.
- **Naming the project status property "Status" in Notion:** Collision with existing "Status" publish gate. Use "ProjectStatus" or similar.
- **Fetching gallery images at render time:** Notion file URLs expire in 1 hour. All gallery images MUST be downloaded at build time via `downloadNotionImage`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Notion image URL expiry | Custom caching layer | Existing `downloadNotionImage` utility | Already handles all edge cases, tested |
| Filter URL state | Custom history/state management | `useRouter` + `useSearchParams` from Next.js | Proven in Tips page, zero extra deps |
| Responsive image grid | Custom CSS or JS layout | Tailwind `grid grid-cols-2 sm:grid-cols-3 gap-3` | Static, no JS, matches design system |
| Type narrowing for Notion properties | Custom type guards | `props['X']?.type === 'select'` pattern | Already established in `blog.ts` |
| Notion pagination | Custom cursor loop | Existing `getAllPosts` with `has_more`/`next_cursor` | Phase 2 handles this completely |

**Key insight:** Phase 3 is nearly pure composition. Every pattern needed already exists. The main risk is property name collision between the existing publish-gate `Status` property and the new project `ProjectStatus` property.

---

## Common Pitfalls

### Pitfall 1: Notion Property Name Collision — "Status"

**What goes wrong:** The existing `getAllPosts` filters on `Status === 'Published'` as the publish gate. If the new project status property is also named "Status" in Notion, queries will conflict and unpublished items may appear.

**Why it happens:** Natural tendency to name the project status field "Status."

**How to avoid:** Name the Notion property `ProjectStatus` (or `Project Status`). Update `mapNotionPageToBlogPost` to read from `props['ProjectStatus']`. Document this in Notion database schema.

**Warning signs:** Posts appearing in listing that should be filtered out; filtering by `'In Progress'` returning all posts.

### Pitfall 2: Missing Suspense Boundary for useSearchParams

**What goes wrong:** Next.js 15 App Router requires any component calling `useSearchParams()` to be wrapped in `<Suspense>`. Without it, the build emits a warning and the page may not render the filter on initial load.

**Why it happens:** The pattern is new in App Router — easy to forget.

**How to avoid:** Always wrap the client filter component in `<Suspense fallback={null}>` in the server page component.

**Warning signs:** `Warning: A component suspended while responding to synchronous input` in build output.

### Pitfall 3: Gallery Images Not Downloaded at Build Time

**What goes wrong:** Gallery image URLs from Notion files expire after ~1 hour. If gallery is rendered with raw Notion URLs (not downloaded), images will break within an hour of deploy.

**Why it happens:** Cover image download is already handled, but gallery files require iterating over an array property.

**How to avoid:** In `mapNotionPageToBlogPost`, iterate over all `Gallery.files` and call `downloadNotionImage` for each. Return the resulting `/notion-images/` local paths.

**Warning signs:** Gallery images work immediately after deploy but break the next time you visit.

### Pitfall 4: BlogList Client Component Receives Non-Serializable Props

**What goes wrong:** If `BlogPost` ever contains non-serializable values (functions, class instances), passing the array from server to client component will throw a serialization error.

**Why it happens:** Next.js server-to-client prop serialization requires plain JSON objects.

**How to avoid:** Keep `BlogPost` as a plain interface with primitive fields and plain arrays. The current type is already clean — maintain this discipline.

### Pitfall 5: Category Filter Resets Page Scroll

**What goes wrong:** `router.push()` by default scrolls to the top of the page, creating a jarring UX on filter tab clicks.

**Why it happens:** Default router.push behavior.

**How to avoid:** Always use `router.push(url, { scroll: false })` for filter navigation. Already used in existing `CategoryFilter.tsx`.

---

## Code Examples

### Existing Cover Image Download Pattern (verified from src/lib/blog.ts)

```typescript
// Source: src/lib/blog.ts — mapNotionPageToBlogPost
if (props['Cover']?.type === 'files' && props['Cover'].files.length > 0) {
  const file = props['Cover'].files[0]
  if (file.type === 'external') {
    image = file.external.url
  } else if (file.type === 'file') {
    image = await downloadNotionImage(file.file.url, `${page.id}-cover`)
  }
}
```

The gallery pattern is the same loop applied to all files in the array:

```typescript
// Gallery — all files downloaded at build time
const gallery: string[] = []
if (props['Gallery']?.type === 'files') {
  for (let i = 0; i < props['Gallery'].files.length; i++) {
    const file = props['Gallery'].files[i]
    if (file.type === 'external') {
      gallery.push(file.external.url)
    } else if (file.type === 'file') {
      const local = await downloadNotionImage(file.file.url, `${page.id}-gallery-${i}`)
      gallery.push(local)
    }
  }
}
```

### Existing CategoryFilter Pattern (verified from src/components/tips/CategoryFilter.tsx)

Key elements to preserve in `BlogCategoryFilter`:
- `useRouter` + `useSearchParams` from `next/navigation`
- `router.push(url, { scroll: false })` to prevent scroll jump
- `aria-pressed` on each button for accessibility
- `role="group"` with `aria-label` on the container

### Existing Select Property Mapping (verified from src/lib/blog.ts)

```typescript
// Pattern already in codebase for select props
const category =
  props['Category']?.type === 'select'
    ? (props['Category'].select?.name as PostCategory | undefined)
    : undefined
```

### Conditional Rendering on Detail Page

```typescript
// src/app/blog/[slug]/page.tsx — after header, before body content
{post.category === 'Project' && post.status && (
  <StatusBadge status={post.status} />
)}

{post.category === 'Project' && post.gallery && post.gallery.length > 0 && (
  <ProjectGallery images={post.gallery} />
)}
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Separate `/projects` route with its own Notion DB | Unified `/blog` with `Category` select filter | One DAL, one listing page, shared infrastructure |
| Status as Notion page property separate from blog | Status as select on same blog database entry | No join needed, simpler mapping |
| Gallery from inline Notion image blocks | Gallery from dedicated `Gallery` files property | Clean separation between editorial body and visual showcase |

---

## Open Questions

1. **Notion property name for project status**
   - What we know: The existing `Status` property is used as the publish gate (`Status === 'Published'`). A new status tracking `In Progress / Complete / Archived` cannot reuse the same property.
   - What's unclear: Whether the user prefers to rename the existing `Status` publish gate or add a new distinctly-named property.
   - Recommendation: Plan for a new property named `ProjectStatus` in Notion. The implementer must add this to the actual Notion database before the build will pick it up.

2. **Gallery property name in Notion**
   - What we know: Notion files & media properties can hold multiple files.
   - What's unclear: Exact property name the user will create in Notion.
   - Recommendation: Plan uses `Gallery` as the canonical name. Document this in plan task so the user adds `Gallery` (not "Photos", "Images", etc.) to Notion.

3. **BlogList client component granularity**
   - What we know: The filter needs `useSearchParams()` which requires a client boundary. The page currently renders cards inline.
   - What's unclear: Whether to convert the whole listing area to a single client component or split into a thin client filter shell with the card list as a separate component.
   - Recommendation: Single `BlogList` client component receiving `posts` as prop. Simpler than a multi-layer split. The posts array is plain JSON — serialization is safe.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | `vitest.config.ts` (root) |
| Quick run command | `pnpm vitest run src/lib/blog.test.ts` |
| Full suite command | `pnpm vitest run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PROJ-01 | `getAllPosts` returns `category` field from Notion | unit | `pnpm vitest run src/lib/blog.test.ts` | ❌ Wave 0 |
| PROJ-02 | `getPostBySlug` returns full post with `category` and `status` | unit | `pnpm vitest run src/lib/blog.test.ts` | ❌ Wave 0 |
| PROJ-03 | `mapNotionPageToBlogPost` downloads gallery files and returns local paths | unit | `pnpm vitest run src/lib/blog.test.ts` | ❌ Wave 0 |
| PROJ-04 | `mapNotionPageToBlogPost` extracts `ProjectStatus` select value | unit | `pnpm vitest run src/lib/blog.test.ts` | ❌ Wave 0 |
| PROJ-05 | Category filter URL param correctly filters post list | unit | `pnpm vitest run src/components/blog/BlogCategoryFilter.test.tsx` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `pnpm vitest run src/lib/blog.test.ts`
- **Per wave merge:** `pnpm vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `src/lib/blog.test.ts` — extend existing file: add describe blocks for PROJ-01 (category field), PROJ-03 (gallery download), PROJ-04 (ProjectStatus field)
- [ ] `src/components/blog/BlogCategoryFilter.test.tsx` — new file covering PROJ-05 filter behavior

*(No new framework install needed — vitest already configured and running)*

---

## Sources

### Primary (HIGH confidence)

- Direct codebase inspection — `src/lib/blog.ts`, `src/lib/blog-types.ts`, `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/components/tips/CategoryFilter.tsx`, `src/components/blog/BlogCard.tsx`
- `vitest.config.ts` — test infrastructure confirmed
- `package.json` — dependency versions confirmed
- `.planning/phases/03-projects-section/03-CONTEXT.md` — locked decisions
- `.planning/REQUIREMENTS.md` — PROJ-01 through PROJ-05

### Secondary (MEDIUM confidence)

- Next.js 15 App Router `useSearchParams` Suspense requirement — documented behavior, consistent with observed patterns in existing code

### Tertiary (LOW confidence)

- None — all claims are grounded in direct codebase inspection

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified from package.json and existing source files
- Architecture: HIGH — all patterns already proven in Phase 1 and Phase 2 code
- Pitfalls: HIGH — property name collision and Suspense requirement are concrete, code-grounded risks
- Gallery implementation: MEDIUM — no prior gallery code in project, but pattern is straightforward

**Research date:** 2026-03-16
**Valid until:** 2026-04-16 (stable stack, internal patterns)
