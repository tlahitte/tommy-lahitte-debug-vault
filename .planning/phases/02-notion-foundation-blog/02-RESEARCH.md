# Phase 2: Notion Foundation + Blog — Research

**Researched:** 2026-03-16
**Domain:** Notion API, Next.js static export (SSG), Netlify build hooks, reading progress UI
**Confidence:** HIGH (core stack), MEDIUM (webhook automation plan-tier dependency)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- `/tips` stays as its own static TypeScript section — untouched in Phase 2
- Phase 2 only wires Notion for `/blog`
- Tips migration is deferred to v2 (TIPS-V2-01)
- No cross-linking or merging of content types in Phase 2
- Switch from the current 2-column card grid to a **single-column reading list**
- One article per row, editorial feel — like a maker's journal
- Cover image visible but not dominant — title and excerpt lead
- Keeps the kraft/industrial identity established in Phase 1
- **Reading progress indicator**: thin bar at the top of the page that tracks scroll position through the article
- **Improved article header**: bigger title treatment, cleaner metadata (date, reading time estimate), better cover image display if present
- Block types expanded beyond the current 3 (paragraph, heading, list) to the full NOTI-02 set: heading h1-h3, code, callout, bulleted_list, numbered_list, image, toggle, divider
- Unsupported blocks render silently (no build error, invisible fallback — NOTI-03)
- Rebuild trigger: check Notion plan tier — if Plus or above, use Notion webhook to Netlify Build Hook; if free plan, implement GitHub Actions cron as fallback (no architectural difference, different trigger only)

### Claude's Discretion
- Notion database structure: property names, database ID sourcing (env vars), slug property type (Text vs. Title)
- Image handling: build-time download strategy, destination folder (`/public/notion-images/` or similar), URL mapping in data layer
- TypeScript types for Notion blocks (NOTI-04): structure and mapping from Notion API response
- Reading time calculation algorithm (words per minute)

### Deferred Ideas (OUT OF SCOPE)
- Tips migration to Notion — v2 (TIPS-V2-01). Tips section stays TypeScript-static for now.
- Blog tags / category filtering — v2 (BLOG-V2-02). Phase 2 has no filter UI.
- RSS feed — v2 (PROJ-V2-02). Not in scope for Phase 2.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| NOTI-01 | Notion data layer with throttle (3 req/s), full pagination, build-time image download (URLs expire 1h) | `@notionhq/client` rate-limit docs confirm 3 req/s; `collectPaginatedAPI` / cursor loop for pagination; confirmed build-time download to `/public/` is the correct mitigation for URL expiry |
| NOTI-02 | Block renderer for: paragraph, heading h1-h3, code, callout, bulleted_list, numbered_list, image, toggle, divider | All block types confirmed in Notion API docs; switch-case `renderBlock` pattern documented with exact API field names |
| NOTI-03 | Unsupported blocks render silently — no build error, invisible fallback | Default `null` / empty fragment in switch-case default branch; never throw |
| NOTI-04 | TypeScript types from Notion API response properties, strict mapping | `@notionhq/client` exports `BlockObjectResponse`, `PageObjectResponse`, `RichTextItemResponse` — use these; extend with local `BlogPost` mapped type |
| NOTI-05 | Notion webhook → Netlify Build Hook triggers automatic rebuild | Webhook actions require Notion paid plan; free-plan fallback = GitHub Actions cron YAML `curl -X POST` to Netlify build hook URL (stored as secret) |
| BLOG-01 | Migrate 2 existing articles to Notion database | 2 posts to recreate: `technical-director-people-person-show` and `elevenapps-immersive-show-swift` |
| BLOG-02 | Preserve existing URL slugs, no broken links, SEO intact | `generateStaticParams` + slug-as-Text-property in Notion DB; `generateMetadata` preserved; canonical URLs unchanged |
</phase_requirements>

---

## Summary

Phase 2 replaces the thin TypeScript static blog data layer with a Notion-backed implementation. All Notion API calls happen at Next.js build time (`output: 'export'` constraint — no server runtime). The two primary technical risks are (1) Notion-hosted image URLs that expire after one hour, solved by downloading images to `/public/notion-images/` at build time, and (2) SDK version selection given the breaking API change in `@notionhq/client` v5.x.

The `@notionhq/client` SDK had a major breaking version (v5.0.0) released in late 2025 that replaces `databases.query` with `dataSources.query` and changes the ID parameter from `database_id` to `data_source_id`. For a single-database blog, the v2.x API (`2022-06-28`) continues to work for single-source databases and is what most blog tutorials use. The recommendation is to pin `@notionhq/client@^2.2.3` to stay on the stable, well-documented v2.x API surface and avoid the migration complexity that adds no value for a single-table blog.

The rebuild pipeline has two implementation paths depending on Notion plan tier: paid plan (Plus/Business/Enterprise) can use Notion's built-in database automation with a webhook action firing on a status property change to "Published"; free plan requires a GitHub Actions scheduled cron that POSTs to the Netlify Build Hook URL. The architecture is identical — only the trigger source differs.

**Primary recommendation:** Pin `@notionhq/client@^2.2.3`, use `notion.databases.query` + `notion.blocks.children.list`, download Notion-hosted images to `/public/notion-images/` at build time, expose `NOTION_TOKEN` and `NOTION_DATABASE_ID` as environment variables.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@notionhq/client` | `^2.2.3` | Official Notion JS/TS SDK — database query, block fetch | Official SDK; v2.x `databases.query` is stable for single-source DBs; v5.x breaks API surface with no benefit for this use case |
| `node-fetch` / Node built-in `fetch` | Node 18+ built-in | Download images at build time from Notion URLs | No extra dep needed — Next.js 15 runs on Node 18+, `fetch` is global |
| `fs` (Node built-in) | — | Write downloaded images to `/public/notion-images/` | Standard Node I/O |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `highlight.js` | `^11.x` | Syntax highlighting for code blocks | If `code` block type needs language-aware highlighting beyond basic `<pre>` |
| `sharp` | (optional) | Resize/optimize downloaded images | Only if image file sizes are problematic at build time |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@notionhq/client@^2.2.3` | `@notionhq/client@^5.x` | v5 requires `dataSources.query` + `data_source_id` — unnecessary migration complexity for single-table blog; v2.x confirmed to continue working for single-source databases |
| Build-time image download | Cloudflare Workers + R2 | High operational complexity; not justified for a personal blog |
| Build-time image download | API route proxy | Incompatible with `output: 'export'` — no server runtime on Netlify static |
| GitHub Actions cron | Zapier/Make/n8n | External dependency cost; cron YAML in repo is simpler and free |

**Installation:**
```bash
npm install @notionhq/client
```

No additional runtime dependencies needed. All Node built-ins (`fs`, `path`, `fetch`) are available.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── lib/
│   ├── blog.ts              # DAL: getAllPosts() / getPostBySlug() — same signatures, Notion impl
│   ├── blog-types.ts        # BlogPost type extended with full block set + NotionBlock union
│   └── notion.ts            # Notion client singleton (process.env.NOTION_TOKEN)
├── scripts/
│   └── download-notion-images.ts  # Run at build time before `next build`
├── content/blog/            # REMOVE: index.ts + post files once migration complete
└── public/
    └── notion-images/       # Downloaded images land here (gitignored or committed)
.github/
└── workflows/
    └── scheduled-rebuild.yml  # Cron → Netlify Build Hook (free-plan fallback only)
```

### Pattern 1: Notion Client Singleton

**What:** Create a single `Client` instance and reuse it across all build-time data fetches.
**When to use:** All Notion API calls during `next build`.
**Example:**
```typescript
// src/lib/notion.ts
// Source: https://github.com/makenotion/notion-sdk-js
import { Client } from '@notionhq/client'

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})
```

### Pattern 2: Database Query with Published Filter + Pagination

**What:** Fetch all published blog posts from the Notion database, handling pagination.
**When to use:** `getAllPosts()` implementation in `src/lib/blog.ts`.
**Example:**
```typescript
// Source: https://developers.notion.com/docs/working-with-page-content
import { notion } from './notion'

export async function getAllPosts(): Promise<BlogPost[]> {
  const results = []
  let cursor: string | undefined = undefined

  do {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: 'Status',
        select: { equals: 'Published' },
      },
      sorts: [{ property: 'Date', direction: 'descending' }],
      start_cursor: cursor,
    })
    results.push(...response.results)
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  return results.map(mapNotionPageToBlogPost)
}
```

### Pattern 3: Block Children Fetch with Recursive Children

**What:** Fetch all blocks for an article page, recursing into nested blocks (toggle children, etc.).
**When to use:** `getPostBySlug()` body content fetch.
**Example:**
```typescript
// Source: https://developers.notion.com/reference/get-block-children
import { notion } from './notion'
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

export async function getBlocksWithChildren(blockId: string): Promise<BlockObjectResponse[]> {
  const allBlocks: BlockObjectResponse[] = []
  let cursor: string | undefined = undefined

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    })
    const blocks = response.results as BlockObjectResponse[]
    for (const block of blocks) {
      if (block.has_children) {
        const children = await getBlocksWithChildren(block.id)
        allBlocks.push({ ...block, children } as BlockObjectResponse)
      } else {
        allBlocks.push(block)
      }
    }
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  return allBlocks
}
```

**Rate limit note:** The Notion API allows ~3 requests/second on average. For a small blog (< 20 articles), sequential fetches are fine. For larger sets, add a simple `sleep(340)` between article block fetches during build.

### Pattern 4: Build-Time Image Download

**What:** Before `next build`, download all Notion-hosted image URLs to `/public/notion-images/`.
**When to use:** Any block or property with type `file` (Notion-hosted images expire after 1 hour).
**Example:**
```typescript
// src/scripts/download-notion-images.ts
import fs from 'fs'
import path from 'path'

export async function downloadNotionImage(notionUrl: string, filename: string): Promise<string> {
  const destDir = path.join(process.cwd(), 'public', 'notion-images')
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })

  const destPath = path.join(destDir, filename)
  const response = await fetch(notionUrl)
  const buffer = Buffer.from(await response.arrayBuffer())
  fs.writeFileSync(destPath, buffer)

  return `/notion-images/${filename}` // local URL for Next.js
}
```

Call this from within `getAllPosts()` / `getPostBySlug()` for each image URL encountered.

**Filename strategy:** Use the Notion block ID as the filename base to ensure stable, unique names:
```
notion-images/{blockId}.{ext}
```

### Pattern 5: Rich Text Renderer

**What:** Convert Notion `rich_text` arrays to React spans with inline formatting.
**When to use:** Every block type that contains text content (paragraph, headings, callout, list items).
**Example:**
```typescript
// Source: https://developers.notion.com/reference/rich-text
import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'

function renderRichText(richText: RichTextItemResponse[]): React.ReactNode {
  return richText.map((item, i) => {
    const { bold, italic, code, strikethrough, underline } = item.annotations
    const text = item.plain_text
    const href = item.href

    let node: React.ReactNode = text
    if (code) node = <code key={i} className="font-mono text-sm bg-surface-raised px-1 rounded">{text}</code>
    else {
      const classes = [
        bold ? 'font-semibold' : '',
        italic ? 'italic' : '',
        strikethrough ? 'line-through' : '',
        underline ? 'underline' : '',
      ].filter(Boolean).join(' ')
      node = classes ? <span key={i} className={classes}>{text}</span> : text
    }

    if (href) return <a key={i} href={href} className="text-accent underline hover:text-accent-hover" target="_blank" rel="noopener noreferrer">{node}</a>
    return node
  })
}
```

### Pattern 6: Reading Progress Bar (Client Component)

**What:** A fixed `2px` bar at `top-0` tracking `scrollY` as a percentage of total document height.
**When to use:** Article detail page only (`/blog/[slug]`).
**Example:**
```typescript
// Source: https://www.theopinionateddev.com/blog/build-a-reading-progress-bar-with-next-js-and-tailwind
'use client'
import { useEffect, useState } from 'react'

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 h-[2px] bg-accent z-50 transition-none"
      style={{ width: `${progress}%` }}
    />
  )
}
```

**Note:** Use `{ passive: true }` on the scroll listener for performance. This component is `'use client'` and must be imported into the article page as a leaf client component — the article page itself can remain a server component.

### Pattern 7: GitHub Actions Cron Rebuild (Free-Plan Fallback)

**What:** Scheduled GitHub Actions workflow that POSTs to Netlify Build Hook daily.
**When to use:** When Notion plan is Free (no webhook automation access).
**Example:**
```yaml
# .github/workflows/scheduled-rebuild.yml
name: Scheduled Notion Rebuild
on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 06:00 UTC
  workflow_dispatch:        # Manual trigger button in GitHub UI
jobs:
  rebuild:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Netlify build hook
        run: curl -s -X POST "https://api.netlify.com/build_hooks/${TOKEN}"
        env:
          TOKEN: ${{ secrets.NETLIFY_BUILD_HOOK_TOKEN }}
```

Store only the token portion after the last `/` of the Netlify hook URL as `NETLIFY_BUILD_HOOK_TOKEN` in GitHub Secrets.

### Anti-Patterns to Avoid

- **Fetching Notion API at request time:** `output: 'export'` means no server runtime — all API calls must be in `generateStaticParams`, `generateMetadata`, and RSC `async` functions called at build time only.
- **Storing Notion image URLs directly in BlogPost.image:** The URL expires after 1 hour. Always download and store a local path.
- **Using `@notionhq/client@^5.x` without migration:** v5 requires `dataSources.query` + `data_source_id` instead of `databases.query` + `database_id`. Do not blindly `npm install @notionhq/client` without pinning to `^2.2.3`.
- **Using `'use client'` on the article page:** Only the `ReadingProgressBar` component needs to be a client component — the `[slug]/page.tsx` server component should remain a server component for correct SSG behavior.
- **Importing Notion client in client components:** The `NOTION_TOKEN` env var is server-only. Never import `src/lib/notion.ts` or `src/lib/blog.ts` from any `'use client'` component.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Notion API pagination | Manual cursor loop from scratch | `notion.databases.query` with `has_more` / `start_cursor` loop — or `collectPaginatedAPI` helper | Cursor edge cases (null cursor, single page response) are already handled |
| TypeScript types for Notion responses | Custom interface guessing | Import `BlockObjectResponse`, `PageObjectResponse`, `RichTextItemResponse` from `@notionhq/client/build/src/api-endpoints` | Notion's types are auto-generated from the API spec — they are always correct |
| Rate limiting | Custom delay/queue logic | SDK has built-in retry on 429 responses; add manual `sleep(350)` only if bulk-fetching > 50 articles | SDK retry handles occasional bursts automatically |
| Image URL stability | Complex proxy or CDN setup | Download to `/public/notion-images/` at build time | Simplest approach that works with `output: 'export'`; no infra cost |
| Reading time calculation | Complex NLP library | `Math.ceil(plainTextWordCount / 200)` — 200 words/minute is the standard estimate for technical reading | No library needed; accuracy is sufficient for a display label |

**Key insight:** The Notion client SDK handles retries, rate limits, and TypeScript types. The only thing that must be custom-built is the mapping layer from Notion API responses to the internal `BlogPost` type.

---

## Common Pitfalls

### Pitfall 1: Notion Image URL Expiry

**What goes wrong:** A blog post with a cover image or inline `image` block works at build time. One hour later, the images return 403 / broken image icons. Visitors see broken images indefinitely until the next rebuild.

**Why it happens:** Notion-hosted file URLs (type `file`) include an `expiry_time` field and are valid for exactly 1 hour from when the API response was fetched. The URL changes on every API fetch — it is not a stable CDN URL.

**How to avoid:** In the data layer, detect `file.type === 'file'` (vs `file.type === 'external'`), download the image to `/public/notion-images/{blockId}.{ext}`, and store the local `/notion-images/...` path in the `BlogPost` type. External Notion images (`type: 'external'`) never expire and can be used as-is.

**Warning signs:** Images work right after deploy but are broken an hour later.

### Pitfall 2: SDK Version v5.x Breaking API

**What goes wrong:** `npm install @notionhq/client` installs v5.x which has no `notion.databases.query()`. The entire data layer breaks at build time with `TypeError: notion.databases.query is not a function`.

**Why it happens:** v5.0.0 (released September 2025) replaced `databases.query({ database_id })` with `dataSources.query({ data_source_id })` as part of Notion's multi-source database feature. The npm latest tag now points to v5.x.

**How to avoid:** Pin the dependency explicitly: `npm install @notionhq/client@^2.2.3`. The v2.x API continues to work for single-source databases (confirmed by Notion official FAQ).

**Warning signs:** Build error on the first run after installing the client without a version pin.

### Pitfall 3: Missing `has_children` Recursion for Toggle Blocks

**What goes wrong:** Toggle blocks appear empty (summary shows, content is missing). Callout blocks that contain child paragraphs also render empty.

**Why it happens:** `blocks.children.list` returns only direct children. Blocks with `has_children: true` require a recursive call. The API intentionally does not nest children in the initial response.

**How to avoid:** In `getBlocksWithChildren`, always check `block.has_children` and recursively fetch — storing the result as a `children` array on the block object.

**Warning signs:** Toggle components render with a summary but no body content; callout blocks have an emoji/icon but no text.

### Pitfall 4: Client Component Leaking Server Secrets

**What goes wrong:** If `src/lib/blog.ts` or `src/lib/notion.ts` is imported (directly or transitively) by a `'use client'` component, Next.js bundles `process.env.NOTION_TOKEN` into the client JavaScript. The secret leaks to the browser.

**Why it happens:** Client components have their module graph bundled for the browser. Any server-only code in that graph leaks.

**How to avoid:** `ReadingProgressBar` must never import from `src/lib/blog.ts`. The article page (`[slug]/page.tsx`) remains a server component that passes only serializable props (primitives, plain objects) to the `ReadingProgressBar` client component. Add `import 'server-only'` to `src/lib/notion.ts` to get a build-time error if the module is accidentally imported by a client component.

**Warning signs:** Next.js build warning about `NOTION_TOKEN` in client bundle; or `process.env.NOTION_TOKEN` visible in browser devtools network tab.

### Pitfall 5: Rich Text Array vs Plain Text Confusion

**What goes wrong:** Paragraph blocks render as `[object Object]` or display the raw `plain_text` but lose all inline formatting (bold, links, code).

**Why it happens:** Notion block content is NOT a single string. It is an array of `RichTextItemResponse` objects with annotations. `block.paragraph.rich_text[0].plain_text` gives you the text but loses all formatting. You must iterate the array and apply annotations.

**How to avoid:** Use the `renderRichText` helper for every block type that contains text. Never access `.plain_text` directly for rendering.

**Warning signs:** Text renders correctly but all bold/italic/links are missing.

### Pitfall 6: Notion API `has_more` Pagination Ignored

**What goes wrong:** Only the first 100 posts appear in the blog list. Older posts are silently missing.

**Why it happens:** `databases.query` returns at most 100 results per call. The response includes `has_more: true` and `next_cursor` when more pages exist. If these are ignored, only the first page is returned.

**How to avoid:** Use the cursor loop pattern shown in Pattern 2. This project currently has 2 posts, so pagination won't trigger — but the correct implementation handles it from day one.

---

## Code Examples

### Notion Database Property Structure (Recommended Schema)

```typescript
// Recommended Notion Blog database properties:
// - Title (title type) — the page title, used as article title
// - Slug (rich_text type) — URL-safe slug, e.g. "technical-director-people-person-show"
// - Status (select type) — "Draft" | "Published"
// - Date (date type) — publication date
// - Excerpt (rich_text type) — one-line description for list view
// - Cover (files type) — cover image (optional); download at build time if type === 'file'
// - ExternalLink (url type) — optional CTA link (maps to post.link.url)
// - ExternalLinkLabel (rich_text type) — optional CTA label (maps to post.link.label)
```

### Mapping Notion Page Properties to BlogPost Type

```typescript
// Source: https://developers.notion.com/reference/property-value-object
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

function mapNotionPageToBlogPost(page: PageObjectResponse): Omit<BlogPost, 'content'> {
  const props = page.properties

  const title = props['Title'].type === 'title'
    ? props['Title'].title.map(r => r.plain_text).join('')
    : ''

  const slug = props['Slug'].type === 'rich_text'
    ? props['Slug'].rich_text.map(r => r.plain_text).join('')
    : page.id

  const date = props['Date'].type === 'date'
    ? props['Date'].date?.start ?? ''
    : ''

  const excerpt = props['Excerpt'].type === 'rich_text'
    ? props['Excerpt'].rich_text.map(r => r.plain_text).join('')
    : ''

  // Cover: download if type === 'file', use directly if type === 'external'
  const coverProp = props['Cover']
  let image: string | undefined
  if (coverProp.type === 'files' && coverProp.files.length > 0) {
    const file = coverProp.files[0]
    image = file.type === 'external' ? file.external.url : undefined // 'file' URLs handled separately
  }

  return { slug, title, date, excerpt, image }
}
```

### Extended BlogBlock Type for NOTI-02

```typescript
// src/lib/blog-types.ts — extended union for full block set
export type BlogBlock =
  | { type: 'paragraph'; richText: RichTextItem[] }
  | { type: 'heading_1'; richText: RichTextItem[] }
  | { type: 'heading_2'; richText: RichTextItem[] }
  | { type: 'heading_3'; richText: RichTextItem[] }
  | { type: 'code'; richText: RichTextItem[]; language: string }
  | { type: 'callout'; richText: RichTextItem[]; icon?: string }
  | { type: 'bulleted_list_item'; richText: RichTextItem[] }
  | { type: 'numbered_list_item'; richText: RichTextItem[] }
  | { type: 'image'; url: string; caption: RichTextItem[] }
  | { type: 'toggle'; richText: RichTextItem[]; children: BlogBlock[] }
  | { type: 'divider' }

// Note: 'heading' (old 3-type union) is REPLACED — existing TypeScript static content
// will be migrated to Notion, so the old type can be dropped once blog/index.ts is removed.
```

### Notion Webhook Action (Paid Plan)

Configure in Notion UI — no code needed:
1. Open the Blog database
2. Click "Automate" → "New automation"
3. Trigger: "Property is edited" → Status = "Published"
4. Action: "Send webhook" → POST to Netlify Build Hook URL (full URL, not split)

The webhook action sends a POST request. Netlify Build Hook URLs accept any POST — no body or auth header required.

### GitHub Actions Cron (Free Plan Fallback)

```yaml
# .github/workflows/scheduled-rebuild.yml
name: Scheduled Notion Rebuild
on:
  schedule:
    - cron: '0 6 * * *'   # 06:00 UTC daily
  workflow_dispatch:
jobs:
  rebuild:
    runs-on: ubuntu-latest
    steps:
      - name: POST to Netlify Build Hook
        run: curl -s -X POST "https://api.netlify.com/build_hooks/${TOKEN}"
        env:
          TOKEN: ${{ secrets.NETLIFY_BUILD_HOOK_TOKEN }}
```

Store only the hook token (the alphanumeric ID after the last `/` in the Netlify hook URL) as the GitHub secret `NETLIFY_BUILD_HOOK_TOKEN`.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `notion.databases.query({ database_id })` | `notion.dataSources.query({ data_source_id })` in v5.x | Sep 2025 (v5.0.0) | **Breaking** — pin to v2.x for this project |
| ISR-based Notion blog (e.g. `revalidate: 60`) | Full rebuild only (compatible with `output: 'export'`) | Project constraint | No ISR available on Netlify static export |
| `framer-motion` useScroll for progress bar | Native scroll listener with `useState` / `useEffect` | N/A | `motion` is already installed — either approach works; native is lighter |

**Deprecated / outdated in tutorials:**
- Many blog tutorials use `notionhq/client v2.2.x` with `databases.query` — this is the **correct** version for this project, not "outdated"
- ISR-based Notion blogs (Vercel-specific) do not apply here — static export only

---

## Open Questions

1. **Notion plan tier** (NOTI-05 blocker)
   - What we know: Webhook automation requires Notion Plus or higher; free plan users cannot create webhook automation actions
   - What's unclear: Which plan the workspace is currently on
   - Recommendation: Implement both code paths (webhook is a UI-only config step, no code change; cron YAML is committed regardless) — determine which to activate once plan tier is confirmed. The cron fallback is zero-cost and safe to ship regardless.

2. **Blog article cover image source**
   - What we know: `people-person-show.ts` uses an external URL (`https://www.fabfabfabfabfab.com/...`). External URLs never expire and can be used as-is in Notion (add as `External` file link, not upload).
   - What's unclear: Whether the ElevenApps post has an image to migrate
   - Recommendation: Recreate both posts in Notion using external image URLs where possible to avoid the download complication for the migration task.

3. **`@notionhq/client` v5.x safety long-term**
   - What we know: v2.x works for single-source databases per official FAQ; "no process for halting support of old API versions" currently
   - What's unclear: Long-term deprecation timeline
   - Recommendation: Pin v2.x for Phase 2; schedule a v5 migration after Phase 3 as a standalone task with no functional risk.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — no `jest.config.*`, `vitest.config.*`, or test files outside `node_modules` |
| Config file | None — Wave 0 must create |
| Quick run command | `npx vitest run --reporter=verbose` (after Wave 0 setup) |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| NOTI-01 | `getAllPosts()` returns array of mapped posts; image URLs are local `/notion-images/` paths (not Notion URLs) | unit (mock Notion client) | `npx vitest run src/lib/blog.test.ts` | ❌ Wave 0 |
| NOTI-01 | Pagination: cursor loop fetches all pages when `has_more: true` | unit (mock) | `npx vitest run src/lib/blog.test.ts` | ❌ Wave 0 |
| NOTI-02 | `renderBlock` returns correct JSX for each of 9 block types | unit | `npx vitest run src/components/blog/NotionBlock.test.tsx` | ❌ Wave 0 |
| NOTI-03 | Unknown block type renders `null` without throwing | unit | `npx vitest run src/components/blog/NotionBlock.test.tsx` | ❌ Wave 0 |
| NOTI-04 | `mapNotionPageToBlogPost` extracts slug, title, date, excerpt correctly from mock page | unit | `npx vitest run src/lib/blog.test.ts` | ❌ Wave 0 |
| NOTI-05 | GitHub Actions YAML syntax valid; webhook URL env var referenced correctly | manual-only | `act -n` (dry-run) or GitHub CI | ❌ Wave 0 |
| BLOG-01 | Both existing slugs are present in Notion DB and returned by `getAllPosts()` | manual (Notion content) | N/A — content migration, not code | — |
| BLOG-02 | `/blog/elevenapps-immersive-show-swift` and `/blog/technical-director-people-person-show` resolve in built output | smoke (build output check) | `ls out/blog/` after `next build` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npx vitest run src/lib/blog.test.ts` (unit tests for data layer)
- **Per wave merge:** `npx vitest run` (full suite) + `next build` (build smoke test)
- **Phase gate:** `next build` green + both slug directories present in `out/blog/` before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `src/lib/blog.test.ts` — covers NOTI-01, NOTI-04; mocks `@notionhq/client`
- [ ] `src/components/blog/NotionBlock.test.tsx` — covers NOTI-02, NOTI-03
- [ ] `vitest.config.ts` + `@vitejs/plugin-react` — no test runner present
- [ ] Wave 0 install: `npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom`

*(If no test framework is deemed necessary: `/gsd:verify-work` will rely on `next build` succeeding and manual smoke test of the two slug URLs in the built output.)*

---

## Sources

### Primary (HIGH confidence)

- `@notionhq/client` — npm package, versions, SDK usage — [npmjs.com](https://www.npmjs.com/package/@notionhq/client) + [github.com/makenotion/notion-sdk-js](https://github.com/makenotion/notion-sdk-js)
- Notion API file objects + expiry — [developers.notion.com/reference/file-object](https://developers.notion.com/reference/file-object) (fetched directly)
- Notion API property value types — [developers.notion.com/reference/property-value-object](https://developers.notion.com/reference/property-value-object) (fetched directly)
- Notion API block children — [developers.notion.com/reference/get-block-children](https://developers.notion.com/reference/get-block-children)
- Notion webhook actions (plan requirements) — [notion.com/help/webhook-actions](https://www.notion.com/help/webhook-actions)
- Notion v5.x upgrade FAQ — [developers.notion.com/docs/upgrade-faqs-2025-09-03](https://developers.notion.com/docs/upgrade-faqs-2025-09-03) (fetched directly)
- Netlify Build Hooks — [docs.netlify.com/build/configure-builds/build-hooks](https://docs.netlify.com/build/configure-builds/build-hooks/)

### Secondary (MEDIUM confidence)

- Reading progress bar implementation — [theopinionateddev.com](https://www.theopinionateddev.com/blog/build-a-reading-progress-bar-with-next-js-and-tailwind) (verified against React docs patterns)
- GitHub Actions cron → Netlify — [typeofnan.dev](https://typeofnan.dev/scheduling-recurring-netlify-builds-using-github-actions/) + [thibaultmilan.com](https://thibaultmilan.com/blog/2025/06/22/automate-netlify-rebuilds-using-github-actions/) (multiple consistent sources)
- Notion image expiry workarounds — [snugl.dev](https://snugl.dev/archive/fixing-notions-1-hour-expiring-image-problem), [guillermodlpa.com](https://guillermodlpa.com/blog/how-to-render-images-from-the-notion-api-with-next-js-image-optimization) (consistent with official file object docs)
- `databases.query` v2.x confirmed working for single-source — [developers.notion.com upgrade FAQ](https://developers.notion.com/docs/upgrade-faqs-2025-09-03)

### Tertiary (LOW confidence)

- v5.x `dataSources.query` exact API surface — confirmed by official upgrade guide but not tested in this project context; treat v2.x as authoritative for implementation

---

## Metadata

**Confidence breakdown:**
- Standard stack (v2.x SDK, core patterns): HIGH — confirmed by official Notion docs and FAQ
- Architecture (image download, pagination, block rendering): HIGH — confirmed by multiple official sources + community patterns
- Pitfalls (image expiry, v5 breaking change, client secret leak): HIGH — confirmed by official docs
- Webhook plan tier requirement: HIGH — confirmed by official Notion help docs
- GitHub Actions cron YAML: MEDIUM — multiple consistent blog posts, standard GitHub Actions pattern

**Research date:** 2026-03-16
**Valid until:** 2026-06-16 (90 days — Notion SDK API surface is stable; re-check before v5 migration)
