# Architecture Research

**Domain:** Notion-driven Next.js 15 portfolio (projects + blog)
**Researched:** 2026-03-15
**Confidence:** HIGH (core patterns verified via official docs and multiple community sources)

## Standard Architecture

### System Overview

```
┌───────────────────────────────────────────────────────────────┐
│                        NOTION WORKSPACE                        │
│  ┌──────────────────┐          ┌──────────────────┐            │
│  │  Projects DB     │          │  Blog Posts DB   │            │
│  │  (properties +   │          │  (properties +   │            │
│  │   page content)  │          │   page content)  │            │
│  └────────┬─────────┘          └────────┬─────────┘            │
└───────────┼────────────────────────────┼──────────────────────┘
            │  Notion Public API          │
            │  @notionhq/client           │
            ↓                             ↓
┌───────────────────────────────────────────────────────────────┐
│                     DATA ACCESS LAYER                          │
│  src/lib/                                                      │
│  ┌────────────────┐   ┌────────────────┐   ┌───────────────┐  │
│  │ notion.ts      │   │ projects.ts    │   │ blog.ts       │  │
│  │ (client init,  │   │ (getAllProjects │   │ (getAllPosts   │  │
│  │  image cache)  │   │  getBySlug)    │   │  getBySlug)   │  │
│  └───────┬────────┘   └───────┬────────┘   └───────┬───────┘  │
│          │                    │                     │          │
│          └────────────────────┴─────────────────────┘          │
│                               ↓                                │
│               Block Transformer (Notion → React)               │
│               notion-to-md or custom block renderer            │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ↓
┌───────────────────────────────────────────────────────────────┐
│                       PAGE LAYER (App Router)                  │
│  src/app/                                                      │
│  ┌───────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│  │ /             │  │ /projects/[slug] │  │ /blog/[slug]   │  │
│  │ (home)        │  │ generateStatic   │  │ generateStatic │  │
│  │               │  │ Params()         │  │ Params()       │  │
│  └───────┬───────┘  └────────┬─────────┘  └────────┬───────┘  │
└──────────┼──────────────────┼────────────────────┼────────────┘
           │                  │                    │
           ↓                  ↓                    ↓
┌───────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                          │
│  src/components/                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ ProjectCard │  │ ProjectDetail│  │ BlogCard / PostDetail│  │
│  │ ProjectGrid │  │ ImageGallery │  │ BlockRenderer        │  │
│  └─────────────┘  └──────────────┘  └──────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
           │
           ↓ Static HTML at build time
┌───────────────────────────────────────────────────────────────┐
│                        NETLIFY CDN                             │
│  Static files served from edge                                 │
│                                                                │
│  Rebuild trigger:                                              │
│  Notion Database Automation → POST → Netlify Build Hook URL   │
└───────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `src/lib/notion.ts` | Singleton Notion client, image download at build time | `@notionhq/client` with `React.cache()` wrapper |
| `src/lib/projects.ts` | Query Projects DB, map Notion properties to `Project` type | `notion.databases.query()` + property mappers |
| `src/lib/blog.ts` | Query Blog Posts DB, map Notion properties to `BlogPost` type | `notion.databases.query()` + property mappers |
| `src/lib/blocks.ts` | Transform Notion block objects to renderable React structures | Custom renderer or `notion-to-md` → `react-markdown` |
| `src/app/projects/[slug]/page.tsx` | Static route generation for all projects | `generateStaticParams()` + `generateMetadata()` |
| `src/app/blog/[slug]/page.tsx` | Static route generation for all posts | `generateStaticParams()` + `generateMetadata()` |
| `src/components/BlockRenderer` | Render Notion block types to React components | Switch on `block.type`, Tailwind styling |
| `src/components/ImageGallery` | Display project photo gallery | Local image paths from build-time download |

## Recommended Project Structure

```
src/
├── lib/
│   ├── notion.ts          # Notion client singleton, image caching helpers
│   ├── projects.ts        # getAllProjects(), getProjectBySlug()
│   ├── blog.ts            # getAllPosts(), getPostBySlug() — replaces static version
│   ├── blocks.ts          # Notion block → React structure transformer
│   ├── project-types.ts   # Project, ProjectImage TypeScript interfaces
│   └── blog-types.ts      # BlogPost TypeScript interfaces (extended from current)
├── content/
│   └── (deleted after migration — replaced by Notion)
├── app/
│   ├── projects/
│   │   ├── page.tsx       # /projects listing
│   │   └── [slug]/
│   │       └── page.tsx   # /projects/:slug detail
│   ├── blog/
│   │   ├── page.tsx       # /blog listing (already exists)
│   │   └── [slug]/
│   │       └── page.tsx   # /blog/:slug detail (already exists)
│   └── page.tsx           # Home — featured projects + latest posts
├── components/
│   ├── projects/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectGrid.tsx
│   │   └── ImageGallery.tsx
│   ├── blog/
│   │   ├── BlogCard.tsx    # already exists, update to new types
│   │   └── PostDetail.tsx
│   └── shared/
│       └── BlockRenderer.tsx  # shared block-to-React renderer
└── public/
    └── notion-images/         # images downloaded at build time from Notion S3 URLs
```

### Structure Rationale

- **`src/lib/notion.ts` as singleton:** The Notion client must be initialized once with the API key. Wrapping fetch calls with `React.cache()` prevents duplicate requests when the same data is needed by multiple Server Components in one render.
- **`src/lib/blocks.ts` as shared transformer:** Both projects and blog posts render Notion blocks. A single renderer prevents drift between the two content types.
- **`public/notion-images/`:** Notion returns S3-signed image URLs that expire after 1 hour. For a fully static site (SSG on Netlify), the only reliable approach is downloading images at build time and rewriting URLs to local paths. This eliminates post-deploy 404s on images.
- **Keeping `src/content/` during migration:** Keep existing TypeScript content files in place while the Notion layer is built and verified. Delete only when the Notion data layer is confirmed correct.

## Architectural Patterns

### Pattern 1: Build-Time Static Generation with Notion as Source

**What:** `generateStaticParams()` calls the Notion API at build time to get all published page slugs. Each slug becomes a static HTML file. No runtime API calls happen after the build.

**When to use:** This project's confirmed approach — SSG on Netlify, content changes trigger full rebuilds via webhook.

**Trade-offs:** Fast CDN serving, zero runtime costs, full SEO. Tradeoff is a full rebuild on each content change (acceptable for a personal portfolio where Tommy publishes deliberately, not continuously).

**Example:**
```typescript
// src/app/projects/[slug]/page.tsx
export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug)
  if (!project) notFound()
  return <ProjectDetail project={project} />
}
```

### Pattern 2: Notion Property Mapping to TypeScript Types

**What:** Notion database rows have a `properties` object with typed values (title, rich_text, select, multi_select, checkbox, date, files). A mapper function converts this raw shape to a typed TypeScript interface used throughout the app.

**When to use:** Every time data is fetched from Notion — never pass raw Notion API responses to components.

**Trade-offs:** Adds a mapping step but isolates all Notion-specific property access in one place. If Notion renames a property, only the mapper changes.

**Example:**
```typescript
// src/lib/projects.ts
function mapNotionPageToProject(page: PageObjectResponse): Project {
  const props = page.properties
  return {
    id: page.id,
    slug: getPlainText(props['Slug'] as RichTextPropertyItemObjectResponse),
    title: getPlainText(props['Name'] as TitlePropertyItemObjectResponse),
    category: (props['Category'] as SelectPropertyItemObjectResponse).select?.name ?? '',
    published: (props['Published'] as CheckboxPropertyItemObjectResponse).checkbox,
    date: (props['Date'] as DatePropertyItemObjectResponse).date?.start ?? '',
    excerpt: getPlainText(props['Excerpt'] as RichTextPropertyItemObjectResponse),
    // images handled separately via blocks fetch
  }
}
```

### Pattern 3: Build-Time Image Download

**What:** During the data fetch step, any Notion-hosted image URL (S3 signed URLs) is downloaded to `public/notion-images/{pageId}/{filename}` and the URL is rewritten to a local path before the component ever sees it.

**When to use:** All images coming from Notion — both cover images (database property) and inline images in page blocks.

**Trade-offs:** Increases build time proportionally to image count. For a personal portfolio with tens of images, this is negligible. Eliminates all post-deploy image 404s permanently.

**Example:**
```typescript
// src/lib/notion.ts
export async function downloadNotionImage(
  notionUrl: string,
  pageId: string
): Promise<string> {
  const filename = `${pageId}-${hash(notionUrl)}.jpg`
  const localPath = path.join(process.cwd(), 'public/notion-images', filename)
  if (!fs.existsSync(localPath)) {
    const response = await fetch(notionUrl)
    fs.writeFileSync(localPath, Buffer.from(await response.arrayBuffer()))
  }
  return `/notion-images/${filename}`
}
```

## Data Flow

### Build-Time Request Flow (Projects)

```
Netlify Build starts
    ↓
generateStaticParams() — src/app/projects/[slug]/page.tsx
    ↓
getAllProjects() — src/lib/projects.ts
    ↓
notion.databases.query({ database_id, filter: Published=true })
    ↓
Notion API returns page list with properties
    ↓
mapNotionPageToProject() for each page
    → Download cover images to public/notion-images/
    → Rewrite image URLs to local paths
    ↓
Return Project[] — slugs used for static route generation
    ↓
For each slug: getProjectBySlug(slug) called
    ↓
notion.blocks.children.list({ block_id: pageId })
    ↓
Notion API returns block tree
    ↓
downloadNotionImage() for each image block
    ↓
transformBlocks() — Notion blocks → typed block structure
    ↓
ProjectDetail component renders with local image paths
    ↓
Static HTML written to build output
    ↓
Netlify deploys static files to CDN
```

### Content Update Flow (Webhook-Triggered Rebuild)

```
Tommy marks page "Published" in Notion
    ↓
Notion Database Automation fires (property change trigger)
    ↓
Notion sends POST request to Netlify Build Hook URL
    ↓
Netlify queues a new build (if build in progress, replaces queue)
    ↓
Full static build runs (same flow as above)
    ↓
New deploy goes live — updated content served from CDN
```

### Notion Database Design

**Projects Database** — properties:

| Property | Notion Type | Purpose |
|----------|-------------|---------|
| Name | Title | Project title, used as H1 |
| Slug | Rich Text | URL-safe identifier for route |
| Published | Checkbox | Build filter — only Published=true fetched |
| Date | Date | Publication / completion date |
| Category | Select | Content grouping (e.g. hardware, software, art) |
| Excerpt | Rich Text | Summary for card and SEO description |
| Cover | Files & Media | Hero image (downloaded at build) |
| Tags | Multi-select | Optional additional filtering |

Page content: Rich text blocks, image blocks, callout blocks (process documentation)

**Blog Posts Database** — properties:

| Property | Notion Type | Purpose |
|----------|-------------|---------|
| Name | Title | Post title |
| Slug | Rich Text | URL-safe identifier for route |
| Published | Checkbox | Build filter |
| Date | Date | Publication date |
| Excerpt | Rich Text | Summary for card and SEO |
| Cover | Files & Media | Optional hero image |

Page content: Rich text blocks, headings, lists, callouts

**Key decision:** Two separate databases (not one unified "Content" database with a Type property). This keeps Notion views clean for Tommy and allows different property schemas per content type. Projects need a richer property set (category, cover, gallery concept) than blog posts.

### State Management

No change from current approach. All data is immutable after build. Category filtering on listing pages can remain URL-param-driven client-side filtering, same as current Tips page pattern.

## Migration Path from Static TypeScript to Notion

This is a parallel-build migration — the Notion layer is built alongside the existing TypeScript layer before any static content files are deleted.

**Phase 1 — Blog migration (lower risk):**
1. Create Notion Blog Posts database
2. Build `src/lib/notion.ts` (client + image helper)
3. Build new `src/lib/blog.ts` replacing static imports with Notion queries
4. Verify `getAllPosts()` and `getPostBySlug()` return same shape as current
5. Migrate existing blog post content from TypeScript files to Notion pages
6. Smoke test: build locally, confirm all blog routes render correctly
7. Delete `src/content/blog/` TypeScript files
8. Configure Netlify webhook automation in Notion

**Phase 2 — Projects as new content type:**
1. Create Notion Projects database
2. Build `src/lib/projects.ts`
3. Build `src/app/projects/` route group (new, no migration needed)
4. Build `ProjectCard`, `ProjectDetail`, `ImageGallery` components
5. Add projects section to home page
6. Populate Notion with initial project entries

**Phase 3 — Tips/decommission (optional):**
Tips are currently TypeScript-only. Decision point: migrate tips to Notion too (clean CMS parity) or leave them as TypeScript (lower priority, fewer tips than posts). This is out of scope for the initial milestone.

**Rollback safety:** The existing TypeScript content files are never touched until the Notion layer is verified working. Git history preserves all static content.

## Anti-Patterns

### Anti-Pattern 1: Fetching Notion API at Request Time (SSR)

**What people do:** Use `fetch()` in a React Server Component without `cache()`, causing Notion API calls on every page request.

**Why it's wrong:** Notion API latency is 300-800ms. SSR on Netlify functions would add this to every page load. Netlify free tier has function invocation limits. The project explicitly chose SSG for performance and cost reasons.

**Do this instead:** Fetch only at build time via `generateStaticParams()` and page-level async components. The Netlify webhook triggers a full rebuild when content changes — that's the update mechanism, not SSR.

### Anti-Pattern 2: Passing Raw Notion API Responses to Components

**What people do:** Pass `page.properties` or `block.results` directly as component props.

**Why it's wrong:** Components become coupled to Notion's property shape. Notion's API response types are complex unions. If Notion changes a property name, the breakage is scattered across all components.

**Do this instead:** Map all Notion API responses to typed application interfaces (`Project`, `BlogPost`, `ContentBlock`) in `src/lib/` before any component sees the data.

### Anti-Pattern 3: Using Notion-Hosted Image URLs Directly

**What people do:** Render `<Image src={page.properties.Cover.files[0].file.url} />` directly in components.

**Why it's wrong:** Notion S3 signed URLs expire after 1 hour. On a statically-deployed site, every image will return 403 Forbidden within an hour of build. Users see broken images.

**Do this instead:** Download all Notion-hosted images to `public/notion-images/` at build time and rewrite all image references to local paths before they reach components.

### Anti-Pattern 4: One Monolithic Notion Database for All Content

**What people do:** Create a single "Content" Notion database with a "Type" select property (blog/project/tip).

**Why it's wrong:** Projects and blog posts have fundamentally different property schemas. A single database forces compromise on both — projects need gallery images and category taxonomy, posts need simpler metadata. Notion views become cluttered. The TypeScript types diverge anyway.

**Do this instead:** Separate databases per content type. Two databases with clear ownership is simpler than one database with conditional properties.

### Anti-Pattern 5: Triggering Rebuilds on Every Notion Edit (Auto-Save Events)

**What people do:** Use a Notion automation that fires on "any page updated" event to trigger the Netlify build hook.

**Why it's wrong:** Notion auto-saves continuously while typing. This would trigger dozens of builds per writing session, consuming Netlify's free-tier build minutes (300/month) rapidly and causing perpetually-building deploys.

**Do this instead:** Use a "Published checkbox becomes true" automation trigger. Tommy explicitly marks content as ready to publish by checking the box — one intentional action, one build.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Notion API | `@notionhq/client` called at build time only | API key in env var, never exposed to client |
| Netlify Build Hooks | HTTP POST to `https://api.netlify.com/build_hooks/{id}` | Triggered from Notion database automation |
| Notion Database Automation | "Published = true" property change → POST to Netlify hook URL | Configured inside Notion, no middleware needed |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `src/lib/` to `src/app/` | Direct async function calls in Server Components | No client-side data fetching |
| `src/lib/notion.ts` to `src/lib/projects.ts` + `blog.ts` | Exported Notion client instance | Singleton pattern — one client, shared |
| Page components to UI components | TypeScript typed props (`Project`, `BlogPost`) | Notion API shape never crosses this boundary |
| Build-time image fetch to public/ | `fs.writeFileSync` during build | Images available as static assets post-build |

## Scaling Considerations

This is a personal portfolio — scale is not a concern. The architecture is intentionally simple.

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-100 items | Current SSG approach — no changes needed |
| 100-500 items | Build time increases linearly with image count; consider skipping re-download of already-cached images |
| 500+ items | Not applicable for a personal portfolio |

The only realistic bottleneck is Netlify free tier build minutes (300/month). Each build likely takes 2-4 minutes. At one publish per day, that's ~90-120 minutes/month — well within limits.

## Sources

- [Notion API — Official Docs](https://developers.notion.com/)
- [Notion API Upgrade Guide 2025-09-03](https://developers.notion.com/docs/upgrade-guide-2025-09-03) — new API version breaking changes
- [Notion Webhook Actions — Help Center](https://www.notion.com/help/webhook-actions) — database automation webhook triggers
- [Netlify Build Hooks — Official Docs](https://docs.netlify.com/build/configure-builds/build-hooks/) — POST-based rebuild triggers
- [Netlify Build Hooks Developer Guide](https://developers.netlify.com/guides/trigger-a-site-update-from-anything-that-speaks-http-with-build-hooks/)
- [Notion as Headless CMS for Next.js 15 — Medium (2025)](https://ppaanngggg.medium.com/notion-as-a-headless-cms-for-next-js-15-in-2025-f08207280e67)
- [Next.js + Notion Portfolio with ISR — Felipe Giraldo](https://felipego.com/blog/nextjs-notion-portfolio-isr)
- [Next.js Blog with Notion CMS — Bejamas](https://bejamas.com/hub/guides/how-to-create-next-js-blog-using-notion-as-a-cms)
- [Notion Image Expiration — Snugl.dev](https://snugl.dev/archive/fixing-notions-1-hour-expiring-image-problem)
- [Notion API with Next.js Server Components — LogRocket](https://blog.logrocket.com/using-notion-next-js-isr-sync-content/)

---

*Architecture research for: Notion-driven Next.js 15 portfolio*
*Researched: 2026-03-15*
